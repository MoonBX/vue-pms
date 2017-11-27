<template>
  <div class="home position-right">
    <div class="m-sm p-v-md">
      <div class="outline-banner card-shadow">
        <div class="left" style="max-width: 18%;">
          <div class="divide"></div>
          <div class="title">{{estateName}}</div>
          <div class="address">{{userName}}</div>
        </div>
        <div class="right">
          <ul class="count-list">
            <li>
              <div class="title">单元数</div>
              <div class="count">{{statisticsList.blockNum}}</div>
            </li>
            <li>
              <div class="title">门口机数</div>
              <div class="count">{{statisticsList.deviceNum}}</div>
            </li>
            <li>
              <div class="title">总户数</div>
              <div class="count">{{statisticsList.userNum}}</div>
            </li>
            <li>
              <div class="title">App用户数</div>
              <div class="count">{{statisticsList.appNum}}</div>
            </li>
            <li>
              <div class="title">住户卡数</div>
              <div class="count">{{statisticsList.icCardNum}}</div>
            </li>
            <li>
              <div class="title">公卡数量</div>
              <div class="count">{{statisticsList.publicCardNum}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="m-h-sm">
      <div class="func-group">
        <div class="left">
          <div class="home-func card-shadow">
            <div style="border-bottom: 1px solid #ececec">
              <div class="home-title">常用功能</div>
            </div>
            <ul class="func-list clearfix">
              <li @click="skipPage('household', '1')">
                <div class="icon icon-user"></div>
                <div class="name" >添加住户</div>
              </li>
              <li @click="skipPage('household')">
                <div class="icon icon-admin"></div>
                <div class="name">住户管理</div>
              </li>
              <li @click="skipPage('common', '1')">
                <div class="icon icon-card"></div>
                <div class="name">添加公卡</div>
              </li>
              <li @click="skipPage('announce', '1')">
                <div class="icon icon-adver"></div>
                <div class="name">发布公告</div>
              </li>
            </ul>
          </div>
          <div class="home-complain card-shadow">
            <div style="border-bottom: 1px solid #ececec">
              <div class="home-title">
                投诉报修 - 未处理

                <transition name="fade">
                  <div class="message-filter" v-if="dealState.success">
                  <span>
                    <div transition="message" class="ant-message-notice" style="right: 50%;position: relative;">
                      <div class="ant-message-notice-content" >
                        <div class="ant-message-custom-content ant-message-success">
                          <i class="anticon anticon-check-circle"></i>
                          <span>消息处理成功！</span>
                        </div>
                      </div>
                    </div>
                  </span>
                  </div>
                </transition>

                <transition name="fade">
                  <div class="message-filter" v-if="dealState.fail">
                  <span>
                    <div transition="message" class="ant-message-notice" style="right: 50%;position: relative;">
                      <div class="ant-message-notice-content" >
                        <div class="ant-message-custom-content ant-message-error">
                          <i class="anticon anticon-exclamation-circle"></i>
                          <span>消息处理失败！</span>
                        </div>
                      </div>
                    </div>
                  </span>
                  </div>
                </transition>

              </div>
            </div>

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
                            <td><span>{{item.proposerName}}</span></td>
                            <td><span>{{item.gmtCreated | formatDate('YMD') }}</span></td>
                            <td><span>{{item.type_cn}}</span></td>
                            <td><span>{{item.proposerMobile}}</span></td>
                            <td><span>{{item.location}}</span></td>
                            <td>
                              <v-popconfirm placement="left" title="确定处理吗?" @confirm="confirm(item.id)">
                                <a class="m-r-xs">处理</a>
                              </v-popconfirm>
                              <a @click="showCustomTextModal(item)">
                                详情
                              </a>
                            </td>
                          </tr>
                          <div style="width: 100%;height: 20px;"></div>
                          </tbody>
                        </table>
                        <v-modal title="详情" :visible="customTextVisible" @cancel="handleCancel">
                          <home-details :single-complaint="singleComplaint" ref="homeDetailsRef"></home-details>
                          <div slot="footer">
                            <v-button key="confirm" type="primary" @click="customTextOk">
                              确 定
                            </v-button>
                          </div>
                        </v-modal>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--<v-pagination class="m-t-md" v-model="value"-->
                            <!--:pageSize="6"-->
                            <!--:showTotal="showTotal"-->
                            <!--@change="loadPage"-->
                            <!--show-quick-jumper-->
                            <!--:total="pageTotal">-->
              <!--</v-pagination>-->
            </div>
          </div>
        </div>
        <div class="right">
          <div class="home-device card-shadow clearfix">
            <div style="border-bottom: 1px solid #ececec">
              <div class="home-title">设备信息 - 异常</div>
            </div>

            <ul class="device-list">
              <li class="clearfix" v-for="item in alarmInfoList">
                <div class="info">
                  <div class="address">{{item.name}}</div>
                  <div class="time">{{item.gmtCreated | formatDate('YMD')}}</div>
                  <div class="state" v-class="{'warning': item.type == '不在线', 'danger': item.type == '防拆警报'}">{{item.type}}</div>
                </div>
                <div class="thumb-box" style="display: flex;align-items: center;">
                  <div class="thumb">
                    {{item.snapshot}}
                  </div>
                </div>

              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  import HomeDetails from '@/components/HomeDetails'
  import HouseholdCreate from '@/components/HouseholdCreate'

  import {bus} from '../util/bus'

  export default{
    name: 'home',
    data(){
      return {
        pageTotal: 0,
        value: 1,
        userName: localStorage.vueUsername,
        estateName: localStorage.vueEstate,
        complaintList: [],
        alarmInfoList: [],
        statisticsList: {},
        dealState: {success: false, fail: false},
        customTextVisible: false,
        singleComplaint: {},
        modalVisible: {household: false}
      }
    },
    components: {
      HomeDetails,
      HouseholdCreate
    },
    methods: {
      showTotal(total){
        return `全部 ${total} 条`;
      },
      loadPage(i){
        console.log(i);
        this._getComplaint(i);
      },
      confirm(id) {
        this._dealComplaint(id);
      },

      showCustomTextModal (item) {
        this.singleComplaint = item;
        this.customTextVisible = true;
      },
      skipPage(path, value){
        if(value){
          sessionStorage.setItem('from', value);
        }
        this.$router.push({path: '/wk/' + path});
      },
      customTextOk () {
        this.customTextVisible = false;
      },
      handleCancel () {
        this.customTextVisible = false;
      },
      _getComplaint(pageNo, params){
        params = {status: 0}
        api.getComplaint(pageNo, 6, params)
          .then(res => {
            console.log('投诉保修', res);
            if (res.success) {
              if (res.data.list) {
                for (var i = 0; i < res.data.list.length; i++) {
                  switch (res.data.list[i].type) {
                    case 0:
                      res.data.list[i].type_cn = '投诉';
                      break;
                    case 1:
                      res.data.list[i].type_cn = '报修';
                      break;
                    default:
                      res.data.list[i].type_cn = '';
                  }
                }
                this.pageTotal = res.data.total;
                this.complaintList = res.data.list;
              }
            }
          });
      },

      _getAlarmInfo(){
        api.getAlarmInfo()
          .then(res => {
            console.log('报警信息', res);
            this.alarmInfoList = res.data;
          });
      },

      _getStatistics(){
        api.getStatistics()
          .then(res => {
            console.log('数据信息', res);
            this.statisticsList = res.data;
          })
      },

      _dealComplaint(id){
        var timeStr = new Date().getTime();
        api.dealComplaint(id, timeStr)
          .then(res => {
            console.log('处理消息', res);
            if(res.success){
              this.dealState.success = true;
              this._getComplaint();
              setTimeout(()=>{
                this.dealState.success = false;
              }, 2000)
            }else{
              this.dealState.fail = true;
              setTimeout(()=>{
                this.dealState.fail = false;
              }, 2000)
            }
          })
      }
    },
    created(){
      document.title = '首页';
      this._getComplaint(1);
      this._getAlarmInfo();
      this._getStatistics();

      this.$message.config({
        top: 100,
        duration: 100,
      });

    }
  }
</script>

<style lang="scss" scoped>
  .home {
    .outline-banner {
      width: 100%;
      min-width: 1000px;
      height: 148px;
      padding-top: 30px;
      padding-left: 26px;
      background-color: #fff;
      background: url("../assets/home_bg.png") no-repeat center center;

      .left {
        float: left;
        margin-right: 120px;

        .divide {
          border-bottom: 2px solid #4E85DE;
          width: 28px;
          margin-bottom: 8px;
        }

        .title {
          color: #4E85DE;
          margin-bottom: 26px;
        }

        .address {
          color: #1C1C1C;
          font-size: 20px;
          font-weight: 900;
        }
      }

      .right {

        .count-list {
          list-style: none;
          margin-top: 26px;

          li {
            float: left;
            width: 106px;
            height: 36px;
            border-left: 1px solid #646464;
            padding-left: 20px;

            .title {
              font-size: 14px;
              color: #4E85DE;
              margin-top: -5px;
            }

            .count {
              font-size: 24px;
              font-weight: 600;
            }
          }
        }
      }
    }

    .func-group {
      display: flex;

      .left {
        width: 67%;
        height: 694px;
        margin-right: 2%;
        display: flex;
        flex-direction: column;

        .home-func {
          width: 100%;
          height: 176px;
          background: #fff;
          margin-bottom: 20px;

          .func-list {
            list-style: none;
            padding: 0;
            margin-top: 10px;
            margin-bottom: 10px;
            margin-left: 38px;

            li {
              float: left;
              margin-right: 60px;
              cursor: pointer;
              padding: 10px;
              transition: 0.2s linear;

              &:hover {
                background: #F0F6FF;
              }

              .icon {
                width: 40px;
                height: 40px;
                margin: 0 auto 12px;
              }

              .icon-user {
                background: url("../assets/adduser.png") no-repeat center center;
              }

              .icon-admin {
                background: url("../assets/administration_user.png") no-repeat center center;
              }

              .icon-card {
                background: url("../assets/addcard.png") no-repeat center center;
              }

              .icon-adver {
                background: url("../assets/advertise.png") no-repeat center center;
              }

              .name {
                font-size: 15px;
                text-align: center;
                color: #4E85DE;
              }
            }
          }
        }

        .home-complain {
          width: 100%;
          min-height: 514px;
          background: #fff;
          margin-bottom: 20px;

        }

      }

      .right {
        width: 31%;
        min-height: 510px;

        .home-device {
          width: 100%;
          height: 100%;
          background: #fff;

          .device-list {
            list-style: none;
            margin: 0;
            margin-top: 4px;
            padding: 0;

            li {
              width: 100%;
              height: auto;
              display: flex;
              justify-content: space-between;
              background: #F0F6FF;
              margin-bottom: 8px;

              .info {
                margin: 12px;
                width: 140px;
                max-width: 140px;
                font-size: 14px;
                color: #1C1C1C;

                .address {
                  margin-bottom: 2px;
                  word-break: break-all;
                  word-wrap: break-word;
                }

                .time {
                  margin-bottom: 15px;
                }
              }

              .thumb {
                margin: 8px 12px 8px 0;
                width: 120px;
                height: 84px;
                background: url("../assets/mingpian.png") no-repeat center center;
              }
            }
          }
        }
      }

      .left, .right {
        .home-title {
          position: relative;
          margin: 16px;
          font-size: 14px;
          padding-left: 8px;
          border-left: 2px solid #4E85DE;
          color: #1C1C1C;
          line-height: 14px;
        }
      }
    }
  }

  .position-right {
    background-color: #ececec;
  }

  .message-filter{
    font-size: 12px;
    position: relative;
    z-index: 1010;
    float: right;
    top: -8px;
    right: 0;
  }

  .message-notice-filter {
    width: auto;
    vertical-align: middle;
    position: relative;
    right: -50%;
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
