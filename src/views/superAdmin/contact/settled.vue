<template>
  <div class="app-container calendar-list-container stattled-list">
    <div class="settled-set-option">
      <div class="classify-edit-level">
        <el-button type="primary" size="small" @click="isShowLevel=true">修改商户等级</el-button>
      </div>
      <div class="text-right">
        <el-input size="small" placeholder="请输入内容" style="width:200px;height:32px !important;" v-model="searchKey">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" size="small" @click="getShopList">搜索</el-button>
      </div>
    </div>
    <!-- 入驻中 -->
    <el-table :data="shopList" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="mch_id" label="商户ID"></el-table-column>
      <el-table-column prop="mch_name" label="商户名称">
        <template slot-scope="scope">
          <h6>{{scope.row.mch_name}}</h6>
          <el-tag>{{scope.row.level_name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cat_name" label="主营项目"></el-table-column>
      <el-table-column prop="contact_person" label="联系人"></el-table-column>
      <el-table-column prop="cdate" label="入驻时间"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===1">已入驻</el-tag>
          <el-tag v-else type="danger">暂停中</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" label="营收"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" v-if="scope.row.is_admin!==1">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <i class="el-icon-edit" @click="showEditDialog(scope.row.mch_id)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="停用" placement="top-start" v-if="$route.query.type==1">
            <i class="el-icon-delete" @click="updateShopStatus(scope.row.mch_id)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="mt2 pull-right"
      v-if="paginations.total > 0"
      :page-sizes="paginations.pageSizes"
      :page-size="paginations.page_size"
      :layout="paginations.layout"
      :total="paginations.total"
      :current-page="paginations.page_index"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <!--修改密码弹框-->
    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
         style="z-index: 99;" v-show="isShowDelive">
      <div class="el-message-box el-message-box--center">
        <div class="bg-grey">
          <el-row class="prl2">
            <el-col :span="12" class="h5">修改密码</el-col>
            <el-col :span="12" class="text-right h4">
              <i class="el-message-box__close el-icon-close" @click="isShowDelive=false"></i>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__content">
          <el-form :model="pwdInfo" :rules="rules" ref="pwdInfo" label-width="120px">
            <el-form-item label="新密码" prop="pwd">
              <el-input type="password" v-model="pwdInfo.pwd" placeholder="新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPwd">
              <el-input type="password" v-model="pwdInfo.confirmPwd" placeholder="确认新密码"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="el-message-box__btns">
          <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                  @click="editPwd">
            <span>修改</span>
          </button>
          <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                  @click="isShowDelive=false">
            <span>关闭</span>
          </button>
        </div>
      </div>
    </div>
    <!--修改等级弹框-->
    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
         style="z-index: 99;" v-show="isShowLevel">
      <div class="el-message-box el-message-box--center">
        <div class="bg-grey">
          <el-row class="prl2">
            <el-col :span="12" class="h5">修改等级</el-col>
            <el-col :span="12" class="text-right h4">
              <i class="el-message-box__close el-icon-close" @click="isShowLevel=false"></i>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__content">
          <el-row>
            <el-col :span="6">店铺等级：</el-col>
            <el-col :span="18">
              <el-select v-model="levelId" placeholder="请选择">
                <el-option
                  v-for="(item,index) in levelList"
                  :key="item.level_id"
                  :label="item.level_name"
                  :value="item.level_id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__btns">
          <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                  @click="updateShopLevel">
            <span>修改</span>
          </button>
          <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                  @click="isShowLevel=false">
            <span>关闭</span>
          </button>
        </div>
      </div>
    </div>
    <div class="v-modal" tabindex="0" style="z-index: 80;" v-if="isShowDelive"></div>
  </div>
</template>
<script>
  import {adminShopListFun, updateStatusFun, editShopPwdFun, adminShopLevelListFun, updateLevelFun} from "@/api/activity"

  export default {
    data() {
      return {
        isShowDelive: false,
        isShowLevel: false,
        shopList: [],
        levelList: [],
        searchKey: "",
        curMchId: '',
        levelId: "",
        multipleSelection: "",
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 5, // 1页显示多少条
          pageSizes: [5, 10, 15, 20], //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
        },
        pwdInfo: {
          pwd: '',
          confirmPwd: "",
        },
        rules: {
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          confirmPwd: [
            {required: true, message: '请输入确认密码', trigger: 'blur'},
            {validator: this.validatePass, trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机', trigger: 'blur'}
          ]
        }
      }
    },
    watch: {
      "$route": "getShopList"
    },
    mounted() {
      this.getShopList();
      this.getLevelList();
    },
    methods: {
      getLevelList() {
        adminShopLevelListFun().then(res => {
          console.log("level", res);
          if (res.data.success) {
            this.levelList = res.data.data;
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      validatePass(rule, value, callback) {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.pwdInfo.pwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
      showEditDialog(id) {
        this.curMchId = id;
        this.isShowDelive = true;
      },
      /**
       * 修改密码
       **/
      editPwd() {
        let params = {
          mch_id: this.curMchId,
          pwd: this.pwdInfo.pwd,
        };
        editShopPwdFun(params).then(res => {
          console.log(res);
          if (res.data.success) {
            this.isShowDelive = false
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success"
            });
          }
        })
      },
      /**
       * 暂停店铺
       **/
      updateShopStatus(id) {
        console.log(id)
        let params = {
          mch_id: id,
          status: 0
        };
        updateStatusFun(params).then(res => {
          console.log(res);
          if (res.data.success) {
            this.getShopList();
          }
        })
      },
      /**
       * 修改店铺等级
       **/
      updateShopLevel() {
        let ids = "";
        this.multipleSelection.forEach((item, index) => {
          ids += item.mch_id + ",";
        });
        let params = {
          mch_id: ids,
          level_id: this.levelId
        };
        updateLevelFun(params).then(res => {
          if (res.data.success) {
            this.isShowLevel = false;
            this.getShopList();
          }
        })
      },
      getShopList() {
        let params = {
          status: this.$route.query.type,
          searchKey: this.searchKey,
          pageSize: this.paginations.page_size,
          pageIndex: this.paginations.page_index
        };
        adminShopListFun(params).then(res => {
          console.log(res);
          if (res.data.success) {
            this.shopList = res.data.data.data;
            this.paginations.page_count = res.data.data.pageinfo.totalpage;
            this.paginations.total = res.data.data.pageinfo.count;
          }
        })
      },
      // 每页多少条切换
      handleSizeChange(page_size) {
        this.paginations.page_size = page_size;
        this.getShopList()
      },
      // 上下分页
      handleCurrentChange(page) {
        this.paginations.page_index = page;
        this.getShopList();
      },
    }
  };
</script>
<style scoped>
  .settled-set-option {
    height: 55px;
  }

  .settled-filter {
    width: 30%;
  }
</style>
