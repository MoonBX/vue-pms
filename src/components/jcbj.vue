<template>
  <div>
    <div class="other-box">
      <v-row class="m-b-xs">
        <div class="pull-left">
          <span class="title">报警时间:</span>
          <span class="value">{{hijackObj.time | formatDate('YMDHMS')}}</span>
        </div>
      </v-row>
      <v-row class="m-b-xs">
        <div class="pull-left">
          <span class="title">地址:</span>
          <span class="value">{{hijackObj.address}}</span>
        </div>
      </v-row>
      <v-row class="m-b-xs">
        <div class="pull-left">
          <span class="title">户主姓名:</span>
          <span class="value">{{hijackObj.userName}}</span>
        </div>
      </v-row>
      <v-row class="m-b-md">
        <div class="pull-left">
          <span class="title">手机号码:</span>
          <span class="value">{{hijackObj.mobile}}</span>
        </div>
      </v-row>
      <v-row class="m-b-xs text-center">
        <div class="" style="font-size: 13px">
          {{hijackObj.userName}}发出劫持报警事件，请务必尽快处理！
        </div>
      </v-row>
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
        hijackObj:{}
      }
    },
    props: [
      'item'
    ],
    methods: {},
    created() {
      console.log(this.item);
      api.getSingleHijack(this.item.id).then(res=>{
        console.log(res)
        this.hijackObj = {
          userName:res.data.userName,
          mobile: res.data.mobile,
          time: res.data.alarmTime,
          address: res.data.address
        }
      })
    }
  }
</script>
