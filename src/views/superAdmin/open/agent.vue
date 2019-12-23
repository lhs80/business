<template>
    <div class="app-container calendar-list-container client-list">
        <!--菜单栏-->
        <div class="text-right">
            <span class="h5 prl1">品牌：</span>
            <div style="width:100px;display:inline-block;">
                <el-select size="small" v-model="searchParams.brand_id" placeholder="请选择">
                    <el-option v-for="(item,index) in brandList" :value="item.poster_id" :label="item.poster_name"></el-option>
                </el-select>
            </div>
            <span class="h5 prl1">区域：</span>
            <div style="display:inline-block;">
                <div class="agent-area-select">
                    <el-select size="small" v-model="searchParams.agent_provice" placeholder="请选择" @change="provinceChange">
                        <el-option
                                v-for="(item,index) in province"
                                :key="index"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="agent-area-select">
                    <el-select size="small" v-model="searchParams.agent_city" placeholder="请选择" @change="cityChange">
                        <el-option
                                v-for="(item,index) in city"
                                :key="index"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="agent-area-select">
                    <el-select size="small" v-model="searchParams.agent_county" placeholder="请选择">
                        <el-option
                                v-for="item in county"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div style="display:inline-block;">
                <el-button type="primary" size="small" @click="search()">搜索</el-button>
            </div>
        </div>
        <el-table :data="list" stripe style="width: 100%" class="mt2" empty-text="空白区域">
            <el-table-column prop="name" label="代理名称"></el-table-column>
            <el-table-column label="手机号">
                <template slot-scope="scope">
                    {{scope.row.phone.substring(0,3)}}***{{scope.row.phone.substring(7,11)}}
                </template>
            </el-table-column>
            <el-table-column prop="follows_names" label="归属业务员"></el-table-column>
            <el-table-column label="代理累计拿货">
                <template slot-scope="scope">
                    ￥{{scope.row.spend_money}}
                </template>
            </el-table-column>
            <el-table-column label="月均拿货">
                <template slot-scope="scope">
                    ￥{{scope.row.averageMonthMoney}}
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right">
            <el-pagination
                    :page-sizes="paginations.pageSizes"
                    :page-size="paginations.page_size"
                    :layout="paginations.layout"
                    :total="paginations.total"
                    :current-page="paginations.page_index"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    class="mt2"
            ></el-pagination>
        </div>
    </div>
</template>
<script>
	import {queryAgentInfoFun, postListFun} from '@/api/activity'
	import ChinaAddress from '@/common/china_address_v4.json'

	export default {
		data() {
			return {
				province: Object.keys(ChinaAddress),
				city: [],
				county: [],
				list: [],
				brandList: [],
				searchParams: {
					brand_id: '',
					agent_provice: '',
					agent_city: '',
					agent_county: '',
					pageSize: '',
					pageIndex: '',
				},
				paginations: {
					page_index: 1, // 当前位于哪页
					total: 0, // 总条数`
					page_count: 0,//总页数
					page_size: 5, // 1页显示多少条
					pageSizes: [5, 10, 15, 20], //每页显示多少条
					layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
				},
			}
		},
		mounted() {
			this.queryBrandList();
		},
		methods: {
			search() {
				this.searchParams.pageSize = this.paginations.page_size;
				this.searchParams.pageIndex = this.paginations.page_index;
				queryAgentInfoFun(this.searchParams).then(res => {
					if (res.data.success) {
						this.list = res.data.data.data;
						this.paginations.total = res.data.data.pageinfo.count
					}
				})
			},
			queryBrandList() {
				let params = {
					pageSize: 1000,
					pageIndex: 1
				};
				postListFun(params).then(res => {
					if (res.data.success) {
						this.brandList = res.data.data.data;
					}
				})
			},
			provinceChange(value) {
				this.city = Object.keys(ChinaAddress[value]);
			},
			cityChange() {
				this.county = ChinaAddress[this.searchParams.agent_provice][this.searchParams.agent_city];
			},
			// 上下分页
			handleCurrentChange(page) {
				this.paginations.page_index = page;
				this.getOrderList();
			},
			// 每页多少条切换
			handleSizeChange(page_size) {
				this.paginations.page_size = page_size;
				this.getOrderList()
			},
		}
	};
</script>
<style scoped>
    .agent-area-select {
        display: inline-block;
    }
</style>
