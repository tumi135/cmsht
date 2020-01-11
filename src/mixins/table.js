export const tableMixins = {
  methods: {
    //改变页数
    handleCurrentChange(nowPage) {
      this.page = nowPage;
      this.initData();
    },
    //表格样式
    cellsClass() {
      return {
        textAlign: 'center'
      }
    },
    //查询
    onSearch() {
      this.page = 1;
      this.initData();
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
  },
}

