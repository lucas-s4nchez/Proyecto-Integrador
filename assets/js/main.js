import { products } from "./data.js";
import {
  renderProducts,
  createProduct,
  handleBtnMenu,
  handleBtnProfile,
  handleChangeUserViews,
  handleLogoutUser,
} from "./utils.js";

const productsOnOfferContainer = document.getElementById("products-offer");
const bestSellersContainer = document.getElementById("best-seller");
const logout = document.getElementById("profile-toggle");

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

document.addEventListener("click", handleBtnMenu);
document.addEventListener("click", handleBtnProfile);
logout.addEventListener("click", handleLogoutUser);
window.addEventListener("load", handleChangeUserViews);
document.addEventListener("DOMContentLoaded", renderProductsOnOffer);
document.addEventListener("DOMContentLoaded", renderBestSellers);
