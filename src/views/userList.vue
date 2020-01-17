<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <ul>
      <li v-for="item in tableData" :key="item.uuid">
        <el-card class="user-item" shadow="hover">
          <div class="card-left">
            <div class="avatar">
              <img
                v-if="item.ext_info.yesapi_avatar"
                :src="item.ext_info.yesapi_avatar"
              />
              <div v-else class="no-avatar">无头像</div>
            </div>
            <p>{{ item.username }}</p>
          </div>
          <div class="card-right">
            <el-tag style="margin-right:20px">角色：{{ item.role_desc }}</el-tag>
            <el-tag type="success">状态：{{ item.status_desc }}</el-tag>
            <div class="user-infos">
              <div class="info-row-left info-row">
                <p>性别：{{ item.ext_info.yesapi_sex }}</p>
                <p>积分：{{ item.ext_info.yesapi_points }}</p>
              </div>
              <div class="info-row">
                <p>邮箱：{{ item.ext_info.yesapi_email }}</p>
                <p>注册时间：{{ item.reg_time }}</p>
              </div>
            </div>
            <el-button type="primary" @click="changePassword(item.username)"
              >修改密码</el-button
            >
          </div>
        </el-card>
      </li>
    </ul>
    <!-- 编辑窗口 -->
    <change-orcreate
      type="change"
      :dialog-form-visible="changeDialog"
      @closeDialog="closeDialogs"
      :info="changePasswordName"
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
      pageSize: 5,
      total: 0,
      selectList: [],
      changeDialog: false,
      createDialog: false,
      changeInfo: {},
      changePasswordName: ""
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
        .userGetList(this.page, this.pageSize)
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });
      this.tableData = datas.data.users || [];
      this.total = datas.data.total;
      this.fullscreenLoading = false;
    },
    changePassword(userName) {
      if(userName == this.$store.state.userInfo.username){
        this.$router.push({name:'changePassword'})
        return
      }
      this.changePasswordName = userName;
      this.changeDialog = true
    }
  },
  components: {
    changeOrcreate: () => import("../components/userList/changePassword")
  }
};
</script>

<style>
.user-item .el-card__body {
  font-size: 14px;
  box-sizing: border-box;
  width: 100%;
  padding: 15px;
  padding-top: 20px;
  display: flex;
  flex-wrap: wrap;
  
}
</style>
<style scoped>
li {
  list-style: none;
  margin-bottom: 12px;
}
.card-left {
  height: 160px;
  flex: 1 0 220px;
  margin-right: 15px;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin: 0 auto;
}
.avatar img {
  height: auto;
  max-width: 100%;
  vertical-align: middle;
  border: 0;
}
.no-avatar{
  line-height: 100px;
  text-align: center;
}
.card-left p {
  text-align: center;
  margin-top: 12px;
}
.card-right {
  flex: 70 0;
}
.user-infos{
  margin: 20px 0;
}
.user-infos>div{
  display: inline-block;
}

.info-row{
  min-width: 200px;
}
.info-row>p{
  padding: 6px;
}
</style>
