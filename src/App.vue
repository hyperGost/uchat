<style>
#app .mu-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
}
</style>
<template>
  <div id="app">
    <!-- 显示路由后得到信息 页面组件的存储 -->
    <router-view />
    <mu-bottom-nav
      v-show="
        $route.path == '/'
          ? true
          : $route.path == '/contacts'
          ? true
          : $route.path == '/me'
          ? true
          : $route.path == '/message'
          ? true
          : false
      "
      :value.sync="shift"
      @change="show"
      shift
    >
      <mu-bottom-nav-item
        value="/"
        title="聊天"
        icon="group"
      ></mu-bottom-nav-item>
      <mu-bottom-nav-item
        value="/message"
        title="消息"
        icon="chat"
      ></mu-bottom-nav-item>
      <mu-bottom-nav-item value="/contacts" title="好友" icon="person">
      </mu-bottom-nav-item>
      <mu-bottom-nav-item
        value="/me"
        title="我的"
        icon="account_circle"
      ></mu-bottom-nav-item>
    </mu-bottom-nav>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["offlineMessage", "friends"]),
  },
  data() {
    return {
      client: "",
      shift: "/",
    };
  },
  methods: {
    show() {
      this.$router.push(this.shift);
    },
  },
  watch: {
    $route(to, from) {
      this.shift = to.path;
    },
  },
  mounted() {
    //自动登录
    let client = (this.client = this.$store.state.client);
    if (this.$store.state.logined == "true") {
      this.$store.commit("log", { type: "auto" });
    }
    //监听服务器发送的用户id
    client.on("sendIndex", (data) => {
      this.$store.commit("getIndex", data);
    });

    //监听服务器发送的聊天室信息
    client.on("sendRoomInfo", (data) => {
      this.$store.commit("setRoomInfo", data);
    });
    client.on("joinedRoom", (data) => {
      this.$store.commit("setRoomIndex", data);
    });
    //监听有人加入了房间
    client.on("peopleChange", (data) => {
      this.$store.commit("peopleChange", data);
    });
    //监听别人创建房间成功
    client.on("othersAddedRoom", (data) => {
      this.$store.commit("PRoomChange", {
        type: "add",
        roomName: data.roomName,
        index: data.index,
      });
    });
    //监听登录状态
    client.on("logResult", (data) => {
      var friendRequest = [];
      for (var key in data.result.offlineMessage.friendRequest) {
        friendRequest.push({
          ...data.result.offlineMessage.friendRequest[key],
        });
      }
      data.result.offlineMessage.friendRequest = friendRequest;
      //自动登录
      if (data.code == 1 && data.type == "auto") {
        this.$store.commit("userInit", {
          logined: "true",
          nickname: data.result.nickname,
          id: data.result.id,
          friends: data.result.friends,
          offlineMessage: data.result.offlineMessage,
        });
        this.$toast.message({
          message: "欢迎来到UChat",
          position: "top",
          close: false,
        });
      }
      //不是自动登录
      else if (data.code == 1) {
        this.$alert("登录成功", "恭喜", {
          okLabel: "OK!",
          type: "success",
          transition: "slide-top",
          icon: "done",
        }).then(() => {
          localStorage.setItem("logined", "true");
          this.$store.commit("userInit", {
            logined: "true",
            nickname: data.result.nickname,
            id: data.result.id,
            friends: data.result.friends,
            offlineMessage: data.result.offlineMessage,
          });
          var obj = {
            freeUname: this.$store.state.userName,
            freePwd: this.$store.state.password,
          };
          localStorage.setItem("myFreeChat", JSON.stringify(obj));
          this.$router.push("/");
        });
      }
      //密码错误
      else if (data.code == 0) {
        this.$alert("用户名或密码错误", "登录失败", {
          okLabel: "知道了",
          type: "error",
          transition: "slide-bottom",
          icon: "info",
        });
      }
    });

    //监听注册是否成功
    client.on("regResult", (data) => {
      if (data == 1) {
        this.$alert("注册成功", "恭喜", {
          okLabel: "OK!",
          type: "success",
          transition: "slide-top",
          icon: "done",
        });
      } else if (data == 0) {
        this.$alert("用户名已存在", "注册失败", {
          okLabel: "知道了",
          type: "error",
          transition: "slide-bottom",
          icon: "info",
        });
      }
    });

    //监听好友请求
    client.on("friendRequest", (data) => {
      this.offlineMessage.friendRequest.push(data);
    });
    //监听被添加人是否同意添加好友 对方同意就把他加入好友列表
    client.on("addFriendBack", (data) => {
      this.friends.push(data);
    });
    //监听删除好友服务器的返回结果
    //页面刷新或者关闭
    window.onbeforeunload = () => {
      this.client.emit("off", {
        roomId: this.$store.state.roomId,
        roomIndex: this.$store.state.roomIndex,
      });
    };
  },
};
</script>
