<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search-box">
      <el-form :inline="true" :model="searchform" class="demo-form-inline">
        <el-form-item>
          <el-select
            placeholder="当前状态"
            v-model="searchform.online"
            class="my-select"
            clearable
          >
            <el-option
              class="my-select"
              v-for="item in onlineOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="control-btn-box">
      <el-button
        type="danger"
        icon="el-icon-delete"
        @click="handleDelete('more')"
        >删除公告</el-button
      >
      <el-button type="primary" icon="el-icon-edit" @click="createDialog = true"
        >创建公告</el-button
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
      <el-table-column type="expand" label="更多">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="创建时间">
              <span>{{ props.row.add_time }}</span>
            </el-form-item>
            <el-form-item label="创建者">
              <span>{{ props.row.create_by }}</span>
            </el-form-item>
            <el-form-item label="内容">
              <span>{{ props.row.content }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="编号" width="80"></el-table-column>
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column label="开始时间" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.start_time ? scope.row.start_time : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.end_time ? scope.row.end_time : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="group_id" label="当前状态" width="120">
        <template slot-scope="scope">
          <el-tag
            :type="!scope.row.online ? 'success' : 'warning'"
            @click="changeOnline(scope.$index, scope.row)"
            >{{ !scope.row.online ? "去下架" : "去上架" }}</el-tag
          >
        </template>
      </el-table-column>
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
        title: null,
        group: null,
        online: null
      },
      fullscreenLoading: false,
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      selectList: [],
      changeDialog: false,
      createDialog: false,
      changeInfo: {},
      onlineOptions: [
        {
          label: "上架中",
          value: 0
        },
        {
          label: "下架中",
          value: 1
        }
      ]
    };
  },
  mixins: [tableMixins],
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      this.fullscreenLoading = true;
      let online =
        [0, 1].indexOf(this.searchform.online) >= 0
          ? this.searchform.online
          : null;
      let datas = await this.$api
        .announcementsFreeQuery(this.page, this.pageSize, online)
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });
      this.tableData = datas.data.list || [];
      this.total = datas.data.total;
      this.fullscreenLoading = false;
    },
    //改变上下架
    async changeOnline(index, info) {
      console.log(info);
      let nowOnline = info.online == 1 ? 0 : 1;
      let announcementsOnlineChange = await this.$api
        .announcementsOnlineChange(info.id, nowOnline)
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });
      console.log(announcementsOnlineChange);
      if (
        announcementsOnlineChange.ret == 200 &&
        announcementsOnlineChange.data.err_code == 0
      ) {
        this.$set(this.tableData[index], "online", nowOnline);
      }
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
        this.$message.error("请选择删除的公告");
        return false;
      }

      let deleteCarouselImg = await this.$api
        .deleteAnnouncements(...deletes)
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });
      if (
        deleteCarouselImg.ret == 200 &&
        deleteCarouselImg.data.err_code == 0
      ) {
        this.$router.go(0);
      }
    }
  },
  components: {
    changeOrcreate: () => import("../components/announcements/changeOrcreate")
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
