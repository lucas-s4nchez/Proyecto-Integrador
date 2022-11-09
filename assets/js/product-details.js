import { products } from "./data.js";
import {
  handleBtnMenu,
  handleBtnProfile,
  handleChangeUserViews,
  handleLogoutUser,
  formatPrice,
  getNewPrice,
} from "./main.js";

const imageContainer = document.getElementById("img-container");
const imageList = document.querySelectorAll(".gallery__img");
const detailsContainer = document.getElementById("details");
const arrayImages = [...imageList];

const getIdByQueryParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));
  return productId;
};

const findProduct = (id) => products.find((product) => product.id === id);

const getProductById = () => {
  const id = getIdByQueryParams();
  const product = findProduct(id);
  console.log(product);
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
  const { id, brand, model, version, price, on_offer, colors, sizes } = product;
  return `
        <div class="details__info">
          <i class="details__icon fa-regular fa-heart"></i>
          <span class="details__title">
            ${brand} ${model} ${version ? version : ""}
          </span>
          
          ${
            on_offer
              ? `<span class="details__old-price">$${formatPrice(price)}</span>`
              : ""
          }
          <span class="details__price">
          ${
            on_offer
              ? `$${getNewPrice(price, on_offer)} 
          <span class="details__offer">${on_offer}% off</span>`
              : `$${formatPrice(price)}`
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
          
          <button class="details__btn-cart" data-id=${id} id="btn-cart">
            Añadir al carrito <i class="fa-solid fa-bag-shopping"></i>
          </button>
        </div>
        `;
};

const addToCart = ({ target }) => {
  if (!target.classList.contains("details__btn-cart")) return;
  const size = target.parentElement.querySelector(".details__sizes").value;
  const productId = target.dataset.id;
  console.log(size);
  console.log(productId);
};

const renderProductData = (product) => {
  const { id, brand, model, version, price, images, on_offer } = product;
  renderImages(images);
  const details = renderDetails(product);
  detailsContainer.innerHTML = details;
};

document.addEventListener("click", handleBtnMenu);
document.addEventListener("click", handleBtnProfile);
document.addEventListener("click", handleLogoutUser);
document.addEventListener("DOMContentLoaded", handleChangeUserViews);
document.addEventListener("DOMContentLoaded", getProductById);
document.addEventListener("click", addToCart);
