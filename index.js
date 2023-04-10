/*
주요 기능

UI
자판기 메뉴, 장바구니, 획득한 음료

금액 관리
입금, 거스름돈 반환, 음료수 획득

음료 버튼
자판기 메뉴 > 장바구니, 장바구니 > 자판기, 장바구니 > 획득한 음료
*/

// 벤딩머신 메뉴
const menu = [
  { name: "Original_Cola", image: "img/콜라.svg", price: 1000, quantity: 10 },
  { name: "Violet_Cola", image: "img/콜라-2.svg", price: 1000, quantity: 10 },
  { name: "Yellow_Cola", image: "img/콜라-4.svg", price: 1000, quantity: 10 },
  { name: "Cool_Cola", image: "img/콜라-1.svg", price: 1000, quantity: 10 },
  { name: "Green_Cola", image: "img/콜라-3.svg", price: 1000, quantity: 10 },
  { name: "Orange_Cola", image: "img/콜라-5.svg", price: 1000, quantity: 10 },
];
const selectMenu = []; // 장바구니
const myMenu = []; // 획득한 음료

// 메뉴 렌더링
function showMenu() {
  menu.forEach((item) => {
    const machineMenu = document.getElementById("machineMenu");
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.className = "menu-item";
    //품절 처리
    if (!item.quantity) {
      button.className = "soldout";
      button.disabled = true;
    }
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
    machineMenu.appendChild(li); // DOM에 추가
  });
}
showMenu();

/**
 * 음료 리스트를 렌더링하는 함수
 * @param {string} 음료 리스트 id
 * @param {menuArr} 메뉴 리스트 배열
 */
function showMenuList(listId, menuArr) {
  const selectMenuList = document.getElementById(listId);
  //음료 리스트 초기화
  while (selectMenuList.firstChild) {
    selectMenuList.removeChild(selectMenuList.firstChild);
  }
  //음료 리스트 렌더링
  menuArr.forEach((item) => {
    const li = document.createElement("li");

    const itemImg = document.createElement("img");
    itemImg.src = item.image;
    itemImg.className = "menu-list-img";

    const itemName = document.createElement("span");
    itemName.textContent = item.name;
    itemName.className = "menu-list-name";

    const itemStock = document.createElement("button");
    itemStock.textContent = item.quantity;
    itemStock.className = "menu-list-button";
    if (listId === "selectMenu") {
      itemStock.addEventListener("click", () => removeCartHandler(item));
    } // 장바구니에 있는 음료의 버튼은 누르면 한 개씩 제거

    li.appendChild(itemImg);
    li.appendChild(itemName);
    li.appendChild(itemStock);
    selectMenuList.appendChild(li);
  });
}

showMenuList("selectMenu", selectMenu);
showMenuList("purchasedMenu", myMenu);

/**
 * 메뉴 누르면 장바구니에 추가하는 함수
 * @param {Object} 음료수 객체
 * @param {HTMLButtonElement} 버튼 추가
 */
function selectMenuHandler(item, btn) {
  const foundMenu = selectMenu.find(
    (selectedMenu) => selectedMenu.name === item.name
  );
  console.log(foundMenu);
  // 장바구니에 메뉴가 있으면 개수 증가, 없으면 개수1로 객체 추가
  foundMenu ? foundMenu.quantity++ : selectMenu.push({ ...item, quantity: 1 });

  item.quantity -= 1;

  console.log(menu, selectMenu);

  // TODO: 품절처리 부분 따로 함수로 빼야겠다
  if (!item.quantity) {
    btn.disabled = true;
    btn.classList.add("soldout");
  }
  showMenuList("selectMenu", selectMenu);
}

// 장바구니에서 제거하는 함수
function removeCartHandler(item) {
  item.quantity -= 1;
  const foundMenu = menu.find((sameMenu) => sameMenu.name === item.name);
  foundMenu.quantity += 1;

  // 개수 0 이면 배열에서 삭제
  if (!item.quantity) {
    selectMenu.splice(
      selectMenu.findIndex((v) => v.name === item.name),
      1
    );
  }

  showMenuList("selectMenu", selectMenu);
}

// 금액 관리 UI
const depositInput = document.getElementById("depositInput");
const depositButton = document.getElementById("depositButton");
const balanceText = document.getElementById("balance");
const moneyText = document.getElementById("money");
const totalPriceText = document.getElementById("totalPrice");

let money = 50000;
let balance = 0;
let totalPrice = 0;
moneyText.innerText = money + " 원";
balanceText.innerText = balance + " 원";
totalPriceText.innerText = `총금액 : ${totalPrice} 원`;

depositInput.addEventListener("input", () => depositInputChangeHandler());
depositButton.addEventListener("click", () => depositBtnClickHandler());

// 입금액 유효성 검증
function depositInputChangeHandler() {
  if (depositInput.value > money) {
    depositInput.value = money;
  }
}

// 입금
function depositBtnClickHandler() {
  balance += +depositInput.value;
  money -= +depositInput.value;
  balanceText.innerText = balance + " 원";
  moneyText.innerText = money + " 원";
  depositInput.value = null;
}

// 거스름돈 반환
function changeButtonClickHandler() {
  money += balance;
  balance = 0;
  balanceText.innerText = balance + " 원";
  moneyText.innerText = money + " 원";
  console.log(money);
}

const changeButton = document.getElementById("changeButton");
changeButton.addEventListener("click", () => changeButtonClickHandler());

// 음료 구매 함수
function buyButtonClickHandler() {
  const buyPriceSum = priceSum(selectMenu);

  if (balance >= buyPriceSum) {
    balance -= buyPriceSum;
    balanceText.innerText = balance + " 원";

    // TODO: 잔액부족에도 초기화되는 부분 수정해야함, 걍 엉망진창임
    // 선택 이미 구매한 음료는 개수 증가, 없으면 추가
    selectMenu.forEach((selectItem) => {
      console.log(selectItem);
      const item = myMenu.find((myItem) => myItem.id === selectItem.id);
      //find일 필요 없음
      if (item) {
        item.quantity += selectItem.quantity;
      } else {
        myMenu.push(selectItem);
      }
      console.log(menu, selectMenu, myMenu);
    });

    // 장바구니 비우기
    selectMenu.length = 0;
    showMenuList("selectMenu", selectMenu);
    showMenuList("purchasedMenu", myMenu);

    // 총금액 계산
    totalPrice = priceSum(myMenu);
    totalPriceText.innerText = `총금액 : ${totalPrice} 원`;
  } else {
    alert("잔액 부족");
  }
  console.log(balance);
}

/**
 * 배열의 금액 합계
 * @param {Array} 음료수 배열
 * @returns {number} 음료수 금액 합계
 */
function priceSum(menuArr) {
  return menuArr.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
}

const buyButton = document.getElementById("buyButton");
buyButton.addEventListener("click", () => buyButtonClickHandler());
