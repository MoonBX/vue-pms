<template>
  <div class="device position-right">
    <div class="g-table-banner">
      <v-more-panel class="p-v-lg p-h-md">
        <v-form slot="form">
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
          <v-form-item label="设备类型" class="m-b-sm">
            <v-select v-model="filterList.type" style="width: 150px;"
                      :data="typeOptions">
            </v-select>
          </v-form-item>
          <v-form-item label="设备状态" class="m-b-sm">
            <v-select v-model="filterList.status" style="width: 150px;"
                      :data="statusOptions">
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
      <div class="ant-table ant-table-large" style="width: 100%;">
        <div class="ant-table-content">
          <div class="ant-table-body">
            <div class="ant-spin-nested-loading" style="min-height: auto;">
              <div class="ant-spin-container">

                <table class="wk-table" style="table-layout:fixed;">
                  <thead class="ant-table-thead">
                  <tr>
                    <th>设备SN</th>
                    <th>设备类型</th>
                    <th>单元信息</th>
                    <th>门口编号</th>
                    <th>版本信息</th>
                    <th>锁类型</th>
                    <th>安装时间</th>
                    <th>锁状态</th>
                    <th>设备状态</th>
                    <th>用户/人</th>
                    <th>操作</th>
                  </tr>
                  </thead>
                  <tbody class="ant-table-tbody">
                  <tr v-for="item in deviceList">
                    <td>{{item.sn || '-'}}</td>
                    <td>{{item.type || '-'}}</td>
                    <td>{{item.blockName || '-'}}</td>
                    <td>{{item.location || '-'}}</td>
                    <td>{{item.apkVersion || '-'}}</td>
                    <td>{{item.lockType_cn || '-'}}</td>
                    <td>{{item.gmtCreated | formatDate('YMD') }}</td>
                    <td>{{item.lockStatus_cn || '-'}}</td>
                    <td> {{item.status_cn || '-'}}</td>
                    <td>{{item.amount}}</td>
                    <td>
                      <a href="javascript:;" class="m-r-xs"
                         @click="showModal('detail', item)">
                        详情
                      </a>
                      <a href="javascript:;" @click="toggleDoor(item.id, item.lockStatus)">
                        手动
                        <span v-if="item.lockStatus == 0">开</span>
                        <span v-if="item.lockStatus != 0">关</span>
                        门
                      </a>
                    </td>
                  </tr>
                  <div style="width: 100%;height: 20px;"></div>
                  </tbody>
                </table>

              </div>
            </div>
          </div>
        </div>
      </div>
      <v-pagination class="m-t-md m-b-md"
                    v-model="page.value"
                    :pageSize="10"
                    :showTotal="showTotal"
                    @change="loadPage"
                    show-quick-jumper
                    ref="pagination"
                    :total="page.total">
      </v-pagination>
    </div>
    <div class="g-modal">
      <v-modal title="设备详情"
               :visible="modalVisible.detail"
               :width="600"
               @cancel="handleCancel('detail')">
        <device-detail :item="itemParam" ref="deviceDetailRef"></device-detail>
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
  import DeviceDetail from '@/components/DeviceDetail'

  export default {
    data() {
      return {
        filterList:{
          type:"",
          status: "",
          partitionId: "",
          blockId: "",
          unitId: ""
        },
        page: {
          total: 0,
          value: 1
        },
        deviceList: [],
        partitionOptions: [],
        blockOptions: [],
        unitOptions: [],
        typeOptions: [{
          value: '0',
          label: '围墙机'
        }, {
          value: '1',
          label: '单元机'
        }],
        statusOptions: [{
          value: '0',
          label: '离线'
        }, {
          value: '1',
          label: '在线'
        }],
        modalVisible:{
          detail: false
        },
        itemParam: {}
      }
    },
    components:{
      DeviceDetail
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
      toggleDoor(id, status){
        api.closeDoor(id, status).then(res => {
          console.log(res);
          if(res.success){
            this.loadPage(this.$refs.pagination.value)
          }else{
            this.$notification.error({
              message: res.message,
              duration: 2
            });
          }
        })
      },
      loadPage(i){
        this._getDevice(i, this.filterList);
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
      _getDevice(pageNo, params){
        api.getDevice(pageNo, 10, params)
          .then(res => {
            console.log(res);
            if(res.success){
              if(res.data.list){
                for (var i = 0; i < res.data.list.length; i++) {
                  switch (res.data.list[i].type) {
                    case 0:
                      res.data.list[i].type = '围墙机';
                      break;
                    case 1:
                      res.data.list[i].type = '单元机';
                      break;
                    default:
                      res.data.list[i].type = '';
                  }
                  switch (res.data.list[i].status) {
                    case 0:
                      res.data.list[i].status_cn = '离线';
                      break;
                    case 1:
                      res.data.list[i].status_cn = '在线';
                      break;
                    default:
                      res.data.list[i].status_cn = '';
                  }
                  switch (res.data.list[i].lockType) {
                    case 0:
                      res.data.list[i].lockType_cn = '磁力锁';
                      break;
                    case 1:
                      res.data.list[i].lockType_cn = '电控锁';
                      break;
                    default:
                      res.data.list[i].lockType_cn = '';
                  }
                  switch (res.data.list[i].lockStatus) {
                    case 0:
                      res.data.list[i].lockStatus_cn = '关门';
                      break;
                    case 1:
                      res.data.list[i].lockStatus_cn = '开门';
                      break;
                    default:
                      res.data.list[i].lockStatus_cn = '';
                  }
                }
                this.page.total = res.data.total;
                this.deviceList = res.data.list;
              }
            }
          })
      },
      filterTable(){
        var newObj = checkFilter(this.filterList);
        this._getDevice(1, newObj)
      },
      resetTable(){
        this.filterList = {
          type:"",
          status: "",
          partitionId: "",
          blockId: "",
          unitId: ""
        };
        this.blockOptions = [];
        this.unitOptions = [];
        this._getDevice(1);
      },
    },
    created() {
      this._getDevice(1);
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
