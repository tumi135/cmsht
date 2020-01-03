<template>
  <div>
    <div class="header">
      <div>{{ articleNum }}篇文章</div>
      <div>{{ userNum }}位用户</div>
    </div>
    <my-echart
      :echart-info="echartInfo"
    />
  </div>
</template>

<script>
import myEchart from "../components/home/myEchart.vue";
export default {
  data() {
    return {
      articleNum: 0, // //文章总数
      userNum: 0, //注册人数
      echartInfo: {}
    };
  },
  async created() {
    this.initTotal();
    this.initDaily();
  },
  methods: {
    initTotal() {
      Promise.all([
        this.$api.getRegisterSnapshot(),
        this.$api.getArticleSnapshot()
      ])
        .then(values => {
          this.userNum = values[0].data.cur_register_total || 0;
          this.articleNum = values[1].data.total || 0;
        })
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
        });
    },
    initDaily() {
      Promise.all([
        this.$api.getDailyRegister(),
        this.$api.getDailyLoginReport(),
        this.$api.getArticleDailyDataReport()
      ])
        .then(values => {
          // dailyRegister: [], //每日注册情况
          // dailyLogin: [], //每日登录情况
          // dailyArticle: [], //每日文章情况
          // sevenDay: [],
          let dailyRegister = values[0].data.items || [];
          let dailyLogin = values[1].data.items || [];
          let dailyArticle = values[2].data.items.now || [];
          if (
            dailyRegister.length == 0 ||
            dailyLogin.length == 0 ||
            dailyArticle.length == 0
          ) {
            this.$message.error("数据获取失败");
            return false;
          }

          let dailyRegister2 = this.getArray(dailyRegister, "reg_num");
          let dailyLogin2 = this.getArray(dailyLogin, "total_times");
          let dailyArticle2 = this.getArray(dailyArticle, "total");
          let sevenDay2 = this.getArray(dailyRegister, "date");
          this.echartInfo = {
            dailyRegister: dailyRegister2,
            dailyLogin: dailyLogin2,
            dailyArticle: dailyArticle2,
            sevenDay: sevenDay2
          };
        })
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
        });
    },
    getArray(arr, val) {
      return arr.map(item => {
        return item[val];
      });
    }
  },
  watch: {
    sevenDay() {
      console.log(this.sevenDay);
    }
  },
  components: {
    myEchart
  }
};
</script>

<style scoped>
.header > div {
  display: inline-block;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  margin-right: 20px;
}
</style>