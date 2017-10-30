<template>
  <div>
    <div class="wrap-box m-v-sm clearfix" v-for="item in detailList.partitions">
      <div class="left">
        {{item.name}}
      </div>
      <div class="right">
        <ul class="list">
          <li>
            <span class="title">围墙机:</span>
            <span class="m-r-sm" v-for="item_f in item.fenceLocations">{{item_f.name}}</span>
          </li>
          <li v-for="(item_b, index) in item.blockDevices">
            <span class="title">{{item_b.name}}:</span>
            <span class="m-r-sm" v-for="item_u in item.blockDevices[index].units">{{item_u.name}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .wrap-box{
    font-size: 14px;
    .left{
      padding-right: 16px;
      width: 120px;
      float: left;
    }
    .right{
      border-left: 1px solid #999999;
      padding-left: 22px;
      overflow: auto;
      /*左侧固定, 右侧自适应, overflow要设置*/
      ul.list{
        list-style: none;
        margin: 0;
        padding: 0;
        li{
          padding: 10px 0;
          border-bottom: 1px solid #f1f1f1;
          color: #666666;
          span.title{
            display: inline-block;
            width: 48px;
            text-align: left;
            margin-right: 10px;
          }
          &:nth-child(1){
            padding-top: 0;
          }
        }
      }
    }
  }
</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  export default {
    data() {
      return {
        detailList: {}
      }
    },
    props: ['item'],
    methods: {

    },
    created() {
      console.log(this.item);
      api.detailPublicCard(this.item).then(res => {
        this.detailList = res.data;
        console.log(this.detailList)
      })
    }
  }
</script>
