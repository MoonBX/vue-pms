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
          <v-button type="primary" style="margin-right:10px">提交</v-button>
          <v-button type="ghost">重置</v-button>
        </div>
      </v-form>
    </div>
    <div class="g-table-content m-t-sm m-b-md p-h-md">
      <div class="prop-button-group pull-right m-b-sm">
        <v-button type="primary" class="m-r-sm" @click="showCreateModal">新建公告</v-button>
        <v-modal title="新建公告" :visible="announceModalVisible" :width="700">
          <announce-create ref="announceCreateRef"></announce-create>
          <v-button key="cancel" @click="createAnnounce">
            qu xiao
          </v-button>
          <v-button key="confirm" type="primary" @click="createAnnounce">
            确 定
          </v-button>
        </v-modal>
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
                      <a href="javascript:;" class="m-r-xs">详情</a>
                      <a href="javascript:;" class="m-r-xs">编辑</a>
                      <a href="javascript:;">删除</a>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-pagination class="m-t-md m-b-md" v-model="page.value"
                    :pageSize="6"
                    :showTotal="showTotal"
                    @change="loadPage"
                    show-quick-jumper
                    :total="page.total">
      </v-pagination>
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
}
</style>
<script>
  import api from '../fetch/api'
  import AnnounceCreate from '@/components/AnnounceCreate'

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
        announceModalVisible: false
      }
    },
    components: {
      AnnounceCreate
    },
    methods: {
      showTotal(total){
        return `全部 ${total} 条`;
      },
      showCreateModal(){
        this.announceModalVisible = true;
      },
      loadPage(i){
        this._getAnnounce(i)
      },
      createAnnounce(){
        console.log('create');
        this.$refs.announceCreateRef.cleanData();
      },
      handleCancel () {
        this.announceModalVisible = false;
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
      }
    },
    created(){
      this._getAnnounce(1);
    }
  }
</script>
