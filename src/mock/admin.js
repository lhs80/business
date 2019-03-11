//数据模板定义 
import Mock from 'mockjs'
import { dateFormat } from '@/filters/'
/*用于单元测试的内容  获取随机内容的东西*/
let userList = []
for (let i = 0; i < 2; i++) {
    userList.push(Mock.mock({
        id: '@increment',
        name: Mock.mock('@cname'),
        username: Mock.mock('@last'),
        grade: [0, 1],
        state: 0,
        date: dateFormat(new Date()),
    }))
}
//用户列表数据
export const userTableData = {
    total: 11,
    pageSize: 10,
    tableData: userList
};


let roleList = []
for (let i = 0; i < 2; i++) {
    roleList.push(Mock.mock({
        id: '@increment',
        name: Mock.mock('@cname'),
        date: dateFormat(new Date()),
        check: [1, 3, 5]
    }))
}
export const roleTableData = {
    total: 11,
    pageSize: 10,
    tableData: roleList
};

