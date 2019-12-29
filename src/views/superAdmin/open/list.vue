<template>
    <div style="position:relative" class="app-container calendar-list-container client-list">
        <div class="btn-add-customer">
            <el-button type="primary" size="small" @click="showExportCustomer=true">新增客户</el-button>
        </div>
        <el-tabs v-model="activeName" @change="multipleSelection=[]">
            <el-tab-pane label="跟进客户" name="first">
                <!--菜单栏-->
                <div class="bg-white">
                    <div>
                        <span class="h5" style="display:inline-block;width:100px">客户类型：</span>
                        <span>
              <el-radio v-model="searchMyParams.type" label="">全部</el-radio>
              <el-radio v-model="searchMyParams.type" label="代理">代理</el-radio>
              <el-radio v-model="searchMyParams.type" label="S">S</el-radio>
              <el-radio v-model="searchMyParams.type" label="A">A</el-radio>
              <el-radio v-model="searchMyParams.type" label="B">B</el-radio>
              <el-radio v-model="searchMyParams.type" label="C">C</el-radio>
            </span>
                    </div>
                    <div>
                        <span class="h5" style="display:inline-block;width:100px">品 牌：</span>
                        <span>
               <el-radio v-for="(item,index) in brandList"
                         v-model="searchMyParams.brand_id"
                         :label="item.poster_id" :key="index">{{item.poster_name}}</el-radio>
            </span>
                    </div>
                </div>
                <hr>
                <el-row>
                    <el-col :span="12">
                        <el-button type="primary" size="small" :disabled="!multipleSelection.length>0" @click="todoEdit(1)">编辑
                        </el-button>
                        <el-button type="primary" size="small" :disabled="!multipleSelection.length>0" @click="releaseCustomer(1)">
                            转移至客户公海
                        </el-button>
                        <el-button type="primary" size="small" :disabled="!multipleSelection.length>0"
                                   @click="showChangeFollower=1">转移
                        </el-button>
                    </el-col>
                    <el-col :span="12" class="text-right">
                        <div style="width:150px;display:inline-block;">
                            <el-input size="small" v-model="searchMyParams.searchKey" placeholder="请输入客户姓名/手机号"></el-input>
                        </div>
                        <div style="display:inline-block;">
                            <el-button type="primary" size="small" @click="getMyCustomerList()">搜索</el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-table :data="myCusList" stripe style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="name" label="客户姓名">
                        <template slot-scope="scope">
                            <router-link :to="{path: '/superAdmin/followList/detail',query:{id:scope.row.id,type:2}}">
                                <b class="text-info">{{scope.row.name}}</b>
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="phone" label="客户电话"></el-table-column>
                    <el-table-column prop="brand_names" label="品牌"></el-table-column>
                    <el-table-column prop="wechat" label="客户微信"></el-table-column>
                    <el-table-column label="客户地址">
                        <template slot-scope="scope">
                            <span>{{scope.row.province}}{{scope.row.city}}{{scope.row.county}}{{scope.row.address}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="客户类型"></el-table-column>
                    <el-table-column prop="last_follow_timespan_str" label="距上次跟进"></el-table-column>
                    <el-table-column label="跟进记录">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="showFollowRecord=scope.row.puid">写跟进</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        v-if="myPaginations.total > 0"
                        :page-sizes="myPaginations.pageSizes"
                        :page-size="myPaginations.page_size"
                        :layout="myPaginations.layout"
                        :total="myPaginations.total"
                        :current-page="myPaginations.page_index"
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
                          <el-radio v-model="searchDoneParams.type" label="1">代理</el-radio>
                          <el-radio v-model="searchDoneParams.type" label="2">S</el-radio>
                          <el-radio v-model="searchDoneParams.type" label="2">A</el-radio>
                          <el-radio v-model="searchDoneParams.type" label="2">B</el-radio>
                          <el-radio v-model="searchDoneParams.type" label="2">C</el-radio>
                        </span>
                    </div>
                    <div>
                        <span class="h5" style="display:inline-block;width:100px">品 牌：</span>
                        <span>
                          <el-radio v-for="(item,index) in brandList"
                                    v-model="searchDoneParams.brand_id"
                                    :label="item.poster_id" :key="index">{{item.poster_name}}</el-radio>
                        </span>
                    </div>
                </div>
                <hr>
                <el-row>
                    <el-col :span="12">
                        <el-button type="primary" size="small" :disabled="!doneSelection.length>0" @click="todoEdit(2)">编辑
                        </el-button>
                        <el-button type="primary" size="small" :disabled="!doneSelection.length>0" @click="releaseCustomer(2)">
                            转移至客户公海
                        </el-button>
                        <el-button type="primary" size="small" :disabled="!doneSelection.length>0" @click="showAddOrder=true">添加订单</el-button>
                        <el-button type="primary" size="small" :disabled="!doneSelection.length>0" @click="showChangeFollower=2">
                            转移
                        </el-button>
                    </el-col>
                    <el-col :span="12" class="text-right">
                        <div style="width:150px;display:inline-block;">
                            <el-input size="small" v-model="searchDoneParams.searchKey" placeholder="请输入客户姓名/手机号"></el-input>
                        </div>
                        <div style="display:inline-block;">
                            <el-button type="primary" size="small" @click="getDoneCustomerList">搜索</el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-table :data="doneCusList" stripe style="width: 100%" @selection-change="doneSelectionChange">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="name" label="客户姓名">
                        <template slot-scope="scope">
                            <router-link :to="{ path: '/superAdmin/followList/detail',query:{id:scope.row.id,type:2}}">
                                <b class="text-info">{{scope.row.name}}</b>
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="phone" label="客户电话"></el-table-column>
                    <el-table-column prop="brand_name" label="品牌"></el-table-column>
                    <el-table-column prop="wechat" label="客户微信"></el-table-column>
                    <el-table-column prop="type" label="客户类型"></el-table-column>
                    <el-table-column prop="spend_count" label="业绩订单"></el-table-column>
                    <el-table-column prop="spend_money" label="订单均价"></el-table-column>
                    <el-table-column prop="last_buy_date" label="距上次下单时间"></el-table-column>
                    <el-table-column label="跟进记录">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="showFollowRecord=scope.row.puid">写跟进</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        v-if="donePaginations.total > 0"
                        :page-sizes="donePaginations.pageSizes"
                        :page-size="donePaginations.page_size"
                        :layout="donePaginations.layout"
                        :total="donePaginations.total"
                        :current-page="donePaginations.page_index"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                ></el-pagination>
            </el-tab-pane>
        </el-tabs>
        <!--新增客户-->
        <el-dialog title="新增客户" :visible="showExportCustomer" width="600px" :show-close="false">
            <el-form :model="customerInfo">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input size="small" v-model="customerInfo.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机" :label-width="formLabelWidth">
                    <el-input size="small" v-model="customerInfo.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" :label-width="formLabelWidth">
                    <div>
                        <div class="open-list-area-select">
                            <el-select size="small" v-model="customerInfo.province" placeholder="请选择" @change="provinceChange">
                                <el-option
                                        v-for="(item,index) in province"
                                        :key="index"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="open-list-area-select">
                            <el-select size="small" v-model="customerInfo.city" placeholder="请选择" @change="cityChange">
                                <el-option
                                        v-for="(item,index) in city"
                                        :key="index"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="open-list-area-select">
                            <el-select size="small" v-model="customerInfo.county" placeholder="请选择">
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
                        <el-input size="small" v-model="customerInfo.address" autocomplete="off"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="品牌" :label-width="formLabelWidth">
                    <el-select size="small" v-model="customerInfo.brand_ids" placeholder="请选择">
                        <el-option v-for="(item,index) in brandList"
                                   :value="item.poster_id"
                                   :key="index"
                                   :label="item.poster_name">{{item.poster_name}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="微信" :label-width="formLabelWidth">
                    <el-input size="small" v-model="customerInfo.wechat" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-select size="small" v-model="customerInfo.type" placeholder="请选择">
                        <el-option value="" label="">全部</el-option>
                        <el-option value="代理" label="代理">代理</el-option>
                        <el-option value="S" label="S">S</el-option>
                        <el-option value="A" label="A">A</el-option>
                        <el-option value="B" label="B">B</el-option>
                        <el-option value="C" label="C">C</el-option>
                    </el-select>
                    <div v-if="customerInfo.type==='代理'">
                        <div class="open-list-area-select">
                            <el-select size="small" v-model="customerInfo.agent_provice" placeholder="请选择" @change="provinceChange">
                                <el-option
                                        v-for="(item,index) in province"
                                        :key="index"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="open-list-area-select">
                            <el-select size="small" v-model="customerInfo.agent_city" placeholder="请选择" @change="cityChange">
                                <el-option
                                        v-for="(item,index) in city"
                                        :key="index"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="open-list-area-select">
                            <el-select size="small" v-model="customerInfo.agent_county" placeholder="请选择">
                                <el-option
                                        v-for="item in county"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </el-form-item>
                <div class="text-center h6 text-muted">提示：新增客户有30天保护期，不会被归入客户公海，30天后如未成交自动释放到客户公海！</div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showExportCustomer = false">取消</el-button>
                <el-button type="primary" @click="saveCustomer()">保存</el-button>
            </div>
        </el-dialog><!--新增客户-->
        <!--编辑客户-->
        <el-dialog title="编辑客户信息" :visible="showEditCustomer" width="600px" :show-close="false">
            <el-form :model="customerInfo">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input size="small" v-model="customerInfo.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机" :label-width="formLabelWidth">
                    <el-input size="small" v-model="customerInfo.phone" autocomplete="off" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="地址" :label-width="formLabelWidth">
                    <div>
                        <div class="open-list-area-select">
                            <el-select size="small" v-model="customerInfo.province" placeholder="请选择" @change="provinceChange">
                                <el-option
                                        v-for="(item,index) in province"
                                        :key="index"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="open-list-area-select">
                            <el-select size="small" v-model="customerInfo.city" placeholder="请选择" @change="cityChange">
                                <el-option
                                        v-for="(item,index) in city"
                                        :key="index"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="open-list-area-select">
                            <el-select size="small" v-model="customerInfo.county" placeholder="请选择">
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
                        <el-input size="small" v-model="customerInfo.address" autocomplete="off"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="品牌" :label-width="formLabelWidth">
                    <el-select size="small" v-model="customerInfo.brand_ids" placeholder="请选择">
                        <el-option v-for="(item,index) in brandList"
                                   :value="item.poster_id"
                                   :key="index"
                                   :label="item.poster_name">{{item.poster_name}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="微信" :label-width="formLabelWidth">
                    <el-input size="small" v-model="customerInfo.wechat" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-select size="small" v-model="customerInfo.type" placeholder="请选择">
                        <el-option value="" label="">全部</el-option>
                        <el-option value="代理" label="代理">代理</el-option>
                        <el-option value="S" label="S">S</el-option>
                        <el-option value="A" label="A">A</el-option>
                        <el-option value="B" label="B">B</el-option>
                        <el-option value="C" label="C">C</el-option>
                    </el-select>
                </el-form-item>
                <div class="text-center h6 text-muted">提示：新增客户有30天保护期，不会被归入客户公海，30天后如未成交自动释放到客户公海！</div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="()=>{showEditCustomer = false;customerInfo={}}">取消</el-button>
                <el-button type="primary" @click="editCustomerInfo()">保存</el-button>
            </div>
        </el-dialog>
        <!--写跟进-->
        <el-dialog title="写跟进" :visible="showFollowRecord!==''" :show-close="false">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-select placeholder="请选择跟进方式" size="small" style="width:100%" v-model="followRecordInfo.follow_type">
                        <el-option label="微信" value="微信"></el-option>
                        <el-option label="电话" value="电话"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="12" class="text-right">
                    <el-date-picker
                            v-model="followRecordInfo.cdate"
                            type="datetime"
                            placeholder="选择日期"
                            size="small"
                            style="width:100%"
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
                <el-button @click="showFollowRecord = ''">取消</el-button>
                <el-button type="primary" @click="addFollowRecord()">保存</el-button>
            </div>
        </el-dialog>
        <!--转移--团队经理权限-->
        <el-dialog title="转移" :visible="showChangeFollower!==''" width="600px" :show-close="false">
            <el-select size="small" v-model="salesman" placeholder="请选择">
                <el-option
                        v-for="(item,index) in employeeList"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showChangeFollower = ''">取消</el-button>
                <el-button type="primary" @click="changeFollower()">确定</el-button>
            </div>
        </el-dialog>
        <!--添加订单-->
        <AddOrder @close='closeAddOrder' :show="showAddOrder" :brandList="brandList" :puid="doneSelection[0]"></AddOrder>
    </div>
</template>
<script>
  import {
    addMyCustomerFun,
    followDoneListFun,
    followMyListFun,
    addFollowRecordFun,
    postListFun,
    releaseCustomerFun,
    editCustomerInfoFun,
    changeFollowFun,
    getAllUserByMchFun
  } from '@/api/activity'
  import ChinaAddress from '@/common/china_address_v4.json'
  import AddOrder from '../component/AddOrder'
  import {getStore} from '@/utils/store'

  export default {
    components: {AddOrder},
    data () {
      return {
        province: Object.keys(ChinaAddress),
        city: [],
        county: [],
        brandName: '',//品牌信息
        followRecordTime: '',
        activeName: 'first',
        formLabelWidth: '50px',
        showExportCustomer: false,
        showFollowRecord: '',
        showAddOrder: false,
        showEditCustomer: false,
        showChangeFollower: '',
        timeRange: '',
        searchMyParams: {},
        searchDoneParams: {},
        salesman: '',
        followRecordInfo: {
          cdate: new Date()
        },
        customerInfo: {
          name: '',
          tel: '',
          address: '',
          wxChat: ''
        },
        doneCusList: [],
        myCusList: [],
        myPaginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 5, // 1页显示多少条
          pageSizes: [5, 10, 15, 20], //每页显示多少条
          layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
        },
        donePaginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 5, // 1页显示多少条
          pageSizes: [5, 10, 15, 20], //每页显示多少条
          layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
        },
        brandList: [],
        multipleSelection: [],
        doneSelection: [],
        employeeList: [],
        userInfo: {}
      }
    },
    mounted () {
      this.getDoneCustomerList()
      this.getMyCustomerList()
      this.queryBrandList()
      this.getAllUserByMch()
      this.userInfo = getStore({
        name: 'userinfo'
      })
      console.log(this.userInfo)
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
      //我的成交客户
      getDoneCustomerList () {
        let params = {
          ...this.searchDoneParams,
          pageSize: this.myPaginations.page_size,
          pageIndex: this.myPaginations.page_index
        }
        followDoneListFun(params).then(res => {
          if (res.data.success) {
            this.doneCusList = res.data.data.data
          }
        })
      },
      //我的跟进客户
      getMyCustomerList () {
        let params = {
          ...this.searchMyParams,
          pageSize: this.myPaginations.page_size,
          pageIndex: this.myPaginations.page_index
        }
        followMyListFun(params).then(res => {
          if (res.data.success) {
            this.myCusList = res.data.data.data
          }
        })
      },
      //写跟进
      addFollowRecord () {
        let params = {
          puid: this.showFollowRecord,
          ...this.followRecordInfo
        }
        addFollowRecordFun(params).then(res => {
          if (res.data.success) {
            this.showFollowRecord = ''
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success',
              center: true
            })
          }
        })
      },
      //新增客户
      saveCustomer () {
        this.customerInfo.brand_names = this.brandList.filter(item => item.poster_id === this.customerInfo.brand_ids)[0].poster_name
        addMyCustomerFun(this.customerInfo).then(res => {
          if (res.data.success) {
            this.customerInfo = {}
            this.showExportCustomer = false
            this.getMyCustomerList()
            this.getDoneCustomerList()
            this.$message({
              showClose: true,
              message: '添加成功！',
              type: 'success'
            })
          }
        })
      },
      todoEdit (type) {
        let list = type === 1 ? this.multipleSelection : this.doneSelection
        this.showEditCustomer = true
        this.customerInfo = list[0]
      },
      //编辑客户信息
      editCustomerInfo () {
        this.customerInfo.brand_names = this.brandList.filter(item => item.poster_id === this.customerInfo.brand_ids)[0].poster_name
        editCustomerInfoFun(this.customerInfo).then(res => {
          if (res.data.success) {
            this.showEditCustomer = false
            this.customerInfo = {}
            this.getDoneCustomerList()
            this.getMyCustomerList()
          }
        })
      },
      //转移到客户公海
      releaseCustomer (type) {
        let count = 0
        let list = type === 1 ? this.multipleSelection : this.doneSelection
        list.forEach(item => {
          let params = {
            puid: item.puid
          }
          releaseCustomerFun(params).then(res => {
            if (res.data.success) {
              count++
            }
          })
        })
        setTimeout(() => {
          this.$message({
            showClose: true,
            message: `操作完成！成功${count}条，失败${this.multipleSelection.length - count}条!`,
            type: 'success'
          })
          this.getDoneCustomerList()
          this.getMyCustomerList()
        }, 1000)
      },
      //所有员工
      getAllUserByMch () {
        let params = {
          is_payroll: 1,
          group_id: this.userInfo.group_id
        }
        getAllUserByMchFun(params).then(res => {
          if (res.data.success) {
            this.employeeList = res.data.data
          }
        })
      },
      changeFollower () {
        let count = 0
        let list = this.showChangeFollower === 1 ? this.multipleSelection : this.doneSelection
        let salesman_name = this.employeeList.filter(item => item.id == this.salesman)[0].name
        list.forEach(item => {
          let params = {
            salesman_name,
            salesman_id: this.salesman,
            id: item.id
          }
          changeFollowFun(params).then(res => {
            if (res.data.success) {
              count++
            }
          })
        })
        setTimeout(() => {
          this.$message({
            showClose: true,
            message: `操作完成！成功${count}条，失败${this.multipleSelection.length - count}条!`,
            type: 'success'
          })
          this.getDoneCustomerList()
          this.getMyCustomerList()
          this.showChangeFollower = ''
        }, 1000)
      },
      provinceChange (value) {
        this.city = Object.keys(ChinaAddress[value])
      },
      cityChange () {
        this.county = ChinaAddress[this.customerInfo.province][this.customerInfo.city]
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      doneSelectionChange (val) {
        this.doneSelection = val
      },
      // 上下分页
      handleCurrentChange (page) {
        this.paginations.page_index = page
        this.getOrderList()
      },
      // 每页多少条切换
      handleSizeChange (page_size) {
        this.paginations.page_size = page_size
        this.getOrderList()
      },
      closeAddOrder () {
        this.showAddOrder = false
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .btn-add-customer {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 999
    }

    .cart-detail {
        height: 300px;
        overflow: auto;
    }

    .open-list-area-select {
        width: 167px;
        display: inline-block;
    }
</style>
