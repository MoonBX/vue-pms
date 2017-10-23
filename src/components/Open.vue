<template>
  <div class="open position-right">
    <div class="g-table-banner p-v-lg p-h-md b-b">
      <v-form>
        <v-form-item label="投诉人" class="m-b-sm">
          <v-input v-model="filterList.title" placeholder="请输入投诉人姓名" style="width: 240px;"></v-input>
        </v-form-item>
        <v-form-item label="联系方式" class="m-b-sm">
          <v-input v-model="filterList.mobile" placeholder="请输入联系方式" style="width: 240px;"></v-input>
        </v-form-item>
        <v-form-item label="投诉时间" class="m-b-sm">
          <v-date-picker v-model="filterList.dateTime" range clearable></v-date-picker>
        </v-form-item>
        <v-form-item label="处理状态" class="m-b-sm">
          <v-select v-model="filterList.status" position="fixed" style="width: 120px;" :data="selectOptions" ></v-select>
        </v-form-item>
        <div class="row text-center">
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
      <div class="ant-table ant-table-large" style="width: 100%;">
        <div class="ant-table-content">
          <div class="ant-table-body">
            <div class="ant-spin-nested-loading" style="min-height: auto;">
              <div class="ant-spin-container">

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
                  <tr v-for="item in openList">
                    <td>{{item.blockName || '-'}}</td>
                    <td>{{item.deviceType || '-'}}</td>
                    <td>{{item.name || '-'}}</td>
                    <td>{{item.duration || '-'}}</td>
                    <td>{{item.unlockTime | formatDate('YMD')  || '-'}}</td>
                    <td>{{item.type || '-'}}</td>
                    <td></td>
                    <td>
                      <v-popconfirm placement="left"
                                    title="确定删除吗?"
                                    @confirm="deleteAnnounce(item.id)">
                        <a href="javascript:;" class="m-r-xs">处理</a>
                      </v-popconfirm>
                      <a href="javascript:;" class="m-r-xs"
                         @click="showModal('edit', item.id)">
                        详情
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
                    :total="page.total">
      </v-pagination>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  export default {
    data() {
      return {
        filterList:{title:"", mobile:"", dateTime: "", status: ""},
        selectOptions: [{
          value: '0',
          label: '未处理'
        }, {
          value: '2',
          label: '已处理'
        }],
        page: {total: 0, value: 1},
        openList: []
      }
    },
    methods: {
      showTotal(total){
        return `全部 ${total} 条`;
      },
      loadPage(i){
        this._getIntercom(i)
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
    },
    created() {
      this._getIntercom(1);
    }
  }
</script>
