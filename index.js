/*
주요 기능

UI
자판기 메뉴, 장바구니, 구매한 음료

금액 관리
입금, 거스름돈 반환, 음료수 구매

음료 버튼
자판기 메뉴 > 장바구니, 장바구니 > 자판기, 장바구니 > 구매한 음료
*/

// 벤딩머신 메뉴
const machineMenu = [
  { name: "Original_Cola", image: "img/콜라.svg", price: 1000, quantity: 10 },
  { name: "Violet_Cola", image: "img/콜라-2.svg", price: 1000, quantity: 10 },
  { name: "Yellow_Cola", image: "img/콜라-4.svg", price: 1000, quantity: 10 },
  { name: "Cool_Cola", image: "img/콜라-1.svg", price: 1000, quantity: 10 },
  { name: "Green_Cola", image: "img/콜라-3.svg", price: 1000, quantity: 10 },
  { name: "Orange_Cola", image: "img/콜라-5.svg", price: 1000, quantity: 10 },
];
const selectMenu = []; // 장바구니
const purchasedMenu = []; // 구매한 음료

// 메뉴 렌더링
function showMenu() {
  machineMenu.forEach((item) => {
    const machineMenu = document.getElementById("machineMenu");
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.id = item.name + "Button";
    button.className = "menu-item";
    button.type = "button";
    button.addEventListener("click", () => selectMenuHandler(item, button)); // 장바구니에 담기

    const div = document.createElement("div"); // 품절을 표시하는 요소
    const soldoutText = document.createElement("div");
    soldoutText.textContent = "품절";
    div.appendChild(soldoutText);
    div.className = "soldout a11y-hidden";
    item.quantity || div.classList.remove("a11y-hidden"); // 품절 처리

    const itemImg = document.createElement("img");
    itemImg.src = item.image;
    itemImg.className = "item-img";

    const itemName = document.createElement("span");
    itemName.textContent = item.name;
    itemName.className = "item-name";

    const itemPrice = document.createElement("span");
    itemPrice.textContent = item.price + "원";
    itemPrice.className = "item-price";

    button.appendChild(div);
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
    itemStock.type = "button";
    if (listId === "selectMenu") {
      itemStock.addEventListener("click", () => removeCartHandler(item));
    } // 장바구니에 있는 음료의 버튼은 누르면 한 개씩 제거

    li.appendChild(itemImg);
    li.appendChild(itemName);
    li.appendChild(itemStock);
    selectMenuList.appendChild(li);
  });
}

// 장바구니와 획득한 음료 렌더링
showMenuList("selectMenu", selectMenu);
showMenuList("purchasedMenu", purchasedMenu);

/**
 * 메뉴 누르면 장바구니에 추가하는 함수
 * @param {Object} 음료수 객체
 * @param {HTMLButtonElement} 버튼 추가
 */
function selectMenuHandler(item, btn) {
  const foundMenu = selectMenu.find(
    (selectedMenu) => selectedMenu.name === item.name
  );
  // 장바구니에 같은 음료가 있으면 개수 증가, 없으면 개수1로 객체 추가
  foundMenu ? foundMenu.quantity++ : selectMenu.push({ ...item, quantity: 1 });
  item.quantity -= 1; // 자판기 메뉴에서는 감소

  // 음료수 개수가 0이 되면 품절 표시
  if (!item.quantity) {
    btn.disabled = true;
    btn.firstChild.classList.remove("a11y-hidden");
  }
  showMenuList("selectMenu", selectMenu);
}

// 장바구니에서 제거하는 함수
function removeCartHandler(item) {
  item.quantity -= 1;
  const foundMenu = machineMenu.find((sameMenu) => sameMenu.name === item.name);
  foundMenu.quantity += 1;

  // 개수 0 이면 배열에서 삭제
  if (!item.quantity) {
    selectMenu.splice(
      selectMenu.findIndex((v) => v.name === item.name),
      1
    );
  }

  // 장바구니에서 음료를 빼면 품절표시 제거
  if (foundMenu.quantity) {
    const button = document.getElementById(`${foundMenu.name}Button`);
    const soldout = button.firstChild;
    button.disabled = false;
    soldout.classList.add("a11y-hidden");
  }
  showMenuList("selectMenu", selectMenu);
}

// 금액 관리 UI
const depositInput = document.getElementById("depositInput");
const depositButton = document.getElementById("depositButton");
const balanceText = document.getElementById("balance");
const moneyText = document.getElementById("money");
const totalPriceText = document.getElementById("totalPrice");
const changeButton = document.getElementById("changeButton");

let money = 50000;
let balance = 0;
let totalPrice = 0;
moneyText.textContent = money + " 원";
balanceText.textContent = balance + " 원";
totalPriceText.textContent = `총금액 : ${totalPrice} 원`;

// 입금액 유효성 검증
function depositInputChangeHandler() {
  if (depositInput.value > money) {
    depositInput.value = money;
  }
}
depositInput.addEventListener("input", () => depositInputChangeHandler());

// 입금
function depositBtnClickHandler() {
  balance += +depositInput.value;
  money -= +depositInput.value;
  balanceText.textContent = balance + " 원";
  moneyText.textContent = money + " 원";
  depositInput.value = null;
}
depositButton.addEventListener("click", () => depositBtnClickHandler());

// 거스름돈 반환
function changeButtonClickHandler() {
  money += balance;
  balance = 0;
  balanceText.textContent = balance + " 원";
  moneyText.textContent = money + " 원";
}
changeButton.addEventListener("click", () => changeButtonClickHandler());

// 음료 구매 함수
function buyButtonClickHandler() {
  const buyPriceSum = priceSum(selectMenu);

  if (balance >= buyPriceSum) {
    balance -= buyPriceSum;
    balanceText.textContent = balance + " 원";

    // TODO: 여기 좀 이상한듯
    // 선택 이미 구매한 음료는 개수 증가, 없으면 추가
    selectMenu.forEach((selectItem) => {
      const item = purchasedMenu.find(
        (myItem) => myItem.name === selectItem.name
      );
      if (item) {
        item.quantity += selectItem.quantity;
      } else {
        purchasedMenu.push(selectItem);
      }
    });

    // 장바구니 비우기
    selectMenu.length = 0;
    showMenuList("selectMenu", selectMenu);
    showMenuList("purchasedMenu", purchasedMenu);

    // 총금액 계산
    totalPrice = priceSum(purchasedMenu);
    totalPriceText.textContent = `총금액 : ${totalPrice} 원`;
  } else {
    alert("잔액 부족");
  }
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
