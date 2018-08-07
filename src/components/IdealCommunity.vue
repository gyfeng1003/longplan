<template>
  <div class="page">
    <div v-for="(ratio,index) in ratios">
      <Progress :data="ratio"></Progress>
    </div>
    <section class="level">
      <div class="font16 text">{{$t("community.title")}}</div>
      <Star :ratio="0.86"></Star>
      <div>
        {{$t("community.congrate")}}
      </div>
      <div><a class="orange" @click="tellFriend">{{$t('community.tellFriend')}}></a></div>
    </section>
    <section>
      <section class="font14 service"><span>{{$t('community.share')}}</span><span></span></section>
      <Device :list="shares"/>
    </section>
    <section>
      <section class="font14 service"><span>{{$t('community.service')}}</span><span></span></section>
      <Device :list="services"/>
    </section>
    <section class="shareModal" v-show="shareModal">
      <section class="layer"></section>
      <section class="share">
        <section @click="shareSina">新浪微博</section>
        <section @click="shareQQzone">QQ空间</section>
        <section @click="shareQQ">QQ</section>
        <section @click="closeModal" class="close"><img src="../images/close.png"/></section>
      </section>
    </section>
  </div>
</template>

<script>
    import Progress from './child/Progress';
    import Star from './child/Star';
    import Device from './child/Device';
    import {getRealTimeData} from '../api/api';
    import {mapGetters} from 'vuex';
    export default {
        name: "ideal-community",
        data(){
          return{
            ratios: [],
            shares: [{name: this.$t('community.tools')},{name: this.$t('community.fresh')},{name: this.$t('community.fitting')},
              {name: this.$t('community.book')},{name: this.$t('community.space')},{name: this.$t('community.other')}],
            services: [{name: this.$t('community.repaire')},{name: this.$t('community.pay')},{name: this.$t('community.mail')},
              {name: this.$t('community.express')},{name: this.$t('community.house')},{name: this.$t('community.car')}],
            shareModal: false
          }
        },
        components:{
          Progress,
          Star,
          Device
        },
        mounted(){
	       console.log(this.props);
	       this.ratios.push({
		       name: this.$t("community.pgtext"), value: this.props.pg, total: 90
           },{
		       name: this.$t("community.ectext"), value: this.props.pu, total: 90
           },{
		       name: this.$t("community.waterc"), value: this.props.waterc, total: 400
	       })
        },
	    computed:{
		    ...mapGetters(['props'])
	    },
        methods: {
          tellFriend(){
            this.shareModal = true;
          },
          closeModal(){
            this.shareModal = false;
          },
          shareSina() {
            //分享到新浪微博
            var sharesinastring = 'http://service.weibo.com/share/share.php?title=' + 'LONG-PLAN' + '&url=' + 'http://www.baidu.com';
            window.location.href = sharesinastring;
          },
          shareQQzone() {
            var p = {
              url: location.href,
              showcount: '0', /*是否显示分享总数,显示：'1'，不显示：'0' */
              desc: '', /*默认分享理由(可选)*/
              summary: '', /*分享摘要(可选)*/
              title: '节能环保', /*分享标题(可选)*/
              site: 'LONG-PLAN', /*分享来源 如：腾讯网(可选)*/
              pics: '', /*分享图片的路径(可选)*/
              style: '203',
              width: 98,
              height: 22
            };
            //分享到QQ空间
            var sharesinastring = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=' + 'LONG-PLAN' + '&url=' + 'http://www.baidu.com' + '&site="满艺网"';
            window.location.href = sharesinastring;
          },
          shareQQ() {
            var p = {
              url: location.href, /*获取URL，可加上来自分享到QQ标识，方便统计*/
              desc: '', /*分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/
              title: '', /*分享标题(可选)*/
              summary: '', /*分享摘要(可选)*/
              pics: '', /*分享图片(可选)*/
              flash: '', /*视频地址(可选)*/
              site: '满艺网', /*分享来源(可选) 如：QQ分享*/
              style: '201',
              width: 32,
              height: 32
            };
            //分享到QQ
            var sharesinastring = 'http://connect.qq.com/widget/shareqq/index.html?title=' + 'LONG-PLAN' + '&summary=' + 'http://www.baidu.com' + '&url=' + 'http://www.baidu.com' + '&site="满艺网"';
            window.location.href = sharesinastring;
          }
        }
    }
</script>

<style lang="less" type="text/less" scoped>
  @import "../styles/basic";
  .page{
    margin: 0 @margin;
  }
  .shareModal{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .layer{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0, 0.2);
    }
    .share{
      position: absolute;
      z-index: 2;
      background: #fff;
      left: 0;
      right: 0;
      bottom: 0;
      height: 24%;
      .close{
        position: absolute;
        right: 8px;
        top: 6px;
        img{
          width: 0.24rem;
          height: 0.24rem;
        }
      }
    }
  }
  .level{
    padding: 0.06rem 0.32rem;
    font-size: 12px;
    text-align: center;
    div{
      padding: 0.1rem 0;
    }
  }
  ul{
    margin: 0 auto;
    width: 68%;
  }
  ul li{
    float: left;
    text-align: center;
    width: 20%;
    img{
      width: 0.28rem;
    }
  }
  .text{
    text-align: center;
  }
  .service{
    padding-bottom: 0.24rem;
      white-space: nowrap;
    span{
      display: inline-block;
      &:first-of-type{
        width: 20%;
      }
      &:last-of-type{
        width: 80%;
        border-top: 1px solid #ccc;
        height: 1px;
      }
    }
  }
</style>
