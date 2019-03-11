import request from "@/api/axios";
import urlCol from "@/common/urlCol";

/**
 * 添加用户
 * @param {*} data
 */
export function addUser(data) {
  return request({
    url: urlCol.user.addUser.url,
    method: "post",
    data
  });
}

/**
 * 分页获取用户信息
 * @param {*} params
 */
export function getAllByPage(params) {
  return request({
    url: urlCol.user.getAllByPage.url,
    method: "get",
    params
  });
}

/**
 * 启用/禁用
 * @param {*} data
 */
export function enable(data) {
  return request({
    url: urlCol.user.enable.url,
    method: "post",
    data
  });
}

/**
 * 重置密码
 * @param {*} data
 */
export function resetPassword(data) {
  return request({
    url: urlCol.user.resetPassword.url,
    method: "post",
    data
  });
}
export function updatePass(data) {
  return request({
    url: urlCol.user.updatePass.url,
    method: "post",
    data
  });
}

/**
 * 更新用户
 * @param {*} data
 */
export function updateUser(data) {
  return request({
    url: urlCol.user.updateUser.url,
    method: "post",
    data
  });
}

/**
 * 通过唯一标识获取用户信息
 * @param {*} params
 */
export function getUserById(params) {
  return request({
    url: urlCol.user.getUserById.url,
    method: "get",
    params
  });
}
