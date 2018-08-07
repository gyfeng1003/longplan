<template>
  <section>
    <section class="page" v-show="listVisible">
      <section class="scheme clearfix" @click="toggle(item)" :class="{'select': item.select}" v-for="(item, index) in schemes">
        <section class="text">
          <section>{{item.name}}</section>
          <section>{{item.desc}}</section>
        </section>
        <section class="edit" @click="editScheme">
          <img src="../images/edit-night.png" v-show="!item.select"/>
          <img src="../images/edit.png" v-show="item.select"/>
        </section>
      </section>
      <section class="btn-group clearfix" v-show="btnVisible">
        <section style="width: 100%;">
          <section @click="addScheme()" class="button" style="box-shadow: 0 0 0.3rem #ccc;background: #fff;"><img src="../images/add-night.png"/></section>
        </section>
      </section>
    </section>

    <section class="page" v-show="!listVisible">
      <section class="scheme clearfix">
        <section class="text">
          <input class="newScheme" placeholder="新建模式"/>
        </section>
        <section class="edit close" @click="close">
          <img src="../images/close.png"/>
        </section>
      </section>
      <section class="clearfix" v-for="(room, index) in rooms">
        <section class="room">{{room.roomName}}</section>
        <Device :list="room.devices"></Device>
      </section>
      <section class="btn-group clearfix">
        <section><section @click="revertOperate" class="button"><img src="../images/revert.png"/></section></section>
        <section><section @click="operate" class="button"><img src="../images/add.png"/></section></section>
        <section><section @click="confirmOperate" class="button"><img src="../images/yes.png"/></section></section>
      </section>
    </section>

    <!--添加、搜索设备对话框-->
    <section v-show="dialogVisible" ref="operateModal" class="operateModal clearfix">
      <section class="btn-list">
        <section @click="addDevice" class="button">添加设备</section>
      </section>
      <section class="btn-list">
        <section @click="searchDevice" class="button">搜索设备</section>
      </section>
      <section class="triangle"></section>
    </section>

    <!--添加设备对话框-->
    <section v-show="deviceAddVisible" class="operateModal deviceModal clearfix">
      <section class="header">
          <span class="place" @click="selectRoom">选择设备&nbsp;&nbsp;{{room}}<img src="../images/select.png"/></span>
      </section>
      <section class="body">
        <div class="clearfix font12">
          <section class="flex">
            <section @click="pickDevice(idx)" :class="{'active': idx==index}"  v-for="(device, idx) in list" v-if="idx%3==0" class="device mo">
              {{device.name}}
            </section>
          </section>
          <section class="flex">
            <section @click="pickDevice(idx)" :class="{'active': idx==index}" v-for="(device, idx) in list" v-if="idx%3==1" class="device mo">
              {{device.name}}
            </section>
          </section>
          <section class="flex">
            <section @click="pickDevice(idx)"  :class="{'active': idx==index}" v-for="(device, idx) in list" v-if="idx%3==2" class="device mo">
              {{device.name}}
            </section>
          </section>
        </div>
      </section>
      <section class="footer clearfix">
        <section @click="cancel" class="group">取消</section>
        <section @click="confirm" class="group orange">添加选中设备</section>
      </section>
    </section>
    <section ref="layer" style="display:none;position: fixed;top: 0;bottom: 0;left: 0;right: 0;background: rgba(0,0,0,0.1);z-index: 0;"></section>

      <!--搜索设备对话框 Swiper-->
    <div v-if="deviceSearchVisible"  class="swiper">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(item, i) in slides" :key="i">
          <section class="modal">
            <section class="header">
              <span class="place">发现新风机</span>
            </section>
            <section class="body">
              <img :src="item"/>
            </section>
            <section class="footer clearfix">
              <section @click="ignoreDevice" class="group">忽略此设备</section>
              <section @click="startConnect" class="group orange">开始连接</section>
            </section>
          </section>
        </swiper-slide>
      </swiper>
    </div>

    <actionsheet :list="actions" :open="open" :confirm="confirmSelect" :cancel="cancelSelect"></actionsheet>
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
          return{
            schemes: [],
            idx: '',
            index: '',
            rooms: [
              {roomName: '客厅',
               devices: [
                  {
                    name: '筒灯'
                  },
                 {
                    name: '传感器'
                  },
                 {
                   name: '窗帘'
                 },
                 {
                   name: '空调'
                 },
                 {
                   name: '插座'
                 }
               ]
              },
              {roomName: '餐厅',
                devices: [
                  {
                    name: '筒灯'
                  },{
                    name: '传感器'
                  },{
                    name: '窗帘'
                  },{
                    name: '空调'
                  },{
                    name: '插座'
                  }
                ]
              }
            ],
            list: [
                  {
                    name: '筒灯'
                  },
                  {
                    name: '传感器'
                  },
                  {
                    name: '窗帘'
                  },
                  {
                    name: '空调'
                  },
                  {
                    name: '插座'
                  }
            ],
            listVisible: true,
            dialogVisible: false,       //添加、搜索对话框
            deviceAddVisible: false,    //添加对话框
            deviceSearchVisible: false, //搜索对话框
            actions: ['客厅','餐厅'], //actionSheet
            open: false,
            room: '',
            slides: [
              'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1511015180050&di=0d2ee92eead284e8133d6df07535d75a&imgtype=0&src=http%3A%2F%2Fimg.sc115.com%2Fuploads1%2Fsc%2Fjpgs%2F1512%2Fapic16988_sc115.com.jpg',
              'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1511015180167&di=7412fd486c47c15f1d27485be0d7bd28&imgtype=0&src=http%3A%2F%2Fwww.duoxinqi.com%2Fimages%2F2012%2F06%2F20120605_8.jpg',
              'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1511015180167&di=3bcedd33a30129b9951be2a81f9b505c&imgtype=0&src=http%3A%2F%2Fpic1.5442.com%2F2015%2F0420%2F06%2F05.jpg'
            ],
	          btnVisible: false,
            //轮播config
            swiperOption: {
              debugger: true,
              slidesPerView: "auto",
              centeredSlides: true
            }
          }
        },
        mounted(){
              this.room = this.actions[0].name;
              this.$refs.layer.addEventListener('click', ()=> {
                if(this.$refs.layer){
                  this.deviceAddVisible = false;
                  this.deviceAddVisible = false;
                  this.deviceSearchVisible = false;
                  this.deviceSearchVisible = false;
                  this.$refs.layer.style.display = 'none';
                }
              }, false);

              let locale = this.$i18n.locale;
	        sceneList({locale: locale}).then(res=>{
		        var sceneList;
                if (res.status == '0') {
                	if(locale=='en'){
                        sceneList = res.sceneList || [];
		                sceneList.forEach((data=>{
			                this.schemes.push({
				                name: data.showName, desc: '', select: false, orialName: data.name
			                })
		                }))
                    }else{
                        sceneList = res.sceneList || [];
		                sceneList.forEach((data=>{
			                this.schemes.push({
				                name: data, desc: '', select: false,orialName:data
			                })
		                }))
                    }
                }else {
                    this.$toast("status:" + status + 'msg:' + msg);
                }
                this.btnVisible = true;
            }).then(err=>{
		        this.btnVisible = true;
            })
        },
        components: {
          Device,
          swiper,
          swiperSlide,
          actionsheet
        },
        methods: {
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
