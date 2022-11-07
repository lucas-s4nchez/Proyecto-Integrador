export const renderProducts = (array, callback) => {
  return array.map(callback).join("");
};
export const createProduct = (product) => {
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
        ${
          on_offer
            ? `<span class="card__old-price">$${formatPrice(price)}</span>`
            : ""
        }
        <span class="card__price">
        ${
          on_offer
            ? `$${getNewPrice(price, on_offer)} 
        <span class="card__span">${on_offer}% off</span>`
            : `$${formatPrice(price)}`
        }
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

export const loadSpinner = () =>
  `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;
