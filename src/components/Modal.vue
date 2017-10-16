<template>
    <div id="djd">
      <v-tree-select :data="treeData2" allow-clear multiple :popupContainer="under"></v-tree-select>
    </div>
</template>
<style lang="scss" scoped>
</style>
<script type="text/ecmascript-6">
    export default {
        data() {
          return{
            under(){
              console.log(document.getElementById('djd'));
              return document.getElementById('djd');
            },
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
          }
        },
        methods: {},
        created() {
        }
    }
</script>
