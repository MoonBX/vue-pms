<template>
    <div>
      <div class="ant-table ant-table-large" style="width: 100%;">
        <div class="ant-table-content">
          <div class="ant-table-body">
            <div class="ant-spin-nested-loading" style="min-height: auto;">
              <div class="ant-spin-container">
                <slot></slot>
              </div>
            </div>
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
            return {}
        },
        methods: {},
        created() {
        }
    }
</script>
