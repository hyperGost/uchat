<style>
#me .user_avatar {
  margin-top: 40px;
}
#me .log_btn_box {
  margin-top: 20px;
}
#me .log_btn_box .mu-button {
  margin: 0 10px;
}
#me .submit {
  margin-top: 20px;
}
/* #my{
        position: fixed;
        z-index: 300;
    } */
#me .user_info_box {
  margin-top: 30px;
}
#me .user_info_box .user_info {
  color: #64b5f6;
  margin-right: 15px;
}
#me .user_info_box .user_icon {
  padding-left: 30px;
}
#me .user_info_box .account {
  margin-right: 75px;
}
#me .logout {
  display: block;
  margin: 0 auto;
}
</style>
<template>
  <div id="me">
    <mu-container>
      <!-- 头像 -->
      <mu-flex class="user_avatar" justify-content="center">
        <mu-avatar size="100" color="blue300">
          <mu-icon size="80" value="perm_identity"></mu-icon>
        </mu-avatar>
      </mu-flex>
      <mu-container v-if="$store.state.logined != 'true'">
        <!-- 登录注册按钮 -->
        <mu-flex class="log_btn_box" justify-content="center">
          <mu-button @click="account('log')" small fab color="primary"
            >登陆</mu-button
          >
          <mu-button @click="account('reg')" small fab color="primary"
            >注册</mu-button
          >
        </mu-flex>
        <!-- 登录或者注册 -->
        <mu-flex
          id="box2"
          class="log_box"
          direction="column"
          align-items="center"
          justify-content="between"
        >
          <mu-text-field
            max-length="20"
            help-text="请输入6-20位的字符"
            v-model="userName"
            icon="account_circle"
            label-float
            label="用户名"
          ></mu-text-field>
          <mu-text-field
            max-length="15"
            help-text="请输入6-15位的字符"
            v-model="password"
            icon="locked"
            label-float
            label="密码"
          ></mu-text-field>
          <mu-slide-bottom-transition class="userBox">
            <mu-text-field
              v-show="logShow"
              max-length="10"
              help-text="请输入1-10位的字符"
              v-model="nickname"
              icon="account_circle"
              label-float
              label="昵称"
            ></mu-text-field>
          </mu-slide-bottom-transition>
        </mu-flex>
        <!-- 提交按钮 -->
        <mu-flex class="submit" justify-content="center">
          <mu-slide-bottom-transition>
            <mu-button
              round
              @click="submit"
              v-show="submitShow"
              color="primary"
            >
              提交
              <mu-icon right value="arrow_upward"></mu-icon>
            </mu-button>
          </mu-slide-bottom-transition>
        </mu-flex>
      </mu-container>

      <!-- 用户登录后的信息显示 -->
      <mu-flex v-else-if="$store.state.logined == 'true'" class="user_info_box">
        <mu-list>
          <mu-divider></mu-divider>
          <mu-list-item ripple-color="#64b5f6" button avatar>
            <mu-list-item-title>账号</mu-list-item-title>
            <mu-list-item-action class="user_info account">
              {{ $store.state.userName }}
            </mu-list-item-action>
            <!-- <mu-list-item-action class="user_icon">
                            <mu-icon value='trending_flat'></mu-icon>
                        </mu-list-item-action> -->
          </mu-list-item>
          <mu-divider></mu-divider>
          <mu-list-item ripple-color="#64b5f6" button avatar>
            <mu-list-item-title>昵称</mu-list-item-title>
            <mu-list-item-action class="user_info">
              {{ $store.state.nickname }}
            </mu-list-item-action>
            <mu-list-item-action class="user_icon">
              <mu-icon value="trending_flat"></mu-icon>
            </mu-list-item-action>
          </mu-list-item>
          <mu-divider></mu-divider>
        </mu-list>
      </mu-flex>
      <mu-button
        @click="clearUChat"
        class="logout"
        v-if="this.$store.state.logined == 'true'"
        >退出登录</mu-button
      >
    </mu-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userName: "",
      password: "",
      nickname: "",
      logShow: false,
      box1: "",
      box2: "",
      accountTimer: "",
      btnDisabled: true,
      submitShow: true,
      isLogin: true,
    };
  },
  methods: {
    login() {
      this.$store.state.client.emit("login", {
        userName: this.userName,
        password: this.password,
      });
    },
    reg() {
      this.$store.state.client.emit("reg", {
        userName: this.userName,
        password: this.password,
        nickname: this.nickname,
      });
    },
    submit() {
      if (this.isLogin) {
        this.$store.commit("log", {
          userName: this.userName,
          password: this.password,
          type: "",
        });
      } else {
        this.$store.state.client.emit("reg", {
          userName: this.userName,
          password: this.password,
          nickname: this.nickname,
        });
      }
    },
    clearUChat() {
      localStorage.removeItem("logined");
      localStorage.removeItem("myFreeChat");
      this.$router.push("/");
      this.$router.go(0);
    },
    account(show) {
      //动画还没有执行完毕 位置还没有交换 设置按钮在动画执行完毕后才可以点击
      // 登录
      if (show == "log" && this.logShow && this.btnDisabled) {
        this.isLogin = true;
        this.logShow = false;
        this.btnDisabled = false;
        this.submitShow = false;
        setTimeout(() => {
          this.btnDisabled = true;
          this.submitShow = true;
        }, 500);
      }
      // 注册
      else if (show == "reg" && !this.logShow && this.btnDisabled) {
        this.isLogin = false;
        this.logShow = true;
        this.btnDisabled = false;
        this.submitShow = false;
        setTimeout(() => {
          this.btnDisabled = true;
          this.submitShow = true;
        }, 500);
      }
    },
  },
};
</script>
