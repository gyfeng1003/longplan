<template>
  <transition name="demo">
    <div class="toast" v-show="theToast">
      {{msg}}
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        theToast: false,
        msg: ""
      };
    }
  };
</script>

<style lang="less" scoped>
  .toast {
    position: fixed;
    top: 40%;
    left: 50%;
    margin-left: -23vw;
    padding: 2vw;
    width: 46vw;
    font-size: 4vw;
    color: #fff;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 2.4vw;
    z-index: 999;
  }

  .demo-enter-active,
  .demo-leave-active {
    transition: 0.3s ease-out;
  }

  .demo-enter {
    opacity: 0;
    transform: scale(1.2);
  }

  .demo-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }
</style>
