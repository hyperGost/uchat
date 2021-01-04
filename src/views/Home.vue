<style>
#home {
  position: relative;
}
.default,
.public {
  border: 1px solid red;
  margin-bottom: 20px;
}
.public span {
  padding-left: 30px;
}
.public > .num {
  margin-top: 10px;
  border: 1px solid greenyellow;
  position: relative;
}
#home .addRoomBox {
  z-index: 310;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
#home .addRoomBox .addRoomItem {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  /* background:rgba(187, 222, 251, .6);  */
  background: rgba(187, 222, 251, 0.6);
  border-radius: 10px;
}
#mask {
  transition: all 0.3s ease-in;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #000;
  z-index: 309;
  opacity: 0;
}
#mask.mask_1 {
  opacity: 0.3;
}
#home .addFriendBox {
  background: rgba(187, 222, 251, 0.6);
  padding-right: 10px;
  border-radius: 10px;
}
</style>
<template>
  <div id="home">
    <mu-appbar color="primary">
      <mu-button slot="left" icon>
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      UCHAT
      <mu-menu slot="right" placement="bottom-start" popover-class="myclass">
        <mu-button icon>
          <mu-icon value="add"></mu-icon>
        </mu-button>
        <mu-list slot="content" v-click-outside="closeAddRoom">
          <mu-list-item button @click="addRoomShowFun">
            <mu-list-item-title>添加聊天室</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button @click="addFriendShowFun">
            <mu-list-item-title>添加好友</mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </mu-menu>
    </mu-appbar>
    <!-- 添加房间 -->

    <mu-flex
      @click="clickOnAddRoom = true"
      class="addRoomBox"
      :style="{ top: addRoomTop }"
    >
      <mu-slide-left-transition>
        <div class="addRoomItem" v-show="addRoomShow">
          <mu-text-field
            max-length="9"
            :error-text="roomNameError"
            v-model="newRoomName"
            color="primary"
            label="输入名字"
            label-float
            icon="phone"
            help-text="长度为2-9位的字符"
          ></mu-text-field>
          <mu-button @click="addPublicRoom" color="teal" flat>
            确定<mu-icon value="done" right></mu-icon>
          </mu-button>
        </div>
      </mu-slide-left-transition>
    </mu-flex>
    <mu-flex
      @click="clickOnAddRoom = true"
      class="addRoomBox"
      :style="{ top: addRoomTop }"
    >
      <mu-slide-left-transition>
        <div v-show="addFriendShow">
          <mu-flex class="addFriendBox" direction="column" align-items="center">
            <mu-text-field
              v-model="newFriendName"
              label-float
              label="输入昵称或者账号"
              help-text="长度为1-20位"
              max-length="20"
              :error-text="friendNameError"
              icon="person_add"
            >
            </mu-text-field>
            <mu-text-field
              v-model="helloMessage"
              label-float
              label="打个招呼"
              help-text="(选填)"
              max-length="50"
              icon="accessibility_new"
            ></mu-text-field>
            <mu-button @click="addFriend" color="teal" flat>
              确定<mu-icon value="done" right></mu-icon>
            </mu-button>
          </mu-flex>
        </div>
      </mu-slide-left-transition>
    </mu-flex>
    <div>
      当前聊天室列表
      <mu-list @click="joinRoom('default')">
        <mu-list-item avatar button ripple-color="#ff4081">
          <mu-list-item-action>
            <mu-avatar color="secondary" text-color="white">
              <mu-icon value="group"></mu-icon>
            </mu-avatar>
          </mu-list-item-action>
          <mu-list-item-title>UChat聊天室</mu-list-item-title>
          <mu-list-item-action>
            <mu-badge
              :content="String(Object.keys(defaultRoom).length)"
              color="secondary"
            ></mu-badge>
          </mu-list-item-action>
        </mu-list-item>
        <mu-divider></mu-divider>
      </mu-list>
      <!-- 公共聊天室 -->
      <mu-list>
        <mu-list-item
          v-for="(e, k) of $store.state.publicRoom"
          :key="k"
          @click="joinRoom(k)"
          avatar
          button
          ripple-color="#2196f3"
        >
          <mu-list-item-action>
            <mu-avatar color="primary" text-color="white">
              <mu-icon value="group"></mu-icon>
            </mu-avatar>
          </mu-list-item-action>
          <mu-list-item-title>{{ e.roomName }}</mu-list-item-title>
          <mu-list-item-action>
            <mu-badge
              :content="String(Object.keys(e.people).length)"
              color="primary"
            ></mu-badge>
          </mu-list-item-action>
        </mu-list-item>
        <mu-divider></mu-divider>
      </mu-list>
    </div>
    <!-- 默认公共聊天室 -->
    <div
      :style="{ display: maskDisplay ? 'block' : 'none' }"
      id="mask"
      :class="addRoomMask ? 'mask_1' : ''"
    ></div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      notifications: 22,
      addRoomShow: false,
      clickOnAddRoom: false,
      addFriendShow: false,
      newRoomName: "",
      addRoomMask: false,
      maskDisplay: false,
      maskTimeOut: "",
      addRoomTop: 0,
      roomNameError: "",
      newFriendName: "",
      friendNameError: "",
      helloMessage: "",
    };
  },
  computed: {
    ...mapState([
      "client",
      "index",
      "friends",
      "userName",
      "nickname",
      "userId",
      "defaultRoom",
    ]),
  },
  methods: {
    addRoomShowFun() {
      this.addRoomShow = !this.addRoomShow;
      if (!this.addFriendShow) {
        this.closeAddRoomMask(this.addRoomShow);
      }
      this.addFriendShow = false;
    },
    addFriendShowFun() {
      this.addFriendShow = !this.addFriendShow;
      if (!this.addRoomShow) {
        this.closeAddRoomMask(this.addFriendShowFun);
      }
      this.addRoomShow = false;
    },
    joinRoom(roomId) {
      this.$router.push("/room/" + roomId);
    },
    closeAddRoom() {
      var show = this.addFriendShow || this.addRoomShow;
      if (show && !this.clickOnAddRoom) {
        //关闭选框和遮罩
        this.onlyClose();
      } else if (show && this.clickOnAddRoom) {
        //不关闭 但是把开关放置为false
        this.clickOnAddRoom = false;
      }
    },
    onlyClose() {
      this.addRoomShow = false;
      this.addFriendShow = false;
      //300ms后让遮罩display:none 并且 清空定时器。
      this.maskTimeOut = setTimeout(() => {
        this.maskDisplay = false;
        this.maskTimeOut = "";
      }, 300);
      //触发关闭遮罩的动画 逐渐隐藏
      setTimeout(() => {
        this.addRoomMask = !this.addRoomMask;
      }, 0);
    },
    //在mask还没有完全消失的情况下反复触发mask开关用这个函数
    closeAddRoomMask(showItem) {
      if (showItem && !this.maskTimeOut) {
        this.maskDisplay = true;
      } else if (showItem && this.maskTimeOut) {
        clearTimeout(this.maskTimeOut);
        this.maskTimeOut = "";
      } else {
        this.maskTimeOut = setTimeout(() => {
          this.maskDisplay = false;
          this.maskTimeOut = "";
        }, 300);
      }
      setTimeout(() => {
        this.addRoomMask = !this.addRoomMask;
      }, 0);
    },
    addPublicRoom(e) {
      e.stopPropagation();
      var reg = /^(?!_)[\w\u4e00-\u9fa5]{2,9}(?<!_)$/;
      if (reg.test(this.newRoomName)) {
        this.onlyClose();
        this.client.emit("addPublicRoom", this.newRoomName);
        this.newRoomName = "";
        this.roomNameError = "";
      } else if (this.newRoomName.length == 0) {
        this.roomNameError = "名字不能为空";
      } else if (/^_.*|.*_$/.test(this.newRoomName)) {
        this.roomNameError = "不能以下划线开头或者结尾";
      } else if (this.newRoomName.length < 2) {
        this.roomNameError = "名字至少为两个字符";
      } else if (/\s/.test(this.newRoomName)) {
        this.roomNameError = "不能含有空格";
      } else this.roomNameError = "只能是数字·字母·下划线和汉字";
    },
    addFriend() {
      //字母数字下划线 汉字6-20位 不能以下划线开头和结尾
      var reg = /^(?!_)[\w\u4e00-\u9fa5]{1,20}(?<!_)$/;
      var friend = this.newFriendName.replace(/\s/gi, "");
      if (reg.test(friend)) {
        //如果好友名字符合格式
        if (this.friends.length != 0) {
          //如果有好友
          for (let i of this.friends) {
            if (friend === i.user_name) {
              this.$myToast("已是好友");
              return;
            }
          }
        }
        //添加朋友时 应该把自己的账号，昵称，用户id，和打招呼内容发送过去。
        this.client.emit("addFriend", {
          friendName: friend,
          userName: this.userName,
          nickname: this.nickname,
          helloMessage: this.helloMessage,
          userId: this.userId,
        });
      } else if (/^_.*|.*_$/.test(friend)) {
        this.friendNameError = "不能以下划线开头或者结尾";
      } else if (friend.length == 0) this.friendNameError = "不能为空";
      else this.friendNameError = "只能是数字|字母|下划线|汉字";
    },
  },
  mounted() {
    this.client.on("addFriendResult", (data) => {
      if (data === 0) this.friendNameError = "用户不存在";
      else if (data === 1) {
        this.$myToast("发送成功");
        this.onlyClose();
        this.newFriendName = "";
        this.friendNameError = "";
        this.helloMessage = "";
      }
    });
    this.addRoomTop = window.screen.height / 2 + "px";
    //只要首页一加载并且房间Id不是no 就说明已经进入房间 就发送退出房间指令
    if (this.$store.state.roomId != "no") {
      this.$store.state.client.emit("exitRoom", {
        roomIndex: this.$store.state.roomIndex,
        roomId: this.$store.state.roomId,
      });
      this.$store.commit("setRoomId", "no");
      this.$store.commit("setRoomIndex", "no");
    }
  },
  beforeDestroy() {
    this.client.removeAllListeners("addFriendResult");
  },
};
</script>
