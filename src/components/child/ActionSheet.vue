<template>
  <transition name="actionsheet">
      <div v-show="open"
           class="m-actionsheet-box">
        <div class="m-actionsheet-cnt">
          <ul>
            <li
              v-for="(item,index) of list"
              v-show="!(site=='real'&&item=='默认房间')"
              @click="choose(index)">
              {{item | hanleLabel(label)}}
            </li>
            <li v-show="site=='real'" style="color: #d4471d;" @click="addRoom">{{$t('global.addRoom')}}</li>
            <li @click="cancel">{{$t('global.cancel')}}</li>
          </ul>
        </div>
      </div>
  </transition>
</template>

<script>
  let shadeLayer = createShadeLayer();
    export default {
      props: {
        site:{
          type: String
        },
        // 显示的数组,数组中对象格式是{label:'显示的内容',value:'值'}
        list: {
          type: Array,
          required: true
        },
        open: {
          type: Boolean,
          required: true,
          default: false
        },
        // label的别名
        label: {
          type: String,
          required: false,
          default: 'label'
        },
        confirm: {
          type: Function,
          default () {}
        },
        addRoom: {
          type: Function,
          default(){}
        },
        cancel: {
          type: Function,
          default () {}
        }
      },
      data () {
        return {show: false}
      },
      watch: {
        open (val) {
          if (val) {
            shadeLayer._show()
          } else {
            shadeLayer._close()
          }
        }
      },
      filters: {
        hanleLabel (item, label) {
          return typeof item === 'string' ? item : item[label]
        }
      },
      methods: {
        choose (res) {
          this.confirm(res)
        }
      },
      mounted () {
        shadeLayer._clickCallback = () => {
          this.cancel()
        }
      }
    }
  function createShadeLayer () {
    let el = document.createElement('div')
    el.classList.add('m-shade-layer')
    el.style.display = 'none'
    el.addEventListener('click', function (e) {
      if (el._clickCallback) {
        el._clickCallback()
      }
    })
    el.addEventListener('webkitTransitionEnd', function () {
      if (el && !el.classList.contains('m-shade-layer-fade')) {
        el.style.display = 'none';
      }
    })
    el._show = function () {
      el.style.display = 'block';
      el.classList.add('m-shade-layer-fade');
    }
    el._close = function () {
      el.style.display = 'none';
      el.classList.remove('m-shade-layer-fade');
    }
    document.body.appendChild(el)
    return el;
  }
</script>

<style type="text/less" lang="less" scoped>
  .actionsheet-enter-active {
    transition: transform .3s;
    transform: translate3d(0, 0, 0);
  }
  .actionsheet-enter {
    transform: translate3d(0, 100%, 0);
  }
  .actionsheet-leave {
    transform: translate3d(0, 0, 0);
  }
  .actionsheet-leave-active {
    transition: transform .3s;
    transform: translate3d(0, 100%, 0);
  }
  .m-actionsheet-box {
    position: fixed;
    z-index: 999;
    left: 0;
    bottom: 0;
    width: 100%;
  //动画
    .m-actionsheet-cnt {
      ul {
        list-style: none;
        li {
          color: #666;
          background-color: #ffffff;
          text-align: center;
          padding: 10px 0;
          border-top: 1px solid #dddddd;
          &:first-child {
             border-top: none;
             border-radius: 5px 5px 0 0;
           }
          &:nth-last-child(2) {
             border-radius: 0 0 5px 5px
           }
          &:last-child {
             margin-top: 10px;
             border-radius: 5px;
             font-weight: 700;
          }
        }
      }
    }
  }
</style>
<style type="text/css" rel="stylesheet">
  .m-shade-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.1);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .m-shade-layer.m-shade-layer-fade {
    opacity: 1;
  }
</style>
