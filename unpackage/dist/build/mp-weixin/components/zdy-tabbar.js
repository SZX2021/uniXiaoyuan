(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/zdy-tabbar"],{3773:function(e,t,n){"use strict";var c=n("b74a"),u=n.n(c);u.a},"3cc5":function(e,t,n){"use strict";n.r(t);var c=n("913e"),u=n.n(c);for(var i in c)["default"].indexOf(i)<0&&function(e){n.d(t,e,(function(){return c[e]}))}(i);t["default"]=u.a},"80c2":function(e,t,n){"use strict";n.d(t,"b",(function(){return u})),n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){return c}));var c={uniIcons:function(){return Promise.all([n.e("common/vendor"),n.e("uni_modules/uni-icons/components/uni-icons/uni-icons")]).then(n.bind(null,"c85c"))}},u=function(){var e=this.$createElement;this._self._c},i=[]},"913e":function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n={props:{currentPage:{type:Number,default:0}},data:function(){return{currentItem:0,tabbarList:[{id:0,path:"/pages/home/home",icon:"home",selectIcon:"home-filled",text:"首页",centerItem:!1},{id:1,path:"/pages/publish/publish",icon:"paperplane",selectIcon:"paperplane-filled",text:"发布",centerItem:!0},{id:2,path:"/pages/my/my",icon:"person",selectIcon:"auth",text:"我的",centerItem:!1}]}},mounted:function(){this.currentItem=this.currentPage,e.hideTabBar()},methods:{changeItem:function(t){e.switchTab({url:t.path})}}};t.default=n}).call(this,n("543d")["default"])},b74a:function(e,t,n){},e358:function(e,t,n){"use strict";n.r(t);var c=n("80c2"),u=n("3cc5");for(var i in u)["default"].indexOf(i)<0&&function(e){n.d(t,e,(function(){return u[e]}))}(i);n("3773");var r=n("f0c5"),a=Object(r["a"])(u["default"],c["b"],c["c"],!1,null,"4ed1166c",null,!1,c["a"],void 0);t["default"]=a.exports}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/zdy-tabbar-create-component',
    {
        'components/zdy-tabbar-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("e358"))
        })
    },
    [['components/zdy-tabbar-create-component']]
]);