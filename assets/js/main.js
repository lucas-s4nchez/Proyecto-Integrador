//Menu hamburguesa
const btnMenu = document.getElementById("btn-menu");
const menu = document.getElementById("menu");
//Boton de perfil
const menuProfile = document.getElementById("profile-menu");
const profileContainer = document.querySelector("#profile button");
const profileName = document.getElementById("profile-name");
//Carrito
const cartContainer = document.getElementById("cart");
const productsCartContainer = document.querySelector(".cart__main");
//Links de iniciar sesion y registrarse
const login = document.getElementById("login");
const signin = document.getElementById("signin");
//usuarios del localstorage
let users = JSON.parse(localStorage.getItem("users")) || [];
//si un usuario esta logueado
const isLoggedUser = users.find((user) => user.login === true);

//Funciones del carrito

export const handleCartButton = ({ target }) => {
  if (
    target.matches(".cart-open") ||
    target.matches(`${".cart-open"} *`) ||
    target.matches(".cart-close") ||
    target.matches(`${".cart-close"} *`)
  ) {
    cartContainer.classList.toggle("cart__active");
  }
};
export const renderCartProduct = (cartProduct) => {
  const { id, img, price, name, discount, color, size, quantity } = cartProduct;
  return `    
      <div class="cart-item">
          <div class="cart-item__main">
            <img
              class="cart-item__img"
              src="${img}"
              alt="${name}"/>
            <div class="cart-item__info">
              <p class="cart-item__name">${name}</p>
              <p class="cart-item__size">Talle: ${size}</p>
              ${
                discount !== "null"
                  ? `<span class="cart-item__discount">${discount}% OFF</span>`
                  : ""
              }
              <p class="cart-item__price">${numberFormat(price)}</p>
            </div>
          </div>
          <div class="cart-item__footer">
            <button class="cart-item__button down" data-id="${id}" data-size="${size}">-</button>
            <span class="cart-item__quantity">${quantity}</span>
            <button class="cart-item__button up" data-id="${id}" data-size="${size}">+</button>
          </div>
        </div>
        `;
};
export const renderCart = (user) => {
  // si el carrito esta vacio muestra un msg
  if (!user?.cart.length) {
    productsCartContainer.innerHTML = `<p class="empty-msg"> No hay productos en el carrito. </p>`;
    return;
  }
  // renderiza los productos que hay
  productsCartContainer.innerHTML = user.cart.map(renderCartProduct).join("");
};

//Mostrar/oculatar avatar de perfil
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
              ? `<span class="card__old-price">${numberFormat(price)}</span>`
              : ""
          }
          <span class="card__price">
          ${
            on_offer
              ? `${numberFormat(getNewPrice(price, on_offer))} 
          <span class="card__span">${on_offer}% off</span>`
              : `${numberFormat(price)}`
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
  return newPrice;
};

export const formatPrice = (price) => {
  const firstTwoDigits = price.toString().split("").slice(0, 2).join("");
  const lastThreeDigits = price.toString().split("").slice(2).join("");
  const formatPrice = `${firstTwoDigits}.${lastThreeDigits}`;
  return formatPrice;
};

export const numberFormat = (value) => {
  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });
  return formatter.format(value);
};
export const loadSpinner = () =>
  `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;

export const saveLocalStorage = (key, value) => {
  localStorage.setItem(`${key}`, JSON.stringify(value));
};
