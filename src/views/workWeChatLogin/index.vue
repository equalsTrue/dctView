<template>
  <div class="login-container" >
    <div v-if="fullscreenLoading" class="loading-icon">
      <img class="third-part-button" :src="loadingGif">
    </div>
    <el-form v-if="showForm" class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
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
        <el-input name="password" show-password @keyup.enter.native="checkLogin" v-model="loginForm.password" autoComplete="on" placeholder="password" />
      </el-form-item>
      <el-row>
        <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="fullscreenLoading" @click.native.prevent="checkLogin">关联企业微信并登陆</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import loadingGif from '@/assets/loading.gif'
import NProgress from 'nprogress' // progress bar
export default {
  name: 'index',
  data() {
    // 密码校验
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }

    return {
      userId: undefined,
      loadingGif: loadingGif,
      fullscreenLoading: true,
      showForm: false,
      loginForm: {
        username: undefined,
        password: undefined
      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      }
    }
  },
  created() {
    this.codeLogin()
  },
  methods: {
    codeLogin() {
      const query = this.$route.query
      const params = {}
      params.code = query.code
      let agentId = process.env.VUE_APP_WE_CHAT_AGENT_ID
      if (window.location.href.indexOf('sandbox.new') > 0) {
        agentId = process.env.VUE_APP_TEST_WE_CHAT_AGENT_ID
      }else if(window.location.href.indexOf('manager.starpavilion-digital.com') > 0) {
        agentId = process.env.VUE_APP_WE_CHAT_AGENT_ID
      }
      params.agentId = agentId
      this.$store.dispatch('LoginByWorkWeChat', params).then(response => {
        if (response.code === 200) {
          this.fullscreenLoading = false
          NProgress.done()
          this.$router.push({path: '/'})
        } else {
          this.$message.error('企业微信授权登陆失败，请尝试密码登录')
          this.fullscreenLoading = false
          this.showForm = true
          this.userId = response.msg
        }
      }).catch((e) => {
        this.$message.error(e.message)
        const that = this
        setTimeout(() => {
          that.fullscreenLoading = false
          that.$router.push({path: '/'})
        }, 5000)
        NProgress.done()
      })
    },
    // 关联用户并登陆
    checkLogin() {
      const query = this.$route.query
      const code = query.code
      let agentId = process.env.VUE_APP_WE_CHAT_AGENT_ID
      if (window.location.href.indexOf('sandbox.new') > 0) {
        agentId = process.env.VUE_APP_TEST_WE_CHAT_AGENT_ID
      }else if(window.location.href.indexOf('manager.starpavilion-digital.com') > 0) {
        agentId = process.env.VUE_APP_WE_CHAT_AGENT_ID
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          NProgress.start()
          this.fullscreenLoading = true
          this.$store.dispatch('LoginByWorkWeChatCommit', { code: code, agentId: agentId, username: this.loginForm.username, password: this.loginForm.password, userId: this.userId }).then(response => {
            if (response.code === 200) {
              this.fullscreenLoading = false
              NProgress.done()
              this.$router.push({path: '/'})
            } else {
              this.$message.error('企业微信授权关联用户登陆失败')
              this.$message.info('创建并关联用户')
              this.userId = response.msg
              this.createLogin()
            }
          }).catch((e) => {
            this.$message.error(e.message)
            const that = this
            setTimeout(() => {
              that.fullscreenLoading = false
              that.$router.push({path: '/'})
            }, 5000)
            NProgress.done()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 创建用户并登陆
    createLogin() {
      const query = this.$route.query
      const code = query.code
      let agentId = process.env.VUE_APP_WE_CHAT_AGENT_ID
      if (window.location.href.indexOf('sandbox.new') > 0) {
        agentId = process.env.VUE_APP_TEST_WE_CHAT_AGENT_ID
      }else if(window.location.href.indexOf('manager.starpavilion-digital.com') > 0) {
        agentId = process.env.VUE_APP_WE_CHAT_AGENT_ID
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          NProgress.start()
          this.fullscreenLoading = true
          this.$store.dispatch('LoginByWorkWeChatCreate', { code: code, agentId: agentId, userId: this.userId}).then(response => {
            if (response.code === 200) {
              this.fullscreenLoading = false
              NProgress.done()
              this.$router.push({path: '/'})
            } else {
              this.$message.error('企业微信授权创建用户登陆失败')
              const that = this
              setTimeout(() => {
                that.fullscreenLoading = false
                that.$router.push({path: '/'})
              }, 3000)
            }
          }).catch((e) => {
            this.$message.error(e.message)
            const that = this
            setTimeout(() => {
              that.fullscreenLoading = false
              that.$router.push({path: '/'})
            }, 5000)
            NProgress.done()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
  $bg:#1b273a;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .loading-icon {
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
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
