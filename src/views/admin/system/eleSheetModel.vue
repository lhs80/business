<template>
  <div class="app-container calendar-list-container client-list">
    <el-button type="primary" size="small" @click="$router.push({path:'/admin/sheet/add'})">添加电子面单模板</el-button>
    <el-table :data="sheetList" stripe style="width: 100%" class="mt2">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="电子面单名称"></el-table-column>
      <el-table-column prop="role_name" label="快递公司">
        <template slot-scope="scope">
          <span v-for="(item,index) in expressList" :key="index" v-if="item.key==scope.row.shipper_code">{{item.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_defult" label="是否默认">
        <template slot-scope="scope">
          {{scope.row.is_defult===1?"是":"否"}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" v-if="scope.row.is_admin!==1">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <i class="el-icon-edit" @click="$router.push({path:'/admin/sheet/edit',query:{id:scope.row.id}})"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <i class="el-icon-delete" @click="delEleSheetModel(scope.row.id)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {eleSheetModelListFun, delEleSheetModelFun, allExpressFun} from "@/api/activity"

  export default {
    data() {
      return {
        expressList: [],
        sheetList: []
      };
    },
    mounted() {
      this.eleSheetModelList();
      this.allExpress();
    },
    methods: {
      eleSheetModelList() {
        eleSheetModelListFun().then(res => {
          if (res.data.success) {
            this.sheetList = res.data.data;
          }
        })
      },
      delEleSheetModel(id) {
        let params = {
          id: id
        }
        delEleSheetModelFun(params).then(res => {
          if (res.data.success) {
            this.$message({
              message: '删除成功！',
              type: 'success',
              center: true
            });
            this.eleSheetModelList();
          }
        })
      },
      allExpress() {
        allExpressFun().then(res => {
          if (res.data.success) {
            this.expressList = res.data.data;
          }
        })
      },
    }
  };
</script>
