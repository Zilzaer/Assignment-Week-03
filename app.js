let bitcoins = 0;
let bpc = 1; // Sets the base value of cookies to 0 (need to update to set value matching user's local storage saved value)
let bps = 0; // Value increase the "bitcoins per second" the user gains
let shopItems = [];

window.onload = function () {
  document.getElementById("clickable-coin").onclick = function () {
    bitcoins += bpc;
    document.getElementById("coin-counter").innerHTML = bitcoins;
    document.getElementById("bitcoin-per-second-counter").innerHTML = bps;
  };

  setInterval(function () {
    bitcoins += bps;
    document.getElementById("coin-counter").innerHTML = bitcoins; // Updates total integer count to the DOM taking into account the clicked cookies and the "cps"
    console.log("🍪", bitcoins);
  }, 1000); // 1000 milliseconds == 1 second

  getShopItems();
};

async function getShopItems() {
  let response = await fetch("./assets/store.json"); //fetches the stored items and thier values fromm the store.json
  let shopData = await response.json();

  shopItems = shopData;
  loadPrevious();
  renderShop();
}

function loadPrevious() {
  let bitcoin = localStorage.getItem("bitcoin");
  if (bitcoin) {
    bitcoins = JSON.parse(bitcoin);
  }
  let inventory = localStorage.getItem("inventory");
  if (inventory) {
    shopItems = JSON.parse(inventory);
    renderShop();
  }
  let bitcoinsPerSecond = localStorage.getItem("bitcoinsPerSecond");
  if (bitcoinsPerSecond) {
    bps = JSON.parse(bitcoinsPerSecond);
    renderShop();
  }
}

function renderShop() {
  let shopContainer = document.getElementById("shop");
  shopContainer.innerHTML = "";

  shopItems.forEach((item) => {
    let itemElement = document.createElement("div");
    itemElement.classList.add("shop-item");
    itemElement.innerHTML = `
      <h3 class="item-name">${item.name}</h3><b
      <p class = "shop-text" ><br>Cost: <span class="cost">${calculateCost(
        item
      )}</span> bitcoins</p>
      <p class="shop-text">Amount Owned: <span class="amount">${
        item.amountOwned
      }</span></p>
      <p class="shop-text">Bitcoins per second: <span class="amount">
      ${item.bpsIncrease * item.amountOwned} 
        </span></p>
      <p class="shop-text">Bitcoins per click: <span class="amount">
      ${item.bpcIncrease * item.amountOwned}
      </span></p>
      <button class="buy-button" onclick="buyItem(${item.id})">Buy</button>
    `;
    shopContainer.appendChild(itemElement);
  });
}

function calculateCost(item) {
  return Math.floor(
    item.basecost * Math.pow(item.costMultiplier, item.amountOwned)
  );
}

function buyItem(itemId) {
  let item = shopItems.find((i) => i.id === itemId);
  let itemCost = calculateCost(item);

  if (bitcoins >= itemCost) {
    bitcoins -= itemCost;
    item.amountOwned += 1;
    bps += item.bpsIncrease;
    bpc += item.bpcIncrease;

    renderShop();
    document.getElementById("coin-counter").innerHTML = bitcoins;
  } else {
    alert("You don't have enough bitcoins!");
  }
}
let resetButton = document.getElementById("reset-button"); //clears the users locally saved values effectivley resetting thier game
resetButton.addEventListener("click", function () {
  localStorage.clear();
  bitcoins = 0;
  shopItems = [];
  bps = 0;
  getShopItems();
});

window.addEventListener("beforeunload", function () {
  //saves the users data automatically before the page unloads as the user closes it
  localStorage.setItem("bitcoin", JSON.stringify(bitcoins));
  localStorage.setItem("inventory", JSON.stringify(shopItems));
  localStorage.setItem("bitcoinsPerSecond", JSON.stringify(bps));
});
