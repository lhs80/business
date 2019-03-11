//import Vue from 'vue'
//import Vuex from 'vuex'
//Vue.use(Vuex)
//
//const state = {
//	name: 'doudou',
//	age: '23'
//};
//const getters ={
//	getName(state){
//	var dd=sessionStorage.getItem('userName');
//	console.log("值"+dd);
//	state.name=dd;
//		return state.name
//	},
//	getAge(state){
//		return state.age
//	}
//};
//
//const mutations ={
//	nameAsync(state,msg){
//		sessionStorage.setItem("userName",msg);
//	   state.name=msg;
//	},
//	setAge(state,age){
//		state.age=age;
//	},
//	setSex(state,str){
//		state.sex=str;
//	}
//};
//
//const actions ={
//	//异步操作mutations 只是一个例子
//	nameAsync(context,name) {   
//		/* axios.get('http://127.0.0.1:8081/api/books')
//        .then(function (response) {   */         
//          context.commit('nameAsync',name);      
//       /* })
//        .catch(function (error) {
//          console.log(error)
//        })       */
//  },
//	clickAge(context){
//		context.commit('25');
//	},
//	getSex(context,num){
//		context.commit('new',125);
//	}
//};
//
//const store = new Vuex.Store({
//		state,
//		getters,
//		mutations,
//		actions
//});
//
//
//
//
//export default store;
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import common from './modules/common'
import tags from './modules/tags'
import errLog from './modules/errLog'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    common,
    errLog,
    tags
  },
  getters,
  mutations
});

export default store
