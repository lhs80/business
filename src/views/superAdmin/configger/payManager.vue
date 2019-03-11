<template>
  <div class="app-container calendar-list-container client-list">
    <el-button type="primary" size="small" @click="$router.push({path:'/paymodule/add'})">添加新模板</el-button>
    <el-table :data="payModule" stripe style="width: 100%" class="mt2">
      <el-table-column prop="name" label="模板名称" width="180">
        <template slot-scope="scope">
          {{scope.row.module.name}}
        </template>
      </el-table-column>
      <el-table-column prop="pay_type" label="支付类型">
        <template slot-scope="scope">
          {{scope.row.module.pay_type==='1'?"微信支付":"支付宝"}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="$router.push({path:'/paymoduleedit',query:{id:scope.$index}})">编辑</el-button>
          <el-button size="small" type="danger" @click="delPayModules(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {getPayModulesFun, delModuleFun} from "@/api/activity"

  export default {
    name: "xiaoShouPage",
    data() {
      return {
        payModule: [],
      };
    },
    mounted() {
      this.getPayModules();
    },
    methods: {
      getPayModules() {
        getPayModulesFun().then(res => {
          console.log(res.data.data);
          if (res.data.success) {
            this.payModule = res.data.data
          }
        })
      },
      delPayModules(id) {
        let params = {
          id: id
        }
        delModuleFun(params).then(res => {
          console.log(res.data.data);
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: "删除模板成功",
              type: "success"
            });
            this.getPayModules();
          }
        })
      }
    }
  };
</script>
