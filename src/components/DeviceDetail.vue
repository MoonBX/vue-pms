<template>
  <div>
    <div class="detail-box">
      <v-row class="p-b-sm b-b">
        <span class="title m-r-sm">{{item.blockName}}</span>
        <span class="state badge bg-success">{{item.status_cn}}</span>
      </v-row>
    </div>
    <div class="other-box m-t-md">
      <v-row class="m-b-sm">
        <span class="title">设备类型:</span>
        <span class="value">{{item.type}}</span>
        <span class="title">锁具类型:</span>
        <span class="value">{{item.lockType_cn}}</span>
      </v-row>
      <v-row class="m-b-sm">
        <span class="title">安装时间:</span>
        <span class="value">{{item.gmtCreated | formatDate('YMD')}}</span>
        <span class="title">用户人数:</span>
        <span class="value">{{item.amount}}</span>
      </v-row>
      <v-row class="m-b-sm">
        <span class="title">设备SN:</span>
        <span class="value">{{item.sn}}</span>
      </v-row>
      <v-row class="m-b-sm">
        <span class="title">版本信息:</span>
        <span class="value">{{item.apkVersion}}</span>
      </v-row>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        detailList: {}
      }
    },
    methods: {},
    props:['item'],
    created() {}
  }
</script>
