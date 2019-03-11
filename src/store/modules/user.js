import {
  getToken,
  setToken,
  removeToken,
  setCookie
} from "@/utils/auth";
import {
  setStore,
  getStore
} from "@/utils/store";
import {
  validateNull
} from "@/utils/validate";
import {
  loginByUsername,
  getUserInfo,
  logout
} from "@/api/login";

import {
  login
} from "@/api/activity"
import {
  GetMenu,
  getMenusByCurrentUser
} from "@/api/menu";
import {
  encryption,
  getTree
} from "@/utils/util";

const user = {
  state: {
    userInfo: getStore({
      name: "userInfo"
    }) || {},
    permissions: getStore({
      name: "permissions"
    }) || {},
    roles: getStore({
      name: "roles"
    }) || [],
    menu: getStore({
      name: "menu"
    }) || [],
    isInitMenu: getStore({
      name: "isInitMenu"
    }) || false,
    access_token: getStore({
      name: "access_token"
    }) || "",
    refresh_token: getStore({
      name: "refresh_token"
    }) || "",
    user_id: getStore({
      name: "user_id"
    }) || ""
  },
  actions: {
    // 根据用户名登录
    LoginByUsername({
                      commit,
                      state,
                      dispatch
                    }, userInfo) {
      return new Promise((resolve, reject) => {
        //      const user = encryption({
        //        data: userInfo,
        //        key: '1234567887654321',
        //        param: ['password']
        //      })
        // let token = response["shu-token"];
        // setCookie(token);
        // commit("SET_ACCESS_TOKEN", token);
        // commit("SET_REFRESH_TOKEN", token);
        // commit("USER_ID", response["userId"]);
        // resolve();
        login(userInfo.username, userInfo.password)
          .then(response => {
            // let token = response["shu-token"];
            // setCookie(token);
            // commit("SET_ACCESS_TOKEN", token);
            // commit("SET_REFRESH_TOKEN", token);
            // commit("USER_ID", response["userId"]);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    GetTableData({
                   commit,
                   state,
                   dispatch
                 }, page) {
      return new Promise((resolve, reject) => {
        // 未定义
        // getTableData(page).then(res => {
        //   const data = res.data
        //   resolve(data)
        // })
      });
    },
    GetUserInfo({
                  commit,
                  state,
                  dispatch
                }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.user_id)
          .then(response => {
            const data = response;
            commit("SET_ROLES", [{
              id: 1,
              name: "tets"
            }]);
            commit("SET_USER_INFO", data);
            commit("SET_PERMISSIONS", []);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登出
    LogOut({
             commit,
             state
           }) {
      return new Promise((resolve, reject) => {
        //logout(state.access_token, state.refresh_token).then(() => {
        logout()
          .then(() => {
            // 清除菜单
            commit("SET_MENU", []);
            commit("SET_USER_INFO", []);
            // 清除权限
            commit("SET_PERMISSIONS", []);
            // 清除用户信息
            commit("SET_USER_INFO", {});
            commit("SET_ACCESS_TOKEN", "");
            commit("SET_REFRESH_TOKEN", "");
            commit("SET_ROLES", []);
            commit("DEL_ALL_TAG");
            removeToken();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 注销session
    FedLogOut({
                commit
              }) {
      return new Promise(resolve => {
        // 清除菜单
        commit("SET_MENU", []);
        // 清除权限
        commit("SET_PERMISSIONS", []);
        // 清除用户信息
        commit("SET_USER_INFO", {});
        commit("SET_ACCESS_TOKEN", "");
        commit("SET_REFRESH_TOKEN", "");
        commit("SET_ROLES", []);
        commit("DEL_ALL_TAG");
        removeToken();
        resolve();
      });
    },
    // 获取系统菜单
    GetMenu({
              commit
            }) {
      return new Promise(resolve => {
        let loginType = getStore({
          name: "loginType"
        });
        let menuData = null;
        //商户菜单
        const data = [
          {
            id: 1,
            parentId: -1,
            children: [{
              id: 2,
              parentId: 1,
              children: [],
              icon: "",
              name: "报表",
              url: "",
              spread: false,
              path: "index",
              component: "views/admin/home/index",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "首页",
              sort: 1
            }],
            icon: "icon-xitongguanli",
            name: "首页",
            url: null,
            spread: false,
            path: "/admin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "首页",
            sort: 1
          },
          {
            id: 2,
            parentId: -2,
            children: [{
              id: 3,
              parentId: 1,
              children: [],
              icon: "",
              name: "出售中",
              url: "",
              spread: false,
              path: "onOffer",
              component: "views/admin/commodity/list",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "出售中",
              sort: 1,
              query: {type: 1}
            },
              {
                id: 4,
                parentId: 2,
                children: [],
                icon: "",
                name: "已售空",
                url: "",
                spread: false,
                path: "sellOut",
                component: "views/admin/commodity/list",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "已售空",
                sort: 2,
                query: {type: 2}
              },
              {
                id: 5,
                parentId: 3,
                children: [],
                icon: "",
                name: "仓库中",
                url: "",
                spread: false,
                path: "warehouse",
                component: "views/admin/commodity/list",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "仓库中",
                sort: 3,
                query: {type: 3}
              },
              {
                id: 6,
                parentId: 4,
                children: [],
                icon: "",
                name: "回收站",
                url: "",
                spread: false,
                path: "trash",
                component: "views/admin/commodity/list",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "回收站",
                sort: 4,
                query: {type: 4}
              },
              {
                id: 7,
                parentId: 5,
                children: [],
                icon: "",
                name: "商品分类",
                url: "",
                spread: false,
                path: "classify",
                component: "views/admin/commodity/classify",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "商品分类",
                sort: 5
              },
              {
                id: 8,
                parentId: 6,
                children: [],
                icon: "",
                name: "品牌",
                url: "",
                spread: false,
                path: "brand",
                component: "views/admin/commodity/brand",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "品牌",
                sort: 5
              }
            ],
            icon: "icon-xitongguanli",
            name: "商品管理",
            url: null,
            spread: false,
            path: "/admin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "商品管理",
            sort: 1
          },
          {
            id: 3,
            parentId: -3,
            children: [{
              id: 8,
              parentId: 1,
              children: [],
              icon: "",
              name: "客户列表",
              url: "",
              spread: false,
              path: "poilist",
              component: "views/admin/poi/poilist",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "客户列表",
              sort: 1
            },
              {
                id: 9,
                parentId: 1,
                children: [],
                icon: "",
                name: "客户等级",
                url: "",
                spread: false,
                path: "level",
                component: "views/admin/poi/level",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "客户等级",
                sort: 2
              },
            ],
            icon: "icon-xitongguanli",
            name: "客户管理",
            url: null,
            spread: false,
            path: "/admin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "客户管理",
            sort: 3
          },
          {
            id: 4,
            parentId: -4,
            children: [
              {
                id: 111,
                parentId: 111,
                children: [],
                icon: "",
                name: "全部订单",
                url: "",
                spread: false,
                path: "orderlist",
                component: "views/admin/order/order",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "全部订单",
                sort: 8
              },
              {
                id: 10,
                parentId: 1,
                children: [],
                icon: "",
                name: "待发货",
                url: "",
                spread: false,
                path: "pending",
                component: "views/admin/order/order",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "待发货",
                sort: 1,
                query: {type: 2}
              },
              {
                id: 11,
                parentId: 2,
                children: [],
                icon: "",
                name: "待收货",
                url: "",
                spread: false,
                path: "daiShouHuo",
                component: "views/admin/order/order",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "待收货",
                sort: 2,
                query: {type: 3}
              },
              {
                id: 12,
                parentId: 2,
                children: [],
                icon: null,
                name: "待付款",
                url: "",
                spread: false,
                path: "position",
                component: "views/admin/order/order",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "待付款",
                sort: 3,
                query: {type: 1}
              },
              {
                id: 13,
                parentId: 13,
                children: [],
                icon: null,
                name: "已完成",
                url: "",
                spread: false,
                path: "editor",
                component: "views/admin/order/order",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "已完成",
                sort: 4,
                query: {type: 4}
              },
              {
                id: 14,
                parentId: 500,
                children: [],
                icon: null,
                name: "已关闭",
                url: "",
                spread: false,
                path: "date",
                component: "views/admin/order/order",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "已关闭",
                sort: 5,
                query: {type: -1}
              },
              // {
              //   id: 15,
              //   parentId: 15,
              //   children: [],
              //   icon: null,
              //   name: "退款申请",
              //   url: "",
              //   spread: false,
              //   path: "tuiKuan",
              //   component: "views/admin/order/tuiKuan",
              //   authority: null,
              //   redirect: null,
              //   code: null,
              //   type: "0",
              //   label: "退款申请",
              //   sort: 6
              // },
              // {
              //   id: 16,
              //   parentId: 16,
              //   children: [],
              //   icon: null,
              //   name: "退款完成",
              //   url: "",
              //   spread: false,
              //   path: "tuiKuanWanCheng",
              //   component: "views/admin/order/tuiKuanWanCheng",
              //   authority: null,
              //   redirect: null,
              //   code: null,
              //   type: "0",
              //   label: "退款完成",
              //   sort: 7
              // },
            ],
            icon: "icon-xitongguanli",
            name: "订单管理",
            url: null,
            spread: false,
            path: "/admin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "订单管理",
            sort: 4
          },
          {
            id: 5,
            parentId: -5,
            children: [{
              id: 17,
              parentId: 1,
              children: [],
              icon: "",
              name: "销售统计",
              url: "",
              spread: false,
              path: "salesCount",
              component: "views/admin/dataCount/salesCount",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "销售统计",
              sort: 1
            },
              {
                id: 18,
                parentId: 18,
                children: [],
                icon: "",
                name: "消费排行",
                url: "",
                spread: false,
                path: "xiaoFeiPaiHang",
                component: "views/admin/dataCount/xiaoFeiPaiHang",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "消费排行",
                sort: 2
              },
              {
                id: 19,
                parentId: 19,
                children: [],
                icon: null,
                name: "员工业绩",
                url: "",
                spread: false,
                path: "yuanGongYeJi",
                component: "views/admin/dataCount/yuanGongYeJi",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "员工业绩",
                sort: 3
              },
              {
                id: 20,
                parentId: 20,
                children: [],
                icon: null,
                name: "分组业绩",
                url: "",
                spread: false,
                path: "fenZuYeJi",
                component: "views/admin/dataCount/fenZuYeJi",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "分组业绩",
                sort: 4
              }
            ],
            icon: "icon-xitongguanli",
            name: "数据统计",
            url: null,
            spread: false,
            path: "/admin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "数据统计",
            sort: 5
          },
          {
            id: 6,
            parentId: -6,
            children: [{
              id: 21,
              parentId: 1,
              children: [],
              icon: "",
              name: "员工列表",
              url: "",
              spread: false,
              path: "staffList",
              component: "views/admin/staff/staffList",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "员工列表",
              sort: 1
            },
              {
                id: 22,
                parentId: 22,
                children: [],
                icon: "",
                name: "添加员工",
                url: "",
                spread: false,
                path: "addStaff",
                component: "views/admin/staff/addStaff",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "添加员工",
                sort: 2
              },
              {
                id: 23,
                parentId: 23,
                children: [],
                icon: null,
                name: "分组列表",
                url: "",
                spread: false,
                path: "groupList",
                component: "views/admin/staff/groupList",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "分组列表",
                sort: 6
              }
            ],
            icon: "icon-xitongguanli",
            name: "员工管理",
            url: null,
            spread: false,
            path: "/admin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "员工管理",
            sort: 6
          },
          {
            id: 7,
            parentId: -7,
            children: [{
              id: 24,
              parentId: 1,
              children: [],
              icon: "",
              name: "申请提现",
              url: "",
              spread: false,
              path: "appleDeposit",
              component: "views/admin/settlement/appleDeposit",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "申请提现",
              sort: 1
            },
              {
                id: 25,
                parentId: 25,
                children: [],
                icon: "",
                name: "待结算申请",
                url: "",
                spread: false,
                path: "daijiesuan",
                component: "views/admin/settlement/list",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "待结算申请",
                sort: 2,
                query: {type: 1}
              },
              {
                id: 26,
                parentId: 26,
                children: [],
                icon: null,
                name: "已结算申请",
                url: "",
                spread: false,
                path: "yijiesuan",
                component: "views/admin/settlement/list",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "已结算申请",
                sort: 3,
                query: {type: 2}
              }, {
                id: 27,
                parentId: 27,
                children: [],
                icon: null,
                name: "无效申请",
                url: "",
                spread: false,
                path: "wuxiao",
                component: "views/admin/settlement/list",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "无效申请",
                sort: 3,
                query: {type: 3}
              }
            ],
            icon: "icon-xitongguanli",
            name: "结算管理",
            url: null,
            spread: false,
            path: "/admin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "结算管理",
            sort: 7
          },
          {
            id: 8,
            parentId: -8,
            children: [{
              id: 28,
              parentId: 1,
              children: [],
              icon: "",
              name: "海报管理",
              url: "",
              spread: false,
              path: "posterList",
              component: "views/admin/poster/posterList",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "海报管理",
              sort: 1
            },
              {
                id: 29,
                parentId: 22,
                children: [],
                icon: "",
                name: "添加海报",
                url: "",
                spread: false,
                path: "addPoster",
                component: "views/admin/poster/addPoster",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "添加海报",
                sort: 2
              }
            ],
            icon: "icon-xitongguanli",
            name: "商品海报",
            url: null,
            spread: false,
            path: "/admin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "商品海报",
            sort: 8
          },
          {
            id: 9,
            parentId: -9,
            children: [
              {
                id: 31,
                parentId: 1,
                children: [],
                icon: "",
                name: "打印机设置",
                url: "",
                spread: false,
                path: "printSetting",
                component: "views/admin/system/printSetting",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "打印机设置",
                sort: 1
              },
              {
                id: 32,
                parentId: 1,
                children: [],
                icon: "",
                name: "电子面单模板",
                url: "",
                spread: false,
                path: "eleSheetModel",
                component: "views/admin/system/eleSheetModel",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "电子面单模板",
                sort: 1
              },
              {
                id: 33,
                parentId: 1,
                children: [],
                icon: "",
                name: "发货单模板",
                url: "",
                spread: false,
                path: "postModel",
                component: "views/admin/system/postModel",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "发货单模板",
                sort: 1
              },
              {
                id: 35,
                parentId: 31,
                children: [],
                icon: "",
                name: "快递单/发货单",
                url: "",
                spread: false,
                path: "expressList",
                component: "views/admin/system/expressList",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "快递单/发货单",
                sort: 2
              },
            ],
            icon: "icon-xitongguanli",
            name: "快递助手",
            url: null,
            spread: false,
            path: "/admin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "快递助手",
            sort: 9
          },
          {
            id: 10,
            parentId: -10,
            children: [{
              id: 21,
              parentId: 1,
              children: [],
              icon: "",
              name: "基础设置",
              url: "",
              spread: false,
              path: "activity",
              component: "views/admin/activity/activitylist",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "基础设置",
              sort: 1
            }, {
              id: 22,
              parentId: 1,
              children: [],
              icon: "",
              name: "店家地址",
              url: "",
              spread: false,
              path: "address",
              component: "views/admin/activity/addresslist",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "店家地址",
              sort: 1
            }, {
              id: 23,
              parentId: 1,
              children: [],
              icon: "",
              name: "运费设置",
              url: "",
              spread: false,
              path: "fare",
              component: "views/admin/activity/farelist",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "运费设置",
              sort: 1
            }],
            icon: "icon-xitongguanli",
            name: "系统设置",
            url: null,
            spread: false,
            path: "/admin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "系统设置",
            sort: 10
          }
        ];

        //超管菜单
        const suData = [
          {
            id: 1,
            parentId: -1,
            children: [{
              id: 2,
              parentId: 1,
              children: [],
              icon: "",
              name: "报表",
              url: "",
              spread: false,
              path: "index",
              component: "views/superAdmin/home/index",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "首页",
              sort: 1
            }],
            icon: "icon-xitongguanli",
            name: "首页",
            url: null,
            spread: false,
            path: "/admin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "首页",
            sort: 1
          },
          {
            id: 1,
            parentId: -1,
            children: [{
              id: 1,
              parentId: 1,
              children: [],
              icon: "",
              name: "待审核",
              url: "",
              spread: false,
              path: "onOffer",
              component: "views/superAdmin/goods/onOffer",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "待审核",
              sort: 1,
              query: {type: 5}
            },
              {
                id: 2,
                parentId: 1,
                children: [],
                icon: "",
                name: "出售中",
                url: "",
                spread: false,
                path: "toAudit",
                component: "views/superAdmin/goods/onOffer",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "出售中",
                sort: 1,
                query: {type: 1}
              }],
            icon: "icon-xitongguanli",
            name: "商品管理",
            url: null,
            spread: false,
            path: "/superAdmin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "商品管理",
            sort: 1
          },
          {
            id: 2,
            parentId: -1,
            children: [{
              id: 2,
              parentId: 1,
              children: [],
              icon: "",
              name: "客户列表",
              url: "",
              spread: false,
              path: "suClientList",
              component: "views/superAdmin/suClient/suClientList",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "客户列表",
              sort: 1
            }],
            icon: "icon-xitongguanli",
            name: "客户管理",
            url: null,
            spread: false,
            path: "/superAdmin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "客户管理",
            sort: 1
          },
          {
            id: 3,
            parentId: -2,
            children: [
              {
                id: 3,
                parentId: 1,
                children: [],
                icon: "",
                name: "订单列表",
                url: "",
                spread: false,
                path: "suOrderList",
                component: "views/superAdmin/suOrder/suOrderList",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "订单列表",
                sort: 1
              },
              // {
              //   id: 4,
              //   parentId: 1,
              //   children: [],
              //   icon: "",
              //   name: "退款申请",
              //   url: "",
              //   spread: false,
              //   path: "suTuiKuanShenQing",
              //   component: "views/superAdmin/suOrder/suTuiKuanShenQing",
              //   authority: null,
              //   redirect: null,
              //   code: null,
              //   type: "0",
              //   label: "退款申请",
              //   sort: 2
              // },
              // {
              //   id: 5,
              //   parentId: 1,
              //   children: [],
              //   icon: "",
              //   name: "退款完成",
              //   url: "",
              //   spread: false,
              //   path: "suTuiKuanWanChen",
              //   component: "views/superAdmin/suOrder/suTuiKuanWanChen",
              //   authority: null,
              //   redirect: null,
              //   code: null,
              //   type: "0",
              //   label: "退款完成",
              //   sort: 3
              // },
            ],
            icon: "icon-xitongguanli",
            name: "订单管理",
            url: null,
            spread: false,
            path: "/superAdmin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "订单管理",
            sort: 2
          },
          {
            id: 4,
            parentId: -1,
            children: [{
              id: 6,
              parentId: 1,
              children: [],
              icon: "",
              name: "销售统计",
              url: "",
              spread: false,
              path: "xiaoshouCount",
              component: "views/superAdmin/data/xiaoshouCount",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "销售统计",
              sort: 1
            }, {
              id: 2,
              parentId: 1,
              children: [],
              icon: "",
              name: "消费排行",
              url: "",
              spread: false,
              path: "xiaofeiCount",
              component: "views/superAdmin/data/xiaofeiCount",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "消费排行",
              sort: 1
            },
              // {
              //   id: 5,
              //   parentId: 1,
              //   children: [],
              //   icon: "",
              //   name: "商户统计",
              //   url: "",
              //   spread: false,
              //   path: "spshopCount",
              //   component: "views/superAdmin/data/spshopCount",
              //   authority: null,
              //   redirect: null,
              //   code: null,
              //   type: "0",
              //   label: "商户统计",
              //   sort: 1
              // }
            ],
            icon: "icon-xitongguanli",
            name: "数据统计",
            url: null,
            spread: false,
            path: "/superAdmin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "数据统计",
            sort: 1
          },
          {
            id: 5,
            parentId: -1,
            children: [
              {
                id: 1,
                parentId: 1,
                children: [],
                icon: "",
                name: "入驻中",
                url: "",
                spread: false,
                path: "settled",
                component: "views/superAdmin/contact/settled",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "入驻中",
                sort: 1,
                query: {type: 1}
              }, {
                id: 2,
                parentId: 1,
                children: [],
                icon: "",
                name: "暂停中",
                url: "",
                spread: false,
                path: "pause",
                component: "views/superAdmin/contact/settled",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "暂停中",
                sort: 1,
                query: {type: 0}
              }, {
                id: 3,
                parentId: 1,
                children: [],
                icon: "",
                name: "商户分类",
                url: "",
                spread: false,
                path: "classify",
                component: "views/superAdmin/contact/classify",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "商户分类",
                sort: 1
              }, {
                id: 4,
                parentId: 1,
                children: [],
                icon: "",
                name: "商户等级",
                url: "",
                spread: false,
                path: "levels",
                component: "views/superAdmin/contact/levels",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "商户等级",
                sort: 1
              }, {
                id: 5,
                parentId: 1,
                children: [],
                icon: "",
                name: "基础设置",
                url: "",
                spread: false,
                path: "config",
                component: "views/superAdmin/contact/config",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "基础设置",
                sort: 1
              }],
            icon: "icon-xitongguanli",
            name: "多商户",
            url: null,
            spread: false,
            path: "/superAdmin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "多商户",
            sort: 5
          },
          {
            id: 6,
            parentId: -1,
            children: [{
              id: 1,
              parentId: 1,
              children: [],
              icon: "",
              name: "待打款申请",
              url: "",
              spread: false,
              path: "daidakuan",
              component: "views/superAdmin/caiwu/list",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "待打款申请",
              sort: 1,
              query: {type: 1}
            }, {
              id: 2,
              parentId: 1,
              children: [],
              icon: "",
              name: "已打款申请",
              url: "",
              spread: false,
              path: "yidakuan",
              component: "views/superAdmin/caiwu/list",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "已打款申请",
              sort: 1,
              query: {type: 2}
            }, {
              id: 2,
              parentId: 1,
              children: [],
              icon: "",
              name: "无效申请",
              url: "",
              spread: false,
              path: "wuxiaoshenqing",
              component: "views/superAdmin/caiwu/list",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "无效申请",
              sort: 1,
              query: {type: 0}
            }],
            icon: "icon-xitongguanli",
            name: "财务",
            url: null,
            spread: false,
            path: "/superAdmin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "财务",
            sort: 1
          },
          {
            id: 7,
            parentId: -1,
            children: [{
              id: 1,
              parentId: 1,
              children: [],
              icon: "",
              name: "支付设置",
              url: "",
              spread: false,
              path: "payConfig",
              component: "views/superAdmin/configger/payConfig",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "支付设置",
              sort: 1
            }, {
              id: 2,
              parentId: 1,
              children: [],
              icon: "",
              name: "支付管理",
              url: "",
              spread: false,
              path: "payManager",
              component: "views/superAdmin/configger/payManager",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "支付管理",
              sort: 1
            },
              // {
              //   id: 3,
              //   parentId: 1,
              //   children: [],
              //   icon: "",
              //   name: "短消息库",
              //   url: "",
              //   spread: false,
              //   path: "info",
              //   component: "views/superAdmin/configger/info",
              //   authority: null,
              //   redirect: null,
              //   code: null,
              //   type: "0",
              //   label: "短消息库",
              //   sort: 1
              // },
              // {
              //   id: 4,
              //   parentId: 1,
              //   children: [],
              //   icon: "",
              //   name: "短消息接口",
              //   url: "",
              //   spread: false,
              //   path: "infoApi",
              //   component: "views/superAdmin/configger/infoApi",
              //   authority: null,
              //   redirect: null,
              //   code: null,
              //   type: "0",
              //   label: "短消息接口",
              //   sort: 1
              // }
            ],
            icon: "icon-xitongguanli",
            name: "设置",
            url: null,
            spread: false,
            path: "/superAdmin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "设置",
            sort: 1
          }];

        //发货员菜单
        const sendData = [
          {
            id: 1,
            parentId: -1,
            children: [{
              id: 2,
              parentId: 1,
              children: [],
              icon: "",
              name: "报表",
              url: "",
              spread: false,
              path: "index",
              component: "views/admin/home/index",
              authority: null,
              redirect: null,
              code: null,
              type: "0",
              label: "首页",
              sort: 1
            }],
            icon: "icon-xitongguanli",
            name: "首页",
            url: null,
            spread: false,
            path: "/admin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "首页",
            sort: 1
          },
          {
            id: 2,
            parentId: -2,
            children: [
              {
                id: 3,
                parentId: 1,
                children: [],
                icon: "",
                name: "订单列表",
                url: "",
                spread: false,
                path: "suOrderList",
                component: "views/admin/order/order",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "订单列表",
                sort: 1
              },
            ],
            icon: "icon-xitongguanli",
            name: "订单管理",
            url: null,
            spread: false,
            path: "/superAdmin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "订单管理",
            sort: 2
          },
          {
            id: 3,
            parentId: -9,
            children: [
              {
                id: 31,
                parentId: 1,
                children: [],
                icon: "",
                name: "打印机设置",
                url: "",
                spread: false,
                path: "printSetting",
                component: "views/admin/system/printSetting",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "打印机设置",
                sort: 1
              },
              {
                id: 32,
                parentId: 1,
                children: [],
                icon: "",
                name: "电子面单模板",
                url: "",
                spread: false,
                path: "eleSheetModel",
                component: "views/admin/system/eleSheetModel",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "电子面单模板",
                sort: 1
              },
              {
                id: 33,
                parentId: 1,
                children: [],
                icon: "",
                name: "发货单模板",
                url: "",
                spread: false,
                path: "postModel",
                component: "views/admin/system/postModel",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "发货单模板",
                sort: 1
              },
              {
                id: 35,
                parentId: 31,
                children: [],
                icon: "",
                name: "快递单/发货单",
                url: "",
                spread: false,
                path: "expressList",
                component: "views/admin/system/expressList",
                authority: null,
                redirect: null,
                code: null,
                type: "0",
                label: "快递单/发货单",
                sort: 2
              },
            ],
            icon: "icon-xitongguanli",
            name: "快递助手",
            url: null,
            spread: false,
            path: "/admin",
            component: "Layout",
            authority: null,
            redirect: null,
            code: null,
            type: "0",
            label: "快递助手",
            sort: 9
          }];

        if (!data) {
          return;
        }

        console.log(loginType);
        if (loginType === "sh-send") {
          menuData = sendData;
        } else if (loginType === "sh") {
          menuData = data;
        } else {
          menuData = suData;
        }
        menuData.forEach(ele => {
          ele.children.forEach(child => {
            if (!validateNull(child.component))
              child.path = `${ele.path}/${child.path}`;
          });
        });

        commit("SET_MENU", menuData);

        resolve(menuData);
      });
    }
  },
  mutations: {
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token;
      setStore({
        name: "access_token",
        content: state.access_token,
        type: "session"
      });
    },
    USER_ID: (state, user_id) => {
      state.user_id = user_id;
      setStore({
        name: "user_id",
        content: state.user_id,
        type: "session"
      });
    },
    SET_MENU: (state, menu) => {
      state.menu = menu;
      setStore({
        name: "menu",
        content: state.menu,
        type: "session"
      });
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
      setStore({
        name: "userInfo",
        content: state.userInfo,
        type: "session"
      });
    },
    SET_REFRESH_TOKEN: (state, rfToken) => {
      state.refresh_token = rfToken;
      setStore({
        name: "refresh_token",
        content: state.refresh_token,
        type: "session"
      });
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
      setStore({
        name: "roles",
        content: state.roles,
        type: "session"
      });
    },
    SET_PERMISSIONS: (state, permissions) => {
      const list = {};
      for (let i = 0; i < permissions.length; i++) {
        list[permissions[i]] = true;
      }
      state.permissions = list;
      setStore({
        name: "permissions",
        content: state.permissions,
        type: "session"
      });
    }
  }
};
export default user;
