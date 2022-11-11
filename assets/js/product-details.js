import { products } from "./data.js";
import {
  handleBtnMenu,
  handleBtnProfile,
  handleChangeUserViews,
  handleLogoutUser,
  formatPrice,
  getNewPrice,
  handleCartButton,
  saveLocalStorage,
  renderCart,
  numberFormat,
} from "./main.js";

const imageContainer = document.getElementById("img-container");
const imageList = document.querySelectorAll(".gallery__img");
const detailsContainer = document.getElementById("details");
const productsCartContainer = document.querySelector(".cart__main");
const totalCart = document.querySelector(".cart__total-span");
const arrayImages = [...imageList];
//usuarios del localstorage
let users = JSON.parse(localStorage.getItem("users")) || [];
//si un usuario esta logueado
const isLoggedUser = users.find((user) => user.login === true);

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
          <i class="details__icon fa-regular fa-heart"></i>
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
              <option value=""> Selecciona un talle </option>
              ${sizes.map(
                (size) =>
                  `<option class="details__option" value="${size}">${size}</option>`
              )}
            </select>
          </span>
          
          <button class="details__btn-cart"
            data-id=${id} 
            data-img=${images[0]} 
            data-price=${on_offer ? getNewPrice(price, on_offer) : price} 
            data-discount=${on_offer} 
            data-color=${colors.toString().split(",").join("/")} 
            id="btn-cart">
            Añadir al carrito <i class="fa-solid fa-bag-shopping"></i>
          </button>
        </div>
        `;
};

export const addToCart = (e) => {
  if (!e.target.classList.contains("details__btn-cart")) return;
  const size = e.target.parentElement.querySelector(".details__sizes").value;
  if (!isLoggedUser) {
    alert("primero inicia sesion");
    return;
  }
  if (!size) {
    alert("Elige un talle");
    return;
  }
  const { id, img, price, discount, color } = e.target.dataset;
  const name = e.target.parentElement
    .querySelector(".details__title")
    .textContent.trim();
  const product = createProductObj(id, img, name, price, discount, color, size);
  if (isExistingCartProduct(product)) {
    addUnitToProduct(product);
    alert("Se agregó una unidad del producto al carrito");
  } else {
    createCartProduct(product);
    alert("El producto se ha agregado al carrito");
  }

  const cartUser = users.map((item) =>
    item.id === isLoggedUser.id ? { ...isLoggedUser } : item
  );
  checkCartState(isLoggedUser, cartUser);
};

const checkCartState = (user, array) => {
  saveLocalStorage("users", array);
  renderCart(user);
  showTotal();
};

const createProductObj = (id, img, name, price, discount, color, size) => {
  return {
    id: parseInt(id),
    img,
    price: parseInt(price),
    name,
    size: parseInt(size),
    color,
    discount,
  };
};

const isExistingCartProduct = (product) => {
  return isLoggedUser.cart.find(
    (itemCart) => itemCart.id === product.id && itemCart.size === product.size
  );
};

const addUnitToProduct = (product) => {
  isLoggedUser.cart = isLoggedUser.cart.map((cartProduct) => {
    return parseInt(cartProduct.id) === parseInt(product.id) &&
      parseInt(cartProduct.size) === parseInt(product.size)
      ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
      : cartProduct;
  });
};
const substractProductUnit = (existingProduct) => {
  isLoggedUser.cart = isLoggedUser.cart.map((cartProduct) => {
    return cartProduct.id === existingProduct.id &&
      cartProduct.size === existingProduct.size
      ? { ...cartProduct, quantity: cartProduct.quantity - 1 }
      : cartProduct;
  });
};
//Remover producto del carrito
const removeProductFromCart = (id, size) => {
  const result = isLoggedUser.cart.filter(
    (product) => product.id !== parseInt(id) || product.size !== parseInt(size)
  );
  isLoggedUser.cart = result;
  const newUsers = users.map((user) => (user.login ? isLoggedUser : user));
  checkCartState(isLoggedUser, newUsers);
};

//Si aumentamos la unidad del producto
const handlePlusBtnEvent = (id, size) => {
  const existingCartProduct = isLoggedUser.cart.find(
    (item) => item.id === parseInt(id) && item.size === parseInt(size)
  );

  addUnitToProduct(existingCartProduct);
};

//Si disminuimos la unidad del producto
const handleMinusBtnEvent = (id, size) => {
  const existingCartProduct = isLoggedUser.cart.find(
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

//Comprueba si estamos disminuyendo o sumando la unidad
export const handleQuantity = (e) => {
  if (e.target.matches(".down")) {
    handleMinusBtnEvent(e.target.dataset.id, e.target.dataset.size);
  } else if (e.target.matches(".up")) {
    handlePlusBtnEvent(e.target.dataset.id, e.target.dataset.size);
  }
  checkCartState(isLoggedUser, users);
};

const getCartTotal = () =>
  isLoggedUser?.cart.reduce((acc, cur) => {
    return acc + parseInt(cur.price) * parseInt(cur.quantity);
  }, 0);

export const showTotal = () => {
  const total = getCartTotal();
  totalCart.innerHTML = `${numberFormat(total)}`;
};

const createCartProduct = (product) => {
  isLoggedUser.cart = [...isLoggedUser.cart, { ...product, quantity: 1 }];
};

const renderProductData = (product) => {
  const { images } = product;
  renderImages(images);
  const details = renderDetails(product);
  detailsContainer.innerHTML = details;
};
const init = () => {
  document.addEventListener("click", handleBtnMenu);
  document.addEventListener("click", handleCartButton);
  document.addEventListener("click", handleBtnProfile);
  document.addEventListener("click", handleLogoutUser);
  document.addEventListener("DOMContentLoaded", handleChangeUserViews);
  document.addEventListener("DOMContentLoaded", getProductById);
  document.addEventListener("DOMContentLoaded", showTotal);
  productsCartContainer.addEventListener("click", handleQuantity);
  document.addEventListener("DOMContentLoaded", () => {
    renderCart(isLoggedUser);
  });
  document.addEventListener("click", addToCart);
};
init();
