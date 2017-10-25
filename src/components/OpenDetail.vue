<template>
  <div>
    <div class="detail-box">
      <v-row class="m-b-sm p-b-sm b-b">
        <span class="title">{{item.blockName}}</span>
      </v-row>
    </div>
    <div class="other-box">
      <v-row class="m-b-xs">
        <span class="title">设备类型:</span>
        <span class="value">{{item.deviceType}}</span>
        <span class="title">日志类型:</span>
        <span class="value">{{item.type}}</span>
      </v-row>
      <v-row class="m-b-xs">
        <span class="title">姓名:</span>
        <span class="value">{{item.name}}</span>
        <span class="title">手机号码:</span>
        <span class="value">{{item.mobile}}</span>
      </v-row>
      <v-row class="m-b-xs">
        <span class="title">通话时长:</span>
        <span class="value">{{item.duration}}</span>
      </v-row>
      <v-row class="m-b-xs">
        <span class="title">开门时间:</span>
        <span class="value">{{item.unlockTime | formatDate('YMDHMS')}}</span>
      </v-row>
      <!--<v-row class="m-b-xs">-->
        <!--<span class="title pull-left">缩略图:</span>-->
        <!--<div class="value pull-left">-->
          <!--<img ng-src="{{item.snapshot}}" alt="..." style="width: 300px;">-->
        <!--</div>-->
      <!--</v-row>-->
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script type="text/ecmascript-6">
  export default {
    data() {
      return {}
    },
    methods: {},
    props:['item'],
    created() {
      console.log(this.item)
    }
  }
</script>
