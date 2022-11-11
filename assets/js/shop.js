import {
  renderProducts,
  createProduct,
  loadSpinner,
  handleBtnMenu,
  handleBtnProfile,
  handleLogoutUser,
  handleChangeUserViews,
  handleCartButton,
  renderCart,
} from "./main.js";
import { products } from "./data.js";
import { addToCart, handleQuantity, showTotal } from "./product-details.js";

const productsContainer = document.getElementById("products");
const productsCartContainer = document.querySelector(".cart__main");
const totalCart = document.querySelector(".cart__total-span");
const selectColor = document.getElementById("color");
const selectBrand = document.getElementById("marca");
const selectGender = document.getElementById("genero");
const selectMax = document.getElementById("maximo");
const selectMin = document.getElementById("minimo");
const btnReset = document.getElementById("btn-reset-filters");
const searchValue = {
  brand: "",
  color: "",
  gender: "",
  minimum: "",
  maximum: "",
};
//usuarios del localstorage
let users = JSON.parse(localStorage.getItem("users")) || [];
//si un usuario esta logueado
const isLoggedUser = users.find((user) => user.login === true);

const renderProductsInStock = () => {
  const productsInStock = renderProducts(products, createProduct);
  productsContainer.innerHTML = productsInStock;
};

const setSingleColors = () => {
  let newColors = [];
  const colors = products.map((product) =>
    product.colors.toString().split("/")
  );
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

const renderSelects = () => {
  createSelect(setSingleColors, selectColor);
  createSelect(getBrands, selectBrand);
};

//Funcion que realiza todos los filtros
const filterProducts = () => {
  const filteredProducts = products
    .filter(filterBrand)
    .filter(filterColor)
    .filter(filterGender)
    .filter(filterMaximum)
    .filter(filterMinimum);

  if (filteredProducts.length) {
    const results = renderProducts(filteredProducts, createProduct);
    productsContainer.innerHTML = loadSpinner();
    setTimeout(() => {
      productsContainer.innerHTML = results;
    }, 800);
  } else {
    console.log("no existe el producto");
  }
};

//Cada filtro individual
const filterBrand = (product) => {
  if (searchValue.brand) {
    return product.brand === searchValue.brand;
  }
  return product;
};
const filterColor = (product) => {
  if (searchValue.color) {
    return product.colors.includes(searchValue.color);
  }
  return product;
};
const filterGender = (product) => {
  if (searchValue.gender) {
    return product.gender === searchValue.gender;
  }
  return product;
};
const filterMaximum = (product) => {
  if (searchValue.maximum) {
    return product.price <= parseInt(searchValue.maximum);
  }
  return product;
};
const filterMinimum = (product) => {
  if (searchValue.minimum) {
    return product.price >= parseInt(searchValue.minimum);
  }
  return product;
};

const resetFilters = (e) => {
  e.preventDefault();
  searchValue.brand = "";
  searchValue.color = "";
  searchValue.gender = "";
  searchValue.minimum = "";
  searchValue.maximum = "";
  selectColor.value = "";
  selectGender.value = "";
  selectMin.value = "";
  selectMax.value = "";
  selectBrand.value = "";
  filterProducts();
};

const init = () => {
  document.addEventListener("click", handleBtnMenu);
  document.addEventListener("click", handleCartButton);
  document.addEventListener("click", handleBtnProfile);
  document.addEventListener("click", handleLogoutUser);
  document.addEventListener("DOMContentLoaded", handleChangeUserViews);
  productsCartContainer.addEventListener("click", handleQuantity);
  document.addEventListener("DOMContentLoaded", showTotal);
  document.addEventListener("click", addToCart);
  document.addEventListener("DOMContentLoaded", renderProductsInStock);
  document.addEventListener("DOMContentLoaded", () => {
    renderCart(isLoggedUser);
  });
  document.addEventListener("DOMContentLoaded", renderSelects);
  btnReset.addEventListener("click", resetFilters);
  selectBrand.addEventListener("change", ({ target }) => {
    searchValue.brand = target.value;
    filterProducts();
  });
  selectColor.addEventListener("change", ({ target }) => {
    searchValue.color = target.value;
    filterProducts();
  });
  selectGender.addEventListener("change", ({ target }) => {
    searchValue.gender = target.value;
    filterProducts();
  });
  selectMax.addEventListener("change", ({ target }) => {
    searchValue.maximum = target.value;
    filterProducts();
  });
  selectMin.addEventListener("change", ({ target }) => {
    searchValue.minimum = target.value;
    filterProducts();
  });
};
init();
