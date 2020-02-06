<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div class="control-btn-box">
      <el-button
        type="danger"
        icon="el-icon-delete"
        @click="handleDelete('more')"
        >删除分类</el-button
      >
      <el-button type="primary" icon="el-icon-edit" @click="createDialog = true"
        >创建分类</el-button
      >
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
      <el-table-column
        prop="type_name"
        label="分类名"
        width="180"
      ></el-table-column>
      <el-table-column label="分类图标" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.litpic" class="art-type-item" />
        </template>
      </el-table-column>
      <el-table-column
        prop="listorder"
        label="排序"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="create_by"
        label="创建者"
        width="100"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete('one', scope.row)"
            >删除</el-button
          >
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
      :my-total="total"
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
        .articleTypeFreeQuery(this.page, this.pageSize)
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
        this.$message.error("请选择删除的文章分类");
        return false;
      }

      let deletearticleType = await this.$api
        .deletearticleType(...deletes)
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });
      if (
        deletearticleType.ret == 200 &&
        deletearticleType.data.err_code == 0
      ) {
        this.$router.go(0);
      }
    }
  },
  components: {
    changeOrcreate: () => import("../components/articleType/changeOrcreate")
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
.art-type-item {
  width: 80px;
  max-height: 80px;
}
</style>
