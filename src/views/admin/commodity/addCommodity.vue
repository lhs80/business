<template>
  <div class="app-container calendar-list-container">
    <h2>添加商品页</h2>
    <el-form
      :model="goodInfo"
      :rules="rules"
      ref="goodInfo"
      label-width="100px"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本" name="first">
          <el-form-item label="排序">
            <el-input v-model="goodInfo.sortIndex" placeholder="请输入商品排序数字"></el-input>
          </el-form-item>
          <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="goodInfo.goodsName" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品类型">
            <el-radio label="1" v-model="goodInfo.goods_type">零售商品</el-radio>
            <el-radio label="2" v-model="goodInfo.goods_type">批发商品</el-radio>
          </el-form-item>
          <!-- 这个是选中零售后显示 -->
          <el-form-item label="商品价格" prop="price" v-if="goodInfo.goods_type==='1'">
            <el-input v-model="goodInfo.price" placeholder="请输入商品排序价格"></el-input>
          </el-form-item>
          <!-- 这个是选中批发后显示 -->
          <el-form-item label="批发价格" prop="name" v-if="goodInfo.goods_type==='2'">
            <el-button type="primary" @click="addPriceRange">添加价格区间</el-button>
          </el-form-item>
          <el-form-item
            v-if="goodInfo.goods_type==='2'"
            v-for="(range, index) in goodInfo.pf_prices"
            :key="index"
            :rules="{
              required: true, message: '价格区间不能为空', trigger: 'blur'
            }"
          >
            <el-row>
              <el-col :span="11">
                <el-input placeholder="请输入内容" v-model="range.minCount">
                  <template slot="prepend">购买</template>
                  <template slot="append">件及以上</template>
                </el-input>
              </el-col>
              <el-col :span="11">
                <el-input v-model="range.price">
                  <template slot="append">元/件</template>
                </el-input>
              </el-col>
              <el-col :span="2" class="text-center">
                <el-button type="primary" @click="removeDomain(range)">删除</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 添加品牌 -->
          <el-form-item label="品牌" prop="brand_id">
            <el-select v-model="goodInfo.brand_id" placeholder="请选择">
              <el-option
                v-for="(item,index) in brandList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="代理价">
            <el-input v-model="goodInfo.dlprice" placeholder="请输入商品代理价"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="goodInfo.cat_id" placeholder="请选择">
              <el-option
                v-for="item in goodTypes"
                :key="item.cat_id"
                :label="item.cat_name"
                :value="item.cat_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品图片" prop="goodpic">
            <el-upload
              multiple
              :limit="3"
              action="/file_upload"
              :data="imgType"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :on-success="uploadSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <span slot="tip" class="el-upload__tip prl1">只能上传jpg/png文件，且不超过500kb</span>
            </el-upload>
          </el-form-item>
          <el-form-item label="运费设置">
            <el-row>
              <el-col :span="3">
                <el-radio v-model="goodInfo.is_free_express" label="0">
                  默认模板
                </el-radio>
              </el-col>
              <el-col :span="8" class="prl1">
                <el-select v-model="goodInfo.express_temp_id" placeholder="请选择"
                           :disabled="goodInfo.is_free_express==='1'">
                  <el-option
                    v-for="(item,index) in postModuleList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="3">
                <el-radio v-model="goodInfo.is_free_express" label="1">包邮</el-radio>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="goodInfo.status" label="1">上架</el-radio>
            <el-radio v-model="goodInfo.status" label="2">否</el-radio>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="库存/规格" name="second">
          <el-form-item label="重量" prop="weight">
            <el-input v-model="goodInfo.weight" :disabled="goodInfo.is_norm||goodInfo.is_norm==1">
              <template slot="append">克</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存" prop="reserve">
            <el-input v-model="goodInfo.reserve" placeholder="商品的剩余数量, 如启用多规格，则此处设置无效" :disabled="goodInfo.is_norm||goodInfo.is_norm==1"></el-input>
          </el-form-item>
          <el-form-item label="规格">
            <el-checkbox v-model="goodInfo.is_norm||goodInfo.is_norm==1">启用商品规格</el-checkbox>
            <h6 class="text-muted ">启用商品规格后，商品的价格及库存以商品规格为准,库存设置为0则会到”已售罄“中，手机也不会显示, -1为不限制</h6>
            <!-- 添加商品规格 -->
            <div v-show="goodInfo.is_norm">
              <div class="addGuiGeHint prl1">
                <h6>1. 拖动规格可调整规格显示顺序, 更改规格及规格项后请点击下方的【刷新规格项目表】来更新数据。</h6>
                <h6>2. 每一种规格代表不同型号，例如颜色为一种规格，尺寸为一种规格，如果设置多规格，手机用户必须每一种规格都选择一个规格项，才能添加购物车或购买。</h6>
              </div>
              <!-- 添加规格面板 -->
              <div v-for="(item,index) in goodInfo.normArr" :key="item.norm_id" class="model-panel p1"
                   :class="index>0?'mt2':''">
                <el-row>
                  <el-col :span="20">
                    <el-input size="small" v-model="item.name" placeholder="规格名称（比如颜色）" @input="onModelInput">
                    </el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-button size="small" type="primary" @click="addModelSubItem(index)">添加规格项</el-button>
                    <el-button size="small" type="danger" @click="removeModel(item)">删除</el-button>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col v-for="(subItem,key) in item.sub" :key="subItem.item_id" :span="6">
                    <el-input size="small" v-model="subItem.item_name" @input="onModelInput">
                      <template slot="append">
                        <span @click="removeModelSubItem(index,subItem)">x</span>
                      </template>
                    </el-input>
                  </el-col>
                </el-row>
              </div>
              <div class="mt2">
                <el-button type="primary" size="small" @click="addNewModel">添加规格</el-button>
                <el-button type="primary" size="small" @click="reloadModelTable">刷新规格项目表</el-button>
              </div>
              <el-alert v-if="showErrorTips" class="mt2" title="警告：规格数据有变动，请重新点击上方 [刷新规格项目表] 按钮！" type="error"
                        :closable="false">
              </el-alert>

              <div class="addGuiGeHint prl1 mt2">
                1. 批发商品设置多规格时,无需设置价格参数(现价,原价,成本价,预售价),当商品保存时会自动获取第一级批发价作为不同规格商品的统一价格!
              </div>
              <table class="tb-rule" v-if="this.headArray.length">
                <tr>
                  <th width="80px" v-for="(item,index) in headArray" :key="index">{{item}}</th>
                  <th>
                    <h6>库存</h6>
                    <el-input v-model="defaultValue.reserve">
                      <template slot="append"><i class="el-icon-arrow-down" @click="setInputValue('reserve')"></i>
                      </template>
                    </el-input>
                  </th>
                  <th v-if="goodInfo.goods_type=='1'">
                    <h6>现价</h6>
                    <el-input v-model="defaultValue.price">
                      <template slot="append"><i class="el-icon-arrow-down" @click="setInputValue('price')"></i>
                      </template>
                    </el-input>
                  </th>
                  <th v-if="goodInfo.goods_type=='1'">
                    <h6>代理价</h6>
                    <el-input v-model="defaultValue.dlprice">
                      <template slot="append"><i class="el-icon-arrow-down" @click="setInputValue('dlprice')"></i>
                      </template>
                    </el-input>
                  </th>
                  <th>
                    <h6>重量(克)</h6>
                    <el-input v-model="defaultValue.weight">
                      <template slot="append"><i class="el-icon-arrow-down" @click="setInputValue('weight')"></i>
                      </template>
                    </el-input>
                  </th>
                </tr>
                <tr v-for="(item,index) in goodInfo.skuArr" :key="index">
                  <td v-for="subItem in item.norms">{{subItem.item_name}}</td>
                  <td>
                    <el-input v-model="item.reserve"></el-input>
                  </td>
                  <td v-if="goodInfo.goods_type=='1'">
                    <el-input v-model="item.price"></el-input>
                  </td>
                  <td v-if="goodInfo.goods_type=='1'">
                    <el-input v-model="item.dlprice"></el-input>
                  </td>
                  <td>
                    <el-input v-model="item.weight"></el-input>
                  </td>
                </tr>
              </table>
            </div>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品描述" style="height:380px">
          <el-upload
            :data="imgType"
            class="ivu-upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png','gif']"
            :max-size="2048"
            multiple
            action="/file_upload"
          >
            <Button icon="ios-cloud-upload-outline" class="ivu-btn"></Button>
          </el-upload>
          <quill-editor v-model="goodInfo.detailContent" ref="QuillEditor" :options="editorOption"></quill-editor>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button type="primary" @click="submitForm('goodInfo')">立即创建</el-button>
        <el-button @click="$router.push({path:'/admin/onOffer',query:{type:1}})">返回列表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    addGoods,
    getBrand,
    getGoodsCat,
    makeNewNormFun,
    makeNewNormItemFun,
    getAllExpressTempFun
  } from "@/api/activity"
  import {uploadImage} from "@/api/common"
  // 工具栏配置
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{'header': 1}, {'header': 2}],               // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    [{'direction': 'rtl'}],                         // text direction

    [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],

    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
    [{'font': []}],
    [{'align': []}],
    ['link', 'image', 'video'],
    ['clean']                                         // remove formatting button
  ];

  export default {
    data() {
      return {
        defaultValue: {
          reserve: 0,
          price: 0,
          dlprice: 0,
          weight: 0
        },
        imgType: {type: "goods"},
        brandList: [], // 品牌列表
        goodTypes: [],//商品分类列表
        postModuleList: [],//运费模板列表
        showErrorTips: false,//添加规格时的警告信息,刷新表格时隐藏
        isShowGgx: false,  //  规格项是否显示
        goodInfo: {
          pics: [],//图片
          sortIndex: "",
          goodsName: "",//名称
          cat_id: "",//商品分类
          price: "",
          goods_type: "1",// 商品类型 零售或批发
          is_free_express: "0",// 包邮还是使用模板
          express_temp_id: "", // 关联的运费模板id，is_free_express为0时必传
          shangjiaRadio: "1",// 是否上架
          is_norm: false,//是否启用规格
          reserve: "", // 库存
          weight: "", // 重量
          brand_id: "",// 品牌ID
          dlprice: "",// 代理价格
          detailContent: "",//图文详情
          pf_prices: [{//批发价格
            minCount: 0,
            price: 0
          }],
          normArr: [],
          skuArr: [
            {
              norms: [],
              reserve: 0,
              code: "",
              weight: 0,
              price: 0,
              dlprice: 0
            }
          ],//规格项
          status: "1",//是否上架
        },
        rules: {
          number: [
            {required: true, message: "请输入排序数字", trigger: "blur"},
            {type: "number", message: "必须为数字", trigger: "blur"}
          ],
          goodsName: [
            {required: true, message: "请输入商品名称", trigger: "blur"},
          ],
          brand_id: [
            {required: true, message: "请选择品牌", trigger: "change"}
          ],
          region: [
            {required: true, message: "请选择活动区域", trigger: "change"}
          ]
        },
        activeName: "first",
        newModelTable: [],//最后生成的规格项表格
        headArray: [],//最后生成的规格项表格的表头
        editorOption: {
          modules: {
            toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  if (value) {
                    document.querySelector('.ivu-upload .ivu-btn').click()
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            }
          }
        }
      };
    },
    mounted() {
      this.getAllBrand();
      this.getAllGoodsType();
      this.getAllExpressTemp();
    },
    methods: {
      /**
       * 所有运费模板
       */
      getAllExpressTemp() {
        getAllExpressTempFun().then(res => {
          console.log("yunfei", res)
          if (res.data.success)
            this.postModuleList = res.data.data;
        })
      },
      /**
       * 所有品牌
       */
      getAllBrand() {
        getBrand().then(res => {
          console.log(res);
          if (res.data.success)
            this.brandList = res.data.data;
        });
      },
      /**
       * 所有分类
       */
      getAllGoodsType() {
        getGoodsCat().then(res => {
          console.log(res);
          if (res.data.success)
            this.goodTypes = res.data.data;
        });
      },
      /**
       * 添加商品
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid, object) => {
          if (valid) {
            this.goodInfo.is_norm = this.goodInfo.is_norm ? 1 : 0;
            this.goodInfo.pics = JSON.stringify(this.goodInfo.pics);
            addGoods(this.goodInfo).then(res => {
              console.log("submit", res)
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: "新增商品成功",
                  type: "success"
                });
                this.$router.push({path: '/admin/onOffer', query: {type: 1}});
              }else{
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
          } else {
            this.$message({
              showClose: true,
              message: object[Object.keys(object)[0]][0].message,
              type: "warning"
            });
            return false;
          }
        });
      },
      /**
       * 删除规格项
       */
      deleteGgx(ee) {
        console.log(ee);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      backList() {
        this.$emit("back", "true");
      },
      /**
       * 上传图片成功
       */
      uploadSuccess(response) {
        console.log(response);
        if (response.success) {
          this.goodInfo.pics.push(response.data);
        }
      },
      /**
       * 新增价格区间
       */
      addPriceRange() {
        if(this.goodInfo.pf_prices.length>=3){
          this.$message.warning("最多添加三个价格区间");
          return false;
        }
        this.goodInfo.pf_prices.push({
          minCount: 0,
          price: 0
        });
      },
      /**
       * 新增空规格
       */
      addNewModel() {
        if (this.goodInfo.goods_type === '2' && this.goodInfo.normArr.length >= 2) {
          this.$message.warning("您的商品类型为：批发商品的多规格形式，只能添加两种规格！");
          return false;
        }
        makeNewNormFun().then(res => {
          if (res.data.success) {
            this.goodInfo.normArr.push({
              norm_id: res.data.data.norm_id,
              name: "",
              sub: []
            });
          }
        })
      },
      /**
       * 新增空规格项
       */
      addModelSubItem(index) {
        let params = {
          norm_id: this.goodInfo.normArr[index].norm_id
        };
        makeNewNormItemFun(params).then(res => {
          if (res.data.success) {
            this.goodInfo.normArr[index].sub.push({
              item_id: res.data.data.item_id,
              item_name: ""
            });
          }
        });
      },
      /**
       * 删除价格区间
       */
      removeDomain(item) {
        let index = this.goodInfo.pf_prices.indexOf(item)
        if (index !== -1) {
          this.goodInfo.pf_prices.splice(index, 1)
        }
      },
      /**
       * 删除规格
       */
      removeModel(item) {
        let index = this.goodInfo.normArr.indexOf(item);
        if (index !== -1) {
          this.goodInfo.normArr.splice(index, 1)
        }
      },
      /**
       * 删除规格项
       */
      removeModelSubItem(pIndex, item) {
        let index = this.goodInfo.normArr[pIndex].sub.indexOf(item);
        if (index !== -1) {
          this.goodInfo.normArr[pIndex].sub.splice(index, 1)
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      handlePreview(file) {
        console.log(file);
      },
      /**
       * 刷新规格列表
       * */
      reloadModelTable() {
        if (!this.goodInfo.normArr.length) {
          this.$message({
            showClose: true,
            message: "请先添加规格项",
            type: "warning"
          });
          return false;
        }
        this.showErrorTips = false;
        this.goodInfo.skuArr = [];
        this.headArray = [];
        let maxLength = 0, rowLength = this.goodInfo.normArr.length, newIndex = -1;
        this.goodInfo.normArr.forEach((item, index) => {
          this.headArray.push(item.name);
        });

        let heads = [];
        if (this.goodInfo.normArr.length > 1) {
          heads = this.goodInfo.normArr[0];
          for (let i = 1, len = this.goodInfo.normArr.length; i < len; i++) {
            if (this.goodInfo.normArr[i].sub.length) {
              heads = this.addNewType(heads, this.goodInfo.normArr[i]);
            }
          }
        } else {
          for (let i = 0, len = this.goodInfo.normArr[0].sub.length; i < len; i++) {
            let params = [{
              "norm_id": this.goodInfo.normArr[0].norm_id,
              "item_id": this.goodInfo.normArr[0].sub[i].item_id,
              "item_name": this.goodInfo.normArr[0].sub[i].item_name,
            }];
            heads.push(params)
          }
        }

        // let preTitle = heads[0][0].item_name, rowSpan = 1;
        for (let i = 0; i < heads.length; i++) {
          // if (heads[i + 1] && heads[i + 1][0].item_name !== preTitle) {
          //   preTitle = heads[i + 1][0].item_name;
          //   rowSpan = 0;
          // } else {
          //   heads[i][0].rowSpan = rowSpan + 1;
          // }
          this.goodInfo.skuArr.push({
            norms: heads[i],
            reserve: 0,
            weight: 0,
            price: 0,
            dlprice: 0,
          })
        }
        console.log("skuArr", this.goodInfo.skuArr)
      },
      addNewType(heads, choices) {
        let result = [];
        for (let i = 0, len = heads.sub.length; i < len; i++) {
          for (let j = 0, lenj = choices.sub.length; j < lenj; j++) {
            // result.push(heads[i].item_name + '_' + choices[j].item_name);
            let params = [{
              "norm_id": heads.norm_id,
              "item_id": heads.sub[i].item_id,
              "item_name": heads.sub[i].item_name,
            }, {
              "norm_id": choices.norm_id,
              "item_id": choices.sub[j].item_id,
              "item_name": choices.sub[j].item_name,
            }];
            result.push(params);
          }
        }
        console.log("result", result)
        return result;
      },
      onModelInput() {
        this.showErrorTips = true;
      },
      setInputValue(key) {
        let self = this;
        this.$forceUpdate();
        this.goodInfo.skuArr.forEach((item, index) => {
          self.$set(item, key, self.defaultValue[key])
        })
      },
      handleSuccess(res) {
        // 获取富文本组件实例
        let quill = this.$refs.QuillEditor.quill;
        // 如果上传成功
        if (res) {
          console.log("upload", res);
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片，res为服务器返回的图片链接地址
          quill.insertEmbed(length, 'image', res.data);
          // 调整光标到最后
          quill.setSelection(length + 1)
        } else {
          // 提示信息，需引入Message
          this.$message.error('图片插入失败')
        }
      },
    }
  };
</script>
<style scoped lang="scss">
  .model-panel {
    min-height: 80px;
    border: solid 1px #e5e5e5;
    background: #fafafa;
  }

  .addGuiGeHint {
    color: #00c1de;
    background-color: #dff6fa;
    border-color: #c1e7ee;
    font-size: 12px;
    margin-bottom: 10px;
  }

  .tb-rule {
    width: 100%;
    background: #f8f8f8;
    border: solid 1px #e5e5e5;
  }

  .tb-rule td, .tb-rule th {
    width: 95px;
    color: #909090;
    text-align: center;
    padding: 5px 10px;
  }

  .quill-editor {
    height: 300px;
  }

  .ivu-upload {
    display: none;
  }
</style>

