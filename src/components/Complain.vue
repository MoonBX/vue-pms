<template>
  <div class="complain position-right">
    <div class="g-table-banner p-v-lg p-h-md b-b">
      <v-form>
        <v-form-item label="发布标题">
          <v-input v-model="filterList.title" placeholder="请输入公告标题" style="width: 240px;"></v-input>
        </v-form-item>
        <v-form-item label="发布时间">
          <v-date-picker v-model="filterList.dateTime" range clearable></v-date-picker>
        </v-form-item>
        <v-form-item label="发布状态">
          <v-select v-model="filterList.status" tags style="width: 120px;" :data="selectOptions" ></v-select>
        </v-form-item>
        <div class="row text-center m-t-sm">
          <v-button type="primary" style="margin-right:10px">
            提交
          </v-button>
          <v-button type="ghost">
            重置
          </v-button>
        </div>
      </v-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
  export default{
    data(){
      return{

      }
    },
    methods:{

    }

  }
</script>
