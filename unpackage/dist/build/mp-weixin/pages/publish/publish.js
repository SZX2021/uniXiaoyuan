(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/publish/publish"],{"0ef6":function(e,t,n){"use strict";(function(e,i){var a=n("4ea4");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=a(n("2eee")),r=a(n("c973")),u=a(n("1990")),c=(e.database(),{data:function(){return{tags:[{inverted:!1,tag:"日常"},{inverted:!0,tag:"吐槽"},{inverted:!0,tag:"集市"},{inverted:!0,tag:"失物招领"}],content:"",images:[],nimingFlag:!1}},methods:{onLoad:function(){this.checkLogin()},checkLogin:function(){var e=i.getStorageSync("token");return e?1:(i.showModal({title:"提示",content:"未登录，请您登录",success:function(e){e.confirm?(console.log("用户点击确定"),i.switchTab({url:"/pages/my/my"})):e.cancel&&(console.log("用户点击取消"),i.switchTab({url:"/pages/home/home"}))}}),0)},setInverted:function(e){this.tags.forEach((function(e){return e.inverted=!0})),this.tags[e].inverted=!this.tags[e].inverted},success:function(e){this.images=e.tempFilePaths},fail:function(e){i.showToast({title:"上传失败",icon:"fail"})},isNiming:function(e){this.nimingFlag=e.detail.value,console.log(e.detail.value)},checkForm:function(){var e=/[\u4e00-\u9fff]{5,}/.test(this.content);return e?1:(i.showToast({title:"内容不能少于5个汉字",icon:"error",duration:2e3}),0)},uploadForm:function(){var t=this;return(0,r.default)(o.default.mark((function n(){var a;return o.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(a=t.checkLogin(),a){n.next=3;break}return n.abrupt("return",0);case 3:if(t.checkForm()){n.next=5;break}return n.abrupt("return",0);case 5:return i.showLoading({title:"发布中..."}),n.next=8,t.$refs.images.upload();case 8:console.log("测试：",t.images),e.callFunction({name:"uploadArticle",data:{content:t.content,images:t.images,token:i.getStorageSync("token"),category:t.tags.find((function(e){return!1===e.inverted})).tag,nimingFlag:t.nimingFlag,time:Date.now()}}),i.hideLoading,u.default.dispatch("getArticle"),i.redirectTo({url:"../home/home"}),i.showToast({title:"发布成功"});case 14:case"end":return n.stop()}}),n)})))()}}});t.default=c}).call(this,n("a9ff")["default"],n("543d")["default"])},"2f94":function(e,t,n){"use strict";var i=n("8bf9"),a=n.n(i);a.a},"5f48":function(e,t,n){"use strict";n.d(t,"b",(function(){return a})),n.d(t,"c",(function(){return o})),n.d(t,"a",(function(){return i}));var i={uniFilePicker:function(){return Promise.all([n.e("common/vendor"),n.e("uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker")]).then(n.bind(null,"035b"))},uniTag:function(){return n.e("uni_modules/uni-tag/components/uni-tag/uni-tag").then(n.bind(null,"cd0d"))}},a=function(){var e=this.$createElement,t=(this._self._c,this.content.length);this.$mp.data=Object.assign({},{$root:{g0:t}})},o=[]},"8a6e":function(e,t,n){"use strict";n.r(t);var i=n("5f48"),a=n("bb14");for(var o in a)["default"].indexOf(o)<0&&function(e){n.d(t,e,(function(){return a[e]}))}(o);n("2f94");var r=n("f0c5"),u=Object(r["a"])(a["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],void 0);t["default"]=u.exports},"8bf9":function(e,t,n){},bb14:function(e,t,n){"use strict";n.r(t);var i=n("0ef6"),a=n.n(i);for(var o in i)["default"].indexOf(o)<0&&function(e){n.d(t,e,(function(){return i[e]}))}(o);t["default"]=a.a},f92e:function(e,t,n){"use strict";(function(e,t){var i=n("4ea4");n("7947"),n("a9ff");i(n("66fd"));var a=i(n("8a6e"));e.__webpack_require_UNI_MP_PLUGIN__=n,t(a.default)}).call(this,n("bc2e")["default"],n("543d")["createPage"])}},[["f92e","common/runtime","common/vendor"]]]);