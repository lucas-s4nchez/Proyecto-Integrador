/*En este archivo estan las funciones que comparten las tres paginas principales (index,tienda y product-details) */

import { products } from "./data.js";

//Menu hamburguesa
const buttonHamburger = document.getElementById("btn-menu");
const menu = document.getElementById("menu");
//Boton de perfil
const menuProfile = document.getElementById("profile-menu");
const profileContainer = document.querySelector("#profile button");
const profileName = document.getElementById("profile-name");
//Carrito
const buttonCart = document.querySelector(".cart-open");
const cartContainer = document.querySelector(".cart");
const productsCartContainer = document.querySelector(".cart__main");
//Favoritos
const buttonFavs = document.querySelector(".favs-open");
const favsContainer = document.querySelector(".favs");
const productsFavsContainer = document.querySelector(".favs__main");
//Links de iniciar sesion y registrarse
const login = document.getElementById("login");
const signin = document.getElementById("signin");
//usuarios del localstorage
let users = JSON.parse(localStorage.getItem("users")) || [];
//si un usuario esta logueado
const isLoggedUser = users.find((user) => user.login === true);

//manejar los menus desplegables
export const handleCartButton = () => {
  cartContainer.classList.toggle("cart__active");
};
export const handleFavsButton = () => {
  favsContainer.classList.toggle("favs__active");
};
export const handleProfileButton = () => {
  menuProfile.classList.toggle("profile-menu__active");
};
export const handleHamburgerButton = () => {
  buttonHamburger.classList.toggle("is-active");
  menu.classList.toggle("nav__active");
};

//Funciones del carrito
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
            <div class="cart-item__buttons">
              <button class="cart-item__button down" data-id="${id}" data-size="${size}">-</button>
              <span class="cart-item__quantity">${quantity}</span>
              <button class="cart-item__button up" data-id="${id}" data-size="${size}">+</button>
            </div>
            <button class="cart-item__button delete" data-id="${id}" data-size="${size}">Eliminar</button>
          </div>
        </div>
        `;
};
export const renderCart = (user) => {
  if (!user?.cart.length) {
    productsCartContainer.innerHTML = `<p class="empty-msg"> No hay productos en el carrito. </p>`;
    return;
  }
  productsCartContainer.innerHTML = user.cart.map(renderCartProduct).join("");
};

//Funciones de favoritos
export const renderFavProduct = (favProduct) => {
  const { id, images, price, on_offer, brand, model, version } = favProduct;
  return `    
      
        <div class="favs-item">
          <a class="favs-item__link" href="./product-detail.html?id=${id}">
            <div class="favs-item__main">
              <img
                class="favs-item__img"
                src="${images[0]}"
                alt="${brand} ${model} ${version ? version : ""}"/>
              <div class="favs-item__info">
                <p class="favs-item__name">
                ${brand} ${model} ${version ? version : ""}
                </p>
                ${
                  on_offer !== null
                    ? `<span class="favs-item__discount">${on_offer}% OFF</span>`
                    : ""
                }
                <p class="favs-item__price">${numberFormat(price)}</p>
              </div>
            </div>
          </a>
          <div class="favs-item__footer">
              <i class="favs-item__icon fav-icon fa-regular 
              ${
                isExistingFavProduct(favProduct, isLoggedUser) ? "fa-solid" : ""
              } 
              fa-heart" data-id="${id}"></i>
          </div>
        </div>
        `;
};
export const renderFavs = (user) => {
  if (!user?.favs.length) {
    productsFavsContainer.innerHTML = `<p class="empty-msg"> No guardaste productos favoritos.  </p>`;
    return;
  }
  productsFavsContainer.innerHTML = user.favs.map(renderFavProduct).join("");
};
export const addEventToIconFavs = (user) => {
  const iconsFavs = document.querySelectorAll(".fav-icon");
  iconsFavs.forEach((icon) =>
    icon.addEventListener("click", (e) => {
      addToFavs(e, user);
    })
  );
};
export const addToFavs = ({ target }, user) => {
  if (!user) {
    alert("primero inicia sesion");
    return;
  }
  const { id } = target.dataset;
  const product = products.find((product) => product.id === parseInt(id));
  if (!isExistingFavProduct(product, user)) {
    addProductToFavs(product, user);
    alert("El producto se agregó a favoritos");
  } else {
    removeProductOfFavs(product, user);
    alert("El producto se ha eliminado de favoritos");
  }
  const favsUser = users.map((item) =>
    item.id === user.id ? { ...user } : item
  );
  checkFavsState(user, favsUser);
};
export const isExistingFavProduct = (product, user) => {
  return user?.favs.find((itemFav) => itemFav.id === product.id);
};
const addProductToFavs = (product, user) => {
  user.favs = [...user.favs, product];
};
const removeProductOfFavs = (product, user) => {
  const result = user.favs.filter((p) => p.id !== product.id);
  user.favs = result;
  const newUsers = users.map((item) => (item.login ? user : item));
  checkFavsState(user, newUsers);
};
const checkFavsState = (user, array) => {
  renderFavs(user);
  saveLocalStorage("users", array);
  window.location.reload();
};

//Mostrar/ocultar componentes dependiendo de si el usario inicio sesion o no
export const handleChangeUserViews = () => {
  if (isLoggedUser) {
    isLoginUser();
    setUserAvatar();
  } else {
    isLogoutUser();
  }
};
const isLogoutUser = () => {
  profileContainer.classList.add("hide");
  buttonCart?.classList.add("hide");
  buttonFavs?.classList.add("hide");

  login?.classList.add("show");
  signin?.classList.add("show");
};
const isLoginUser = () => {
  profileContainer.classList.add("show");
  buttonCart?.classList.add("show");
  buttonFavs?.classList.add("show");

  login?.classList.add("hide");
  signin?.classList.add("hide");
};

//El contenido del avatar es la primera letra de su username
const setUserAvatar = () => {
  const avatar = isLoggedUser.name.toString().charAt(0);
  profileName.innerHTML = avatar;
};

//Cerrar sesion
export const handleLogoutUser = ({ target }) => {
  // if (!target.classList.contains("profile-menu__button")) return;
  const logoutUsers = users.map((item) => {
    return item.name === isLoggedUser.name && item.email === isLoggedUser.email
      ? { ...item, login: false }
      : item;
  });
  saveLocalStorage("users", logoutUsers);
  window.location.reload();
};

//renderizar una card (callback), por cada elemento de un array (array)
export const renderProducts = (array, callback) => {
  return array.map(callback).join("");
};
//crear las cards con la info de cada producto (product)
export const createProduct = (product) => {
  const { id, brand, model, version, price, images, on_offer } = product;
  return `
  
    <div class="card">
    
      <i class="card__icon fav-icon fa-regular 
      ${isExistingFavProduct(product, isLoggedUser) ? "fa-solid" : ""} 
      fa-heart" data-id="${id}"></i>
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

//Funciones de utilidad
//obtener el precio aplicando el descuento
export const getNewPrice = (price, discount) => {
  const newPrice =
    parseInt(price) - (parseInt(price) * parseInt(discount)) / 100;
  return newPrice;
};
//Dar formato de moneda a un numero
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
