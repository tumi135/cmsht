<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <el-table
      class="content"
      :data="tableData"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :cell-style="cellsClass"
      :header-cell-style="cellsClass"
    >
      <el-table-column type="index" width="180"></el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        width="80"
      ></el-table-column>
      <el-table-column prop="role" label="用户角色" width="180">
        <template slot-scope="scope">
            <span>
              {{ scope.row.role == 'admin'? '普通会员':'管理员' }}
            </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="login_time"
        label="登录时间"
        width="180"
      >
      <template slot-scope="scope">
            <span>
              {{formatDate(scope.row.login_time)}}
            </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ip"
        label="登录ip"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { tableMixins } from "../mixins/table";

export default {
  data() {
    return {
      searchform: {
        tid: null,
        create_name: ""
      },
      fullscreenLoading: false,
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      selectList: [],
      changeInfo: {},
      articleId: null
    };
  },
    mixins: [tableMixins],
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      if (this.articleId) {
        this.searchform.tid = this.articleId;
        this.articleId = null;
      }
      this.fullscreenLoading = true;
      let datas = await this.$api
        .getLastestLoginList()
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });
      this.tableData = datas.data.members || [];
      this.fullscreenLoading = false;
    },
    formatDate(time) {
      var date = new Date(time*1000)
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    }
  },
};
</script>
<style>
/* .my-cells>.cell{
  text-align: center;
} */
</style>

<style scoped>
.searchTitle {
  width: 180px;
}
.my-select {
  width: 120px;
}
.content {
  margin: 20px 0;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.banner-item {
  width: 160px;
  max-height: 160px;
}
.content-cell {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
