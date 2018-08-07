<template>
    <section class="page">
      <Subtitle site="real"></Subtitle>
      <section class="chart_title">
        <section class="feedback">
          <section @click="toggleUpDown(1)" :class="{'on': idx==1}"><img src="../images/down.png"></section>
          <section @click="toggleUpDown(-1)" :class="{'on': idx==-1}"><img src="../images/down.png"></section>
        </section>
        <section class="orange"><span>{{series[series.length-1]}}</span>
          <span v-if="index==1">ppm</span>
          <span v-if="index==2||index==3">%RH</span>
          <span v-if="index==4||index==8">{{$t('RealTimeData.sheng')}}</span>
          <span v-if="index==5||index==9">{{$t('RealTimeData.kgwh')}}</span>
          <span v-if="index==6||index==7">{{$t('RealTimeData.wk')}}</span>
          <span v-if="index==10||index==11">℃</span>
        </section>
      </section>
      <LineChart id="chartGraph" :seriesData="series" :name="optname"></LineChart>
      <section class="container clearfix" style="display: flex;">
        <section class="left">
          <section class="propertyWraper">
            <section class="property" :class="{'select': index==1}" @click="choose(1)">
              <section class="name">CO2</section>
              <section class="value">
                <span class="font24">{{property.co2}}</span><span>ppm</span>
              </section>
            </section>
          </section>
          <section class="propertyWraper">
            <section class="property" :class="{'select': index==2}" @click="choose(2)">
              <section class="name">{{$t('RealTimeData.shineishidu')}}</section>
              <section class="value">
                <span class="font24">{{property.hum}}</span><span>%RH</span>
              </section>
            </section>
          </section>
          <section class="propertyWraper">
            <section class="property" :class="{'select': index==3}" @click="choose(3)">
              <section class="name">{{$t('RealTimeData.shiwaishidu')}}</section>
              <section class="value">
                <span class="font24">{{property.humout}}</span><span>%RH</span>
              </section>
            </section>
          </section>
          <section class="propertyWraper">
            <section class="property" :class="{'select': index==4}" @click="choose(4)">
              <section class="name">{{$t('RealTimeData.shuishouji')}}</section>
              <section class="value">
                <span class="font24">{{property.waterc}}</span><span>{{$t('RealTimeData.sheng')}}</span>
              </section>
            </section>
          </section>
        </section>
        <section class="middle">
          <section class="propertyWraper">
            <section class="property" :class="{'select': index==5}" @click="choose(5)">
              <section class="name">{{$t('RealTimeData.fadianliang')}}</section>
              <section class="value">
                <span class="font24">{{property.pg}}</span><span>{{$t('RealTimeData.kgwh')}}</span>
              </section>
            </section>
          </section>
          <section class="propertyWraper">
            <section class="property" :class="{'select': index==6}" @click="choose(6)">
              <section class="name">{{$t('RealTimeData.homepm')}}</section>
              <section class="value">
                <span class="font24">{{property.pm25}}</span><span>{{$t('RealTimeData.weik')}}</span>
              </section>
            </section>
          </section>
          <section class="propertyWraper">
            <section class="property" :class="{'select': index==7}" @click="choose(7)">
              <section class="name">{{$t('RealTimeData.shiwaipm')}}</section>
              <section class="value">
                <span class="font24">{{property.pm25out}}</span><span>{{$t('RealTimeData.weik')}}</span>
              </section>
            </section>
          </section>
          <section class="propertyWraper">
            <section class="property" :class="{'select': index==8}" @click="choose(8)">
              <section class="name">{{$t('RealTimeData.yongshuiliang')}}</section>
              <section class="value">
                <span class="font24">{{property.wu}}</span><span>{{$t('RealTimeData.sheng')}}</span>
              </section>
            </section>
          </section>
        </section>
        <section class="right">
          <section class="propertyWraper">
            <section class="property" :class="{'select': index==9}" @click="choose(9)">
              <section class="name">{{$t('RealTimeData.yongdianl')}}</section>
              <section class="value">
                <span class="font24">{{property.pu}}</span><span>{{$t('RealTimeData.kgwh')}}</span>
              </section>
            </section>
          </section>
          <section class="propertyWraper">
            <section class="property" :class="{'select': index==10}" @click="choose(10)">
              <section class="name">{{$t('RealTimeData.shineiwendu')}}</section>
              <section class="value">
                <span class="font24">{{property.temp}}</span><span>℃</span>
              </section>
            </section>
          </section>
          <section class="propertyWraper">
            <section class="property" :class="{'select': index==11}" @click="choose(11)">
              <section class="name">{{$t('RealTimeData.shiwaiwendu')}}</section>
              <section class="value">
                <span class="font24">{{property.tempout}}</span><span>℃</span>
              </section>
            </section>
          </section>
        </section>
      </section>
    </section>
</template>

<script>
    import Subtitle from './child/SubTitle';
    import LineChart from './child/LineChart';
    import {getRealTimeData, getChartData, ParamsEvaluate} from '../api/api';
    var timer;
    export default {
        name: "real-time-data",
        data(){
          return{
            idx: '',
            index: 1,
            list: [],
            series: [],
            property: {},
	          optname:''
          }
        },
        components: {
          Subtitle,
          LineChart
        },
        mounted(){
          this.init(()=>{
            clearInterval(timer);
            timer = setInterval(()=>{
              this.init();
            }, 3000);
          });
        },
        methods: {
          init(callback){
            Promise.all([getRealTimeData().then(res=>{
              if(res.status == 0){
                this.property = res.datas;
                this.$store.dispatch('setRealData', {prop: this.property});
              }
            }),getChartData().then(res=>{
              if(res.status == 0){
                this.list = {};

                for(var key in res.dataMap){
                  var val = [];
                    for(var i=0; i<Object.keys(res.dataMap[key]).length; i++){
	                    val.push(parseFloat(res.dataMap[key][i+'h']));
                    }
                  this.list[key] = val;
                }
              }
              console.log(this.list);
              this.choose(this.index);
            })]).then(()=>{
              if(callback && typeof callback == 'function'){
                callback();
              }
            })
          },
          choose(index){
            this.index = index;
            switch (index){
              case 1: this.series = this.list['co2']; this.optname = 'co2';break;
              case 2: this.series = this.list['hum']; this.optname = '室内湿度';break;
              case 3: this.series = this.list['humOut']; this.optname = '湿度';break;
              case 4: this.series = this.list['waterc']; this.optname = '用水量';break;
              case 5: this.series = this.list['pg']; this.optname = '发电量';break;
              case 6: this.series = this.list['pm2.5']; this.optname = '室内PM2.5';break;
              case 7: this.series = this.list['pm2.5Out']; this.optname = '室外PM2.5';break;
              case 8: this.series = this.list['wu']; this.optname = '用水量';break;
              case 9: this.series = this.list['pu']; this.optname = '用电量';break;
              case 10: this.series = this.list['temp']; this.optname = '室内温度';break;
              case 11: this.series = this.list['tempOut']; this.optname = '室外温度';break;
            }
            console.log(this.optname);
          },
          toggleUpDown(index){
            this.idx = index;
	          ParamsEvaluate({id:index}).then(res=>{
		          this.$toast(this.$t('RealTimeData.systemjilu'));
              })
          }
        },
        destroyed(){
          clearInterval(timer);
        }
    }
</script>

<style lang="less" type="text/less" scoped>
  @import "../styles/basic.less";
  .page{
    margin: 0 @margin;
  }
  .curPlace{
    font-size: 16px;
    padding: 0.2rem 0;
    .place{

    }
    .scheme{
      font-size: 14px;
      float: right;
    }
  }
  .propertyWraper{
    height: 0.85rem;
    width: 100%;
    margin-right: 0.32rem;
    margin-bottom: 0.16rem;
    .property{
      box-shadow: 0 0 0.4rem 0.004rem #ccc;
      height: 100%;
      box-sizing: border-box;
      .name{
        text-align: left;
        padding: 0.1rem 0 0 0.1rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
      }
      .value{
        text-align: center;
        padding: 0.1rem 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      &:nth-child(3n){
        margin-right: 0;
      }
    }
    &:extend(.font14);
  }
  .chart_title{
    height: 0.8rem;
    line-height: 0.8rem;
    position: relative;
    .orange{
      position: absolute;
      right: 30px;
      span{
        &:first-of-type{
          font-size: 0.6rem;
        }
        &:last-of-type{
          font-size: 0.4rem;
        }
      }
    }
    .feedback{
      section{
        position: relative;
        background: #999;
        width: 0.18rem;
        height: 0.18rem;
        line-height: 0.18rem;
        border-radius: 50%;
        img{
          width: 70%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        &:first-of-type{
          transform: rotate(180deg);
          position: absolute;
          top: 10px;
          right: 0;
        }
        &:last-of-type{
          position: absolute;
          bottom: 6px;
          right: 0;
        }
      }
    }
  }
  .on{
    background: @orange!important;
  }
  .container{
      .left{
          width: 30%;
          margin-right: 5%;
      }
      .middle{
          width: 30%;margin-right: 5%;
      }
      .right{
          width: 30%;
      }
  }
  @media screen and (min-width: 415px) {
      .container{
          .left{
              width: 32%;
              margin-right: 2%;
          }
          .middle{
              width: 32%;margin-right: 2%;
          }
          .right{
              width: 32%;
          }
      }
  }
</style>
