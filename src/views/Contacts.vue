<style>
.contacts .friend_avatar {
  position: absolute;
  right: 20px;
  transition: all 0.25s ease-out;
  z-index: 2;
}
.contacts .delete_btn {
  transition: all 0.25s ease-out;
  position: absolute;
  right: 25px;
  z-index: 1;
}
.contacts .friend_avatar.active {
  right: 60px;
}
.contacts .delete_btn.active {
  right: 10px;
  animation: bounceIn;
  animation-duration: 0.6s;
  animation-delay: 150ms;
}
</style>
<template>
  <div class="contacts">
    <mu-list v-click-outside="closeDelete">
      <div
        @touchstart="touchStart(k, $event)"
        @touchend="touchEnd($event)"
        @touchmove="touchMove"
        @click="closeDelete"
        v-for="(i, k) of friends"
        :key="k"
      >
        <mu-list-item avatar button ripple-color="">
          <mu-list-item-action></mu-list-item-action>
          <mu-list-item-title>{{ i.nickname }}</mu-list-item-title>
          <mu-list-item-action
            :class="[
              {
                friend_avatar: true,
                active: deleteActive === k,
              },
            ]"
          >
            <mu-avatar>
              <img src="../assets/avatar/107.jpg" alt="没有" />
            </mu-avatar>
          </mu-list-item-action>
          <mu-button
            icon
            color="secondary"
            :class="{
              delete_btn: true,
              active: deleteActive === k,
            }"
            @click="deleteFriend(i.id, k)"
          >
            <mu-icon value="delete"></mu-icon>
          </mu-button>
        </mu-list-item>
        <mu-divider shallow-inset></mu-divider>
      </div>
    </mu-list>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  mounted() {
    this.client.on("deleteFriendRes", (data) => {
      this.loading.close();
      if (Number(data) === 1) {
        this.$myToast("删除成功");
        this.friends.splice(this.delFriendIndex, 1);
      } else this.$myToast("删除失败");
    });
  },
  data() {
    return {
      deleteActive: -1,
      touchDone: false,
      deleteTimeout: 0,
      loading: "",
      delFriendIndex: "",
    };
  },
  computed: {
    ...mapState(["friends", "userId", "client", "delFriendStatus"]),
  },
  methods: {
    ...mapMutations(["deleteRes"]),
    touchStart(k, e) {
      // e.preventDefault();
      //初始化开关
      this.touchDone = false;
      e.stopPropagation();
      this.deleteTimeout = setTimeout(() => {
        this.deleteActive = k;
        this.touchDone = true;
      }, 500);
    },
    touchEnd(e) {
      if (!this.touchDone && this.deleteTimeout) {
        clearTimeout(this.deleteTimeout);
      }
    },
    closeDelete() {
      if (this.deleteActive !== -1) this.deleteActive = -1;
    },
    touchMove() {
      clearTimeout(this.deleteTimeout);
    },
    deleteFriend(friendId, index) {
      this.delFriendIndex = index;
      this.loading = this.$loading({
        color: "secondary",
      });
      let userId = this.userId;
      this.client.emit("deleteFriend", { userId, friendId });
    },
  },
  beforeDestroy() {
    this.client.removeAllListeners("deleteFriendRes");
  },
};
</script>
