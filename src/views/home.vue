<template>
  <div class="m-wrap">
    <div class="popup-loading">
      <div class="loading-wrap">
        <div class="loading-bar">
        </div>
        <div class="loading-text">
          0%
        </div>
      </div>
    </div>
    <div class="m-page">
      <div class="page-content">
        <div class="welcome">
          <h1 class="h1">{{$t('home.hello')}}</h1>
          <h1 class="h1 orange">LONG-PLAN</h1>
          <h1 class="h1 orange">{{$t('home.welcome')}}</h1>
        </div>
      </div>
      <div class="fixed-intro">
        <p>{{$t('home.fromehere')}}</p>
        <p>{{$t('home.open')}}</p>
        <div class="fixed-arrow">
          <img src="../images/fix-arrow.png"/>
        </div>
      </div>
    </div>
    <div class="m-page fn-hide login">
        <div class="page-content">
          <div class="mini-logo">
            <h1 class="h6 gray">TEAM</h1>
            <h1 class="h6 orange">SUT×POLITO</h1>
            <h1 class="h6 orange">SDC2018</h1>
          </div>
          <h1 class="h1 orange" style="padding-bottom: 2%;">LONG-PLAN</h1>
          <section class="portrait">
            <section class="headWraper" v-if="isLogin">
              <img src="../images/portrait.png"/>
              <!--<img src="../images/rabbit.jpg"/>-->
            </section>
            <section class="headWraper" v-else>
              <img src="../images/add1.png" id="headImg" class="head"/>
              <input class="change" type="file" @change="handleInputChange" id="img" />
            </section>
          </section>
          <div class="form" v-if="isLogin">
            <div class="filed username">
              <div class="text-left font-3">{{$t('home.username')}}</div>
              <input class="input" type="text" v-model="loginUser.username"/>
            </div>
            <div class="filed pwd">
              <div class="text-left font-3">{{$t('home.password')}}</div>
              <div class="text-left" style="position: relative;">
                <input class="input" v-model="loginUser.secretCode" style="width: 100%;" type="password" />
              </div>
            </div>
            <!--<div class="filed font-3">-->
              <!--<span @click="forgetPwd" class="orange" style="text-decoration: underline;">忘记密码？</span>-->
            <!--</div>-->
            <div class="padding" style="padding-top: 0.16rem;">
              <button @click="login()" class="btn search btn-primary" type="primary">{{$t('home.login')}}</button>
            </div>
            <div class="padding">
              <button @click="toggle()" class="btn btn-default" type="primary">{{$t('home.createaccount')}}</button>
            </div>
          </div>
          <div class="form" v-else>
            <div class="filed">
              <div class="text-left font-3">{{$t('home.email')}}</div>
              <input class="input" type="text" v-model="registerUser.email"/>
            </div>
            <!--<div class="filed">-->
              <!--<div class="text-left font-3">手机号码：</div>-->
              <!--<input class="input" type="text" v-model="registerUser.mobile"/>-->
            <!--</div>-->
            <div class="filed">
              <div class="text-left font-3">{{$t('home.username')}}</div>
              <input class="input" type="text" v-model="registerUser.username"/>
            </div>
            <div class="filed pwd">
              <div class="text-left font-3">{{$t('home.password')}}</div>
              <div class="text-left" style="position: relative;">
                <input class="input" v-model="registerUser.secretCode" style="width: 100%;" type="text" />
                <button @click="getValidCode" :class="{'isActive': isOvertime, '': !isOvertime }"
                        :style="{pointerEvents: disableObj}" class="btn validCode btn-primary" type="primary">{{param}}</button>
              </div>
            </div>
            <div class="padding" style="padding-top: 0.16rem;">
              <button @click="registUser()" class="btn search btn-primary" type="primary">{{$t('home.register')}}</button>
            </div>
            <div class="padding">
              <button @click="toggle()" class="btn btn-default" type="primary">{{$t('home.logindirectly')}}</button>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import 'Zepto';
  import 'zeptoSlidePage';
  import validate from '../utils/validator';
  import uploader from  '../utils/uploader';
  import { setToken } from '../utils/auth';
  import {register, login, gerValidateCode} from "../api/api";
  import {mapGetters} from 'vuex';

  export default {
    name: 'home',
    data () {
      return {
        loginUser:{
          // username: '2584903317@qq.com',
          // secretCode: '22'
          username: '',
          secretCode: ''
        },
        registerUser: {
          email: '',
         // mobile: '',
          username: '',
          secretCode: ''
        },
        param: this.$t('home.getpassword'),
        disableObj: 'auto',
        isOvertime: false,
        isLogin: true
      }
    },
    mounted(){
      var SlidePage = new window.SlidePage({
        lastReturnFirst: false
      })

    },
    computed: {
      ...mapGetters([
        'code'
      ])
    },
    methods: {
      async getValidCode(){
        let emailObj = {email: this.registerUser.email};
        if(!validate(emailObj, {
            email: [
              {
                type: 'email',
                message: this.$t('home.emailerror')
              },{
                type: () => {
                  if((!emailObj.email || !emailObj.email.trim())){
                    return true
                  }
                  return false;
                },
                message: this.$t('home.inputemail')
              }]}, this)){
          this.$store.dispatch("getCode", {toMail: emailObj.email}).then(res=>{
            this.$toast(this.$t('home.codetoeami'), 1500);
          })
          var time = 60;
          clearInterval(sendTimer);
          var sendTimer = setInterval(()=>{
            this.isOvertime = true;
            time--;
            this.param = this.$t('home.regetcode')+'('+time+')';
            this.disableObj = "none"
            if(time < 0){
              this.isOvertime = false;
              clearInterval(sendTimer);
              this.param = this.$t('home.getvcode');
              this.disableObj = "auto"
            }
          },600);
        }
      },
      async login(){
        if(!validate(this.loginUser, {
            username: {
              type: 'required',
              message: this.$t('home.inputfullinfo')
            },
            secretCode: {
              type: 'required',
              message: this.$t('home.inputfullinfo')
            }
        }, this)){
          let loginUser={
            account: this.loginUser.username,
            pass: this.loginUser.secretCode,
	        // locale: this.$i18n.locale
          }
          const res = await login(loginUser);
          console.log(res);
          if(res.msg == 'success'){
	          setToken(res.user);
	          this.$router.push({path: '/main'});
          }else{
              this.$toast(res.msg);
              return;
          }
        }
      },
      async registUser(){
          if(!validate(this.registerUser, {
              email: [
              {
                type: 'email',
                message: this.$t('home.emailerror')
              },{
                type: () => {
                  if((!this.registerUser.email || !this.registerUser.email.trim()) && (!this.registerUser.mobile || !this.registerUser.mobile.trim())){
                    return true
                  }
                  return false;
                },
                message: this.$t('home.registereorp')
              }],
              // mobile: [{
              //   type: 'mobile',
              //   message: '手机号格式不正确'
              // }, {
              //   type: () => {
              //     if((!this.registerUser.email || !this.registerUser.email.trim()) && (!this.registerUser.mobile || !this.registerUser.mobile.trim())){
              //       return true
              //     }
              //     return false;
              //   },
              //   message: '请注册邮箱或手机号码'
              // }],
              username: [
              {
                type: 'required',
                message: this.$t('home.inputusername')
              },{
                type: 'username',
                message: this.$t('home.inputrightformateuser')
              }],
              secretCode: {
                type: 'required',
                message: this.$t('home.inputpassword')
              }
            }, this)){
              let registerInfo = {
                email: this.registerUser.email,
                pass: this.registerUser.secretCode,
                username: this.registerUser.username,
                //locale: this.$i18n.locale
              }
              if(this.code == registerInfo.pass){
                const res = await register(registerInfo);
                if(res.status == 0){
                  this.$toast(this.$t('home.registersuccess'));
                  this.isLogin = true;
                }else{
                  this.$toast(res.msg);
                }
                console.log(res)
              }else{
                this.$toast(this.$t('home.passwordnotsame'));
              }
          }
      },
      forgetPwd(){
        let emailObj = {email: this.loginUser.username};
        if(!validate(emailObj, {
            email: [
              {
                type: 'email',
                message: this.$t('home.emailerror')
              },{
                type: () => {
                  if((!emailObj.email || !emailObj.email.trim())){
                    return true
                  }
                  return false;
                },
                message: this.$t('home.inputemail')
              }]}, this)){
          this.$store.dispatch("getCode", {toMail: emailObj.email}).then(res=>{
            this.$toast(this.$t('home.codetoeami'), 1500);
          })
        }
      },
      toggle(){
        this.isLogin = !this.isLogin;
      },
      handleInputChange(event){
        // 获取当前选中的文件
        const file = event.target.files[0];
        const imgMasSize = 1024 * 1024 * 10; // 10MB

        // 检查文件类型
        if(['jpeg', 'png', 'gif', 'jpg'].indexOf(file.type.split("/")[1]) < 0){
          // 自定义报错方式
          // Toast.error("文件类型仅支持 jpeg/png/gif！", 2000, undefined, false);
          return;
        }

        // 文件大小限制
        if(file.size > imgMasSize ) {
          // 文件大小自定义限制
          // Toast.error("文件大小不能超过10MB！", 2000, undefined, false);
          return;
        }
        // 封装好的函数
        const reader = new FileReader();
        reader.readAsDataURL(file);
        // file转dataUrl是个异步函数，要将代码写在回调里
        reader.onload = function(e) {
          var head = document.getElementById("headImg");
          head.classList.remove("head");
          head.src= reader.result;
        };
        uploader.upload(file, function (result) {
          console.log(result)
        })
      }
    }
  }
</script>
<style lang="less" type="text/less" scoped>
  @import "../styles/basic.less";
  .m-wrap{
    &::-webkit-scrollbar{
      display:none;
      width:0;
      height: 0;
    }
  }
  .btn-default{
    background: #fff;
    color: #999;
    padding: 0 0.26rem;
    border-radius: 0.2rem;
    height: 0.36rem;
    box-shadow: 0 0 0.3rem 0.002rem #ccc;
  }
  .portrait{
    .headWraper{
      width: 1rem;
      height: 1rem;
      line-height: 1rem;
      border-radius: 50%;
      margin: 0 auto;
      border: 2px solid @orange;
      box-sizing: border-box;
      position: relative;
      text-align: center;
      animation: sway 2s linear alternate;
      img{
        height: 100%;
        width: 100%;
        vertical-align: top;
        border-radius: 50%;
      }

      .head{
        width: 0.5rem;height: 0.5rem;transform: translateY(50%);
      }
    }
  }
  .form{
    .font-3{
      padding-left: 16px;
      color: #888;
    }
    .filed{
      width: 100%;
      padding-bottom: 0.06rem;
    }
    .text-left{
      text-align: left;
    }
    .isActive{
      background-color: #d5d5d3;
    }
    .input{
      width: 100%;
      outline: none;
      -webkit-appearance: none;
      height: @filedHeight;
      background-color: #ffffff;
      margin-top: 7px;
      padding-left: @filedHeight/2;
      display: block;
      border-radius:@filedHeight/2;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
    .search{
      width: 100%;
      height: @filedHeight;
      border-radius: @filedHeight/2;
      box-shadow: 0 0 0.4rem 0.002rem #d89a7a;
    }
    .padding{
      padding-bottom: 0.16rem;
      line-height: 0;
      text-align: center;
    }
    .validCode{
      width: 34%;
      font-size: .12rem;
      position: absolute;
      right: 0;
      top: 0;
      padding: 0;
      border-radius: @filedHeight / 2;
      line-height: @filedHeight;
      height: @filedHeight;
    }
  }
  .h1{
    font-weight: 500;
    line-height: 36px;
  }
  .h6{
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 2px;
  }
  .mini-logo{
    margin-top: 0.3rem;
    border-left: 20px solid @orange;
    padding-left: 10px;
    margin-bottom: 0.15rem;
  }
  .logo{
    height: 80px;
    position: relative;
    img{
      width: 50%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
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
    &:extend(.font12);
  }
  .menu-container{
    border-radius: 22px;
    box-shadow: 0px 0px 0.32rem 0.0016rem #ccc
  }
  .fn-hide { display: none!important; }
  .m-page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    overflow: scroll;
    overflow-x: hidden;
  }

  .m-page.page-active {
    z-index: 50;
  }
  .page-content{
    margin: 0 @margin;
  }
  .popup-loading {
    /*display: none;*/
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1010;
    width: 100%;
    height: 100%;
    background: #000;
    text-align: center;
    font-size:32px;
    color: #fff;
    -webkit-transform-style: preserve-3d;
  }

  .popup-loading .loading-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150px;
    height: 150px;
    margin: 0 0 0 -75px;
  }
  .popup-loading .loading-bar {
    position: absolute;
    top: -70px;
    left: 50%;
    width:60px;
    height:60px;
    margin-left: -30px;
    overflow:hidden;
    clip:rect(0 30px 60px 0);
    -webkit-animation:loading 1.2s linear infinite;
    -moz-animation:loading 1.2s linear infinite;
    animation:loading 1.2s linear infinite;
  }
  .popup-loading .loading-bar:before {
    display: block;
    content:'';
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    width: 60px;
    height: 60px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
    background: #fff;
    background: -webkit-gradient(linear,0 0,0 100%,from(rgba(255,255,255,1)),to(rgba(255,255,255,0)));
    background: -moz-linear-gradient(top,rgba(255,255,255,1),rgba(255,255,255,0));
    background: linear-gradient(top,rgba(255,255,255,1),rgba(255,255,255,0));
  }
  .popup-loading .loading-bar:after {
    display: block;
    content:'';
    position: absolute;
    top: 3px;
    left: 3px;
    z-index: 3;
    width:54px;
    height:54px;
    overflow:hidden;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    background-color: #000;
  }

  .fixed-arrow {
    height: 0.36rem;
    width: 100%;
    -webkit-animation: arrow 1.5s alternate ease-in-out infinite;
    -moz-animation: arrow 1.5s alternate ease-in-out infinite;
    animation: arrow 1.5s alternate ease-in-out infinite;
    img{
      width: 0.44rem;
      height: 100%;
    }
  }

  .fixed-intro{
    font-size: 0.14rem;
    font-size: 0.14rem;
    position: fixed;
    bottom: 0.4rem;
    left: 0;
    right: 0;
    text-align: center;
    color: #999;
  }

  @-webkit-keyframes arrow {
    0%{
      opacity: 0.6;
      -webkit-transform: translate3d(0, -3px, 0);
    }
    50% {
      opacity: 1;
      -webkit-transform: translate3d(0, 3px, 0);
    }
    100% {
      opacity: 0.6;
      -webkit-transform: translate3d(0, 0, 0);
    }
  }

  @-webkit-keyframes loading {
    0% {
      -webkit-transform: rotate(0deg);
    }
    25% {
      -webkit-transform: rotate(90deg);
    }
    50% {
      -webkit-transform: rotate(180deg);
    }
    75% {
      -webkit-transform: rotate(270deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  .m-page .welcome{
    margin-top: 25%;
    img{
      width: 50%;
    }
  }
  .change{
    position: absolute;
    overflow: hidden;
    right: 0;
    top: 0;
    opacity: 0;
    bottom: 0;
    width: 14vh;
  }
  .login{
    animation: fade ease-in-out 2s;
  }
  @keyframes fade {
    0%{
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }
  @-webkit-keyframes sway{
    0% {-webkit-transform:rotate(-30deg); }
    50% {-webkit-transform: rotate(30deg);}
    100% {-webkit-transform: rotate(0); }
  }
</style>
