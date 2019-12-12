<template>
  <section class="app-container calendar-list-container client-list">
    <aside v-if="!isShowClientDetail">
      <el-row class="client-set-option">
        <el-col :span="12">
          <el-button size="small" type="primary" @click="editLevel">修改等级</el-button>
        </el-col>
        <el-col :span="12" class="text-right">
          <el-input size="small" placeholder="请输入内容" style="width:200px;" v-model="searchKey">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button size="small" type="primary" @click="getClientList">搜索</el-button>
        </el-col>
      </el-row>
      <div class="table_container">
        <el-table
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          :data="clientList"
          stripe
          style="width:100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column property="nick_name" label="客户">
            <template slot-scope="scope">
              <el-row type="flex" align="middle">
                <el-col :span="12"><img :src="scope.row.face_img" alt="" style="width:60px;height:60px;"></el-col>
                <el-col :span="12">{{scope.row.nick_name}}</el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column property="real_name" label="姓名/手机号" align="center">
            <template slot-scope="scope">
              {{scope.row.real_name}}/{{scope.row.phone}}
            </template>
          </el-table-column>
          <el-table-column property="phone" label="等级" align="center">
            <template slot-scope="scope">
              {{scope.row.level_name}}
            </template>
          </el-table-column>
          <el-table-column property="registTime" label="注册时间" align="center"></el-table-column>
          <el-table-column property="spend_count" label="成交">
            <template slot-scope="scope">
              <h6>订单：{{scope.row.sp_count}}</h6>
              <h6>金额：{{scope.row.sp_money}}</h6>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="详情" placement="top">
                <i class="el-icon-view" @click="checkDetail(scope.row)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="订单" placement="top">
                <i class="el-icon-goods" @click="$router.push({path:'/admin/orderlist',query:{uid:scope.row.uid}})"></i>
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
          <el-form-item label="注册时间：" label-width="120px">{{curClientInfo.level_name}}</el-form-item>
          <el-form-item label="成交订单数：" label-width="120px">{{curClientInfo.sp_count}}</el-form-item>
          <el-form-item label="成交金额：" label-width="120px">{{curClientInfo.sp_money}}</el-form-item>
          <el-form-item label="最后一次成交：" label-width="120px">{{curClientInfo.last_order_date}}</el-form-item>
          <el-form-item class="text-left" label-width="120px">
            <el-button type="primary" @click="isShowClientDetail=false">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </aside>
    <!--修改等级弹框-->
    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
         style="z-index: 99;"
         v-show="isShowEditLevel">
      <div class="el-message-box el-message-box--center">
        <div class="bg-grey">
          <el-row class="prl2">
            <el-col :span="12" class="h5">批量修改客户等级</el-col>
            <el-col :span="12" class="text-right h4">
              <i class="el-message-box__close el-icon-close" @click="isShowEditLevel=false"></i>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__content">
          <el-form ref="form" :model="form" label-width="80px" class="mt2">
            <el-form-item label="客户等级">
              <el-select v-model="form.level" placeholder="请选择等级">
                <el-option v-for="(item,index) in clientLevelList" :label="item.level_name" :value="item.level_id"
                           :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="text-left">
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button type="primary" @click="isShowEditLevel=false">关闭</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="v-modal" tabindex="0" style="z-index: 80;" v-if="isShowEditLevel"></div>
  </section>
</template>

<script>
  import {getAllClient, updateClientLevelFun, getClientLevelListFun} from '@/api/poi';

  export default {
    name: 'kehuList',
    data: () => {
      return {
        searchKey: '',
        isShowEditLevel: false,
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
          layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
        }
      };
    },
    mounted() {
      this.getClientList()
      this.getClientLevel()
    },
    methods: {
      /**
       * 客户等级
       */
      getClientLevel() {
        getClientLevelListFun().then(res => {
          console.log('level', res);
          if (res.data.success) {
            this.clientLevelList = res.data.data;
            this.paginations.total = res.data.pageinfo.count;
            this.paginations.page_count = res.data.pageinfo.totalpage
          }
        })
      },
      checkDetail(row) {
        this.curClientInfo = row;
        this.isShowClientDetail = true;
      },
      //客户列表
      getClientList() {
        let params = `?searchKey=${this.searchKey}&pageSize=${this.paginations.page_size}&pageIndex=${this.paginations.page_index}`;
        getAllClient(params).then(res => {
          console.log('client', res);
          if (res.data.success) {
            this.clientList = res.data.data.data;
            this.paginations.pager_count = res.data.data.pageinfo.totalpage;
            this.paginations.total = res.data.data.pageinfo.count;
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //修改等级
      editLevel() {
        if (this.multipleSelection && this.multipleSelection.length) {
          this.isShowEditLevel = true;
        } else {
          this.$message({
            message: '请选择要修改等级的客户！',
            type: 'warning',
            center: true
          });
        }
      },
      // 每页多少条切换
      handleSizeChange(page_size) {
        this.paginations.page_size = page_size;
        this.getClientList();
      },
      // 上下分页
      handleCurrentChange(page) {
        this.paginations.page_index = page;
        this.getClientList();
      },
      onSubmit() {
        let uids = '';
        console.log(this.multipleSelection);
        this.multipleSelection.forEach((item, index) => {
          uids += item.uid + ',';
        });
        let params = {
          level_id: this.form.level,
          uid: uids,
        };
        updateClientLevelFun(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: '修改等级成功',
              type: 'success',
              center: true
            });
            this.isShowEditLevel = false;
            this.getClientList();
          }
        })
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
