import request from "@/api/axios";
import urlCol from "@/common/urlCol";

/**
 * 获取所有菜单
 */
export const getMenusAll = () => {
  return request({
    url: urlCol.menu.getMenusAll.url,
    method: "get"
  });
};

/**
 * 获取当前用户所拥有的菜单
 */
export const getMenusByCurrentUser = () => {
  return request({
    url: urlCol.menu.getMenusByCurrentUser.url,
    method: "get"
  });
};

/**
 * 通过角色唯一标识获取相应的菜单
 * @param {*} params 
 */
export const getMenusByRoleId = params => {
  return request({
    url: urlCol.menu.getMenusByRoleId.url,
    method: "get",
    params
  });
};

export function GetMenu() {
  return request({
    url: "/admin/menu/userMenu",
    method: "get"
  });
}
export function fetchTree(query) {
  return request({
    url: "/admin/menu/allTree",
    method: "get",
    params: query
  });
}

export function addObj(obj) {
  return request({
    url: "/admin/menu/",
    method: "post",
    data: obj
  });
}

export function getObj(id) {
  return request({
    url: "/admin/menu/" + id,
    method: "get"
  });
}

export function delObj(id) {
  return request({
    url: "/admin/menu/" + id,
    method: "delete"
  });
}

export function putObj(obj) {
  return request({
    url: "/admin/menu/",
    method: "put",
    data: obj
  });
}
