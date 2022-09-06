const express = require("express");
const session = require("express-session");

const axios = require("axios");
const app = express();
const sess = {
  secret: "keyboard cat",
  cookie: {},
};

const port = 80;

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

  const message = "Sign in to local example of Ravencoin sign in";
  const userVisibleData = btoa(message);
  const obj = {
    userVisibleData,
    endUserIp: "127.0.0.1",
  };
  const axiosResponse = await axios.post(authURL, obj);

  const orderRef = axiosResponse.data.orderRef;
  req.session.orderRef = orderRef;

  const responseData = axiosResponse.data;
  responseData.signInURL =
    "https://idp.ravenrebels.com/?orderRef=" + orderRef;

  res.send(responseData);
});

app.get("/authenticated", async function (req, res) {
  const obj = {
    authenticated: false,
    orderRef: req.session.orderRef,
  };

  if (req.session.userInfo) {
    obj.authenticated = true;
    obj.nft = req.session.userInfo.userResponse.nft;
  }

  //Check if sign in is on its way
  if (obj.authenticated === false && obj.orderRef) {
    const authURL =
      "https://idp.ravenrebels.com/orders/" + obj.orderRef;
    const axiosResponse = await axios.get(authURL);

    obj.data = axiosResponse.data;
    obj.hintCode = obj.data.hintCode;
    if (obj.data.status === "complete") {
      req.session.userInfo = obj.data;
    }
  }

  res.send(obj);
});

app.get("/session", function (req, res) {
  res.send(req.session);
});
app.get("/signout", async function (req, res) {
  req.session.orderRef = null;
  req.session.userInfo = null;
  res.send({ success: true });
});
