<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <error-log class="errLog-container right-menu-item"></error-log>

      <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <lang-select class="international right-menu-item"></lang-select>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
<!--      <el-notification-group :class-name="className" :max="maxNotifications">-->
<!--        <el-notification v-for="(notification, index) in notify" :key="notification.id"-->
<!--                         :title="notification.title" :message="notification.message" :type="notification.type"-->
<!--                         :duration="notification.duration" :closable="false" @close="closeNotification(index)">-->
<!--          <span>{{ index }}</span>-->
<!--        </el-notification>-->
<!--      </el-notification-group>-->
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import {isAlarmPhoneNumberBalance, isClosePhoneNumberBalance} from "@/api/dct";
import {Notification} from "element-ui";
const logDefaultForm = {
  userName: {}
}
export default {

  data() {
    return {
      dialogArr : [],
      maxNotifications: 5, // 最多弹出的通知数
      className: 'custom-notification', // 通知框样式名称
      logData: Object.assign({}, logDefaultForm),
      timer: null,
      instance:null
    };
  },
  mounted(){
    this.showNotification()
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },

  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    showNotification() {
      if (this.dialogArr.length >= this.maxNotifications) {
        return;
      }
      this.logData.userName = this.$store.getters.name
      isAlarmPhoneNumberBalance(this.logData).then((response) => {
        if (response.data) {
          response.data.list.forEach((item,index) =>{
            this.timer = window.setTimeout(() => {
              const h = this.$createElement;
              this.dialogArr.push(this.$notify({
                title: '电话余额不足充值:'+ item,
                showClose:false,
                message: h('p', null, [
                  // h('span', null, item),
                  h('button', {
                    on:{
                      click:() => this.closeNotification(index,item)
                    }
                  }, "关闭")
                ]),
                position: 'bottom-right',
                duration: 0
              }));
            },0);
          })
        }
      })
          .catch((error) => {
            console.error(error);
          });
    },
    closeNotification(index,item) {
      isClosePhoneNumberBalance(item).then((response) => {
        debugger
        console.log(response)
        if (response.data !== 'fail') {
          this.dialogArr[index].close();
        }
      })
          .catch((error) => {
            console.error(error);
          });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
