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

// 路线接口集合


//新增路线
export function addRoute(query) {
	return request({
		url: urlCol.route.addRoute.url,
		method: 'post',
		data:query
	});
};

//删除路线
export function deleteRoute(query){
	return request({
		url: urlCol.route.deleteRoute.url,
		method: 'post',
		data:query
	});
};

//获取分享路线
export function share(data){
	return request({
		url: urlCol.route.share.url,
		method: 'post',
		data
	});
};

//更新路线
export function updateRoute(query){
	return request({
		url: urlCol.route.updateRoute.url,
		method: 'post',
		data:query
	});
}

//上传背景音乐
export function uploadFile(){
	return request({
		url: urlCol.route.uploadFile.url,
		method: 'post',
		data
	});
}
//分页获取poi信息
export function getRouteByPage(query){
	return request({
		url: urlCol.route.getRouteByPage.url,
		method: 'get',
		params:query
	});
}

//根据唯一标识获取路线信息
export function getRouteById(query){
	return request({
		url: urlCol.route.getRouteById.url,
		method: 'get',
		params:query
	});
}