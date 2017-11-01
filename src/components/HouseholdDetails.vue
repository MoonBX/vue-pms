<template>
  <div>
    <div class="detail-box">
      <v-row class="m-b-sm">
        <v-col span="24">
          <span class="title m-r-md" style="line-height: 27px;">{{detailList.name}}</span>
          <span class="phone m-r-lg">{{detailList.mobile}}</span>
          <span class="badge " :class="{'bg-success': detailList.status == 0, 'bg-error': detailList.status == 1}">{{detailList.status_cn}}</span>
        </v-col>
      </v-row>
      <v-row class="m-b-sm b-b p-b-sm">
        <v-col span="24">
          <span class="address">{{detailList.partitionName + '-' + detailList.blockName + '-' + detailList.unitName + '-' + detailList.roomNo}}</span>
        </v-col>
      </v-row>
    </div>
    <div class="other-box">
      <v-row class="m-b-xs">
        <div class="pull-left">
          <span class="title">住户身份:</span>
          <span class="value">{{detailList.userType_cn}}</span>
        </div>
      </v-row>
      <v-row class="m-b-xs">
        <div class="pull-left">
          <span class="title">身份证号:</span>
          <span class="value">{{item.idCard}}</span>
        </div>
        <div class="pull-left">
          <span class="title">有效期限:</span>
          <span class="value" v-if="detailList.effectiveType == 0 || detailList.effectiveStartTime==0 || !detailList.effectiveStartTime">永久</span>
          <span class="value" v-if="detailList.effectiveType != 0 && detailList.effectiveStartTime!=0 && detailList.effectiveStartTime">{{detailList.effectiveStartTime | formatDate('YMD')}}至{{ detailList.effectiveEndTime | formatDate('YMD')}}</span>
        </div>
      </v-row>
      <div class="row m-b-sm clear" v-for="item in detailList.cardTypeNameArr">
        <div class="pull-left" v-for="item_c in item">
          <span class="title">卡号:</span>
          <span class="value">{{item_c}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        detailList : {}
      }
    },
    props: ['item'],
    methods: {
      listTemp(oldList) {
        var list = oldList;
        var arrTemp = [];
        var index = 0;
        var sectionCount = 2;
        for (var i = 0; i < list.length; i++) {
          index = parseInt(i / sectionCount);
          if (arrTemp.length <= index) {
            arrTemp.push([]);
          }
          arrTemp[index].push(list[i]);
        }
        console.log(arrTemp);
        return arrTemp;
      }
    },
    created() {
      console.log(this.item);
      if (this.item.cardTypeName) {
        var a = this.item.cardTypeName.split(' ');
        a.pop();
        this.item.cardTypeNameArr = this.listTemp(a);
      }
      this.detailList = this.item;
    }
  }
</script>
