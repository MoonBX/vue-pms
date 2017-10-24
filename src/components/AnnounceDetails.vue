<template>
  <div>
    <div class="detail-box">
      <v-row :gutter="16">
        <v-col class="gutter-row" span="24">
          <span class="title m-r-lg" style="line-height: 27px;">{{item.title}}</span>
          <span class="badge bg-success">{{item.status}}</span>
          <span></span>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .detail-box{
    .title{
      font-size: 18px;
    }
    .badge{
      padding: 0px 10px;
      border-radius: 20px;
    }
  }
</style>
<script type="text/ecmascript-6">
  export default{
    data(){
      return{
      }
    },
    methods: {},
    props: ['item'],
    created(){
      console.log(this.item)
    }
  }
</script>
