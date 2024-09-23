<template>
<!--  <div class="dashboard-editor-container">-->

<!--    <div class="filter-container">-->
<!--      <el-row span="16">-->

<!--        <el-col :span="4">-->
<!--          <label style="font-size: 0.9em;color: #606266;margin-left: 40px">服务: </label>-->
<!--          <el-select v-model="listQuery.routes" style="width: 200px;" multiple collapse-tags filterable clearable-->
<!--                     placeholder="服务">-->
<!--            <el-option-->
<!--                v-for="item in routeIds"-->
<!--                :key="item.label"-->
<!--                :label="item.label"-->
<!--                :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-col>-->


<!--        <el-col :span="4">-->
<!--          <label style="font-size: 0.9em;color: #606266;margin-left: 40px">包名: </label>-->
<!--          <el-select v-model="listQuery.packageName" style="width: 200px;" filterable clearable-->
<!--                     placeholder="包名">-->
<!--            <el-option-->
<!--                v-for="item in packageNames"-->
<!--                :key="item.key"-->
<!--                :label="item.key"-->
<!--                :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-col>-->

<!--        <el-col :span="4">-->
<!--          <label style="font-size: 0.9em;color: #606266;margin-left: 50px">查询范围: </label>-->
<!--          <el-select v-model="listQuery.timeRange" style="width: 120px;" filterable clearable-->
<!--                     placeholder="查询范围">-->
<!--            <el-option-->
<!--                v-for="item in timeRanges"-->
<!--                :key="item.label"-->
<!--                :label="item.label"-->
<!--                :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-col>-->

<!--        <label style="font-size: 0.9em;color: #606266;margin-left: 40px">日期: </label>-->
<!--        <el-date-picker-->
<!--            style="margin-left: 0px"-->
<!--            v-model="listQuery.time"-->
<!--            type="datetimerange"-->
<!--            align="right"-->
<!--            unlink-panels-->
<!--            range-separator="至"-->
<!--            start-placeholder="开始时间"-->
<!--            end-placeholder="结束时间"-->
<!--            format="yyyy-MM-dd HH:mm:ss"-->
<!--            value-format="yyyy-MM-dd HH:mm:ss"-->
<!--            :default-time="['00:00:00', '23:59:59']"-->
<!--            :picker-options="timePickerOptions">-->
<!--        </el-date-picker>-->


<!--        <el-button type="success" @click="getGateWayLog" style="margin-left: 40px">查询</el-button>-->

<!--      </el-row>-->

<!--    </div>-->

<!--  <div style="margin-top: 5%">-->
<!--    <div  v-if="listQuery.routes.length == 0 || listQuery.routes == null">-->
<!--      <GatewayBar :chart-data="statusList"  width="100%" ></GatewayBar>-->
<!--    </div>-->

<!--    <div v-else>-->

<!--      <el-row>-->
<!--        <div v-for="(route,index) in listQuery.routes" >-->

<!--          <el-col :span="8">-->
<!--            <GatewayBar  v-if="route.indexOf('server') >= 0" :chart-data=serverStatusList width="30%"></GatewayBar>-->
<!--          </el-col>-->

<!--          <el-col :span="8" >-->
<!--            <GatewayBar  v-if="route.indexOf('ads') >= 0" :chart-data=adsStatusList width="30%"></GatewayBar>-->
<!--          </el-col>-->

<!--          <el-col :span="8" >-->
<!--            <GatewayBar  v-if="route.indexOf('event') >= 0" :chart-data=eventStatusList width="30%"></GatewayBar>-->

<!--          </el-col>-->

<!--        </div>-->
<!--      </el-row>-->


<!--    </div>-->
<!--  </div>-->

<!--    <el-divider style="margin-top: 10%"></el-divider>-->


<!--    <div style="margin-top: 5%">-->
<!--      <div v-if="listQuery.routes.length == 0 || listQuery.routes == null">-->
<!--        <GatewayBar :chart-data="levelList"  width="100%"></GatewayBar>-->
<!--      </div>-->

<!--      <div v-else>-->
<!--        <el-row>-->
<!--          <div v-for="(route,index) in listQuery.routes" >-->

<!--            <el-col :span="8">-->
<!--              <GatewayBar  v-if="route.indexOf('server') >= 0" :chart-data=serverlevelList width="33%"></GatewayBar>-->
<!--            </el-col>-->

<!--            <el-col :span="8" >-->
<!--              <GatewayBar  v-if="route.indexOf('ads') >= 0" :chart-data=adslevelList width="33%"></GatewayBar>-->
<!--            </el-col>-->

<!--            <el-col :span="8" >-->
<!--              <GatewayBar  v-if="route.indexOf('event') >= 0" :chart-data=eventlevelList width="33%"></GatewayBar>-->

<!--            </el-col>-->

<!--          </div>-->
<!--        </el-row>-->
<!--      </div>-->
<!--    </div>-->

<!--  </div>-->

</template>

<script>
  // 数据接口
  import {fetchAppNodeId, fetchGateWayLog} from '@/api/dct'
  import GatewayBar from "./components/GatewayBar";

  export default {
    name: 'home',
    components: {
      GatewayBar
    },
    data() {
      return {
        listQuery:{
          timeRange: '30',
          routes:[],
          packageName:[],
          time: [
            this.formatDateToday() + ' 00:00:00',
            this.formatDateToday() + ' 23:59:59'
          ],
        },
        data:null,
        routeIds:[
          {label: '服务器', value: 'DCT_server_route'},
          {label: '广告', value: 'DCT_ads_route'},
          {label: '日志', value: 'DCT_event_route'}

        ],
        timeRanges: [
          {label: '近5分钟', value: '5'},
          {label: '近15分钟', value: '15'},
          {label: '近30分钟', value: '30'},
          {label: '近1小时', value: '60'},
          {label: '近3小时', value: '180'},
          {label: '近6小时', value: '360'},
          {label: '近12小时', value: '720'},
          {label: '近1天', value: '1440'},
          {label: '近3天', value: '4320'},
        ],
        packageNames:[],
        timePickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        //状态柱状图
        statusList: {
          titleName: '状态码',
          flowName: ['200','400','404','500'],
          seriesList: [],
          xlist: [],
        },
        //响应时间柱状图
        levelList: {
          titleName: '响应时间',
          flowName: ['level1','level2','level3'],
          seriesList: [],
          xlist: [],
        },

        //server服务状态柱状图
        serverStatusList: {
          titleName: 'server状态码',
          flowName: ['200','400','404','500'],
          seriesList: [],
          xlist: [],
        },

        //ads服务状态柱状图
        adsStatusList: {
          titleName: 'ads状态码',
          flowName: ['200','400','404','500'],
          seriesList: [],
          xlist: [],
        },

        //event服务状态柱状图
        eventStatusList: {
          titleName: 'event状态码',
          flowName: ['200','400','404','500'],
          seriesList: [],
          xlist: [],
        },


        //server服务状态柱状图
        serverlevelList: {
          titleName: 'server响应时间',
          flowName: ['level1','level2','level3'],
          seriesList: [],
          xlist: [],
        },

        //ads服务状态柱状图
        adslevelList: {
          titleName: 'ads响应时间',
          flowName: ['level1','level2','level3'],
          seriesList: [],
          xlist: [],
        },

        //event服务状态柱状图
        eventlevelList: {
          titleName: 'event响应时间',
          flowName: ['level1','level2','level3'],
          seriesList: [],
          xlist: [],
        },
        loading: false,
      }
    },
    created() {
      if (this.$route.query && Object.getOwnPropertyNames(this.$route.query).length > 1) {
        this.listQuery = this.$route.query
      }
      this.initSelector()
      this.getGateWayLog()
    },
    methods: {
      getGateWayLog(){
        this.clearData()
        fetchGateWayLog(this.listQuery).then(response => {
          debugger
          this.data = response.data
          this.levelList.xlist = this.data.xpoint
          this.statusList.xlist = this.data.xpoint
          if(this.listQuery.routes == null || this.listQuery.routes.length == 0){
            this.levelList.seriesList = this.data.total.level
            this.statusList.seriesList = this.data.total.status
          } else {
            let that = this
            this.listQuery.routes.forEach(a=>{
              if(a == 'DCT_server_route'){
                that.serverStatusList.xlist = that.data.xpoint
                that.serverlevelList.xlist = that.data.xpoint
                that.serverStatusList.seriesList = that.data.routes.status.DCT_server_route
                that.serverlevelList.seriesList = that.data.routes.level.DCT_server_route
              }
              if(a == 'DCT_ads_route'){
                that.adsStatusList.xlist = that.data.xpoint
                that.adslevelList.xlist = that.data.xpoint
                that.adsStatusList.seriesList = that.data.routes.status.DCT_ads_route
                that.adslevelList.seriesList = that.data.routes.level.DCT_ads_route
              }
              if(a == 'DCT_event_route'){
                that.eventStatusList.xlist = that.data.xpoint
                that.eventlevelList.xlist = that.data.xpoint
                that.eventStatusList.seriesList = that.data.routes.status.DCT_event_route
                that.eventlevelList.seriesList = that.data.routes.level.DCT_event_route
              }
            })
          }
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      clearData() {
        this.statusList.xlist = []
        this.statusList.seriesList = []
        this.levelList.xlist = []
        this.levelList.seriesList = []
        this.serverlevelList.xlist = []
        this.serverlevelList.seriesList = []
        this.serverStatusList.xlist = []
        this.serverStatusList.seriesList = []
        this.adslevelList.xlist = []
        this.adslevelList.seriesList = []
        this.adsStatusList.xlist = []
        this.adsStatusList.seriesList = []
        this.eventStatusList.xlist = []
        this.eventStatusList.seriesList = []
        this.eventlevelList.xlist = []
        this.eventlevelList.seriesList = []
      },
      formatDateToday() {
        let date = new Date();
        let seperator = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let currentdate = year + seperator + month + seperator + strDate;
        return currentdate;
      },
      generateWidth(size){
        debugger
        if(size > 1){
          let k = 100/(size * 2 )
          return k + "%"
        }else {
          return  '100%'
        }

      },
      initSelector() {

        this.roles = []
        this.$route
        this.roles = this.$store.getters.roles
        const roleParams = {type: 'query', role: this.roles}
        fetchAppNodeId(roleParams).then(response => {
          this.packageNames = response.data
        }).catch(err => {
          console.log(err)
        })
      },

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  }
</style>
