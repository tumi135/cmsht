<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search-box">
      <el-form :inline="true" :model="searchform" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="searchform.image_title"
            placeholder="标题"
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
      <el-button type="danger" icon="el-icon-delete" @click="handleDelete('more')">删除趣图</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="createDialog = true">创建趣图</el-button>
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
      <el-table-column type="expand" label="更多">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="创建时间">
              <span>{{ props.row.add_time }}</span>
            </el-form-item>
            <el-form-item label="创建者">
              <span>{{ props.row.create_by }}</span>
            </el-form-item>
            <el-form-item label="描述">
              <span>{{ props.row.image_desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="编号" width="80"></el-table-column>
      <el-table-column prop="image_title" label="标题" width="180"></el-table-column>
      <el-table-column label="趣图" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.image_link" class="banner-item" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete('one', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑窗口 -->
    <change-orcreate
      type="change"
      :dialog-form-visible="changeDialog"
      @closeDialog="closeDialogs"
      :info="changeInfo"
    />
    <!--创建窗口-->
    <change-orcreate
      type="create"
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
        image_title: ""
      },
      fullscreenLoading: false,
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      selectList: [],
      changeDialog: false,
      createDialog: false,
      changeInfo: {}
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
        .funnyImgFreeQuery(
          this.page,
          this.pageSize,
          this.searchform.image_title
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

      let deleteFunnyImg = await this.$api
        .deleteFunnyImg(...deletes)
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });
      if (
        deleteFunnyImg.ret == 200 &&
        deleteFunnyImg.data.err_code == 0
      ) {
        this.$router.go(0);
      }
    }
  },
  components: {
    changeOrcreate: () =>
      import("../components/funnyImg/changeOrcreate")
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
  width: 300px;
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