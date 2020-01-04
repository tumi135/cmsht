<template>
  <div>
    <div class="header">
      <el-button type="danger" icon="el-icon-delete" @click="handleDelete('more')">删除轮播图</el-button>
      <el-button type="primary" icon="el-icon-edit">创建轮播图</el-button>
    </div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
      type="selection"
      width="55">
    </el-table-column>
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
      <el-table-column prop="group_id" label="分组" width="120"></el-table-column>
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
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete('one', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      perpage: 10,
      selectList: []
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      let datas = await this.$api
        .carouselImgFreeQuery(this.page, this.perpage)
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });
      this.tableData = datas.data.list || [];
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
        this.$set(this.tableData[index], 'online', nowOnline);
      }
      console.log(carouselImgOnlineChange);
    },
    handleSelectionChange(selection){
      console.log(selection)
      this.selectList = selection.map(item => {
        return item.id
      })
    },
    handleEdit() {},
    async handleDelete(type, deleteId) {
      var deletes = []
      if(type === 'one'){
        deletes.push(deleteId.id)
      }else if (type === 'more') {
        deletes = this.selectList
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
        this.$router.go(0)
      }  
    }
  }
};
</script>

<style scoped>
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