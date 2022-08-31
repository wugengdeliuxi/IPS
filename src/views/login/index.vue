<template>
  <div class="login">
    <p class="systemTitle"></p>
    <div class="right">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        label-width="80px"
      >
        <p class="title">IPS数字流程系统</p>
        <p class="error">{{ loginError }}</p>
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="loginForm.username"
            style="width: 400px"
            :disabled="notInput"
            class="input-username"
            @input="userNameChange"
            @keyup.enter.native="login"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            style="width: 400px"
            type="password"
            :disabled="notInput"
            @keyup.enter.native="login"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="rememberPsd">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" class="login-btn" @click="loginIn"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
      <div class="bottom"></div>
    </div>
  </div>
</template>
<script>
import Storage from 'good-storage'

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      year: new Date().getFullYear(),
      loading: false,
      rememberPsd: false,
      loginInfo: {},
      loginForm: {
        username: '',
        password: ''
      },
      notInput: false,
      rules: {
        username: { required: true, message: '请输入用户名', trigger: 'blur' },
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '请输入最少6位的密码' }
        ]
      },
      loginError: '',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.rememberPsd = Storage.get('isRemeberPsd')
    this.loginInfo = Storage.get('loginInfo')
    if (this.rememberPsd) {
      this.loginForm.username = this.loginInfo.username
      this.loginForm.password = this.loginInfo.password
    }
  },
  methods: {
    async loginIn() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          this.notInput = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.notInput = false
        }
      })
    },
    userNameChange(val) {
      if (this.rememberPsd && val === this.loginInfo.username) {
        this.loginForm.password = this.loginInfo.password
      } else {
        this.loginForm.password = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
}

.login-form {
  padding-left: 20px;
  width: 600px;
  height: 400px;
}

.systemTitle {
  position: fixed;
  left: 4%;
  top: 4%;
  z-index: 1000;
  font-size: 36px;
  color: #0071ff;
  font-weight: bold;
}

.title {
  text-align: center;
  margin-bottom: 8vh;
  font-size: 36px;
  color: #0071ff;
  line-height: 64px;
  padding-right: 30px;
}

.text-right {
  text-align: right;
}

.error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding: 4px 30px 0 0;
}

.right {
  padding-top: 16vh;
  position: relative;
  height: 100%;
  z-index: 100;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  background: #f6f6f6;
}

.login-btn {
  width: 400px;
  margin-top: 5vh;
  background: #2aa98b;
}

.bottom {
  position: absolute;
  width: 100%;
  height: 30vh;
  bottom: 0px;
  // background-image: url('./login_bg.png');
  background-size: 100% 100%;
  left: 0;
  z-index: -1;
}
</style>
