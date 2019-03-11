<template>
  <div class="app-container calendar-list-container" style=" padding: 30px;">
    <div class="filter-container">
      <!-- 添加按钮 -->
      <el-button
        type="primary"
        icon="el-icon-edit"
        class="filter-item float-left"
        @click="handleCreate('form')"
      >添加</el-button>
      <!-- 清除浮动 -->
      <span class="clear-float"></span>
      <!-- 搜索相关过滤条件 -->
      <el-input
        class="filter-item"
        v-model="filter.name"
        style="width: 400px;"
        placeholder="名称"
        clearable
      ></el-input>
      <el-button type="primary" icon="el-icon-search" class="filter-item" @click="handleFilter">搜索</el-button>
    </div>
    <!-- 数据列表 -->
    <el-table
      :key="tableKey"
      :data="list"
      v-loading="listLoading"
      max-height="500"
      border
      fit
      highlight-current-row
      :style="{width:'100%'}"
      :header-row-style="{height:'10px'}"
      :row-style="{height:'10px'}"
      :header-cell-style="{padding:'8px 0'}"
      :cell-style="{padding:'5px 0'}"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,'form')"
          >编辑</el-button>
          <el-popover placement="right" width="200" trigger="click" :ref="'popover' + scope.row.id">
            <el-tree
              :data="menus"
              show-checkbox
              node-key="id"
              :props="defaultProps"
              default-expand-all
              :ref="'menusTree'+scope.row.id"
            ></el-tree>
            <div style="text-align: right; margin: 10px 0 0 0">
              <el-button size="mini" type="text" @click="closeVisible(scope.row)">取消</el-button>
              <el-button type="primary" size="mini" @click="allocationMenu(scope.row)">确定</el-button>
            </div>
            <el-button
              size="small"
              slot="reference"
              type="primary"
              icon="el-icon-edit-outline"
              @click="handleAllocationMenu(scope.row)"
            >分配菜单</el-button>
          </el-popover>
          <el-button
            size="small"
            :disabled="scope.row.default"
            :type="scope.row.default?'info':'danger'"
            icon="el-icon-delete"
            @click="deletes(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <!-- 分页效果 -->
    <div v-show="!listLoading" class="pagination-container page">
      <el-pagination
        small
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 添加/修改弹出层 -->
    <el-dialog
      width="30%"
      :title="dialogTextMap[dialogStatus]"
      :rules="rules"
      :visible.sync="dialogFormVisible"
      @close="closeFormDialog('form')"
    >
      <el-form
        ref="form"
        :rules="rules"
        :label-position="labelPosition"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='update'" label="创建时间">
          <el-input v-model="form.createTime" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else-if="dialogStatus=='update'" type="primary" @click="update('form')">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  addRole,
  deleteRole,
  getRoleById,
  getRolesByPage,
  updateRole
} from "@/api/role";
import {
  getMenusAll,
  getMenusByCurrentUser,
  getMenusByRoleId
} from "@/api/menu";
import { addMenuRole } from "@/api/menuRole";
import urlCol from "@/common/urlCol";
import { getTree } from "@/utils/util";
import { setTimeout } from "timers";
export default {
  name: "role_list",
  data() {
    return {
      filterText: "",
      menus: [], // 权限列表
      defaultProps: {
        // Tree 展示的属性名称配置
        children: "children",
        label: "label"
      },
      filter: {
        // 查询条件过滤
        name: ""
      },
      listLoading: true, // 等待
      listQuery: {
        // 分页条件
        page: 1,
        limit: 10
      },
      total: null, // 总数
      list: [], // 当前页的数据内容
      tableKey: 0, // 表格主键
      dialogStatus: "", // 编辑创建弹出层
      dialogTextMap: {
        update: "编辑",
        create: "创建"
      },
      dialogFormVisible: false,
      form: {
        // form表单内容
        id: "",
        name: "",
        remark: "",
        createTime: ""
      },
      rules: {
        // 表单判断规则
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请输入描述", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
        ]
      },
      labelPosition: "left",
      vnType: {
        // 提示框的类型
        success: "success",
        warning: "warning",
        info: "info",
        error: "error"
      }
    };
  },
  created() {
    let _this = this;
    _this.getList();
    _this.createMenus();
  },
  methods: {
    // 获取列表
    getList() {
      let _this = this;
      _this.listLoading = true;
      // 查询
      getRolesByPage({
        current: _this.listQuery.page,
        size: _this.listQuery.limit,
        ..._this.filter // 额外的查询条件
      }).then(response => {
        if (response) {
          // 总数
          _this.total = response.total;
          // 每页的内容
          _this.list = response.records;

          _this.listLoading = false;
        }
      });
    },
    // 添加弹出层
    handleCreate(form) {
      let _this = this;
      _this.dialogStatus = "create";
      // 清除表单
      _this.clearForm(form);
      // 显示弹出层
      _this.dialogFormVisible = true;
    },
    // 添加
    create(form) {
      let _this = this;
      _this.$refs[form].validate(valid => {
        if (valid) {
          // 进行添加角色的操作
          addRole(_this.form)
            .then(response => {
              if (response) {
                // 关闭弹出层
                _this.dialogFormVisible = false;
                // 成功提示
                _this.successVn(urlCol.role.addRole.successMessage);
                // 清除表单验证效果
                _this.resetFields(form);
                // 刷新表格
                _this.getList();
              }
            })
            .catch(error => {
              reject(error);
            });
        } else {
          return false;
        }
      });
    },
    // 编辑弹出层
    handleUpdate(row, form) {
      let _this = this;
      _this.dialogStatus = "update";
      // 清除表单内容
      _this.clearForm(form);
      // 打开弹出层
      _this.dialogFormVisible = true;
      // 给表单赋值
      _this.form = {
        id: row.id,
        name: row.name,
        remark: row.remark,
        createTime: row.createTime
      };
    },
    // 修改
    update(form) {
      let _this = this;
      _this.$refs[form].validate(valid => {
        if (valid) {
          _this.form.roleId = _this.form.id;
          updateRole(_this.form).then(response => {
            if (response) {
              // 成功提示
              _this.successVn(urlCol.role.updateRole.successMessage);
              // 清除验证效果
              _this.resetFields(form);
              // 关闭弹出层
              _this.dialogFormVisible = false;
              // 刷新表格
              _this.getList();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 创建菜单树
    createMenus() {
      let _this = this;
      getMenusAll().then(response => {
        if (response) {
          // 将后端返回的值构造成树形结构
          _this.menus = getTree(response, {
            id: "id",
            parentId: "parentId",
            name: "name",
            sort: "sort",
            rootId: -1
          });
          _this.defaultProps = {
            children: "children",
            label: "name"
          };
        }
      });
    },
    // 分配菜单弹出层
    handleAllocationMenu(row) {
      let _this = this;
      getMenusByRoleId({ roleId: row.id }).then(response => {
        if (response) {
          let arr = [];
          for (let i = 0, len = response.length; i < len; i++) {
            let menu = response[i];
            let flag = true;
            // 排除父节点
            for (let j = 0; j < len; j++) {
              let menuJ = response[j];
              if (menu.id == menuJ.parentId) {
                flag = false;
                break;
              }
            }
            if (flag) arr.push(menu.id);
          }
          // 赋值
          _this.$refs["menusTree" + row.id].setCheckedKeys(arr);
        }
      });
    },
    // 分配菜单
    allocationMenu(row) {
      let _this = this;
      let nodes = _this.$refs["menusTree" + row.id].getCheckedNodes(
        false,
        true
      );
      let ids = [];
      for (let i = 0, len = nodes.length; i < len; i++) {
        let node = nodes[i];
        ids.push(node.id);
      }
      if (ids.length == 0) {
        _this.openVn({
          message: "必须选中值",
          type: _this.vnType.error
        });
        return;
      }
      addMenuRole({
        roleId: row.id,
        menuIds: ids.join(",")
      }).then(response => {
        if (response) {
          // 成功提示
          _this.successVn(urlCol.menuRole.addMenuRole.successMessage);
          // 关闭弹出层
          _this.closeVisible(row);
        }
      });
    },
    // 关闭分配菜单的模态框
    closeVisible(row) {
      let _this = this;
      _this.$refs["popover" + row.id].doClose();
    },
    // 删除角色
    deletes(row) {
      let _this = this;
      _this
        .$confirm(
          "此操作将永久删除该角色(角色名为:" + row.name + "), 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          }
        )
        .then(() => {
          deleteRole({ roleId: row.id }).then(response => {
            if (response) {
              // 成功提示
              _this.successVn(urlCol.role.deleteRole.successMessage);
              // 刷新表格
              _this.getList();
            }
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 改变表格每页大小的时候
    handleSizeChange(val) {
      let _this = this;
      _this.listQuery.limit = val;
      _this.getList();
    },
    // 改变当前页的时候
    handleCurrentChange(val) {
      let _this = this;
      _this.listQuery.page = val;
      _this.getList();
    },

    // 搜索
    handleFilter() {
      let _this = this;
      _this.clearPage();
      _this.getList();
    },
    // 重置form表单
    clearForm(form) {
      let _this = this;
      _this.form = {
        id: "",
        name: "",
        remark: "",
        createTime: ""
      };
    },
    // 清空搜索条件
    clearQuery() {
      let _this = this;
      _this.filter = {
        name: ""
      };
    },
    clearPage() {
      let _this = this;
      _this.listQuery = {
        page: 1,
        limit: 10
      };
    },
    closeFormDialog(form) {
      let _this = this;
      _this.resetFields(form);
    },
    // 移除该表单项的校验结果
    resetFields(form) {
      let _this = this;
      _this.$refs[form].resetFields();
    },
    // 弹窗
    openVn(option) {
      let _this = this;
      if (_this.vnType[option.type] == _this.vnType.info)
        _this.$message(option.message);
      else if (_this.vnType[option.type] == _this.vnType.error)
        _this.$message.error(option.message);
      else
        _this.$message({
          message: option.message,
          type: option.type
        });
    },
    // 成功提示
    successVn(message) {
      let _this = this;
      _this.openVn({
        message: message,
        type: _this.vnType.success
      });
    }
  }
};
</script>

<style>
.user-element-select {
  width: "30px";
  display: inline-block;
}
.float-left {
  float: left;
}
.clear-float {
  clear: both;
}
.page {
  text-align: center;
}
</style>