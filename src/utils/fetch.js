/*import axios from 'axios'
import { Message } from 'element-ui'
import { baseUrl } from "@/common/constant/conatant";

axios.defaults.baseURL = baseUrl // 设置全局的baseUrl

// axios request拦截器
axios.interceptors.request.use(
  config => {

    return config
  },
  error => {

    return Promise.reject(error)
  })

// axios reponse拦截器
axios.interceptors.response.use(
  response => {
    // ajax 返回状态
    const res = response.data
    // 状态不为200的时候
    if (res.data.code !== 200) {
      Message({
        message: res.errorMsg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res.errorMsg)
    } else {
      return Promise.resolve(response.data)
    }
  },
  error => {
    return Promise.reject(error)
  }
)

// export default instance;
export default axios
*/