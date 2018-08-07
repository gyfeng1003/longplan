import fetch from  '../utils/fetch';

export function register(params) {
  return fetch({
    url: 'user/register',
    method: 'POST',
    data: JSON.stringify(params)
  })
}
export function login(params) {
  return fetch({
    url: 'user/login',
    method: 'POST',
    data: JSON.stringify(params)
  })
}
export function gerValidateCode(params) {
  return fetch({
    url: 'user/getVerifyCode',
    method: 'POST',
    data: JSON.stringify(params)
  })
}

export function getRoomList(param) {
	console.log(param.locale,'locale');
  return fetch({
    url: param.locale=='en'?'device/getEnglishEditionRoomName':'datas/getRoomList',
    method: 'GET',
   // param: JSON.stringify(params)
  })
}

export function getRealTimeData() {
  return fetch({
    url: 'datas/getAllDataNewest',
    method: 'GET',
  })
}

export function getChartData() {
  return fetch({
    url: 'datas/getAllDataOld',
    method: 'GET',
  })
}

//获取设备列表
export function getDevices(param) {
  return fetch({
    url: param.locale == 'en'?'device/getEnglishEditionDeviceNameGroupByRoom':'device/getDeviceListNoScence',
    method: 'GET'
  })
}

//设备控制
export function deviceControl(params) {
	return fetch({
		url: 'device/singleControl',
		method: 'POST',
		data: JSON.stringify(params)
	})
}

export function ParamsEvaluate(param) {
	return fetch({
		url: 'datas/ParamsEvaluate?level='+param.id,
		method: 'GET'
	})
}

export function sceneList(param) {
	return fetch({
		url: param.locale=='en'?'device/getEnglishEditionSceneName':'device/getSceneList',
		method: 'GET'
	})
}
