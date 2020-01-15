<template>
  <div>
    <div>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
    <div class="edit_container">
      <quill-editor
        class="editer"
        v-model="content"
        :options="editorOption"
        @change="onEditorChange($event)"
      ></quill-editor>
    </div>
  </div>
</template>

<script>
// import xss from 'xss'
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import Quill from "quill";
import { quillEditor } from "vue-quill-editor";
import ImageResize from "quill-image-resize-module"; //添加
Quill.register("modules/imageResize", ImageResize); //添加

export default {
  data() {
    return {
      fullscreenLoading: false,
      content: "",
      oldContent: "",
      editorOption: {
        modules: {
          imageResize: {
            //添加
            displayStyles: {
              //添加
              backgroundColor: "black",
              border: "none",
              color: "white"
            },
            modules: ["Resize", "DisplaySize", "Toolbar"] //添加
          },
          toolbar: [
            ["bold", "italic", "underline", "strike", "image"],
            ["formula", "clean"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            [{ direction: "rtl" }]
          ]
        }
      }
    };
  },
  created() {
    this.getFeedbackTips();
    // let vm = this;
    // const modules = {
    //       imageResize: {   //添加
    //         displayStyles: {   //添加
    //           backgroundColor: 'black',
    //           border: 'none',
    //           color: 'white'
    //         },
    //         modules: ['Resize', 'DisplaySize', 'Toolbar']   //添加
    //       }
    //     }
    // vm.editorOption.modules = modules;
  },

  methods: {
    async getFeedbackTips() {
      this.fullscreenLoading = true;
      let datas = await this.$api.feedbackTipsFreeQuery().catch(err => {
        console.log(err);
        this.$message.error("数据获取失败");
        return "";
      });
      this.content = datas.data.list[0].content || [];
      this.oldContent = datas.data.list[0].content || [];
      this.total = datas.data.total;
      this.fullscreenLoading = false;
    },
    // 内容改变事件
    onEditorChange() {
      if (this.content.length > 16777200) {
        this.$message.error("内容过长");
      }
    },
    async submit() {
      if (this.content === this.oldContent) {
        this.$message.error("内容无改变");
        return;
      }
      if (this.content.length > 16777200) {
        this.$message.error("内容过长");
        return;
      }
      let myCheck = await this.$api.myCheck().catch(err => {
        return err;
      });
      if (!myCheck.ret == 200 || !myCheck.data.err_code == 0) {
        this.$message.error("非超级管理员，不得修改！");
        return;
      }
      console.log(myCheck);
      let res = await this.$api.createFeedbackTips(this.content).catch(err => {
        return err;
      });
      if (res.ret == 200 && res.data.err_code == 0) {
        this.$message({
          message: "操作成功!",
          type: "success"
        });
      }
    }
  },
  components: { quillEditor }
};
</script>

<style>
.edit_container {
  margin-top: 20px;
}
.editer {
  height: 400px;
  /* min-height: 350px; */
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>
