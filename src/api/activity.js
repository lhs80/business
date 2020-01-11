import request from '@/api/axios'
import urlCol from '@/common/urlCol'
import qs from 'qs';

//商户登录接口
export function login(data) {
	return request({
		url: urlCol.login.login.url,
		method: 'post',
		data
	});
}

// 超管登录接口
export function supLogin(data) {
	return request({
		url: urlCol.login.supLogin.url,
		method: 'post',
		data: qs.stringify(data),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});
}

//商户商品列表
export function getGoodsList(params) {
	return request({
		url: urlCol.commodity.getGoodsList.url,
		method: 'get',
		params
	});
}


//添加商品
export function addGoods(data) {
	return request({
		url: urlCol.commodity.addGoods.url,
		method: 'post',
		data
	});
}

//修改商品
export function editGoodsFun(data) {
	return request({
		url: urlCol.commodity.updateGoods.url,
		method: 'post',
		data
	});
}

//查询商品详情
export function queryGoodsDetailFun(params) {
	return request({
		url: urlCol.commodity.getGoodsDetail.url,
		method: 'get',
		params
	});
}

/**
 * 运费模板
 */
export function getAllExpressTempFun() {
	return request({
		url: urlCol.commodity.getAllExpressTemp.url,
		method: 'get'
	});
}

/**
 * 创建空的规格
 **/
export function makeNewNormFun() {
	return request({
		url: urlCol.commodity.makeNewNorm.url,
		method: 'post',
	});
}

/**
 * 创建空的规格项
 **/
export function makeNewNormItemFun(data) {
	return request({
		url: urlCol.commodity.makeNewNormItem.url,
		method: 'post',
		data
	});
}

/**
 * 商户修改商品状态
 **/
export function setGoodsStatus(data) {
	return request({
		url: urlCol.commodity.setGoodsStatus.url,
		method: 'post',
		data
	});
}

/**
 * 批量修改商品分类
 **/
export function batchSetGoodsCatFun(data) {
	return request({
		url: urlCol.commodity.batchSetGoodsCat.url,
		method: 'post',
		data
	});
}

/**
 * 商户删除商品
 **/
export function delGoods(data) {
	return request({
		url: urlCol.commodity.delGoods.url,
		method: 'post',
		data
	});
}

/**
 * 添加商品类别
 **/
export function addOrEditGoodsCat(data) {
	return request({
		url: urlCol.commodity.editGoodsCat.url,
		method: 'post',
		data
	});
}

/**
 * 全部商品类别
 **/
export function getGoodsCat() {
	return request({
		url: urlCol.commodity.getAllGoodsCat.url,
		method: 'get',
	});
}

/**
 * 删除商品类别
 **/
export function delGoodsCat(data) {
	return request({
		url: urlCol.commodity.delGoodsCat.url,
		method: 'post',
		data
	});
}

/**
 * 添加商品品牌
 **/
export function addBrand(data) {
	return request({
		url: urlCol.brand.addBrand.url,
		method: 'post',
		data
	});
}

/**
 * 修改商品品牌
 **/
export function editBrand(data) {
	return request({
		url: urlCol.brand.updateBrand.url,
		method: 'post',
		data: qs.stringify(data),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});
}

/**
 * 商品品牌
 **/
export function getBrand() {
	return request({
		url: urlCol.brand.getAllBrand.url,
		method: 'get',
	});
}

/**
 * 删除商品品牌
 **/
export function delBrand(data) {
	return request({
		url: urlCol.brand.delBrand.url,
		method: 'post',
		data
	});
}


/**
 * 所有订单
 **/
export function orderListFun(params) {
	return request({
		url: urlCol.order.orderList.url,
		method: 'get',
		params
	});
}


/**
 * 订单详情
 **/
export function getOrderDetailFun(params) {
	return request({
		url: urlCol.order.orderDetail.url,
		method: 'get',
		params
	});
}

/**
 * 修改订单地址
 **/
export function updateOrderAddressFun(data) {
	return request({
		url: urlCol.order.updateOrderAddress.url,
		method: 'post',
		data
	});
}

/**
 * 发货
 **/
export function deliveExpressFun(data) {
	return request({
		url: urlCol.order.deliveExpress.url,
		method: 'post',
		data
	});
}

/**
 * 所有快递公司
 **/
export function allExpressFun() {
	return request({
		url: urlCol.order.allExpress.url,
		method: 'get',
	});
}

/**
 * 销售统计
 **/
export function salesStatisticsFun(params) {
	return request({
		url: urlCol.dataCount.salesStatistics.url,
		method: 'get',
		params
	});
}

/**
 * 消费排行
 **/
export function xfRankFun(params) {
	return request({
		url: urlCol.dataCount.xfRank.url,
		method: 'get',
		params
	});
}

/**
 * 消费排行
 **/
export function shopIndexDataFun() {
	return request({
		url: urlCol.dataCount.homeReport.url,
		method: 'get'
	});
}

/**
 * 商品销售排行
 **/
export function goodsSalesRankFun() {
	return request({
		url: urlCol.dataCount.goodsSalesRank.url,
		method: 'get'
	});
}


/**
 * 业务员排名
 **/
export function salesRankFun(params) {
	return request({
		url: urlCol.dataCount.salesRank.url,
		method: 'get',
		params
	});
}

/**
 * 业务员分组排名
 **/
export function salesGroupRankFun(params) {
	return request({
		url: urlCol.dataCount.salesGroupRank.url,
		method: 'get',
		params
	});
}

/**
 * 所有员工
 **/
export function getAllUserByMchFun(params) {
	return request({
		url: urlCol.staff.getAllUserByMch.url,
		method: 'get',
		params
	});
}

/**
 * 所有员工分组
 **/
export function getAllUserGroupFun() {
	return request({
		url: urlCol.staff.getAllUserGroup.url,
		method: 'get',
	});
}

/**
 * 从分组中删除员工
 **/
export function delMerchantUserFromGroupFun(data) {
	return request({
		url: urlCol.staff.delMerchantUserFromGroup.url,
		method: 'post',
		data
	});
}

/**
 * 新增员工账号
 **/
export function makeNewUserFun(data) {
	return request({
		url: urlCol.staff.makeNewUser.url,
		method: 'post',
		data
	});
}

/**
 * 修改员工分组
 **/
export function changeEmployeeGroupFun(data) {
	return request({
		url: urlCol.staff.changeEmployeeGroup.url,
		method: 'post',
		data
	});
}

/**
 * 更新员工信息
 **/
export function updateUserFun(data) {
	return request({
		url: urlCol.staff.updateUser.url,
		method: 'post',
		data
	});
}

/**
 * 删除员工
 **/
export function delMerchantUserFun(data) {
	return request({
		url: urlCol.staff.delMerchantUser.url,
		method: 'post',
		data
	});
}

/**
 * 新增分组
 **/
export function makeUserGroupFun(data) {
	return request({
		url: urlCol.staff.makeUserGroup.url,
		method: 'post',
		data
	});
}

/**
 * 删除分组
 **/
export function delUserGroupFuns(data) {
	return request({
		url: urlCol.staff.delUserGroup.url,
		method: 'post',
		data
	});
}

/**
 * 申请提现
 **/
export function applicationForCashFun() {
	return request({
		url: urlCol.account.applicationForCash.url,
		method: 'get',
	});
}

/**
 * 申请提现的银行
 **/
export function getSysSupportBanksFun() {
	return request({
		url: urlCol.account.getSysSupportBanks.url,
		method: 'get',
	});
}

/**
 * 提交提现申请
 **/
export function addTxOrderFun(data) {
	return request({
		url: urlCol.account.addTxOrder.url,
		method: 'post',
		data
	});
}

/**
 * 申请提现列表
 **/
export function getTxOrderListFun(params) {
	return request({
		url: urlCol.account.getTxOrderList.url,
		method: 'get',
		params
	});
}

/**
 * 海报列表
 **/
export function postListFun(params) {
	return request({
		url: urlCol.post.list.url,
		method: 'get',
		params
	});
}

/**
 * 删除海报列表
 **/
export function delPostFun(data) {
	return request({
		url: urlCol.post.del.url,
		method: 'post',
		data
	});
}

/**
 * 新增海报列表
 **/
export function addPostFun(data) {
	return request({
		url: urlCol.post.add.url,
		method: 'post',
		data
	});
}

/**
 * 海报详情
 **/
export function queryPostDetailFun(params) {
	return request({
		url: urlCol.post.detail.url,
		method: 'get',
		params
	});
}

/**
 * 更新海报
 **/
export function updatePostFun(data) {
	return request({
		url: urlCol.post.update.url,
		method: 'post',
		data
	});
}

/**
 * 地址列表
 **/
export function addressListFun() {
	return request({
		url: urlCol.setting.addressList.url,
		method: 'get',
	});
}

/**
 * 添加地址列表
 **/
export function addAddressListFun(data) {
	return request({
		url: urlCol.setting.addressAdd.url,
		method: 'post',
		data
	});
}

/**
 * 修改地址列表
 **/
export function editAddressListFun(data) {
	return request({
		url: urlCol.setting.addressEdit.url,
		method: 'post',
		data
	});
}

/**
 * 删除地址列表
 **/
export function delAddressListFun(data) {
	return request({
		url: urlCol.setting.addressDel.url,
		method: 'post',
		data
	});
}

/**
 * 新增电子面板模板
 **/
export function addEleSheetModelFun(data) {
	return request({
		url: urlCol.express.sheet.add.url,
		method: 'post',
		data
	});
}

/**
 * 电子面板模板列表
 **/
export function eleSheetModelListFun() {
	return request({
		url: urlCol.express.sheet.list.url,
		method: 'get',
	});
}

/**
 * 删除电子面板模板
 **/
export function delEleSheetModelFun(data) {
	return request({
		url: urlCol.express.sheet.del.url,
		method: 'post',
		data
	});
}

/**
 * 修改电子面板模板
 **/
export function updateEleSheetModelFun(data) {
	return request({
		url: urlCol.express.sheet.update.url,
		method: 'post',
		data
	});
}

/**
 * 设置打印机信息
 **/
export function settingExpressFun(data) {
	return request({
		url: urlCol.express.setting.update.url,
		method: 'post',
		data
	});
}

/**
 * 获取打印机设置
 **/
export function queryExpressFun() {
	return request({
		url: urlCol.express.setting.query.url,
		method: 'get',
	});
}

/**
 * 快递单/发货单
 **/
export function deliveSettingFun(data) {
	return request({
		url: urlCol.express.delive.url,
		method: 'post',
		data
	});
}

/**
 * 添加运费模板
 **/
export function addExpressTempFun(data) {
	return request({
		url: urlCol.commodity.addExpressTemp.url,
		method: 'post',
		data
	});
}

/**
 * 编辑运费模板
 **/
export function editExpressTempFun(data) {
	return request({
		url: urlCol.commodity.editExpressTemp.url,
		method: 'post',
		data
	});
}

/**
 * 删除运费模板
 **/
export function delExpressTempFun(data) {
	return request({
		url: urlCol.commodity.delExpressTemp.url,
		method: 'post',
		data
	});
}

/**
 * 获取打印机信息
 **/
export function getPrintInfoFun(params) {
	return request({
		url: urlCol.print.get.url,
		method: 'get',
		params
	});
}


/**
 * 设置打印机信息
 **/
export function setPrintInfoFun(data) {
	return request({
		url: urlCol.print.set.url,
		method: 'post',
		data
	});
}


/**
 * 打印发货单
 **/
export function printFHDFun(data) {
	return request({
		url: urlCol.express.printHFD.url,
		method: 'post',
		data
	});
}


/**********************************超管*************************************/

/**
 * 商品列表
 * */
export function adminGoodListFun(params) {
	return request({
		url: urlCol.superAdmin.goods.list.url,
		method: 'get',
		params
	})
}

/**
 * 更新商品状态
 * */
export function updateGoodStatus(data) {
	return request({
		url: urlCol.superAdmin.goods.updateStatus.url,
		method: 'post',
		data
	})
}

/**
 * 删除商品
 * */
export function delGoodsFun(data) {
	return request({
		url: urlCol.superAdmin.goods.del.url,
		method: 'post',
		data
	})
}

/**
 * 客户列表
 * */
export function adminClientList(params) {
	return request({
		url: urlCol.superAdmin.client.list.url,
		method: 'get',
		params
	})
}

/**
 * 订单列表
 * */
export function adminOrderList(params) {
	return request({
		url: urlCol.superAdmin.order.list.url,
		method: 'get',
		params
	})
}

/**
 * 销售统计
 * */
export function adminSaleCountFun(params) {
	return request({
		url: urlCol.superAdmin.data.sale.url,
		method: 'get',
		params
	})
}

/**
 * 消费统计
 * */
export function adminCustomerCountFun(params) {
	return request({
		url: urlCol.superAdmin.data.customer.url,
		method: 'get',
		params
	})
}

/**
 * 商户统计
 * */
export function adminShopCountFun(params) {
	return request({
		url: urlCol.superAdmin.data.shop.url,
		method: 'get',
		params
	})
}


/**
 * 提现申请列表
 * */
export function adminTxOrderListFun(params) {
	return request({
		url: urlCol.superAdmin.account.list.url,
		method: 'get',
		params
	})
}


/**
 * 处理提现申请
 * */
export function adminHandleTxOrderFun(data) {
	return request({
		url: urlCol.superAdmin.account.handle.url,
		method: 'post',
		data
	})
}


/**
 * 所有支付模板
 * */
export function getPayModulesFun() {
	return request({
		url: urlCol.superAdmin.paySetting.list.url,
		method: 'get',
	})
}

/**
 * 启用的支付模板
 * */
export function usingModuleFun(params) {
	return request({
		url: urlCol.superAdmin.paySetting.usingModule.url,
		method: 'get',
		params
	})
}

/**
 * 设置启用的支付模板
 * */
export function settingModuleFun(data) {
	return request({
		url: urlCol.superAdmin.paySetting.settingModule.url,
		method: 'post',
		data
	})
}


/**
 * 添加支付模板
 * */
export function addModuleFun(data) {
	return request({
		url: urlCol.superAdmin.paySetting.addModule.url,
		method: 'post',
		data
	})
}

/**
 * 添加支付模板
 * */
export function delModuleFun(data) {
	return request({
		url: urlCol.superAdmin.paySetting.delModule.url,
		method: 'post',
		data
	})
}

/**
 * 修改支付模板
 * */
export function updateModuleFun(data) {
	return request({
		url: urlCol.superAdmin.paySetting.updateModule.url,
		method: 'post',
		data
	})
}

/**
 * 商户列表
 * */
export function adminShopListFun(params) {
	return request({
		url: urlCol.superAdmin.shop.list.url,
		method: 'get',
		params
	})
}

/**
 * 修改商户状态
 * */
export function updateStatusFun(data) {
	return request({
		url: urlCol.superAdmin.shop.updateStatus.url,
		method: 'post',
		data
	})
}


/**
 * 修改商户等级
 * */
export function updateLevelFun(data) {
	return request({
		url: urlCol.superAdmin.shop.updateLevel.url,
		method: 'post',
		data
	})
}

/**
 * 修改商户密码
 * */
export function editShopPwdFun(data) {
	return request({
		url: urlCol.superAdmin.shop.editShopPwd.url,
		method: 'post',
		data
	})
}

/**
 * 商户类型
 * */
export function adminShopTypeListFun() {
	return request({
		url: urlCol.superAdmin.shop.typeList.url,
		method: 'get',
	})
}

/**
 * 删除商户类型
 * */
export function adminDelShopTypeFun(data) {
	return request({
		url: urlCol.superAdmin.shop.delType.url,
		method: 'post',
		data
	})
}

/**
 * 新增或修改
 * */
export function adminShopTypeAddOreditFun(data) {
	return request({
		url: urlCol.superAdmin.shop.addOredit.url,
		method: 'post',
		data
	})
}

/**
 * 所有等级
 * */
export function adminShopLevelListFun() {
	return request({
		url: urlCol.superAdmin.shop.level.url,
		method: 'get',
	})
}

/**
 * 所有等级
 * */
export function adminDelShopLevelFun(data) {
	return request({
		url: urlCol.superAdmin.shop.delLevel.url,
		method: 'post',
		data
	})
}

/**
 * 添加或修改等级
 * */
export function adminAddOrEditLevelFun(data) {
	return request({
		url: urlCol.superAdmin.shop.addOrEditLevel.url,
		method: 'post',
		data
	})
}

/**
 * 基本设置
 * */
export function baseSettingFun(data) {
	return request({
		url: urlCol.superAdmin.baseInfo.baseSetting.url,
		method: 'post',
		data
	})
}

/**
 * 获取基本设置
 * */
export function queryInfoFun() {
	return request({
		url: urlCol.superAdmin.baseInfo.queryInfo.url,
		method: 'get',
	})
}

/**
 * 获取用户协议
 * */
export function queryAgreeFun() {
	return request({
		url: urlCol.superAdmin.baseInfo.queryAgree.url,
		method: 'get',
	})
}

/**
 * 设置用户协议
 * */
export function settingAgreeFun(data) {
	return request({
		url: urlCol.superAdmin.baseInfo.settingAgree.url,
		method: 'post',
		data
	})
}

/**
 * 首页数据
 * */
export function adminIndexData() {
	return request({
		url: urlCol.superAdmin.data.total.url,
		method: 'get',
	})
}


/**
 * 客户公海--客户列表
 * */
export function openCustomerList(params) {
	return request({
		url: urlCol.open.sheet.list.url,
		method: 'get',
		params
	})
}

/**
 * 客户公海--导入客户
 * */
export function exportCustomerFun(data) {
	return request({
		url: urlCol.open.sheet.export.url,
		method: 'post',
		data
	})
}

/**
 * 客户公海--删除客户
 * */
export function delOpenCustomer(data) {
	return request({
		url: urlCol.open.sheet.del.url,
		method: 'post',
		data
	})
}

/**
 * 客户公海--转入到我的跟进客户
 * */
export function changeToMyCustomerFun(data) {
	return request({
		url: urlCol.open.sheet.changeToMyCustomer.url,
		method: 'post',
		data
	})
}

/**
 * 跟进客户--成交客户
 * */
export function followDoneListFun(params) {
	return request({
		url: urlCol.follow.sheet.donelist.url,
		method: 'get',
		params
	})
}

/**
 * 跟进客户--我的跟进客户
 * */
export function followMyListFun(params) {
	return request({
		url: urlCol.follow.sheet.myList.url,
		method: 'get',
		params
	})
}

/**
 * 跟进客户--添加跟进
 * */
export function addFollowRecordFun(data) {
	return request({
		url: urlCol.follow.sheet.addFollowRecord.url,
		method: 'post',
		data
	})
}

/**
 * 跟进客户--添加我的客户
 * */
export function addMyCustomerFun(data) {
	return request({
		url: urlCol.follow.sheet.addMyCustomer.url,
		method: 'post',
		data
	})
}

/**
 * 跟进客户--客户详情
 * */
export function queryCustomDetailFun(params) {
	return request({
		url: urlCol.follow.sheet.customerDetail.url,
		method: 'get',
		params
	})
}

/**
 * 跟进客户--我的成交客户订单列表
 * */
export function queryCustomOrderListFun(params) {
	return request({
		url: urlCol.follow.sheet.order.url,
		method: 'get',
		params
	})
}

/**
 * 跟进客户--我的成交客户交易列表
 * */
export function queryCustomerTrandFun(params) {
	return request({
		url: urlCol.follow.sheet.trand.url,
		method: 'get',
		params
	})
}

/**
 * 跟进客户--跟进动态
 * */
export function queryCustomerTrendsFun(params) {
	return request({
		url: urlCol.follow.sheet.trends.url,
		method: 'get',
		params
	})
}

/**
 * 跟进客户--跟进日志
 * */
export function queryAllBusinessFun(params) {
	return request({
		url: urlCol.follow.sheet.businesser.url,
		method: 'get',
		params
	})
}

/**
 * 代理区域查询
 * */
export function queryAgentInfoFun(params) {
	return request({
		url: urlCol.follow.sheet.agent.url,
		method: 'get',
		params
	})
}

/**
 * 公海设置查询
 * */
export function queryCustomerSettingFUN(params) {
	return request({
		url: urlCol.follow.sheet.querySetting.url,
		method: 'get',
		params
	})
}

/**
 * 公海设置
 * */
export function customerSettingFUN(data) {
	return request({
		url: urlCol.follow.sheet.set.url,
		method: 'post',
		data
	})
}

/**
 * 转移到客户公海
 * */
export function releaseCustomerFun(data) {
	return request({
		url: urlCol.follow.sheet.release.url,
		method: 'post',
		data
	})
}

/**
 * 转移到客户公海
 * */
export function editCustomerInfoFun(data) {
	return request({
		url: urlCol.follow.sheet.cusedit.url,
		method: 'post',
		data
	})
}

/**
 * 把客户转给别的业务员
 * */
export function changeFollowFun(data) {
	return request({
		url: urlCol.follow.sheet.change.url,
		method: 'post',
		data
	})
}

/**
 * 把客户转给别的业务员
 * */
export function addOrderFun(data) {
	return request({
		url: urlCol.follow.sheet.addorder.url,
		method: 'post',
		data
	})
}

/**
 * 团队报表
 * */
export function teamReportFun(params) {
	return request({
		url: urlCol.report.team.url,
		method: 'get',
		params
	})
}

/**
 * 业务员报表
 * */
export function personReportFun(params) {
	return request({
		url: urlCol.report.person.url,
		method: 'get',
		params
	})
}

/**
 * 团队列表
 * */
export function teamsListFun(params) {
	return request({
		url: urlCol.report.teams.url,
		method: 'get',
		params
	})
}
