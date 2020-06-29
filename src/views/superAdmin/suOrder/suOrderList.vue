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
        <el-select size="small" v-model="searchType" placeholder="请选择">
          <el-option value="order_id" label="订单号">订单号</el-option>
          <el-option value="receipt_person" label="收件人姓名">收件人姓名</el-option>
          <el-option value="receipt_phone" label="手机号">手机号</el-option>
          <el-option value="address" label="地址信息">地址信息</el-option>
          <el-option value="nick_name" label="微信昵称">微信昵称</el-option>
          <el-option value="m_name" label="商户名称">商户名称</el-option>
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
      <el-col :span="9" class="prl2">商品</el-col>
      <el-col :span="3" class="text-center">买家</el-col>
      <el-col :span="3" class="text-center">支付/配送</el-col>
      <el-col :span="3" class="text-center">价格</el-col>
      <el-col :span="3" class="text-center">操作</el-col>
      <el-col :span="3" class="text-center">状态</el-col>
    </el-row>
    <!--订单-->
    <aside class="order-panel mt2" v-for="(item,index) in orderList" :key="index">
      <div class="bg-grey h6 prl2 ptb1">
        <b>{{timestampToTime(item.cdate)}}</b>
        <span class="text-muted prl1">订单编号：{{item.order_id}}</span>
      </div>
      <el-row class="order-panel-content" type="flex" align="middle">
        <!--商品-->
        <el-col :span="9" class="prl2 h6">
          <table style="width:100%">
            <tr v-for="(gooditem,key) in item.goods" :key="key">
              <td style="width:50px">
                <img width="50px" height="50px" :src="gooditem.logo"/>
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
        <!--买家-->
        <el-col :span="3" class="text-center">
          <div>
            <h6>{{item.nick_name}}</h6>
            <h6>{{item.receipt_person}}</h6>
            <h6>{{item.receipt_phone}}</h6>
          </div>
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
          <div>￥{{item.order_total}}</div>
        </el-col>
        <!--操作-->
        <el-col :span="3" class="text-center">
          <div>
            <router-link :to="{ path: '/superdetail/orderdetail',query:{id:item.order_id}}">
              <h6 class="text-primary text-link">
                查看详情
              </h6>
            </router-link>
            <h6 class="text-primary text-link" v-if="item.order_status===3||item.order_status===4"
                @click="showDelive(item.order_id)">
              物流信息
            </h6>
          </div>
        </el-col>
        <!--状态-->
        <el-col :span="3" class="text-center h6">
          <div>
            <div v-html="orderType(item.order_status)"></div>
            <el-button type="primary" size="small" @click="showAddOrderPanel(item)" v-if="item.order_status===2">修改订单
            </el-button>
            <!--<el-button type="primary" size="small" @click="getOrderList" v-if="item.order_status===2">确认发货</el-button>-->
            <!--<el-button type="primary" size="small" @click="getOrderList" v-if="item.order_status===1">确认付款</el-button>-->
          </div>
        </el-col>
      </el-row>
    </aside>
    <!--暂无数据-->
    <div class="text-center mt2 text-muted h5" v-if="!orderList.length">暂时没有任何订单!</div>
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
    <!--物流弹框-->
    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
         style="z-index: 99;" v-show="isShowDelive">
      <div class="el-message-box el-message-box--center">
        <div class="bg-grey">
          <el-row class="prl2">
            <el-col :span="12" class="h5">查看物流</el-col>
            <el-col :span="12" class="text-right h4">
              <i class="el-message-box__close el-icon-close" @click="isShowDelive=false"></i>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__content">
          <div v-if="detail.delive_traces&&!detail.delive_traces.length">{{detail.delive_state_str}}</div>
          <el-steps :active="1" direction="vertical" v-else :space="80" finish-status="finish" class="mt2">
            <el-step v-for="(item,index) in detail.delive_traces" :key="index" simple>
              <h5 slot="title">{{item.AcceptStation}}</h5>
              <h5 slot="description" class="mt1">{{item.AcceptTime}}</h5>
              <i slot="icon" class="iconfont icon-dian"></i>
            </el-step>
          </el-steps>
        </div>
        <div class="el-message-box__btns">
          <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                  @click="isShowDelive=false">
            <span>关闭</span>
          </button>
        </div>
      </div>
    </div>
    <div class="v-modal" tabindex="0" style="z-index: 80;" v-if="isShowDelive"></div>
    <!--添加订单-->
    <UpdateOrder @close='closeAddOrder' :show="showUpdateOrder" :curOrderItem="curOrderItem"
                 @getOrderList="getOrderList"></UpdateOrder>
  </div>
</template>
<script>
  import {adminOrderList, getOrderDetailFun} from '@/api/activity'
  import UpdateOrder from '../component/UpdateOrder'

  export default {
    components: {UpdateOrder},
    data() {
      return {
        curOrderItem: {},
        showUpdateOrder: false,
        isShowDelive: false,
        searchKey: '',
        orderList: [],
        detail: {},
        isSearchByTime: 'cdate',
        timeRange: '',
        searchType: 'order_id',
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 5, // 1页显示多少条
          pageSizes: [5, 10, 15, 20], //每页显示多少条
          layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
        },
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      };
    },
    watch: {
      '$route': 'getOrderList'
    },
    mounted() {
      this.getOrderList();
    },
    methods: {
      getOrderList() {
        let params = {
          orderStatus: this.$route.query.type,
          searchTimeType: this.isSearchByTime,
          startTime: this.timeRange[0],
          endTime: this.timeRange[1],
          searchType: this.searchType,
          searchKey: this.searchKey,
          pageSize: this.paginations.page_size,
          pageIndex: this.paginations.page_index,
          uid: this.$route.query.uid
        };
        adminOrderList(params).then(res => {
          if (res.data.success) {
            this.orderList = res.data.data.data;
            this.paginations.page_count = res.data.data.pageinfo.totalpage;
            this.paginations.total = res.data.data.pageinfo.count;
          }
        })
      },
      //从订单详情查询物流信息
      showDelive(id) {
        let params = {
          order_id: id
        };
        getOrderDetailFun(params).then(res => {
          if (res.data.success) {
            this.detail = res.data.data;
            this.isShowDelive = true;
          }
        })
      },
      showAddOrderPanel(item) {
        this.showUpdateOrder = true;
        this.curOrderItem = item;
      },
      //付款状态
      payType(type) {
        switch (type) {
          case 0:
            return '未支付';
          case 1:
            return '微信';
          case 2:
            return '支付宝';
        }
      },
      //订单状态
      orderType(type) {
        switch (type) {
          case 0:
            return '已取消';
          case 1:
            return '<span class=\'text-danger\'>待支付</span>';
          case 2:
            return '<span class=\'text-info\'>待发货</span>';
          case 3:
            return '<span class=\'text-warning\'>待收货</span>';
          case 4:
            return '<span class=\'text-success\'>已完成</span>';
          case -1:
            return '<span>已关闭</span>';
        }
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
      closeAddOrder() {
        this.showUpdateOrder = false
      }
    }
  };
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
        -webkit-box-orient: vertical;
        -webkit-box-pack: center;
        height: 100px;
        border-left: solid 1px #e5e5e5;
      }
    }
  }
</style>
