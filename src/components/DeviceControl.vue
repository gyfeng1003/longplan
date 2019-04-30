<template>
    <div class="page" id="page">
        <Subtitle @getRoomName="getRoomName"></Subtitle>
        <Device :list="devices" :type="type" @change="change"></Device>
        <section class="btn-group clearfix" v-show="btnVisible">
            <section style="width: 100%;">
                <section @click="save()" class="button" style="box-shadow: 0 0 0.3rem #ccc;background: #fff;"><img
                        src="../images/add-night.png"/></section>
            </section>
        </section>
        <div v-show="popVisible" class="popupContainer">
            <div class="popup" ref="popup">
                <div class="body font14">
                    <div class="progress" v-show="rgbidx!=-1 || hueidx!=-1">
                        <div>{{$t("DeviceCtr.baohedu")}}<span>{{saturation}}%</span></div>
                        <div class="range">
                            <input class="saturation" data-type="saturation" type="range" v-model="saturation"/>
                        </div>
                    </div>
                    <div class="progress" v-show="rgbidx!=-1 || hueidx!=-1">
                        <div>{{$t("DeviceCtr.liangdu")}}<span>{{shine}}%</span></div>
                        <div class="range">
                            <input class="shine" data-type="shine" type="range" v-model="shine"/>
                        </div>
                    </div>
                    <div class="progress" v-show="rgbidx!=-1 || hueidx!=-1">
                        <div>{{$t("DeviceCtr.secai")}}<span>{{color}}%</span></div>
                        <div class="range">
                            <input class="color" data-type="color" type="range" v-model="color"/>
                        </div>
                    </div>
                    <div id="check" v-if="isChuangidx!==-1 || islianidx !== -1 || isEnChuangIdx !== -1 || isEnlianidx!==-1">
                        <span>{{$t("DeviceCtr.kai")}}</span><span class="pr"><input type="radio" value="open" v-model="swich" class="input_check" id="check1"><label for="check1"></label></span>
                        <span>{{$t("DeviceCtr.guan")}}</span><span class="pr"><input type="radio" value="close" v-model="swich"  class="input_check"  id="check2"><label for="check2"></label></span>
                        <span>{{$t("DeviceCtr.ting")}}</span><span class="pr"><input type="radio" value="stop" v-model="swich"  class="input_check"  id="check3"><label for="check3"></label></span>
                    </div>
                    <div id="check" v-else>
                        <span>{{$t("DeviceCtr.kai")}}</span><span class="pr"><input type="radio" value="on" v-model="swich" class="input_check"  id="check4"><label for="check4"></label></span>
                        <span>{{$t("DeviceCtr.guan")}}</span><span class="pr"><input type="radio" value="off" v-model="swich"  class="input_check" id="check5"><label for="check5"></label></span>
                    </div>
                    <div class="group">
                        <div class="btnRadio" style="border-right: 1px solid #eee;" @click="cancelled">{{$t("DeviceCtr.cancel")}}</div>
                        <div class="btnRadio" @click="confirmed">{{$t("DeviceCtr.confirm")}}</div>
                    </div>
                </div>
                <div class="trangle" ref="trigle"></div>
            </div>
        </div>
    </div>
</template>

<script>
	import Subtitle from './child/SubTitle';
	import Device from './child/Device';
	import {getDevices, deviceControl} from '../api/api';
	import {GetObjPos} from "../utils/util";
	// import {mapGetters} from 'vuex';
    function getClientH(){
    	var height = window.innerHeight;
    	if(typeof height != 'number' ){
    		if(document.compatMode == 'CSS1Compat'){
			    height = document.documentElement.clientHeight;
            }else {
			    height = document.body.clientHeight
            }
        }
        return height;
    }

    function getStyle (obj,attr) {
        return obj.currentStyle ? obj.currentStyle[attr]:getComputedStyle(obj)[attr];
    }

	export default {
		name: "device-control",
		data() {
			return {
				popVisible: false,
				type: 'popup',
				saturation: 0,
				shine: 0,
				color: 0,
				rooms: [],
                devices: [],
                room: '',
				swich: 'on',
                order: '',
				value1: 0,
				rgbidx: 0,
                hueidx: 0,
				isChuangidx: 0,
                islianidx: 0,
				isEnChuangIdx: 0,
				isEnlianidx: 0,
                devicename: '',
				btnVisible: false
			}
		},
		components: {
			Subtitle,
			Device,
		},
		mounted() {
			$(".saturation").RangeSlider({
				min: 0, max: 100, step: 1, callback: () => {
				}
			});
			$(".shine").RangeSlider({
				min: 0, max: 100, step: 1, callback: () => {
				}
			});
			$(".color").RangeSlider({
				min: 0, max: 100, step: 1, callback: () => {
				}
			});

			this.$nextTick(function () {
				document.getElementById('page').style.height = getClientH()+'px';
			})

			var locale = this.$i18n.locale;
            // getDevices({locale}).then(res => {
				// if (res.status == '0') {
				// 	var dList = res.dList;
            //
            //         if(locale=='en'){
            //             dList = dList[0];
            //             for(var key in dList){
            //             	var vals = [];
	         //                dList[key].forEach((data,index)=>{
		     //                    if(data.showName){
			 //                        var enrgbidx = data.showName.indexOf('rgb');
			 //                        var enhueidx = data.showName.indexOf('hue strip'),name;
			 //                        name = data.showName;
			 //                        if(enrgbidx === -1 && enhueidx === -1){
				//                         name = data.showName;
			 //                        }
			 //                        if(enrgbidx !== -1){
				//                         name = data.showNamee.slice(0, enrgbidx);
			 //                        }
			 //                        if(enhueidx !== -1){
				//                         name = data.showName.slice(0, enhueidx);
			 //                        }
		     //                    }
            //                     vals.push({
	         //                        name: name,
	         //                        orialName: data.name,
            //                         zhName: data.name,
	         //                        order: '',
	         //                        value1: 0,
	         //                        value2: 0,
	         //                        value3: 0,
	         //                        value4: 0
            //                     })
            //                 })
            //             	this.rooms.push({
		     //                    roomName: key,
		     //                    devices: vals
            //                 })
            //             }
            //             console.log(this.rooms)
            //         }else{
	         //            //var dList = [{roomName: '00', deviceName: '哈哈00'},{roomName: '00', deviceName: '哈哈00'},{roomName: '11', deviceName: '哈哈11'},{roomName: '22', deviceName: '哈哈22'},{roomName: '22', deviceName: '哈哈22'},{roomName: '33', deviceName: '哈哈33'},{roomName: '22', deviceName: '哈哈22'},{roomName: '00', deviceName: '哈哈00'},{roomName: '00', deviceName: '哈哈00'},{roomName: '00', deviceName: '哈哈00'} ];
	         //            dList.forEach((item) => {
		     //                let index = this.rooms.findIndex(function (data) {
			 //                    return data.roomName == item.roomName;
		     //                })
		     //                if(item.deviceName){
			 //                    var rgbidx = item.deviceName.indexOf('rgb');
			 //                    var hueidx = item.deviceName.indexOf('hue strip'),name;
			 //                    name = item.deviceName;
			 //                    if(rgbidx === -1 && hueidx === -1){
				//                     name = item.deviceName;
			 //                    }
			 //                    if(rgbidx !== -1){
				//                     name = item.deviceName.slice(0, rgbidx);
			 //                    }
			 //                    if(hueidx !== -1){
				//                     name = item.deviceName.slice(0, hueidx);
			 //                    }
		     //                }
		     //                if(index === -1){
			 //                    this.rooms.push({
				//                     roomName: item.roomName,
				//                     devices: [
				// 	                    {
				// 		                    name: name,
				// 		                    orialName: item.deviceName,
				// 		                    zhName: item.deviceName,
				// 		                    order: item.order,
				// 		                    value1: item.value1,
				// 		                    value2: item.value2,
				// 		                    value3: item.value3,
				// 		                    value4: item.value4
				// 	                    }
				//                     ]
			 //                    })
		     //                }else{
			 //                    this.rooms[index].devices.push(
				//                     {
				// 	                    name: name,
				// 	                    orialName: item.deviceName,
				// 	                    zhName: item.deviceName,
				// 	                    order: item.order,
				// 	                    value1: item.value1,
				// 	                    value2: item.value2,
				// 	                    value3: item.value3,
				// 	                    value4: item.value4
				//                     });
		     //                }
	         //            })
            //         }
            //
            //         var idx = this.rooms.findIndex((d) => {
            //             return d.roomName == this.room
            //         })
            //         if(idx !== -1){
	         //            this.devices = this.rooms[idx].devices;
            //         }
				// } else {
				// 	this.$toast("status:" + status + 'msg:' + msg);
				// }
				// this.btnVisible = true;
            // }).then(err=>{
				// this.btnVisible = true;
            // })
		},
		methods: {
			getRoomName(data){
                this.room = data;
				var idx = this.rooms.findIndex((d) => {
					return d.roomName == this.room
				})
				if(idx !== -1){
					console.log(this.rooms[idx]);
					this.devices = this.rooms[idx].devices;
					this.devices.concat(this.rooms[idx].devices);
				}
            },
			save() {

			},
			change({idx, that, device}) {
				this.popVisible = true;
				this.$nextTick(()=>{
					let pos = GetObjPos(that);
					if(pos.y > getClientH()/2){
						var height = getStyle(document.getElementsByClassName('popup')[0], 'height');
						this.$refs.popup.style.top = (pos.y - parseFloat(height) - 10) + 'px';
						this.$refs.trigle.style.left = pos.x + 'px';
						this.$refs.trigle.style.top = 'auto';
						this.$refs.trigle.style.bottom = '-0.05rem';
					}else{
						this.$refs.popup.style.top = (pos.y + that.offsetHeight+10) + 'px';
						this.$refs.trigle.style.left = pos.x + 'px';
						this.$refs.trigle.style.top = '-0.05rem';
						this.$refs.trigle.style.bottom = 'auto';
					}
                    console.log(device);
					if(device.orialName){
						this.devicename = device.orialName;
						this.rgbidx = device.orialName.indexOf('rgb');
						this.hueidx = device.orialName.indexOf('hue strip');
						this.isChuangidx = device.orialName.indexOf('窗');
						this.islianidx = device.orialName.indexOf('帘');
						this.isEnChuangIdx = device.zhName.indexOf('窗');
						this.isEnlianidx = device.zhName.indexOf('帘');

						if(this.rgbidx !== -1 || this.hueidx !== -1){
							this.saturation = parseInt(0 / 255);
							this.shine = parseInt(0/255);
							this.color = parseInt(0/655536);
							this.order = 'color control';
							this.swich = 'off';
						}
						if(this.isChuangidx !== -1 || this.islianidx !== -1 || this.isEnChuangIdx !== -1 || this.isEnlianidx !== -1){
							this.swich = 'close';
                        }
					}
					$(".saturation").css('background', 'linear-gradient(to right, #EF7F5D, #f5f5f5 ' + this.saturation + '%, #ccc)');
					$(".shine").css('background', 'linear-gradient(to right, #EF7F5D, #f5f5f5 ' + this.shine + '%, #ccc)');
					$(".color").css('background', 'linear-gradient(to right, #98afce, #EF7F5D, #f5f5f5 ' + this.color + '%, #ccc)');
                });
			},
			cancelled() {
				this.popVisible = false;
			},
			confirmed() {
				console.log(this.swich);
				this.popVisible = false;
				var param;
				switch (this.swich){
					case 'on': this.value1 = 0; break;
					case 'off': this.value1 = 1; break;
					case 'open': this.value1 = 0; break;
					case 'close': this.value1 = 100; break;
					case 'stop': this.value1 = 50;break;
				}
				if(this.rgbidx !== -1 || this.hueidx !== -1){
                    param = {
	                    name: this.devicename, //设备名称
	                    order: this.swich,   //动作
	                    value1: this.value1,
	                    value2: parseInt(this.saturation*255/100),
	                    value3: parseInt(this.color*655536/100),
	                    value4: parseInt(this.shine*255/100),
					}
                }else{
					param = {
						name: this.devicename, //设备名称
						order: this.swich,   //动作
						value1: this.value1,
                        value2: 0,
						value3: 0,
						value4: 0,
					}
                }

				deviceControl(param).then(res=>{
					//this.$toast(res.msg)
                })
			}
		},
        computed: {
	        // ...mapGetters(['room'])
        }
	}
</script>

<style lang="less" type="text/less" scoped>
    @import '../styles/basic.less';
    /*.swich{width:60px;margin-left: 0.26rem;}*/
    /*.swich .box{width:60px;height:30px;background:#ccc;border-radius:20px;transition: all .5s ease;}*/
    /*.swich input{display:none;}*/
    /*.swich .box span{display:inline-block;height:30px;width:30px;border-radius:15px;background:#fff;transform:translateX(0px);transition: all .5s ease;}*/
    /*.swich-on .box{background:forestgreen;transition: all .5s ease;}*/
    /*.swich-on .box span{transform:translateX(30px);transition: all .5s ease;}*/
    #check {padding-left: 0.26rem;}
    #check .input_check {position: absolute;width: 20px;height: 20px;visibility: hidden;}
    #check span {position: relative; display: inline-block; vertical-align: middle;}
    #check .pr{margin-right: 0.1rem;}
    #check .input_check+label {display: inline-block;width: 20px;height: 20px;border: 1px solid skyblue;}
    #check .input_check:checked+label:after {content: "";position: absolute;left: 6px;bottom: 14px;width: 9px;height: 4px; border: 2px solid #ef7f5d;border-top-color: transparent;border-right-color: transparent; -ms-transform: rotate(-60deg); -moz-transform: rotate(-60deg); -webkit-transform: rotate(-60deg); transform: rotate(-45deg);}
    .page {
        margin: 0 @margin;
    }

    .btn-group {
        font-size: 0;
        position: fixed;
        /*bottom: 0.5rem;*/
        left: 0;
        right: 0;
        z-index: 6;
        & > section {
            width: 33%;
            display: inline-block;
            margin: 0 auto;
            &:nth-child(1) {
                img {
                    width: 0.18rem;
                }
            }
            &:nth-child(2) {
                img {
                    width: 0.22rem;
                }
            }
            &:nth-child(3) {
                img {
                    width: 0.26rem;
                }
            }
            .button {
                margin: 0 auto;
                background: @orange;
                width: 0.42rem;
                height: 0.42rem;
                border-radius: 50%;
                position: relative;
                img {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
        }
    }

    .popupContainer {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 8;
        .popup {
            margin: 0 @margin;
            background: #fff;
            z-index: 2;
            position: relative;
            border-radius: 20px;
            .trangle {
                width: 0.1rem;
                height: 0.1rem;
                background: #fff;
                transform: rotate(45deg);
                position: absolute;
                top: -0.05rem;
            }
        }
        &:before {
            content: "";
            position: absolute;
            z-index: 0;
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
            background: #ccc;
            opacity: 0.8;
            overflow: hidden;
        }
    }

    .body {
        padding: 0.1rem 0 0 0;
        .progress {
            padding: 0 0.26rem;
        }
        .progress div {
            padding-bottom: 0.12rem;
            span {
                padding-left: 0.06rem;
                &:extend(.orange);
            }
        }
    }

    .group {
        text-align: center;
        overflow: hidden;
        margin-top: 6px;
        border-top: 1px solid #eee;
        .btnRadio {
            padding: 0.1rem 0px;
            float: left;
            width: 50%;
            box-sizing: border-box;
        }
    }
</style>
