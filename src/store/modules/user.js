import { loginByUsername, loginByWorkWeChat, loginByWorkWeChatCommit, loginByWorkWeChatCreate, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
const CryptoJS = require('crypto-js')

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    sidebars: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_SIDEBARS: (state, sidebars) => {
      state.sidebars = sidebars
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const _username = userInfo.username.trim()
      const _password = userInfo.password.trim()
      return new Promise((resolve, reject) => {
        loginByUsername({
          username: _username,
          password: _password
        }).then(response => {
          if (response.code === 200) {
            const data = response.data
            commit('SET_TOKEN', data)
            setToken(data)
            resolve()
          }
          throw new Error('用户名或者密码错误')
        }).catch(e => {
          reject(e)
        })
      })
    },
    LoginByWorkWeChat({ commit }, params) {
      return new Promise((resolve, reject) => {
        loginByWorkWeChat(params).then(response => {
          if (response.code === 200) {
            const data = response.data
            commit('SET_TOKEN', data)
            setToken(data)
          }
          resolve(response)
        }).catch(e => {
          reject(e)
        })
      })
    },
    LoginByWorkWeChatCommit({ commit }, query) {
      return new Promise((resolve, reject) => {
        loginByWorkWeChatCommit(query).then(response => {
          if (response.code === 200) {
            const data = response.data
            commit('SET_TOKEN', data)
            setToken(data)
          }
          resolve(response)
        }).catch(e => {
          reject(e)
        })
      })
    },
    LoginByWorkWeChatCreate({ commit }, query) {
      return new Promise((resolve, reject) => {
        loginByWorkWeChatCreate(query).then(response => {
          if (response.code === 200) {
            const data = response.data
            commit('SET_TOKEN', data)
            setToken(data)
          }
          resolve(response)
        }).catch(e => {
          reject(e)
        })
      })
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          // 由于mockjs 不支持自定义状态码只能这样hack
          if (!response.data) {
            reject('error')
          }
          const data = response.data
          const info = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(data.info)))
          commit('SET_NAME', info.name)
          commit('SET_ROLES', info.roles)
          if(data.routers == null || data.routers.length === 0){
            reject('timeout')
          }
          commit('SET_SIDEBARS', data.routers)
          // commit('SET_NAME', data.name)
          commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
          // commit('SET_AVATAR', data.avatar)
          // commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, roles) {
      return new Promise(resolve => {
        commit('SET_ROLES', roles)
        resolve()
      })
    }
  }
}

export default user
