<template>
    <!--添加订单-->
    <el-dialog title="添加订单" :visible="show" top="5vh" :show-close="false" width="800px" custom-class="add-order-dialog">
        <el-row :gutter="40">
            <el-col :span="10">
                <h3>选择商品</h3>
                <hr>
                <div class="mt2">
                    <label class="h6">选择品牌：</label>
                    <div style="display:inline-block">
                        <el-select v-model="brandId" size="small" placeholder="请选择" @change="queryProductList">
                            <el-option v-for="(item,index) in brandList"
                                       :value="item.poster_id"
                                       :key="index"
                                       :label="item.poster_name"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="mt2">
                    <label class="h6">选择商品：</label>
                    <div style="display:inline-block">
                        <el-select v-model="prodId" placeholder="请选择" size="small" @change="queryProductDetail">
                            <el-option v-for="(item,index) in prodList" :label="item.goods_name" :value="item.goods_id"
                                       :key="index"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="mt4">
                    <div v-if="prodInfo.normMap">
                        <div v-for="(item,index) in prodInfo.normMap" :key="index" class="norms-wrapper">
                            <el-row class="mt2" v-if="index===0&&prodInfo.normMap.length>1">
                                <el-col :span="6">
                                    <label class="text-muted">{{item.norm_name}}:</label>
                                </el-col>
                                <el-col :span="18">
                                    <span class="norm-item" :class="subItem.item_id===firstNorm.item_id?'active':''"
                                          v-for="(subItem,subIndex) in item.items"
                                          :key="subIndex"
                                          @click="changeFirstNorm(subItem)"
                                    >
                                        {{subItem.item_name}}
                                    </span>
                                </el-col>
                            </el-row>
                            <el-row class="mt2" v-if="index!==0||prodInfo.normMap.length<=1">
                                <el-col :span="6">
                                    <label class="text-muted">{{item.norm_name}}:</label>
                                </el-col>
                                <el-col :span="18">
                                    <el-row :class="subIndex>0?'mt2':''" v-for="(subItem,subIndex) in item.items" :key="subIndex">
                                        <el-col :span="5" class="h6">{{subItem.item_name}}</el-col>
                                        <el-col :span="11" :offset="8">
                                            <el-input-number :value="queryCount(subItem)"
                                                             size="small"
                                                             @change="(value)=>handleNorm(value,subItem)"></el-input-number>
                                            <!--:disabled="!firstNorm.item_id"-->
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div v-else>
                        <label class="h6">购买数量：</label>
                        <el-input-number v-model="cartList[0].count" size="small" label="描述文字" style="width:100px !important;"
                                         @change="noNormCountChange"></el-input-number>
                    </div>
                </div>
                <div class="text-center mt4">
                    <el-button type="primary" size="large" @click="addToCart">添加到进货单</el-button>
                </div>
            </el-col>
            <el-col :span="14" style="border-left:solid 1px #f0f0f0">
                <h3>订单详情</h3>
                <hr>
                <div class="cart-detail mt2">
                    <el-table :data="resultProduct" size="small" stripe style="width: 100%">
                        <el-table-column prop="brandName" label="品牌"/>
                        <el-table-column prop="productName" label="商品名称"></el-table-column>
                        <el-table-column label="规格数量">
                            <template slot-scope="scope">
                                <el-row>
                                    <el-col :span="12">
                                        <span v-if="scope.row.norm_item_arr"
                                              v-for="(subItem,subIndex) in scope.row.norm_item_arr"
                                              :key="subIndex">{{subItem.sub_name}} </span>
                                    </el-col>
                                    <el-col :span="12">x{{ scope.row.count}}</el-col>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="mt2">
                    <label class="h6">商品总价:</label>
                    <div style="display:inline-block">
                        <el-input v-model="orderInfo.total" size="small" style="width:100px"></el-input>
                    </div>
                    <label class="h6 prl1">运费:</label>
                    <div style="display:inline-block">
                        <el-input v-model="orderInfo.express_cost" size="small" style="width:100px"></el-input>
                    </div>
                </div>
                <div class="mt2">
                    <label class="h6">订单总价：<span class="h5 text-danger"><small>￥</small>{{Number(orderInfo.total)+Number(orderInfo.express_cost)}}</span>
                        元</label>
                </div>
                <div class="mt2">
                    <div>
                        <label class="h6">收货地址：</label>
                        <div class="add-order-area-select">
                            <el-select size="small" v-model="orderInfo.province" placeholder="请选择" @change="provinceChange">
                                <el-option
                                        v-for="(item,index) in province"
                                        :key="index"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="add-order-area-select">
                            <el-select size="small" v-model="orderInfo.city" placeholder="请选择" @change="cityChange">
                                <el-option
                                        v-for="(item,index) in city"
                                        :key="index"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="add-order-area-select">
                            <el-select size="small" v-model="orderInfo.county" placeholder="请选择">
                                <el-option
                                        v-for="item in county"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="mt2">
                        <label class="h6">详细地址：</label>
                        <el-input size="small" v-model="orderInfo.address" autocomplete="off" style="width:310px"></el-input>
                    </div>
                </div>
                <div class="mt2">
                    <label class="h6" style="display:inline-block;width:62px">备注：</label>
                    <el-input size="small" v-model="orderInfo.remark" style="width:310px"></el-input>
                </div>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="close">取消</el-button>
            <el-button size="small" type="primary" @click="saveOrder()">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
	import {queryPostDetailFun, queryGoodsDetailFun, addOrderFun} from '@/api/activity'
	import ChinaAddress from '@/common/china_address_v4.json'

	export default {
		props: ['show', 'brandList', 'puid'],
		data() {
			return {
				province: Object.keys(ChinaAddress),
				city: [],
				county: [],
				count: [],//
				brandId: '',//选中的品牌Id
				prodId: '',//选中的商品品Id
				cartList: [{
					sku_id: 0,
					count: 0
				}],//进货单
				resultProduct: [],
				prodList: [],//根据品牌查出的商品列表
				prodInfo: {},//选中的商品信息
				firstNorm: {},//一级规格值
				orderInfo: {
					total: 0,
					express_cost: 0,
					province: '',
					city: '',
					county: '',
					address: '',
					remark: ''
				}
			}
		},
		computed: {
			queryCount() {
				return function (item) {
					let index = -1;
					// let index = this.cartList.findIndex(list => list.norm_item_arr[0].subId === this.firstNorm.item_id && list.norm_item_arr[1].subId === item.item_id)
					if (this.prodInfo.normMap.length > 1)
						index = this.cartList.findIndex(list => list.norm_item_arr[0].subId === this.firstNorm.item_id && list.norm_item_arr[1].subId === item.item_id)
					else
						index = this.cartList.findIndex(list => list.norm_item_arr[0].subId === item.item_id);
					return index >= 0 ? this.cartList[index].count : 0
				}
			}
		},
		methods: {
			close() {
				this.brandId = '';
				this.prodId = '';
				this.prodInfo = {};
				this.$emit('close')
			},
			//根据品牌查商品
			queryProductList(value) {
				let params = {
					posterId: value
				};
				queryPostDetailFun(params).then(res => {
					if (res.data.success) {
						this.prodList = res.data.data.goods
					}
				})
			},
			//查询商品详情
			queryProductDetail(value) {
				this.resultProduct = [];
				this.orderInfo.total = 0;
				this.orderInfo.express_cost = 0;

				let params = {
					goods_id: value
				};
				queryGoodsDetailFun(params).then(res => {
					if (res.data.success) {
						this.prodInfo = res.data.data;
						if (this.prodInfo.normMap) {
							this.cartList = [];
							this.prodInfo.skus.forEach(item => {
								const {sku_id, norm_item_arr, price} = item;
								this.cartList.push({
									sku_id,
									norm_item_arr,
									count: 0,
									price
								})
							});
						} else {
							this.cartList[0].sku_id = this.prodInfo.skus[0].sku_id
							this.cartList[0].count = 0;
							this.cartList[0].price = this.prodInfo.skus[0].price;
						}
					}
				})
			},
			//改变一级规格
			changeFirstNorm(item) {
				this.firstNorm = item
			},
			handleNorm(count, item) {
				let index = -1;
				if (this.prodInfo.normMap.length > 1)
					index = this.cartList.findIndex(list => list.norm_item_arr[0].subId === this.firstNorm.item_id && list.norm_item_arr[1].subId === item.item_id)
				else
					index = this.cartList.findIndex(list => list.norm_item_arr[0].subId === item.item_id);
				this.cartList[index].count = count;
			},
			noNormCountChange(value) {
				this.cartList[0].count = value
			},
			//添加到进货单
			addToCart() {
				this.resultProduct = [];
				this.cartList.forEach(item => {
					if (item.count > 0) {
						this.orderInfo.total += item.price * item.count
						const {sku_id, count, norm_item_arr} = item
						this.resultProduct.push({
							brandName: this.brandList.filter(brand => brand.poster_id === this.brandId)[0].poster_name,
							productName: this.prodInfo.goods_name,
							sku_id,
							count,
							norm_item_arr
						});
					}
				})
			},
			saveOrder() {
				const {express_cost, province, remark, address, city, county, total} = this.orderInfo;
				let params = {
					express_cost,
					province,
					remark,
					address,
					city,
					county,
					puid: this.puid,
					countInfo: [],
					order_total: Number(total) + Number(express_cost)
				};
				this.resultProduct.forEach(item => {
					const {sku_id, count} = item;
					params.countInfo.push({sku_id, count})
				});
				addOrderFun(params).then(res => {
					if (res.data.success) {
						this.$emit('close');
						this.$message({
							showClose: true,
							message: '添加成功',
							type: 'success'
						});
						this.prodInfo = {};
					}
				});
				this.close();
			},
			provinceChange(value) {
				this.city = Object.keys(ChinaAddress[value])
			},
			cityChange() {
				this.county = ChinaAddress[this.orderInfo.province][this.orderInfo.city]
			},
		}
	}
</script>

<style lang="scss" scoped>
    .norms-wrapper {
        max-height: 500px;
        overflow: auto;
        .norm-item {
            border: solid 1px #f0f0f0;
            padding: 3px 8px;
            cursor: pointer;

            & + .norm-item {
                margin-left: 5px;
            }

            &.active {
                border: solid 1px red;
                color: red;
            }
        }
    }

    .add-order-area-select {
        display: inline-block;
        width: 100px;
    }
</style>
<style lang="scss">
    .add-order-dialog {
        .el-dialog__body {
            padding: 0 20px !important;
        }
    }
</style>
