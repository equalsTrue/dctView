<template>
  <div id="charts" style="width: 600px; height: 400px"></div>
</template>

<script>
import echarts from 'echarts'
import {debounce} from '@/utils'

require('echarts/theme/macarons') // echarts theme

export default {
  name: "MonitorChart",
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100px'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    },
    activeLine: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    }
    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }
    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

    this.chart.dispose()
    this.chart = null
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    },
  },
  methods: {
    initData(data) {

      const series = []
      const legend = {data: [], selected: {}}
      if(data.flowName.length > 0){
        for(let i=0;i<data.flowName.length;i++){
          if (data) {
            const color = this.randomRgb(i)
            series.push({
              name: data.flowName[i],
              smooth: true,
              symbolSize: 10,
              symbol: 'none',
              stack: 'gateway',
              type: 'bar',
              emphasis: {
                // 鼠标hover时，同业务项高亮，其他项淡出图形
                focus: "series",
                // 默认配置，仅当前hover数据淡出
                // focus: "none",
              },
              barWidth: "80%",
              itemStyle: {
                normal: {
                  color: color,
                  lineStyle: {
                    color: color,
                    width: 1
                  }
                }
              },
              data: data.seriesList[i],
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            })
            legend.data.push(data.flowName[i])
          }
        }
      }

      return {series, legend}

    },
    randomRgb(index) {
      let procList = ['52c41a','faad14','ff0033','33333']
      let arr = procList[index]
      let color = ''
      color = arr.toString();
      color = color.replace(/,/g, "");
      color = '#' + color;
      return color
    },
    generateSubText(title,flowName){
      let text = ''
      // if(title.indexOf("响应") >= 0){
      //   text = 'level1: 响应时间小于等于5秒, level2: 响应时间是5秒至20秒之间, level3: 响应时间大于20秒'
      // }
      return text
    },
    setOptions(data) {
      const _init = this.initData(data)
      const _series = _init.series
      const _legend = _init.legend
      let yData = data.xlist
      let title = data.titleName

      this.chart.setOption({
        title: [
          {
            text: title,
            left:'left',
            middle: 50,
            textStyle:{
              //字体
              top: 20,
              fontSize:16,
              marginLeft: 450,
              color: 'black'
            },
          },
          {
            left: "right",
            // 标题
            subtext: this.generateSubText(data.titleName,data.flowName),
            // 副标题样式
            subtextStyle: {
              color: 'black',
              fontSize: 12,
              fontWeight: "normal",
            }
          }
        ] ,
        xAxis: {
          data: yData,
          type: 'category',
          boundaryGap: true,
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: function (value) {
              var texts = [];
              texts.push(value)
              return texts;
            },
            interval: 0,
            rotate: 0

          }
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: function (value) {
              var texts = [];
              texts.push(value)
              return texts;
            },
          },
        },
        // dataZoom: [
        //   {
        //     type: 'slider',
        //     xAxisIndex: 0,
        //     filterMode: 'empty'
        //   },
        //   {
        //     handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        //     handleSize: '80%',
        //     handleStyle: {
        //       color: '#fff',
        //       shadowBlur: 3,
        //       shadowColor: 'rgba(0, 0, 0, 0.6)',
        //       shadowOffsetX: 2,
        //       shadowOffsetY: 2
        //     }
        //   }
        // ],
        legend: _legend,
        series: _series
      }, true)
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>

<style scoped>

</style>
