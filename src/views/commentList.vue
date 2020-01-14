<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search-box">
      <el-form :inline="true" :model="searchform" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="searchform.tid"
            placeholder="评论的主题ID"
            maxlength="20"
            show-word-limit
            class="searchTitle"
            ty
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchform.create_name"
            placeholder="评论人"
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
    <!-- <div class="control-btn-box">
      <el-button type="danger" icon="el-icon-delete" @click="handleDelete('more')">删除评论</el-button>
    </div>-->
    <el-table
      class="content"
      :data="tableData"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :cell-style="cellsClass"
      :header-cell-style="cellsClass"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="tid" label="评论的文章ID" width="80"></el-table-column>
      <el-table-column prop="create_name" label="评论人" width="80"></el-table-column>
      <el-table-column prop="content" label="评论内容" width="180">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="250" trigger="hover">
            <div>{{scope.row.content}}</div>
            <span slot="reference">{{ scope.row.content.substr(0,20)+'...' }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="110"></el-table-column>
      <el-table-column prop="rid" label="被回复的评论ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.rid || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rid" label="被回复的评论ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.rid || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id,scope.row.tid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  // created() {
  //   if (this.$route.query.articleId) {
  //     this.searchform.tid = this.$route.query.articleId;
  //     console.log(this.searchform.tid)
  //   }
  //   this.initData();
  // },
  methods: {
    async initData() {
      if (this.articleId) {
        this.searchform.tid = this.articleId;
        this.articleId = null;
      }
      this.fullscreenLoading = true;
      let datas = await this.$api
        .commentsFreeQuery(
          this.page,
          this.pageSize,
          this.searchform.tid,
          this.searchform.create_name
        )
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });
      this.tableData = datas.data.list || [];
      this.total = datas.data.total;
      this.fullscreenLoading = false;
    },
    async initArticleData() {
      this.fullscreenLoading = true;
      let datas = await this.$api
        .commentsFreeQuery(this.page, this.pageSize, this.articleId)
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });
      this.tableData = datas.data.list || [];
      this.total = datas.data.total;
      this.fullscreenLoading = false;
    },
    //删除选中的
    async handleDelete(deleteId, deleteTid) {

      let deleteRes = await this.$api
        .deleteComment(deleteTid, deleteId)
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });
        console.log(deleteRes)
      if (deleteRes[0].ret == 200 && deleteRes[0].data.err_code == 0&&deleteRes[1].ret == 200 && deleteRes[1].data.err_code == 0) {
        this.$message.success("删除评论成功");
      }else{
        this.$message.error("删除评论出错");
      }
      this.$router.go(0);
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.articleId = to.query.articleId || null;
    this.searchform.tid = null;
    this.initData();
    next();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.articleId = to.query.articleId || null;
      vm.searchform.tid = null;
      vm.initData();
    });
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
</style>
