import Vue from 'vue'
import request from "@/api/axios";
import urlCol from "@/common/urlCol";

/**
 * 检测登录是否有效
 * @param {*} params
 */
export const checkLogin = params => {
  return request({
    url: urlCol.common.checkLogin.url,
    method: "get",
    params
  });
};

Vue.prototype.timestampToTime = timestamp => {
  let date = new Date(timestamp*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1).toString().padStart(2, '0') + '-';
  let D = date.getDate().toString().padStart(2, '0') + ' ';
  let h = date.getHours().toString().padStart(2, '0') + ':';
  let m = date.getMinutes().toString().padStart(2, '0');
  //let s = date.getSeconds();
  return Y + M + D + h + m;
};

Vue.prototype.row2col = (jsonData, idField, colField, valueField, emptyValue) => {
  let result = [], //存储返回的数据
    idIndexData = {},//存储id在数组中的信息(位置)
    resultColumns = {},//存储列名数据
    curRecord = null;//存储当前数据
  let colFields = colField.split(','); //
  // 循环整个JSON数组：[{...},{...},{...},...]
  for (let idx = 0; idx < jsonData.length; idx++) {
    //当前json数据对象
    let cdata = jsonData[idx];
    //根据主键值，查找到结果数组中的索引号
    let idValue = cdata[idField];
    let num = idIndexData[idValue];//获取存储该id的数组索引号
    if (num != null) {
      curRecord = result[num];
    } else {
      //初始化数据时保持完整的结构信息 避免因为缺乏数据，缺乏指定的列数据
      curRecord = {};
    }
    // 指定的colFields列下的数据作为y轴，则取出该列的数据作为y轴即可
    for (let i in colFields) {
      let key = colFields[i];
      //获取到colField的值，作为列名
      let value = cdata[valueField];
      curRecord[value] = cdata[key];
      //存储列名
      resultColumns[value] = null;
      break;
    }

    //除数据内容外，还需要添加主键数据
    curRecord[idField] = idValue;
    //对象若为新建 则新增进数组
    if (num == null) {
      idIndexData[idValue] = result.push(curRecord) - 1;
    }
  }
  //数据检查 由于是将行数据作为列名，则可能会存在部分行缺少其他列数据，若缺少，则指定默认值

  for (let i in result) {
    for (let name in resultColumns) {
      if (!result[i].hasOwnProperty(name)) result[i][name] = emptyValue;
    }
  }
  return result;
};
