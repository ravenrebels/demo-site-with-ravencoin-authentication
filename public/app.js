//Check authentication status

async function pollStatus() {
  const asdf = await fetch("/authenticated");
  const data = await asdf.json();

  if (data && data.hintCode === "started") {
    document.getElementById("app").innerHTML = "<h2>in progress</h2>";
  }
  if (data.authenticated) {
    authenticated(data);
  }
  console.log(data);
}

anonymous().then((data) => {
  pollStatus();
});

const anonymousInterval = setInterval(pollStatus, 2000);

function authenticated(data) {
  //No need to check authentication status no more
  clearInterval(anonymousInterval);
  const dom = document.getElementById("app");
  dom.innerHTML = ` 
   <h1>Weeee you are athenticated</h1>

    <div class="card glassy">
      <div class="card-body">
          <img id="image" width=200></img>
      </div>
      <div class="card-footer glassy">
        <code id="nft">${data.nft}</code>
      </div>
    </div>
    
    <button id="buttonSignOut">Sign out</button>
    `;
  //Get image
  const p = fetch(
    "https://agile-journey-76489.herokuapp.com/assetmetadata/" +
      encodeURIComponent(data.nft)
  );
  p.then(async (d) => {
    console.log(d);
    const obj = await d.json();
    console.log(obj);
    if (obj && obj.ipfs) {
      const imageURL = "https://gateway.ipfs.io/ipfs/" + obj.ipfs;
      document.getElementById("image").setAttribute("src", imageURL);
    }
  });
  document
    .getElementById("buttonSignOut")
    .addEventListener("click", async function (event) {
      const URL = "/signout";
      await fetch(URL);
      window.location.reload();
    });
}
async function anonymous() {
  const dom = document.getElementById("app");
  dom.innerHTML = ` 

  `;

  const URL = "/signin/step1";

  const asdf = await fetch(URL);
  const data = await asdf.json();
  const signInURL = data.signInURL;
  const orderRef = data.orderRef;

  dom.innerHTML = ` 
  <h1>Members only</h1>
  <div>
      <a target="_blank" class="button" href="${signInURL}">Click to sign in</a>
      </div> 

      <div id="status"></div> 
      `;
}
