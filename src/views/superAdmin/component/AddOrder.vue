<template>
    <!--添加订单-->
    <el-dialog title="添加订单" :visible="show" top="5vh">
        <el-row :gutter="10">
            <el-col :span="12">
                <div>
                    <label class="h6">选择品牌：</label>
                    <div style="display:inline-block">
                        <el-select size="small" placeholder="请选择" @change="queryProductList">
                            <el-option v-for="(item,index) in brands"
                                       :value="item.poster_id"
                                       :key="index"
                                       :label="item.poster_name">{{item.poster_name}}
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="mt2">
                    <label class="h6">选择商品：</label>
                    <div style="display:inline-block">
                        <el-select placeholder="请选择" size="small">
                            <el-option label="微信" value="1"></el-option>
                            <el-option label="电话" value="2"></el-option>
                            <el-option label="其他" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="mt4">
                    <el-row v-for="(item,index) in norms" class="mt2">
                        <el-col :span="8">
                            <el-tag>{{item.name}}</el-tag>
                        </el-col>
                        <el-col :span="12">
                            <el-input-number v-model="item.orderNum" label="描述文字" size="small"></el-input-number>
                        </el-col>
                    </el-row>
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
	import {queryPostDetailFun} from '@/api/activity'

	export default {
		props: ['show', 'brandList'],
		data() {
			return {
				isShow: this.show,
				brands: this.brandList,
				norms: [{
					name: '黄色',
					orderNum: 0
				}, {
					name: '绿色',
					orderNum: 0
				}, {
					name: '红色',
					orderNum: 0
				}],
				cartList: [],
			}
		},
		methods: {
			//根据品牌查商品
			queryProductList(value) {
				queryPostDetailFun().then(res => {

				})
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
				console.log(this.cartList);
			},
		}
	}
</script>

<style scoped>

</style>
