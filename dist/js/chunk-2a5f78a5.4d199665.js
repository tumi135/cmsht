(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2a5f78a5"],{"4e97":function(e,t,r){},"8e87":function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("el-dialog",{attrs:{title:"change"==e.type?"编辑趣图":"创建趣图",visible:e.dialogFormVisible,"destroy-on-close":"","before-close":e.closeDialog,"close-on-click-modal":!1},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[r("el-form",{ref:"form",attrs:{model:e.form,"label-width":"100px",rules:e.formRules}},[r("el-form-item",{attrs:{label:"标题(只读)",prop:"image_title"}},[r("el-input",{attrs:{maxlength:"10","show-word-limit":"",readonly:""},model:{value:e.form.image_title,callback:function(t){e.$set(e.form,"image_title",t)},expression:"form.image_title"}})],1),r("el-form-item",{attrs:{label:"上传图片",prop:"image_link"}},[r("el-upload",{ref:"upload",staticClass:"my-uploader",attrs:{action:"","auto-upload":!1,"show-file-list":!1,"on-change":e.uploaderImg,accept:".jpg, .jpeg, .png, .gif, .bmp, .pdf, .JPG, .JPEG, .PBG, .GIF, .BMP, .PDF"}},[e.form.image_link?r("img",{staticClass:"uploaderImg",attrs:{src:e.form.image_link}}):r("i",{staticClass:"el-icon-plus my-uploader-icon"})])],1),r("el-form-item",{attrs:{label:"描述",prop:"image_desc"}},[r("el-input",{attrs:{type:"textarea",autosize:{minRows:2,maxRows:4},placeholder:"请输入内容",maxlength:"30","show-word-limit":""},model:{value:e.form.image_desc,callback:function(t){e.$set(e.form,"image_desc",t)},expression:"form.image_desc"}})],1)],1),r("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:e.closeDialog}},[e._v("取 消")]),r("el-button",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:e.fullscreenLoading,expression:"fullscreenLoading",modifiers:{fullscreen:!0,lock:!0}}],attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("确 定")])],1)],1)},n=[],i=(r("d3b7"),r("96cf"),r("bea7")),s={props:{type:String,dialogFormVisible:Boolean,info:Object},mixins:[i["a"]],data:function(){return{fullscreenLoading:!1,id:"",form:{image_title:"官方",image_link:"",image_desc:null},formRules:{image_title:[{required:!0,message:"请填写标题",trigger:"blur"}],image_link:[{required:!0,message:"请上传图片",trigger:"blur"}],image_desc:[{required:!0,message:"请填写描述",trigger:"blur"}]}}},created:function(){},methods:{submitChange:function(){var e;return regeneratorRuntime.async((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,regeneratorRuntime.awrap(this.$api.funnyImgChange(this.id,this.form.image_title,this.form.image_link,this.form.image_desc).catch((function(e){return e})));case 2:return e=t.sent,t.abrupt("return",e);case 4:case"end":return t.stop()}}),null,this)},submitCreate:function(){var e;return regeneratorRuntime.async((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,regeneratorRuntime.awrap(this.$api.createFunnyImg(this.form.image_title,this.form.image_link,this.form.image_desc).catch((function(e){return e})));case 2:return e=t.sent,t.abrupt("return",e);case 4:case"end":return t.stop()}}),null,this)}},watch:{info:function(){this.id=this.info.id,this.form={image_link:this.info.image_link,image_desc:this.image_desc}}}},o=s,c=(r("bf6b"),r("2877")),l=Object(c["a"])(o,a,n,!1,null,"f8e49578",null);t["default"]=l.exports},b0c0:function(e,t,r){var a=r("83ab"),n=r("9bf2").f,i=Function.prototype,s=i.toString,o=/^\s*function ([^ (]*)/,c="name";!a||c in i||n(i,c,{configurable:!0,get:function(){try{return s.call(this).match(o)[1]}catch(e){return""}}})},bea7:function(e,t,r){"use strict";r.d(t,"a",(function(){return a}));r("b0c0"),r("d3b7"),r("96cf");var a={methods:{uploaderImg:function(e){var t,r,a,n;return regeneratorRuntime.async((function(i){while(1)switch(i.prev=i.next){case 0:if("articleType"==this.$route.name?(t=e.size/1024/1024<.1,r=100):(t=e.size/1024/1024<.5,r=500),console.log(t),t){i.next=5;break}return this.$message.error("上传文件大小不能超过 ".concat(r,"k!")),i.abrupt("return",!1);case 5:a=new FileReader,n=this,a.readAsDataURL(e.raw),a.onload=function(){var e;return regeneratorRuntime.async((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,regeneratorRuntime.awrap(n.$api.uploadImgByBase64(a.result,"article_type").catch((function(e){return e})));case 2:e=t.sent,200==e.ret&&0==e.data.err_code?n.form.litpic=e.data.url:n.$message({message:"图片上传失败,刷新或换图片！",type:"error"});case 4:case"end":return t.stop()}}))};case 9:case"end":return i.stop()}}),null,this)},closeDialog:function(){var e="change"==this.type?"change":"create";this.$emit("closeDialog",e)},submitForm:function(){var e=this;return regeneratorRuntime.async((function(t){while(1)switch(t.prev=t.next){case 0:this.$refs.form.validate((function(t){var r;return regeneratorRuntime.async((function(a){while(1)switch(a.prev=a.next){case 0:if(!t){a.next=20;break}if(e.fullscreenLoading=!0,"change"!=e.type){a.next=8;break}return a.next=5,regeneratorRuntime.awrap(e.submitChange());case 5:r=a.sent,a.next=16;break;case 8:if("create"!=e.type){a.next=14;break}return a.next=11,regeneratorRuntime.awrap(e.submitCreate());case 11:r=a.sent,a.next=16;break;case 14:return e.$message({message:"操作失败！",type:"error"}),a.abrupt("return",!1);case 16:200==r.ret&&0==r.data.err_code?(e.$message({message:"操作成功!",type:"success"}),e.$router.go(0)):200==r.ret&&1==r.data.err_code?e.$message({message:"你不是管理员，无权限操作!",type:"warning"}):"请登录后再操作"==r?e.$message({message:"请登录后再操作!",type:"warning"}):"取消操作"==r?e.$message({message:"取消操作成功!",type:"info"}):e.$message({message:"网络错误，操作失败！",type:"error"}),e.fullscreenLoading=!1,a.next=21;break;case 20:return a.abrupt("return",!1);case 21:case"end":return a.stop()}}))}));case 1:case"end":return t.stop()}}),null,this)}}}},bf6b:function(e,t,r){"use strict";var a=r("4e97"),n=r.n(a);n.a}}]);
//# sourceMappingURL=chunk-2a5f78a5.4d199665.js.map