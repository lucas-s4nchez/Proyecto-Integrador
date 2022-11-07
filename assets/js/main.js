import { products } from "./data.js";
import { renderProducts, createProduct } from "./utils.js";

const btnMenu = document.getElementById("btn-menu");
const menu = document.getElementById("menu");
const productsOnOfferContainer = document.getElementById("products-offer");
const bestSellersContainer = document.getElementById("best-seller");

const handleBtnMenu = ({ target }) => {
  if (
    target.matches(".hamburger-button") ||
    target.matches(`${".hamburger-button"} *`)
  ) {
    btnMenu.classList.toggle("is-active");
    menu.classList.toggle("nav__active");
  }
};

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
document.addEventListener("DOMContentLoaded", renderProductsOnOffer);
document.addEventListener("DOMContentLoaded", renderBestSellers);
