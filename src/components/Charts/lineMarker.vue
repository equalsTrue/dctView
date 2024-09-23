<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    chartData: {
      type: Object
    },
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  // 实时监控父组件传过来的值
  watch: {
    chartData: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (this.chart) {
          if (newVal) {
            this.setOption(newVal)
          } else {
            this.setOption(oldVal)
          }
        }
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.setOption(this.chartData)
    },
    setOption(option){
      this.chart.setOption({
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: 'DN 模拟衰减曲线',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: option.nameArray,
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        graphic: [
          {
            type: 'group',
            left: '8%',
            top: '10%',
            children: [
              {
                type: 'rect',
                z: 100,
                left: 'center',
                top: 'middle',
                shape: {
                  width: 250,
                  height: 90
                },
                style: {
                  fill: '#fff',
                  stroke: '#555',
                  lineWidth: 2,
                  shadowBlur: 8,
                  shadowOffsetX: 3,
                  shadowOffsetY: 3,
                  shadowColor: 'rgba(0,0,0,0.3)'
                }
              },
              {
                type: 'text',
                z: 100,
                left: 'center',
                top: 'middle',
                style: {
                  fill: '#333',
                  text: [
                    '与cap接近的真实mo数量: ' + option.moCount,
                    '与cap接近的实际订阅日期:' + option.moDate
                  ].join('\n'),
                  font: '14px Microsoft YaHei'
                }
              }
            ]
          }
        ],
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: 'white'
            },
            axisTick: {
              show: false
            },
          },
          data: option.xArray
        }],
        yAxis: [{
          type: 'value',
          name: '(dnCount)',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: 'white'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: option.nameArray[0],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 2
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12

            }
          },
          data: option.y1Array
        }, {
          name: option.nameArray[1],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 2
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12

            }
          },
          data: option.y2Array
        }, {
          name: option.nameArray[2],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 2
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(219, 50, 51, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(219, 50, 51, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(219,50,51)',
              borderColor: 'rgba(219,50,51,0.2)',
              borderWidth: 12
            }
          },
          data: option.y3Array
        }]
      })
    }
  }
}
</script>
