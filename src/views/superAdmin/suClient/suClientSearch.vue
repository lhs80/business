<template>
  <section class="app-container calendar-list-container client-list">
    <aside v-if="!isShowClientDetail">
      <el-row :gutter="10">
        <el-col :span="6">
          <label class="h6">手机号：</label>
          <el-input size="small" placeholder="请输入手机号" v-model="searchInfo.phone" style="width:80%">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            <el-button slot="append" size="small" type="primary" @click="getClientList">搜索</el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-select size="small" v-model="searchInfo.province" placeholder="请选择省" @change="provinceChange">
            <el-option
              v-for="(item,index) in province"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select size="small" v-model="searchInfo.city" placeholder="请选择市" @change="cityChange">
            <el-option
              v-for="(item,index) in city"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select size="small" v-model="searchInfo.county" placeholder="请选择区">
            <el-option
              v-for="item in county"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input size="small" placeholder="请输入地址" v-model="searchInfo.address">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            <el-button slot="append" size="small" type="primary" @click="getClientList">搜索</el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button size="small" type="primary" @click="reset">重置</el-button>
        </el-col>
      </el-row>
      <div class="table_container mt2">
        <el-table
          ref="multipleTable"
          tooltip-effect="dark"
          :data="clientList"
          stripe
          style="width:100%"
        >
          <el-table-column label="序号" align="center" type="index"/>
          <el-table-column label="客户姓名" align="center" width="120" prop="name"/>
          <el-table-column property="spend_count" label="收货地址">
            <template slot-scope="scope">
              <div :class="index>0?'mt1':''" v-for="(address,index) in scope.row.addressList" :key="index">
                <span>{{address.province}}{{address.city}}{{address.country}}</span>
                <span class="prl1">{{address.address}}</span>
                <span>{{address.pname}}</span>
                <span class="prl1">{{address.phone}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label='业务员' width="150">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.salesManList" :key="index">
                {{item.real_name}}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="mt2 pull-right">
          <el-col>
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
    </aside>
  </section>
</template>

<script>
  import {serarchCustomByAdr} from "@/api/activity";
  import ChinaAddress from '@/common/china_address_v4.json'

  export default {
    data: () => {
      return {
        searchInfo: {
          province: '',
          city: '',
          county: '',
          address: '',
          phone: '',
        },
        isShowClientDetail: false,
        clientList: [],
        clientLevelList: [],
        curClientInfo: {},
        form: {
          level: ''
        },
        //需要给分页组件传的信息
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总数
          page_size: 20, // 1页显示多少条
          page_sizes: [5, 10, 15, 20], //每页显示多少条
          pager_count: 0,
          layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
        },
        province: Object.keys(ChinaAddress),
        city: [],
        county: [],
      };
    },
    mounted() {
      this.getClientList()
    },
    methods: {
      //客户列表
      getClientList() {
        let params = {
          ...this.searchInfo,
          pageSize: this.paginations.page_size,
          pageIndex: this.paginations.page_index
        };
        serarchCustomByAdr(params).then(res => {
          if (res.data.success) {
            this.clientList = res.data.data.data;
            this.paginations.pager_count = res.data.data.pageinfo.totalpage;
            this.paginations.total = res.data.data.pageinfo.count;
          }
        })
      },
      // 每页多少条切换
      handleSizeChange(page_size) {
        this.paginations.page_size = page_size;
        this.getClientList();
      },
      // 上下分页
      handleCurrentChange(page) {
        this.paginations.page_index = page;
        this.getClientList();
      },
      provinceChange(value) {
        this.city = Object.keys(ChinaAddress[value]);
        this.searchInfo.city = '';
        this.searchInfo.county = '';
      },
      cityChange() {
        this.county = ChinaAddress[this.searchInfo.province][this.searchInfo.city];
        this.searchInfo.county = '';
      },
      reset() {
        this.searchInfo = {
          province: '',
          city: '',
          county: '',
          address: '',
          phone: '',
        };
        this.getClientList()
      }
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
