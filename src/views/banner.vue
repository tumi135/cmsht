<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search-box">
      <el-form :inline="true" :model="searchform" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="searchform.title"
            placeholder="标题"
            maxlength="20"
            show-word-limit
            class="searchTitle"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="分组" v-model="searchform.group" class="my-select" clearable>
            <el-option
              class="my-select"
              v-for="item in groupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="当前状态" v-model="searchform.online" class="my-select" clearable>
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
      <el-button type="danger" icon="el-icon-delete" @click="handleDelete('more')">删除轮播图</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="createDialog = true">创建轮播图</el-button>
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
            <el-form-item label="链接">
              <span>{{ props.row.url }}</span>
            </el-form-item>
            <el-form-item label="创建者">
              <span>{{ props.row.create_by }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="编号" width="80"></el-table-column>
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column label="轮播图" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.pic" class="banner-item" />
        </template>
      </el-table-column>
      <el-table-column label="分组" width="120">
        <template slot-scope="scope">
          <span>{{groupOptions[scope.row.group_id].label}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="group_id" label="当前状态" width="120">
        <template slot-scope="scope">
          <el-tag
            :type="!scope.row.online?'success':'warning'"
            @click="changeOnline(scope.$index, scope.row)"
          >{{!scope.row.online?'去下架':'去上架'}}</el-tag>
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
    <change-orcreate-banner
      type="change"
      :dialog-form-visible="changeDialog"
      @closeDialog="closeDialogs"
      :info="changeInfo"
    />
    <!--创建窗口-->
    <change-orcreate-banner
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
      groupOptions: [
        {
          label: "首页",
          value: 0
        },
        {
          label: "发现",
          value: 1
        },
        {
          label: "我的",
          value: 2
        }
      ],
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
      let group =
        [0, 1, 2].indexOf(this.searchform.group) >= 0
          ? this.searchform.group
          : null;
      let online =
        [0, 1].indexOf(this.searchform.online) >= 0
          ? this.searchform.online
          : null;
      let datas = await this.$api
        .carouselImgFreeQuery(
          this.page,
          this.pageSize,
          this.searchform.title,
          group,
          online
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
    //改变上下架
    async changeOnline(index, info) {
      let nowOnline = info.online == 1 ? 0 : 1;
      let carouselImgOnlineChange = await this.$api
        .carouselImgOnlineChange(info.id, nowOnline)
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });
      if (
        carouselImgOnlineChange.ret == 200 &&
        carouselImgOnlineChange.data.err_code == 0
      ) {
        this.$set(this.tableData[index], "online", nowOnline);
      }
    },
    //获取选中的选项
    handleSelectionChange(selection) {
      this.selectList = selection.map(item => {
        return item.id;
      });
    },
    //打开dialogs，方便进行编辑
    handleEdit(val) {
      this.changeDialog = true;
      this.changeInfo = val;
    },
    //关闭DIALOG
    closeDialogs(val) {
      if (val == "change") {
        this.changeDialog = false;
      } else if (val == "create") {
        this.createDialog = false;
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
        this.$message.error("请选择删除的轮播图");
        return false;
      }

      let deleteCarouselImg = await this.$api
        .deleteCarouselImg(...deletes)
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
    },
    //查询
    onSearch() {
      this.page = 1;
      this.initData();
    }
  },
  components: {
    changeOrcreateBanner: () =>
      import("../components/banner/changeOrcreateBanner")
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