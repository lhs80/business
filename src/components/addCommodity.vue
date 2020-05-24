<template>
  <div class="app-container calendar-list-container">
    <h2>添加商品页</h2>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本" name="first">
          <el-form-item label="排序" prop="number">
            <el-input v-model="ruleForm.sort"></el-input>
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="商品类型" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
              <el-radio label="1" checked>零售商品</el-radio>
              <el-radio label="2">批发商品</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 这个是选中零售后显示 -->
          <el-form-item label="商品价格" prop="number" v-if="ruleForm.resource==='1'">
            <el-input v-model="ruleForm.lsjg"></el-input>
          </el-form-item>

          <!-- 这个是选中批发后显示 -->
          <el-form-item label="批发价格" prop="name" v-if="ruleForm.resource==='2'">
            <el-button type="primary">添加价格区间</el-button>
            <el-button type="primary">移除价格区间</el-button>
            <div>购买：
              <input v-model="ruleForm.jianshu">件及以上
              <input v-model="ruleForm.danjia">元/件
            </div>
          </el-form-item>

          <!-- 添加品牌 -->
          <el-form-item label="品牌" prop="name">
            <el-select v-model="ruleForm.brand" multiple placeholder="请选择">
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="代理价">
            <el-input v-model="ruleForm.dlJiaGe"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="ruleForm.type" placeholder="请选择">
              <el-option
                v-for="item in goodTypes"
                :key="item.cat_id"
                :label="item.cat_name"
                :value="item.cat_name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品图片">
            <el-upload
              multiple
              :limit="3"
              action="/api/file_upload"
              :data="imgType"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-exceed="handleExceed"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="运费设置">
            <el-row>
              <el-col :span="6">
                <el-radio v-model="ruleForm.yunfeiRadio" label="1">包邮</el-radio>
                <el-radio v-model="ruleForm.yunfeiRadio" label="0">
                  默认模板
                </el-radio>
              </el-col>
              <el-col :span="6">
                <el-select v-model="ruleForm.yunfei" placeholder="请选择" :disabled="ruleForm.yunfeiRadio!=='1'">
                  <el-option
                    v-for="item in yunfeiOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="ruleForm.shangjiaRadio" label="1">上架</el-radio>
            <el-radio v-model="ruleForm.shangjiaRadio" label="2">否</el-radio>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="库存/规格" name="second">
          <el-form-item label="重量">
            <el-input v-model="ruleForm.weight"></el-input>
          </el-form-item>
          <el-form-item label="库存">
            <el-input v-model="ruleForm.kucun" placeholder="商品的剩余数量, 如启用多规格，则此处设置无效"></el-input>
          </el-form-item>
          <el-form-item label="规格">
            <el-checkbox v-model="ruleForm.region">启用商品规格</el-checkbox>
            <p class="guiGe">启用商品规格后，商品的价格及库存以商品规格为准,库存设置为0则会到”已售罄“中，手机也不会显示, -1为不限制</p>
            <!-- 添加商品规格 -->
            <div v-show="guigeIsShow">
              <div class="addGuiGeHint">
                <p>1. 拖动规格可调整规格显示顺序, 更改规格及规格项后请点击下方的【刷新规格项目表】来更新数据。</p>
                <p>2. 每一种规格代表不同型号，例如颜色为一种规格，尺寸为一种规格，如果设置多规格，手机用户必须每一种规格都选择一个规格项，才能添加购物车或购买。</p>
              </div>
              <!-- 添加规格具体表 -->
              <div style="width:80%;margin:auto;border:1px solid gainsboro;padding:10px;">
                <span style="width:280px;">
                  <input v-model="ruleForm.guigeName" style="width:70%;height:30px;" placeholder="规格名称（比如颜色）">
                </span>
                <span>
                  <el-button type="primary">添加规格项</el-button>
                  <el-button type="danger">X</el-button>
                </span>
                <div>
                  <span v-if="isShowGgx">
                    <input style="height:20px;">
                    <span>X</span>
                  </span>
                  <span>
                    <input style="height:20px;">
                    <span>X</span>
                  </span>
                </div>
              </div>
              <el-button type="primary" size="small">添加规格</el-button>
              <el-button type="primary" size="small">刷新规格项目表</el-button>
            </div>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="backList">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {addGoods, getBrand, getGoodsCat} from "@/api/activity"
  import {uploadImage} from "@/api/common"

  export default {
    data() {
      return {
        imgType: {type: "merchant"},
        isShowPiFa: false,
        isShowLingSou: true,
        ruleForm: {
          name: "",// 零售价格
          lsjg: "",
          region: '',
          sort: "",
          type: "",// 商品分类
          yunfeiRadio: "0",// 运费选项
          yunfei: "", // 运费
          shangjiaRadio: "1",// 是否上架
          resource: "1",
          kucun: "", // 库存
          weight: "", // 重量
          brand: [],// 选中的品牌
          dlJiaGe: "",// 代理价格
          jianshu: "",// 购买件数
          danjia: "", // 单价
          guigeName: ""// 规格名称
        },
        rules: {
          number: [
            {required: false, message: "请输入排序数字", trigger: "blur"},
            {type: "number", message: "必须为数字", trigger: "blur"}
          ],
          name: [
            {required: false, message: "请输入商品名称", trigger: "blur"},
          ],
          resource: [
            {required: true, message: "请选择商品类型", trigger: "change"}
          ],
          region: [
            {required: true, message: "请选择活动区域", trigger: "change"}
          ]
        },
        brandList: [], // 品牌
        isShowGgx: false,  //  规格项是否显示
        activeName: "first",
        guigeIsShow: true, // 是否启用商品规格
        goodTypes: [],
        yunfeiOption: [
          {value: "1", label: "5元"},
          {value: "2", label: "6元"},
          {value: "3", label: "8元"}
        ],
        goodImages: []
      };
    },
    mounted() {
      this.getAllBrand();
      this.getAllGoodsType();
    },
    methods: {
      /**
       * 所有品牌
       */
      getAllBrand() {
        getBrand().then(res => {
          if (res.data.success)
            this.brandList = res.data.data;
        });
      },
      /**
       * 所有分类
       */
      getAllGoodsType() {
        getGoodsCat().then(res => {
          if (res.data.success)
            this.goodTypes = res.data.data;
        });
      },
      /**
       * 添加商品
       */
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let params = {
              goodsName: this.ruleForm.name,
              sortIndex: this.ruleForm.sort,
              cat_id: this.ruleForm.resource,
              price: this.ruleForm.lsjg,
              goods_type: this.ruleForm.resource,
              weight: this.ruleForm.weight,
              reserve: this.ruleForm.kucun,
              pics: JSON.stringify(this.goodImages),
              is_norm: this.ruleForm.region,//是否启用规格
              brand_id: this.ruleForm.brand,//选中的品牌
              is_free_express: this.ruleForm.yunfeiRadio,//包邮还是使用模板
              express_temp_id: this.ruleForm.yunfei,//关联的运费模板id
              status: this.ruleForm.shangjiaRadio//是否上架
            };
            addGoods(params).then(res => {
              console.log("submit", res)
            })
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      // 删除规格项
      deleteGgx(ee) {
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      backList() {
        this.$emit("back", "true");
      },
      // 下面是图片上传事件
      handleRemove(file, fileList) {
      },
      handlePreview(file) {
      },
      handleExceed(files, fileList) {
        // this.$message.warning(
        //   `当前限制选择 3 个文件，本次选择了 ${
        //     files.length
        //     } 个文件，共选择了 ${files.length + fileList.length} 个文件`
        // );
      },
      beforeRemove(file, fileList) {
        // return this.$confirm(`确定移除 ${file.name}？`);
      },
      // 添加规格项
      addGgx(name, text) {
        this.items.push({
          component: name,
          text: text
        });
      },
      uploadSuccess(response) {
        if (response.success) {
          this.goodImages.push(response.data);
        }
      }
    }
  };
</script>
<style scoped>
  .guiGe {
    color: gainsboro;
    font-size: 12px;
  }

  .addGuiGeHint {
    color: #00c1de;
    background-color: #dff6fa;
    border-color: #c1e7ee;
    font-size: 12px;
    margin-bottom: 10px;
  }
</style>

