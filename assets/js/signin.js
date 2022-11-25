import { saveLocalStorage, showModal } from "./main.js";

const inputUsername = document.getElementById("username");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const form = document.getElementById("form-signin");

let users = JSON.parse(localStorage.getItem("users")) || [];

const checkUsername = () => {
  let valid = false;
  const min = 3;
  const max = 25;
  const username = inputUsername.value.trim();
  if (isEmpty(username)) {
    showError(inputUsername, "El nombre es obligatorio");
  } else if (!isBetween(username.length, min, max)) {
    showError(
      inputUsername,
      `El nombre debe tener entre ${min} y ${max} caracteres`
    );
  } else {
    showSuccess(inputUsername);
    valid = true;
  }
  return valid;
};

const checkEmail = () => {
  let valid = false;
  const emailValue = inputEmail.value.trim();
  if (isEmpty(emailValue)) {
    showError(inputEmail, "El email es obligatorio");
  } else if (!isEmailValid(emailValue)) {
    showError(inputEmail, "El email no es valido");
  } else {
    showSuccess(inputEmail);
    valid = true;
  }
  return valid;
};

const checkPassword = () => {
  let valid = false;
  const password = inputPassword.value.trim();
  if (isEmpty(password)) {
    showError(inputPassword, "La contraseña es obligatoria");
  } else if (!isPassValid(password)) {
    showError(
      inputPassword,
      "La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula y un caracter especial"
    );
  } else {
    showSuccess(inputPassword);
    valid = true;
  }
  return valid;
};

const isEmailValid = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const isPassValid = (pass) => {
  const re =
    /^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
  return re.test(pass);
};

const isEmpty = (value) => value === "";
const isBetween = (length, min, max) =>
  length < min || length > max ? false : true;

const showError = (input, message) => {
  const formField = input.parentElement;
  formField.classList.remove("success");
  formField.classList.add("error");
  const error = formField.querySelector("small");
  error.textContent = message;
};
const showSuccess = (input) => {
  const formField = input.parentElement;
  formField.classList.remove("error");
  formField.classList.add("success");
  const error = formField.querySelector("small");
  error.textContent = "";
};

const createUser = (e) => {
  e.preventDefault();
  let isUsernameValid = checkUsername();
  let isEmailValid = checkEmail();
  let isPasswordValid = checkPassword();

  const isUserValid = isUsernameValid && isEmailValid && isPasswordValid;

  if (!isUserValid) {
    showModal("Completa los campos", "error");
    return;
  }
  const newUser = {
    id: users.length + 1,
    username: inputUsername.value.trim(),
    email: inputEmail.value.trim(),
    password: inputPassword.value.trim(),
    login: false,
    cart: [],
    favs: [],
  };

  const isExistingUsername = users.find(
    (user) => user.username === newUser.username
  );
  const isExistingEmail = users.find((user) => user.email === newUser.email);
  if (isExistingUsername) {
    inputUsername.focus();
    showModal("Este usuario ya existe, prueba con otro", "error");
    return;
  }
  if (isExistingEmail) {
    inputEmail.focus();
    showModal("Este email ya pertenece a una cuenta", "error");
    return;
  }
  users = [...users, newUser];
  saveLocalStorage("users", users);
  showModal("nuevo usuario", "success");
  setTimeout(() => {
    window.location.href = "./log-in.html";
  }, 1500);
};

form?.addEventListener("input", (e) => {
  switch (e.target.name) {
    case "username":
      checkUsername();
      break;
    case "email":
      checkEmail();
      break;
    case "password":
      checkPassword();
      break;

    default:
      break;
  }
});
form?.addEventListener("submit", createUser);
