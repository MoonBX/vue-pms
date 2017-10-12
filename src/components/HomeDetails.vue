<template>
  <div class="home-detail main-info">
    <div class="row m-b-sm">
      <span class="title">{{singleComplaint.proposerName}}</span>
      <span class="phone">{{singleComplaint.proposerMobile}}</span>
      <span class="date pull-right" style="width: 180px;">投诉时间：{{singleComplaint.gmtCreated}}</span>
    </div>
    <div class="row m-b-sm">
      <span class="address">{{singleComplaint.location}}</span>
      <span class="pull-right text-primary" style="width: 180px;">处理时间：{{singleComplaint.processTime}}</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
  export default{
    props: ['singleComplaint'],
    methods: {
      show(){
        console.log(this.singleComplaint)
      }
    }
  }
</script>
