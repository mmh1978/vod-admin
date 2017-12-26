<template>
    <div style="width: 800px; height: 300px;" :id="domId"></div>
</template>
<script>
  import echarts from 'echarts'

  export default {
    props: ['domId'],
    mounted() {
      this.$nextTick(() => {
        var sortBar = echarts.init(document.getElementById(this.domId));
        var option = {
          color: ['#0fbea5'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['搜索引擎']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          series: [
            {
              name: '搜索引擎',
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'insideRight'
                }
              },
              data: [820, 832, 901, 934, 1290, 1330, 1320],
              barWidth: 10
            }
          ]
        };

        sortBar.setOption(option);
        window.addEventListener('resize', function () {
          sortBar.resize();
        });
      });
    }
  }
</script>