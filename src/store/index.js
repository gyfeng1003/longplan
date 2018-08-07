import Vue from 'vue';
import Vuex from 'vuex';
import {gerValidateCode, getRoomList} from '../api/api';


Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    code: '',
    rooms: [],
	user: '',
	props:''
  },
  getters: {
    code: (state)=>{
      return state.code;
    },
    rooms: (state)=>{
      return state.rooms;
    },
	  props: (state)=>{
		  return state.props;
	  }
  },
  mutations: {
    SET_CODE(state, payload){
      state.code = payload;
    },
    SET_ROOM(state, payload){
      state.rooms = payload;
    },
	  SET_PROP(state, payload){
		  state.props = payload;
	  },
  },
  actions: {
    getCode(context, payload){
      return new Promise((resolve, reject)=>{
        gerValidateCode(payload).then(res=>{
          context.commit("SET_CODE", res.code);
          resolve(res.code);
        });
      })
    },
    getRooms(context, payload){
      return new Promise((resolve, reject)=>{
        var rooms = [];
        getRoomList(payload).then(res=>{
        	if(payload.locale == 'en'){
		        res.roomList = res.roomList || [];
		        res.roomList.forEach((data, index)=>{
			        rooms.push(data.showName)
		        })
	        }else{
		        res.roomList = res.roomelist || {};
		        for(var key in res.roomList){
			        rooms = rooms.concat(res.roomList[key]);
		        }
	        }
	        console.log(rooms);
	        context.commit("SET_ROOM", rooms);

	        resolve();
        })
      })
    },
	setRealData(context, payload){
		context.commit("SET_PROP", payload.prop);
	}
  }
})

export default store;
