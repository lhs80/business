/*引入storage方法*/
import {
  setStore,
  getStore,
  removeStore
} from '@/utils/store'
/*引入验证方法*/
import {
  validatenull
} from '@/utils/validate'
/*普通配置信息 */
import website from '@/common/constant/website'

/*主状态管理信息*/
const common = {

  state: {
    isCollapse: false,
    // isFullScren: false,
    isLock: getStore({
      name: 'isLock'
    }) || false,
    theme: getStore({
      name: 'theme'
    }) || '#409EFF',
    lockPasswd: getStore({
      name: 'lockPasswd'
    }) || '',
    website: website,
    loginType:getStore({name:'loginType'})|| '',
  },
  actions: {
  
  },
  mutations: {
    SET_COLLAPSE: (state, action) => {
      state.isCollapse = !state.isCollapse
    },
    SET_LOGINTYPE:(state,num)=>{
      state.loginType = num;
      setStore({
        name: "loginType",
        content: state.loginType,
        type: "session"
      });
    },
  }
}
export default common
