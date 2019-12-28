<template>
    <section class="p2">
        <el-row>
            <el-col :span="12">
                <div>客户姓名：{{customInfo.name}} 跟进人：{{customInfo.follows_names}}</div>
            </el-col>
            <el-col :span="12" class="text-right">
                <el-button type="primary" size="small" @click="showAddOrder=true">添加订单</el-button>
                <el-button type="primary" size="small" @click="releaseCustomer">转移至客户公海</el-button>
                <el-button type="danger" size="small" @click="del">删除</el-button>
            </el-col>
        </el-row>
        <el-tabs v-model="activeName">
            <el-tab-pane v-if="type===2" label="跟进动态" name="first">
                <div class="text-right prl2">
                    <el-button size="small" type="primary" @click="showFollowRecord=true">写跟进</el-button>
                </div>
                <ul class="follow-wrapper" v-if="trendList.length">
                    <li v-for="(item,index) in trendList" :key="index" class="follow-item">
                        <div>
                            <img src="../../../../static/img/wechat.png" style="width:32px" alt="" v-if="item.follow_type==='微信'">
                            <img src="../../../../static/img/tel.png" style="width:32px" alt="" v-if="item.follow_type==='电话'">
                            <img src="../../../../static/img/order.png" style="width:32px" alt="" v-if="item.follow_type==='订单'">
                            <img src="../../../../static/img/message.png" style="width:32px" alt="" v-if="item.follow_type==='其他'">
                        </div>
                        <div class="follow-content">
                            <el-row style="width:100%">
                                <el-col :span="12" class="text-grey h5">{{item.salesman_name}}-{{item.follow_type}}</el-col>
                                <el-col :span="12" class="text-grey h5 text-right">
                                    {{$moment(item.cdate*1000).format('YYYY-MM-DD HH:mm')}}
                                </el-col>
                            </el-row>
                            <div class="text-grey">{{item.content}}</div>
                            <div class="h6 text-muted">下次跟进时间：
                                {{item.next_follow_date?$moment(item.next_follow_date*1000).format('YYYY-MM-DD HH:mm'):'无'}}
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-else class="text-center">
                    暂无数据
                </div>
            </el-tab-pane>
            <el-tab-pane v-if="type===2" label="基本资料" name="second">
                <ul>
                    <li>姓名：{{customInfo.name}}</li>
                    <li>电话：{{customInfo.phone}}</li>
                    <li>地址：{{customInfo.province}}{{customInfo.city}}{{customInfo.county}}{{customInfo.address}}</li>
                    <li>品牌：{{customInfo.brand_names}}</li>
                    <li>微信：{{customInfo.wechat}}</li>
                    <li>类型：{{customInfo.type}}</li>
                    <li>创建时间：{{$moment(customInfo.cdate*1000).format('YYYY-MM-DD')}}</li>
                </ul>
            </el-tab-pane>
            <el-tab-pane v-if="type===2" label="客户订单" name="third">
                <el-table :data="orderList" stripe style="width: 100%">
                    <el-table-column label="商品名称">
                        <template slot-scope="scope">
                            <el-row v-for="(goodItem,goodIndex) in scope.row.goods" :key="goodIndex">
                                <el-col :span="12">
                                    {{goodItem.goods_name}}
                                </el-col>
                                <el-col :span="12">
                                    <div v-for="(attrItem,subIndex) in goodItem.countInfo" :key="subIndex">
                                        <span v-for="(normItem,normIndex) in attrItem.norm_snap" :key="normIndex">
                                        {{normItem.sub_name}}
                                        </span>
                                        <span>x{{attrItem.count}}</span>
                                    </div>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pay_total" label="订单价格"></el-table-column>
                    <el-table-column label="下单日期">
                        <template slot-scope="scope">
                            {{$moment(scope.row.cdate).format('YYYY-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="salessman_name" label="业务所属"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane v-if="type===2" label="客户交易" name="fourth">
                <el-card style="width:60%;margin:0 auto" class="mt2" shadow="never">
                    <div slot="header" class="text-center">
                        <span>我的业绩</span>
                    </div>
                    <el-row>
                        <el-col :span="8" class="text-center">
                            <h5>销售额</h5>
                            <h5>￥{{customInfo.spend_money}}</h5>
                        </el-col>
                        <el-col :span="8" class="text-center">
                            <h5>平均单价</h5>
                            <h5>￥{{customInfo.averageMoney}}</h5>
                        </el-col>
                        <el-col :span="8" class="text-center">
                            <h5>累计订单</h5>
                            <h5>{{customInfo.spend_count}}</h5>
                        </el-col>
                    </el-row>
                </el-card>
                <el-card style="width:60%;margin:0 auto" class="mt4" shadow="never">
                    <div slot="header" class="text-center">
                        <span>店铺累计交易</span>
                    </div>
                    <el-row>
                        <el-col :span="8" class="text-center">
                            <h5>销售额</h5>
                            <h5>￥{{customInfo.mch_spend_money}}</h5>
                        </el-col>
                        <el-col :span="8" class="text-center">
                            <h5>平均单价</h5>
                            <h5>￥{{customInfo.mch_averageMoney}}</h5>
                        </el-col>
                        <el-col :span="8" class="text-center">
                            <h5>累计订单</h5>
                            <h5>{{customInfo.mch_spend_count}}</h5>
                        </el-col>
                    </el-row>
                </el-card>
            </el-tab-pane>
            <el-tab-pane label="跟进日志" name="fifth">
                <el-table :data="businessList" stripe style="width: 100%">
                    <el-table-column label="操作时间">
                        <template slot-scope="scope">
                            {{$moment(scope.row.last_follow_date*1000).format('YYYY-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="real_name" label="操作人员"></el-table-column>
                    <el-table-column label="查看">
                        <template slot-scope="scope">
                            <el-button size="small" type="primary" @click="checkFollow(scope.row.salesman_id)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="mt2 text-right">
                    <el-pagination
                            :page-sizes="paginations.pageSizes"
                            :page-size="paginations.page_size"
                            :layout="paginations.layout"
                            :total="paginations.total"
                            :current-page="paginations.page_index"
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                    ></el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!--写跟进-->
        <el-dialog title="写跟进" :visible="showFollowRecord" :show-close="false">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-select placeholder="请选择跟进方式" size="small" style="width:200px" v-model="followRecordInfo.follow_type">
                        <el-option label="微信" value="微信"></el-option>
                        <el-option label="电话" value="电话"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="12" class="text-right" style="width:200px">
                    <el-date-picker
                            v-model="followRecordInfo.cdate"
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
                        v-model="followRecordInfo.content"
                >
                </el-input>
            </div>
            <div class="mt2 text-right">
                <el-date-picker
                        v-model="followRecordInfo.next_follow_date"
                        type="datetime"
                        placeholder="下次跟进时间"
                        size="small"
                        style="width:300px"
                >
                </el-date-picker>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showFollowRecord = false">取消</el-button>
                <el-button type="primary" @click="addFollowRecord()">保存</el-button>
            </div>
        </el-dialog>
        <!--跟进详情-->
        <el-dialog title="查看跟进动态" :visible="checkFollowRecord" :show-close="false">
            <el-row :gutter="20">
                <el-col :span="12">跟进方式：{{otherFollowInfo.follow_type}}</el-col>
                <el-col :span="12" class="text-right" style="width:200px">
                    跟进日期：{{$moment(otherFollowInfo.cdate*1000).format('YYYY-MM-DD')}}
                </el-col>
            </el-row>
            <div class="mt2">{{otherFollowInfo.content}}</div>
            <div class="mt2 text-right">
                下次跟进时间：{{$moment(otherFollowInfo.next_follow_date*1000).format('YYYY-MM-DD')}}
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="checkFollowRecord = false">取消</el-button>
            </div>
        </el-dialog>
        <!--添加订单-->
        <AddOrder @close='closeAddOrder' :show="showAddOrder" :brandList="brandList" :puid="customInfo.puid" ></AddOrder>
    </section>
</template>

<script>
  import {
    queryCustomDetailFun,
    queryCustomOrderListFun,
    queryCustomerTrandFun,
    queryCustomerTrendsFun,
    addFollowRecordFun,
    queryAllBusinessFun,
    releaseCustomerFun,
    delOpenCustomer,
    postListFun
  } from '@/api/activity'
  import AddOrder from '../component/AddOrder'

  export default {
    components: {AddOrder},
    data () {
      return {
        type: this.$route.query.type,//从哪个页面进入的 type=1:客户公海 type=2:客户跟进
        brandList: [],
        showAddOrder: false,
        showFollowRecord: false,
        checkFollowRecord: false,
        activeName: 'first',
        cusId: this.$route.query.id,
        customInfo: {},//客户信息
        orderList: [],//订单列表
        trandInfo: {},//交易信息
        trendList: {},//跟进动态
        followRecordInfo: {
          cdate: new Date()
        },//添加跟进动态
        businessList: [],//所有跟进过的业务员
        otherFollowInfo: {},
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 5, // 1页显示多少条
          pageSizes: [5, 10, 15, 20], //每页显示多少条
          layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
        },
      }
    },
    mounted () {
      this.getCusDetail()
      this.getCusOrderList()
      this.getCusTrandList()
      this.queryBrandList()
    },
    methods: {
      queryBrandList () {
        let params = {
          pageSize: 1000,
          pageIndex: 1
        }
        postListFun(params).then(res => {
          if (res.data.success) {
            this.brandList = res.data.data.data
          }
        })
      },
      //客户基本信息
      getCusDetail () {
        let params = {
          id: this.cusId
        }
        queryCustomDetailFun(params).then(res => {
          if (res.data.success) {
            this.customInfo = res.data.data
            this.getCusTrendList()
            this.getAllBusiness()
          }
        })
      },
      //客户订单列表
      getCusOrderList () {
        let params = {
          id: this.cusId,
          pageIndex: 1,
          pageSize: 15
        }
        queryCustomOrderListFun(params).then(res => {
          if (res.data.success) {
            this.orderList = res.data.data.data
          }
        })
      },
      //交易
      getCusTrandList () {
        let params = {
          id: this.cusId,
          pageIndex: 1,
          pageSize: 15
        }
        queryCustomerTrandFun(params).then(res => {
          if (res.data.success) {
            this.trandInfo = res.data.data
            console.log(this.trandInfo)
          }
        })
      },
      //跟进动态
      getCusTrendList () {
        let params = {
          id: this.cusId,
          pageIndex: 1,
          pageSize: 15
        }
        queryCustomerTrendsFun(params).then(res => {
          if (res.data.success) {
            this.trendList = res.data.data.data
          }
        })
      },
      //写跟进
      addFollowRecord () {
        let params = {
          puid: this.customInfo.puid,
          ...this.followRecordInfo
        }
        addFollowRecordFun(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success',
              center: true
            })
            this.showFollowRecord = false
            this.getCusTrendList()
          }
        })
      },
      //查看跟进
      checkFollow (salesman_id) {
        let params = {
          salesman_id,
          puid: this.customInfo.puid,
        }
        queryCustomerTrendsFun(params).then(res => {
          if (res.data.success) {
            this.checkFollowRecord = true
            this.otherFollowInfo = res.data.data.data
          }
        })
      },
      //所有业务员
      getAllBusiness () {
        let params = {
          puid: this.customInfo.puid,
        }
        queryAllBusinessFun(params).then(res => {
          if (res.data.success) {
            this.businessList = res.data.data
          }
        })
      },
      //转移到客户公海
      releaseCustomer () {
        let params = {
          puid: this.customInfo.puid
        }
        releaseCustomerFun(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: `操作完成!`,
              type: 'success'
            })
            this.getCusDetail()
          }
        })
      },
      del () {
        let params = {
          puid: this.customInfo.puid,
        }
        delOpenCustomer(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: `操作完成!`,
              type: 'success',
              onClose () {
                this.$router.push('/superAdmin/followList')
              }
            })
          }
        })
      },
      closeAddOrder () {
        this.showAddOrder = false
      },
      // 上下分页
      handleCurrentChange (page) {
        this.paginations.page_index = page
        this.getAllBusiness()
      },
      // 每页多少条切换
      handleSizeChange (page_size) {
        this.paginations.page_size = page_size
        this.getAllBusiness()
      },
    }
  }
</script>
<style lang="scss" scoped>
    .follow-wrapper {
        padding: 0;
        width: 90%;
        margin: 20px auto;

        .follow-item {
            border-bottom: solid 1px #f5f5f5;
            display: -webkit-box;
            display: -moz-box;
            display: -ms-flexbox;
            display: -o-box;
            display: box;
            /*! autoprefixer: off */
            -webkit-box-orient: horizontal;
            -moz-box-orient: horizontal;
            -ms-flex-direction: row;
            -o-box-orient: horizontal;
            box-orient: horizontal;
            /*! autoprefixer: on */
            padding: 10px 0;

            .follow-content {
                display: -webkit-box;
                display: -moz-box;
                display: -ms-flexbox;
                display: -o-box;
                display: box;
                /*! autoprefixer: off */
                -webkit-box-orient: vertical;
                -moz-box-orient: vertical;
                -ms-flex-direction: column;
                -o-box-orient: vertical;
                box-orient: vertical;
                /*! autoprefixer: on */

                -webkit-box-flex: 1;
                -moz-box-flex: 1;
                -ms-flex: 1;
                -o-box-flex: 1;
                box-flex: 1;
                width: 100%;
                vertical-align: top;
                margin-left: 20px;
                padding: 0 10px;
            }
        }
    }
</style>
<style>
    .el-card__header {
        color: white;
        padding: 5px 0 !important;
        background: #409EFF;
    }
</style>
