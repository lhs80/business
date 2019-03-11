//公用的一些配置信息
/*var baseUrl = {
	url: '10.16.30.38:9999/',
	name: 'admin'
}

export  {
  baseUrl
}*/
const iconfontVersion = [
  "567566_r22zi6t8noas8aor",
  "599693_0b5sleso3f1j1yvi",
  "667895_xte3dcfrvbo6r"
];
const iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
const codeUrl = `/admin/code`;
let baseURL = "http://sht.qicheen.com";


const NODE_ENV = process.env.NODE_ENV;
// 测试环境
if (NODE_ENV == "testing") baseURL = "http://sht.qicheen.com";
// 开发环境
else if (NODE_ENV == "development") baseURL = "http://sht.qicheen.com";
// 生产环境
// else if (NODE_ENV == "production") rootUrl = "http://60.205.216.103:9080";
else if (NODE_ENV == "production") baseURL = "http://sht.qicheen.com";

export { iconfontUrl, iconfontVersion, codeUrl, baseURL };
