import { products } from "./data.js";
import {
  renderProducts,
  createProduct,
  handleChangeUserViews,
  handleLogoutUser,
  handleCartButton,
  renderCart,
  handleFavsButton,
  renderFavs,
  addEventToIconFavs,
  handleProfileButton,
  handleHamburgerButton,
  showTotalProductsInFavs,
} from "./main.js";
import {
  completeBuy,
  deleteCart,
  handleQuantity,
  showTotal,
  showTotalProductsInCart,
} from "./product-details.js";

const buttonFavs = document.querySelector(".favs-open");
const buttonCart = document.querySelector(".cart-open");
const buttonProfile = document.querySelector(".profile-button__button");
const buttonHamburger = document.getElementById("btn-menu");
const buttonLogout = document.querySelector(".profile-menu__button");
const buttonBuy = document.querySelector(".buy");
const buttonDelete = document.querySelector(".delete");

const successModal = document.querySelector(".add-modal");
const productsCartContainer = document.querySelector(".cart__main");
const productsOnOfferContainer = document.getElementById("products-offer");
const bestSellersContainer = document.getElementById("best-seller");

//usuarios del localstorage
let users = JSON.parse(localStorage.getItem("users")) || [];
//el usuario que esta activo
const userAuth = users.find((user) => user.login === true);

//Slider
window.swiper = new Swiper({
  el: ".slider__box",
  slideClass: "slider__slide",
  createElements: true,
  autoplay: {
    delay: 5000,
  },
  loop: true,
  pagination: true,
  navigation: true,
});

const renderProductsOnOffer = () => {
  const productsOnOffer = products.filter(
    (product) => product.on_offer !== null
  );
  const results = renderProducts(productsOnOffer, createProduct);
  productsOnOfferContainer.innerHTML = results;
};

const renderBestSellers = () => {
  const bestSelers = products.filter((product) => product.best_seller === true);
  const results = renderProducts(bestSelers, createProduct);
  bestSellersContainer.innerHTML = results;
};

const init = () => {
  buttonHamburger.addEventListener("click", handleHamburgerButton);
  buttonLogout.addEventListener("click", handleLogoutUser);
  productsCartContainer.addEventListener("click", handleQuantity);
  buttonCart.addEventListener("click", handleCartButton);
  buttonFavs.addEventListener("click", handleFavsButton);
  buttonProfile.addEventListener("click", handleProfileButton);
  buttonBuy.addEventListener("click", completeBuy);
  buttonDelete.addEventListener("click", deleteCart);
  document.addEventListener("DOMContentLoaded", () => {
    handleChangeUserViews();
    renderCart(userAuth);
    showTotal();
    renderFavs(userAuth);
    renderProductsOnOffer();
    renderBestSellers();
    addEventToIconFavs(userAuth);
    showTotalProductsInCart();
    showTotalProductsInFavs();
  });
};
init();
