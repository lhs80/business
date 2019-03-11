////更改用户状态信息
//
//export const userStatus =(state,user)=>{
//	if(user){
//		state.userName =User
//		state.isLogin = true
//	}else if(user == null){
//		//登出清空sessStorage里的东西
//		sessionStorage.setItem("userName",null);
//		sessionStorage.setItem("userToken","");
//		state.userName=null;
//		state.isLogin=false;
//		state.token="";
//	}
//}
////登入保存信息e
//export const loginIn(state,data){
//	sessionStorage.setItem("userName",data);
//	state.userName=data
//}
//
// export const LogOut = (state) => {
//   sessionStorage.removeItem("userName");
//   state.userName = ""
// };
