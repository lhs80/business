<template>
    <section class="app-container calendar-list-container">
        <el-form v-model="baseInfo" :rules="rules" ref="baseInfo" class="prl2" label-width="150px">
            <el-form-item label="商户名称" prop="name">
                <el-input v-model="baseInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="主营项目" prop="cat_name">
                <el-input v-model="baseInfo.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="商户logo">
                <img :src="baseInfo.logo" alt="" height="100px">
                <el-upload class="upload-demo" action="/api/file_upload" :data="imgType" :on-success="uploadSuccess">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <span slot="tip" class="el-upload__tip prl1">只能上传jpg/png文件，且不超过500kb</span>
                </el-upload>
            </el-form-item>
            <el-form-item label="商户介绍">
                <el-input v-model="baseInfo.desciption"></el-input>
            </el-form-item>
            <el-form-item label="业务员是否可以查看公司全部订单">
                <el-switch v-model="baseInfo.is_allow_view_all_order" active-text="开启" inactive-text="关闭"></el-switch>
            </el-form-item>
            <el-form-item label="下单几天后">
                <el-row>
                    <el-col :span="4">
                        <el-input-number v-model="baseInfo.ac_order_day"></el-input-number>
                    </el-col>
                    <el-col :span="20"><span class="prl1 text-muted"> 天，自动关闭未付款订单。</span></el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="收货几天后">
                <el-row>
                    <el-col :span="4">
                        <el-input-number v-model="baseInfo.no_refund_day"></el-input-number>
                    </el-col>
                    <el-col :span="20"><span class="prl1 text-muted">天，不能再申请退货退款。</span></el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="发货几天后">
                <el-row>
                    <el-col :span="4">
                        <el-input-number v-model="baseInfo.no_view_order_day"></el-input-number>
                    </el-col>
                    <el-col :span="20"><span class="prl1 text-muted">天，客户不能再查看订单。</span></el-col>
                </el-row>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="baseSettingUpdate">提交</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>
<script>
	import {queryBaseSettingFun, baseSettingUpdateFun} from '@/api/system'

	export default {
		data() {
			return {
				imgType: {type: 'merchant'},
				baseInfo: {
					mah_id: '',
					mah_name: '',
					cat_id: '',
					logo: '',
					desciption: '',
					isAllowViewAllOrder: false,
					ac_order_day: 0,
					no_refund_day: 0,
					no_view_order_day: 0
				},
				rules: {
					name: [
						{required: true, message: '请输入商品名称', trigger: 'blur'},
						{min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
					]
				}
			}
		},
		mounted() {
			this.queryBaseSetting();
		},
		methods: {
			queryBaseSetting() {
				queryBaseSettingFun().then(res => {
					if (res.data.success) {
						this.baseInfo = res.data.data;
						this.baseInfo.is_allow_view_all_order = this.baseInfo.is_allow_view_all_order ? true : false
					}
				})
			},
			baseSettingUpdate() {
				let params = {
					mch_id: this.baseInfo.m_id,
					mch_name: this.baseInfo.name,
					cat_id: this.baseInfo.cat_id,
					logo: this.baseInfo.logo,
					desciption: this.baseInfo.desciption,
					isAllowViewAllOrder: this.baseInfo.is_allow_view_all_order,
					ac_order_day: this.baseInfo.ac_order_day,
					no_refund_day: this.baseInfo.no_refund_day,
					no_view_order_day: this.baseInfo.no_view_order_day,
				};
				baseSettingUpdateFun(params).then(res => {
					if (res.data.success) {
						this.$message({
							showClose: true,
							message: '修改成功',
							type: 'success'
						});
						this.queryBaseSetting();
					}
				})
			},
			uploadSuccess(response) {
				if (response.success) {
					this.baseInfo.logo = response.data;
				}
			}
		}
	};
</script>
