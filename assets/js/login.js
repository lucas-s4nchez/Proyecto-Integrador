import { saveLocalStorage, showModal } from "./main.js";

const inputUsername = document.getElementById("username");
const inputPassword = document.getElementById("password");
const formLogin = document.getElementById("form-login");

let users = JSON.parse(localStorage.getItem("users")) || [];

const loginUser = (e) => {
  e.preventDefault();
  if (!inputUsername.value.trim() || !inputPassword.value.trim()) {
    showModal("Completa los campos", "error");
    return;
  }
  const user = {
    username: inputUsername.value.trim(),
    password: inputPassword.value.trim(),
  };

  const userAuth = users.find(
    (registeredUser) =>
      registeredUser.username === user.username &&
      registeredUser.password === user.password
  );
  if (userAuth) {
    const registeredUsers = users.map((registeredUser) => {
      return registeredUser.username === user.username &&
        registeredUser.password === user.password
        ? { ...registeredUser, login: true }
        : registeredUser;
    });
    saveLocalStorage("users", registeredUsers);
    window.location.href = "./index.html";
  } else {
    showModal("No existe este usuario, crea una cuenta", "error");
  }
};
formLogin?.addEventListener("submit", loginUser);
