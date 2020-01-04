<template>
  <div class="line1">
    <div id="line1" class style="width: 90%;height:450px;">echart</div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
// 引入柱状图
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/tooltip";
export default {
  data() {
    return {};
  },
  props: {
    echartInfo: Object
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("line1"));
    this.initData();
  },
  methods: {
    initData() {
      let option = {
        title: {
          text: "一周数据统计图表"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["用户注册", "用户登录", "新增文章"],
          left: "center",
          bottom: "bottom",
          orient: "vertical",
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            dataView: { readOnly: false },
            magicType: { type: ["bar", "line"] },
            restore: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "6%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.echartInfo.sevenDay
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "用户注册",
            type: "line",
            data: this.echartInfo.dailyRegister,
          },
          {
            name: "用户登录",
            type: "line",
            data: this.echartInfo.dailyLogin
          },
          {
            name: "新增文章",
            type: "line",
            data: this.echartInfo.dailyArticle
          }
        ]
      };
      this.myChart.setOption(option);
    }
  },
  watch: {
    echartInfo(){
      this.initData();
    }
  }
};
</script>

<style scoped>
.line1{
  margin-top: 20px;
}
</style>