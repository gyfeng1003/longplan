<template>
    <scroller>
        <div class="page">
            <div class="logo"><img src="../images/logo.png"/>
                <span class="info"><span class="greet">{{time}}，</span><span class="orange user">{{username}}</span>&nbsp;&nbsp;
          <span @click="loginOut" style="text-decoration: underline;">{{$t("main.quit")}}</span></span>
            </div>
            <section class="menu-container">
                <ul class="clearfix">
                    <li :class="{'active': num == index}" @click="switchTab(index)" v-for="(menu, index) in menus">
                        {{menu}}
                    </li>
                </ul>
            </section>
            <component :is="currentView"></component>
        </div>
    </scroller>
</template>

<script>
  import {getToken} from "../utils/auth";
  import RealTimeData from '../components/RealTimeData';
  import SceneScheme from '../components/SceneScheme';
  import DeviceControl from '../components/DeviceControl';
  import IdealCommunity from '../components/IdealCommunity';
    export default {
        data(){
          return{
            num: 0,
            menus: [this.$t('main.realtimedata'), this.$t('main.scenectr'), this.$t('main.equipctr'),  this.$t('main.samrtsoc')],
            arr: ['RealTimeData', 'SceneScheme', 'DeviceControl', 'IdealCommunity'],
            time:'',
            username: ''
          }
        },
        components: {
          RealTimeData,
          SceneScheme,
          DeviceControl,
          IdealCommunity
        },
        computed: {
          currentView(){
            return this.arr[this.num];
          }
        },
        mounted(){
	        let now = new Date();
	        let hour = now.getHours();
	        if(hour < 6){this.time = this.$t('main.goodm1')}
	        else if (hour < 9){this.time = this.$t('main.goodm2')}
	        else if (hour < 12){this.time =  this.$t('main.goodm3')}
	        else if (hour < 14){this.time = this.$t('main.goodnoon')}
	        else if (hour < 17){this.time =  this.$t('main.goodaf')}
	        else if (hour < 19){this.time = this.$t('main.goodn1')}
	        else if (hour < 22){this.time = this.$t('main.goodn2')}
	        else {this.time =this.$t('main.good3')}
            this.$nextTick(function () {
                document.body.style.height = '100%';
            })
	        this.username = getToken().username;
        },
        methods: {
          switchTab(num){
            this.num = num;
          },
          loginOut(){
            this.$router.push({
              path: '/'
            })
          }
        }
    }
</script>

<style lang="less" type="text/less" scoped>
  @import "../styles/basic.less";
  .menu-container{
    border-radius: 20px;
    box-shadow: 0px 0px 0.32rem 0.0016rem #ccc;
    margin: 0 0.2rem;
  }
  .greet{
      width: 0.72rem;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
  }
  .logo{
    height: 80px;
    margin: 0 @margin;
    position: relative;
    img{
      max-width: 50%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .info{
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.16rem;
    }
  }
  ul{
    overflow: hidden;
  }
  ul li{
    float: left;
    width: 25%;
    text-align: center;
    height: 0.28rem;
    line-height: 0.28rem;
    box-sizing: border-box;
    &:extend(.font12);
  }
  .user{
      display: inline-block;
      width: 0.4rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: middle;
  }
  @media screen and (min-width: 415px) {
      .user{
          width: auto;
      }
      .greet{
          width: auto;
      }
      .logo{
          margin-top: 20px;
          margin-bottom: 20px;
      }
      ul li{
          height: 0.36rem;
          line-height: 0.36rem;
      }
      .active{
          border-radius: 24px;
      }
  }
</style>
