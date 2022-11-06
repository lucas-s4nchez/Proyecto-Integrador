import { products } from "./data.js";

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
  const productsOnOffer = products
    .filter((product) => product.on_offer !== null)
    .map(createProductOnOffer)
    .join("");
  productsOnOfferContainer.innerHTML = productsOnOffer;
};

const createProductOnOffer = (product) => {
  const { brand, model, version, price, images, on_offer } = product;
  return `
  
    <div class="card">
      <i class="card__icon fa-regular fa-heart"></i>
      <div class="card__img-box">
        <img class="card__img" src="${
          images[0]
        }" alt="imagen de la zapatilla" />
      </div>
      <div class="card__info">
        <a  href="./assets/pages/tienda.html">
          <span class="card__title">
          ${brand} ${model} ${version ? version : ""}
          </span>
        </a>
        <span class="card__old-price">$${formatPrice(price)}</span>
        <span class="card__price">
        $${getNewPrice(price, on_offer)} 
        <span class="card__span">${on_offer}% off</span>
        </span>
      </div>
  </div>
  
  `;
};

const getNewPrice = (price, discount) => {
  const newPrice =
    parseInt(price) - (parseInt(price) * parseInt(discount)) / 100;
  const formatNewPrice = formatPrice(newPrice);
  return formatNewPrice;
};

const formatPrice = (price) => {
  const firstTwoDigits = price.toString().split("").slice(0, 2).join("");
  const lastThreeDigits = price.toString().split("").slice(2).join("");
  const formatPrice = `${firstTwoDigits}.${lastThreeDigits}`;
  return formatPrice;
};

const renderBestSellers = () => {
  const bestSelers = products
    .filter((product) => product.best_seller === true)
    .map(createBestSellerProduct)
    .join("");
  bestSellersContainer.innerHTML = bestSelers;
};

const createBestSellerProduct = (product) => {
  const { brand, model, version, price, images } = product;
  return `
  
    <div class="card">
      <i class="card__icon fa-regular fa-heart"></i>
      <div class="card__img-box">
        <img class="card__img" src="${
          images[0]
        }" alt="imagen de la zapatilla" />
      </div>
      <div class="card__info">
        <a  href="./assets/pages/tienda.html">
          <span class="card__title">
          ${brand} ${model} ${version ? version : ""}
          </span>
        </a>
        <span class="card__price">$${formatPrice(price)}</span>
      </div>
  </div>
  
  `;
};

document.addEventListener("click", handleBtnMenu);
document.addEventListener("DOMContentLoaded", renderProductsOnOffer);
document.addEventListener("DOMContentLoaded", renderBestSellers);
