<template>
  <div id="app">
    <div id="all">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data(){
      return{
        isLogin: false
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

<style>
  html, body, #all {
    height: 100%;
    background-color: #ececec;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
  }

  .g-table-banner{
    background: #F1F6FF;
  }
  .g-table-content{
    padding-bottom: 15px;
  }


  .ant-input:focus {
    border-color: #49a9ee;
    outline: 0;
     box-shadow: 0 0 0 0px rgba(16, 142, 233, 0.2);
  }

  .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 16px 8px;
    word-break: break-all;
    white-space: normal;
  }

  .ant-menu-dark .ant-menu-inline.ant-menu-sub{
    background-color: #06101F;
    color: #7f8ea7;
  }

  .ant-dropdown-menu{
    left: -15px !important;
  }
  .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title{
    padding: 7px 12px;
  }

  .position-right {
    margin: 15px;
    background: #fff;
    min-height: 500px;
  }

  /*select tree start*/
  /*.ant-select-dropdown{*/
    /*top:29px !important;*/
    /*min-width: 273px !important;*/
  /*}*/
  /*form .has-feedback > .ant-select .ant-select-arrow{*/
    /*right:8px !important;*/
  /*}*/
  /*.ant-select-search__field__placeholder{*/
    /*padding-left: 0 !important;*/
  /*}*/
  /*.ant-select-open .ant-select-selection {*/
    /*box-shadow: 0 0 0 0px rgba(16, 142, 233, 0.2);*/
  /*}*/
  /*select tree end*/
</style>
