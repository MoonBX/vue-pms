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
</style>
