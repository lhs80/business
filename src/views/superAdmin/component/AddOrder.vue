<template>
  <!--添加订单-->
  <el-dialog title="添加订单" :visible="show" top="5vh" :show-close="false" width="800px">
    <el-row :gutter="10">
      <el-col :span="12">
        <div>
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
          <div v-if="norms_arr.length">
            <div v-for="(item,index) in norms_arr" :key="index" class="norms-wrapper">
              <!--              v-if="index===0&&norms_arr.length>1"-->
              <el-row class="mt2">
                <el-col :span="8">
                  <label class="text-muted">{{item.norm_name}}:</label>
                </el-col>
                <el-col :span="12">
                  <span class="norm-item"> {{item.sub_name}}</span>
                </el-col>
              </el-row>
              <el-row class="mt2" v-for="(subItem,subIndex) in item.children" :key="subIndex">
                <el-col :span="6">
                  <label class="text-muted">{{subItem.norm_name}}:</label>
                </el-col>
                <el-col :span="18">
                  <el-row :class="subNormIndex>0?'mt2':''" v-for="(subNormItem,subNormIndex) in subItem.item"
                          :key="subNormIndex">
                    <el-col :span="4"><b>{{subNormItem.sub_name}}</b></el-col>
                    <el-col :span="10" :offset="10">
                      <el-input-number :value="subNormItem.count" label="描述文字"
                                       size="small"
                                       @change="(value)=>handleNorm(value,subNormItem.sku_id,index,subIndex,subNormIndex)"></el-input-number>
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
          <el-table :data="resultProduct" size="small" stripe style="width: 100%">
            <el-table-column prop="brandName" label="品牌"></el-table-column>
            <el-table-column prop="productName" label="商品名称"></el-table-column>
            <el-table-column label="规格数量">
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="12">
                    <span v-for="(subItem,subIndex) in scope.row.norm_item_arr"
                          :key="subIndex">{{subItem.sub_name}}</span>
                  </el-col>
                  <el-col :span="12">x{{ scope.row.count}}</el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
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
          <label class="h6">订单总价：{{Number(orderInfo.total)+Number(orderInfo.express_cost)}}元</label>
        </div>
        <div class="mt2">
          <label class="h6">收货地址：</label>
          <div>
            <div class="open-list-area-select">
              <el-select v-model="orderInfo.province" placeholder="请选择" @change="provinceChange">
                <el-option
                  v-for="(item,index) in province"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </div>
            <div class="open-list-area-select">
              <el-select v-model="orderInfo.city" placeholder="请选择" @change="cityChange">
                <el-option
                  v-for="(item,index) in city"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </div>
            <div class="open-list-area-select">
              <el-select v-model="orderInfo.county" placeholder="请选择">
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
            <el-input v-model="orderInfo.address" autocomplete="off"></el-input>
          </div>
        </div>
        <div class="mt2">
          <el-input v-model="orderInfo.remark"></el-input>
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="saveOrder()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {queryPostDetailFun, queryGoodsDetailFun, addOrderFun} from '@/api/activity'
  import ChinaAddress from '@/common/china_address_v4.json'

  export default {
    props: ['show', 'brandList'],
    data() {
      return {
        province: Object.keys(ChinaAddress),
        city: [],
        county: [],
        count: [],//
        brandId: '',//选中的品牌Id
        prodId: '',//选中的商品品Id
        norms_arr: [],
        cartList: [],//进货单
        resultProduct: [],
        prodList: [],//根据品牌查出的商品列表
        prodInfo: {},//选中的商品信息
        mainNormItem: {},//一级规格值
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
              let index = -1;
              this.prodInfo = res.data.data;
              res.data.data.skus.forEach(skuItem => {
                  index = this.norms_arr.findIndex(item => item.subId === skuItem.norm_item_arr[0].subId);
                  if (index >= 0) {
                    let subIndex = this.norms_arr[index].children.findIndex(item => item.norm_id === skuItem.norm_item_arr[1].norm_id);
                    if (subIndex >= 0) {
                      this.norms_arr[index].children[subIndex].item.push({
                        ...skuItem.norm_item_arr[1],
                        sku_id: skuItem.sku_id,
                        count: 0,
                      })
                    } else {
                      this.norms_arr[index].children.push({
                        name: skuItem.norm_item_arr[1].norm_name,
                        subId: skuItem.norm_item_arr[1].subId,
                        item: [{
                          ...skuItem.norm_item_arr[1],
                          sku_id: skuItem.sku_id,
                          count: 0,
                        }]
                      })
                    }
                  } else {
                    this.norms_arr.push({
                      ...skuItem.norm_item_arr[0],
                      children: [{
                        norm_name: skuItem.norm_item_arr[1].norm_name,
                        norm_id: skuItem.norm_item_arr[1].norm_id,
                        item: [{
                          ...skuItem.norm_item_arr[1],
                          sku_id: skuItem.sku_id,
                          count: 0,
                        }]
                      }],
                    });
                  }
                }
              );
            }
          }
        )
      },
      handleNorm(count, skuId, index, childIndex, subIndex) {
        setTimeout(() => {
          this.norms_arr[index].children[childIndex].item[subIndex].count = count;
          let itemIndex = this.cartList.findIndex(item => item.sku_id === skuId);
          if (itemIndex >= 0) {
            this.cartList[itemIndex].count = count;
          } else
            this.cartList.push({
              sku_id: skuId,
              count
            });
        }, 1000)
      },
      //添加到进货单
      addToCart() {
        this.resultProduct = [];
        this.cartList.forEach(item => {
          let product = this.prodInfo.skus.filter(prod => prod.sku_id === item.sku_id)[0];
          this.orderInfo.total += product.price * item.count;
          this.resultProduct.push({
            brandName: this.brandList.filter(brand => brand.poster_id === this.brandId)[0].poster_name,
            productName: this.prodInfo.goods_name,
            ...product,
            count: item.count,
          })
        });
        console.log(this.resultProduct);
      },
      saveOrder() {

        let params = {
          ...this.orderInfo,
          puid: '',
          countInfo: []
        };
        this.resultProduct.forEach(item => {
          const {sku_id, count} = item;
          params.countInfo.push({sku_id, count})
        });
        console.log(params);
        // addOrderFun(params).then(res => {
        //   if (res.data.success) {
        //     this.$emit('close');
        //     this.$message({
        //       showClose: true,
        //       message: "添加成功",
        //       type: "success"
        //     })
        //   }
        // })
      },
      provinceChange(value) {
        this.city = Object.keys(ChinaAddress[value]);
      },
      cityChange() {
        this.county = ChinaAddress[this.orderInfo.province][this.orderInfo.city];
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
