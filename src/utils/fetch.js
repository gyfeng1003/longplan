import axios from 'axios';
import qs from 'querystring';
import Vue from 'vue';

// 创建axios实例
const service = axios.create({
   baseURL: 'http://59.110.239.89:8080/smartHome/', // api的base_url
	//baseURL: '/',
  timeout: 15000,                  // 请求超时时间
  headers: {'Content-Type': 'application/json'}
})
// service.defaults.transformRequest = [data => qs.stringify(data)];

// request拦截器
service.interceptors.request.use(config => {
  if(config.url != 'datas/getAllDataNewest' && config.url != 'datas/getAllDataOld'){
    // Vue.$loading.show({
    //   text: '加载中'
    // })
	  Vue.$loading.show({
		  text: 'Loading'
	  })
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
  const res = response.data;
  Vue.$loading.hide();
  return new Promise(resolve => {
    resolve(res)
  }, error=>{
    console.log('err' + error)// for debug
    Promise.reject(error)
  });
}, error => {
  Vue.$loading.hide();
  console.log('err' + error)// for debug
  return Promise.reject(error)
})

export default service
