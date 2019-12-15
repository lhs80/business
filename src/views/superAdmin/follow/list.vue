<template>
  <div style="position:relative" class="app-container calendar-list-container client-list">
    <div class="btn-add-customer">
      <el-button type="primary" size="small" @click="showExportCustomer=true">新增客户</el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="跟进客户" name="first">
        <!--菜单栏-->
        <div class="bg-white">
          <div>
            <span class="h5" style="display:inline-block;width:100px">客户类型：</span>
            <span>
              <el-radio label="1">备选项</el-radio>
              <el-radio label="2">备选项</el-radio>
            </span>
          </div>
          <div>
            <span class="h5" style="display:inline-block;width:100px">品 牌：</span>
            <span>
              <el-radio label="1">备选项</el-radio>
              <el-radio label="2">备选项</el-radio>
            </span>
          </div>
        </div>
        <hr>
        <el-row>
          <el-col :span="12">
            <el-button type="primary" size="small" @click="">编辑</el-button>
            <el-button type="primary" size="small" @click="changeGoodStatus(0)">转移至客户公海</el-button>
            <el-button type="danger" size="small" @click="passCheck()">删除</el-button>
            <el-button type="primary" size="small" @click="passCheck()">转移</el-button>
          </el-col>
          <el-col :span="12" class="text-right">
            <div style="width:150px;display:inline-block;">
              <el-input size="small" v-model="txInfo.searchKey" placeholder="请输入客户姓名/手机号"></el-input>
            </div>
            <div style="display:inline-block;">
              <el-button type="primary" size="small" @click="getCustomerList">搜索</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table :data="cusList" stripe style="width: 100%">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="客户姓名">
            <template slot-scope="scope">
              <router-link to="/superAdmin/followList/detail">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="tel" label="客户电话"></el-table-column>
          <el-table-column prop="brand" label="品牌"></el-table-column>
          <el-table-column prop="wxNo" label="客户微信"></el-table-column>
          <el-table-column prop="type" label="客户地址"></el-table-column>
          <el-table-column prop="orderNum" label="客户类型"></el-table-column>
          <el-table-column prop="lastTime" label="距上次跟进"></el-table-column>
          <el-table-column label="跟进记录">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="showFollowRecord=true">写跟进</el-button>
            </template>
          </el-table-column>
        </el-table>
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
      </el-tab-pane>
      <el-tab-pane label="我的成交客户" name="second">
        <!--菜单栏-->
        <div class="bg-white">
          <div>
            <span class="h5" style="display:inline-block;width:100px">客户类型：</span>
            <span>
                      <el-radio label="1">备选项</el-radio>
                      <el-radio label="2">备选项</el-radio>
                    </span>
          </div>
          <div>
            <span class="h5" style="display:inline-block;width:100px">品 牌：</span>
            <span>
                      <el-radio label="1">备选项</el-radio>
                      <el-radio label="2">备选项</el-radio>
                    </span>
          </div>
        </div>
        <hr>
        <el-row>
          <el-col :span="12">
            <el-button type="primary" size="small" @click="">编辑</el-button>
            <el-button type="primary" size="small" @click="changeGoodStatus(0)">转移至客户公海</el-button>
            <el-button type="danger" size="small" @click="passCheck()">删除</el-button>
            <el-button type="primary" size="small" @click="showAddOrder=true">添加订单</el-button>
            <el-button type="primary" size="small" @click="passCheck()">转移</el-button>
          </el-col>
          <el-col :span="12" class="text-right">
            <div style="width:150px;display:inline-block;">
              <el-input size="small" v-model="txInfo.searchKey" placeholder="请输入客户姓名/手机号"></el-input>
            </div>
            <div style="display:inline-block;">
              <el-button type="primary" size="small" @click="getCustomerList">搜索</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table :data="cusList" stripe style="width: 100%">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="客户姓名">
            <template slot-scope="scope">
              <router-link to="/superAdmin/followList/detail">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="tel" label="客户电话"></el-table-column>
          <el-table-column prop="brand" label="品牌"></el-table-column>
          <el-table-column prop="wxNo" label="客户微信"></el-table-column>
          <el-table-column prop="type" label="客户类型"></el-table-column>
          <el-table-column prop="orderNum" label="累计订单"></el-table-column>
          <el-table-column prop="price" label="订单均价"></el-table-column>
          <el-table-column prop="lastTime" label="距上次下单时间"></el-table-column>
          <el-table-column label="跟进记录">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="showFollowRecord=true">写跟进</el-button>
            </template>
          </el-table-column>
        </el-table>
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
      </el-tab-pane>
    </el-tabs>
    <!--新增客户-->
    <el-dialog title="新增客户" :visible="showExportCustomer">
      <el-form :model="customerInfo">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="customerInfo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="customerInfo.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="customerInfo.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌" :label-width="formLabelWidth">
          <el-input v-model="customerInfo.wxChat" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信" :label-width="formLabelWidth">
          <el-input v-model="customerInfo.wxChat" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-input v-model="customerInfo.wxChat" autocomplete="off"></el-input>
        </el-form-item>
        <div class="text-center h6 text-muted">提示：新增客户有30天保护期，不会被归入客户公海，30天后如未成交自动释放到客户公海！</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showExportCustomer = false">取消</el-button>
        <el-button type="primary" @click="saveCustomer()">保存</el-button>
      </div>
    </el-dialog>
    <!--写跟进-->
    <el-dialog title="写跟进" :visible="showFollowRecord">
      <el-row>
        <el-col :span="6">
          <el-select placeholder="请选择" size="small" style="width:200px">
            <el-option label="微信" value="1"></el-option>
            <el-option label="电话" value="2"></el-option>
            <el-option label="其他" value="3"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" offset="11" class="text-right" style="width:200px">
          <el-date-picker
            v-model="followRecordTime"
            type="datetime"
            placeholder="选择日期"
            size="small"
          >
          </el-date-picker>
        </el-col>
      </el-row>
      <div class="mt2">
        <el-input
          type="textarea"
          :autosize="{ minRows: 5}"
          placeholder="请输入内容"
        >
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showFollowRecord = false">取消</el-button>
        <el-button type="primary" @click="saveCustomer()">保存</el-button>
      </div>
    </el-dialog>
    <!--添加订单-->
    <el-dialog title="添加订单" :visible="showAddOrder" top="5vh">
      <el-row :gutter="10">
        <el-col :span="12">
          <div>
            <label class="h6">选择品牌：</label>
            <div style="display:inline-block">
              <el-select v-model="brandName" placeholder="请选择" size="small">
                <el-option label="微信" value="1"></el-option>
                <el-option label="电话" value="2"></el-option>
                <el-option label="其他" value="3"></el-option>
              </el-select>
            </div>
          </div>
          <div class="mt2">
            <label class="h6">选择商品：</label>
            <div style="display:inline-block">
              <el-select v-model="product" placeholder="请选择" size="small">
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
  </div>
</template>
<script>
  import {adminTxOrderListFun, adminHandleTxOrderFun} from "@/api/activity"

  export default {
    data() {
      return {
        product: '',//商品信息
        brandName: '',//品牌信息
        followRecordTime: '',
        activeName: 'first',
        formLabelWidth: '120px',
        showExportCustomer: false,
        showFollowRecord: false,
        showAddOrder: false,
        txList: [],
        timeRange: "",
        customerInfo: {
          name: '',
          tel: '',
          address: '',
          wxChat: ''
        },
        txInfo: {
          serachName: ''
        },
        cusList: [{
          name: 'ddd',
          tel: '111111',
          brand: 'dd',
          wxNo: '',
          type: 1,
          orderNum: 2,
          price: 2.4,
          lastTime: 'dddd'
        }],
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 5, // 1页显示多少条
          pageSizes: [5, 10, 15, 20], //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
        },
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
        cartList: []
      }
    },
    mounted() {

    },
    methods: {
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
      getCustomerList() {
      },
      saveCustomer() {
        this.showExportCustomer = false;
      },
      // 上下分页
      handleCurrentChange(page) {
        this.paginations.page_index = page;
        this.getOrderList();
      },
      // 每页多少条切换
      handleSizeChange(page_size) {
        this.paginations.page_size = page_size;
        this.getOrderList()
      },
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .btn-add-customer {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .cart-detail {
    height: 300px;
    overflow: auto;
  }
</style>
