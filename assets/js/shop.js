import { renderProducts, createProduct, loadSpinner } from "./utils.js";
import { products } from "./data.js";

const productsContainer = document.getElementById("products");
const selectColor = document.getElementById("color");
const selectBrand = document.getElementById("marca");
const selectGender = document.getElementById("genero");
const selectMax = document.getElementById("maximo");
const selectMin = document.getElementById("minimo");
const selectSort = document.getElementById("orden");
const btnReset = document.getElementById("btn-reset-filters");
const searchValue = {
  brand: "",
  color: "",
  gender: "",
  minimum: "",
  maximum: "",
  sort: "",
};

const renderProductsInStock = () => {
  const productsInStock = renderProducts(products, createProduct);
  productsContainer.innerHTML = productsInStock;
};

const getColors = () => {
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

const loadSelects = () => {
  createSelect(getColors, selectColor);
  createSelect(getBrands, selectBrand);
};

const filterProducts = () => {
  const filteredProducts = products
    .filter(filterBrand)
    .filter(filterColor)
    .filter(filterGender)
    .filter(filterMaximum)
    .filter(filterMinimum)
    .filter(sortBy);

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
const orderProducts = () => {
  const sortedProducts = sortBy();
  productsContainer.innerHTML = loadSpinner();
  setTimeout(() => {
    productsContainer.innerHTML = renderProducts(sortedProducts, createProduct);
  }, 800);
};
const sortBy = () => {
  if (searchValue.sort) {
    if (searchValue.sort === "A-Z") {
      return products.sort((a, b) => {
        if (a.brand < b.brand) {
          return -1;
        }
        if (a.brand > b.brand) {
          return 1;
        }
        return 0;
      });
    }
    if (searchValue.sort === "Z-A") {
      return products.sort((a, b) => {
        if (a.brand > b.brand) {
          return -1;
        }
        if (a.brand < b.brand) {
          return 1;
        }
        return 0;
      });
    }
    if (searchValue.sort === "Menor") {
      return products.sort((a, b) => a.price - b.price);
    }
    if (searchValue.sort === "Mayor") {
      return products.sort((a, b) => b.price - a.price);
    }
  }
};
const resetFilters = () => {
  searchValue.brand = "";
  searchValue.color = "";
  searchValue.gender = "";
  searchValue.minimum = "";
  searchValue.maximum = "";
  searchValue.sort = "";
};

document.addEventListener("DOMContentLoaded", renderProductsInStock);
document.addEventListener("DOMContentLoaded", loadSelects);
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
selectSort.addEventListener("change", ({ target }) => {
  searchValue.sort = target.value;
  orderProducts();
});
btnReset.addEventListener("click", resetFilters);
