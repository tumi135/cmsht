<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search-box">
      <el-form :inline="true" :model="searchform" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="searchform.user_name"
            placeholder="反馈人"
            maxlength="20"
            show-word-limit
            class="searchTitle"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="control-btn-box">
      <el-button type="danger" icon="el-icon-delete" @click="handleDelete('more')">删除评论</el-button>
    </div>
    <el-table
      class="content"
      :data="tableData"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :cell-style="cellsClass"
      :header-cell-style="cellsClass"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="编号" width="80"></el-table-column>
      <el-table-column type="expand" label="图片">
        <template slot-scope="props">
          <div v-if="props.row.litpic.pic.length != 0">
            <img v-for="item in props.row.litpic.pic" :src="item.url" :key="item.uid" class="feedback-img">
          </div>
          <div v-else>无图片</div>
        </template>
      </el-table-column>
      <el-table-column prop="user_name" label="反馈人" width="80"></el-table-column>
      <el-table-column prop="content" label="评论内容" width="280">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="250" trigger="hover" :content="scope.row.content">
            <div class="content-cell" slot="reference">{{ scope.row.content }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="110"></el-table-column>
      <el-table-column prop="r_name" label="被回复的人" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.r_name || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="reply(scope.row.user_name)">回复</el-button>
          <el-button size="mini" type="danger" @click="handleDelete('one', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--创建窗口-->
    <change-orcreate
      :r-name="rName"
      :dialog-form-visible="createDialog"
      @closeDialog="closeDialogs"
    />
    <el-pagination
      layout="prev, pager, next, jumper"
      background
      :page-size="pageSize"
      :total="total"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import { tableMixins } from "../mixins/table";
export default {
  data() {
    return {
      searchform: {
        user_name: ""
      },
      fullscreenLoading: false,
      createDialog: false,
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      selectList: [],
      changeInfo: {},
      rName: ""
    };
  },
  mixins: [tableMixins],
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      this.fullscreenLoading = true;
      let datas = await this.$api
        .feedbackFreeQuery(this.page, this.pageSize, this.searchform.user_name)
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });

      var data = datas.data.list || [];
      var dataList = data.map(item => {
        item.litpic = JSON.parse(item.litpic);
        return item;
      });
      this.total = datas.data.total;
      this.tableData = dataList;

      this.fullscreenLoading = false;
    },
    reply(val) {
      this.rName = val;
      this.createDialog = true;
    },
    //删除选中的
    async handleDelete(type, deleteId) {
      var deletes = [];
      if (type === "one") {
        deletes.push(deleteId.id);
      } else if (type === "more") {
        deletes = this.selectList;
      }
      if (deletes.length === 0) {
        this.$message.error("请选择删除的趣图");
        return false;
      }

      let deleteRes = await this.$api.deleteFeedback(...deletes).catch(err => {
        console.log(err);
        this.$message.error("数据获取失败");
        return "";
      });
      if (deleteRes.ret == 200 && deleteRes.data.err_code == 0) {
        this.$router.go(0);
      }
    }
  },
  components: {
    changeOrcreate: () => import("../components/feedbackList/changeOrcreate")
  }
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
.feedback-img{
  width: 180px;
}
.content-cell{
  width: 100%;
  overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
}
</style>
