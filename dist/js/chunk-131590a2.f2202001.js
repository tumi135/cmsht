(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-131590a2"],{"07ee":function(e,t,n){},"5a21":function(e,t,n){"use strict";var a=n("07ee"),r=n.n(a);r.a},c1b7:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("header",{staticClass:"article-header"},[e._v("编辑文章")]),n("change-orcreate",{attrs:{type:"change",info:e.changeInfo}})],1)},r=[],c=(n("d3b7"),n("96cf"),{data:function(){return{changeInfo:{},articleId:""}},created:function(){return regeneratorRuntime.async((function(e){while(1)switch(e.prev=e.next){case 0:this.articleId=this.$route.query.articleId,this.initData();case 2:case"end":return e.stop()}}),null,this)},methods:{initData:function(){var e,t,n=this;return regeneratorRuntime.async((function(a){while(1)switch(a.prev=a.next){case 0:return this.fullscreenLoading=!0,e=this.$route.query.articleId,a.next=4,regeneratorRuntime.awrap(this.$api.getArticle(e).catch((function(){return n.$message.error("数据获取失败"),""})));case 4:t=a.sent,this.changeInfo=t.data.data||{},this.fullscreenLoading=!1;case 7:case"end":return a.stop()}}),null,this)}},watch:{"$route.query.articleId":{handler:function(){this.initData()},immediate:!0,deep:!0}},components:{changeOrcreate:function(){return n.e("chunk-2182a498").then(n.bind(null,"d778"))}}}),i=c,s=(n("5a21"),n("2877")),u=Object(s["a"])(i,a,r,!1,null,"db73f77c",null);t["default"]=u.exports}}]);
//# sourceMappingURL=chunk-131590a2.f2202001.js.map