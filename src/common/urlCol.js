/*请求路径集合*/

const urlCol = {

  // 不确定有没有用，先不删
  common: {
    checkLogin: {
      url: '/api/common/v1/checkLogin',
      successMessage: '登录信息是否有效'
    },
    connectionRequest: {
      url: '/api/common/v1/connectionRequest',
      successMessage: '保持连接'
    }
  },
  // 登录接口
  login: {
    login: {
      url: '/mch/login',
      successMessage: '登录成功'
    },
    supLogin: {
      url: '/admin/login',
      successMessage: '登录成功'
    },
    logout: {
      url: '/admin/logout',
      successMessage: '登出成功'
    }
  },
  /**
   * 员工所有接口
   *  */
  staff: {
    // 创建员工（业务员）分组
    makeUserGroup: {
      url: '/mch/user/makeUserGroup',
      successMessage: '创建员工（业务员）分组成功'
    },
    // 获取所有业务员分组 get请求
    getAllUserGroup: {
      url: '/mch/user/getAllUserGroup',
      successMessage: '获取所有业务员分组成功'
    },
    // 删除业务员分组
    delUserGroup: {
      url: '/mch/user/delUserGroup',
      successMessage: '删除业务员分组成功'
    },
    // 创建新员工账号
    makeNewUser: {
      url: '/mch/user/makeNewUser',
      successMessage: '创建新员工账号成功'
    },
    // 更新员工信息
    updateUser: {
      url: '/mch/user/updateUser',
      successMessage: '创建新员工账号成功'
    },
    // 所有员工  get请求
    getAllUserByMch: {
      url: '/mch/user/getAllUserByMch',
      successMessage: '所有员工成功'
    },
    // 删除员工
    delMerchantUser: {
      url: '/mch/user/delMerchantUser',
      successMessage: '删除员工成功'
    },
    // 修改自己的密码
    updateUserPwd: {
      url: '/mch/user/updateUserPwd',
      successMessage: '修改自己的密码成功'
    },
    // 修改自己的密码
    delMerchantUserFromGroup: {
      url: '/mch/user/delMerchantUserFromGroup',
      successMessage: '从分组中删除员工'
    },
    // 批量修改员工分组
    changeEmployeeGroup: {
      url: '/mch/user/batchUpdateUserGroup',
      successMessage: '批量修改员工分组'
    },
  },

  /**
   * 品牌
   *  */
  brand: {
    // 创建新品牌
    addBrand: {
      url: '/mch/brand/addBrand',
      successMessage: '创建新品牌成功'
    },
    // 修改品牌
    updateBrand: {
      url: '/mch/brand/updateBrand',
      successMessage: '修改品牌成功'
    },
    // 删除品牌
    delBrand: {
      url: '/mch/brand/delBrand',
      successMessage: '删除品牌成功'
    },
    // 所有品牌列表  get请求
    getAllBrand: {
      url: '/mch/brand/getAllBrand',
      successMessage: '所有品牌列表成功'
    },
  },

  /**
   * 商品所有接口
   */
  commodity: {
    // 商品列表 get/mch/makeNewNormItem
    getGoodsList: {
      url: '/mch/getGoodsList',
      successMessage: '商品列表成功'
    },
    // 添加商品
    addGoods: {
      url: '/mch/addGoods',
      successMessage: '添加商品成功'
    },
    // 修改商品
    updateGoods: {
      url: '/mch/updateGoods',
      successMessage: '修改商品成功'
    },
    // 商品详情   get
    getGoodsDetail: {
      url: '/mch/getGoodsDetail',
      successMessage: '商品详情成功'
    },
    // 设置商品状态，上架（status=1）,下架（status=0）,审核通过（is_audit=1）
    setGoodsStatus: {
      url: '/mch/setGoodsStatus',
      successMessage: '商品状态成功'
    },
    // 删除商品 删除到回收站（is_real=0）,真删除（is_real=1）
    delGoods: {
      url: '/mch/delGoods',
      successMessage: '删除商品成功'
    },
    // 获取商户下全部商品类别
    getAllGoodsCat: {
      url: '/mch/getAllGoodsCat',
      successMessage: '获取商户下全部商品类别'
    },
    // 添加或修改产品类别
    editGoodsCat: {
      url: '/mch/editGoodsCat',
      successMessage: '添加或修改产品类别'
    },
    // 删除商品类别
    delGoodsCat: {
      url: '/mch/delGoodsCat',
      successMessage: '删除商品类别'
    },
    // 批量修改商品的所属分类
    batchSetGoodsCat: {
      url: '/mch/batchSetGoodsCat',
      successMessage: '批量修改商品的所属分类'
    },
    // 创建空的规格
    makeNewNorm: {
      url: '/mch/makeNewNorm',
      successMessage: '创建空的规格'
    },
    // 创建空规格项
    makeNewNormItem: {
      url: '/mch/makeNewNormItem',
      successMessage: '创建空规格项'
    },
    // 仓库端-修改库存
    updateGoodsReserve: {
      url: '/mch/depot/updateGoodsReserve',
      successMessage: '仓库端-修改库存'
    },
    // 获取仓库端库存修改日志
    getReserveLogs: {
      url: '/mch/depot/getReserveLogs',
      successMessage: '获取仓库端库存修改日志'
    },
    // 仓库端-商品列表（盘点）
    getGoodsList4depot: {
      url: '/mch/depot/getGoodsList4depot',
      successMessage: '仓库端-商品列表（盘点）'
    },
    // 设置仓库端-最小库存预警设置
    setMinReserveConfig: {
      url: '/mch/depot/setMinReserveConfig',
      successMessage: '设置仓库端-最小库存预警设置'
    },
    // 仓库端-获取仓库端-最小库存预警设置
    getMinReserveConfig: {
      url: '/mch/depot/getMinReserveConfig',
      successMessage: '仓库端-获取仓库端-最小库存预警设置'
    },
    getAllExpressTemp: {
      url: '/mch/express/getAllExpressTemp'
    },
    addExpressTemp: {
      url: '/mch/express/addExpressTemp'
    },
    editExpressTemp: {
      url: '/mch/express/updateExpressTemp'
    },
    delExpressTemp: {
      url: '/mch/express/delExpressTemp'
    }
  },

  /**
   * 客户所有接口
   */
  poi: {
    //所有客户
    getAllClient: {
      url: '/mch/customer/getMchUserList'
    },
    //客户详情
    clientDetail: {
      url: '/mch/customer/getMyCustomerDetail'
    },
    //客户等级
    clientLevel: {
      url: '/mch/customer/getAllUserLevel'
    },
    //客户等级
    delClientLevel: {
      url: '/mch/customer/delUserLevel'
    },
    addOrEditLevel: {
      url: '/mch/customer/editUserLevel'
    },
    updateClientLevel: {
      url: '/mch/customer/updateMchCustomer'
    }
  },

  /**
   * 订单所有接口
   */
  order: {
    //所有订单
    orderList: {
      url: '/mch/order/getOrders'
    },
    //订单详情
    orderDetail: {
      url: '/mch/order/getOrderInfo4admin'
    },
    //修改订单地址
    updateOrderAddress: {
      url: '/mch/order/updateOrderAddress'
    },
    deliveExpress: {
      url: '/mch/order/deliveExpress'
    },
    allExpress: {
      url: 'mch/order/getAllSupportExpress'
    }
  },

  /**
   * 数据统计所有接口  全部是get请求
   *  */
  dataCount: {
    // 客户消费排名
    xfRank: {
      url: '/mch/report/xfRank',
      successMessage: '客户消费排名查询成功'
    },
    // 业务员排名
    salesRank: {
      url: '/mch/report/salesRank',
      successMessage: '业务员排名查询成功'
    },
    // 业务员分组排名
    salesGroupRank: {
      url: '/mch/report/salesGroupRank',
      successMessage: '业务员分组排名查询成功'
    },
    // 首页概览 昨日，今日，近7天 近30天
    homeReport: {
      url: '/mch/report/homeReport',
      successMessage: '首页概览 昨日，今日，近7天 近30天查询成功'
    },
    // 销售统计
    salesStatistics: {
      url: '/mch/report/salesStatistics',
      successMessage: '销售统计查询成功'
    },
    // 商品销售排行
    goodsSalesRank: {
      url: '/mch/report/goodsSalesRank',
      successMessage: '商品销售排行查询成功'
    },
  },

  /**
   * 提现申请
   */
  account: {
    //可提现的金额
    applicationForCash: {
      url: '/mch/order/getMerchantTXInfo'
    },
    //申请提现列表
    getTxOrderList: {
      url: '/mch/order/getTxOrderList'
    },
    //支持的银行
    getSysSupportBanks: {
      url: '/mch/getSysSupportBanks'
    },
    //提交提现申请
    addTxOrder: {
      url: '/mch/order/addTxOrder'
    }
  },

  /**
   * 海报管理
   */
  post: {
    list: {
      url: '/mch/poster/getPosterList'
    },
    del: {
      url: '/mch/poster/delPoster'
    },
    add: {
      url: '/mch/poster/addPoster'
    },
    detail: {
      url: '/mch/poster/getPosterInfo'
    },
    update: {
      url: '/mch/poster/updatePoster'
    }
  },

  setting: {
    update: {
      url: '/mch/updateMerchant'
    },
    query: {
      url: '/mch/getMerchantInfo'
    },
    addressList: {
      url: '/mch/express/getAllAddress'
    },
    addressDel: {
      url: '/mch/express/delAddress'
    },
    addressEdit: {
      url: '/mch/express/updateAddress'
    },
    addressAdd: {
      url: '/mch/express/addNewAddress'
    }
  },

  /**
   * 快递助手
   */
  express: {
    sheet: {
      list: {
        url: '/mch/express/getAlleExpressTemp'
      },
      add: {
        url: '/mch/express/addeExpressTemp'
      },
      update: {
        url: '/mch/express/updateeExpressTemp'
      },
      del: {
        url: '/mch/express/deleExpressTemp'
      }
    },
    setting: {
      query: {
        url: '/mch/getMchExpressConfig'
      },
      update: {
        url: '/mch/setMchExpressConfig'
      }
    },
    delive: {
      url: '/mch/order/deliveExpressByEorder'
    },
    printHFD: {
      url: '/mch/order/PrintFHD'
    }
  },
  print: {
    get: {
      url: '/mch/getMchExpressPrinterConfig'
    },
    set: {
      url: '/mch/setMchExpressPrinterConfig'
    }
  },

  /**
   * 客户公海
   */
  open: {
    sheet: {
      list: {
        url: '/mch/salesman/getPublicCustomerList'
      },
      export: {url: '/mch/salesman/addPublicCustomer'},
      del: {
        url: '/mch/salesman/delPublicCustomer'
      },
      changeToMyCustomer: {
        url: "/mch/salesman/transformMyFollowCustomer"
      }
    },
  },
  /**
   * 客户跟进
   */
  follow: {
    sheet: {
      donelist: {
        url: '/mch/salesman/getMyDealCustomerList'
      },
      myList: {
        url: "/mch/salesman/getMyCustomerList"
      },
      addFollowRecord: {
        url: "/mch/salesman/addFollow"
      },
      addMyCustomer:{
        url:'/mch/salesman/addmyCustomer'
      },
      customerDetail:{
        url:'/mch/salesman/getSaleeCustomeDetail'
      },
      //订单
      customerOrderList:{
        url:'/mch/salesman/getSalesmanCustomerOrders'
      },
      //交易
      getMyCustomerOrders:{
        url:'/mch/customer/getMyCustomerOrders'
      }
    },
  },
  /************************************超管接口*************************************/
  superAdmin: {
    goods: {
      list: {
        url: '/admin/goods/getGoodsList4Admin'
      },
      updateStatus: {
        url: '/admin/goods/setGoodsStatus'
      },
      del: {
        url: '/admin/goods/delGoods'
      }
    },
    client: {
      list: {
        url: '/admin/customer/getAllUserList'
      }
    },
    order: {
      list: {
        url: '/admin/order/getOrderList'
      }
    },
    data: {
      sale: {
        url: '/admin/report/salesStatistics'
      },
      customer: {
        url: '/admin/report/xfRank4admin'
      },
      shop: {
        url: '/admin/report/merchantSalesRank'
      },
      total: {//首页数据总览
        url: '/admin/report/homeReport'
      }
    },
    account: {
      list: {
        url: '/admin/order/getTxOrderList'
      },
      handle: {
        url: '/admin/order/aduitTxOrder'
      }
    },
    paySetting: {
      //所有支付模板
      list: {
        url: '/admin/config/getPayModules'
      },
      //启用的支付模板
      usingModule: {
        url: '/admin/config/getUsePayModule'
      },
      //设置启用的支付模板
      settingModule: {
        url: '/admin/config/setUsePayModule'
      },
      addModule: {
        url: '/admin/config/addPayModule'
      },
      delModule: {
        url: '/admin/config/deletePayModules'
      },
      updateModule: {
        url: '/admin/config/updatePayModule'
      }
    },
    shop: {
      list: {
        url: '/admin/merchant/getMerchantList'
      },
      typeList: {
        url: '/admin/merchant/getAllMerchantCat'
      },
      delType: {
        url: '/admin/merchant/delMerchantCat'
      },
      addOredit: {
        url: '/admin/merchant/editMerchantCat'
      },
      level: {
        url: '/admin/merchant/getAllMerchantlevel'
      },
      delLevel: {
        url: '/admin/merchant/delMerchantLevel'
      },
      addOrEditLevel: {
        url: '/admin/merchant/editMerchantLevel'
      },
      updateStatus: {
        url: '/admin/merchant/setMerchantStatus'
      },
      editShopPwd: {
        url: '/admin/merchant/updateMchPwd'
      },
      updateLevel: {
        url: '/admin/merchant/updateMchLevel'
      },
    },
    baseInfo: {
      baseSetting: {
        url: '/admin/merchant/SetSysMchOption'
      },
      queryInfo: {
        url: '/admin/merchant/getSysMchOption'
      },
      queryAgree: {
        url: '/admin/merchant/getSysMchAgreeMent'
      },
      settingAgree: {
        url: '/admin/merchant/setSysMchAgreeMent'
      }
    }
  }
};


export default urlCol;
/* {
	activity: urlCol.activity,
	activityType: urlCol.activityType,
	common: urlCol.common,
	login: urlCol.login,
	menu: urlCol.menu,
	menuRole: urlCol.menuRole,
	opLog: urlCol.opLog,
	poi: urlCol.poi,
	poiMediaInfo : urlCol.poiMediaInfo,
	role: urlCol.role,
	route: urlCol.route,
	showFile: urlCol.showFile,
	sys: urlCol.sys,
	user: urlCol.user,
	userRole : urlCol.userRole
}*/
