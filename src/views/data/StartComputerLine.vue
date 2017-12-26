<template>
    <div style="width:100%;height:300px;" id="computer-line"></div>
</template>
<script>
  import echarts from 'echarts'
  import {EventBus} from '../../components/EventBus'

  export default {
    mounted() {
      this.$nextTick(() => {

        function randomData() {
          now = new Date(+now + oneDay);
          value = value + Math.random() * 21 - 10;
          return {
            name: now.toString(),
            value: [
              [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
              Math.round(value)
            ]
          }
        }

        var data = [];
        var now = +new Date(2017, 9, 3);
        var oneDay = 24 * 3600 * 1000;
        var value = Math.random() * 1000;
        for (var i = 0; i < 100; i++) {
          data.push(randomData());
        }

        let trendLine = echarts.init(document.getElementById('computer-line'));
        var option = {
          title: {
            text: '开机'
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              params = params[0];
              var date = new Date(params.name);
              return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
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
        trendLine.on('click', params => {
          EventBus.$emit('open-computer-list', params);
        });
        window.addEventListener('resize', function () {
          trendLine.resize();
        });
      });
    }
  }
</script>