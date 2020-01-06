export const tableMixins = {
  methods: {
    //改变页数
    handleCurrentChange(nowPage) {
      this.page = nowPage;
      this.initData();
    },
    //表格样式
    cellsClass() {
      return {textAlign: 'center'}
    }
  }
}