import axios from "./axios";
import crypto from "crypto";
import store from "../store/index";

const api = {
  //创建新的验证码接口data:image/jpeg;base64,
  captchaCreate: () => {
    return axios.post("/", {
      s: "App.Captcha.Create",
      return_format: "data"
    });
  },
  //校对验证码接口
  captchaVerify: (captcha_id, captcha_code) => {
    return axios.post("/", {
      s: "App.Captcha.Verify",
      captcha_id: captcha_id,
      captcha_code: captcha_code
    });
  },
  //会员注册
  userRegister: (username, password) => {
    const md5 = crypto.createHash("md5");
    md5.update(password);
    let md5password = md5.digest("hex");
    let ext_info = JSON.stringify({"yesapi_avatar":"http://cd7.yesapi.net/C6FB2E902F9FDA74101B4887AF935333_20191229175409_e7ca1f115b39297a555329a8aa061e2c.jpeg"})
    return axios.post("/", {
      s: "App.User.Register",
      password: md5password,
      username: username,
      ext_info: ext_info
    });
  },
  //会员登录
  userLogin: (username, password) => {
    const md5 = crypto.createHash("md5");
    md5.update(password);
    let md5password = md5.digest("hex");
    return axios.post("/", {
      s: "App.User.Login",
      password: md5password,
      username: username
    });
  },
  //会员退出登录接口
  userLogout: uuid => {
    return axios.post("/", {
      s: "App.User.Logout",
      uuid: uuid,
      token: true
    });
  },
  //修改会员分组（管理员专用）
  ChangeRoleForAdmin: (other_uuid, new_role) => {
    return axios.post("/", {
      s: "App.User.ChangeRoleForAdmin",
      other_uuid: other_uuid,
      new_role: new_role,
      token: true
    });
  },
  //会员登录态检测接口
  userCheck: () => {
    return axios.post("/", {
      s: "App.User.Check",
      uuid: true,
      token: true
    });
  },
  //获取会员列表接口
  userGetList: (uuids, page, perpage, sort_type, role) => {
    return axios.post("/", {
      s: "App.User.GetList",
      page: page,
      perpage: perpage,
      sort_type: sort_type,
      role: role
    });
  },
  //获取会员个人资料接口
  userProfile: () => {
    return axios.post("/", {
      s: "App.User.Profile",
      token: true,
      uuid: true
    });
  },
  //修改会员登录密码接口
  alterPassword: (username, old_password, new_password) => {
    const md5 = crypto.createHash("md5");
    const md5_2 = crypto.createHash("md5");
    md5.update(old_password);
    md5_2.update(new_password);
    let md5oldpassword = md5.digest("hex");
    let md5newpassword = md5_2.digest("hex");
    return axios.post("/", {
      s: "App.User.Login",
      new_password: md5newpassword,
      old_password: md5oldpassword
    });
  },
  //	修改会员扩展信息接口
  userUpdateExtInfo: (avatar, sex) => {
    let ext_info = {
      yesapi_avatar: avatar,
      yesapi_sex: sex
    };
    ext_info = JSON.stringify(ext_info);
    return axios.post("/", {
      s: "App.User.UpdateExtInfo",
      uuid: true,
      token: true,
      ext_info: ext_info
    });
  },
  //删除会员接口（管理员专用）
  removeUserForAdmin: other_uuid => {
    return axios.post("/", {
      s: "App.User.RemoveUserForAdmin",
      other_uuid: other_uuid,
      admin_uuid: true,
      admin_token: true
    });
  },
  //重置会员密码接口（管理员专用）
  resetPasswordForAdmin: (username, new_password) => {
    const md5 = crypto.createHash("md5");
    md5.update(new_password);
    let md5newpassword = md5.digest("hex");
    return axios.post("/", {
      s: "App.User.ResetPasswordForAdmin",
      username: username,
      new_password: md5newpassword,
      admin_uuid: true,
      admin_token: true
    });
  },
  //会员注册统计接口
  getDailyRegister: (start_date, end_date) => {
    return axios.post("/", {
      s: "App.Statistics.GetDailyRegister",
      end_date: end_date,
      start_date: start_date
    });
  },
  //统计会员注册概况
  getRegisterSnapshot: () => {
    return axios.post("/", {
      s: "App.Statistics.GetRegisterSnapshot"
    });
  },
  //会员登录统计接口
  getDailyLoginReport: (start_date, end_date) => {
    return axios.post("/", {
      s: "App.Statistics.GetDailyLoginReport",
      end_date: end_date,
      start_date: start_date
    });
  },
  //获取单字段的每日统计报表
  getArticleSnapshot: () => {
    return axios.post("/", {
      s: "App.Table.Count",
      model_name: "yesapi_fl_article"
    });
  },
  //统计文章总数
  getArticleDailyDataReport: (days) => {
    return axios.post("/", {
      s: "App.Table.GetFiledDailyDataReport",
      model_name: "yesapi_fl_article",
      field: "id",
      date_field: "add_time",
      days: days
    });
  },
  //base64图片上传接口
  uploadImgByBase64: (file, file_name) => {
    return axios.post("/", {
      s: "App.CDN.UploadImgByBase64",
      file: file,
      file_name: file_name
    });
  },
  //搜索和获取已上传图片或文件的列表
  cdnRecordList: (page, perpage) => {
    return axios.post("/", {
      s: "App.CDN.RecordList",
      page: page,
      perpage: perpage
    });
  },
  //创建趣图
  createFunnyImg: (image_title, image_link, image_desc, online) => {
    let data = {
      uuid: store.state.uuid,
      image_title: image_title,
      image_link: image_link,
      image_desc: image_desc,
      online: online
    };
    data = JSON.stringify(data);
    return axios.post("/", {
      s: "App.Table.CheckCreateOrUpdate",
      model_name: "okayapi_image",
      data: data,
      check_field: "image_link"
    });
  },
  //趣图分页查询列表数据接口
  funnyImgFreeQuery: (page, perpage, online) => {
    let where = ["id>0"];
    if (online) {
      where.push("deleted=" + online);
    }
    return axios.post("/", {
      s: "App.Table.FreeQuery",
      model_name: "okayapi_image",
      where: where,
      page: page,
      perpage: perpage
    });
  },
  //修改趣图
  funnyImgChange: (id, image_title, image_link, image_desc, online) => {
    let data = {
      image_title: image_title,
      image_link: image_link,
      image_desc: image_desc,
      online: online
    };
    data = JSON.stringify(data);
    return axios.post("/", {
      s: "App.Table.Update",
      model_name: "okayapi_image",
      id: id,
      data: data
    });
  },
  //删除趣图
  deleteFunnyImg: (...id) => {
    let where = [];
    for (let i = 0; i < id.length; i++) {
      where.push("id=" + id[i]);
    }
    return axios.post("/", {
      s: "App.Table.FreeDelete",
      model_name: "okayapi_image",
      logic: "or",
      where: where
    });
  },
  //创建轮播图
  createCarouselImg: (title, group_id, pic, url, create_by, online) => {
    let data = {
      uuid: store.state.uuid,
      title: title,
      group_id: group_id,
      pic: pic,
      url: url,
      create_by: create_by,
      online: online
    };
    data = JSON.stringify(data);
    return axios.post("/", {
      s: "App.Table.CheckCreateOrUpdate",
      model_name: "yesapi_fl_slide",
      data: data,
      check_field: "img"
    });
  },
  //轮播图获取总数
  carouselImgCount: () => {
    return axios.post("/", {
      s: "App.Table.Count",
      model_name: "yesapi_fl_slide"
    });
  },
  //轮播图分页查询列表数据接口
  carouselImgFreeQuery: (page, perpage, title, group_id, online) => {
    let where = ["id>0"];
    if (title) {
      where.push("title=" + title);
    }
    if (group_id) {
      where.push("group_id=" + group_id);
    }
    if (online) {
      where.push("online=" + online);
    }
    return axios.post("/", {
      s: "App.Table.FreeQuery",
      model_name: "yesapi_fl_slide",
      where: where,
      page: page,
      perpage: perpage,
      order: ["id DESC"]
    });
  },
  //轮播图上线、下线
  carouselImgOnlineChange: (id, online) => {
    let data = {
      online: online
    };
    data = JSON.stringify(data);
    return axios.post("/", {
      s: "App.Table.Update",
      model_name: "yesapi_fl_slide",
      id: id,
      data: data
    });
  },
  //删除轮播图
  deleteCarouselImg: (...id) => {
    let where = [];
    for (let i = 0; i < id.length; i++) {
      where.push("id=" + id[i]);
    }
    return axios.post("/", {
      s: "App.Table.FreeDelete",
      model_name: "yesapi_fl_slide",
      logic: "or",
      where: where
    });
  },
  //创建公告
  createAnnouncements: (title, content, deleted) => {
    let data = {
      uuid: store.state.uuid,
      title: title,
      content: content,
      deleted: deleted
    };
    data = JSON.stringify(data);
    return axios.post("/", {
      s: "App.Table.CheckCreateOrUpdate",
      model_name: "yesapi_crm_announcements",
      data: data,
      check_field: "title, content, deleted"
    });
  },
  //公告分页查询列表数据接口
  announcementsFreeQuery: (page, perpage, deleted) => {
    let where = ["id>0"];
    if (deleted) {
      where.push("deleted=" + deleted);
    }
    return axios.post("/", {
      s: "App.Table.FreeQuery",
      model_name: "yesapi_crm_announcements",
      where: where,
      page: page,
      perpage: perpage,
      order: ["id DESC"]
    });
  },
  //修改公告
  announcementsChange: (id, title, content, deleted) => {
    let data = {
      title: title,
      content: content,
      deleted: deleted
    };
    data = JSON.stringify(data);
    return axios.post("/", {
      s: "App.Table.Update",
      model_name: "yesapi_crm_announcements",
      id: id,
      data: data
    });
  },
  //删除公告
  deleteAnnouncements: (...id) => {
    let where = [];
    for (let i = 0; i < id.length; i++) {
      where.push("id=" + id[i]);
    }
    return axios.post("/", {
      s: "App.Table.FreeDelete",
      model_name: "yesapi_crm_announcements",
      logic: "or",
      where: where
    });
  },
  //创建文章分类
  createArticleType: (type_name, listorder, deleted, litpic) => {
    let data = {
      uuid: store.state.uuid,
      type_name: type_name,
      listorder: listorder,
      deleted: deleted,
      litpic: litpic
    };
    data = JSON.stringify(data);
    return axios.post("/", {
      s: "App.Table.CheckCreateOrUpdate",
      model_name: "yesapi_fl_article_type",
      data: data,
      check_field: "type_name, listorder, deleted, litpic"
    });
  },
  //文章分类分页查询列表数据接口
  articleTypeFreeQuery: (page, perpage, deleted) => {
    let where = ["id>0"];
    if (deleted) {
      where.push("deleted=" + deleted);
    }
    return axios.post("/", {
      s: "App.Table.FreeQuery",
      model_name: "yesapi_fl_article_type",
      where: where,
      page: page,
      perpage: perpage,
      order: ["id DESC"]
    });
  },
  //修改文章分类
  articleTypeChange: (id, type_name, listorder, deleted, litpic) => {
    let data = {
      type_name: type_name,
      listorder: listorder,
      deleted: deleted,
      litpic: litpic
    };
    data = JSON.stringify(data);
    return axios.post("/", {
      s: "App.Table.Update",
      model_name: "yesapi_fl_article_type",
      id: id,
      data: data
    });
  },
  //删除文章分类
  deletearticleType: (...id) => {
    let where = [];
    for (let i = 0; i < id.length; i++) {
      where.push("id=" + id[i]);
    }
    return axios.post("/", {
      s: "App.Table.FreeDelete",
      model_name: "yesapi_fl_article_type",
      logic: "or",
      where: where
    });
  },
  //创建文章
  createArticle: (type_id, content, litpic) => {
    let data = {
      uuid: store.state.uuid,
      user_id: store.state.uuid,
      writer: store.state.username,
      type_id: type_id,
      content: content,
      litpic: litpic
    };
    data = JSON.stringify(data);
    return axios.post("/", {
      s: "App.Table.CheckCreateOrUpdate",
      model_name: "yesapi_fl_article",
      data: data,
      check_field: "type_id, content, litpic"
    });
  },
  //精确取文章
  getArticle: id => {
    return axios.post("/", {
      s: "App.Table.FreeDelete",
      model_name: "yesapi_fl_article",
      logic: "or",
      id: id
    });
  },
  //文章分页查询列表数据接口
  articleFreeQuery: (page, perpage, type_id, order) => {
    let where = ["id>0", "type_id=" + type_id];
    return axios.post("/", {
      s: "App.Table.FreeQuery",
      model_name: "yesapi_fl_article_type",
      where: where,
      page: page,
      perpage: perpage,
      order: [order + " DESC"]
    });
  },
  //修改文章
  articleChange: (id, type_id, content, litpic) => {
    let data = {
      type_id: type_id,
      content: content,
      litpic: litpic
    };
    data = JSON.stringify(data);
    return axios.post("/", {
      s: "App.Table.Update",
      model_name: "yesapi_fl_article",
      id: id,
      data: data
    });
  },
  //删除文章
  deletearticle: id => {
    //删文章表
    function deleteMyArticle() {
      let where = ["id=" + id];
      // for (let i = 0; i < id.length; i++) {
      //   where.push("id=" + id[i]);
      // }
      return axios.post("/", {
        s: "App.Table.FreeDelete",
        model_name: "yesapi_fl_article",
        logic: "or",
        where: where
      });
    }
    //删评论表
    function deleteMyComment() {
      return axios.post("/", {
        s: "App.Table.FreeDelete",
        model_name: "yesapi_ann_blog_comment",
        logic: "or",
        where: ["tid=" + id]
      });
    }
    //删赞表
    function deleteMyPraise() {
      return axios.post("/", {
        s: "App.Table.FreeDelete",
        model_name: "yesapi_ann_blog_comment",
        logic: "or",
        where: ["articleId=" + id]
      });
    }
    return axios.all([deleteMyArticle(), deleteMyComment(), deleteMyPraise()]);
  },
  //创建评论
  createComment: (tid, content, uid, create_name, rid, r_name) => {
    function createMyComment() {
      let data = {
        uuid: store.state.uuid,
        tid: tid,
        content: content,
        uid: uid,
        create_name: create_name,
        rid: rid,
        r_name: r_name
      };
      data = JSON.stringify(data);
      return axios.post("/", {
        s: "App.Table.CheckCreateOrUpdate",
        model_name: "yesapi_ann_blog_comment",
        data: data,
        check_field: "tid, content, uid, create_name"
      });
    }

    function changeArticle() {
      return axios.post("/", {
        s: "App.Table.ChangeNumber",
        model_name: "yesapi_fl_article",
        id: tid,
        change_field: "comment_num",
        change_value: 1
      });
    }
    return axios.all([createMyComment(), changeArticle()]);
  },
  //评论分页查询列表数据接口(主题全部)
  commentsFreeQuery: (page, perpage, tid) => {
    let where = ["id>0", "tid=" + tid];
    return axios.post("/", {
      s: "App.Table.FreeQuery",
      model_name: "yesapi_ann_blog_comment",
      where: where,
      page: page,
      perpage: perpage
    });
  },
  //评论分页查询列表数据接口(主题)
  commentFreeQuery: (page, perpage, tid) => {
    let where = ["id>0", "rid=0", "tid=" + tid];
    return axios.post("/", {
      s: "App.Table.FreeQuery",
      model_name: "yesapi_ann_blog_comment",
      where: where,
      page: page,
      perpage: perpage
    });
  },
  //评论分页查询列表数据接口(评论)
  commentFreeQuery2: (page, perpage, tid, rid) => {
    let where = ["id>0", "tid=" + tid, "rid=" + rid];
    return axios.post("/", {
      s: "App.Table.FreeQuery",
      model_name: "yesapi_ann_blog_comment",
      where: where,
      page: page,
      perpage: perpage
    });
  },
  //删除评论
  deleteComment: (tid, ...id) => {
    function deleteComments() {
      let where = [];
      for (let i = 0; i < id.length; i++) {
        where.push("id=" + id[i]);
      }
      return axios.post("/", {
        s: "App.Table.FreeDelete",
        model_name: "yesapi_ann_blog_comment",
        logic: "or",
        where: where
      });
    }
    function changeArticle() {
      return axios.post("/", {
        s: "App.Table.ChangeNumber",
        model_name: "yesapi_fl_article",
        id: tid,
        change_field: "comment_num",
        change_value: -id.length
      });
    }
    return axios.all([deleteComments(), changeArticle()]);
  },
  //创建意见反馈
  createFeedback: (title, content) => {
    let data = {
      uuid: store.state.uuid,
      user_name: store.state.username,
      title: title,
      content: content
    };
    data = JSON.stringify(data);
    return axios.post("/", {
      s: "App.Table.CheckCreateOrUpdate",
      model_name: "yesapi_fl_feedback",
      data: data,
      check_field: "title, content"
    });
  },
  //意见反馈分页查询列表数据接口
  feedbackFreeQuery: (page, perpage) => {
    let where = ["id>0"];
    return axios.post("/", {
      s: "App.Table.FreeQuery",
      model_name: "yesapi_fl_feedback",
      where: where,
      page: page,
      perpage: perpage
    });
  },
  //删除意见反馈
  deleteFeedback: (...id) => {
    let where = [];
    for (let i = 0; i < id.length; i++) {
      where.push("id=" + id[i]);
    }
    return axios.post("/", {
      s: "App.Table.FreeDelete",
      model_name: "yesapi_fl_feedback",
      logic: "or",
      where: where
    });
  },
  //点赞
  createPraise: articleId => {
    function changePraise() {
      let data = {
        uuid: store.state.uuid,
        userId: store.state.uuid,
        articleId: articleId
      };
      data = JSON.stringify(data);
      return axios.post("/", {
        s: "App.Table.CheckCreateOrUpdate",
        model_name: "yesapi_praise",
        data: data,
        check_field: "articleId, userId"
      });
    }

    function changeArticle() {
      return axios.post("/", {
        s: "App.Table.ChangeNumber",
        model_name: "yesapi_fl_article",
        id: articleId,
        change_field: "praise_num",
        change_value: 1
      });
    }
    return axios.all([changePraise(), changeArticle()]);
  },
  //点赞分页查询列表数据接口
  praiseFreeQuery: (page, perpage) => {
    let where = ["id>0", "userId=" + store.state.uuid];
    return axios.post("/", {
      s: "App.Table.FreeQuery",
      model_name: "yesapi_praise",
      where: where,
      page: page,
      perpage: perpage
    });
  },
  //取消赞
  deletePraise: articleId => {
    function deletePraise() {
      let where = ["articleId=" + articleId, "userId=" + store.state.uuid];
      return axios.post("/", {
        s: "App.Table.FreeDelete",
        model_name: "yesapi_praise",
        logic: "and",
        where: where
      });
    }

    function changeArticle() {
      return axios.post("/", {
        s: "App.Table.ChangeNumber",
        model_name: "yesapi_fl_article",
        id: articleId,
        change_field: "praise_num",
        change_value: -1
      });
    }
    return axios.all([deletePraise(), changeArticle()]);
  }
};

export default api;
