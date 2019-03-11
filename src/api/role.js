import request from "@/api/axios";
import urlCol from "@/common/urlCol";

/**
 * 添加角色
 */
export const addRole = data => {
  return request({
    url: urlCol.role.addRole.url,
    method: "post",
    data
  });
};

/**
 * 删除角色
 */
export const deleteRole = data => {
  return request({
    url: urlCol.role.deleteRole.url,
    method: "post",
    data
  });
};

/**
 * 通过角色唯一标识获取角色信息
 */
export const getRoleById = params => {
  return request({
    url: urlCol.role.getRoleById.url,
    method: "get",
    params
  });
};

/**
 * 分页获取角色
 */
export const getRolesByPage = params => {
  return request({
    url: urlCol.role.getRolesByPage.url,
    method: "get",
    params
  });
};

/**
 * 更新角色
 */
export const updateRole = data => {
  return request({
    url: urlCol.role.updateRole.url,
    method: "post",
    data
  });
};

/**
 * 获取所有角色
 */
export const getRoles = () => {
  return request({
    url: urlCol.role.getRoles.url,
    method: "get"
  });
};
