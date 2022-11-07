import { renderProducts, createProduct, loadSpinner } from "./utils.js";
import { products } from "./data.js";

const productsContainer = document.getElementById("products");
const selectColor = document.getElementById("color");
const selectBrand = document.getElementById("marca");
const selectGender = document.getElementById("genero");
const selectMax = document.getElementById("maximo");
const selectMin = document.getElementById("minimo");
const searchValue = {
  brand: "",
  color: "",
  gender: "",
  minimum: "",
  maximum: "",
};

const renderProductsInStock = () => {
  const productsInStock = renderProducts(products, createProduct);
  productsContainer.innerHTML = productsInStock;
};

const colorsWithoutDuplicates = () => {
  let newColors = [];
  const colors = products.map((product) => product.color.toString().split("/"));
  const splitColors = colors.toString().split(",");
  for (let i = 0; i < splitColors.length; i++) {
    if (!newColors.includes(splitColors[i])) {
      newColors = [...newColors, splitColors[i]];
    }
  }
  return newColors;
};

const getBrands = () => {
  let newBrands = [];
  const brands = products.map((product) => product.brand);
  for (let i = 0; i < brands.length; i++) {
    if (!newBrands.includes(brands[i])) {
      newBrands = [...newBrands, brands[i]];
    }
  }
  return newBrands;
};

const sortInAscendingOrder = (array) => {
  return array.sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) {
      return -1;
    }
    if (a.toLowerCase() > b.toLowerCase()) {
      return 1;
    }
    return 0;
  });
};

const createSelect = (callback, container) => {
  const colors = callback();
  sortInAscendingOrder(colors);
  const results = colors
    .map(
      (color) =>
        `<option class="filters__option" value="${color}">${color}</option>`
    )
    .join("");
  container.innerHTML += results;
};

const loadSelects = () => {
  createSelect(colorsWithoutDuplicates, selectColor);
  createSelect(getBrands, selectBrand);
};

const filterProducts = (callback) => {
  const filteredProducts = products.filter(callback);

  if (filteredProducts.length) {
    const results = renderProducts(filteredProducts, createProduct);
    productsContainer.innerHTML = loadSpinner();
    setTimeout(() => {
      productsContainer.innerHTML = results;
    }, 800);
  } else {
    alert("no existe el producto");
  }
};

const filterBrand = (product) => {
  if (searchValue.brand) {
    return product.brand === searchValue.brand;
  }
  return product;
};
const filterColor = (product) => {
  if (searchValue.color) {
    return product.color === searchValue.color;
  }
  return product;
};

document.addEventListener("DOMContentLoaded", renderProductsInStock);
document.addEventListener("DOMContentLoaded", loadSelects);
selectBrand.addEventListener("change", ({ target }) => {
  searchValue.brand = target.value;
  filterProducts(filterBrand);
});
selectColor.addEventListener("change", ({ target }) => {
  searchValue.color = target.value;
  filterProducts(filterColor);
});
