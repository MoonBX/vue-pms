<template>
  <div class="announce position-right">
    <v-tree-select :data="treeData2" allow-clear multiple :popupContainer="under"></v-tree-select>
    <button @click="go()"></button>
    <v-modal title="编辑公告"
             :visible="show"
             @cancel="handleCancel()"
             :width="700">
      <modal></modal>
    </v-modal>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
  import Modal from '@/components/Modal'
  export default{
    data(){
      return{
        treeData2: [{
          title: 'parent 1',
          expanded: true,
          children: [{
            title: 'parent 1-0',
            expanded: true,
            children: [{
              title: 'my leaf',
            }, {
              title: 'your leaf',
            }, {
              title: 'self leaf',
            }]
          }, {
            title: 'parent 1-1',
            children: [{
              title: "<span style='color: #08c'>sss</span>"
            }]
          }, {
            title: 'parent 1-2',
          }]
        }],
        show: false
      }
    },
    components: {
      Modal
    },
    methods:{
      go(){
        this.show = true;
      },
      handleCancel (value) {
        this.show = false;
      },
    }

  }
</script>
