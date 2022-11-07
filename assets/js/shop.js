import { renderProducts } from "./utils.js";
import { products } from "./data.js";

const productsContainer = document.getElementById("products");

const renderProductsInStock = (array, callback) => {
  const productsInStock = renderProducts(products);
};

document.addEventListener("DOMContentLoaded", renderProductsInStock);
