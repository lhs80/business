import fetch from '../utils/fetch'


// 获取所有表格信息
export function getInfo (current,size) {
	var tableData={
		current,
		size
	}
  return fetch({
    url: 'http://10.16.30.24:8080/api/area/v1/getAreas',
    method: 'get',
    tableData
  });
}
