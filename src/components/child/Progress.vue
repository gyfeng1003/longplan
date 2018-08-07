<template>
  <section class="padding">
    <section class="font12">
      <span>{{data.name}}</span>
      <span class="font24 orange">{{data.value}}</span>
    </section>
    <section class="progress">
      <section class="achieved" :style="{width: data.value/data.total*100 + '%'}"></section>
    </section>
  </section>
</template>

<script>
    export default {
        props: {
          data: {
            type: Object, default: {}
          }
        }
    }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../styles/basic.less";
  .progress{
    height: 0.14rem;
    background: #ccc;
    border-radius: 0.07rem;
    margin: 0.06rem 0.1rem;
  }
  .padding{
    padding: 0.14rem 0.28rem 0 0.28rem;
  }
  .achieved{
    height: 100%;
    border-radius:0.07rem;
    background: @orange;
  }
</style>
