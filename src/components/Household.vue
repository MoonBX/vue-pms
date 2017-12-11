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
            <v-select v-if="userType == 0" v-model="filterList.userType" style="width: 150px;"
                      :data="userTypeOptions">
            </v-select>
            <v-select v-if="userType == 1" v-model="filterList.userType" style="width: 150px;"
                      :data="userTypeOptionsWuhan">
            </v-select>
          </v-form-item>
          <v-form-item label="住户类型" class="m-b-sm" v-if="userType == 1" >
            <v-select v-model="filterList.userType" style="width: 150px;"
                      :data="typeOption">
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
          <!--<v-upload :name="file.name"-->
                    <!--:action="file.action"-->
                    <!--@change="onChange">-->
            <!--<v-button type="primary" class="m-r-sm">-->
              <!--导入-->
            <!--</v-button>-->
          <!--</v-upload>-->
        </div>
      </div>
      <div id="dvjson">
      </div>

      <v-table>
        <table class="wk-table" style="table-layout:fixed;">
          <thead class="ant-table-thead">
          <tr>
            <th>单元信息</th>
            <th>住户姓名</th>
            <th>手机号码</th>
            <th width="17%">卡号</th>
            <th>住户身份</th>
            <th>住户状态</th>
            <th>住户类型</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody class="ant-table-tbody">
          <tr v-for="item in householdList">
            <td>{{item.partitionName + '-' + item.blockName + '-' + item.unitName + '-' + item.roomNo}}</td>
            <td>{{item.name || '-'}}</td>
            <td>{{item.mobile || '-'}}</td>
            <td>{{item.cardTypeNames || '-'}}</td>
            <td>{{item.userType_cn || '-'}}</td>
            <td>
              {{item.status_cn || '-'}}
            </td>
            <td>{{item.type_cn}}</td>
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
      </v-table>

      <v-pagination class="m-t-md m-b-md"
                    v-model="page.value"
                    :pageSize="10"
                    :showTotal="pageOption().showTotal"
                    @change="pageOption().loadPage()"
                    ref="pagination"
                    show-quick-jumper
                    :total="page.total">
      </v-pagination>
    </div>
    <div class="g-modal">

      <v-modal title="添加住户"
               :visible="modalVisible.create"
               :width="600"
               :maskClosable="false"
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
      <v-modal title="添加住户"
               :visible="modalVisible.createWuhan"
               :width="600"
               :maskClosable="false"
               @cancel="handleCancel('create')">
        <household-create-wuhan ref="householdCreateWuhanRef"></household-create-wuhan>
        <div slot="footer">
          <v-button key="cancel"
                    @click="handleCancel('create')">
            取 消
          </v-button>
          <v-button key="confirm"
                    type="primary" @click="createHouseholdWuhan">
            提 交
          </v-button>
        </div>
      </v-modal>

      <v-modal title="编辑住户"
               :visible="modalVisible.edit"
               :width="600"
               :maskClosable="false"
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

      <v-modal title="编辑住户"
               :visible="modalVisible.editWuhan"
               :width="600"
               :maskClosable="false"
               @cancel="handleCancel('edit')">
        <household-edit-wuhan :item="itemParam" ref="householdEditWuhanRef"></household-edit-wuhan>
        <div slot="footer">
          <v-button key="cancel"
                    @click="handleCancel('edit')">
            取 消
          </v-button>
          <v-button key="confirm"
                    type="primary" @click="editHouseholdWuhan">
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
  import axios from 'axios'
  import { checkFilter } from '../util/option'
  import { bus } from '../util/bus.js'

  import HouseholdCreate from '@/components/HouseholdCreate'
  import HouseholdCreateWuhan from '@/components/HouseholdCreateWuhan'
  import HouseholdEdit from '@/components/HouseholdEdit'
  import HouseholdEditWuhan from '@/components/HouseholdEditWuhan'
  import HouseholdDetails from '@/components/HouseholdDetails'
  import vTable from '@/components/table'

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
        userType: localStorage.vueUserType,
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
          label: '户主'
        },{
          value: '1',
          label: '家人'
        },{
          value: '2',
          label: '租客'
        }],
        typeOption: [{
          value: 0,
          label: "一般住户"
        },{
          value: 1,
          label: "空巢老人"
        },{
          value: 2,
          label: "留守儿童"
        },{
          value: 3,
          label: "上访人员"
        },{
          value: 4,
          label: "吸毒人员"
        },{
          value: 5,
          label: "前科人员"
        },{
          value: 6,
          label: "新疆"
        },{
          value: 7,
          label: "西藏"
        },],
        userTypeOptionsWuhan: [{
          value: '1',
          label: '业主'
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
          createWuhan: false,
          edit: false,
          detail: false,
          editWuhan: false
        },
        idParam: "",
        itemParam: {},
        listLen: ""
      }
    },
    components: {
      HouseholdCreate,
      HouseholdCreateWuhan,
      HouseholdEdit,
      HouseholdEditWuhan,
      HouseholdDetails,
      vTable
    },
    methods: {
      pageOption(){
        var obj = {
          showTotal: (total)=>{
            return `全部 ${total} 条`;
          },
          loadPage: (i)=>{
            let pageNo;
            if(!i){ pageNo = this.$refs.pagination.current }
            else{ pageNo = i; }

            this._getHousehold(pageNo, this.filterList);
          }
        };
        return obj;
      },
      showModal(value, param){
        if(typeof param == 'number'){
          this.idParam = param;
        }else{
          this.itemParam = param;
        }
        if(localStorage.vueUserType == 1&&value != 'detail'){
          this.modalVisible[value+'Wuhan'] = true;
        }else{
          this.modalVisible[value] = true;
        }

      },
      handleCancel (value) {
        if(localStorage.vueUserType == 1&&value != 'detail'){
          this.modalVisible[value+'Wuhan'] = false;
        }else{
          this.modalVisible[value] = false;
        }

      },

      createHousehold(){
        this.$refs.householdCreateRef.washData();
      },
      createHouseholdWuhan(){
        this.$refs.householdCreateWuhanRef.washData();
      },
      editHousehold(){
        this.$refs.householdEditRef.washData();
      },
      editHouseholdWuhan(){
        this.$refs.householdEditWuhanRef.washData();
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
                }
                if(localStorage.vueUserType == 0){
                  for (var i = 0; i < res.data.list.length; i++) {
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
                }else{
                  for (var i = 0; i < res.data.list.length; i++) {
                    switch (res.data.list[i].userType) {
                      case 0:
                        res.data.list[i].userType_cn = '户主';
                        break;
                      case 1:
                        res.data.list[i].userType_cn = '业主';
                        break;
                      case 2:
                        res.data.list[i].userType_cn = '租客';
                        break;
                      default:
                        res.data.list[i].userType_cn = '';
                    }
                    switch (res.data.list[i].type) {
                      case 0:
                        res.data.list[i].type_cn = '一般住户';
                        break;
                      case 1:
                        res.data.list[i].type_cn = '空巢老人';
                        break;
                      case 2:
                        res.data.list[i].type_cn = '留守儿童';
                        break;
                      case 3:
                        res.data.list[i].type_cn = '上访人员';
                        break;
                      case 4:
                        res.data.list[i].type_cn = '吸毒人员';
                        break;
                      case 5:
                        res.data.list[i].type_cn = '前科人员';
                        break;
                      case 6:
                        res.data.list[i].type_cn = '新疆';
                        break;
                      case 7:
                        res.data.list[i].type_cn = '西藏';
                        break;
                      default:
                        res.data.list[i].type_cn = '';
                    }
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
            this.listLen = 1;
            if(this.listLen!=0){
              this.pageOption().loadPage(this.$refs.pagination.value)
            }else{
              this.pageOption().loadPage(this.$refs.pagination.value-1)
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
      document.title = '住户管理';
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
      bus.$off('householdWuhanForm_data_create');
      bus.$off('householdWuhanForm_data_edit');

      bus.$on('householdForm_data_create', (data) => {
        console.log(data)
        api.createResident(data).then(res=>{
          console.log(res);
          if(res.success){
            axios.post('http://project.ibutler.cn:8080/backend/account/setAccountMoneyStatus', {phoneNumberList: [data.mobile]}).then(response => {
              // success callback
              console.log(response);
              if(response.status == '200'){
                this.$notification.success({
                  message: '新建成功！',
                  duration: 2
                });
              }else{
                this.$notification.error({
                  message: response.data.errorMsg,
                  duration: 2
                });
              }
            });

            this.handleCancel('create');
            this.pageOption().loadPage(1);

          }else{
            this.$notification.error({
              message: res.message,
              duration: 2
            });
          }
        })
      });

      bus.$on('householdWuhanForm_data_edit', (data) => {
        let editRoomObj = {
          id: data.roomNoId,
          type: data.roomType
        }

        api.getEditRoomNo(editRoomObj).then(res => {
          console.log(res)
          if(res.success){
            api.editResident(data).then(res => {
              if(res.success){
                this.$notification.success({
                  message: '修改成功！',
                  duration: 2
                });
                this.handleCancel('edit');
                this.pageOption().loadPage(1);
              }else{
                this.$notification.error({
                  message: res.message,
                  duration: 2
                });
              }
            })
          }else{
            this.$notification.error({
              message: res.message,
              duration: 2
            });
          }
        })
      })

      bus.$on('householdWuhanForm_data_create', (data) => {
        let editRoomObj = {
          id: data[0].roomNoId,
          type: data[0].roomType
        }
        let faceObj = {
          communityId: localStorage.vueCommunityId,
          id: data[1].id,
          mobile: data[0].mobile
        }
        console.log(data[0].effectiveEndTime);
        api.getEditRoomNo(editRoomObj).then(res => {
          if(res.success){
            data[0].effectiveEndTime = Date.parse(new Date(data[0].effectiveEndTime)) + 24 * 60 * 60 * 1000 - 1000;
            api.createResidentWuhan(data[0]).then(res => {
              console.log(res);
              if(res.success){
                api.uploadFaceImage(faceObj).then(res => {
                  if(res.success){
                    this.$notification.success({
                      message: '新建成功！',
                      duration: 2
                    });
                    this.handleCancel('create');
                    this.pageOption().loadPage(1);
                  }else{
                    this.$notification.error({
                      message: res.message,
                      duration: 2
                    });
                  }
                })
              }else{
                this.$notification.error({
                  message: res.message,
                  duration: 2
                });
              }
            })
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
            this.pageOption().loadPage(this.$refs.pagination.value)
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
