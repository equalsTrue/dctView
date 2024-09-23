<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">{{$t('login.title')}}</h3>
        <lang-select class="set-language"></lang-select>
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="password" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-row>
        <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>
      </el-row>
      <el-row>
        <img class="third-part-button" :src="workWeChatImg" @click="handleThirdLogin">
      </el-row>
    </el-form>
  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import NProgress from 'nprogress' // progress bar
import img from '@/assets/login_white_small.png'

export default {
  components: { LangSelect },
  name: 'login',
  data() {
    // 账号校验
    // const validateUsername = (rule, value, callback) => {
    //   if (!isvalidUsername(value)) {
    //     callback(new Error('请输入正确的用户名'))
    //   } else {
    //     callback()
    //   }
    // }
    // 密码校验
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      corpId: '',
      agentId: '',
      domain: '',
      loginForm: {
      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      showImage: false,
      workWeChatImg: img
    }
  },
  created() {
    NProgress.configure({ showSpinner: false })// NProgress Configuration
    const random = Math.round(Math.random() * 3)
    this.showImage = random === 2
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          NProgress.start()
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            NProgress.done()
            this.$router.push({ path: '/' })
          }).catch((e) => {
            this.$message.error(e.message)
            this.loading = false
            NProgress.done()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleThirdLogin() {
      this.corpId = process.env.VUE_APP_WE_CHAT_CORP_ID
      if (window.location.href.indexOf('sandbox.new') > 0) {
        this.corpId = process.env.VUE_APP_TEST_WE_CHAT_CORP_ID
      }
      this.agentId = process.env.VUE_APP_WE_CHAT_AGENT_ID
      if (window.location.href.indexOf('sandbox.new') > 0) {
        this.agentId = process.env.VUE_APP_TEST_WE_CHAT_AGENT_ID
      }else if(window.location.href.indexOf('manager.starpavilion-digital.com') > 0) {
        this.agentId = process.env.VUE_APP_WE_CHAT_AGENT_ID
      }
      this.domain = "manager.starpavilion-digital.com"
      if (window.location.href.indexOf('sandbox.new') > 0) {
        this.domain = "sandbox.new.manager.starpavilion-digital.com"
      }else if(window.location.href.indexOf('manager.starpavilion-digital.com') > 0) {
        this.domain = "manager.starpavilion-digital.com"
      }
      window.location.href = "https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=" + this.corpId + "&agentid="+ this.agentId +"&redirect_uri=http%3a%2f%2f" + this.domain + "%2f%23%2fworkWeChatLogin&state=weblogin"
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .third-part-button {
    position: relative;
  }
  .vdr.active:before {
    content: "";
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    outline: none;
  }
}
</style>
