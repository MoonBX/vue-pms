<template>
  <div>
    <div class="detail-box">
      <v-row class="m-b-sm">
        <v-col span="24">
          <span class="title m-r-lg" style="line-height: 27px;">{{detailList.title}}</span>
          <span class="badge bg-success">{{detailList.status}}</span>
        </v-col>
      </v-row>
      <v-row class="m-b-sm">
        <v-col span="24">
          <span class="date">{{detailList.effectiveStartTime | formatDate('YMD')}}到{{detailList.effectiveEndTime | formatDate('YMD')}}</span>
        </v-col>
      </v-row>
      <v-row class="b-b p-b-sm">
        <v-col span="24">
          <span class="content">{{detailList.content}}</span>
        </v-col>
      </v-row>
    </div>
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
  export default{
    data(){
      return{
        detailList: {}
      }
    },
    methods: {},
    props: ['id'],
    created(){
      console.log(this.id);
      api.getAnnounceDetail(this.id)
        .then(res => {
          console.log(res.data);
          switch (res.data.status) {
            case 0:
              res.data.status = '撤销';
              break;
            case 1:
              res.data.status = '发布';
              break;
            case 2:
              res.data.status = '已过期';
              break;
            case 3:
              res.data.status = '未生效';
              break;
            default:
              res.data.status = '';
          }
          this.detailList = res.data;
        })
    }
  }
</script>
