import { saveLocalStorage } from "./utils.js";

const inputUsername = document.getElementById("username");
const inputEmail = document.getElementById("email");
const formLogin = document.getElementById("form-login");

let users = JSON.parse(localStorage.getItem("users")) || [];

const loginUser = (e) => {
  e.preventDefault();
  if (!inputUsername.value.trim() || !inputEmail.value.trim()) {
    alert("Completa los campos");
    return;
  }
  const user = {
    name: inputUsername.value.trim(),
    email: inputEmail.value.trim(),
    login: false,
  };

  const isLoggedUser = users.find(
    (loggedUser) =>
      loggedUser.name === user.name && loggedUser.email === user.email
  );
  if (isLoggedUser) {
    const loggedUsers = users.map((loggedUser) => {
      return loggedUser.name === user.name && loggedUser.email === user.email
        ? { ...loggedUser, login: true }
        : loggedUser;
    });
    saveLocalStorage("users", loggedUsers);
    window.location.href = "./index.html";
  } else {
    alert("No existe este usuario, crea una cuenta");
  }
};
formLogin?.addEventListener("submit", loginUser);
