<template>
  <div class="hello">
    <v-layout>
      <v-header>
        {{title}}
        <v-dropdown :data="data" trigger="click" class="pull-right">
          <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
            Click me <v-icon type="down"></v-icon>
          </a>
        </v-dropdown>
      </v-header>
      <v-layout>
        <v-sider style="flex: 0 0 230;width: 230px;position:fixed; height: 100%">
          <div class="sdn-brand">
            <img class="brand-img" src="../assets/logo.png" width="27%">
            <div class="brand-text text-lt">Weker物业管理平台</div>
          </div>
          <v-menu style="width:230px;background-color:#0c1729" mode="inline" :data="themeMenuData" :theme="theme" selected>
            <template scope="{data}">
              <i v-if="data.icon" :class="'fa fa-' + data.icon"></i>
              <router-link style="margin-left: 5px;display: inline" :to="{path: data.path}" >{{data.name}}</router-link>
            </template>
            <template scope="{data}" slot="sub">
              <i v-if="data.icon" :class="'fa fa-' + data.icon"></i>
              <span style="margin-left: 5px">{{data.name}}</span>
            </template>
          </v-menu>
        </v-sider>
        <v-content>
          <div class="position-right">
            <router-view></router-view>
          </div>
        </v-content>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        theme: 'dark',
        themeMenuData: [
          {name: '首页', path: 'home', icon: 'home'},
          {
            name: '物业中心', icon: 'building', children: [
            {name: "公告管理", path: 'announce'},
            {name: "投诉", path: 'complain'},
            {name: "维修", path: 'repair'}
          ]
          },
          {name: '设备管理', icon: 'cog'},
          {
            name: '门禁管理', icon: 'unlock-alt', children: [
            {name: "住户管理"},
            {name: "公卡管理"}
          ]
          },
          {
            name: '日志管理', icon: 'file-text-o', children: [
            {name: "开门日志"},
            {name: "防拆日志"}
          ]
          }
        ],
        title: ''
      }
    },
    methods: {
      fetchTitle(){
        this.title = this.$route.name;
      }
    },
    created(){
      this.title = this.$route.name;
      var routePath = this.$route.path.split('/')[2];
      for(let i=0;i<this.themeMenuData.length; i++){
        if(this.themeMenuData[i].path == routePath){
          this.themeMenuData[i].selected = true;
        }else{
          if(this.themeMenuData[i].children){
            for(let j=0;j<this.themeMenuData[i].children.length;j++){
              if(this.themeMenuData[i].children[j].path == routePath){
                this.themeMenuData[i].children[j].selected = true;
                this.themeMenuData[i].expand = true;
              }
            }
          }
        }
      }
    },
    watch: {
//      "$route": "fetchTitle"
      $route(){
        this.fetchTitle()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .hello {
    height: 100%;
    .ant-layout {
      height: 100%;
      .ant-layout-header{
        position: fixed;
        top: 0;
        height: 50px;
        width: 100%;
        background-color: #fff;
        padding-left: 240px;
        line-height: 50px;
      }
      .ant-layout-sider{
        background-color: #0c1729;
        padding-top: 40px;
        overflow-y: auto;
        .sdn-brand {
          text-align: center;
          margin-bottom: 40px;
          .brand-img {
            margin-bottom: 8px;
          }
          .brand-text {
            color: #ffffff;
            font-weight: 700;
          }
        }
      }
      .ant-layout-content{
        margin-top: 50px;
        width: auto;
        padding-left: 230px;
        .position-right{
          margin: 15px;
          background: #fff;
          min-height: 500px;
        }
      }
    }
  }



</style>
