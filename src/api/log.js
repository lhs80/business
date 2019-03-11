import request from "@/api/axios";
import urlCol from "@/common/urlCol";

export const getOpLogPage = params => {
  return request({
    url: urlCol.opLog.getOpLogPage.url,
    method: "get",
    params
  });
};

export const deleteOpLog = data => {
  return request({
    url: urlCol.opLog.deleteOpLog.url,
    method: "post",
    data
  });
};
