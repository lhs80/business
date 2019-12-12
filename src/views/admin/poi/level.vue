<template>
  <div class="app-container calendar-list-container level-list">
    <div v-if="LevelListIsShow">
      <div class="client-set-option">
        <div class="client-edit-level">
          <el-button type="primary" size="small" @click="addLevel">添加代理</el-button>
        </div>
      </div>
      <div class="table_container">
        <el-table
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          :data="clientLevelList"
          stripe
          style="width:100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column property="level_name" label="等级名称" align="center"></el-table-column>
          <el-table-column property="discount" label="描述" align="center">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.brands" :key="index">
                {{item.brand_name}}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改" placement="top">
                <i class="el-icon-edit" title="修改" @click="editLevel(scope.row)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <i class="el-icon-delete" title="删除" @click="showDelConfirm(scope.row.level_id)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <el-row>
          <el-col :span="24">
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
    </div>
    <!-- 添加等级组件 -->
    <div class="add-level-page" v-if="addLevelIsShow">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item label="代理名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="代理品牌">
          <el-input v-model="selGoodsName" placeholder="请输入内容" readonly="readonly">
            <el-button slot="append" type="primary" @click="isShowCommidyList=true">添加品牌</el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="backLevelPage">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--选择品牌弹框-->
    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
         style="z-index: 99" v-show="isShowCommidyList">
      <div class="el-message-box el-message-box--center" style="width:60%;height:400px;overflow-y:auto">
        <div class="bg-grey">
          <el-row class="prl2">
            <el-col :span="12" class="h5">数据选择器</el-col>
            <el-col :span="12" class="text-right h4">
              <i class="el-message-box__close el-icon-close" @click="isShowCommidyList=false"></i>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__content">
          <el-table
            ref="multipleTable"
            :data="brandsList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="name" label="品牌名称" align="center"></el-table-column>
            <el-table-column prop="goodsArr" label="商品数" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.goodsArr.length }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="el-message-box__btns">
          <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                  @click="isShowCommidyList=false">
            <span>关闭</span>
          </button>
        </div>
      </div>
    </div>
    <div class="v-modal" tabindex="0" style="z-index: 80;" v-if="isShowCommidyList"></div>
  </div>
</template>

<script>
  import {getClientLevelListFun, addOrEditLevelFun, delClientLevelFun} from "@/api/poi"
  import {getBrand} from "@/api/activity"

  export default {
    name: "level",
    data: () => {
      return {
        selGoodsName: "",
        searchKey: "",
        addLevelIsShow: false,
        LevelListIsShow: true,
        isShowCommidyList: false,
        clientLevelList: [],// 客户等级
        brandsList: [],// 所有品牌
        ruleForm: {
          id: "",
          name: "",
          brand_id: "",
        },
        rules: {
          name: [
            {required: true, message: "请输入代理名称", trigger: "blur"}
          ],
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
      this.getClientLevel();
      this.getBrands();
    },
    methods: {
      /**
       * 所有品牌
       */
      getBrands() {
        getBrand().then(res => {
          if (res.data.success)
            this.brandsList = res.data.data;
          console.log(this.brandsList)
        });
      },
      /**
       * 客户等级
       */
      getClientLevel() {
        getClientLevelListFun().then(res => {
          console.log(res);
          if (res.data.success) {
            this.clientLevelList = res.data.data;
            this.paginations.total = res.data.data.count;
            this.paginations.page_count = res.data.data.totalpage
          }
        })
      },
      handleSelectionChange(val) {
        this.selGoodsName = "";
        this.ruleForm.brand_id = "";
        val.forEach((item, index) => {
          this.selGoodsName += item.name + " ";
          this.ruleForm.brand_id += item.id + ",";
        });
        this.multipleSelection = val;
      },
      //添加等级
      addLevel() {
        this.addLevelIsShow = true;
        this.LevelListIsShow = false;
      },
      //添加等级
      editLevel(item) {
        console.log(item);
        this.ruleForm.id = item.level_id;
        this.ruleForm.name = item.level_name;
        item.brands.forEach(item => {
          this.selGoodsName += item.brand_name + ","
        });
        this.addLevelIsShow = true;
        this.LevelListIsShow = false;
      },
      //返回
      backLevelPage() {
        this.addLevelIsShow = false;
        this.LevelListIsShow = true;
        this.ruleForm = {
          id: '',
          name: '',
        }
        this.selGoodsName = "";
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            addOrEditLevelFun(this.ruleForm).then(res => {
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
                });
                this.resetForm(formName);
                this.backLevelPage();
                this.getClientLevel();
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "success"
                });
              }
            })
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /**
       * 改变页码和当前页时需要拼装的路径方法
       * @param {string} field 参数字段名
       * @param {string} value 参数字段值
       */
      setPath(field, value) {
        let path = this.$route.path,
          query = Object.assign({}, this.$route.query);
        if (typeof field === "object") {
          query = field;
        } else {
          query[field] = value;
        }
        this.$router.push({
          path,
          query
        });
      },
      // 每页多少条切换
      handleSizeChange(page_size) {
        console.log(`每页 ${page_size} 条`);
        this.getList({
          page_size,
          fun: () => {
            this.setPath("page_size", page_size);
          }
        });
      },
      // 上下分页
      handleCurrentChange(page) {
        this.sortnum = this.paginations.page_size * (page - 1);
        this.getList({
          page,
          fun: () => {
            this.setPath("page", page);
          }
        });
      },
      showDelConfirm(id) {
        this.$confirm('确认删除该等级吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id: id
          };
          delClientLevelFun(params).then(res => {
            if (res.data.success) {
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
                center: true
              });
              this.getClientLevel();
            }
          })
        }).catch(() => {
        });
      },
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
