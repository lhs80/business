<!--快递单/发货单-->
<template>
    <div class="app-container calendar-list-container order-list">
        <!--菜单栏-->
        <div class="text-right">
            <div style="width:200px;display:inline-block;">
                <el-select size="small" v-model="isSearchByTime" placeholder="请选择">
                    <el-option value="cdate" label="不按时间">不按时间</el-option>
                    <el-option value="complete_time" label="完成时间">完成时间</el-option>
                    <el-option value="delive_start_time" label="下单时间">下单时间</el-option>
                </el-select>
            </div>
            <div style="width:400px;display:inline-block;">
                <el-date-picker
                        size="small"
                        v-model="timeRange"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions2"
                        :disabled="isSearchByTime==='cdate'"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        change="timeChange"
                >
                </el-date-picker>
            </div>
            <div style="width:200px;display:inline-block;">
                <el-select size="small" v-model="orderStatus" placeholder="请选择">
                    <el-option value="" label="全部">全部</el-option>
                    <el-option value="1" label="待发货">待发货</el-option>
                    <el-option value="2" label="待收货">待收货</el-option>
                    <el-option value="3" label="已完成">已完成</el-option>
                </el-select>
            </div>
            <div style="width:200px;display:inline-block;">
                <el-select size="small" v-model="searchType" placeholder="请选择">
                    <el-option value="order_id" label="订单号">订单号</el-option>
                    <el-option value="receipt_person" label="收件人姓名">收件人姓名</el-option>
                </el-select>
            </div>
            <div style="width:200px;display:inline-block;">
                <el-input size="small" v-model="searchKey" placeholder="请输入关键字"></el-input>
            </div>
            <div style="display:inline-block;">
                <el-button type="primary" size="small" @click="getOrderList">搜索</el-button>
            </div>
        </div>
        <!--标题栏-->
        <el-row class="h5 bg-grey mt2 ptb1">
            <el-col :span="6" class="prl2">
                <input type="checkbox" v-model='checked' @click='selectAll'> 商品
            </el-col>
            <el-col :span="3" class="text-center">支付/配送</el-col>
            <el-col :span="3" class="text-center">订单价格</el-col>
            <el-col :span="3" class="text-center">实付款</el-col>
            <el-col :span="3" class="text-center">下单时间</el-col>
            <el-col :span="3" class="text-center">状态</el-col>
            <el-col :span="3" class="text-center">打印状态</el-col>
        </el-row>
        <!--订单-->
        <aside class="order-panel mt2" v-for="(item,index) in orderList" :key="index">
            <el-row class="bg-grey h6 prl2 ptb1">
                <el-col :span="18">
                    <input :id="index" type="checkbox" v-model='ids' :value="item.order_id" />
                    <span class="text-muted prl1">订单编号：{{item.order_id}}</span>
                </el-col>
                <el-col :span="6" class="text-right text-info">
                    <router-link :to="{ path: '/admin/orderdetail',query:{id:item.order_id}}">查看详情</router-link>
                </el-col>
            </el-row>
            <el-row class="order-panel-content" type="flex" align="middle">
                <!--商品-->
                <el-col :span="6" class="prl2 h6">
                    <table style="width:100%">
                        <tr v-for="(gooditem,key) in item.goods" :key="key">
                            <td style="width:50px">
                                <img width="50px" height="50px" :src="gooditem.logo" />
                            </td>
                            <td class="prl1">
                                <h6>{{gooditem.goods_name}}</h6>
                                <h6 v-for="(attrItem,subIndex) in gooditem.countInfo" :key="subIndex">
                                    <el-row class="text-muted">
                                        <el-col :span="12">
                      <span v-for="(normItem,normIndex) in attrItem.norm_snap" :key="normIndex"
                            style="margin-right:5px">
                      {{normItem.sub_name}}
                      </span>
                                        </el-col>
                                        <el-col :span="12" class="text-right">
                                            ￥{{attrItem.dlprice}}
                                            x{{attrItem.count}}
                                        </el-col>
                                    </el-row>
                                </h6>
                            </td>
                        </tr>
                    </table>
                </el-col>
                <!--支付/配送-->
                <el-col :span="3" class="text-center">
                    <div>
                        <h6>{{payType(item.pay_type)}}</h6>
                        <h6>{{item.delive_express_name}}</h6>
                    </div>
                </el-col>
                <!--价格-->
                <el-col :span="3" class="text-center h6">
                    <div>
                        ￥{{item.order_total}}
                        <br>
                        (含运费:￥{{item.express_cost}})
                    </div>
                </el-col>
                <!--买家-->
                <el-col :span="3" class="text-center">
                    <div>
                        <h6>￥{{item.pay_total}}</h6>
                    </div>
                </el-col>
                <!--操作-->
                <el-col :span="3" class="text-center">
                    <div>
                        <router-link :to="{ path: '/admin/orderdetail',query:{id:item.order_id}}">
                            <h6>{{timestampToTime(item.cdate)}}</h6>
                        </router-link>
                    </div>
                </el-col>
                <!--状态-->
                <el-col :span="3" class="text-center h6">
                    <div>
                        <div v-html="orderType(item.order_status)"></div>
                        <el-button type="primary" size="small" @click="showSendPanel(item)" v-if="item.order_status===2">确认发货
                        </el-button>
                    </div>
                </el-col>
                <el-col :span="3" class="text-center">
                    <div>
                        <h6>
                            <el-tag type="success">电子面单x{{item.eOrderCount}}</el-tag>
                        </h6>
                    </div>
                </el-col>
            </el-row>
            <el-row style="border-top:solid 1px #efefef" class="prl2 ptb1">
                <el-col class="h6">
                    买家备注：{{item.message?item.message:'无'}}
                </el-col>
            </el-row>
        </aside>
        <!--暂无数据-->
        <div class="text-center mt2 text-muted h5" v-if="!orderList.length">暂时没有任何订单!</div>
        <div class="ptb2">
            <el-button type="primary" @click="isShowSendPanel=true">选择打印模板</el-button>
            <el-button type="primary" @click="deliveSetting">打印电子面单</el-button>
            <el-button type="primary" @click="printFHD">打印发货单</el-button>
            <!--<el-button type="primary" @click="fastPost">一键发货</el-button>-->
            <object id="LODOP_OB" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width=0 height=0>
                <embed id="LODOP_EM" type="application/x-print-lodop" width=0 height=0></embed>
            </object>
            <div v-html="lodop_errMsg"></div>
        </div>
        <!--分页-->
        <el-row class="mt2 pull-right">
            <el-col :span="24">
                <div class="pagination">
                    <el-pagination
                            v-if="paginations.total > 0"
                            :page-sizes="paginations.pageSizes"
                            :page-size="paginations.page_size"
                            :layout="paginations.layout"
                            :total="paginations.total"
                            :current-page="paginations.page_index"
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                    ></el-pagination>
                </div>
            </el-col>
        </el-row>
        <!--选择打印模板-->
        <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
             style="z-index: 99;" v-show="isShowSendPanel">
            <div class="el-message-box el-message-box--center">
                <div class="bg-grey">
                    <el-row class="prl2">
                        <el-col :span="12" class="h5">确认发货</el-col>
                        <el-col :span="12" class="text-right h4">
                            <i class="el-message-box__close el-icon-close" @click="isShowSendPanel=false"></i>
                        </el-col>
                    </el-row>
                </div>
                <div class="el-message-box__content">
                    <el-row type="flex" align="middle">
                        <el-col :span="8">发件人模板</el-col>
                        <el-col :span="16">
                            <el-select v-model="sendAddress" placeholder="请选择">
                                <el-option
                                        v-for="(item,index) in addressList"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle" class="mt2">
                        <el-col :span="8">电子面单模板</el-col>
                        <el-col :span="16">
                            <el-select v-model="eleSheetModel" placeholder="请选择">
                                <el-option
                                        v-for="(item,index) in sheetList"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </div>
                <div class="el-message-box__btns">
                    <el-button type="primary" @click="selectModel('postForm')">确认选择</el-button>
                    <el-button type="default" @click="isShowSendPanel=false">关闭</el-button>
                </div>
            </div>
        </div>
        <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
             style="z-index: 99;" v-show="isShowPrintView">
            <div class="el-message-box el-message-box--center">
                <div class="bg-grey">
                    <el-row class="prl2">
                        <el-col :span="12" class="h5">打印预览</el-col>
                        <el-col :span="12" class="text-right h4">
                            <i class="el-message-box__close el-icon-close" @click="isShowPrintView=false"></i>
                        </el-col>
                    </el-row>
                </div>
                <div class="el-message-box__content" style="overflow:scroll;height:600px">
                    <div id="printTest" v-html="printContent"></div>
                </div>
                <div class="el-message-box__btns">
                    <el-button type="primary" v-print="'#printTest'">打印</el-button>
                    <el-button type="default" @click="isShowPrintView=false">关闭</el-button>
                </div>
            </div>
        </div>
        <div class="v-modal" tabindex="0" style="z-index: 80;" v-if="isShowSendPanel||isShowPrintView"></div>
    </div>
</template>
<script>
	import {
		orderListFun,
		getOrderDetailFun,
		deliveExpressFun,
		allExpressFun,
		eleSheetModelListFun,
		addressListFun,
		deliveSettingFun,
		printFHDFun
	} from '@/api/activity'
	import Vue from 'vue'
	import Print from 'vue-print-nb'

	Vue.use(Print);

	export default {
		data() {
			return {
				curOrder: {},
				isShowSendPanel: false,
				isShowDelive: false,
				isShowPrintView: false,
				printContent: '',
				searchKey: '',
				lodop_errMsg: '',
				orderStatus: '2',
				orderList: [],
				addressList: [],
				sheetList: [],
				isSearchByTime: 'cdate',
				timeRange: '',
				searchType: 'order_id',
				paginations: {
					page_index: 1, // 当前位于哪页
					total: 0, // 总条数`
					page_count: 0, // 总页数
					page_size: 5, // 1页显示多少条
					pageSizes: [5, 10, 15, 20], // 每页显示多少条
					layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
				},
				pickerOptions2: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date()
							const start = new Date()
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
							picker.$emit('pick', [start, end])
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date()
							const start = new Date()
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
							picker.$emit('pick', [start, end])
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date()
							const start = new Date()
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
							picker.$emit('pick', [start, end])
						}
					}]
				},
				ids: [],
				checked: false,
				sendAddress: '', // 选择的发件人模板
				eleSheetModel: '', // 选择的电子模板
				printInfo: {
					order_id: '',
					SenderAddressTempId: '',
					eOrderTempId: ''
				}
			}
		},
		watch: {
			'ids': {
				handler: function (val, oldVal) {
					this.checked = val.length === this.orderList.length
				},
				deep: true
			}
		},
		mounted() {
			this.getOrderList()
			this.getAllAddress()
			this.eleSheetModelList()
		},
		methods: {
			/**
			 *所有地址
			 */
			getAllAddress() {
				addressListFun().then(res => {
					if (res.data.success) {
						this.addressList = res.data.data
					}
				})
			},
			/**
			 *所有电子面单
			 */
			eleSheetModelList() {
				eleSheetModelListFun().then(res => {
					if (res.data.success) {
						this.sheetList = res.data.data
					}
				})
			},
			/**
			 *所有订单
			 */
			getOrderList() {
				let params = {
					orderStatus: this.orderStatus,
					searchTimeType: this.isSearchByTime,
					startTime: this.timeRange[0],
					endTime: this.timeRange[1],
					searchType: this.searchType,
					searchKey: this.searchKey,
					pageSize: this.paginations.page_size,
					pageIndex: this.paginations.page_index,
					uid: this.$route.query.uid
				}
				orderListFun(params).then(res => {
					if (res.data.success) {
						this.orderList = res.data.data.data
						this.paginations.page_count = res.data.data.pageinfo.totalpage
						this.paginations.total = res.data.data.pageinfo.count
					}
				})
			},
			/**
			 * 从订单详情查询物流信息
			 */
			showDelive(id) {
				let params = {
					order_id: id
				}
				getOrderDetailFun(params).then(res => {
					if (res.data.success) {
						this.detail = res.data.data
						this.isShowDelive = true
					}
				})
			},
			/**
			 * 付款状态
			 */
			payType(type) {
				switch (type) {
					case 0:
						return '未支付'
					case 1:
						return '微信'
					case 2:
						return '支付宝'
				}
			},
			/**
			 * 订单状态
			 */
			orderType(type) {
				switch (type) {
					case 0:
						return '已取消'
					case 1:
						return '<span class=\'text-danger\'>待支付</span>'
					case 2:
						return '<span class=\'text-info\'>待发货</span>'
					case 3:
						return '<span class=\'text-warning\'>待收货</span>'
					case 4:
						return '<span class=\'text-success\'>已完成</span>'
					case -1:
						return '<span>已关闭</span>'
				}
			},
			// 上下分页
			handleCurrentChange(page) {
				this.paginations.page_index = page
				this.getOrderList()
			},
			// 每页多少条切换
			handleSizeChange(page_size) {
				this.paginations.page_size = page_size
				this.getOrderList()
			},
			/**
			 * 全选
			 * */
			selectAll() {
				let self = this
				this.$nextTick(() => {
					if (!this.checked) {
						this.ids = []
					} else {
						this.ids = []
						this.orderList.forEach(function (item, index) {
							if (self.ids.indexOf(item.order_id) < 0) {
								self.ids.push(item.order_id)
							}
						})
					}
				})
			},
			selectModel() {
				this.printInfo.SenderAddressTempId = this.sendAddress
				this.printInfo.eOrderTempId = this.eleSheetModel
				this.isShowSendPanel = false
			},
			/**
			 * 打印电子面单
			 * */
			deliveSetting() {
				if (!this.ids.length) {
					this.$message({
						message: '请选择商品！',
						type: 'warning'
					})
					return false
				}
				if (!this.printInfo.SenderAddressTempId || !this.printInfo.eOrderTempId) {
					this.$message({
						message: '请先设置打印模板！',
						type: 'warning'
					})
					return false
				}
				this.ids.forEach((item, index) => {
					this.printInfo.order_id = item;
					deliveSettingFun(this.printInfo).then(res => {
						if (res.data.success) {
							this.printContent += res.data.data + '<br/><br/>'
						}
					})
				});
				this.isShowPrintView = true
			},
			printFHD() {
				if (!this.ids.length) {
					this.$message({
						message: '请选择订单！',
						type: 'warning'
					});
					return false
				}
				this.$message('发货单打印中...');
				let params = {
					order_id: this.ids.toString()
				};
				printFHDFun(params).then(res => {
					if (res.data.success) {
						this.$message('发货单打印完成');
					} else {
						this.$message('发货单打印失败，请联系管理员！');
					}
				})
			},
			/**
			 * 一键发货
			 * */
			fastPost() {
				let LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'))
				if (typeof LODOP !== 'object') {
					this.lodop_errMsg = LODOP
				} else {
					if (!this.ids.length) {
						this.$message({
							message: '请选择商品！',
							type: 'warning'
						});
						return false
					}
					if (!this.printInfo.SenderAddressTempId || !this.printInfo.eOrderTempId) {
						this.$message({
							message: '请先设置打印模板！',
							type: 'warning'
						})
						return false
					}
					this.printFHD();
					this.ids.forEach((item, index) => {
						this.printInfo.order_id = item
						deliveSettingFun(this.printInfo).then(res => {
							if (res.data.success) {
								LODOP.PRINT_INIT('快递单打印')
								LODOP.ADD_PRINT_HTM(0, 0, '95%', '95%', res.data.data)
								LODOP.PRINT()
							}
						})
					})
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
    .order-panel {
        border: solid 1px #e5e5e5;
        &:hover {
            border: solid 1px #44abf7
        }
        .order-panel-content {
            -webkit-align-items: center;
            align-items: center;
            & > .el-col > div {
                display: -webkit-box;
                /*! autoprefixer: off */
                -webkit-box-orient: vertical;
                /*! autoprefixer: on */
                -webkit-box-pack: center;
                height: 100px;
                border-left: solid 1px #e5e5e5;
            }
        }
    }
</style>
