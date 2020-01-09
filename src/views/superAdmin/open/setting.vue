<template>
    <div class="p2 ">
        <h3>公海设置</h3>

        <div class="mt4 p2 bg-grey">
            <el-input size="small" style="width:100px" v-model="info.cancelFollowDays"></el-input>
            <!--@input="setting"-->
            天未跟进，取消业务员跟进状态
        </div>
        <div class="mt2 p2 bg-grey">
            客户超过
            <el-input size="small" style="width:100px" v-model="info.releasePCustomerDays"></el-input>
            <!--@input="setting"-->
            天未下单，从业务员客户列表，释放回客户公海。
        </div>
        <div class="text-center">
            <el-button type="primary" size="large" @click="setting" class="mt4">保存</el-button>
        </div>
    </div>
</template>

<script>
	import {queryCustomerSettingFUN, customerSettingFUN} from '@/api/activity'

	export default {
		data() {
			return {
				info: {}
			}
		},
		mounted() {
			this.queryInfo();
		},
		methods: {
			queryInfo() {
				queryCustomerSettingFUN().then(res => {
					if (res.data.success) {
						this.info = res.data.data;
					}
				})
			},
			setting() {
				customerSettingFUN(this.info).then(res => {
					if (res.data.success) {
						this.$message({
							showClose: true,
							message: '修改成功',
							type: 'success'
						});
						this.queryInfo();
					}
				})
			}
		}
	}
</script>

