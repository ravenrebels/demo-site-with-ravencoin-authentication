//Check authentication status

async function pollStatus() {
  const asdf = await fetch("/authenticated");
  const data = await asdf.json();

  if(data && data.hintCode === "started"){
    document.getElementById("app").innerHTML = "<h2>in progress</h2>";
  }
  if (data.authenticated) {
    authenticated(data);
  }
}
anonymous();
pollStatus();
const anonymousInterval = setInterval(pollStatus, 2000);

function authenticated(data) {
  //No need to check authentication status no more
  clearInterval(anonymousInterval);

  const dom = document.getElementById("app");
  dom.innerHTML = `

   <h1>Weeee you are athenticated <code id="nft">${data.nft}</code></h1>
    <button id="buttonSignOut">Sign out</button>
    `;

  document
    .getElementById("buttonSignOut")
    .addEventListener("click", async function (event) {
      const URL = "/signout";
      await fetch(URL);
      window.location.reload();
    });
}
function anonymous() {
  const dom = document.getElementById("app");
  dom.innerHTML = `
  <h1>Members only</h1>
  <div>
      <button id="buttonSignIn" class="btn btn-primary">Click to sign in</button>
  </div>
  
  `;

  document
    .getElementById("buttonSignIn")
    .addEventListener("click", async function (event) {
      //Create a sign in request
      //Open a new sign in window.

      const URL = "/signin/step1";

      const asdf = await fetch(URL);
      const data = await asdf.json();
      const signInURL = data.signInURL;
      const orderRef = data.orderRef;

      dom.innerHTML = `
      
      <h2>Sign in on this device</h2>
      To sign in on this device click <a target="_blank" class="button" href="${signInURL}">HERE</a>

      <h2>Sign in on your mobile device</h2>
   
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${signInURL}"/>

      <div id="status"></div>
      
      `;
      //window.open(data.signInURL);
    });
}
