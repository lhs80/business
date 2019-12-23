const _import = require('./_import');
import Layout from '@/components/index/';

export default [{
	path: '/',
	name: '主页',
	redirect: '/login'
},

	{
		path: '/wel',
		component: Layout,
		redirect: '/wel/index',
		children: [{
			path: 'index',
			name: '首页',
			component: _import('log', 'views/admin/log')
		}]
	},

	{
		path: '/login',
		name: '登录页',
		component: _import('login/index')
	},
	{
		path: '/info',
		component: Layout,
		redirect: '/info/index',
		children: [{
			path: 'index',
			name: '修改信息',
			component: _import('admin/user/info', 'views')
		}]
	},

	/* 后台管理页面router */
	{
		path: '/index',
		name: '报表管理',
		component: _import('admin/home/index', 'views')
	},
	{
		path: '/system',
		name: '底图管理',
		component: _import('admin/system/map', 'views')
	},
	{
		path: '/POI',
		name: '客户列表',
		component: _import('admin/poi/poilist', 'views')
	},
	{
		path: '/road',
		name: '路线管理',
		component: _import('admin/way/road', 'views')
	},
	{
		path: '/activitylist',
		name: '活动管理',
		component: _import('admin/activity/activitylist', 'views')
	},

	{
		path: '/editor',
		name: '编辑器',
		component: _import('admin/user/editor', 'views')
	},
	{
		path: '/date',
		name: '时间插件',
		component: _import('admin/user/date', 'views')
	},
	{
		path: '/brand',
		name: '商品分类',
		component: _import('admin/commodity/brand', 'views')
	},
	{
		path: '/classify',
		name: '商品分类',
		component: _import('admin/commodity/classify', 'views')
	},

// 超级管理员
	{
		path: '/superAdmin/followList',
		component: Layout,
		children: [{
			path: 'detail',
			name: '客户详情',
			component: _import('superAdmin/open/cus-detail', 'views')
		}]
	},
	{
		path: '/suOnOffer',
		name: '待审核',
		component: _import('superAdmin/goods/onOffer', 'views')
	},
	{
		path: '/suClientList',
		name: '客户列表',
		component: _import('superAdmin/suClient/suClientList', 'views')
	},
	{
		path: '/suOrderList',
		name: '订单列表',
		component: _import('superAdmin/suOrder/suOrderList', 'views')
	},
	{
		path: '/suTuiKuanShenQing',
		name: '退款申请',
		component: _import('superAdmin/suOrder/suTuiKuanShenQing', 'views')
	},
	{
		path: '/suTuiKuanWanChen',
		name: '退款完成',
		component: _import('superAdmin/suOrder/suTuiKuanWanChen', 'views')
	},
	{
		path: '/xiaofeiCount',
		name: '消费统计',
		component: _import('superAdmin/data/xiaofeiCount', 'views')
	},
	{
		path: '/xiaoshouCount',
		name: '销售统计',
		component: _import('superAdmin/data/xiaoshouCount', 'views')
	},
	{
		path: '/classify',
		name: '商户分类',
		component: _import('superAdmin/contact/classify', 'views')
	},
	{
		path: '/config',
		name: '基础设置',
		component: _import('superAdmin/contact/config', 'views')
	},
	{
		path: '/levels',
		name: '商户等级',
		component: _import('superAdmin/contact/levels', 'views')
	},
	{
		path: '/pause',
		name: '暂停中',
		component: _import('superAdmin/contact/pause', 'views')
	},
	{
		path: '/settled',
		name: '入驻中',
		component: _import('superAdmin/contact/settled', 'views')
	},
	{
		path: '/daidakuan',
		name: '待付款',
		component: _import('superAdmin/caiwu/daidakuan', 'views')
	},
	{
		path: '/wuxiaoshenqing',
		name: '无效申请',
		component: _import('superAdmin/caiwu/wuxiaoshenqing', 'views')
	},
	{
		path: '/yidakuan',
		name: '已打款',
		component: _import('superAdmin/caiwu/yidakuan', 'views')
	},
	{
		path: '/info',
		name: '短消息库',
		component: _import('superAdmin/configger/info', 'views')
	},
	{
		path: '/infoApi',
		name: '短消息接口',
		component: _import('superAdmin/configger/infoApi', 'views')
	},
	{
		path: '/payConfig',
		name: '支付设置',
		component: _import('superAdmin/configger/payConfig', 'views')
	},
	{
		path: '/payManager',
		name: '支付管理',
		component: _import('superAdmin/configger/payManager', 'views')
	},
	{
		path: '/admin',
		component: Layout,
		redirect: '/admin/orderdetail',
		children: [{
			path: 'orderdetail',
			name: '订单详情',
			component: _import('admin/order/detail', 'views')
		}]
	},
	{
		path: '/staff',
		component: Layout,
		redirect: '/staff/editstaff',
		children: [{
			path: 'editstaff',
			name: '修改员工信息',
			component: _import('admin/staff/editStaff', 'views')
		}]
	},
	{
		path: '/post',
		component: Layout,
		redirect: '/post/update',
		children: [{
			path: 'update',
			name: '更新海报',
			component: _import('admin/poster/editPoster', 'views')
		}]
	},
	{
		path: '/productadd',
		component: Layout,
		redirect: '/productadd/add',
		children: [{
			path: 'add',
			name: '添加商品',
			component: _import('admin/commodity/addCommodity', 'views')
		}]
	},
	{
		path: '/productedit',
		component: Layout,
		redirect: '/productedit/edit',
		children: [{
			path: 'edit',
			name: '添加商品',
			component: _import('admin/commodity/editCommodity', 'views')
		}]
	},
	{
		path: '/paymodule',
		component: Layout,
		redirect: '/paymodule/add',
		children: [{
			path: 'add',
			name: '添加支付模板',
			component: _import('superAdmin/configger/addPayModule', 'views')
		}]
	},
	{
		path: '/paymoduleedit',
		component: Layout,
		redirect: '/paymoduleedit/edit',
		children: [{
			path: 'edit',
			name: '修改支付模板',
			component: _import('superAdmin/configger/editPayModule', 'views')
		}]
	},
	{
		path: '/address',
		component: Layout,
		children: [{
			path: 'add',
			name: '新增店铺地址',
			component: _import('admin/activity/addAddress', 'views')
		}, {
			path: 'edit',
			name: '修改店铺地址',
			component: _import('admin/activity/editAddress', 'views')
		}]
	},
	{
		path: '/superdetail',
		component: Layout,
		redirect: '/superdetail/orderdetail',
		children: [{
			path: 'orderdetail',
			name: '超管订单详情',
			component: _import('superAdmin/suOrder/suOrderDetail', 'views')
		}]
	},
	{
		path: '/adminClass',
		component: Layout,
		// redirect: "/adminClass/add",
		children: [{
			path: 'add',
			name: '添加商品分类',
			component: _import('admin/commodity/addClassify', 'views')
		}, {
			path: 'edit',
			name: '修改商品分类',
			component: _import('admin/commodity/editClassify', 'views')
		}]
	},
	{
		path: '/admin/sheet',
		component: Layout,
		children: [{
			path: 'add',
			name: '添加电子面单模板',
			component: _import('admin/system/addEleSheetModel', 'views')
		}, {
			path: 'edit',
			name: '修改电子面单模板',
			component: _import('admin/system/editEleSheetModel', 'views')
		}]
	}, {
		path: '/admin/fare',
		component: Layout,
		children: [{
			path: 'add',
			name: '添加运费模板',
			component: _import('admin/activity/addFare', 'views')
		}, {
			path: 'edit',
			name: '修改运费模板',
			component: _import('admin/activity/editFare', 'views')
		}]
	},

	/*系统错误页面*/
	{
		path: '/404',
		component: _import('error-page/404', 'components'),
		name: '404'
	},
	{
		path: '/403',
		component: _import('error-page/403', 'components'),
		name: '403'
	},
	{
		path: '/500',
		component: _import('error-page/500', 'components'),
		name: '500'
	},
	{
		path: '*',
		redirect: '/404',
		hidden: true
	}
];
