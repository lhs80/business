<template>
    <div class="p2 ">
        <h3>公海设置</h3>

        <div class="mt4 p2 bg-grey">
            <el-input size="small" style="width:100px" v-model="info.cancelFollowDays" @input="setting"></el-input>
            天未跟进，取消业务员跟进状态
        </div>
        <div class="mt2 p2 bg-grey">
            客户超过
            <el-input size="small" style="width:100px" v-model="info.releasePCustomerDays" @input="setting"></el-input>
            天未下单，从业务员客户列表，释放回客户公海。
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
						console.log(this.info);
					}
				})
			},
			setting() {
				setTimeout(() => {
					customerSettingFUN(this.info).then(res => {
						if (res.data.success) {
							this.queryInfo();
						}
					})
				}, 2000)
			}
		}
	}
</script>

