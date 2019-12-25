<template>
    <!--添加订单-->
    <el-dialog title="添加订单" :visible="show" top="5vh" :show-close="false" width="600px">
        <el-row :gutter="10">
            <el-col :span="12">
                <div>
                    <label class="h6">选择品牌：</label>
                    <div style="display:inline-block">
                        <el-select v-model="brandId" size="small" placeholder="请选择" @change="queryProductList">
                            <el-option v-for="(item,index) in brandList"
                                       :value="item.poster_id"
                                       :key="index"
                                       :label="item.poster_name">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="mt2">
                    <label class="h6">选择商品：</label>
                    <div style="display:inline-block">
                        <el-select v-model="prodId" placeholder="请选择" size="small" @change="queryProductDetail">
                            <el-option v-for="(item,index) in prodList" :label="item.goods_name" :value="item.goods_id" :key="index"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="mt4">
                    <div v-if="prodInfo && prodInfo.normMap">
                        <div v-for="(item,index) in prodInfo.normMap" :key="index" class="norms-wrapper">
                            <el-row class="mt2" v-if="index===0&&prodInfo.normMap.length>1">
                                <el-col :span="8">
                                    <label class="text-muted">{{item.norm_name}}:</label>
                                </el-col>
                                <el-col :span="12">
                                    <span class="norm-item" :class="subItem.item_id===mainNormItem.item_id?'active':''"
                                          v-for="(subItem,subIndex) in item.items"
                                          :key="subIndex"
                                          @click="mainNormItem=subItem"
                                    > {{subItem.item_name}}</span>
                                </el-col>
                            </el-row>
                            <el-row class="mt2" v-else>
                                <el-col :span="8">
                                    <label class="text-muted">{{item.norm_name}}:</label>
                                </el-col>
                                <el-col :span="16">
                                    <el-row v-for="(subItem,subIndex) in item.items" :key="subIndex">
                                        <el-col :span="12"><b>{{subItem.item_name}}</b></el-col>
                                        <el-col :span="12">
                                            <el-input-number :value="getNormItemValue(subItem)" label="描述文字"
                                                             size="small"
                                                             @change="(value)=>handleNorm(subItem,value,subIndex)"></el-input-number>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div v-else>
                        <el-input-number label="描述文字" size="small"></el-input-number>
                    </div>
                </div>
                <div class="text-center mt4">
                    <el-button type="primary" size="large" @click="addToCart">添加到进货单</el-button>
                </div>
            </el-col>
            <el-col :span="12">
                <h6>订单详情</h6>
                <div class="cart-detail">
                    <el-table :data="cartList" size="small" stripe style="width: 100%">
                        <el-table-column prop="brand" label="品牌"></el-table-column>
                        <el-table-column prop="name" label="商品名称"></el-table-column>
                        <el-table-column prop="norms" label="规格数量">
                            <template slot-scope="scope">
                                <el-row v-for="(item,index) in scope.row.norms" :key="index">
                                    <el-col :span="12">{{item.name}}</el-col>
                                    <el-col :span="12">{{item.orderNum}}</el-col>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div>
                    <label class="h6">商品总价:</label>
                    <div style="display:inline-block">
                        <el-input size="small" style="width:100px"></el-input>
                    </div>
                    <label class="h6 prl1">运费:</label>
                    <div style="display:inline-block">
                        <el-input size="small" style="width:100px"></el-input>
                    </div>
                </div>
                <div class="mt2">
                    <label class="h6">订单总价：</label>
                </div>
                <div class="mt2">
                    <label class="h6">收货地址：</label>
                </div>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="showAddOrder = false">取消</el-button>
            <el-button type="primary" @click="saveCustomer()">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
	import {queryPostDetailFun, queryGoodsDetailFun} from '@/api/activity'

	export default {
		props: ['show', 'brandList'],
		data() {
			return {
				count: [],//
				brandId: '',//选中的品牌Id
				prodId: '',//选中的商品品Id
				norms_arr: [],
				cartList: [],//进货单
				prodList: [],//根据品牌查出的商品列表
				prodInfo: {},//选中的商品信息
				mainNormItem: {},//一级规格值
			}
		},
		computed: {
			getNormItemValue: function (normItem) {
				this.norms_arr.forEach(item => {
					const {norm_item_arr} = item;
					console.log(norm_item_arr);
					return 0;
									norm_item_arr.every(item)
					// if (norm_item_arr.every([this.mainNormItem, normItem])) {
					// 	return norm_item_arr.count || 0
					// }
				})
			}
		},
		methods: {
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
				let params = {
					goods_id: value
				};
				queryGoodsDetailFun(params).then(res => {
					if (res.data.success) {
						this.prodInfo = res.data.data;
						const {items} = this.prodInfo.normMap[0];
						this.mainNormItem = items[0];
						this.norms_arr = this.prodInfo.skus;
					}
				})
			},
			handleNorm(subItem, count, index) {
				if (this.norms_arr[index]) {
					this.norms_arr[index].count = count;
				} else {
					this.norms_arr.push({
						norms: [this.mainNormItem, subItem],
						count
					})
				}
				console.log(this.norms_arr)
			},
			//添加到进货单
			addToCart() {
				this.cartList.push({
					brand: '东西',
					name: 'aaaa',
					norms: [{
						name: '黄色',
						orderNum: 10
					}, {
						name: '黄色',
						orderNum: 10
					}, {
						name: '黄色',
						orderNum: 10
					}]
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
    .norms-wrapper {
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
</style>
