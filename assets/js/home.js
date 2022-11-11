import { products } from "./data.js";
import {
  renderProducts,
  createProduct,
  handleBtnMenu,
  handleBtnProfile,
  handleChangeUserViews,
  handleLogoutUser,
  handleCartButton,
  renderCart,
} from "./main.js";
import { addToCart, handleQuantity, showTotal } from "./product-details.js";

const productsCartContainer = document.querySelector(".cart__main");
const totalCart = document.querySelector(".cart__total-span");
const productsOnOfferContainer = document.getElementById("products-offer");
const bestSellersContainer = document.getElementById("best-seller");
//usuarios del localstorage
let users = JSON.parse(localStorage.getItem("users")) || [];
//si un usuario esta logueado
const isLoggedUser = users.find((user) => user.login === true);

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
  document.addEventListener("click", handleBtnMenu);
  document.addEventListener("click", handleBtnProfile);
  document.addEventListener("click", handleCartButton);
  document.addEventListener("click", handleLogoutUser);
  document.addEventListener("DOMContentLoaded", handleChangeUserViews);
  productsCartContainer.addEventListener("click", handleQuantity);
  document.addEventListener("DOMContentLoaded", showTotal);
  document.addEventListener("click", addToCart);
  document.addEventListener("DOMContentLoaded", renderProductsOnOffer);
  document.addEventListener("DOMContentLoaded", renderBestSellers);
  document.addEventListener("DOMContentLoaded", () => {
    renderCart(isLoggedUser);
  });
};
init();
