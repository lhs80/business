<template>
  <section class="app-container calendar-list-container client-list">
    <aside v-if="!isShowClientDetail">
      <div class="text-right">
        <el-input size="small" placeholder="请输入内容" style="width:200px;" v-model="searchKey">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button size="small" type="primary" @click="getClientList">搜索</el-button>
      </div>
      <div class="table_container mt2">
        <el-table
          ref="multipleTable"
          tooltip-effect="dark"
          :data="clientList"
          stripe
          style="width:100%"
        >
          <el-table-column label="客户" align="center" width="180">
            <template slot-scope="scope">
              <el-row type="flex" align="middle">
                <el-col :span="12"><img :src="scope.row.face_img" alt="" height="60px"></el-col>
                <el-col :span="12">{{scope.row.real_name}}</el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="姓名/手机号" align="center">
            <template slot-scope="scope">
              {{scope.row.nick_name}}/{{scope.row.phone}}
            </template>
          </el-table-column>
          <el-table-column label="注册时间" align="center">
            <template slot-scope="scope">
              {{timestampToTime(scope.row.cdate)}}
            </template>
          </el-table-column>
          <el-table-column property="spend_count" label="成交">
            <template slot-scope="scope">
              <h5>订单:{{scope.row.spend_count}}</h5>
              <h5>金额:￥{{scope.row.spend_money}}</h5>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="详情" placement="top">
                <i class="el-icon-view" @click="checkDetail(scope.row)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="订单" placement="top">
                <i class="el-icon-goods" @click="$router.push({path:'/superAdmin/suOrderList',query:{uid:scope.row.uid}})"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="mt2 pull-right">
          <el-col>
            <div class="pagination">
              <el-pagination
                v-if="paginations.total > 0"
                :page-sizes="paginations.page_sizes"
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
      </div>
    </aside>

    <!--客户详情-->
    <aside v-show="isShowClientDetail">
      <div class="el-message-box__content">
        <el-form ref="form" :model="form" label-width="80px" class="mt2">
          <el-form-item label="头像：" label-width="120px"><img :src="curClientInfo.face_img" alt=""></el-form-item>
          <el-form-item label="OPENID：" label-width="120px">{{curClientInfo.open_id}}</el-form-item>
          <el-form-item label="会员等级：" label-width="120px">{{curClientInfo.level_name}}</el-form-item>
          <el-form-item label="真实姓名：" label-width="120px">{{curClientInfo.nick_name}}</el-form-item>
          <el-form-item label="手机号：" label-width="120px">{{curClientInfo.phone}}</el-form-item>
          <!--<el-form-item label="注册时间：" label-width="120px">{{curClientInfo.level_name}}</el-form-item>-->
          <el-form-item label="成交订单数：" label-width="120px">{{curClientInfo.spend_count}}</el-form-item>
          <el-form-item label="成交金额：" label-width="120px">{{curClientInfo.spend_money}}</el-form-item>
          <!--<el-form-item label="最后一次成交：" label-width="120px">{{curClientInfo.last_order_date}}</el-form-item>-->
          <el-form-item class="text-left" label-width="120px">
            <el-button type="primary" @click="isShowClientDetail=false">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </aside>
  </section>
</template>

<script>
  import {adminClientList} from "@/api/activity";
  import {getClientLevelListFun} from "@/api/poi";

  export default {
    data: () => {
      return {
        searchKey: "",
        isShowClientDetail: false,
        clientList: [],
        clientLevelList: [],
        curClientInfo: {},
        form: {
          level: ''
        },
        //需要给分页组件传的信息
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总数
          page_size: 20, // 1页显示多少条
          page_sizes: [5, 10, 15, 20], //每页显示多少条
          pager_count: 0,
          layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
        }
      };
    },
    mounted() {
      this.getClientList()
    },
    methods: {
      /**
       * 客户等级
       */
      getClientLevel() {
        getClientLevelListFun().then(res => {
          console.log("level", res);
          if (res.data.success) {
            this.clientLevelList = res.data.data;
            this.paginations.total = res.data.data.count;
            this.paginations.page_count = res.data.data.totalpage
          }
        })
      },
      checkDetail(row) {
        this.curClientInfo = row;
        this.isShowClientDetail = true;
      },
      //客户列表
      getClientList() {
        let params = {
          searchKey: this.searchKey,
          pageSize: this.paginations.page_size,
          pageIndex: this.paginations.page_index
        };
        adminClientList(params).then(res => {
          console.log("client", res);
          if (res.data.success) {
            this.clientList = res.data.data.data;
            this.paginations.pager_count = res.data.data.pageinfo.totalpage;
            this.paginations.total = res.data.data.pageinfo.count;
          }
        })
      },
      // 每页多少条切换
      handleSizeChange(page_size) {
        this.paginations.page_size = page_size;
      },
      // 上下分页
      handleCurrentChange(page) {
        this.paginations.page_index = page - 1;
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .client-list {
    width: 100%;
    height: 100%;
  }

  .client-set-option {
    height: 55px;
  }

  .client-edit-level {
    float: left;
    width: 100px;
  }

  .client-filter {
    float: left;
    margin-left: 10px;
  }
</style>
