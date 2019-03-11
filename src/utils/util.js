//引入验证方法
import { validateNull } from "./validate";

/**
 * 日期格式化
 */
export function dateFormat(date) {
  let format = "yyyy-MM-dd hh:mm:ss";
  if (date != "Invalid Date") {
    var o = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "h+": date.getHours(), //hour
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
      S: date.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format))
      format = format.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return format;
  }
  return "";
}
//初始化menu方法
export const initMenu = (router, menu) => {
  if (menu.length === 0) {
    return;
  }
  router.addRoutes(formatRoutes(menu));
};

export const formatRoutes = aMenu => {
  const aRouter = [];
  aMenu.forEach(oMenu => {
    const { path, component, name, icon, children } = oMenu;
    if (!validateNull(component)) {
      let filePath;
      const oRouter = {
        path: path,
        component(resolve) {
          let componentPath = "";
          if (component === "Layout") {
            require(["../components/index"], resolve);
            return;
          } else {
            componentPath = component;
          }
          require([`../${componentPath}.vue`], resolve);
        },
        name: name,
        icon: icon,
        children: validateNull(children) ? [] : formatRoutes(children)
      };
      aRouter.push(oRouter);
    }
  });
  return aRouter;
};

/**
 * 加密处理
 */
export const encryption = params => {
  let { data, type, param, key } = params;
  let result = JSON.parse(JSON.stringify(data));
  if (type === "Base64") {
    param.forEach(ele => {
      result[ele] = btoa(result[ele]);
    });
  } else {
    param.forEach(ele => {
      var data = result[ele];
      key = CryptoJS.enc.Latin1.parse(key);
      var iv = key;
      //加密
      var encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      });
      result[ele] = encrypted.toString();
    });
  }
  return result;
};

/**
 * 设置浏览器头部标题
 */
export const setTitle = function(title) {
  title = title ? `${title}` : "上海大学-校园智能导引与信息查询系统";
  window.document.title = title;
};
/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
  if (fullscreenEnable()) {
    exitFullScreen();
  } else {
    reqFullScreen();
  }
};
// /**
//  * esc监听全屏
//  */
// export const listenfullscreen = callback => {
//   function listen() {
//     callback();
//   }
//   document.addEventListener("fullscreenchange", function(e) {
//     listen();
//   });
//   document.addEventListener("mozfullscreenchange", function(e) {
//     listen();
//   });
//   document.addEventListener("webkitfullscreenchange", function(e) {
//     listen();
//   });
//   document.addEventListener("msfullscreenchange", function(e) {
//     listen();
//   });
// };

// /**
//  * 浏览器判断是否全屏
//  */
// export const fullscreenEnable = () => {
//   var isFullscreen =
//     document.fullscreenEnabled ||
//     window.fullScreen ||
//     document.mozFullscreenEnabled ||
//     document.webkitIsFullScreen;
//   return isFullscreen;
// };

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  }
};

/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen();
  }
};

/**
 * 递归寻找子类的父类
 */
export const findParent = (menu, id) => {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].children.length !== 0) {
      for (let j = 0; j < menu[i].children.length; j++) {
        if (menu[i].children[j].id === id) {
          return menu[i];
        } else {
          if (menu[i].children[j].children.length !== 0) {
            return findParent(menu[i].children[j].children, id);
          }
        }
      }
    }
  }
};

/**
 * 总体路由处理器
 */
export const resolveUrlPath = (url, name) => {
  let reqUrl = url;
  if (url.indexOf("#") !== -1 && url.indexOf("http") === -1) {
    const port = reqUrl.substr(reqUrl.indexOf(":"));
    reqUrl = `/myiframe/urlPath?src=${baseUrl}${port}${reqUrl
      .replace("#", "")
      .replace(port, "")}}&name=${name}`;
  } else if (url.indexOf("http") !== -1) {
    reqUrl = `/myiframe/urlPath?src=${reqUrl}&name=${name}`;
  } else {
    reqUrl = `${reqUrl}`;
  }
  return reqUrl;
};

/**
 * 总体路由设置器
 */
export const setUrlPath = $route => {
  let value = "";
  if ($route.query.src) {
    value = $route.query.src;
  } else {
    value = $route.path;
  }
  return value;
};

/**
 * 动态插入css
 */
export const loadStyle = url => {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  const head = document.getElementsByTagName("head")[0];
  head.appendChild(link);
};

/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic, value) => {
  let result = "";
  if (validateNull(dic)) return value;
  if (typeof value === "string" || typeof value === "number") {
    let index = 0;
    index = findArray(dic, value);
    if (index !== -1) {
      result = dic[index].label;
    } else {
      result = value;
    }
  } else if (value instanceof Array) {
    result = [];
    let index = 0;
    value.forEach(ele => {
      index = findArray(dic, ele);
      if (index !== -1) {
        result.push(dic[index].label);
      } else {
        result.push(value);
      }
    });
    result = result.toString();
  }
  return result;
};

/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
  for (let i = 0; i < dic.length; i++) {
    if (dic[i].value === value) {
      return i;
    }
  }
  return -1;
};

/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = "";
  random = Math.ceil(Math.random() * 100000000000000)
    .toString()
    .substr(0, typeof len === "number" ? len : 4);
  if (date) random = random + Date.now();
  return random;
};

export const int2Str = val => {
  return val.toString();
};

export const encode = A => {
  let K =
    "ABCDEFGHIJKLMNOP" +
    "QRSTUVWXYZabcdef" +
    "ghijklmnopqrstuv" +
    "wxyz0123456789+/" +
    "=";
  let R = "";
  let a,
    b,
    c = "";
  let d,
    e,
    f,
    g = "";
  let i = 0;
  do {
    a = A.charCodeAt(i++);
    b = A.charCodeAt(i++);
    c = A.charCodeAt(i++);
    d = a >> 2;
    e = ((a & 3) << 4) | (b >> 4);
    f = ((b & 15) << 2) | (c >> 6);
    g = c & 63;
    if (isNaN(b)) {
      f = g = 64;
    } else if (isNaN(c)) {
      g = 64;
    }
    R = R + K.charAt(d) + K.charAt(e) + K.charAt(f) + K.charAt(g);
    a = b = c = "";
    d = e = f = g = "";
  } while (i < A.length);
  return R;
};

/*数据列表转换成树形结构*/
export const getTree = (data, attributes) => {
  var resData = data;
  var tree = [];

  for (var i = 0; i < resData.length; i++) {
    if (resData[i][attributes.parentId] === attributes.rootId) {
      var attrs = {};
      attrs.id = resData[i][attributes.id];
      attrs.title = resData[i][attributes.name];
      attrs.sort = resData[i][attributes.sort];
      attrs.children = [];
      for (var p in resData[i]) {
        attrs[p] = resData[i][p];
      }

      tree.push(attrs);
      resData.splice(i, 1);
      i--;
    }
  }
  // 将树排序
  tree = sort(tree);
  run(tree);
  function run(chiArr) {
    if (resData.length !== 0) {
      for (var i = 0; i < chiArr.length; i++) {
        for (var j = 0; j < resData.length; j++) {
          if (chiArr[i].id === resData[j][attributes.parentId]) {
            var attrs = {};
            attrs.id = resData[j][attributes.id];
            attrs.title = resData[j][attributes.name];
            attrs.children = [];

            for (var p in resData[j]) {
              attrs[p] = resData[j][p];
            }

            chiArr[i].children.push(attrs);
            resData.splice(j, 1);
            j--;
          }
        }
        run(chiArr[i].children);
      }
    }
  }
  function sort(elements) {
    var len = elements.length;
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
        if (elements[j].sort > elements[j + 1].sort) {
          // 相邻元素两两对比
          var temp = elements[j + 1]; // 元素交换
          elements[j + 1] = elements[j];
          elements[j] = temp;
        }
      }
    }
    return elements;
  }

  return tree;
};

export const GUID = () => {
  this.date = new Date(); /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
  if (typeof this.newGUID != "function") {
    /* 生成GUID码 */
    GUID.prototype.newGUID = function() {
      this.date = new Date();
      let guidStr = "";
      let sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
      let sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
      for (let i = 0; i < 9; i++) {
        guidStr += Math.floor(Math.random() * 16).toString(16);
      }
      guidStr += sexadecimalDate;
      guidStr += sexadecimalTime;
      while (guidStr.length < 32) {
        guidStr += Math.floor(Math.random() * 16).toString(16);
      }
      return this.formatGUID(guidStr);
    };
    /* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
    GUID.prototype.getGUIDDate = function() {
      return (
        this.date.getFullYear() +
        this.addZero(this.date.getMonth() + 1) +
        this.addZero(this.date.getDay())
      );
    };
    /* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
    GUID.prototype.getGUIDTime = function() {
      return (
        this.addZero(this.date.getHours()) +
        this.addZero(this.date.getMinutes()) +
        this.addZero(this.date.getSeconds()) +
        this.addZero(parseInt(this.date.getMilliseconds() / 10))
      );
    };
    /* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
    GUID.prototype.addZero = function(num) {
      if (Number(num).toString() != "NaN" && num >= 0 && num < 10) {
        return "0" + Math.floor(num);
      } else {
        return num.toString();
      }
    };
    /*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */ GUID.prototype.hexadecimal = function(
      num,
      x,
      y
    ) {
      if (y != undefined) {
        return parseInt(num.toString(), y).toString(x);
      } else {
        return parseInt(num.toString()).toString(x);
      }
    };
    /* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
    GUID.prototype.formatGUID = function(guidStr) {
      let str1 = guidStr.slice(0, 8) + "-",
        str2 = guidStr.slice(8, 12) + "-",
        str3 = guidStr.slice(12, 16) + "-",
        str4 = guidStr.slice(16, 20) + "-",
        str5 = guidStr.slice(20);
      return str1 + str2 + str3 + str4 + str5;
    };
  }
};

/*1.用浏览器内部转换器实现html转码*/
export const htmlEncode = html => {
  //1.首先动态创建一个容器标签元素，如DIV
  var temp = document.createElement("div");
  //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
  temp.textContent != undefined
    ? (temp.textContent = html)
    : (temp.innerText = html);
  //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
  var output = temp.innerHTML;
  temp = null;
  return output;
};
/*2.用浏览器内部转换器实现html解码*/
export const htmlDecode = text => {
  //1.首先动态创建一个容器标签元素，如DIV
  var temp = document.createElement("div");
  //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
  temp.innerHTML = text;
  //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
  var output = temp.innerText || temp.textContent;
  temp = null;
  return output;
};

/**秒转时分秒 */
export const secondToDate = s => {
  var h =
    Math.floor(s / 3600) < 10
      ? "0" + Math.floor(s / 3600)
      : Math.floor(s / 3600);
  var m =
    Math.floor((s / 60) % 60) < 10
      ? "0" + Math.floor((s / 60) % 60)
      : Math.floor((s / 60) % 60);
  var s =
    Math.floor(s % 60) < 10 ? "0" + Math.floor(s % 60) : Math.floor(s % 60);
  return h + ":" + m + ":" + s;
};
