<template>
  <div class="app-container calendar-list-container client-list">
    <div class="client-set-option">
      <el-button type="primary" size="small" @click="$router.push('/admin/addPoster')">添加海报</el-button>
    </div>
    <el-table :data="postList" stripe style="width: 100%">
      <el-table-column prop="poster_name" label="海报名称" width="180"></el-table-column>
      <el-table-column prop="type" label="海报类型">
        <template slot-scope="scope">
          {{scope.row.type===1?'商品':'未知'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <i class="el-icon-edit" @click="$router.push({path:'/post/update',query:{id:scope.row.poster_id}})"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <i class="el-icon-delete" @click="showConfirmDialog(scope.row.poster_id)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="paginations.total > 0"
      :page-sizes="paginations.pageSizes"
      :page-size="paginations.page_size"
      :layout="paginations.layout"
      :total="paginations.total"
      :current-page="paginations.page_index"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      class="mt2 text-right"
    ></el-pagination>
  </div>
</template>
<script>
  import {postListFun, delPostFun} from '@/api/activity'

  export default {
    name: 'posterPage',
    data() {
      return {
        postList: [],
        //需要给分页组件传的信息
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 5, // 1页显示多少条
          pageSizes: [5, 10, 15, 20], //每页显示多少条
          layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
        }
      };
    },
    mounted() {
      this.getPostList();
    },
    methods: {
      getPostList() {
        let params = {
          searchKey: '',
          pageSize: this.paginations.page_size,
          pageIndex: this.paginations.page_index
        }
        postListFun(params).then(res => {
          if (res.data.success) {
            this.postList = res.data.data.data;
            this.paginations.page_count = res.data.data.pageinfo.totalpage;
            this.paginations.total = res.data.data.pageinfo.count;
          }
        })
      },
      showConfirmDialog(id) {
        this.$confirm('确认删除该海报吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delPost(id);
        }).catch(() => {
        });
      },
      delPost(id) {
        let params = {
          posterId: id
        };
        delPostFun(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success',
              center: true
            });
            this.getPostList();
          }
        })
      },
      // 每页多少条切换
      handleSizeChange(page_size) {
        this.paginations.page_size = page_size;
        this.getPostList()
      },
      // 上下分页
      handleCurrentChange(page) {
        this.paginations.page_index = page;
        this.getPostList();
      },
    }
  };
</script>
<style scoped>
</style>
