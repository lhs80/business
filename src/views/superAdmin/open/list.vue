<template>
  <div style="position:relative" class="app-container calendar-list-container client-list">
    <div class="btn-add-customer">
      <el-button type="primary" size="small" @click="showExportCustomer=true">新增客户</el-button>
    </div>
    <el-tabs v-model="activeName" @change="multipleSelection=[]">
      <el-tab-pane label="跟进客户" name="first">
        <!--菜单栏-->
        <div class="bg-white">
          <div>
            <span class="h5" style="display:inline-block;width:100px">客户类型：</span>
            <span>
              <el-radio v-model="searchMyParams.type" label="">全部</el-radio>
              <el-radio v-model="searchMyParams.type" label="A">A</el-radio>
              <el-radio v-model="searchMyParams.type" label="B">B</el-radio>
              <el-radio v-model="searchMyParams.type" label="C">C</el-radio>
            </span>
          </div>
          <div>
            <span class="h5" style="display:inline-block;width:100px">品 牌：</span>
            <span>
              <el-radio label="" v-model="searchMyParams.brand_id">全部</el-radio>
               <el-radio v-for="(item,index) in brandList"
                         v-model="searchMyParams.brand_id"
                         :label="item.poster_id" :key="index">{{item.poster_name}}</el-radio>
            </span>
          </div>
        </div>
        <hr>
        <el-row>
          <el-col :span="12">
            <el-button type="primary" size="small" :disabled="!multipleSelection.length>0" @click="todoEdit(1)">编辑
            </el-button>
            <el-button type="primary" size="small" :disabled="!multipleSelection.length>0" @click="releaseCustomer(1)">
              释放回客户公海
            </el-button>
            <el-button type="primary" size="small" :disabled="!multipleSelection.length>0" @click="openAddOrder(1)">
              添加订单
            </el-button>
            <el-button type="primary" size="small" :disabled="!multipleSelection.length>0"
                       @click="showChangeFollower=1">转移
            </el-button>
          </el-col>
          <el-col :span="12" class="text-right">
            <div style="width:150px;display:inline-block;">
              <el-input size="small" v-model="searchMyParams.searchKey" placeholder="请输入客户姓名/手机号"></el-input>
            </div>
            <div style="display:inline-block;">
              <el-button type="primary" size="small" @click="getMyCustomerList()">搜索</el-button>
              <el-button size="small" @click="firstReset">重置</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table :data="myCusList" stripe style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="name" label="客户姓名">
            <template slot-scope="scope">
              <router-link :to="{path: '/superAdmin/followList/detail',query:{id:scope.row.id,type:2}}">
                <b class="text-info">{{scope.row.name}}</b>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="客户电话"></el-table-column>
          <el-table-column prop="brand_names" label="标记品牌"></el-table-column>
          <el-table-column prop="otherBrand" label="其它标记"></el-table-column>
          <el-table-column prop="wechat" label="客户微信"></el-table-column>
          <!--          <el-table-column prop="wech at" label="性格"></el-table-column>-->
          <el-table-column label="客户地址">
            <template slot-scope="scope">
              <span>{{scope.row.province}}{{scope.row.city}}{{scope.row.county}}{{scope.row.address}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="客户类型"></el-table-column>
          <el-table-column prop="last_follow_timespan_str" label="距上次跟进"></el-table-column>
          <el-table-column label="跟进记录">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="showFollowRecord=scope.row.puid">写跟进</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt2 text-right">
          <el-pagination
            :page-sizes="myPaginations.pageSizes"
            :page-size="myPaginations.page_size"
            :layout="myPaginations.layout"
            :total="myPaginations.total"
            :current-page="myPaginations.page_index"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的成交客户" name="second">
        <!--菜单栏-->
        <div class="bg-white">
          <el-row>
            <el-col :span="2" class="h5" style="display:inline-block;width:100px">客户类型：</el-col>
            <el-col :span="10">
              <el-radio label="" v-model="searchDoneParams.type">全部</el-radio>
              <el-radio v-model="searchDoneParams.type" label="代理">代理</el-radio>
              <el-radio v-model="searchDoneParams.type" label="S">S</el-radio>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2" class="h5" style="display:inline-block;width:90px">品牌：</el-col>
            <el-col :span="22" class="text-left">
              <span style="margin-left:10px">
                <el-radio label="" v-model="searchDoneParams.brand_id">全部</el-radio>
              </span>
              <span class="prl1" v-for="(item,index) in brandList">
                <el-radio
                  v-model="searchDoneParams.brand_id"
                  :label="item.poster_id" :key="index">{{item.poster_name}}</el-radio>
              </span>
            </el-col>
          </el-row>
        </div>
        <hr>
        <el-row>
          <el-col :span="12">
            <el-button type="primary" size="small" :disabled="!doneSelection.length>0" @click="todoEdit(2)">编辑
            </el-button>
            <el-button type="primary" size="small" :disabled="!doneSelection.length>0" @click="releaseCustomer(2)">
              释放回客户公海
            </el-button>
            <el-button type="primary" size="small" :disabled="!doneSelection.length>0" @click="openAddOrder(2)">添加订单
            </el-button>
            <el-button type="primary" size="small" :disabled="!doneSelection.length>0" @click="showChangeFollower=2">
              转移
            </el-button>
          </el-col>
          <el-col :span="12" class="text-right">
            <div style="width:150px;display:inline-block;">
              <el-input size="small" v-model="searchDoneParams.searchKey" placeholder="请输入客户姓名/手机号"></el-input>
            </div>
            <div style="display:inline-block;">
              <el-button type="primary" size="small" @click="getDoneCustomerList">搜索</el-button>
              <el-button size="small" @click="secondReset()">重置</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table :data="doneCusList" @selection-change="doneSelectionChange" :row-class-name="tableRowClassName">
          <el-table-column type="selection"/>
          <el-table-column prop="name" label="客户姓名">
            <template slot-scope="scope">
              <router-link :to="{path: '/superAdmin/followList/detail',query:{id:scope.row.id,type:2}}">
                <b class="text-info">{{scope.row.name}}</b>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="客户电话"></el-table-column>
          <el-table-column prop="brand_names" label="品牌"></el-table-column>
          <el-table-column prop="wechat" label="客户微信"></el-table-column>
          <el-table-column prop="type" label="客户类型"></el-table-column>
          <el-table-column prop="spend_count" label="业绩订单"></el-table-column>
          <el-table-column prop="spend_money" label="订单均价"></el-table-column>
          <el-table-column prop="last_order_timespan_str" label="距上次下单时间"></el-table-column>
          <el-table-column label="跟进记录">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="showFollowRecord=scope.row.puid">写跟进</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt2 text-right">
          <el-pagination
            v-if="donePaginations.total > 0"
            :page-sizes="donePaginations.pageSizes"
            :page-size="donePaginations.page_size"
            :layout="donePaginations.layout"
            :total="donePaginations.total"
            :current-page="donePaginations.page_index"
            @current-change="doneHandleCurrentChange"
            @size-change="doneHandleSizeChange"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="全部客户" name="third">
        <!--菜单栏-->
        <div class="bg-white">
          <el-row>
            <el-col :span="1" class="h5" style="display:inline-block;">品牌：</el-col>
            <el-col :span="23" class="text-left">
              <span style="margin-left:10px">
                <el-radio label="" v-model="searchAllParams.brand_id">全部</el-radio>
              </span>
              <span class="prl1" v-for="(item,index) in brandList">
                <el-radio
                  v-model="searchAllParams.brand_id"
                  :label="item.poster_id" :key="index">{{item.poster_name}}</el-radio>
              </span>
            </el-col>
          </el-row>
        </div>
        <hr>
        <div class="text-right">
          <div style="width:150px;display:inline-block;">
            <el-input size="small" v-model="searchAllParams.searchKey" placeholder="请输入客户姓名/手机号"></el-input>
          </div>
          <div style="display:inline-block;">
            <el-button type="primary" size="small" @click="getThirdCustomerList()">搜索</el-button>
            <el-button size="small" @click="thirdReset">重置</el-button>
          </div>
        </div>
        <el-table :data="thirdCustomerList"
                  style="width: 100%"
                  @selection-change="doneSelectionChange"
                  :row-class-name="tableRowClassName"
        >
          <el-table-column prop="name" label="客户姓名">
            <template slot-scope="scope">
              <router-link :to="{ path: '/superAdmin/followList/detail',query:{id:scope.row.id,type:2}}">
                <b class="text-info">{{scope.row.name}}</b>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="客户电话"></el-table-column>
          <el-table-column prop="wechat" label="客户微信"></el-table-column>
          <el-table-column prop="brand_names" label="品牌标记"></el-table-column>
          <el-table-column prop="type" label="客户类型"></el-table-column>
          <el-table-column prop="spend_count" label="是否成交">
            <template slot-scope="scope">
              {{scope.row.spend_count>0?'是':'否'}}
            </template>
          </el-table-column>
          <el-table-column prop="last_order_timespan_str" label="距上次跟进/下单时间"></el-table-column>
          <el-table-column label="跟进记录">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="showFollowRecord=scope.row.puid">写跟进</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt2 text-right">
          <el-pagination
            v-if="thirdCustomerPaginations.total > 0"
            :page-sizes="thirdCustomerPaginations.pageSizes"
            :page-size="thirdCustomerPaginations.page_size"
            :layout="thirdCustomerPaginations.layout"
            :total="thirdCustomerPaginations.total"
            :current-page="thirdCustomerPaginations.page_index"
            @current-change="thirdHandleCurrentChange"
            @size-change="thirdHandleSizeChange"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--新增客户-->
    <el-dialog title="新增客户" :visible="showExportCustomer" width="800" :show-close="false">
      <el-form ref="customerForm" :model="customerInfo" :label-width="formLabelWidth" :rules="customerRules">
        <el-form-item label="姓名" style="margin-bottom:15px" prop="name">
          <el-input size="small" placeholder="请输入姓名" v-model="customerInfo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" style="margin-bottom:15px" prop="phone">
          <el-input size="small" placeholder="请输入手机" v-model="customerInfo.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" style="margin-bottom:15px">
          <el-col :span="8">
            <el-form-item prop="province">
              <el-select size="small" v-model="customerInfo.province" placeholder="请选择省" @change="provinceChange">
                <el-option
                  v-for="(item,index) in province"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="prl1">
            <el-form-item prop="city">
              <el-select size="small" v-model="customerInfo.city" placeholder="请选择市" @change="cityChange">
                <el-option
                  v-for="(item,index) in city"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="county">
              <el-select size="small" v-model="customerInfo.county" placeholder="请选择区">
                <el-option
                  v-for="item in county"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop="address" style="margin-bottom:15px">
          <el-input size="small" placeholder='请输入详细地址' v-model="customerInfo.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌" style="margin-bottom:15px" prop="brand_ids">
          <el-select size="small" v-model="customerInfo.brand_ids" placeholder="请选择">
            <el-option v-for="(item,index) in brandList"
                       :value="item.poster_id"
                       :key="index"
                       :label="item.poster_name">{{item.poster_name}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微信" style="margin-bottom:15px">
          <el-input size="small" placeholder="请输入微信号" v-model="customerInfo.wechat" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" style="margin-bottom:15px">
          <el-select size="small" v-model="customerInfo.type" placeholder="请选择">
            <el-option value="A" label="A"/>
            <el-option value="B" label="B"/>
            <el-option value="C" label="C"/>
          </el-select>
        </el-form-item>
        <div v-if="customerInfo.type==='代理'">
          <div class="text-right">
            <el-button size="small" type="primary" @click="addNewAgent">添加</el-button>
          </div>
          <el-form-item style="margin-bottom:15px" class="mt1" label-width="0"
                        v-for="(item,index) in customerInfo.agent_info" :key="index">
            <el-col :span="5">
              <el-form-item label="品牌"
                            :prop="`agent_info.${index}.brand_id`"
                            :rules="{ required: true, message: '请输入代理品牌'}"
              >
                <el-select size="small" v-model="item.brand_id" placeholder="请选择"
                           @change="(value)=>setBrandName(value,index)">
                  <el-option v-for="(item,index) in brandList"
                             :value="item.poster_id"
                             :key="index"
                             :label="item.poster_name">{{item.poster_name}}
                  </el-option>
                </el-select>
                <input type="hidden" v-model="item.brand_name">
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="省"
                            :prop="`agent_info.${index}.agent_provice`"
                            :rules="{required: true, message: '请输入代理省份'}"
              >
                <el-select size="small" v-model="item.agent_provice" placeholder="请选择"
                           @change="agentProvinceChange">
                  <el-option
                    v-for="(item,index) in province"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="市">
                <el-select size="small" v-model="item.agent_city" placeholder="请选择"
                           @change="agentCityChange(index)">
                  <el-option
                    v-for="(item,index) in city"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="区">
                <el-select size="small" v-model="item.agent_county" placeholder="请选择">
                  <el-option
                    v-for="item in county"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="text-center">
              <el-button size="small" type="danger" @click="delAgent(index)">删除</el-button>
            </el-col>
          </el-form-item>
        </div>
        <div class="text-center h6 text-muted">提示：新增客户有30天保护期，不会被归入客户公海，30天后如未成交自动释放到客户公海！</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showExportCustomer = false">取消</el-button>
        <el-button type="primary" :loading="isAdd" @click="saveCustomer()">保存</el-button>
      </div>
    </el-dialog>
    <!--编辑客户-->
    <el-dialog title="编辑客户信息" :visible="showEditCustomer" width="800" :show-close="false">
      <el-form ref="customerEditForm" :model="customerInfo" :rules="customerRules" :label-width="formLabelWidth">
        <el-form-item label="姓名" prop="name" style="margin-bottom:15px">
          <el-input size="small" v-model="customerInfo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone" style="margin-bottom:15px">
          <el-input size="small" v-model="customerInfo.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" style="margin-bottom:15px">
          <el-col :span="8">
            <el-form-item prop="province">
              <el-select size="small" v-model="customerInfo.province" placeholder="请选择" @change="provinceChange">
                <el-option
                  v-for="(item,index) in province"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="prl1">
            <el-form-item prop="city">
              <el-select size="small" v-model="customerInfo.city" placeholder="请选择" @change="cityChange">
                <el-option
                  v-for="(item,index) in city"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="county">
              <el-select size="small" v-model="customerInfo.county" placeholder="请选择">
                <el-option
                  v-for="item in county"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop="address" style="margin-bottom:15px">
          <el-input size="small" v-model="customerInfo.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand_ids" style="margin-bottom:15px">
          <el-select size="small" v-model="customerInfo.brand_ids" placeholder="请选择">
            <el-option v-for="(item,index) in brandList"
                       :value="item.poster_id"
                       :key="index"
                       :label="item.poster_name">{{item.poster_name}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微信" style="margin-bottom:15px">
          <el-input size="small" v-model="customerInfo.wechat" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" style="margin-bottom:15px">
          <el-select size="small" v-model="customerInfo.type" placeholder="请选择">
            <el-option value="代理" label="代理" v-if="activeName==='second'"/>
            <el-option value="S" label="S" v-if="activeName==='second'"/>
            <el-option value="A" label="A" v-if="activeName==='first'"/>
            <el-option value="B" label="B" v-if="activeName==='first'"/>
            <el-option value="C" label="C" v-if="activeName==='first'"/>
          </el-select>
        </el-form-item>
        <div v-if="customerInfo.type==='代理'">
          <div class="text-right">
            <el-button size="small" type="primary" @click="addNewAgent">添加</el-button>
          </div>
          <el-form-item style="margin-bottom:15px" class="mt1" label-width="0"
                        v-for="(item,index) in customerInfo.agent_info" :key="index">
            <el-col :span="5">
              <el-form-item label="品牌" prop="brand_id"
                            :prop="`agent_info.${index}.brand_id`"
                            :rules="{ required: true, message: '请输入代理品牌'}"
              >
                <el-select size="small" v-model="item.brand_id" placeholder="请选择"
                           @change="(value)=>setBrandName(value,index)">
                  <el-option v-for="(item,index) in brandList"
                             :value="item.poster_id"
                             :key="index"
                             :label="item.poster_name">
                    {{item.poster_name}}
                  </el-option>
                </el-select>
                <input type="hidden" v-model="item.brand_name">
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="省"
                            :prop="`agent_info.${index}.agent_provice`"
                            :rules="{required: true, message: '请输入代理省份'}"
              >
                <el-select size="small" v-model="item.agent_provice" placeholder="请选择"
                           @change="agentProvinceChange">
                  <el-option
                    v-for="(item,index) in province"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" class="prl1">
              <el-form-item label="市">
                <el-select size="small" v-model="item.agent_city" placeholder="请选择"
                           @change="agentCityChange(index)">
                  <el-option
                    v-for="(item,index) in city"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="区">
                <el-select size="small" v-model="item.agent_county" placeholder="请选择">
                  <el-option
                    v-for="item in county"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="text-center">
              <el-button size="small" type="danger" @click="delAgent(index)">删除</el-button>
            </el-col>
          </el-form-item>
        </div>
        <div class="text-center h6 text-muted">提示：新增客户有30天保护期，不会被归入客户公海，30天后如未成交自动释放到客户公海！</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reset">取消</el-button>
        <el-button type="primary" :loading="isAdd" @click="editCustomerInfo()">保存</el-button>
      </div>
    </el-dialog>
    <!--写跟进-->
    <el-dialog title="写跟进" :visible="showFollowRecord!==''" :show-close="false">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-select placeholder="请选择跟进方式" size="small" style="width:100%" v-model="followRecordInfo.follow_type">
            <el-option label="微信" value="微信"></el-option>
            <el-option label="电话" value="电话"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12" class="text-right">
          <el-date-picker
            v-model="followRecordInfo.cdate"
            type="datetime"
            placeholder="选择日期"
            size="small"
            style="width:100%"
          >
          </el-date-picker>
        </el-col>
      </el-row>
      <div class="mt2">
        <el-input
          type="textarea"
          :autosize="{ minRows: 5}"
          placeholder="请输入内容"
          v-model="followRecordInfo.content"
        >
        </el-input>
      </div>
      <div class="mt2 text-right">
        <el-date-picker
          v-model="followRecordInfo.next_follow_date"
          type="datetime"
          placeholder="下次跟进时间"
          size="small"
          style="width:300px"
        >
        </el-date-picker>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showFollowRecord = ''">取消</el-button>
        <el-button type="primary" :loading="isAdd" @click="addFollowRecord()">保存</el-button>
      </div>
    </el-dialog>
    <!--转移--团队经理权限-->
    <el-dialog title="转移" :visible="showChangeFollower!==''" width="600px" :show-close="false">
      <el-select size="small" v-model="salesman" placeholder="请选择">
        <el-option
          v-for="(item,index) in employeeList"
          :key="index"
          :label="item.real_name"
          :value="item.id">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showChangeFollower = ''">取消</el-button>
        <el-button type="primary" @click="changeFollower()">确定</el-button>
      </div>
    </el-dialog>
    <!--添加订单-->
    <AddOrder @close='closeAddOrder' :show="showAddOrder"></AddOrder>
  </div>
</template>
<script>
  import {
    addMyCustomerFun,
    followDoneListFun,
    followMyListFun,
    addFollowRecordFun,
    postListFun,
    releaseCustomerFun,
    editCustomerInfoFun,
    changeFollowFun,
    getAllUserByMchFun,
    queryCustomDetailFun
  } from '@/api/activity'
  import ChinaAddress from '@/common/china_address_v4.json'
  import AddOrder from '../component/AddOrder'
  import {getStore} from '@/utils/store'

  export default {
    components: {AddOrder},
    data() {
      return {
        isAdd: false,
        curPuid: '',
        province: Object.keys(ChinaAddress),
        city: [],
        county: [],
        brandName: '',//品牌信息
        followRecordTime: '',
        activeName: 'first',
        formLabelWidth: '50px',
        showExportCustomer: false,
        showAddOrder: false,
        showFollowRecord: '',
        showEditCustomer: false,
        showChangeFollower: '',
        timeRange: '',
        searchMyParams: {},
        searchDoneParams: {},
        searchAllParams: {},
        salesman: '',
        followRecordInfo: {
          cdate: new Date()
        },
        customerInfo: {
          agent_info: []
        },
        doneCusList: [],
        myCusList: [],
        thirdCustomerList: [],
        myPaginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 20, // 1页显示多少条
          pageSizes: [20, 5, 10, 15], //每页显示多少条
          layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
        },
        donePaginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 20, // 1页显示多少条
          pageSizes: [20, 5, 10, 15], //每页显示多少条
          layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
        },
        thirdCustomerPaginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 20, // 1页显示多少条
          pageSizes: [20, 5, 10, 15], //每页显示多少条
          layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
        },
        brandList: [],
        multipleSelection: [],
        doneSelection: [],
        employeeList: [],
        userInfo: {},
        customerRules: {
          name: [{required: true, message: '请输入姓名'}],
          phone: [{required: true, message: '请输入手机'}],
          province: [{required: true, message: '请选择省'}],
          city: [{required: true, message: '请选择市'}],
          county: [{required: true, message: '请选择区'}],
          address: [{required: true, message: '请输入详细地址'}],
          brand_ids: [{required: true, message: '请选择品牌'}],
          type: [{required: true, message: '请选择类型'}],
        }
      }
    },
    watch: {
      'searchMyParams.brand_id': {
        handler() {
          this.myPaginations.page_index = 1;
          this.getMyCustomerList();
        }
      },
      'searchDoneParams.brand_id': {
        handler() {
          this.donePaginations.page_index = 1;
          this.getDoneCustomerList();
        }
      },
      'searchAllParams.brand_id': {
        handler() {
          this.thirdCustomerPaginations.page_index = 1;
          this.getThirdCustomerList();
        }
      }
    },
    mounted() {
      this.queryBrandList();
      this.getDoneCustomerList();
      this.getMyCustomerList();
      this.getThirdCustomerList();
      this.getAllUserByMch();
      this.userInfo = getStore({
        name: 'userinfo'
      })
    },
    methods: {
      openAddOrder(type) {
        this.showAddOrder = true;
        this.curPuid = type === 1 ? this.myCusList[0].puid : this.doneSelection[0].puid
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
      //我的成交客户
      getDoneCustomerList() {
        let params = {
          ...this.searchDoneParams,
          pageSize: this.donePaginations.page_size,
          pageIndex: this.donePaginations.page_index
        };
        followDoneListFun(params).then(res => {
          if (res.data.success) {
            this.doneCusList = res.data.data.data;
            this.donePaginations.total = res.data.data.pageinfo.count;
          }
        })
      },
      //我的跟进客户
      getMyCustomerList() {
        let params = {
          ...this.searchMyParams,
          pageSize: this.myPaginations.page_size,
          pageIndex: this.myPaginations.page_index
        };
        followMyListFun(params).then(res => {
          if (res.data.success) {
            this.myCusList = res.data.data.data;
            this.myPaginations.total = res.data.data.pageinfo.count;
          }
        })
      },
      //全部客户
      getThirdCustomerList() {
        let params = {
          ...this.searchAllParams,
          pageSize: this.thirdCustomerPaginations.page_size,
          pageIndex: this.thirdCustomerPaginations.page_index,
          includeFollowCustomer: 1
        };
        followDoneListFun(params).then(res => {
          if (res.data.success) {
            this.thirdCustomerList = res.data.data.data;
            this.thirdCustomerPaginations.total = res.data.data.pageinfo.count;
          }
        })
      },
      //写跟进
      addFollowRecord() {
        this.isAdd = true;
        let params = {
          puid: this.showFollowRecord,
          ...this.followRecordInfo
        };
        addFollowRecordFun(params).then(res => {
          if (res.data.success) {
            this.isAdd = false;
            this.showFollowRecord = '';
            this.followRecordInfo = {};
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success',
              center: true
            });
            this.getThirdCustomerList();
            this.getDoneCustomerList();
            this.getMyCustomerList();
          } else {
            this.isAdd = false;
            this.$message.error(res.data.msg)
          }
        })
      },
      //新增客户
      saveCustomer() {
        this.isAdd = true;
        this.$refs['customerForm'].validate(valid => {
          if (valid) {
            this.customerInfo.brand_names = this.brandList.filter(item => item.poster_id === this.customerInfo.brand_ids)[0].poster_name
            addMyCustomerFun(this.customerInfo).then(res => {
              if (res.data.success) {
                this.customerInfo = {};
                this.showExportCustomer = false;
                this.isAdd = false;
                this.getMyCustomerList();
                this.getDoneCustomerList();
                this.$message({
                  showClose: true,
                  message: '添加成功！',
                  type: 'success'
                });
              } else {
                this.isAdd = false;
                this.$message.error(res.data.msg)
              }
            })
          }
        });
      },
      todoEdit(type) {
        let list = type === 1 ? this.multipleSelection : this.doneSelection;
        this.showEditCustomer = true;
        let params = {
          id: list[0].id
        };
        queryCustomDetailFun(params).then(res => {
          this.customerInfo = res.data.data;
        })
      },
      //编辑客户信息
      editCustomerInfo() {
        this.isAdd = true;
        this.customerInfo.brand_names = this.brandList.filter(item => item.poster_id === this.customerInfo.brand_ids)[0].poster_name
        editCustomerInfoFun(this.customerInfo).then(res => {
          if (res.data.success) {
            this.showEditCustomer = false
            this.customerInfo = {};
            this.isAdd = false;
            this.getDoneCustomerList();
            this.getMyCustomerList();
          } else {
            this.isAdd = false;
            this.$message.error(res.data.msg)
          }
        })
      },
      //转移到客户公海
      releaseCustomer(type) {
        let count = 0
        let list = type === 1 ? this.multipleSelection : this.doneSelection
        list.forEach(item => {
          let params = {
            puid: item.puid
          };
          releaseCustomerFun(params).then(res => {
            if (res.data.success) {
              count++
            }
          })
        });
        setTimeout(() => {
          this.$message({
            showClose: true,
            message: `操作完成！成功${count}条，失败${this.multipleSelection.length - count}条!`,
            type: 'success'
          });
          this.getDoneCustomerList()
          this.getMyCustomerList()
        }, 1000)
      },
      //所有员工
      getAllUserByMch() {
        let params = {
          is_payroll: 1,
          group_id: this.userInfo.group_id
        };
        getAllUserByMchFun(params).then(res => {
          if (res.data.success) {
            this.employeeList = res.data.data
          }
        })
      },
      changeFollower() {
        let count = 0
        let list = this.showChangeFollower === 1 ? this.multipleSelection : this.doneSelection
        let salesman_name = this.employeeList.filter(item => item.id == this.salesman)[0].name
        list.forEach(item => {
          let params = {
            salesman_name,
            salesman_id: this.salesman,
            id: item.id
          };
          changeFollowFun(params).then(res => {
            if (res.data.success) {
              count++
            }
          })
        });
        setTimeout(() => {
          this.$message({
            showClose: true,
            message: `操作完成！成功${count}条，失败${this.multipleSelection.length - count}条!`,
            type: 'success'
          });
          this.getDoneCustomerList();
          this.getMyCustomerList();
          this.showChangeFollower = ''
        }, 1000)
      },
      provinceChange(value) {
        this.city = Object.keys(ChinaAddress[value])
      },
      cityChange() {
        this.county = ChinaAddress[this.customerInfo.province][this.customerInfo.city]
      },
      agentProvinceChange(value) {
        this.city = Object.keys(ChinaAddress[value])
      },
      agentCityChange(index) {
        this.county = ChinaAddress[this.customerInfo.agent_info[index].agent_provice][this.customerInfo.agent_info[index].agent_city]
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      doneSelectionChange(val) {
        this.doneSelection = val
      },
      // 我的跟进客户上下分页
      handleCurrentChange(page) {
        this.myPaginations.page_index = page
        this.getMyCustomerList()
      },
      // 我的跟进客户每页多少条切换
      handleSizeChange(page_size) {
        this.myPaginations.page_size = page_size
        this.getMyCustomerList()
      },
      // 我的成交客户上下分页
      doneHandleCurrentChange(page) {
        this.donePaginations.page_index = page;
        this.getDoneCustomerList()
      },
      // 我的成交客户每页多少条切换
      doneHandleSizeChange(page_size) {
        this.donePaginations.page_size = page_size;
        this.getDoneCustomerList()
      },
      // 我的成交客户上下分页
      thirdHandleCurrentChange(page) {
        this.thirdCustomerPaginations.page_index = page;
        this.getThirdCustomerList()
      },
      // 我的成交客户每页多少条切换
      thirdHandleSizeChange(page_size) {
        this.thirdCustomerPaginations.page_size = page_size;
        this.getThirdCustomerList()
      },
      closeAddOrder() {
        this.showAddOrder = false
      },
      tableRowClassName({row, rowIndex}) {
        let dateNum = row.last_order_timespan_str.replace('天', '');
        if (Number(dateNum) >= 7) {
          return 'warning-row';
        } else if (Number(dateNum) >= 12) {
          return 'danger-row';
        }
        return '';
      },
      //添加新的代理信息
      addNewAgent() {
        this.customerInfo.agent_info.push({
          brand_id: "",
          brand_name: "",
          agent_provice: "",
          agent_city: "",
          agent_county: ""
        })
      },
      //删除代理信息
      delAgent(index) {
        this.customerInfo.agent_info.splice(index, 1)
      },
      //新增代理信息时，品牌变化时，取品牌名称
      setBrandName(value, index) {
        let name = this.brandList.find(item => item.poster_id === value).poster_name;
        this.customerInfo.agent_info[index].brand_name = name;
      },
      reset() {
        this.showEditCustomer = false;
        this.customerInfo.agent_info = [];
        this.$refs['customerEditForm'].resetFields();
        this.$refs['customerForm'].resetFields();
      },
      firstReset() {
        this.searchMyParams = {
          type: '',
          brand_id: '',
          searchKey: ''
        };
        this.getMyCustomerList();
      },
      secondReset() {
        this.searchDoneParams = {
          type: '',
          brand_id: '',
          searchKey: ''
        };
        this.getDoneCustomerList();
      },
      thirdReset() {
        this.searchAllParams = {
          brand_id: '',
          searchKey: ''
        };
        this.getThirdCustomerList();
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .btn-add-customer {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 999
  }

  .cart-detail {
    height: 300px;
    overflow: auto;
  }

  .open-list-area-select {
    width: 167px;
    display: inline-block;
  }

</style>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #ffd8d8;
  }
</style>
