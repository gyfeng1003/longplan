<template>
    <div class="clearfix font12">
      <section class="flex">
        <section @click="pickDevice(idx, $event, device)" :class="{'outo': type=='popup'&&index1 == idx}" v-for="(device, idx) in list" v-if="idx%3==0" class="device">
          {{device.name}}
        </section>
      </section>
      <section class="flex">
        <section @click="pickDevice(idx, $event, device)" :class="{'outo': type=='popup'&&index1 == idx}" v-for="(device, idx) in list" v-if="idx%3==1" class="device">
          {{device.name}}
        </section>
      </section>
      <section class="flex">
        <section @click="pickDevice(idx, $event, device)" :class="{'outo': type=='popup'&&index1 == idx}" v-for="(device, idx) in list" v-if="idx%3==2" class="device">
          {{device.name}}
        </section>
      </section>
    </div>
</template>

<script>
  export default {
        name: "device",
        data(){
          return {
             index1: ''
          }
        },
        props: {
          list: {
            type: Array,
            default: function() {
              return [];
            }
          },
          type: {
            type: String
          }
        },
        methods: {
          pickDevice(idx, $event, device){
            this.index1 = idx;
            this.$emit('change', {idx,that:$event.target, device})
          }
        }
    }
</script>

<style lang="less" type="text/less" scoped>
  .flex {
    width: 32%;
    float: left;
    &:not(:last-child) {
      margin-right: 2%;
    }
  }
  .device{
    box-shadow: 0 0 0.3rem #ccc;
    height: 0.3rem;
    line-height: 0.3rem;
    border-radius: 0.3rem;
    text-align: center;
    margin-bottom: 0.16rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .outo{
    z-index: 9;
    position: relative;
    background: #fff;
  }
</style>
