<template>
  <div class="home position-right">
    <div class="m-sm p-v-md">
      <div class="outline-banner card-shadow">
        <div class="left" style="max-width: 18%;">
          <div class="divide"></div>
          <div class="title">homeVm.estateName</div>
          <div class="address">homeVm.userName</div>
        </div>
        <div class="right">
          <ul class="count-list">
            <li>
              <div class="title">单元数</div>
              <div class="count">100</div>
            </li>
            <li>
              <div class="title">门口机数</div>
              <div class="count">100</div>
            </li>
            <li>
              <div class="title">总户数</div>
              <div class="count">100</div>
            </li>
            <li>
              <div class="title">App用户数</div>
              <div class="count">100</div>
            </li>
            <li>
              <div class="title">住户卡数</div>
              <div class="count">100</div>
            </li>
            <li>
              <div class="title">公卡数量</div>
              <div class="count">100</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="m-h-sm">
      <div class="func-group">
        <div class="left">
          <div class="home-func card-shadow">
            <div class="home-title">常用功能</div>
            <ul class="func-list clearfix">
              <li>
                <div class="icon icon-user"></div>
                <div class="name">添加住户</div>
              </li>
              <li>
                <div class="icon icon-admin"></div>
                <div class="name">住户管理</div>
              </li>
              <li>
                <div class="icon icon-card"></div>
                <div class="name">添加公卡</div>
              </li>
              <li>
                <div class="icon icon-adver"></div>
                <div class="name">发布公告</div>
              </li>
            </ul>
          </div>
          <div class="home-complain card-shadow">
            <div class="home-title">投诉报修 - 未处理</div>
            <div class="g-table-content m-t-md m-h-md">
              <div class="ant-table ant-table-large">
                <div class="ant-table-content">
                  <div class="ant-table-body">
                    <div class="ant-spin-nested-loading" style="min-height: auto;">
                      <div class="ant-spin-container">
                        <table>
                          <thead class="ant-table-thead">
                          <tr>
                            <th><strong>姓名</strong></th>
                            <th><strong>时间</strong></th>
                            <th><strong>类型</strong></th>
                            <th><strong>联系方式</strong></th>
                            <th><strong>地址</strong></th>
                            <th><strong>操作</strong></th>
                          </tr>
                          </thead>
                          <tbody class="ant-table-tbody" >
                          <tr v-for="item in complaintList">
                            <td>
                              <span>{{item.proposerName}}</span>
                            </td>
                            <td>
                              <span>{{item.gmtCreated | date: 'yyyy-MM-dd'}}</span>
                            </td>
                            <td>
                              <span>0</span>
                            </td>
                            <td>
                              <span>15958143182</span>
                            </td>
                            <td>
                              <span>分区二2幢1单元401</span>
                            </td>
                            <td>
                              <a href="javascript:;">处理</a>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <v-pagination class="m-t-md" v-model="value"
                            :pageSize="6"
                            :showTotal="showTotal"
                            @change="loadPage"
                            show-quick-jumper
                            :total="pageTotal">
              </v-pagination>
            </div>
          </div>
        </div>
        <div class="right"></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .home {
  }

  .position-right {
    background-color: #ececec;
  }

  .outline-banner {
    width: 100%;
    min-width: 1000px;
    height: 148px;
    padding-top: 30px;
    padding-left: 26px;
    background-color: #fff;
    background: url("../assets/home_bg.png") no-repeat center center;
  }

  .outline-banner .left {
    float: left;
    margin-right: 120px;
  }

  .outline-banner .left .divide {
    border-bottom: 2px solid #4E85DE;
    width: 28px;
    margin-bottom: 8px;
  }

  .outline-banner .left .title {
    color: #4E85DE;
    margin-bottom: 26px;
  }

  .outline-banner .left .address {
    color: #1C1C1C;
    font-size: 20px;
    font-weight: 900;
  }

  .outline-banner .right .count-list {
    list-style: none;
    margin-top: 26px;
  }

  .outline-banner .right .count-list li {
    float: left;
    width: 106px;
    height: 36px;
    border-left: 1px solid #646464;
    padding-left: 20px;
  }

  .outline-banner .right .count-list li .title {
    font-size: 14px;
    color: #4E85DE;
    margin-top: -5px;
  }

  .outline-banner .right .count-list li .count {
    font-size: 24px;
    font-weight: 600;
  }

  .func-group {
    display: flex;
  }

  .func-group .left {
    width: 67%;
    height: 510px;
    margin-right: 2%;
    display: flex;
    flex-direction: column;
  }

  .func-group .left .home-func {
    width: 100%;
    height: 176px;
    background: #fff;
    margin-bottom: 20px;
  }

  .home-title {
    position: relative;
    margin: 16px;
    font-size: 14px;
    padding-left: 8px;
    border-left: 2px solid #4E85DE;
    color: #1C1C1C;
    line-height: 14px;
  }

  .func-group .left .home-func .func-list {
    list-style: none;
    padding: 0;
    margin-top: 20px;
    margin-left: 68px;
  }

  .func-group .left .home-func .func-list li {
    float: left;
    margin-right: 60px;
    cursor: pointer;
    padding: 10px;
    transition: 0.2s linear;
  }

  .func-group .left .home-func .func-list li:hover {
    background: #F0F6FF;
  }

  .func-group .left .home-func .func-list li .icon {
    width: 40px;
    height: 40px;
    margin: 0 auto 12px;
  }

  .func-group .left .home-func .func-list li .icon-user {
    background: url("../assets/adduser.png") no-repeat center center;
  }

  .func-group .left .home-func .func-list li .icon-admin {
    background: url("../assets/administration_user.png") no-repeat center center;
  }

  .func-group .left .home-func .func-list li .icon-card {
    background: url("../assets/addcard.png") no-repeat center center;
  }

  .func-group .left .home-func .func-list li .icon-adver {
    background: url("../assets/advertise.png") no-repeat center center;
  }

  .func-group .left .home-func .func-list li .name {
    font-size: 15px;
    text-align: center;
    color: #4E85DE;
  }

  .func-group .left .home-complain {
    width: 100%;
    min-height: 494px;
    background: #fff;
    margin-bottom: 20px;
  }

  .func-group .right {
    width: 31%;
    min-height: 510px;
  }

  .func-group .right .home-device {
    width: 100%;
    height: 100%;
    background: #fff;
  }

  .func-group .right .home-device .device-list {
    list-style: none;
    margin: 0;
    margin-top: 4px;
    padding: 0;
  }

  .func-group .right .home-device .device-list li {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    background: #F0F6FF;
    margin-bottom: 8px;

  }

  .func-group .right .home-device .device-list li .info {
    margin: 12px;
    width: 140px;
    max-width: 140px;
    font-size: 14px;
    color: #1C1C1C;
  }

  .func-group .right .home-device .device-list li .info .address {
    margin-bottom: 2px;
    word-break: break-all;
    word-wrap: break-word;
  }

  .func-group .right .home-device .device-list li .info .time {
    margin-bottom: 15px;
  }

  .func-group .right .home-device .device-list li .thumb {
    margin: 8px 12px 8px 0;
    width: 120px;
    height: 84px;
    background: url("../assets/mingpian.png") no-repeat center center;
  }

  .unline {
    background: #DE4E4E;
    display: inline;
    color: #fff;
    padding: 2px 6px;
    font-size: 13px;
  }

  .state {
    display: inline;
    color: #fff;
    padding: 2px 6px;
    font-size: 13px;
  }

  .warning {
    background: #F4B33E;
  }

  .danger {
    background: #DE4E4E;
  }

  .card-shadow {
    box-shadow: 0 0 4px 0 rgba(155, 185, 235, 0.30);
  }
</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  import axios from 'axios'

  export default{
    name: 'home',
    data(){
      return {
        pageTotal: 0,
        value: 1,
        complaintList:{}
      }
    },
    methods: {
      showTotal(total){
        return `全部 ${total} 条`;
      }
    },
    created(){
      api.getComplaint(1, 6)
        .then(res => {
          console.log(res);
          this.pageTotal = res.data.total;
          this.complaintList = res.data.list;
        })
    }
  }
</script>
