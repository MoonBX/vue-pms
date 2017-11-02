<template>
  <div id="app">
    <div id="all">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import {bus} from './util/bus'
  export default {
    name: 'app',
    data(){
      return{
        isLogin: false,
        websocket: null
      }
    },
    created(){
      if(localStorage.vueToken){
        this.isLogin = true;
      }else{
        this.isLogin = false;
        this.$router.push('/login');
      }
    }
  }
</script>

<style lang="scss">
  html, body, #all {
    height: 100% !important;
    background-color: #ececec !important;
  }

  body{
    font-family: "arial" !important;
    font-size: 13px;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    line-height: 1.42857143 !important;
    color: #777 !important;
    background-color: transparent !important;
  }

  #app {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    color: #2c3e50;
    height: 100%;
  }

  .g-table-banner{
    background: #F1F6FF;
  }
  .g-table-content{
    padding-bottom: 15px;
  }

  .ant-menu-submenu{
    font-size: 13px !important;
  }
  .ant-menu-item{
    font-size: 13px !important;
  }
  .ant-menu-vertical .ant-menu-item, .ant-menu-inline .ant-menu-item, .ant-menu-vertical .ant-menu-submenu-title, .ant-menu-inline .ant-menu-submenu-title{
    font-size: 13px !important;
  }
  label{
    font-size: 13px !important;
  }
  .ant-input{
    font-size: 13px !important;
  }


  .ant-input:focus {
    border-color: #49a9ee !important;
    outline: 0 !important;
     box-shadow: 0 0 0 0px rgba(16, 142, 233, 0.2) !important;
  }

  .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    font-size: 13px !important;
    padding: 14px 8px !important;
    word-break: break-all !important;
    white-space: normal !important;
  }

  .ant-menu-dark .ant-menu-inline.ant-menu-sub{
    background-color: #06101F !important;
    color: #7f8ea7 !important;
  }

  .ant-dropdown-menu{
    left: 0 !important;
  }
  .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title{
    padding: 7px 12px !important;
  }

  .position-right {
    margin: 15px;
    background: #fff;
    min-height: 500px;
  }

  .detail-box{
    font-size: 14px;
    .title{
      font-size: 18px;
    }
    .badge{
      padding: 0px 10px;
      border-radius: 20px;
      position: relative;
      top: -2px;
      font-size: 12px;
    }
    .p-b-sm{
      padding-bottom: 10px;
    }
  }

  .main-box{
    border-bottom: 1px solid #d8d8d8;
    margin-bottom: 15px;
    .title, .phone{
      font-size: 18px;
      color: #333333;
      margin-right: 30px;
    }
    .state{
      position: relative;
      top: -2px;
      padding:3px 13px;
    }
    .address{
      font-size: 14px;
      color: #666666;
    }
    .date{
      line-height: 25px;
    }
  }

  .other-box{
    font-size: 14px;
    .title{
      margin-right: 10px;
      display: inline-block;
      width: 70px;
      text-align: right;
      color: #999999;
    }
    .value{
      color: #666666;
      width: 165px;
      display: inline-block;
    }
  }

  .ant-notification{
    width: 275px !important;
  }
  .ant-notification-notice-message{
    font-size: 14px !important;
    position: relative !important;
    top: 2px !important;
    margin-left: 36px !important;
  }
  .ant-notification-notice-icon{
    font-size: 24px !important;
  }
  .ant-notification-notice-with-icon .ant-notification-notice-description {
    margin-left: 36px !important;
    font-size: 12px !important;
  }

  form .has-feedback > .ant-select .ant-select-arrow, form .has-feedback > .ant-select .ant-select-selection__clear, form .has-feedback :not(.ant-input-group-addon) > .ant-select .ant-select-arrow, form .has-feedback :not(.ant-input-group-addon) > .ant-select .ant-select-selection__clear {
     right: 6px !important;
  }

  .ant-more-panel {
    font-size: 12px;
    padding: 30px 15px !important;
    border: none !important;
    border-bottom: 1px solid #e9e9e9 !important;
  }

  form .has-feedback .ant-calendar-picker-icon, form .has-feedback .ant-calendar-picker-clear {
    right: 8px !important;
  }

</style>
