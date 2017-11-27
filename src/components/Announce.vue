<template>
  <div class="announce position-right">

    <div class="g-table-banner">
      <v-more-panel class="p-v-lg p-h-md">
        <v-form slot="form">
          <v-form-item label="发布标题" class="m-b-sm">
            <v-input v-model="filterList.title" placeholder="请输入公告标题" style="width: 240px;"></v-input>
          </v-form-item>
          <v-form-item label="发布时间" class="m-b-sm">
            <v-date-picker v-model="filterList.st" :disabled-date="disabledStartDate"></v-date-picker>
            <span>-</span>
            <v-date-picker v-model="filterList.et" :disabled-date="disabledEndDate"></v-date-picker>
          </v-form-item>
          <v-form-item label="发布状态" class="m-b-sm">
            <v-select v-model="filterList.status" tags style="width: 120px;" :data="selectOptions"></v-select>
          </v-form-item>
        </v-form>
        <v-button slot="control" type="primary" html-type="button" icon="search" style="margin-right:10px" @click="filterTable">
          查询
        </v-button>
        <v-button slot="control" type="ghost" @click="resetTable">
          重置
        </v-button>
      </v-more-panel>
    </div>

    <div class="g-table-content m-t-sm m-b-md p-h-md">
      <div>
        <div class="prop-button-group pull-right m-b-sm">
          <v-button type="primary"
                    class="m-r-sm"
                    @click="showModal('create')">
            新建公告
          </v-button>
        </div>
      </div>

      <v-table>
        <table class="wk-table" style="table-layout:fixed;">
          <thead class="ant-table-thead">

          <tr>
            <th width="15%">标题</th>
            <th width="24%">内容</th>
            <th width="10%">发布时间</th>
            <th width="8%">发布对象</th>
            <th width="10%">开始时间</th>
            <th width="10%">结束时间</th>
            <th width="8%">状态</th>
            <th width="15%">操作</th>
          </tr>
          </thead>
          <tbody class="ant-table-tbody">
          <tr v-for="item in announceList">
            <td>{{item.title}}</td>
            <td class="word-break">{{item.content}}</td>
            <td>{{item.gmtCreated | formatDate('YMD') }}</td>
            <td>{{item.creator}}</td>
            <td>{{item.effectiveStartTime | formatDate('YMD') }}</td>
            <td>{{item.effectiveEndTime | formatDate('YMD') }}</td>
            <td>{{item.status}}</td>
            <td>
              <a href="javascript:;" class="m-r-xs"
                 @click="showModal('detail', item.id)">
                详情
              </a>
              <a href="javascript:;" class="m-r-xs"
                 @click="showModal('edit', item.id)">
                编辑
              </a>
              <v-popconfirm placement="left"
                            title="确定删除吗?"
                            @confirm="deleteAnnounce(item.id)">
                <a href="javascript:;">删除</a>
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
                    :showTotal="showTotal"
                    @change="loadPage"
                    ref="pagination"
                    show-quick-jumper
                    :total="page.total">
      </v-pagination>

    </div>
    <div class="g-modal">

      <v-modal title="新建公告"
               :visible="modalVisible.create"
               :width="700"
               @cancel="handleCancel('create')">
        <announce-create ref="announceCreateRef"></announce-create>
        <div slot="footer">
          <v-button key="cancel"
                    @click="handleCancel('create')">
            取 消
          </v-button>
          <v-button key="confirm"
                    type="primary"
                    @click="createAnnounce">
            提 交
          </v-button>
        </div>
      </v-modal>

      <v-modal title="编辑公告"
               :visible="modalVisible.edit"
               :width="500"
               @cancel="handleCancel('edit')">
        <announce-edit :id="idParam" ref="announceEditRef"></announce-edit>
        <div slot="footer">
          <v-button key="cancel"
                    @click="handleCancel('edit')">
            取 消
          </v-button>
          <v-button key="confirm"
                    type="primary"
                    @click="editAnnounce">
            提 交
          </v-button>
        </div>
      </v-modal>

      <v-modal title="公告详情"
               :visible="modalVisible.detail"
               ref="announceEditRef"
               :width="600"
               @cancel="handleCancel('detail')">
        <announce-details :id="idParam" ></announce-details>
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
.announce{
  .g-table-banner{
    background: #F1F6FF;
  }
  .g-table-content{
    padding-bottom: 15px;
  }
  .announce-notice{
    margin-left: 50%;
    position: relative;
    right: 75px;
    .message-filter{
      width: 150px;
      position: relative;
      top: -3px;
      margin: 0 auto;
      .ant-message-notice{
        right: 50%;
        position: relative;
      }
    }
  }
}
</style>
<script>
  import api from '../fetch/api'
  import { checkFilter } from '../util/option'
  import { bus } from '../util/bus.js'
  import AnnounceCreate from '@/components/AnnounceCreate'
  import AnnounceEdit from '@/components/AnnounceEdit'
  import AnnounceDetails from '@/components/AnnounceDetails'
  import vTable from '@/components/table'

  export default{
    name: 'announce',
    data(){
      return {
        filterList:{
          st: "",
          et: ""
        },
        selectOptions: [{
          value: '1',
          label: '发布中'
        }, {
          value: '2',
          label: '已过期'
        }, {
          value: '3',
          label: '未生效'
        }],
        page: {
          total: 0,
          value: 1
        },
        announceList: [],
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
      AnnounceCreate,
      AnnounceEdit,
      AnnounceDetails,
      vTable
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
          console.log(this.itemParam)
        }
        this.modalVisible[value] = true;
      },
      disabledStartDate(current){
        return current && current.valueOf() > Date.parse(new Date(this.filterList.et));
      },
      disabledEndDate(current){
        return current && current.valueOf() < Date.parse(new Date(this.filterList.st));
      },
      handleCancel (value) {
        this.modalVisible[value] = false;
      },
      filterTable(){
        var newObj = checkFilter(this.filterList);
        if(newObj.st&&newObj.et){
          newObj.st = Date.parse(new Date(this.filterList.st));
          newObj.et = Date.parse(new Date(this.filterList.et))+ 24 * 60 * 60 * 1000 - 1000;
        }
        this._getAnnounce(1, newObj)
      },
      resetTable(){
        this.filterList = {
          st: "",
          et: ""
        };
        this._getAnnounce(1);
      },
      loadPage(i){
        this._getAnnounce(i, this.filterList)
      },
      createAnnounce(){
        this.$refs.announceCreateRef.cleanData();
      },
      editAnnounce(){
        this.$refs.announceEditRef.washData();
      },
      deleteAnnounce(id){
        api.deleteAnnounce(id)
          .then(res => {
            console.log(res);
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
      _getAnnounce(pageNo, params){
        api.getAnnounce(pageNo, 10, params)
          .then(res => {
            console.log(res);
            if(res.success){
              if(res.data.list){
                for (var i = 0; i < res.data.list.length; i++) {
                  switch (res.data.list[i].status) {
                    case 0:
                      res.data.list[i].status = '撤销';
                      break;
                    case 1:
                      res.data.list[i].status = '发布中';
                      break;
                    case 2:
                      res.data.list[i].status = '已过期';
                      break;
                    case 3:
                      res.data.list[i].status = '未生效';
                      break;
                    default:
                      res.data.list[i].status = '';
                  }
                }
                this.page.total = res.data.total;
                this.announceList = res.data.list;
                this.listLen = res.data.list.length;

              }
            }
          })
      }
    },
    created(){
      document.title = '公告管理';
      this._getAnnounce(1);

      if(sessionStorage.from == '1'){
        this.showModal('create');
        sessionStorage.removeItem('from')
      }

      bus.$off('announceForm_data_create');
      bus.$on('announceForm_data_create', (data) => {
        console.log(data);
        api.createAnnounce(data)
          .then(res => {
            console.log(res);
            if(res.success){
              this.$notification.success({
                message: '新建成功！',
                duration: 2
              });
              this.handleCancel('create');
              this._getAnnounce(1);
            }else{
              this.$notification.error({
                message: res.message,
                duration: 2
              });
            }
          })
      })

      bus.$off('AnnounceForm_data_edit');
      bus.$on('AnnounceForm_data_edit', (data) => {
        console.log(data);
        api.editAnnounceSave(data)
          .then(res => {
            console.log(res);
            if(res.success){
              this.$notification.success({
                message: '编辑成功！',
                duration: 2
              });
              this.handleCancel('edit');
              this.loadPage(1);
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
