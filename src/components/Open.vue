<template>
  <div class="open position-right">
    <div class="g-table-banner">
      <v-more-panel class="p-v-lg p-h-md">
        <v-form slot="form">
          <v-form-item label="人员姓名" class="m-b-sm">
            <v-input v-model="filterList.userName"
                     placeholder="请输入人员姓名"
                     style="width: 180px;">
            </v-input>
          </v-form-item>
          <v-form-item label="设备类型" class="m-b-sm">
            <v-select v-model="filterList.deviceType"
                      style="width: 150px;"
                      :data="deviceTypeOptions">
            </v-select>
          </v-form-item>
          <v-form-item label="开门类型" class="m-b-sm">
            <v-select v-model="filterList.type"
                      style="width: 150px;"
                      :data="typeOptions">
            </v-select>
          </v-form-item>
          <v-form-item label="时间范围" class="m-b-sm">
            <v-date-picker v-model="filterList.st" :disabled-date="disabledStartDate"></v-date-picker>
            <span>-</span>
            <v-date-picker v-model="filterList.et" :disabled-date="disabledEndDate"></v-date-picker>
          </v-form-item>
          <v-form-item label="位置信息" class="m-b-sm">
            <v-select v-model="filterList.partitionId"
                      :allowClear="false" style="width: 150px;"
                      :data="partitionOptions"
                      @change="changeBlock">
            </v-select>
            <v-select v-model="filterList.blockId"
                      :allowClear="false" style="width: 120px;"
                      :data="blockOptions"
                      @change="changeUnit">
            </v-select>
            <v-select v-model="filterList.unitId"
                      :allowClear="false" style="width: 120px;"
                      :data="unitOptions">
            </v-select>
          </v-form-item>

        </v-form>
        <v-button slot="control"
                  type="primary"
                  html-type="button"
                  icon="search"
                  style="margin-right:10px"
                  @click="filterTable">
          查询
        </v-button>
        <v-button slot="control"
                  type="ghost"
                  @click="resetTable">
          重置
        </v-button>
      </v-more-panel>
    </div>
    <div class="g-table-content m-t-sm m-b-md p-h-md p-v-sm">
      <v-table>
        <table class="wk-table" style="table-layout:fixed;">
          <thead class="ant-table-thead">

          <tr>
            <th width="18%">单元信息</th>
            <th width="10%">设备类型</th>
            <th width="10%">姓名</th>
            <th width="10%">通话时长</th>
            <th width="18%">开门时间</th>
            <th width="12%">开门类型</th>
            <th width="12%">缩略图</th>
            <th width="10%">操作</th>
          </tr>
          </thead>
          <tbody class="ant-table-tbody">
          <tr v-for="(item, index) in openList">
            <td>{{item.blockName || '-'}}</td>
            <td>{{item.deviceType || '-'}}</td>
            <td>{{item.name || '-'}}</td>
            <td>{{item.duration || '-'}}</td>
            <td>{{item.unlockTime | formatDate('YMDHMS')  || '-'}}</td>
            <td>{{item.type || '-'}}</td>
            <td>
              <div>
                <v-popover title="Title"
                           trigger="click"
                           v-if="index==0"
                           placement="leftTop">
                  <img :src="item.snapshot"
                       alt="..." style="width: 88px;">
                  <div slot="title">
                    缩略图
                  </div>
                  <div slot="content">
                    <img :src="item.snapshot"
                         alt="..." style="height: 288px">
                  </div>
                </v-popover>
                <v-popover title="Title"
                           trigger="click"
                           v-if="index==9"
                           placement="leftBottom">
                  <img :src="item.snapshot"
                       alt="..." style="width: 88px;">
                  <div slot="title">
                    缩略图
                  </div>
                  <div slot="content">
                    <img :src="item.snapshot"
                         alt="..." style="height: 288px">
                  </div>
                </v-popover>
                <v-popover title="Title"
                           trigger="click"
                           v-if="index!=0&&index!=9"
                           placement="left">
                  <img :src="item.snapshot"
                       alt="..." style="width: 88px;">
                  <div slot="title">
                    缩略图
                  </div>
                  <div slot="content">
                    <img :src="item.snapshot"
                         alt="..." style="height: 288px">
                  </div>
                </v-popover>
              </div>
            </td>
            <td>
              <a href="javascript:;"
                 @click="showModal('detail', item)">
                详情
              </a>
            </td>
          </tr>
          <div style="width: 100%;height: 20px;"></div>
          </tbody>
        </table>
      </v-table>

      <v-pagination class="m-t-md m-b-md"
                    v-model="page.value"
                    :pageSize="10"
                    :showTotal="showTotal"
                    @change="loadPage"
                    show-quick-jumper
                    :total="page.total">
      </v-pagination>
    </div>

    <div class="g-modal">
      <v-modal title="日志详情"
               :visible="modalVisible.detail"
               :width="600"
               @cancel="handleCancel('detail')">
        <open-detail :item="itemParam"></open-detail>
        <div slot="footer">
          <v-button key="confirm"
                    type="primary"
                    @click="handleCancel('detail')">
            确 定
          </v-button>
        </div>
      </v-modal>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  import { checkFilter } from '../util/option'
  import OpenDetail from '@/components/OpenDetail'
  import vTable from '@/components/table'
  export default {
    data() {
      return {
        filterList:{
          et: "",
          st: ""
        },
        page: {
          total: 0,
          value: 1
        },
        openList: [],
        partitionOptions: [],
        blockOptions: [],
        unitOptions: [],
        deviceTypeOptions: [{
          value: '0',
          label: '围墙机'
        },{
          value: '1',
          label: '单元机'
        }],
        typeOptions: [{
          value: '0',
          label: '呼叫'
        }, {
          value: '1',
          label: '刷卡'
        },{
          value: '2',
          label: '密码'
        }, {
          value: '3',
          label: '手机开门'
        },{
          value: '4',
          label: '人脸开门'
        }],
        modalVisible: {
          detail: false
        },
        itemParam: {}
      }
    },
    components:{
      OpenDetail,
      vTable
    },
    methods: {
      showTotal(total){
        return `全部 ${total} 条`;
      },
      showModal(value, param){
        this.itemParam = param;
        this.modalVisible[value] = true;
      },
      handleCancel (value) {
        this.modalVisible[value] = false;
      },
      filterTable(){
        var newObj = checkFilter(this.filterList);
        if(newObj.st&&newObj.et){
          newObj.st = Date.parse(new Date(newObj.st));
          newObj.et = Date.parse(new Date(newObj.et))+ 24 * 60 * 60 * 1000 - 1000;
        }
        this._getIntercom(1, newObj)
      },
      resetTable(){
        this.filterList = {
          et: "",
          st: ""
        };
        this.blockOptions = [];
        this.unitOptions = [];
        this._getIntercom(1);
      },
      disabledStartDate(current){
        return current && current.valueOf() > Date.parse(new Date(this.filterList.et));
      },
      disabledEndDate(current){
        return current && current.valueOf() < Date.parse(new Date(this.filterList.st));
      },
      loadPage(i){
        this._getIntercom(i, this.filterList)
      },
      _getIntercom(pageNo, params){
        api.getIntercom(pageNo, 10, params)
          .then(res => {
            console.log(res);
            if(res.success){
              if(res.data.list){
                for (var i = 0; i < res.data.list.length; i++) {
                  switch (res.data.list[i].type) {
                    case 0:
                      res.data.list[i].type = '呼叫';
                      break;
                    case 1:
                      res.data.list[i].type = '刷卡';
                      break;
                    case 2:
                      res.data.list[i].type = '密码';
                      break;
                    case 3:
                      res.data.list[i].type = '手机开门';
                      break;
                    case 4:
                      res.data.list[i].type = '人脸开门';
                      break;
                    case 5:
                      res.data.list[i].type = '身份证开门';
                      break;
                    case 6:
                      res.data.list[i].type = '扫码开门';
                      break;
                    default:
                      res.data.list[i].type = '';
                  }
                  switch (res.data.list[i].cardType) {
                    case 0:
                      res.data.list[i].cardType = '无';
                      break;
                    case 1:
                      res.data.list[i].cardType = 'IC';
                      break;
                    case 1:
                      res.data.list[i].cardType = 'ID';
                      break;
                    default:
                      res.data.list[i].cardType = '';
                  }
                  switch (res.data.list[i].deviceType) {
                    case 0:
                      res.data.list[i].deviceType = '围墙机';
                      break;
                    case 1:
                      res.data.list[i].deviceType = '单元机';
                      break;
                    default:
                      res.data.list[i].deviceType = '';
                  }
                }
                this.page.total = res.data.total;
                this.openList = res.data.list;
              }
            }
          })
      },
      changeBlock(val){
        api.getBlocks(val)
          .then(res => {
            for(let i=0;i<res.data.length;i++){
              res.data[i].label = res.data[i].name;
              res.data[i].value = res.data[i].id;
            }
            this.filterList.blockId = "";
            this.blockOptions = [];
            this.filterList.unitId = "";
            this.unitOptions = [];
            this.blockOptions = res.data;
          })
      },
      changeUnit(val){
        api.getUnits(val)
          .then(res => {
            for(let i=0;i<res.data.length;i++){
              res.data[i].label = res.data[i].name;
              res.data[i].value = res.data[i].id;
            }
            this.filterList.unitId = "";
            this.unitOptions = [];
            this.unitOptions = res.data;
          })
      },

    },
    created() {
      document.title = '开门日志';
      this._getIntercom(1);
      api.getPartitions()
        .then(res=>{
          for(let i=0;i<res.data.length;i++){
            res.data[i].label = res.data[i].name;
            res.data[i].value = res.data[i].id;
          }
          this.partitionOptions = res.data;

        })
    }
  }
</script>
