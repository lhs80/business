import request from '@/api/axios'
import urlCol from '@/common/urlCol'

//使用示例
//const query={
//	page:1,
//	limit:12
//}
//addPoi(query).then(response => {
//	console.log("返回正确信息")
//	console.log(response)
//});

// POI接口集合

//登录接口
export function login(data) {
  return request({
    url: urlCol.login.login.url,
    method: 'post',
    data
  });
}

//添加poi

export function addPoi(data) {
  return request({
    url: urlCol.poi.addPoi.url,
    method: 'post',
    data
  });
}

//删除poi
export function deletePoi(query) {
  return request({
    url: urlCol.poi.deletePoi.url,
    method: 'post',
    data: query
  });
}

//更新POi信息
export function updatePoi(query) {
  return request({
    url: urlCol.poi.updatePoi.url,
    method: 'post',
    data: query
  });
}

//根据POI唯一标识获取POI信息
export function getPoiById(query) {
  return request({
    url: urlCol.poi.getPoiById.url,
    method: 'get',
    params: query
  })
}

//分页获取POI信息
export function getPoiByPage(query) {
  return request({
    url: urlCol.poi.getPoiByPage.url,
    method: 'get',
    params: query
  })
}

//客户列表
export function getAllClient(data) {
  return request({
    url: urlCol.poi.getAllClient.url + data,
  })
}


/**
 * 所有客户等级
 */
export function getClientLevelListFun() {
  return request({
    url: urlCol.poi.clientLevel.url,
  })
}


/**
 * 新增或编辑客户等级
 */
export function addOrEditLevelFun(data) {
  return request({
    url: urlCol.poi.addOrEditLevel.url,
    method: "post",
    data
  })
}

/**
 * 修改客户等级
 */
export function updateClientLevelFun(data) {
  return request({
    url: urlCol.poi.updateClientLevel.url,
    method: "post",
    data
  })
}

/**
 * 删除客户等级
 */
export function delClientLevelFun(data) {
  return request({
    url: urlCol.poi.delClientLevel.url,
    method: "post",
    data
  })
}

