<template>
  <section class="app-container calendar-list-container client-list">
    <div class="client-set-option">
      <el-button type="primary" size="small" @click="$router.push('/admin/fare/add')">添加配送方式</el-button>
    </div>
    <el-table :data="fareList" stripe style="width: 100%">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column label="计费方式">
        <template slot-scope="scope">
          按件计费
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="默认">
        <template slot-scope="scope">
          {{scope.row.is_defult===1?"是":"否"}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <i class="el-icon-edit" @click="$router.push({path:'/admin/fare/edit',query:{id:scope.row.id}})"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <i class="el-icon-delete" @click="showConfirmDialog(scope.row.id)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
  import {getAllExpressTempFun,delExpressTempFun} from "@/api/activity"

  export default {
    data() {
      return {
        fareList: [],
      };
    },
    mounted() {
      this.getAllFare()
    },
    methods: {
      /**
       *所有地址
       */
      getAllFare() {
        getAllExpressTempFun().then(res => {
          if (res.data.success) {
            this.fareList = res.data.data;
          }
        })
      },
      /**
       * 删除地址确认弹框
       */
      showConfirmDialog(id) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delUserGroup(id);
        }).catch(() => {
        });
      },
      /**
       * 删除运费模板
       */
      delUserGroup(id) {
        let params = {
          temp_id: id
        };
        delExpressTempFun(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
              center: true
            });
            this.getAllFare();
          }
        })
      },
    }
  };
</script>
