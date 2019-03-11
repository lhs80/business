import request from "@/api/axios";
import urlCol from "@/common/urlCol";

/**
 * 分配权限
 * @param {*} data
 */
export const addMenuRole = data => {
  return request({
    url: urlCol.menuRole.addMenuRole.url,
    method: "post",
    data
  });
};
