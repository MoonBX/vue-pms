<template>
  <div class="announce position-right">
    <div class="g-table-banner p-v-lg p-h-md b-b">
      <v-form>
        <v-form-item label="发布标题">
          <v-input v-model="filterList.title" placeholder="请输入公告标题" style="width: 240px;"></v-input>
        </v-form-item>
        <v-form-item label="发布时间">
          <v-date-picker v-model="filterList.dateTime" range clearable></v-date-picker>
        </v-form-item>
        <v-form-item label="发布状态">
          <v-select v-model="filterList.status" tags style="width: 120px;" :data="selectOptions" ></v-select>
        </v-form-item>
        <div class="row text-center m-t-sm">
          <v-button type="primary" style="margin-right:10px">
            提交
          </v-button>
          <v-button type="ghost">
            重置
          </v-button>
        </div>
      </v-form>
    </div>
    <div class="g-table-content m-t-sm m-b-md p-h-md">
      <div>
        <transition name="fade" v-if="noticeToggle.success.check || noticeToggle.fail.check">
          <div class="text-center pull-left announce-notice">
            <div class="message-filter">
            <span>
              <div transition="message" class="ant-message-notice">
                <div class="ant-message-notice-content" >
                  <div v-if="noticeToggle.success.check"
                       class="ant-message-custom-content ant-message-success">
                    <i class="anticon anticon-check-circle"></i>
                    <span v-if="noticeToggle.success.create">新建公告成功！</span>
                    <span v-if="noticeToggle.success.delete">删除公告成功！</span>
                    <span v-if="noticeToggle.success.edit">编辑公告成功！</span>
                  </div>
                  <div v-if="noticeToggle.fail.check"
                       class="ant-message-custom-content ant-message-error">
                    <i class="anticon anticon-exclamation-circle"></i>
                    <span v-if="noticeToggle.fail.create">新建公告失败！</span>
                    <span v-if="noticeToggle.fail.delete">删除公告失败！</span>
                    <span v-if="noticeToggle.fail.edit">编辑公告失败！</span>
                  </div>
                </div>
              </div>
            </span>
            </div>
          </div>
        </transition>
        <div class="prop-button-group pull-right m-b-sm">
          <v-button type="primary"
                    class="m-r-sm"
                    @click="showModal('create')">
            新建公告
          </v-button>
        </div>
      </div>

      <div class="ant-table ant-table-large" style="width: 100%;">
        <div class="ant-table-content">
          <div class="ant-table-body">
            <div class="ant-spin-nested-loading" style="min-height: auto;">
              <div class="ant-spin-container">

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
                         @click="showModal('detail', item)">
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
                    :total="page.total">
      </v-pagination>
    </div>
    <div class="g-modal">

      <v-modal title="新建公告"
               :visible="modalVisible.create"
               :width="500"
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
               :width="700"
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
        <announce-details :item="itemParam" ></announce-details>
        <div slot="footer">
          <v-button key="cancel"
                    @click="handleCancel('detail')">
            取 消
          </v-button>
          <v-button key="confirm"
                    type="primary">
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
  import AnnounceCreate from '@/components/AnnounceCreate'
  import AnnounceEdit from '@/components/AnnounceEdit'
  import AnnounceDetails from '@/components/AnnounceDetails'

  export default{
    name: 'announce',
    data(){
      return {
        filterList:{
          title: "",
          dateTime: "",
          status: ""
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

        page: {total: 0, value: 1},
        announceList: [],
        modalVisible: {create: false, edit: false, detail: false},
        noticeToggle: {
          success: {check: false, create: false, edit: false, delete: false},
          fail: {check: false, create: false, edit: false, delete: false}
        },
        idParam: "",
        itemParam: {}
      }
    },
    components: {
      AnnounceCreate,
      AnnounceEdit,
      AnnounceDetails
    },
    methods: {
      showTotal(total){
        return `全部 ${total} 条`;
      },
      showModal(value, param){
        if(typeof param == 'number'){
          this.idParam = param;
        }else{
//          param = JSON.stringify(param);
//        typeof param == 'number'?this.idParam = param:this.itemParam = param;
          this.itemParam = param;
          console.log(this.itemParam)
        }
        this.modalVisible[value] = true;
//        this.param = param;
      },
      loadPage(i){
        this._getAnnounce(i)
      },
      createAnnounce(){
        var obj = this.$refs.announceCreateRef.cleanData();
        api.createAnnounce(obj)
          .then(res => {
            console.log(res);
            if(res.success){
              this.handleCancel('create');
              this.noticeToggle.success.check = true;
              this.noticeToggle.success.create = true;
              this._getAnnounce(1);
              setTimeout(()=>{
                this.noticeToggle.success.check = false;
                this.noticeToggle.success.create = false;
              }, 3000)
            }else{
              this.noticeToggle.fail = true;
              this.noticeToggle.create = true;
              setTimeout(()=>{
                this.noticeToggle.success = false;
                this.noticeToggle.create = false;
              }, 3000)
            }
          })
      },
      editAnnounce(){

      },
      deleteAnnounce(id){
        api.deleteAnnounce(id)
          .then(res => {
            console.log(res);
            if(res.success){
              this.noticeToggle.success.check = true;
              this.noticeToggle.success.delete = true;
              this._getAnnounce(1);
              setTimeout(()=>{
                this.noticeToggle.success.check = false;
                this.noticeToggle.success.delete = false;
              }, 3000)
            }else{
              this.noticeToggle.fail.check = true;
              this.noticeToggle.fail.delete = true;
              setTimeout(()=>{
                this.noticeToggle.fail.check = false;
                this.noticeToggle.fail.delete = false;
              }, 3000)
            }
          })
      },
      handleCancel (value) {
        this.modalVisible[value] = false;
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
              }
            }
          })
      },

    },
    created(){
      this._getAnnounce(1);
    }
  }
</script>
