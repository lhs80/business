<template>
  <div class="app-container calendar-list-container">
    <div v-show="classifyIsShow">
      <div class="classify-set-option">
        <div class="client-edit-level">
          <el-button type="primary" size="small" @click="$router.push('/adminClass/add')">添加新分类</el-button>
        </div>
      </div>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column fixed prop="cat_id" label="ID"></el-table-column>
        <el-table-column prop="cat_name" label="类型"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="delSingleType(scope.row.cat_id)" type="text" size="small">删除</el-button>
            <el-button type="text" size="small"
                       @click="$router.push({path:'/adminClass/edit',query:{id:scope.row.cat_id}})">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import {getGoodsCat, delGoodsCat} from "@/api/activity";

  export default {
    name: "classify-page",
    data() {
      return {
        isAdd: true,
        curEditItem: null,
        tableData: [],
        addClassifyIsShow: false,
        classifyIsShow: true
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        getGoodsCat().then(res => {
          if (res.data.success)
            this.tableData = res.data.data;
        });
      },
      //添加分类
      addClassifyBtn(item, type) {
        console.log(item);
        this.isAdd = type;
        this.curEditItem = item;
        this.addClassifyIsShow = true;
        this.classifyIsShow = false;
      },
      //返回当前页
      backCurrentPage() {
        this.addClassifyIsShow = false;
        this.classifyIsShow = true;
      },
      handleChange(val) {
        console.log(val);
      },
      delSingleType(index) {
        let _this = this;
        let params = {
          id: index
        };
        delGoodsCat(params).then(res => {
          if (res.data.success) {
            _this.getData()
          }
        })
      }
    }
  };
</script>

<style scoped>
  .classify-set-option {
    height: 55px;
  }

  .client-edit-level {
    float: left;
    width: 100px;
  }
</style>
