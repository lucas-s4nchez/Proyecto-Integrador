const btnMenu = document.getElementById("btn-menu");
const menu = document.getElementById("menu");

const menuProfile = document.getElementById("profile-menu");

const profileContainer = document.querySelector("#profile button");
const profileName = document.getElementById("profile-name");

const login = document.getElementById("login");
const signin = document.getElementById("signin");

let users = JSON.parse(localStorage.getItem("users")) || [];

const isLoggedUser = users.find((user) => user.login === true);

export const handleChangeUserViews = () => {
  if (isLoggedUser) {
    showUserProfile();
    setUserAvatar();
  } else {
    hideUserProfile();
  }
};

const hideUserProfile = () => {
  profileContainer.classList.add("hide");

  login?.classList.add("show");
  signin?.classList.add("show");
};

const showUserProfile = () => {
  profileContainer.classList.add("show");
  login?.classList.add("hide");
  signin?.classList.add("hide");
};

const setUserAvatar = () => {
  const avatar = isLoggedUser.name.toString().charAt(0);
  profileName.innerHTML = avatar;
};

export const handleLogoutUser = ({ target }) => {
  if (!target.classList.contains("profile-menu__button")) return;
  const logoutUsers = users.map((item) => {
    return item.name === isLoggedUser.name && item.email === isLoggedUser.email
      ? { ...item, login: false }
      : item;
  });
  saveLocalStorage("users", logoutUsers);
  window.location.reload();
};

export const handleBtnProfile = ({ target }) => {
  if (
    target.matches(".profile-button__button") ||
    target.matches(`${".profile-button__button"} *`)
  ) {
    menuProfile.classList.toggle("profile-menu__active");
  }
};

export const handleBtnMenu = ({ target }) => {
  if (
    target.matches(".hamburger-button") ||
    target.matches(`${".hamburger-button"} *`)
  ) {
    btnMenu.classList.toggle("is-active");
    menu.classList.toggle("nav__active");
  }
};

export const renderProducts = (array, callback) => {
  return array.map(callback).join("");
};

export const createProduct = (product) => {
  const { id, brand, model, version, price, images, on_offer } = product;
  return `
  
    <div class="card">
      <i class="card__icon fa-regular fa-heart"></i>
      <a  href="./product-detail.html?id=${id}">
        <div class="card__img-box">
          <img class="card__img" src="${
            images[0]
          }" alt="imagen de la zapatilla" />
        </div>
        <div class="card__info">
          
            <span class="card__title">
            ${brand} ${model} ${version ? version : ""}
            </span>
          
          ${
            on_offer
              ? `<span class="card__old-price">$${formatPrice(price)}</span>`
              : ""
          }
          <span class="card__price">
          ${
            on_offer
              ? `$${getNewPrice(price, on_offer)} 
          <span class="card__span">${on_offer}% off</span>`
              : `$${formatPrice(price)}`
          }
          </span>
        </div>
      </a>
  </div>
  
  `;
};

export const getNewPrice = (price, discount) => {
  const newPrice =
    parseInt(price) - (parseInt(price) * parseInt(discount)) / 100;
  const formatNewPrice = formatPrice(newPrice);
  return formatNewPrice;
};

export const formatPrice = (price) => {
  const firstTwoDigits = price.toString().split("").slice(0, 2).join("");
  const lastThreeDigits = price.toString().split("").slice(2).join("");
  const formatPrice = `${firstTwoDigits}.${lastThreeDigits}`;
  return formatPrice;
};

export const loadSpinner = () =>
  `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;

export const saveLocalStorage = (key, value) => {
  localStorage.setItem(`${key}`, JSON.stringify(value));
};
