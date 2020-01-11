<template>
    <div style="position:relative" class="app-container calendar-list-container client-list">
        <!--菜单栏-->
        <div class="bg-white text-right">
            <div style="width:200px;display:inline-block">
                <el-select v-model="searchParams.group_id" size="small" placeholder="请选择团队">
                    <el-option v-for="(item,index) in allTeamList"
                               :value="item.group_id"
                               :key="index"
                               :label="item.group_name"
                    >
                    </el-option>
                </el-select>
            </div>
            <div style="width:200px;display:inline-block">
                <el-select v-model="searchParams.group_id" size="small" placeholder="请选择业务员">
                    <el-option v-for="(item,index) in allTeamList"
                               :value="item.group_id"
                               :key="index"
                               :label="item.group_name"
                    >
                    </el-option>
                </el-select>
            </div>
            <label class="h6">是否成交：</label>
            <div style="width:200px;display:inline-block">
                <el-select v-model="searchParams.group_id" size="small" placeholder="是否成交">
                    <el-option value="0" label="否"></el-option>
                    <el-option value="1" label="是"></el-option>
                </el-select>
            </div>
            <label class="h6">是否代理：</label>
            <div style="width:200px;display:inline-block">
                <el-select v-model="searchParams.group_id" size="small" placeholder="是否代理">
                    <el-option value="0" label="否"></el-option>
                    <el-option value="1" label="是"></el-option>
                </el-select>
            </div>
            <div style="width:200px;display:inline-block">
                <el-input size="small" placeholder="关键词用户姓名/手机号" v-model="searchParams.searchKey"></el-input>
            </div>
            <el-button size="small" type="primary" @click="businessReport">搜索</el-button>
            <el-button size="small" type="primary">
                <a :href="`http://sht.qicheen.com/mch/salesman/getFollowReportExport?group_id=${searchParams.group_id || ''}&searchKey=${searchParams.searchKey || ''}`"
                   target="_blank"
                >
                    导出报表
                </a>
            </el-button>
        </div>
        <el-table :data="bussinessList" stripe style="width: 100%">
            <el-table-column prop="name" label="客户姓名"></el-table-column>
            <el-table-column prop="group_name" label="客户手机"></el-table-column>
            <el-table-column prop="create_count" label="客户微信"></el-table-column>
            <el-table-column prop="follow_count" label="客户地址"></el-table-column>
            <el-table-column prop="deal_count" label="是否成交"></el-table-column>
            <el-table-column prop="order_count" label="是否代理"></el-table-column>
            <el-table-column prop="order_money_count" label="代理区域"></el-table-column>
            <el-table-column prop="order_money_count" label="订单数"></el-table-column>
            <el-table-column prop="order_money_count" label="订单金额"></el-table-column>
            <el-table-column prop="order_money_count" label="归属团队"></el-table-column>
            <el-table-column prop="order_money_count" label="归属业务员"></el-table-column>
            <el-table-column prop="order_money_count" label="详情"></el-table-column>
        </el-table>
    </div>
</template>
<script>
	import {
		teamReportFun,
		personReportFun,
		teamsListFun
	} from '@/api/activity'

	export default {
		data() {
			return {
				activeName: 'first',
				searchParams: {},
				teamList: [],
				allTeamList: [],
				bussinessList: []
			}
		},
		mounted() {
			this.getAllTeams();
			this.getTeamReport();
			this.businessReport();
		},
		methods: {
			//团队列表
			getAllTeams() {
				teamsListFun().then(res => {
					if (res.data.success) {
						this.allTeamList = res.data.data;
					}
				})
			},
			//团队报表
			getTeamReport() {
				teamReportFun().then(res => {
					if (res.data.success) {
						this.teamList = res.data.data;
					}
				})
			},
			//业务员报表
			businessReport() {
				let params = {
					...this.searchParams,
				};
				personReportFun(params).then(res => {
					if (res.data.success) {
						this.bussinessList = res.data.data;
					}
				})
			}
		}
	}
</script>
