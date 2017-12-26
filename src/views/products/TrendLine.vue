<template>
    <div style="width:100%;height:300px;" id="trend-line"></div>
</template>
<script>
  import echarts from 'echarts'
  import {EventBus} from '../../components/EventBus'
  import {getStbTrend} from '../../api/productApi'

  export default {
//    props: ['lineData'],
    props: {
      lineData: undefined
    },
    data() {
      return {
        innerData: []
      }
    },
    watch: {
      'lineData': lineData => {
        this.innerData = lineData.map(item => {
          return {
            name: item.day,
            value: [
              item.day, item.total
            ]
          }
        });
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.paint(this.innerData);
      });
    },
    methods: {
      paint(data) {
        let trendLine = echarts.init(document.getElementById('trend-line'));
        var option = {
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              params = params[0];
              var date = new Date(params.name);
              return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' : ' + params.value[1];
            },
            axisPointer: {
              animation: false
            }
          },
          xAxis: {
            type: 'time',
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
              show: false
            }
          },
          series: [{
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data
          }]
        };
        trendLine.setOption(option);
        trendLine.on('click', (params) => {
          EventBus.$emit('open-prod-detail', params);
        });
        window.addEventListener('resize', () => {
          trendLine.resize();
        });
      }
    }
  }
</script>