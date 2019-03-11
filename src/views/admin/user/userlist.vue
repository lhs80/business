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
        v-model="filter.keyWord"
        style="width: 400px;"
        placeholder="关键词（登录名、显示名、手机号、邮箱）"
        clearable
      ></el-input>
      <div class="filter-item user-element-select">
        <el-select v-model="filter.sex" placeholder="请选择性别">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
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
      <el-table-column align="center" label="登录名">
        <template slot-scope="scope">
          <span>{{scope.row.loginName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="显示名">
        <template slot-scope="scope">
          <span>{{scope.row.displayName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="性别" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.sex | sexFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.phoneNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="邮箱" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="注册时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.registerTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="禁用/启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.flag"
            :active-value="flag['enabled']"
            :inactive-value="flag['disabled']"
            @change="enable(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="info"
            icon="el-icon-edit-outline"
            @click="resetPassword(scope.row)"
          >重置密码</el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,'form')"
          >编辑</el-button>
          <!-- <el-button size="small" type="danger" icon="el-icon-delete" @click="deletes(scope.row)">删除</el-button> -->
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
        <el-form-item label="登录名" prop="loginName">
          <el-tooltip :content="regexInfo.loginName" placement="top" effect="light">
            <el-input v-model="form.loginName" :disabled="dialogStatus=='create'?false:true"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="显示名">
          <el-input v-model="form.displayName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option
              v-for="option in options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="密码" prop="passw">
          <el-tooltip :content="regexInfo.password" placement="top" effect="light">
            <el-input type="password" v-model="form.passw" placeholder="请输入密码"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="确认密码" prop="checkPassword">
          <el-input
            type="password"
            v-model="form.checkPassword"
            autocomplete="off"
            placeholder="请输入确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNo">
          <el-input v-model="form.phoneNo"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.roleId" placeholder="请选择角色">
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='update'" label="注册时间">
          <el-input v-model="form.registerTime" :disabled="true"></el-input>
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
import { isValidateMobile } from "@/utils/validate";
import {
  addUser,
  getAllByPage,
  enable,
  resetPassword,
  updateUser
} from "@/api/user";
import { getRoleByUserId } from "@/api/userRole";
import { getRoles } from "@/api/role";
import urlCol from "@/common/urlCol";
import { encode, int2Str } from "@/utils/util";
import {
  phoneNo,
  email,
  userLoginName,
  password
} from "@/common/constant/regex";
export default {
  name: "user_list",
  data() {
    // 判断密码和确认密码是否一致
    let validateCheckPassword = (rule, value, callback) => {
      if (value !== this.form.passw) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      filter: {
        // 过滤条件
        keyWord: "",
        sex: ""
      },
      listLoading: true,
      listQuery: {
        // 分页查询条件
        page: 1,
        limit: 10
      },
      total: null,
      list: [],
      tableKey: 0,
      options: [
        // 性别下拉框显示的内容
        {
          value: "",
          label: "请选择性别"
        },
        {
          value: 0,
          label: "男"
        },
        {
          value: 1,
          label: "女"
        }
      ],
      dialogStatus: "",
      dialogTextMap: {
        update: "编辑",
        create: "创建"
      },
      dialogFormVisible: false,
      form: {
        // form表单提交内容
        loginName: "",
        displayName: "",
        phoneNo: "",
        email: "",
        sex: "",
        password: "",
        checkPassword: "",
        registerTime: "",
        roleId: "",
        passw: ""
      },
      rules: {
        // 表单判断规则
        loginName: [
          { required: true, message: "请输入登录名", trigger: "blur" },
          {
            pattern: userLoginName,
            message: "只能5-8个英文字符或者数字",
            trigger: "blur"
          }
        ],
        phoneNo: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: phoneNo,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        passw: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: password,
            message: "格式：6-20 位，字母+数字+特殊字符",
            trigger: "blur"
          }
        ],
        checkPassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          {
            validator: validateCheckPassword,
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: email,
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ]
      },
      labelPosition: "left",
      vnType: {
        // 弹出层
        success: "success",
        warning: "warning",
        info: "info",
        error: "error"
      },
      regexInfo: {
        // 正则表达式提示
        loginName: "只能5-8个英文字符或者数字",
        password: "6-20 位，字母+数字+特殊字符（!@#$%^&*.,）"
      },
      flag: {
        // switch框值配置
        disabled: 0,
        enabled: 1
      },
      roles: []
    };
  },
  created() {
    this.getList();
    this.getRoles();
  },
  methods: {
    // 获取列表
    getList() {
      let _this = this;
      _this.listLoading = true;
      // 查询
      getAllByPage({
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
    getRoles() {
      getRoles().then(response => {
        if (response) {
          this.roles = response;
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
          // 进行添加用户的操作
          _this.form.password = encode(_this.form.passw);
          addUser(_this.form)
            .then(response => {
              if (response) {
                // 关闭弹出层
                _this.dialogFormVisible = false;
                // 成功提示
                _this.successVn(urlCol.user.addUser.successMessage);
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
      getRoleByUserId({ userId: row.id }).then(response => {
        _this.form = {
          id: row.id,
          loginName: row.loginName,
          displayName: row.displayName,
          phoneNo: row.phoneNo,
          email: row.email,
          sex: row.sex,
          passw: row.password,
          checkPassword: row.password,
          registerTime: row.registerTime,
          roleId: ""
        };
        if (response !== "null") {
          _this.form.roleId = response.id;
        }
      });
    },
    // 修改
    update(form) {
      let _this = this;
      _this.$refs[form].validate(valid => {
        if (valid) {
          updateUser(_this.form).then(response => {
            if (response) {
              // 成功提示
              _this.successVn(urlCol.user.updateUser.successMessage);
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
    // 禁用/启用
    enable(row) {
      let _this = this;
      enable({ id: row.id }).then(response => {
        if (response) _this.successVn(urlCol.user.enable.successMessage);
      });
    },
    // 重置密码
    resetPassword(row) {
      let _this = this;
      resetPassword({
        id: row.id
      }).then(response => {
        if (response) _this.successVn(urlCol.user.resetPassword.successMessage);
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
        loginName: "",
        displayName: "",
        phoneNo: "",
        email: "",
        sex: "",
        password: "",
        checkPassword: "",
        registerTime: "",
        roleId: "",
        passw: ""
      };
    },
    // 清空搜索条件
    clearQuery() {
      let _this = this;
      _this.filter = {
        keyWord: "",
        sex: ""
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
  },
  filters: {
    sexFilter(sex) {
      const sexMap = {
        0: "男",
        1: "女",
        2: "不明"
      };
      return sexMap[sex];
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
