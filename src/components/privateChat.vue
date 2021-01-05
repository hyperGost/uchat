<style>
#private_chat {
  z-index: 1000;
  position: relative;
  width: 100%;
  top: 0;
  left: 100%;
  bottom: 0;
  display: none;
}
#private_chat > .header {
  position: absolute;
  width: 100%;
  height: 153px;
  background: url("../assets/images/timeline1.png") center center no-repeat;
  background-size: 100% 100%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#private_chat > .header > .chat_avatar {
  width: 68px;
  height: 68px;
  border: 3px solid #fff;
  border-radius: 50%;
  margin-bottom: 10px;
}
#private_chat > .header > .chat_name {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-top: 10px;
}
#private_chat .is_me .circle {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-sizing: border-box;
  border: solid 2px rgba(255, 255, 255, 0.7);
  border-top-color: #4fc1e9;
  /* #4FC1E9 */
  left: -24px;
  top: 0;
  bottom: 0;
  margin: auto;
  animation: spin 0.7s infinite ease-in-out;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
#private_chat #msg_box_parent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: #f4f4f4;
  z-index: 999;
}
#private_chat #chat_lists {
  padding-top: 500px;
  width: 375px;
  overflow-y: auto;
  position: relative;
  margin-top: 70px;
}
#private_chat #msg_item > img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
#private_chat #msg_item {
  position: relative;
  display: flex;
  font-family: "SimHei", "KaiTi", "YouYuan", "FangSong", "SimSun";
  font-size: 16px;
  align-items: flex-start;
  line-height: 1.5;
  padding: 0 16px 16px;
}
#private_chat #msg_item > .msg_content {
  position: relative;
  padding: 8px 16px;
  margin: 0 10px;
  box-shadow: 0px 3px 4px 1px #a8e2f9;
}
#private_chat .is_me {
  flex-direction: row-reverse;
  justify-content: flex-start;
}
#private_chat .is_me > .msg_content {
  border-radius: 16px 0 16px 16px;
  background-color: #edfaff;
  color: #4fc1e9;
}
#private_chat .not_me > .msg_content {
  background-color: #fff;
}
#private_chat .not_me > .msg_content {
  border-radius: 0 16px 16px 16px;
}
#private_chat .chat_input {
  position: fixed;
  width: 345px;
  height: 45px;
  box-shadow: 0 0 10px rgba(5, 28, 54, 0.15);
  bottom: 45px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#private_chat .chat_input > input {
  vertical-align: middle;
  width: 80%;
  height: 100%;
  border: 1px solid red;
}
#private_chat .send_msg {
  height: 100%;
}
#private_chat .back_room {
  border: 1px solid red;
  position: absolute;
  z-index: 300;
}
#private_chat .back_private {
  z-index: 1001;
  position: fixed;
  top: 0;
  right: 0;
}
</style>
<template>
  <div id="private_chat">
    <mu-button
      class="back_private"
      @click="backPrivate"
      :style="{ position: position ? 'fixed' : 'absolute' }"
      icon
    >
      <mu-icon value="clear" size="32" color="#f44336"></mu-icon>
    </mu-button>
    <header
      class="header"
      :style="{ position: position ? 'fixed' : 'absolute' }"
    >
      <img class="chat_avatar" src="../assets/avatar/10.jpg" alt="" />
      <span class="chat_name">Miro Badev</span>
    </header>
    <!-- 用户聊天消息的父元素 appendChild的那个元素 -->
    <div id="msg_box_parent">
      <div id="chat_lists" class="msg_box">
        <div v-for="(e, k) of msgLists" :key="k" id="msg_item" :class="e.class">
          <img class="user_avatar" :src="avatarSrc" alt="" />
          <div class="msg_content">
            <div v-if="e.class == 'is_me'" class="circle"></div>
            {{ e.content }}
          </div>
        </div>
        <router-link to="/room/default" :key="$route.fullPath"
          >回到首页</router-link
        >
        <div class="chat_input">
          <input v-model="msgValue" id="message" type="text" />
          <button class="send_msg" @click="sendMsg">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      animationShow: false,
      chatBox: "",
      client: "",
      myIndex: "",
      avatarSrc: "",
      msgValue: "",
      msgLists: [],
    };
  },
  props: ["position"],
  methods: {
    backRoom() {
      this.myClass = "private_chat";
    },
    sendMsg() {
      this.client.emit("sendPrivateMsg", {
        content: this.msgValue,
        id: this.$store.state.privateId,
        index: this.$store.state.index,
      });
      this.msgLists.push({ content: this.msgValue, class: "is_me" });
      this.msgValue = "";
    },
    backPrivate() {
      this.$emit("backPrivate", "");
      // console.log(this.position);
    },
  },
  updated: function() {
    //this.chatBox.scrollIntoView({block:"end"})
  },
  beforeDestroy() {
    this.$store.state.client.removeAllListeners("privateBack");
  },
  mounted() {
    this.client = this.$store.state.client;
    this.myIndex = this.$store.state.index;
    var msgParent = document.getElementById("msg_box_parent");
    msgParent.style.minHeight = window.screen.height + "px";
    //这个页面是公共聊天室 只要这个页面被加载就是加入公共聊天室
    this.avatarSrc = require("../assets/avatar/0.jpg");
    //向服务器广播加入了房间 发送房间号
    //服务器收到我已加入房间 并且返回我在房间的位置
    this.client.on("privateBack", (data) => {
      //console.log("我问问")
      if (data.index == this.myIndex) {
        var circle = document.querySelector(".circle");
        circle.remove();
      } else {
        this.msgLists.push({ content: data.content, class: "not_me" });
      }
    });
  },
};
</script>
