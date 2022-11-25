import { products } from "./data.js";
import {
  handleChangeUserViews,
  handleLogoutUser,
  getNewPrice,
  handleCartButton,
  saveLocalStorage,
  renderCart,
  numberFormat,
  handleFavsButton,
  renderFavs,
  addEventToIconFavs,
  isExistingFavProduct,
  handleProfileButton,
  handleHamburgerButton,
  showModal,
} from "./main.js";

const buttonFavs = document.querySelector(".favs-open");
const buttonCart = document.querySelector(".cart-open");
const buttonProfile = document.querySelector(".profile-button__button");
const buttonHamburger = document.getElementById("btn-menu");
const buttonLogout = document.querySelector(".profile-menu__button");
const buttonBuy = document.querySelector(".buy");
const buttonDelete = document.querySelector(".delete");

const imageContainer = document.getElementById("img-container");
const imageList = document.querySelectorAll(".gallery__img");
const detailsContainer = document.getElementById("details");
const productInfoContainer = document.querySelector(".product__description");
const productsCartContainer = document.querySelector(".cart__main");
const totalCart = document.querySelector(".cart__total-span");
const arrayImages = [...imageList];
//usuarios del localstorage
let users = JSON.parse(localStorage.getItem("users")) || [];
//si un usuario esta logueado
const userAuth = users.find((user) => user.login === true);

const getIdByQueryParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));
  return productId;
};

const findProduct = (id) => products.find((product) => product.id === id);

const getProductById = () => {
  if (!getIdByQueryParams()) return;
  const id = getIdByQueryParams();
  const product = findProduct(id);
  renderProductData(product);
};

const renderImages = (images) => {
  imageContainer.style.backgroundImage = `url('${images[0]}')`;
  images.forEach((image, index) => {
    arrayImages[index].src = `${image}`;
    arrayImages[index].addEventListener("mouseenter", () => {
      imageContainer.style.backgroundImage = `url('${image}')`;
    });
  });
};
const renderDetails = (product) => {
  const { id, brand, model, version, price, on_offer, colors, sizes, images } =
    product;
  return `
        <div class="details__info">
          <i class="details__icon fav-icon fa-regular
          ${isExistingFavProduct(product, userAuth) ? "fa-solid" : ""} 
          fa-heart" data-id="${id}"></i>
          <span class="details__title">
            ${brand} ${model} ${version ? version : ""}
          </span>
          
          ${
            on_offer
              ? `<span class="details__old-price">${numberFormat(price)}</span>`
              : ""
          }
          <span class="details__price">
          ${
            on_offer
              ? `${numberFormat(getNewPrice(price, on_offer))} 
          <span class="details__offer">${on_offer}% off</span>`
              : `${numberFormat(price)}`
          }
          </span>
          <span class="details__shipping"><i class="fa-solid fa-truck-fast"></i> Envio Gratis</span>
          <span >Color: 
            <span class="details__colors">${colors
              .toString()
              .split(",")
              .join("/")}
              </span>
          </span>
          <span>Talle: 
            <select class="details__sizes" id="sizes" >
              <option value="">  </option>
              ${sizes.map(
                (size) =>
                  `<option class="details__option" value="${size}">${size}</option>`
              )}
            </select>
          </span>
          <div class="details__footer">
            <div class="details__buttons">
              <button class="details__button down"> - </button>
              <span class="details__quantity">${1}</span>
              <button class="details__button up"> + </button>
            </div>
            <button class="details__btn-cart"
              data-id=${id} 
              data-img=${images[0]} 
              data-price=${on_offer ? getNewPrice(price, on_offer) : price} 
              data-discount=${on_offer} 
              data-color=${colors.toString().split(",").join("/")} 
              id="btn-cart">
              Añadir al carrito</i>
            </button>
          </div>
          
          </div>
          
        </div>
        `;
};
const renderInfoProduct = (product) => {
  const { style, exterior, sole, adjustment } = product;
  return `
    <h3 class="product__heading">Caracteristicas del producto</h3>
    <div class="product__features">
      <div class="product__item">
        <div class="product__img-contain">
          <img src="./assets/img/style.svg" alt="Icono" />
        </div>
        <div class="product__text">
          <p class="product__p">
            <span >Estilo: </span>
            <span class="product__span">${style}</span>
          </p>
        </div>
      </div>
      <div class="product__item">
        <div class="product__img-contain">
          <img src="./assets/img/exterior_materials.svg" alt="Icono" />
        </div>
        <div class="product__text">
          <p class="product__p">
            <span >Materiales del exterior: </span>
            <span class="product__span">${exterior}</span>
          </p>
        </div>
      </div>
      <div class="product__item">
        <div class="product__img-contain">
          <img src="./assets/img/outsole_materials.svg" alt="Icono" />
        </div>
        <div class="product__text">
          <p class="product__p">
            <span >Materiales de la suela: </span>
            <span class="product__span">${sole}</span>
          </p>
        </div>
      </div>
      <div class="product__item">
        <div class="product__img-contain">
          <img src="./assets/img/adjustment_type.svg" alt="Icono" />
        </div>
        <div class="product__text">
          <p class="product__p">
            <span >Tipo de ajuste: </span>
            <span class="product__span">${adjustment}</span>
          </p>
        </div>
      </div>
    </div>
  `;
};

const handleButtonsQuantity = () => {
  const buttonDown = document.querySelector(".down");
  const buttonUp = document.querySelector(".up");
  const quantity = document.querySelector(".details__quantity");
  buttonDown?.addEventListener("click", () => {
    let newQuantity = parseInt(quantity.textContent);
    if (newQuantity <= 1) return;
    newQuantity = newQuantity - 1;
    quantity.textContent = newQuantity;
  });
  buttonUp?.addEventListener("click", () => {
    let newQuantity = parseInt(quantity.textContent);
    newQuantity = newQuantity + 1;
    quantity.textContent = newQuantity;
  });
};

export const addToCart = (e) => {
  const sizeElement =
    e.target.parentElement.parentElement.querySelector(".details__sizes");
  const size = sizeElement.value;
  if (!userAuth) {
    showModal("Primero inicia sesion", "error");
    // alert("primero inicia sesion");
    return;
  }
  if (!size) {
    showModal("Elige un talle", "error");
    return;
  }
  const { id, img, price, discount, color } = e.target.dataset;
  const name = e.target.parentElement.parentElement
    .querySelector(".details__title")
    .textContent.trim();
  const quantityElement =
    e.target.parentElement.querySelector(".details__quantity");
  const quantity = quantityElement.textContent;
  const product = createProductObj(
    id,
    img,
    name,
    price,
    discount,
    color,
    size,
    quantity
  );
  if (isExistingCartProduct(product)) {
    addUnitsToProduct(product);
    showModal(
      `Se agregaron ${quantity} unidades del producto al carrito`,
      "success"
    );
  } else {
    createCartProduct(product);
    showModal("El producto se ha agregado al carrito", "success");
  }

  const cartUser = users.map((item) =>
    item.id === userAuth.id ? { ...userAuth } : item
  );
  checkCartState(userAuth, cartUser);
  resetProductDetails(sizeElement, quantityElement);
};
const addProductCartEvent = () => {
  const addProductButton = document.querySelector(".details__btn-cart");
  addProductButton?.addEventListener("click", addToCart);
};
const checkCartState = (user, array) => {
  saveLocalStorage("users", array);
  renderCart(user);
  showTotal();
};

const resetProductDetails = (size, quantity) => {
  size.value = "";
  quantity.textContent = 1;
};

const createProductObj = (
  id,
  img,
  name,
  price,
  discount,
  color,
  size,
  quantity
) => {
  return {
    id: parseInt(id),
    img,
    price: parseInt(price),
    name,
    size: parseInt(size),
    color,
    discount,
    quantity: parseInt(quantity),
  };
};

const isExistingCartProduct = (product) => {
  return userAuth.cart.find(
    (itemCart) => itemCart.id === product.id && itemCart.size === product.size
  );
};
const addUnitsToProduct = (product) => {
  userAuth.cart = userAuth.cart.map((cartProduct) => {
    return parseInt(cartProduct.id) === parseInt(product.id) &&
      parseInt(cartProduct.size) === parseInt(product.size)
      ? { ...cartProduct, quantity: cartProduct.quantity + product.quantity }
      : cartProduct;
  });
};
const addUnitToProduct = (product) => {
  userAuth.cart = userAuth.cart.map((cartProduct) => {
    return parseInt(cartProduct.id) === parseInt(product.id) &&
      parseInt(cartProduct.size) === parseInt(product.size)
      ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
      : cartProduct;
  });
};
const substractProductUnit = (existingProduct) => {
  userAuth.cart = userAuth.cart.map((cartProduct) => {
    return cartProduct.id === existingProduct.id &&
      cartProduct.size === existingProduct.size
      ? {
          ...cartProduct,
          quantity: cartProduct.quantity - 1,
        }
      : cartProduct;
  });
};

const removeProductFromCart = (id, size) => {
  const result = userAuth.cart.filter(
    (product) => product.id !== parseInt(id) || product.size !== parseInt(size)
  );
  userAuth.cart = result;
  const newUsers = users.map((user) => (user.login ? userAuth : user));
  checkCartState(userAuth, newUsers);
};

const handlePlusBtnEvent = (id, size) => {
  const existingCartProduct = userAuth.cart.find(
    (item) => item.id === parseInt(id) && item.size === parseInt(size)
  );

  addUnitToProduct(existingCartProduct);
};

const handleMinusBtnEvent = (id, size) => {
  const existingCartProduct = userAuth.cart.find(
    (item) => item.id === parseInt(id) && item.size === parseInt(size)
  );

  if (existingCartProduct.quantity === 1) {
    if (window.confirm("Desea eliminar el producto del carrito?")) {
      removeProductFromCart(id, size);
    }
    return;
  }
  substractProductUnit(existingCartProduct);
};
const handleDeleteBtnEvent = (id, size) => {
  if (window.confirm("Desea eliminar el producto del carrito?")) {
    removeProductFromCart(id, size);
  }
};
//Comprueba si estamos disminuyendo o sumando la unidad
export const handleQuantity = (e) => {
  if (e.target.matches(".down")) {
    handleMinusBtnEvent(e.target.dataset.id, e.target.dataset.size);
  } else if (e.target.matches(".up")) {
    handlePlusBtnEvent(e.target.dataset.id, e.target.dataset.size);
  } else if (e.target.matches(".delete")) {
    handleDeleteBtnEvent(e.target.dataset.id, e.target.dataset.size);
  }
  checkCartState(userAuth, users);
};

const getCartTotal = () =>
  userAuth?.cart.reduce((acc, cur) => {
    return acc + parseInt(cur.price) * parseInt(cur.quantity);
  }, 0);

export const showTotal = () => {
  const total = getCartTotal();
  totalCart.innerHTML = `${numberFormat(total)}`;
};

const resetCartItems = () => {
  userAuth.cart = [];
  checkCartState(userAuth, users);
};
//Funcionalidad de los botones del carrito
const completeCartAction = (confirmMsg, successMsg) => {
  if (!userAuth.cart.length) return;
  if (window.confirm(confirmMsg)) {
    resetCartItems();
    showModal(successMsg, "success");
  }
};
//Completar compra
export const completeBuy = () => {
  completeCartAction(
    "¿Desea completar su compra?",
    "La compra se ha realizado correctamente"
  );
};
//Vaciar carrito
export const deleteCart = () => {
  completeCartAction(
    "¿Está seguro de que desea vaciar el carrito?",
    "Tu carrito está vacio"
  );
};
const createCartProduct = (product) => {
  userAuth.cart = [...userAuth.cart, product];
};

const renderProductData = (product) => {
  const { images } = product;
  renderImages(images);
  const details = renderDetails(product);
  const infoProducts = renderInfoProduct(product);
  detailsContainer.innerHTML = details;
  productInfoContainer.innerHTML = infoProducts;
};

const init = () => {
  buttonHamburger.addEventListener("click", handleHamburgerButton);
  buttonLogout.addEventListener("click", handleLogoutUser);
  buttonCart.addEventListener("click", handleCartButton);
  buttonFavs.addEventListener("click", handleFavsButton);
  buttonProfile.addEventListener("click", handleProfileButton);
  buttonBuy.addEventListener("click", completeBuy);
  buttonDelete.addEventListener("click", deleteCart);
  document.addEventListener("DOMContentLoaded", handleChangeUserViews);
  document.addEventListener("DOMContentLoaded", getProductById);
  document.addEventListener("DOMContentLoaded", showTotal);
  document.addEventListener("DOMContentLoaded", handleButtonsQuantity);
  productsCartContainer.addEventListener("click", handleQuantity);
  document.addEventListener("DOMContentLoaded", () => {
    renderCart(userAuth);
    renderFavs(userAuth);
    addEventToIconFavs(userAuth);
    addProductCartEvent();
  });
};
init();
