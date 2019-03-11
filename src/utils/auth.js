import Cookies from "js-cookie";
import store from "@/store";
const TokenKey = "shu-token";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function getCookie() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function setCookie(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
