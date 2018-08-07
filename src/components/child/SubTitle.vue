<template>
  <section class="curPlace">
    <actionsheet :list="rooms" :site="site" :open="open" :confirm="confirm" :addRoom="addRoom" :cancel="cancel"></actionsheet>
    <span class="place" @click="selectRoom">{{room}}<img src="../../images/select.png"/></span>
    <span class="scheme"></span>
    <section v-show="addVisible">
      <section class="addDialog">
        <section class="layer">
          <div style="padding: 6px 0;">{{$t('global.addRoom')}}</div>
          <input class="input" type="text"/>
          <div class="group">
            <div class="btnRadio" style="border-right: 1px solid #eee;" @click="cancelled">{{$t('global.cancel')}}</div>
            <div class="btnRadio" @click="confirmed">{{$t('global.confirm')}}</div>
          </div>
        </section>
      </section>
    </section>
  </section>
</template>

    <script>
        import actionsheet from '../child/ActionSheet';
        import {mapGetters} from 'vuex';
        export default {
            name: "subTitle",
            data(){
              return {
                open: false,
                room: '',
                addVisible: false
              }
            },
            props:{
              site: {
                type: String
              }
            },
            components: {
              actionsheet
            },
            computed:{
              ...mapGetters(['rooms'])
            },
            mounted(){
              if(this.rooms.length == 0){
              	var locale = this.$i18n.locale;
                this.$store.dispatch("getRooms", {locale: locale});
              }
              if(locale == 'en'){
	              this.rooms.length == 0?this.room = 'Select': this.room = this.rooms[1];
              }else{
	              this.rooms.length == 0?this.room = '请选择': this.room = this.rooms[1];
              }
	          this.$emit('getRoomName', this.room);
            },
            methods:{
              selectRoom: function () {
                this.open = true;
                document.getElementById('inner-container').style.transform = 'none';
                document.getElementById('inner-container').style.height = '100%';
              },
              addRoom(){
                this.addVisible = true;
              },
              cancelled(){
                this.addVisible = false;
              },
              confirmed(){
                this.addVisible = false;
              },
              cancel () {
                this.open = false;
                document.getElementById('inner-container').style.height = 'auto';
              },
              confirm (index) {
                this.open = false;
                document.getElementById('inner-container').style.height = 'auto';
                this.room = this.rooms[index];
                this.$emit('getRoomName', this.room);
              }
            }
        }
</script>

<style lang="less" type="text/less" scoped>
  .curPlace{
    font-size: 16px;
    padding: 0.2rem 0;
    .place{
      img{
        width: 0.2rem;
        margin-left: 0.06rem;
      }
    }
    .scheme{
      font-size: 14px;
      float: right;
    }
    .addDialog{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      .layer{
        position:absolute;top: 30%;left:50%;width: 2.6rem;text-align:center;transform:translateX(-50%);background:#fff;z-index: 1001;
      }
      .input{
        width: 74%; margin: 0 auto;border: 1px solid #ccc;padding: 6px 10px 6px 10px;border-radius: 4px;
      }
      .group{
        text-align: center;overflow: hidden;margin-top: 6px;
        border-top: 1px solid #eee;
        .btnRadio{
          padding: 6px 0px;
          float: left; width: 50%;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
