// 벤딩머신 메뉴
const menu = [
  {
    // id: "origianlCola",
    name: "Original_Cola",
    image: "img/콜라.svg",
    price: 1000,
    stock: 10,
  },
  {
    // id: "violetCola",
    name: "Violet_Cola",
    image: "img/콜라-2.svg",
    price: 1000,
    stock: 10,
  },
  {
    // id: "yellowCola",
    name: "Yellow_Cola",
    image: "img/콜라-4.svg",
    price: 1000,
    stock: 10,
  },
  {
    // id: "coolCola",
    name: "Cool_Cola",
    image: "img/콜라-1.svg",
    price: 1000,
    stock: 10,
  },
  {
    // id: "greenCola",
    name: "Green_Cola",
    image: "img/콜라-3.svg",
    price: 1000,
    stock: 10,
  },
  {
    // id: "orangeCola",
    name: "Orange_Cola",
    image: "img/콜라-5.svg",
    price: 1000,
    stock: 10,
  },
];
const selectMenu = [
  {
    // id: "violetCola",
    name: "Violet_Cola",
    image: "img/콜라-2.svg",
    price: 1000,
    stock: 10,
  },
];

showMenuList();

function showMenuList() {
  menu.forEach((item) => {
    const machineMenu = document.getElementById("machineMenu");
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.className = "menu-item";
    if (!item.stock) {
      button.className = "soldout";
      button.disabled = true;
    }
    button.id = item.id;
    button.addEventListener("click", () => selectMenuHandler(item, button));

    const itemImg = document.createElement("img");
    itemImg.src = item.image;
    itemImg.className = "item-img";

    const itemName = document.createElement("span");
    itemName.textContent = item.name;
    itemName.className = "item-name";

    const itemPrice = document.createElement("span");
    itemPrice.textContent = item.price + "원";
    itemPrice.className = "item-price";

    button.appendChild(itemImg);
    button.appendChild(itemName);
    button.appendChild(itemPrice);
    li.appendChild(button);
    machineMenu.appendChild(li);
  });
}

function selectMenuHandler(item, btn) {
  const foundMenu = selectMenu.find(
    (selectedMenu) => selectedMenu.name === item.name
  );
  console.log(foundMenu);
  foundMenu ? foundMenu.stock++ : selectMenu.push({ ...item, stock: 1 });

  item.stock -= 1;

  console.log(menu, selectMenu);
  // 여기에 갯수 0되면 soldout 걸리고 리렌더링되는거 추가

  if (!item.stock) {
    btn.disabled = true;
    btn.classList.add("soldout");
  }
  showCartList();
}

// 선택한 메뉴

const menuRemoveButton = document.querySelectorAll("#selectMenu button");

console.log(menuRemoveButton);
menuRemoveButton.forEach((button) => {
  console.log(button.parentNode);
  // button.addEventListener("click", (event) => console.log(event));
});

function showCartList() {
  selectMenu.forEach((item) => {
    const selectMenuList = document.getElementById("selectMenu");
    const li = document.createElement("li");

    const itemImg = document.createElement("img");
    itemImg.src = item.image;
    itemImg.className = "menu-list-img";

    const itemName = document.createElement("span");
    itemName.textContent = item.name;
    itemName.className = "menu-list-name";

    const itemStock = document.createElement("button");
    itemStock.textContent = item.stock;
    itemStock.className = "menu-list-button";

    li.appendChild(itemImg);
    li.appendChild(itemName);
    li.appendChild(itemStock);
    selectMenuList.appendChild(li);
  });
}
showCartList();

// 표시하는걸 함수로 해서 마지막에만 바꾸게

// 1. 소지금 내에서 입금하기
const depositInput = document.getElementById("depositInput");
const depositButton = document.getElementById("depositButton");
const balanceText = document.getElementById("balance");
const moneyText = document.getElementById("money");

let money = 50000;
moneyText.innerText = money + " 원";
let balance = 0;
balanceText.innerText = balance + " 원";

depositInput.addEventListener("input", () => depositInputChangeHandler());
depositButton.addEventListener("click", () => depositBtnClickHandler());

function depositInputChangeHandler() {
  if (depositInput.value > money) {
    depositInput.value = money;
  }
}

function depositBtnClickHandler() {
  balance += +depositInput.value;
  money -= +depositInput.value;
  balanceText.innerText = balance + " 원";
  moneyText.innerText = money + " 원";
  depositInput.value = null;
}

// 2. 입금한 돈으로 아이템 구매하기

function itemClickHandler(event) {
  const itemId = event.target;
  console.log(itemId);
}

// 3. 구매하고 남은 돈 거슬러받기
const changeButton = document.getElementById("changeButton");

changeButton.addEventListener("click", () => changeButtonClickHandler());

function changeButtonClickHandler() {
  money += balance;
  balance = 0;
  balanceText.innerText = balance + " 원";
  moneyText.innerText = money + " 원";
  console.log(money);
}

// 4. 선택, 획득한 아이템 목록 표시하기

// 5. 재고에 따라 메뉴버튼 사용 가능 여부 변경하기

// 6. 한번으로 끝나지 않는 프로그램 만들기

// 7. 최초 소지금, 상품 추가, 재고 관리 쉽게 하기

// 8. 여러 상황에 따라 유효성 확인 및 안내 띄우기
