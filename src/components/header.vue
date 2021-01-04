<style>
#personal_chat header > .navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  padding: 0 10px;
  background: #fff;
}
#personal_chat header {
  z-index: 2;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
#personal_chat header::after {
  content: "";
  display: block;
  padding-top: 50px;
}
#personal_chat .logo > img {
  width: 200px;
}
#personal_chat .nav_toggle {
  position: absolute;
  right: 20px;
}
#personal_chat .nav_toggle > img {
  width: 26px;
  height: 22px;
}
#personal_chat .navbar > .head_right {
  width: 277px;
  height: 600px;
  background-color: #fff;
  position: fixed;
  z-index: 11;
  top: 0;
  right: -279px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
#personal_chat .navbar {
  position: relative;
  transition: all 0.3s ease;
}
#personal_chat .head_active > .navbar {
  transform: translateX(-279px);
}
</style>
<template>
  <header :class="headClass">
    <div class="navbar">
      <slot name="topLeft"></slot>
      <!-- <router-link to="/" class="logo">
        <img src="https://chatrandom.com/img/logo.svg" alt="" />
      </router-link> -->
      <div @click="navToggle" class="nav_toggle">
        <img class="toggle_img" :src="togImg" alt="" />
      </div>
      <div class="head_right">
        <slot name="people"></slot>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  data() {
    return {
      headClass: "",
      togImg: require("../assets/icon/more.png"),
    };
  },
  methods: {
    navToggle() {
      //导航栏选项卡开关
      console.log("点击组件访问id: " + this.$store.state.index);
      if (!this.headClass) {
        this.headClass = "head_active";
        this.togImg = require("../assets/icon/nav_close.png");
      } else {
        this.headClass = "";
        this.togImg = require("../assets/icon/more.png");
      }
    },
  },
};
</script>
