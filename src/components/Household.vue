<template>
  <div class="household position-right">
    <div class="g-table-banner">
      <v-more-panel class="p-v-lg p-h-md">
        <v-form slot="form">
          <v-form-item label="住户姓名" class="m-b-sm">
            <v-input v-model="filterList.name"
                     placeholder="请输入住户姓名"
                     style="width: 180px;">
            </v-input>
          </v-form-item>
          <v-form-item label="联系方式" class="m-b-sm">
            <v-input v-model="filterList.mobile"
                     placeholder="请输入联系方式"
                     style="width: 180px;">
            </v-input>
          </v-form-item>
          <v-form-item label="住户身份" class="m-b-sm">
            <v-select v-model="filterList.userType" style="width: 150px;"
                      :data="userTypeOptions">
            </v-select>
          </v-form-item>
          <v-form-item label="住户房号" class="m-b-sm">
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
                      :data="unitOptions"
                      @change="changeRoom">
            </v-select>
            <v-select v-model="filterList.roomNoId"
                      :allowClear="false" style="width: 120px;"
                      :data="roomOptions">
            </v-select>
          </v-form-item>
          <v-form-item label="住户状态" class="m-b-sm">
            <v-select v-model="filterList.status"
                      :allowClear="false" style="width: 150px;"
                      :data="statusOptions">
            </v-select>
          </v-form-item>
        </v-form>
        <v-button slot="control"
                  type="primary"
                  html-type="button"
                  icon="search" style="margin-right:10px"
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

    <div class="g-table-content m-t-sm m-b-md p-h-md">
      <div class="clear">
        <div class="prop-button-group pull-right m-b-sm">
          <v-button type="primary"
                    class="m-r-sm"
                    @click="showModal('create')">
            添加住户
          </v-button>
          <v-button class="pull-right"
                    v-if="file.uploadFailData.length"
                    type="danger" ghost
                    @click="download">
            下载导入失败住户列表
          </v-button>
          <v-upload :name="file.name"
                    :action="file.action"
                    @change="onChange">
            <v-button type="primary" class="m-r-sm">
              导入
            </v-button>
          </v-upload>

        </div>
      </div>
      <div id="dvjson">
      </div>
      <div class="ant-table ant-table-large" style="width: 100%;">
        <div class="ant-table-content">
          <div class="ant-table-body">
            <div class="ant-spin-nested-loading" style="min-height: auto;">
              <div class="ant-spin-container">

                <table class="wk-table" style="table-layout:fixed;">
                  <thead class="ant-table-thead">
                  <tr>
                    <th>单元信息</th>
                    <th>住户姓名</th>
                    <th>手机号码</th>
                    <th width="25%">卡号</th>
                    <th>住户身份</th>
                    <th>住户状态</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                  </thead>
                  <tbody class="ant-table-tbody">
                  <tr v-for="item in householdList">
                    <td>{{item.partitionName + '-' + item.blockName + '-' + item.unitName + '-' + item.roomNo}}</td>
                    <td>{{item.name || '-'}}</td>
                    <td>{{item.mobile || '-'}}</td>
                    <td>{{item.cardTypeName || '-'}}</td>
                    <td>{{item.userType_cn || '-'}}</td>
                    <td>
                      {{item.status_cn || '-'}}
                    </td>
                    <td>{{item.gmtCreated | formatDate('YMD') }}</td>
                    <td>
                      <a href="javascript:;" class="m-r-xs"
                         @click="showModal('detail', item)">
                        详情
                      </a>
                      <a href="javascript:;" class="m-r-xs"
                         @click="showModal('edit', item)">
                        修改
                      </a>
                      <v-popconfirm placement="left"
                                    title="确定删除吗?"
                                    @confirm="deleteHousehold(item.id)">
                        <a href="javascript:;" class="m-r-xs">
                          删除
                        </a>
                      </v-popconfirm>
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
                    ref="pagination"
                    show-quick-jumper
                    :total="page.total">
      </v-pagination>
    </div>
    <div class="g-modal">

      <v-modal title="添加住户"
               :visible="modalVisible.create"
               :width="600"
               @cancel="handleCancel('create')">
        <household-create ref="householdCreateRef"></household-create>
        <div slot="footer">
          <v-button key="cancel"
                    @click="handleCancel('create')">
            取 消
          </v-button>
          <v-button key="confirm"
                    type="primary" @click="createHousehold">
            提 交
          </v-button>
        </div>
      </v-modal>

      <v-modal title="编辑住户"
               :visible="modalVisible.edit"
               :width="600"
               @cancel="handleCancel('edit')">
        <household-edit :item="itemParam" ref="householdEditRef"></household-edit>
        <div slot="footer">
          <v-button key="cancel"
                    @click="handleCancel('edit')">
            取 消
          </v-button>
          <v-button key="confirm"
                    type="primary" @click="editHousehold">
            提 交
          </v-button>
        </div>
      </v-modal>

      <v-modal title="住户详情"
               :visible="modalVisible.detail"
               :width="600"
               @cancel="handleCancel('detail')">
        <household-details :item="itemParam" ></household-details>
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
  import { bus } from '../util/bus.js'

  import HouseholdCreate from '@/components/HouseholdCreate'
  import HouseholdEdit from '@/components/HouseholdEdit'
  import HouseholdDetails from '@/components/HouseholdDetails'

  export default {
    data() {
      return {
        filterList:{
          name:"",
          mobile:"",
          userType:"",
          status: "",
          partitionId: "",
          blockId: "",
          unitId: "",
          roomNoId: ""
        },
        file: {
          name: 'file',
          action: 'http://192.168.23.241:8082/community/resident/import',
          uploadFailData: []
        },
        selectOptions: [{
          value: '0',
          label: '未处理'
        }, {
          value: '2',
          label: '已处理'
        }],
        page: {total: 0, value: 1},
        householdList: [],
        partitionOptions: [],
        blockOptions: [],
        unitOptions: [],
        roomOptions: [],
        userTypeOptions: [{
          value: '0',
          label: '住户'
        },{
          value: '1',
          label: '家人'
        },{
          value: '2',
          label: '租客'
        }],
        statusOptions: [ {
          value: '0',
          label: '正常'
        },{
          value: '1',
          label: '已过期'
        }],
        modalVisible: {
          create: false,
          edit: false,
          detail: false
        },
        idParam: "",
        itemParam: {},
        listLen: ""
      }
    },
    components: {
      HouseholdCreate,
      HouseholdEdit,
      HouseholdDetails
    },
    methods: {
      showTotal(total){
        return `全部 ${total} 条`;
      },
      showModal(value, param){
        if(typeof param == 'number'){
          this.idParam = param;
        }else{
          this.itemParam = param;
        }
        this.modalVisible[value] = true;
      },
      handleCancel (value) {
        this.modalVisible[value] = false;
      },
      loadPage(i){
        this._getHousehold(i, this.filterList)
      },
      createHousehold(){
        this.$refs.householdCreateRef.washData();
      },
      editHousehold(){
        this.$refs.householdEditRef.washData();
      },
      _getHousehold(pageNo, params){
        api.getResident(pageNo, 10, params)
          .then(res => {
            console.log(res);
            if(res.success){
              if(res.data.list){
                for (var i = 0; i < res.data.list.length; i++) {
                  switch (res.data.list[i].status) {
                    case 0:
                      res.data.list[i].status_cn = '正常';
                      break;
                    case 1:
                      res.data.list[i].status_cn = '已过期';
                      break;
                    default:
                      res.data.list[i].status_cn = '';
                  }
                  switch (res.data.list[i].userType) {
                    case 0:
                      res.data.list[i].userType_cn = '户主';
                      break;
                    case 1:
                      res.data.list[i].userType_cn = '家人';
                      break;
                    case 2:
                      res.data.list[i].userType_cn = '租客';
                      break;
                    default:
                      res.data.list[i].userType_cn = '';
                  }
                }
                this.page.total = res.data.total;
                this.householdList = res.data.list;
                this.listLen = res.data.list.length;
              }
            }
          })
      },
      deleteHousehold(id){
        api.deleteResident(id).then(res => {
          if(res.success){
            this.$notification.success({
              message: '删除成功！',
              duration: 2
            });
            this.listLen -= 1;
            if(this.listLen!=0){
              this.loadPage(this.$refs.pagination.value)
            }else{
              this.loadPage(this.$refs.pagination.value-1)
              this.$refs.pagination.current = this.$refs.pagination.value-1;
            }
          }else{
            this.$notification.error({
              message: res.message,
              duration: 2
            });
          }
        })
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {

        }
        if (info.file.status === 'done') {
          if(info.file.response.success && info.file.response.message == ""){
            this.$notification.success({
              message: '上传成功',
              duration: 2
            });
          }else{
            this.file.uploadFailData = info.file.response.data;
            this.$notification.error({
              message: info.file.response.message,
              duration: 2
            });
          }

        } else if (info.file.status === 'error') {
          this.$notification.error({
            message: '上传失败',
            duration: 2
          });
        }
      },
      download(){
        $("#dvjson").excelexportjs({
          containerid: "dvjson",
          datatype: 'json',
          dataset: this.file.uploadFailData,
          columns: [
            { headertext: "mobile", datatype: "string", datafield: "mobile", width: "100px" },
            { headertext: "name", datatype: "string", datafield: "name", width: "100px" }
          ]
        });
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
            this.filterList.roomNoId = "";
            this.roomOptions = [];
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
            this.filterList.roomNoId = "";
            this.roomOptions = [];
            this.unitOptions = res.data;
          })
      },
      changeRoom(val){
        api.getRooms(val)
          .then(res => {
            console.log(res);
            for(let i=0;i<res.data.length;i++){
              res.data[i].label = res.data[i].code;
              res.data[i].value = res.data[i].id;
            }
            this.filterList.roomNoId = "";
            this.roomOptions = [];
            this.roomOptions = res.data;
          })
      },
      filterTable(){
        var newObj = checkFilter(this.filterList);
        console.log(newObj);
        this._getHousehold(1, newObj)
      },
      resetTable(){
        this.filterList = {
          name:"",
          mobile:"",
          userType:"",
          status: "",
          partitionId: "",
          blockId: "",
          unitId: "",
          roomNoId: ""
        };
        this.blockOptions = [];
        this.unitOptions = [];
        this.roomOptions = [];
        this._getHousehold(1);
      },
    },
    created() {
      this._getHousehold(1);

      api.getPartitions().then(res=>{
        for(let i=0;i<res.data.length;i++){
          res.data[i].label = res.data[i].name;
          res.data[i].value = res.data[i].id;
        }
        this.partitionOptions = res.data;
      });

      if(sessionStorage.from == '1'){
        this.showModal('create');
        sessionStorage.removeItem('from')
      }

      bus.$off('householdForm_data_edit');
      bus.$off('householdForm_data_create');

      bus.$on('householdForm_data_create', (data) => {
        console.log(data)
        api.createResident(data).then(res=>{
          console.log(res);
          if(res.success){
            this.$notification.success({
              message: '新建成功！',
              duration: 2
            });
            this.handleCancel('create');
            this.loadPage(1);
          }else{
            this.$notification.error({
              message: res.message,
              duration: 2
            });
          }
        })
      })

      bus.$on('householdForm_data_edit', (data) => {
        console.log(data)
        api.editResident(data).then(res=>{
          console.log(res);
          if(res.success){
            this.$notification.success({
              message: '编辑成功！',
              duration: 2
            });
            this.handleCancel('edit');
            this.loadPage(this.$refs.pagination.value)
          }else{
            this.$notification.error({
              message: res.message,
              duration: 2
            });
          }
        })
      })

    }
  }
</script>
