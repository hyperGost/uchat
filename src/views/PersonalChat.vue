<style>
#personal_chat .is_me .circle {
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
#personal_chat #msg_box_parent01 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: #f4f4f4;
  padding-bottom: 50px;
}
#personal_chat #chat_lists {
  width: 375px;
  overflow-y: auto;
  position: relative;
  margin-top: 70px;
}
#personal_chat #msg_item > img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
#personal_chat #msg_item {
  position: relative;
  display: flex;
  font-family: "SimHei", "KaiTi", "YouYuan", "FangSong", "SimSun";
  font-size: 16px;
  align-items: flex-start;
  line-height: 1.5;
  padding: 0 16px 16px;
}
#personal_chat #msg_item > .msg_content {
  position: relative;
  padding: 8px 16px;
  margin: 0 10px;
  box-shadow: 0px 3px 4px 1px #a8e2f9;
}
#personal_chat .is_me {
  flex-direction: row-reverse;
  justify-content: flex-start;
}
#personal_chat .is_me > .msg_content {
  border-radius: 16px 0 16px 16px;
  background-color: #edfaff;
  color: #4fc1e9;
}
#personal_chat .not_me > .msg_content {
  background-color: #fff;
}
#personal_chat .not_me > .msg_content {
  border-radius: 0 16px 16px 16px;
}
#personal_chat .chat_input {
  position: fixed;
  width: 100%;
  height: 45px;
  box-shadow: 0 0 10px rgba(5, 28, 54, 0.15);
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#personal_chat .chat_input > input {
  vertical-align: middle;
  width: 80%;
  height: 100%;
  border: none;
  border-top: 1px solid #2196f3;
  outline: none;
}
#personal_chat .send_msg {
  margin-right: 0.4em;
  height: 100%;
}
#personal_chat .people_list {
  border-bottom: 1px solid #e7ebee;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 15px;
}
#personal_chat .people_list .list_is_me {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  margin-right: 2em;
}
#personal_chat .people_list > .people_avatar {
  height: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
}
#personal_chat .people_list > .people_name {
  font-weight: 600;
  font-size: 15px;
  color: #597a96;
}
#personal_chat .people_top {
  height: 68px;
  border-bottom: solid 2px #5d9cec;
  background: url("../assets/icon/top-menu.png") center center no-repeat;
  background-size: 40px 37px;
}
#personal_chat .private_chat {
  left: 0 !important;
}
#personal_chat .back_room {
  position: absolute;
  z-index: 300;
}
</style>
<template>
  <div id="personal_chat">
    <my-private
      :class="privateChatClass"
      @backPrivate="backPrivate"
      :position="chatPosition"
      :style="myStyle"
    ></my-private>
    <div
      :style="{ minHeight: msgBoxHeight }"
      id="msg_box_parent01"
      ref="chatBox"
    >
      <div id="chat_lists" class="msg_box">
        <my-header>
          <mu-button slot="topLeft" @click="roomBack" icon>
            <mu-icon
              value="keyboard_arrow_left"
              size="38"
              color="primary"
            ></mu-icon>
          </mu-button>
          <div slot="people">
            <div class="people_top"></div>
            <div v-if="$store.state.roomId == 'default'">
              <div
                v-for="(e, k) in $store.state.defaultRoom"
                :key="k"
                class="people_list"
                @click="privateChat(e.id, e.userId)"
              >
                <img
                  class="people_avatar"
                  src="../assets/avatar/1.jpg"
                  alt=""
                />
                <span class="people_name"
                  >{{ e.nickname === "" ? "游客" + e.id : e.nickname }}
                </span>
                <mu-badge
                  v-if="e.id === index"
                  class="list_is_me"
                  content="自己"
                  color="primary"
                ></mu-badge>
              </div>
            </div>
            <div v-else>
              <div
                v-for="(e, k) of publicRoom"
                :key="k"
                class="people_list"
                @click="privateChat(e.id, e.userId)"
              >
                <img
                  class="people_avatar"
                  src="../assets/avatar/1.jpg"
                  alt=""
                />
                <span class="people_name"
                  >{{ e.nickname === "" ? "游客" + e.id : e.nickname }}
                </span>
                <mu-badge
                  v-if="e.id === index"
                  class="list_is_me"
                  content="自己"
                  color="primary"
                ></mu-badge>
              </div>
            </div>
          </div>
        </my-header>
        <div v-for="(e, k) of msgLists" :key="k" id="msg_item" :class="e.class">
          <img class="user_avatar" :src="avatarSrc" alt="" />
          <div class="msg_content">
            <div v-if="e.class == 'is_me'" class="circle"></div>
            {{ e.content }}
          </div>
        </div>
        <!-- <router-link to="/" :key="$route.fullPath">回到首页</router-link> -->
        <div class="chat_input">
          <input v-model="msgValue" id="message01" type="text" />
          <mu-button class="send_msg" @click="sendMsg" icon>
            <mu-icon value="send" color="primary" size="33"></mu-icon>
          </mu-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      msgBoxHeight: "667px",
      animationShow: false,
      chatBox: "",
      client: "",
      myIndex: "",
      avatarSrc: "",
      msgValue: "",
      msgLists: [],
      chatRoom: "public",
      roomId: "",
      roomIndex: "",
      privateName: "",
      privateChatClass: "",
      publicRoom: "",
      chatPosition: false,
      myStyle: {
        transition: "",
        display: "none",
      },
    };
  },
  computed: {
    ...mapState(["defaultRoom", "nickname", "index", "userId"]),
  },
  methods: {
    backPrivate() {
      this.privateChatClass = "";
      this.chatPosition = false;
      setTimeout(() => {
        this.myStyle = {
          transition: "",
          display: "none",
        };
      }, 215);
    },
    roomBack() {
      window.history.go(-1);
    },
    //点击私人聊天
    privateChat(name, userId) {
      let index = userId || name;
      if (name !== this.index) {
        setTimeout(() => {
          this.chatPosition = true;
        }, 210);
        //先设置display
        this.myStyle.display = "block";
        //再异步添加过渡动画 和 改变位置 使display:none和transition配合生效
        setTimeout(() => {
          this.myStyle.transition = "all 0.2s ease-in";
          this.privateChatClass = "private_chat";
        }, 0);
        this.$store.commit("setPrivateId", index);
      } else if (name === this.index) {
        this.$myToast("不能和自己聊天");
      }
    },
    sendMsg() {
      this.client.emit("sendMsg", {
        content: this.msgValue,
        index: this.myIndex,
        roomId: this.roomId,
      });
      this.msgLists.push({ content: this.msgValue, class: "is_me" });
      this.msgValue = "";
    },
  },
  beforeDestroy() {
    //此页面跳转到其他页面时清除监听
    this.$store.state.client.removeAllListeners("backMsg");
  },
  mounted() {
    //获取房间号
    var roomId = this.$route.params.roomId;
    //设置房间号
    this.$store.commit("setRoomId", roomId);
    //设置公共房间如果没有 就为空数组 有就把里面的people提出来
    if (roomId != "default")
      this.publicRoom =
        this.$store.state.publicRoom.length == 0
          ? []
          : this.$store.state.publicRoom[roomId].people;
    this.roomId = this.$store.state.roomId;
    this.client = this.$store.state.client;
    this.myIndex = this.$store.state.index;
    var chatBox = document.getElementById("chat_lists");
    this.chatBox = chatBox;
    var msgParent = document.getElementById("msg_box_parent");
    //这个页面是公共聊天室 只要这个页面被加载就是加入公共聊天室
    this.avatarSrc = require("../assets/avatar/0.jpg");
    //向服务器广播加入了房间 如果已经登录 发送房间号 发送昵称 如果没有登录 只发送房间号
    this.client.emit("joinRoom", {
      nickname:
        this.$store.state.logined == "true" ? this.$store.state.nickname : "",
      roomId: this.$store.state.roomId,
      userId: this.userId,
    });
    //服务器收到我已加入房间 并且返回我在房间的位置
    //监听发送消息后客户端的返回事件
    this.client.on("backMsg", (data) => {
      if (data.index == this.myIndex) {
        //返回会来id匹配说明自己发的消息已经发出去了 其他人已经接受到了 取消加载动画
        document.querySelector(".circle").remove();
      } else {
        this.msgLists.push({ content: data.content, class: "not_me" });
      }
    });
  },
  updated() {
    //消息框自动滚动到底部
    this.$refs.chatBox.scrollIntoView({ block: "end" });
  },
};
</script>
