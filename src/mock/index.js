import Mock from 'mockjs'
// import loginAPI from './login'
// import articleAPI from './article'
// import remoteSearchAPI from './remoteSearch'
// import statisticsAPI from './statistics'

Mock.setup({
  timeout: '350-600'
})

// 登录相关
// Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
// Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
// Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)
//
// // 首页相关
// Mock.mock(/\/statistics\/data/, 'get', statisticsAPI.getData)
//
// //
// // // 搜索相关
// Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)
// //

export default Mock
