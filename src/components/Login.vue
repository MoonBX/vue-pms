<template>
  <div class="login">
    <div style="min-width: 1200px; position: relative;height: 100%;">
      <div class="logo-text">
        <h3 style="margin-top: 10px; color: #fff; font-weight:700">Weker物业管理平台</h3>
      </div>

      <div class="foot-bg">
        <div class="foot-bg-inner"></div>
      </div>
      <div class="shan">
        <div class="tree3"></div>
        <div class="cloud4"></div>
        <div class="cloud5"></div>
      </div>
      <div class="lou">
        <div class="tree1"></div>
        <div class="tree2"></div>
        <div class="cloud1"></div>
        <div class="cloud2"></div>
        <div class="cloud3"></div>
      </div>
      <div class="tree"></div>
      <div class="login-box">
        <div class="login-banner">
          <img src="http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/logo3.png" width="70px" height="50px">
        </div>
        <form class="login-content">
          <v-input-group class="p-v-sm p-h-md">
            <v-input placeholder="请输入用户名" v-model="loginObj.userName" size="large" class="m-b-sm"></v-input>
            <v-input placeholder="请输入密码" v-model="loginObj.pwd" size="large" class="m-b-sm"></v-input>
            <div class="form-group text-center m-t-lg">
              <v-button type="primary" class="p-h-md" :loading="loading" @click="login">{{ loading ? "登录中" : "登录" }}</v-button>
            </div>
          </v-input-group>
        </form>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  html {
    height: 100%;
  }

  .ant-input-group > .ant-input:first-child, .ant-input-group-addon:first-child{
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
  }

  .ant-input-group-addon:not(:first-child):not(:last-child),
  .ant-input-group-wrap:not(:first-child):not(:last-child),
  .ant-input-group > .ant-input:not(:first-child):not(:last-child){
    border-radius: 4px;
  }

  .login {
    margin: 0;
    padding: 0;
    height: 100%;
    min-height: 600px;
  }

  .login {
    background-image: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/background_last.png');
    background-repeat: repeat;
  }

  .foot-bg {
    background-image: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/background_mid.png');
    background-repeat: repeat-y;
    /*background-size: cover;*/
    height: 200px;
    width: 100%;
    position: absolute;
    bottom: 0;
  }

  .foot-bg-inner {
    background-image: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/background3.png');
    background-repeat: no-repeat;
    background-size: cover;
    height: 120px;
    width: 100%;
    position: absolute;
    bottom: 0;
  }

  .lou {
    background-image: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/city.png');
    background-repeat: no-repeat;
    background-size: 440px 250px;
    height: 250px;
    width: 440px;
    position: absolute;
    bottom: 200px;
    left: 10%;
    /*overflow: hidden;*/
  }

  .shan {
    background-image: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/house.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position-x: 0px;
    background-position-y: -20px;
    height: 200px;
    width: 290px;
    position: absolute;
    bottom: 183px;
    right: 0px;
  }

  .tree {
    background-image: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/tree.png');
    background-repeat: no-repeat;
    background-size: 50px 160px;
    height: 160px;
    width: 50px;
    position: absolute;
    bottom: 83px;
    left: 4%;
  }

  .tree1 {
    background-image: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/tree.png');
    background-repeat: no-repeat;
    background-size: 20px 64px;
    height: 64px;
    width: 20px;
    position: absolute;
    bottom: 0px;
    right: -80px;
  }

  .tree2 {
    background-image: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/tree.png');
    background-repeat: no-repeat;
    background-size: 20px 64px;
    height: 64px;
    width: 20px;
    position: absolute;
    bottom: -10px;
    right: -60px;
  }

  .tree3 {
    background-image: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/tree.png');
    background-repeat: no-repeat;
    background-size: 30px 108px;
    height: 108px;
    width: 30px;
    position: absolute;
    bottom: -30px;
    left: -60px;
  }

  .cloud1 {
    background-image: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/cloud.png');
    background-repeat: no-repeat;
    background-size: 40px 20px;
    height: 40px;
    width: 80px;
    position: absolute;
    bottom: 180px;
    left: -20px;
    animation: moveten 2s ease .5s forwards, pulse 2s ease 2.5s infinite;;
    opacity: 0;
  }

  @keyframes moveten {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes moveten2 {
    from {
      right: -20%;
    }
    to {
      right: 25px;
    }
  }

  @keyframes pulse {
    from {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }

    50% {
      -webkit-transform: scale3d(1.05, 1.05, 1.05);
      transform: scale3d(1.05, 1.05, 1.05);
    }

    100% {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
  }

  .cloud2 {
    background-image: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/cloud.png');
    background-repeat: no-repeat;
    background-size: 60px 30px;
    height: 30px;
    width: 60px;
    position: absolute;
    bottom: 270px;
    left: 100px;
    animation: moveten 2s ease 1s forwards, pulse 2s ease 3s infinite;
    opacity: 0;
  }

  .cloud3 {
    background-image: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/cloud.png');
    background-repeat: no-repeat;
    background-size: 70px 35px;
    height: 35px;
    width: 70px;
    position: absolute;
    bottom: 215px;
    left: 285px;
    animation: moveten 2s ease 1.2s forwards, pulse 2s ease 3.2s infinite;
    opacity: 0;
  }

  .cloud4 {
    background-image: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/cloud.png');
    background-repeat: no-repeat;
    background-size: 70px 35px;
    height: 35px;
    width: 70px;
    position: absolute;
    bottom: 140px;
    right: 210px;
    animation: moveten 2s ease 2.5s forwards, pulse 2s ease 4.5s infinite;
    opacity: 0;
  }

  .cloud5 {
    background-image: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/cloud.png');
    background-repeat: no-repeat;
    background-size: 60px 30px;
    height: 30px;
    width: 60px;
    position: absolute;
    bottom: 245px;
    right: -25%;
    animation: moveten2 2s ease 2.5s forwards, pulse 2s ease 4.5s infinite;
  }

  .login-banner{
    height: 40%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column
  }

  .login-box {
    width: 230px;
    height: 330px;
    background: #fff;
    position: absolute;
    right: 20%;
    top: 12%;
    border-radius: 10px;
    box-shadow: 0 0 14px rgba(0, 0, 0, .2);
  }

  .logo-text {
    height: 40px;
    width: 220px;
    position: absolute;
    top: 25px;
    left: 18%;
  }

  .bg-user {
    background: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/male_user.png') center left no-repeat;
    background-size: 14px 14px;
    background-position-x: 6px;
  }

  .bg-key {
    background: url('http://weker.oss-cn-shanghai.aliyuncs.com/51weker_com/key.png') center left no-repeat;
    background-size: 14px 14px;
    background-position-x: 6px;
  }
</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  export default{
    name: 'login',
    data(){
      return{
        loading: false,
        loginObj: {userName: "", pwd: ""}
      }
    },
    methods: {
      login() {
        console.log(this.loginObj)
        api.Login(this.loginObj)
          .then(res => {
            console.log(res);
            if(res.success){
              localStorage.vueToken = res.data.token;
              localStorage.vueEstate = res.data.community.eatateName;
              localStorage.vueUsername = res.data.community.name;
              this.$router.push('/wk/home');
            }
          })
        .catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>
