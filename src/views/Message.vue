<template>
  <div id="message">
    <mu-list toggle-nested textline="two-line">
      <mu-list-item
        button
        nested
        :open="open === 'newFriend'"
        @toggle-nested="open = arguments[0] ? 'newFriend' : ''"
      >
        <mu-list-item-action>
          <mu-icon value="person_add"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>新的朋友</mu-list-item-title>
        <mu-list-item-action>
          <mu-icon
            :class="{
              toggle: true,
              active: open === 'newFriend' ? true : false,
            }"
            value="keyboard_arrow_down"
          >
          </mu-icon>
        </mu-list-item-action>
        <!-- 好友请求消息循环 -->
        <mu-list-item
          v-for="(i, k) of friendRequest"
          :key="k"
          avatar
          button
          slot="nested"
          v-loading="loadingIndex === k"
          data-mu-loading-size="30"
          data-mu-loading-overlay-color="rgba(227,242,253,.7)"
        >
          <mu-list-item-action>
            <mu-avatar><img src="../assets/avatar/11.jpg" alt=""/></mu-avatar>
          </mu-list-item-action>
          <mu-list-item-content>
            <mu-list-item-title>{{ i.friendName }}</mu-list-item-title>
            <mu-list-item-sub-title>{{ i.info }}</mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-button
              flat
              color="#00e676"
              @click="
                agreeFriendRequest(i.friendId, k, i.friendName, i.nickname)
              "
            >
              同意
            </mu-button>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list-item>

      <mu-list-item
        button
        nested
        :open="open === 'message'"
        @toggle-nested="open = arguments[0] ? 'message' : ''"
      >
        <mu-list-item-action>
          <mu-icon value="notifications_none"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>新的消息</mu-list-item-title>
        <mu-list-item-action>
          <mu-icon
            :class="{
              toggle: true,
              active: open === 'message' ? true : false,
            }"
            value="keyboard_arrow_down"
          ></mu-icon>
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>
  </div>
</template>
<style>
#message .toggle {
  transition: all 0.3s;
}
#message .toggle.active {
  transform: rotate(180deg);
}
</style>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      open: "",
      newFriendIndex: -1,
      preNewFriendIndex: -1,
      loadingIndex: -1,
      friendInfo: {},
    };
  },
  methods: {
    toggle(open) {
      this.open = open;
    },
    agreeFriendRequest(friendId, k, user_name, nickname) {
      //初始化 朋友信息
      this.friendInfo = {
        avatar: null,
        id: friendId,
        nickname,
        user_name,
      };
      // this.$myToast("添加成功");
      this.loadingIndex = k; //等待动画的id
      this.preNewFriendIndex = k;
      //同意添加好友 应该把两个人的id传给服务器  联系起来
      //大在去前 小在后//a必须大于b
      var a = this.userId,
        b = friendId;
      if (a < b) {
        a = friendId;
        b = this.userId;
      }
      this.client.emit("agreeFriendRequest", [
        a,
        b,
        {
          userId: this.userId,
          friendId,
          userName: this.userName,
          nickname: this.nickname,
          avatar: this.avatar,
        },
      ]);
    },
  },
  computed: {
    ...mapState([
      "offlineMessage",
      "client",
      "userId",
      "userName",
      "nickname",
      "friends",
      "avatar",
    ]),
    friendRequest() {
      return this.offlineMessage.friendRequest.filter((item, index) => {
        return this.newFriendIndex !== index;
      });
    },
  },
  mounted() {
    // 监听用户是否同意添加好友;（被添加的人是否同意）
    this.client.on("agreeFriendResult", (data) => {
      if (data === 1) {
        //让列表的id和预定Id一样 也就是把数组下标传进来 说明添加成功然后 删除这个选项
        this.newFriendIndex = this.preNewFriendIndex;
        this.offlineMessage.friendRequest.splice(this.newFriendIndex, 1);
        // 把添加成功的好友加入到好友列表数组中
        this.friends.push(this.friendInfo);
        this.$myToast("添加成功");
      } else if (data === 0) {
        this.$myToast("未知错误");
        this.loadingIndex = -1;
      }
    });
  },
  beforeDestroy() {
    this.client.removeAllListeners("agreeFriendResult");
  },
};
</script>
