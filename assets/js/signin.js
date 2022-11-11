import { saveLocalStorage } from "./main.js";

const inputUsername = document.getElementById("username");
const inputEmail = document.getElementById("email");
const form = document.getElementById("form-signin");

let users = JSON.parse(localStorage.getItem("users")) || [];

const createUser = (e) => {
  e.preventDefault();
  if (!inputUsername.value.trim() || !inputEmail.value.trim()) {
    alert("Completa los campos");
    return;
  }
  const newUser = {
    id: users.length + 1,
    name: inputUsername.value.trim(),
    email: inputEmail.value.trim(),
    login: false,
    cart: [],
    favs: [],
  };

  const isExistingUser = JSON.stringify(users).includes(
    JSON.stringify(newUser)
  );
  if (!isExistingUser) {
    users = [...users, newUser];
    saveLocalStorage("users", users);
    alert("nuevo usuario");
    window.history.back();
  } else {
    alert("usuario existente");
  }
};

form?.addEventListener("submit", createUser);
