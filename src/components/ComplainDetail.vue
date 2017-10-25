<template>
  <div>
    <div class="main-box">
      <div class="row m-b-sm">
        <span class="title">{{detailList.proposerName}}</span>
        <span class="phone">{{detailList.proposerMobile}}</span>
        <span class="date pull-right" style="width: 180px;">投诉时间：{{detailList.gmtCreated | formatDate('YMD')}}</span>
      </div>
      <div class="row m-b-sm">
        <span class="address">{{detailList.location}}</span>
        <span class="pull-right text-primary" style="width: 180px;">处理时间：{{detailList.processTime | formatDate('YMD')}}</span>
      </div>
    </div>
    <div class="other-box">
      <v-row class="m-b-md">
        <div class="pull-left word-break" style="position: relative;">
          {{detailList.content}}
          <img v-if="detailList.status == '已处理'&&!detailList.snapshotArr.length"
               src="../assets/finish.png" alt="..."
               style="width: 100px;">
        </div>
      </v-row>
      <v-row>
        <div class="pull-left" style="position: relative;">
          <img :src="item" alt="..." class="m-r-md cursor-pointer" width="106" height="106" v-for="item in detailList.snapshotArr">
          <img v-if="detailList.status == '已处理'&&detailList.snapshotArr.length"
               src="../assets/finish.png" alt="..."
               style="position: absolute;top: 23px;right: -43px;width: 100px;">
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
        detailList: {}
      }
    },
    props: ['id'],
    methods: {},
    created() {
      api.getComplaintDetail(this.id)
        .then(res => {
          console.log(res);
          switch (res.data.status) {
            case 0:
              res.data.status = '未处理';
              break;
            case 1:
              res.data.status = '处理中';
              break;
            case 2:
              res.data.status = '已处理';
              break;
            default:
              res.data.status = '';
          }
          this.detailList = res.data;
          this.detailList.snapshotArr = this.detailList.snapshot.split(';');
          if(this.detailList.snapshotArr[this.detailList.snapshotArr.length-1] == ""){
            this.detailList.snapshotArr.splice(this.detailList.snapshotArr.length-1, 1)
          }
        })
    }
  }
</script>
