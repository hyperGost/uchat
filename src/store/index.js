import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    client: io("ws://uchat03.applinzi.com"),
    // client: io("ws://localhost:5050"),
    index: "",
    defaultRoom: {},
    publicRoom: [],
    roomId: "no",
    roomIndex: "no",
    msgLists: [],
    privateId: "",
    logined: localStorage.getItem("logined"),
    userName: localStorage.getItem("myFreeChat")
      ? JSON.parse(localStorage.getItem("myFreeChat")).freeUname
      : "",
    password: localStorage.getItem("myFreeChat")
      ? JSON.parse(localStorage.getItem("myFreeChat")).freePwd
      : "",
    userId: "",
    nickname: "",
    avatar: "",
    friends: [],
    offlineMessage: { friendRequest: [], message: [] },
    delFriendStatus: false,
  },
  getters: {},
  mutations: {
    //获取客户端对象
    setClient(state, payload) {
      state.client = payload;
    },
    //获取个人连接ID
    getIndex(state, payload) {
      state.index = payload;
    },
    //初始化聊天室信息
    setRoomInfo(state, payload) {
      state.defaultRoom = payload[0];
      state.publicRoom = payload[1];
    },
    //有人加入或者退出聊天室
    peopleChange(state, payload) {
      if (payload.room == "default" && payload.type == "join") {
        Vue.set(state.defaultRoom, Object.keys(state.defaultRoom).length, {
          id: payload.id,
          nickname: payload.nickname,
          userId:payload.userId
        });
      } else if (payload.room == "default" && payload.type == "out") {
        Vue.delete(state.defaultRoom,payload.index);
      } else if (payload.type == "join") {
        var pIndex=Object.keys(state.publicRoom[Number(payload.room)].people).length;
        Vue.set(
          state.publicRoom[Number(payload.room)].people,
          pIndex,
          {id: payload.id,
          nickname: payload.nickname,
          userId:payload.userId
        })
      } else if (payload.type == "out") {
        Vue.delete(state.publicRoom[Number(payload.room)].people,payload.index);
      }
    },
    //设置当前进入的房间id
    setRoomId(state, payload) {
      state.roomId = payload;
    },
    //设置当前我在房间的索引 数组下标
    setRoomIndex(state, payload) {
      state.roomIndex = payload;
    },
    //添加聊天记录
    addMsg(state, payload) {
      state.msgLists.push(payload);
    },
    setPrivateId(state, payload) {
      state.privateId = payload;
    },
    PRoomChange(state, payload) {
      if (payload.type == "add") {
        state.publicRoom.push({ roomName: payload.roomName, people: [] });
      }
    },
    log(state, payload) {
      if (payload.type == "auto") {
        state.client.emit("login", {
          userName: state.userName,
          password: state.password,
          type: payload.type,
        });
      }
      // 不是自动登录
      else {
        state.userName = payload.userName;
        state.password = payload.password;
        state.client.emit("login", {
          userName: payload.userName,
          password: payload.password,
          type: payload.type,
        });
      }
    },
    userInit(state, payload) {
      //登录成功后设置登录状态
      state.logined = payload.logined;
      //登录成功后设置昵称
      state.nickname = payload.nickname;
      state.userId = payload.id;
      state.friends = payload.friends;
      state.offlineMessage = payload.offlineMessage;
    },
    deleteRes(state, payload) {
      state.delFriendStatus = false;
    },
  },
});
