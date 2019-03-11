import request from "@/api/axios";
import urlCol from "@/common/urlCol";

export const getRoleByUserId = params => {
  return request({
    url: urlCol.userRole.getRoleByUserId.url,
    method: "get",
    params
  });
};
