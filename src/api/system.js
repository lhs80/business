import request from '@/api/axios'
import urlCol from '@/common/urlCol'

// P图源设置接口集合

//添加图源
export function addSys(data) {
  return request({
    url: urlCol.sys.addSys.url,
    method: 'post',
    data
  });
}

//获取图源

export function getSys(data) {
  return request({
    url: urlCol.sys.getSys.url,
    method: 'get',
    data
  });
}

//修改图源
export function updateSys(data) {
  return request({
    url: urlCol.sys.updateSys.url,
    method: 'post',
    data
  });
}

//修改商户基本信息
export function baseSettingUpdateFun(data) {
  return request({
    url: urlCol.setting.update.url,
    method: 'post',
    data
  });
}

//查询商户基本信息
export function queryBaseSettingFun() {
  return request({
    url: urlCol.setting.query.url,
    method: 'get'
  });
}



