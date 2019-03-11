import router from "./router/router";
import store from "./store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth";
import { setTitle } from "@/utils/util";
import { validatenull } from "@/utils/validate";
import { checkLogin } from "@/api/common";
import { browser } from "@/utils/navigator";

// NProgress Configuration
NProgress.configure({
  showSpinner: false
});

function hasPermission(roles, permissionRoles) {
  if (!permissionRoles) return true;
  return roles.some(role => permissionRoles.indexOf(role) >= 0);
}
// const whiteList = ["/login", "/404", "/401", "/lock", "/home", "/route","/POI","/admin/index","/admin/poilist","/admin/level","/admin/onOffer","/admin/classify","/admin/pending","/admin/salesCount","/admin/sellOut"];
// const lockPage = "/lock";
// const noneHistoty = ["/active"];

router.beforeEach((to, from, next) => {
  // start progress bar
  NProgress.start();

  const value = to.query.src ? to.query.src : to.path;
  const label = to.query.name ? to.query.name : to.name;
  //  if (whiteList.indexOf(value) === -1 && noneHistoty.indexOf(value) === -1) {
    store.commit("ADD_TAG", {
      label: label,
      value: value,
      query: to.query
    });
  //  }

  if (store.getters.access_token) {
    // determine if there has token
    checkLogin({}).then(response => {
      if (!response) {
        store.dispatch("FedLogOut").then(() => {
          next({
            path: "/login"
          });
          NProgress.done();
        });
      } else {
        /* has token*/
        if (store.getters.isLock && to.path !== lockPage) {
          next({
            path: lockPage
          });
          NProgress.done();
        } else if (to.path === "/login") {
          next({
            path: "/"
          });
          NProgress.done();
        } else {
          if (store.getters.roles.length === 0) {
            store
              .dispatch("GetUserInfo")
              .then(res => {
                const roles = res.roles;
                next({ ...to, replace: true });
              })
              .catch(() => {
                store.dispatch("FedLogOut").then(() => {
                  next({
                    path: "/login"
                  });
                  NProgress.done();
                });
              });
          } else {
            next();
          }
        }
      }
    });
  } else {
    /* has no token*/
    //  if (whiteList.indexOf(to.path) !== -1) {
        //无手机端的页面
        next();
      
      
    //  } else {
    //    next("/login");
    //   let redirect = to.fullPath//如果来源路由有query
    //   next({
    //     path: "/login",
    //     query: { path: to.fullPath }
    //   });
    //   NProgress.done();
    // }
   }
});

// 寻找子菜单的父类
function findMenuParent(tag) {
  let tagCurrent = [];
  const menu = store.getters.menu;
  tagCurrent.push(tag);
  return tagCurrent;
  // //如果是一级菜单直接返回
  // for (let i = 0, j = menu.length; i < j; i++) {
  //     if (menu[i].href == tag.value) {
  //         tagCurrent.push(tag);
  //         return tagCurrent;
  //     }
  // }

  // let currentPathObj = menu.filter(item => {
  //     if (item.children.length == 1) {
  //         return item.children[0].href === tag.value;
  //     } else {
  //         let i = 0;
  //         let childArr = item.children;
  //         let len = childArr.length;
  //         while (i < len) {
  //             if (childArr[i].href === tag.value) {
  //                 return true;
  //                 break;
  //             }
  //             i++;
  //         }
  //         return false;
  //     }
  // })[0];
  // tagCurrent.push({
  //     label: currentPathObj.label,
  //     value: currentPathObj.href
  // });
  // tagCurrent.push(tag);
  // return tagCurrent;
}

router.afterEach((to, from) => {
  NProgress.done();
  setTimeout(() => {
    if (to.path === "/login") {
      setTitle("登录");
    } else {
      const tag = store.getters.tag;
      setTitle(tag.label);
      store.commit("SET_TAG_CURRENT", findMenuParent(tag));
    }
  }, 0);
});
