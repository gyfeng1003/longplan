<template>
  <section>
      <vue-pay-keyboard
              ref="pay"
              :is-pay='isPay'
              @pas-end='pasEnd'
              @close='isPay=false'>
          <!-- 自定义支付动画 -->
          <!--<div slot="loading-ani">-->
              <!--<svg></svg>-->
          <!--</div>-->
      </vue-pay-keyboard>
  </section>
</template>

<script>
    import Device from './child/Device';
    import {GetObjPos} from '../utils/util';
    import { swiper, swiperSlide } from 'vue-awesome-swiper';
    import actionsheet from './child/ActionSheet';
    import {sceneList, deviceControl} from '../api/api';
    export default {
        name: "scene-scheme",
        data(){
          return {
          	isPay: true
          }
        },
        mounted(){

            //   this.room = this.actions[0].name;
            //   this.$refs.layer.addEventListener('click', ()=> {
            //     if(this.$refs.layer){
            //       this.deviceAddVisible = false;
            //       this.deviceAddVisible = false;
            //       this.deviceSearchVisible = false;
            //       this.deviceSearchVisible = false;
            //       this.$refs.layer.style.display = 'none';
            //     }
            //   }, false);
            //
            //   let locale = this.$i18n.locale;
            // sceneList({locale: locale}).then(res=>{
		     //    var sceneList;
            //     if (res.status == '0') {
            //     	if(locale=='en'){
            //             sceneList = res.sceneList || [];
		     //            sceneList.forEach((data=>{
			 //                this.schemes.push({
				//                 name: data.showName, desc: '', select: false, orialName: data.name
			 //                })
		     //            }))
            //         }else{
            //             sceneList = res.sceneList || [];
		     //            sceneList.forEach((data=>{
			 //                this.schemes.push({
				//                 name: data, desc: '', select: false,orialName:data
			 //                })
		     //            }))
            //         }
            //     }else {
            //         this.$toast("status:" + status + 'msg:' + msg);
            //     }
            //     this.btnVisible = true;
            // }).then(err=>{
		     //    this.btnVisible = true;
            // })
        },
        components: {
          Device,
          swiper,
          swiperSlide,
          actionsheet
        },
        methods: {
	        pasEnd(val) {
		        console.log(val);  //得到密码 可能会进行一些加密动作
		        setTimeout(() => { // 模拟请求接口验证密码中 ..
			        if (val === '111111') { // 密码正确
				        this.$refs.pay.$payStatus(true) // 拿到子组件的事件
			        } else {
				        this.$refs.pay.$payStatus(false)
			        }
		        }, 1000)
	        },
          editScheme(){
            this.listVisible = false;
          },
          addScheme(){
            this.listVisible = false;
          },
          close(){
            this.listVisible = true;
          },
          toggle(item){
          	this.schemes.forEach((data, index)=>{
          		data.select = false;
            })
            item.select = true;

          	var param = {
          		name: item.orialName,
                order: 'scene control',
                value1: 0,
	            value2: 0,
	            value3: 0,
	            value4: 0,
            }
           deviceControl(param).then(res=>{
              //    this.$toast(res.msg);
           })
          },
          operate(e){
            this.deviceAddVisible = false;
            this.deviceSearchVisible = false;
            this.dialogVisible = !this.dialogVisible;
            var pos = GetObjPos(e.target.parentElement);
            var modal = this.$refs.operateModal;
            modal.style.top = pos.y - 94 +'px';
          },
          confirmOperate(){
            this.deviceAddVisible = false;
            this.deviceSearchVisible = false;
            this.dialogVisible = false;
          },
          revertOperate(){
            this.deviceAddVisible = false;
            this.deviceSearchVisible = false;
            this.dialogVisible = false;
          },
          searchDevice(){
            this.deviceSearchVisible = true;
            this.$refs.layer.style.display = 'block';
          },
          addDevice(){
            this.deviceAddVisible = !this.deviceAddVisible;
            this.$refs.layer.style.display = 'block';
          },
          selectRoom(){
            this.open = true;
          },
          confirmSelect(index){
            this.open = false;
            this.room = this.actions[index];
          },
          cancelSelect(){
            this.open = false;
          },
          setValue(obj){
            this.room = obj.name
          },
          confirm(){        //添加设备 -确定
            this.deviceAddVisible = false;
            this.$refs.layer.style.display = 'none';
          },
          cancel(){         //添加设备 -取消
            this.deviceAddVisible = false;
            this.$refs.layer.style.display = 'none';
          },
          pickDevice(idx){
            this.index = idx;
          },
          ignoreDevice(){    //搜索设备--忽略此设备
            this.deviceSearchVisible = false;
            this.$refs.layer.style.display = 'none';
          },
          startConnect(){     //搜索设备--开始连接
            this.deviceSearchVisible = false;
            this.$refs.layer.style.display = 'none';
          }
        }
    }
</script>
<style lang="less" type="text/less">
  @import "../styles/swiper";
</style>
<style lang="less" type="text/less" scoped>
  @import "../styles/basic.less";

  .page{
    margin: 0 @margin;
  }
  .swiper{
    z-index: 0;
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    .swiper-slide{ /*.swiper-wrapper{*/
      width: 80%;
      &.swiper-slide-active{
        .modal{
          width: 100%;
          height: 100%;
        }
      }
      .modal{
        display: block;
        margin: 0.32rem auto;
        margin-top: 0.32rem;
        width: 90.625%;
        height: 90.625%;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 0 0.32rem 0.004rem #ccc;
      }
    }
  }
  .scheme{
    position: relative;
    margin-top: 0.2rem;
    font-size: 14px;
    box-shadow: 0 0 0.4rem 0.004rem #ccc;
    padding: 0.06rem 0 0.06rem 0.1rem;
    .text{
      float: left;
      section:first-of-type{
        padding-bottom: 0.12rem;
        &:extend(.h1);
      }
    }
    .edit{
      position: absolute;
      right: 0.2rem;
      top: 50%;
      transform: translateY(-50%);
      img{
        width: 0.32rem;
      }
    }
    .close{
      width: 0.32rem;
      height: 0.32rem;
      img{
        width: 100%;
      }
    }
  }
  .newScheme{
    border: 0;
    padding: 0.04rem 0;
    font-size: 26px;
    margin-right: 0.6rem;
    width: 100%;
    box-sizing: border-box;
    padding-right: 0.6rem;
  }
  .room{
    padding: 0.1rem 0 0.06rem 0;
    &:extend(.font16);
  }
  .device{
    box-shadow: 0 0 0.3rem #ccc;
    height: 0.3rem;
    line-height: 0.3rem;
    border-radius: 0.3rem;
    text-align: center;
    margin-bottom: 0.16rem;
  }
  .flex {
    width: 32%;
    float: left;
    &:not(:last-child) {
      margin-right: 2%;
    }
  }
  .btn-group{
    font-size: 0;
    /*position: fixed;*/
    /*bottom: 0.5rem;*/
    left: 0;
    right: 0;
    &>section{
      width: 100% / 3;
      display: inline-block;
      margin: 0 auto;
      &:nth-child(1){
        img{
          width: 0.18rem;
        }
      }
      &:nth-child(2){
        img{
          width: 0.22rem;
        }
      }
      &:nth-child(3){
        img{
          width: 0.26rem;
        }
      }
      .button{
        margin: 0 auto;
        background: @orange;
        width: 0.42rem;
        height: 0.42rem;
        border-radius: 50%;
        position: relative;
        img{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
  .operateModal{
    position: absolute;
    box-shadow: 0 0 0.4rem 0.004rem #ccc;
    background: #fff;
    border-radius: 16px;
    padding: 0.2rem 0;
    left: @margin;
    right: @margin;
    .btn-list{
      float: left;
      width: 50%;
      text-align: center;
      section{
        border: 1px solid @orange;
        height: 0.3rem;
        line-height: 0.3rem;
        border-radius: 0.3rem;
        color: @orange;
        width: 64%;
        margin: 0 auto;
        font-size: 0.14rem;
      }
    }
    .triangle{
      width: 0.16rem;
      height: 0.16rem;
      position: absolute;
      bottom: -0.12rem;
      left: 50%;
      transform: rotate(45deg) translateX(-50%);
      background: #fff;
    }
  }
  .deviceModal{
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
    padding: 0.1rem 0;
    padding-bottom: 0;
    .header{
      font-size: 0.14rem;
      text-align: center;
      .place{
        img{
          width: 0.2rem;
          margin-left: 0.06rem;
          vertical-align: top;
        }
      }
    }
    .body{
      padding: 0.16rem 0.1rem;
    }
    .footer{
      height: 0.4rem;
      line-height: 0.4rem;
      border-top: 1px solid #eee;
      .group{
        float: left;
        width: 50%;
        font-size: 0.14rem;
        text-align: center;
        box-sizing: border-box;
        &:last-of-type{
          border-left: 1px solid #eee;
        }
      }
    }
  }

  .mo{
    box-shadow: 0 0 0 #ccc;
    border: 1px solid #888;
  }

  .modal{
    text-align: center;
    font-size: 0.14rem;
    .header{
      padding: 0.1rem 0;
    }
    .body{
      padding: 0.16rem 0;
      img{
        width: 50%;
        height: 1rem;
      }
    }
    .footer{
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
      background: #f2f2f2;
      border-top: 1px solid #dfdfdf;
      .group{
        float: left;
        width: 50%;
        box-sizing: border-box;
        padding: 0.1rem 0;
        &:last-of-type{
          border-left: 1px solid #dfdfdf;
        }
      }
    }
  }
</style>
