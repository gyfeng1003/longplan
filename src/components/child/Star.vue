<template>
  <section>
    <ul class="clearfix">
      <li v-for="(i, index) in activeNum" class="active-star"></li>
      <li v-for="(j, idx) in num"></li>
    </ul>
  </section>
</template>

<script>
    export default {
        name: "star",
        data(){
          return {
            activeNum: 0,
            num: 5
          }
        },
        props: {
          ratio: {
            type: Number,
            default: 0
          }
        },
        mounted(){
          let num = 5* this.ratio;
          this.activeNum = Math.round(num);
          this.num = 5 - this.activeNum;
        }
    }
</script>

<style scoped>
  ul{
    font-size: 0;
  }
  ul li{
    width: 0.28rem;
    height: 0.28rem;
    background: url("../../images/star-night.png");
    background-size: 100% 100%;
    display: inline-block;
    margin: 0 0.032rem;
  }
  .active-star{
    background: url("../../images/star.png");
    background-size: 100% 100%;
  }
</style>
