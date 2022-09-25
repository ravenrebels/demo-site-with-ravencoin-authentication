const express = require("express");
const session = require("express-session");

const axios = require("axios");
const app = express();
const sess = {
  secret: "keyboard cat",
  cookie: {},
};



const port = process.env.PORT || 80;

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/signin/step1", async function (req, res) {
  //Get an order from Identity Provider
  const authURL = "https://idp.ravenrebels.com/rp/v5.1/sign";

  const message = "Sign in with Ravencoin NFT demo site " + new Date().toISOString();
  const userVisibleData = btoa(message);
  const obj = {
    userVisibleData,
    endUserIp: "127.0.0.1",
  };
  const axiosResponse = await axios.post(authURL, obj);

  console.log("Response identity provider, step 1", axiosResponse.data);
  const orderRef = axiosResponse.data.orderRef;
  req.session.orderRef = orderRef;

  const responseData = axiosResponse.data;
 

  res.send(responseData);
});

 
//Check if user is authenticated or not
app.get("/authenticated", async function (req, res) {


  const dataToUser = {
    authenticated: !!req.session.userInfo,
    orderRef: req.session.orderRef,
  };


  //Only fetch data from Identity Provider if user is not yet authenticated
  if (dataToUser.authenticated === false && dataToUser.orderRef) {

    //Pull status from Identity provider
    const authURL =
      "https://idp.ravenrebels.com/orders/" + dataToUser.orderRef;
    const axiosResponse = await axios.get(authURL);

    dataToUser.data = axiosResponse.data;
    dataToUser.hintCode = dataToUser.data.hintCode;

    //If authentication order is complete, update the user session
    if (dataToUser.data.status === "complete") {
      dataToUser.authenticated = true;
      console.log("From Identity provider got", dataToUser.data);
      req.session.userInfo = dataToUser.data;
    }
  }

  if (dataToUser.authenticated) {
    dataToUser.authenticated = true;
    dataToUser.nft = req.session.userInfo.userResponse.nft;

    if (req.session.userInfo.meta) { //Does meta data exist?
      dataToUser.ipfs = req.session.userInfo.meta.ipfs;
    }
  } 

  res.send(dataToUser);
});

app.get("/session", function (req, res) {
  res.send(req.session);
});
app.get("/signout", async function (req, res) {
  req.session.orderRef = null;
  req.session.userInfo = null;
  res.send({ success: true });
});
