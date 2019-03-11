<template>
  <div class="app-container calendar-list-container" style=" padding: 30px;">
    <div class="filter-container">
      <!-- 清除浮动 -->
      <span class="clear-float"></span>
      <!-- 搜索相关过滤条件 -->
      <el-input
        class="filter-item"
        v-model="filter.username"
        style="width: 150px;"
        placeholder="用户名"
        clearable
      ></el-input>
      <el-input
        class="filter-item"
        v-model="filter.content"
        style="width: 150px;"
        placeholder="内容"
        clearable
      ></el-input>
      <div class="filter-item inline-block">
        <el-date-picker
          v-model="timeValue"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        ></el-date-picker>
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
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="内容" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          
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
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getOpLogPage, deleteOpLog } from "@/api/log";
import urlCol from "@/common/urlCol";
import { getTree } from "@/utils/util";
import { setTimeout } from "timers";
export default {
  name: "role_list",
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      timeValue: [],
      filter: {
        // 查询条件过滤
        username: "", // 用户名
        content: "", // 内容
        findStartTime: "",
        findEndTime: ""
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
  },
  methods: {
    // 获取列表
    getList() {
      let _this = this;
      _this.listLoading = true;

      // 时间过滤条件
      if (_this.timeValue && _this.timeValue.length > 0) {
        this.filter.findStartTime = _this.timeValue[0];
        this.filter.findEndTime = _this.timeValue[1];
      }

      // 查询
      getOpLogPage({
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
    // 删除角色
    deletes(row) {
      let _this = this;
      _this
        .$confirm("此操作将永久删除日志记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
          
        })
        .then(() => {
          deleteOpLog({ id: row.id }).then(response => {
            if (response) {
              // 成功提示
              _this.successVn(urlCol.opLog.deleteOpLog.successMessage);
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
.page{
  text-align: center;
}
</style>