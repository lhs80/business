<template>
  <section class="app-container calendar-list-container client-list">
    <div class="client-set-option">
      <el-button type="primary" size="small" @click="$router.push('/address/add')">添加退货地址</el-button>
    </div>
    <el-table :data="addressList" stripe style="width: 100%">
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="pname" label="联系人" width="100"></el-table-column>
      <el-table-column prop="phone" label="手机" width="120"></el-table-column>
      <el-table-column prop="Desc" label="地址" width="480"></el-table-column>
      <el-table-column prop="group_desc" label="默认" width="180">
        <template slot-scope="scope">
          {{scope.row.is_defult===1?'是':'否'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <i class="el-icon-edit" @click="$router.push({path:'/address/edit',query:{id:scope.row.id}})"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <i class="el-icon-delete" @click="showConfirmDialog(scope.row.group_id)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
  import {addressListFun, delAddressListFun} from "@/api/activity"

  export default {
    data() {
      return {
        addressList: [],
      };
    },
    mounted() {
      this.getAllAddress()
    },
    methods: {
      /**
       *所有地址
       */
      getAllAddress() {
        addressListFun().then(res => {
          console.log("address", res)
          if (res.data.success) {
            this.addressList = res.data.data;
          }
        })
      },
      /**
       * 删除地址确认弹框
       */
      showConfirmDialog(id) {
        this.$confirm('确认删除该分组吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delUserGroup(id);
        }).catch(() => {
        });
      },
      /**
       * 删除地址
       */
      delUserGroup(id) {
        let params = {
          group_id: id
        };
        delAddressListFun(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: "删除分组成功",
              type: "success",
              center: true
            });
            this.getAllUserGroup();
          }
        })
      },
    }
  };
</script>
