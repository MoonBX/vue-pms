<template>
  <div class="hello">
    <div class="g-modal">
      <v-modal title="劫持报警信息"
               :visible="modalVisible.create"
               :width="400"
               :maskClosable="false"
               @cancel="handleCancel('create')">
        <jcbj ref="jcbjRef" :item="jcObj"></jcbj>
        <div slot="footer">
          <v-button key="cancel"
                    type="primary"
                    @click="handleCancel('create')">
            确 定
          </v-button>
        </div>
      </v-modal>
    </div>

    <v-layout>
      <v-header class="box-shadow">
        {{title}}
        <v-dropdown :data="dropdown" trigger="click" class="pull-right" @item-click="dropdownClick" position="fixed">
          <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
            {{userName}}
            <v-icon type="down" class="m-l-xs"></v-icon>
          </a>
        </v-dropdown>
      </v-header>
      <v-layout>
        <v-sider style="flex: 0 0 230;width: 230px;position:fixed; height: 100%">
          <div class="sdn-brand">
            <img class="brand-img" src="http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/logo3.png" width="27%">
            <div class="brand-text text-lt">Weker物业管理平台</div>
          </div>
          <v-menu style="width:230px;background-color:#0c1729" mode="inline" :data="themeMenuData" :theme="theme"
                  selected>
            <template scope="{data}">
              <i v-if="data.icon" :class="'fa fa-' + data.icon"></i>
              <router-link style="margin-left: 5px;display: inline" :to="{path: data.href}">{{data.name}}</router-link>
            </template>
            <template scope="{data}" slot="sub">
              <i v-if="data.icon" :class="'fa fa-' + data.icon"></i>
              <span style="margin-left: 5px">{{data.name}}</span>
            </template>
          </v-menu>
        </v-sider>
        <v-content>
          <router-view></router-view>
        </v-content>
      </v-layout>
    </v-layout>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from '../fetch/api'
  import { bus } from '../util/bus.js'
  import jcbj from '@/components/jcbj'

  export default {
    name: 'hello',
    data () {
      return {
        userName: localStorage.vueUsername,
        theme: 'dark',
        themeMenuData: [],
        title: '',
        dropdown: [
          {content: '退出登录'}
        ],
        socket: null,
        modalVisible: {create: false, edit: false, detail: false},
        jcObj: {},
        jcObj2: {}
      }
    },
    components: {
      jcbj
    },
    methods: {
      fetchTitle(){
        this.title = this.$route.name;
      },
      dropdownClick(data){
        if(data.content == '退出登录'){
          this.logout();
        }
      },
      showModal(value, param){
        this.jcObj = param;
        this.modalVisible[value] = true;
      },
      handleCancel (value) {
        this.modalVisible[value] = false;
      },
      logout(){
        api.Logout()
          .then(res => {
            console.log('登出:', res);
            localStorage.removeItem('vueToken');
            localStorage.removeItem('vueUsername');
            localStorage.removeItem('vueEstate');
            localStorage.removeItem('vueCommunityId');
            this.$router.push('/login');
            this.socket.close();
            this.$notification.close('1')
          })
          .catch(error => {
            console.log(error)
          })
      },
      jcbjHandle(){
        this.modalVisible.create = false;
      },
      send(message, callback) {
        var that = this;
        this.waitForConnection(function () {
          that.socket.send(message);
          if (typeof callback !== 'undefined') {
            callback();
          }
        }, 1000);
      },
      waitForConnection(callback, interval) {
        if (this.socket.readyState === 1) {
          clearTimeout(t)
          callback();
        } else {
          // optional: implement backoff for interval here
          var t = setTimeout(() => {
            this.waitForConnection(callback, interval);
          }, interval);
        }
      },
      add0(m){return m<10?'0'+m:m },
      format(shijianchuo) {
        var time = new Date(parseInt(shijianchuo));
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
      }
  },
    created(){
      this.title = this.$route.name;
      var routePath = this.$route.path.split('/')[2];
      var data = [
        {name: '首页',  icon: 'home', href: 'home'},
        { name: '物业中心', icon: 'building', children: [
          {name: "公告管理", href: 'announce'},
          {name: "投诉", href: 'complain'},
          {name: "维修", href: 'repair'}]
        },
        {name: '设备管理', icon: 'cog', href: 'device'},
        {name: '门禁管理', icon: 'unlock-alt', children: [
          {name: "住户管理", href: 'household'},
          {name: "公卡管理", href: 'common'}]
        },
        {name: '日志管理', icon: 'file-text-o', children: [
          {name: "开门日志", href: 'open'},
          {name: "防拆日志", href: 'remove'},
          {name: "劫持报警日志", href: 'hijack'}]
        }
      ];
      for (let i = 0; i < data.length; i++) {
        if (data[i].href == routePath) {
          data[i].selected = true;
        } else {
          if (data[i].children) {
            for (let j = 0; j < data[i].children.length; j++) {
              if (data[i].children[j].href == routePath) {
                data[i].children[j].selected = true;
                data[i].expand = true;
              }
            }
          }
        }
      }
      this.themeMenuData = data;

      this.socket = new WebSocket('ws://192.168.23.241:8081/websocket');
      console.log(this.socket )
      this.send(localStorage.vueCommunityId);

      this.socket.onopen = function() {
        console.log('open');
      }

      this.socket.onmessage = (evt) => {
        if(evt.data){
          let arr = evt.data.split('/');
          let obj = {
            id: arr[0],
            address: arr[2]
          };
          obj.time = this.format(arr[1]);
          this.$notification.error({
            message: '劫持报警',
            description: obj.time + ': ' + obj.address + "住户智能门锁发出劫持报警事件，请尽快前往处理！",
            duration: 0,
            selfKey: '1',
            onClose: ()=>{
              this.showModal('create', obj)
            }
          });
        }

      };

      this.socket.onclose = function(e) {
        console.log(e)
      };

    },
    watch: {
      $route(){
        this.fetchTitle();
        var routePath = this.$route.path.split('/')[2];
        var data = [
          {name: '首页',  icon: 'home', href: 'home'},
          { name: '物业中心', icon: 'building', children: [
            {name: "公告管理", href: 'announce'},
            {name: "投诉", href: 'complain'},
            {name: "维修", href: 'repair'}]
          },
          {name: '设备管理', icon: 'cog', href: 'device'},
          {name: '门禁管理', icon: 'unlock-alt', children: [
            {name: "住户管理", href: 'household'},
            {name: "公卡管理", href: 'common'}]
          },
          {name: '日志管理', icon: 'file-text-o', children: [
            {name: "开门日志", href: 'open'},
            {name: "防拆日志", href: 'remove'},
            {name: "劫持报警日志", href: 'hijack'}]
          }
        ];
        for (let i = 0; i < data.length; i++) {
          if (data[i].href == routePath) {
            data[i].selected = true;
          } else {
            if (data[i].children) {
              for (let j = 0; j < data[i].children.length; j++) {
                if (data[i].children[j].href == routePath) {
                  data[i].children[j].selected = true;
                  data[i].expand = true;
                }
              }
            }
          }
        }
        this.themeMenuData = data;
      }
    },
    beforeRouteLeave (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        console.log(vm.$data.socket.close())
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .hello {
    .box-shadow {
      -webkit-box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    height: 100%;
    margin-bottom: 20px;
    .ant-layout {
      height: 100%;
      .ant-layout-header {
        position: fixed;
        top: 0;
        height: 50px;
        width: 100%;
        background-color: #fff;
        padding-left: 240px;
        padding-right: 20px;
        line-height: 50px;
        z-index: 999;
      }
      .ant-layout-sider {
        background-color: #0c1729;
        padding-top: 40px;
        overflow-y: auto;
        z-index: 1000;
        .sdn-brand {
          text-align: center;
          margin-bottom: 40px;
          .brand-img {
            margin-bottom: 8px;
          }
          .brand-text {
            color: #ffffff;
            font-weight: 700;
            font-size: 15px;
          }
        }
      }
      .ant-layout-content {
        margin-top: 50px;
        width: auto;
        padding-left: 230px;
      }
    }
  }
</style>
