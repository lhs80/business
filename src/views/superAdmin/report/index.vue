<template>
    <div style="position:relative" class="app-container calendar-list-container client-list">
        <el-tabs v-model="activeName" @change="multipleSelection=[]">
            <el-tab-pane label="团队报表" name="first">
                <div class="text-right">
                    <el-button size="small" type="primary">
                        <a href="http://m.gongjiangsht.com/mch/salesman/getFollowReportGroupExport"
                           target="_blank"
                        >
                            导出报表
                        </a>
                    </el-button>
                </div>
                <el-table :data="teamList" stripe style="width: 100%">
                    <el-table-column prop="group_name" label="团队名称"></el-table-column>
                    <el-table-column prop="mg_name" label="团队经理"></el-table-column>
                    <el-table-column prop="create_count" label="团队录入客户数"></el-table-column>
                    <el-table-column prop="follow_count" label="团队跟进客户数"></el-table-column>
                    <el-table-column prop="deal_count" label="团队成交客户数"></el-table-column>
                    <el-table-column prop="order_count" label="团队订单数"></el-table-column>
                    <el-table-column prop="order_money_count" label="团队业绩额"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="业务员报表" name="second">
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
                        <el-input size="small" placeholder="关键词搜索业务员姓名" v-model="searchParams.searchKey"></el-input>
                    </div>
                    <el-button size="small" type="primary" @click="businessReport">搜索</el-button>
                    <el-button size="small" type="primary">
                        <a :href="`http://m.gongjiangsht.com/mch/salesman/getFollowReportExport?group_id=${searchParams.group_id || ''}&searchKey=${searchParams.searchKey || ''}`"
                           target="_blank"
                        >
                            导出报表
                        </a>
                    </el-button>
                </div>
                <el-table :data="bussinessList" stripe style="width: 100%">
                    <el-table-column prop="name" label="业务员姓名"></el-table-column>
                    <el-table-column prop="group_name" label="所属团队"></el-table-column>
                    <el-table-column prop="create_count" label="录入客户数"></el-table-column>
                    <el-table-column prop="follow_count" label="跟进客户数"></el-table-column>
                    <el-table-column prop="deal_count" label="成效客户数"></el-table-column>
                    <el-table-column prop="order_count" label="订单数"></el-table-column>
                    <el-table-column prop="order_money_count" label="业绩额"></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
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
