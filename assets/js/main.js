import { products } from "./data.js";

const btnMenu = document.getElementById("btn-menu");
const menu = document.getElementById("menu");
const featuredContainer = document.getElementById("featured");

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

const renderFeaturedProducts = () => {
  const featuredProducts = products
    .filter((product) => product.featured === true)
    .map(createFeaturedProduct)
    .join("");
  featuredContainer.innerHTML = featuredProducts;
};

const createFeaturedProduct = (product) => {
  const { id, brand, model, version, price, images } = product;
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
        <span class="card__price">$${price}</span>
      </div>
  </div>
  
  `;
};

document.addEventListener("click", handleBtnMenu);
document.addEventListener("DOMContentLoaded", renderFeaturedProducts);
