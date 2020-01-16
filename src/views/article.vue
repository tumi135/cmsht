<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search-box">
      <el-form :inline="true" :model="searchform" class="demo-form-inline">
        <el-form-item>
          <el-select placeholder="排序" v-model="searchform.order" class="my-select" clearable>
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
          <el-select placeholder="分类" v-model="searchform.type_id" class="my-select" clearable>
            <el-option
              class="my-select"
              v-for="item in typeList"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
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
      <el-button type="danger" icon="el-icon-delete" @click="handleDelete('more')">删除文章</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="toCraeteOrChange('create')">创建文章</el-button>
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
      <el-table-column prop="id" label="编号" width="60"></el-table-column>
      <el-table-column prop="type_name" label="分类" width="60">
        <template slot-scope="scope">
          <span>{{fiterType(scope.row.type_id)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" width="180">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="250" trigger="hover" :content="scope.row.content">
            <div class="content-cell" slot="reference">{{ scope.row.content }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="tuijian" label="推荐等级" width="60"></el-table-column>
      <el-table-column prop="praise_num" label="点赞数" width="80"></el-table-column>
      <el-table-column prop="comment_num" label="评论数" width="80">
        <template slot-scope="scope">
          <router-link
            class="toCommentList"
            v-if="scope.row.comment_num != 0"
            :to="{ name: 'commentList', query: { articleId: scope.row.id } }"
          >{{ scope.row.comment_num }}</router-link>
          <span v-else>{{scope.row.comment_num}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="100"></el-table-column>
      <el-table-column prop="writer" label="创建者" width="100"></el-table-column>
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
          <el-button size="mini" @click="toCraeteOrChange('change',scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete('one', scope.row)">删除</el-button>
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
        type_id: null,
        online: null,
        order: null
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
      typeList: [],
      onlineOptions: [
        {
          label: "上架中",
          value: 0
        },
        {
          label: "下架中",
          value: 1
        }
      ],
      groupOptions: [
        {
          label: "时间",
          value: "id"
        },
        {
          label: "评论数",
          value: "comment_num"
        },
        {
          label: "点赞数",
          value: "praise_num"
        },
        {
          label: "推荐等级",
          value: "tuijian"
        }
      ]
    };
  },
  mixins: [tableMixins],
  created() {
    this.initTypeList();
    this.initData();
  },
  methods: {
    async initData() {
      this.fullscreenLoading = true;
      let order = this.searchform.order ? this.searchform.order : null;
      let type_id = this.searchform.type_id ? this.searchform.type_id : null;
      let online =
        [0, 1].indexOf(this.searchform.online) >= 0
          ? this.searchform.online
          : null;
      let datas = await this.$api
        .articleFreeQuery(this.page, this.pageSize, type_id, online, order)
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });
      this.tableData = datas.data.list || [];
      this.total = datas.data.total;
      this.fullscreenLoading = false;
    },
    async initTypeList() {
      let datas = await this.$api.articleTypeFreeQuery(1, 30).catch(err => {
        console.log(err);
        this.$message.error("数据获取失败");
        return "";
      });
      this.typeList = datas.data.list || [];
    },
    //改变上下架
    async changeOnline(index, info) {
      let nowOnline = info.online == 1 ? 0 : 1;
      let carouselImgOnlineChange = await this.$api
        .articleOnlineChange(info.id, nowOnline)
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
    //删除选中的
    async handleDelete(type, deleteId) {
      var deletes = [];
      if (type === "one") {
        deletes.push(deleteId.id);
      } else if (type === "more") {
        deletes = this.selectList;
      }
      if (deletes.length === 0) {
        this.$message.error("请选择删除的文章");
        return false;
      }

      let deletearticle = await this.$api
        .deletearticle(...deletes)
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });
      if (deletearticle.ret == 200 && deletearticle.data.err_code == 0) {
        this.$router.go(0);
      }
    },
    toCraeteOrChange: function(val, id) {
      if (val == "change") {
        this.$router.push({ name: "changeArticle", query: { articleId: id } });
      } else if (val == "create") {
        this.$router.push({ name: "createArticle" });
      }
    },
    fiterType: function(value) {
      let type = this.typeList.find(item => {
        return value == item.id;
      });
      if (type) {
        return type.type_name;
      } else {
        return "-";
      }
    }
  },
  watch: {
    $router: function() {
      this.initTypeList();
      this.initData();
    }
  }
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     if (from.name == "createArticle" || from.name == "articleType") {
  //       vm.initTypeList();
  //       vm.initData();
  //     }
  //     console.log(from);
  //     console.log(vm);
  //   });
  // }
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
.toCommentList {
  color: #0080ff;
  text-decoration: none;
}
.content-cell{
  width: 100%;
  overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
}
</style>