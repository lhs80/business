//export const userName = state => state.userName
//export const isLogin = state => state.isLogin


const getters = {
  userName : state => state.userName,
  isLogin : state => state.isLogin,
  
  tag: state => state.tags.tag,
  website: state => state.common.website,
  theme: state => state.common.theme,
  isCollapse: state => state.common.isCollapse,
  isLock: state => state.common.isLock,
  // isFullScren: state => state.common.isFullScren,
  lockPasswd: state => state.common.lockPasswd,
  tagList: state => state.tags.tagList,
  tagCurrent: state => state.tags.tagCurrent,
  tagWel: state => state.tags.tagWel,
  access_token: state => state.user.access_token,
  refresh_token: state => state.user.refresh_token,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  menu: state => state.user.menu,
  errLog: state => state.errLog.errLog,
  loginType: state => state.common.loginType
}
export default getters