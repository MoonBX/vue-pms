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
</style>
