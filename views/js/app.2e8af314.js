(function(e){function t(t){for(var n,a,i=t[0],u=t[1],c=t[2],l=0,p=[];l<i.length;l++)a=i[l],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&p.push(o[a][0]),o[a]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(e[n]=u[n]);d&&d(t);while(p.length)p.shift()();return s.push.apply(s,c||[]),r()}function r(){for(var e,t=0;t<s.length;t++){for(var r=s[t],n=!0,a=1;a<r.length;a++){var i=r[a];0!==o[i]&&(n=!1)}n&&(s.splice(t--,1),e=u(u.s=r[0]))}return e}var n={},a={app:0},o={app:0},s=[];function i(e){return u.p+"js/"+({about:"about"}[e]||e)+"."+{about:"7ee10533"}[e]+".js"}function u(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,u),r.l=!0,r.exports}u.e=function(e){var t=[],r={about:1};a[e]?t.push(a[e]):0!==a[e]&&r[e]&&t.push(a[e]=new Promise((function(t,r){for(var n="css/"+({about:"about"}[e]||e)+"."+{about:"670e2a68"}[e]+".css",o=u.p+n,s=document.getElementsByTagName("link"),i=0;i<s.length;i++){var c=s[i],l=c.getAttribute("data-href")||c.getAttribute("href");if("stylesheet"===c.rel&&(l===n||l===o))return t()}var p=document.getElementsByTagName("style");for(i=0;i<p.length;i++){c=p[i],l=c.getAttribute("data-href");if(l===n||l===o)return t()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=t,d.onerror=function(t){var n=t&&t.target&&t.target.src||o,s=new Error("Loading CSS chunk "+e+" failed.\n("+n+")");s.code="CSS_CHUNK_LOAD_FAILED",s.request=n,delete a[e],d.parentNode.removeChild(d),r(s)},d.href=o;var f=document.getElementsByTagName("head")[0];f.appendChild(d)})).then((function(){a[e]=0})));var n=o[e];if(0!==n)if(n)t.push(n[2]);else{var s=new Promise((function(t,r){n=o[e]=[t,r]}));t.push(n[2]=s);var c,l=document.createElement("script");l.charset="utf-8",l.timeout=120,u.nc&&l.setAttribute("nonce",u.nc),l.src=i(e);var p=new Error;c=function(t){l.onerror=l.onload=null,clearTimeout(d);var r=o[e];if(0!==r){if(r){var n=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;p.message="Loading chunk "+e+" failed.\n("+n+": "+a+")",p.name="ChunkLoadError",p.type=n,p.request=a,r[1](p)}o[e]=void 0}};var d=setTimeout((function(){c({type:"timeout",target:l})}),12e4);l.onerror=l.onload=c,document.head.appendChild(l)}return Promise.all(t)},u.m=e,u.c=n,u.d=function(e,t,r){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(u.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)u.d(r,n,function(t){return e[t]}.bind(null,n));return r},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="/",u.oe=function(e){throw console.error(e),e};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],l=c.push.bind(c);c.push=t,c=c.slice();for(var p=0;p<c.length;p++)t(c[p]);var d=l;s.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("56d7")},"0384":function(e,t,r){e.exports=r.p+"img/KITrental-logos_black.f3215692.png"},"56d7":function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var n=r("2b0e"),a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("router-view")],1)},o=[],s=(r("5c0b"),r("2877")),i={},u=Object(s["a"])(i,a,o,!1,null,null,null),c=u.exports,l=(r("d3b7"),r("3ca3"),r("ddb0"),r("8c4f")),p=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"home"},[n("section",{staticClass:"homeSection"},[n("div",{staticClass:"container-fluid"},[e._m(0),n("h2",{staticClass:"subtitle"},[e._v(" make sure you are in the right place! ")]),n("div",{staticClass:"formSection",on:{submit:function(t){return t.preventDefault(),e.submitForm.apply(null,arguments)}}},[n("img",{attrs:{src:r("0384")}}),n("div",{staticClass:"field"},[n("label",{staticClass:"label"},[e._v("Username")]),n("div",{staticClass:"control"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.username,expression:"username"}],attrs:{type:"text",placeholder:"Username"},domProps:{value:e.username},on:{input:function(t){t.target.composing||(e.username=t.target.value)}}})])]),n("div",{staticClass:"field"},[n("label",{staticClass:"label"},[e._v("Password")]),n("div",{staticClass:"control"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.password,expression:"password"}],attrs:{type:"password",placeholder:"Password"},domProps:{value:e.password},on:{input:function(t){t.target.composing||(e.password=t.target.value)}}})])]),n("button",{attrs:{type:"submit"}},[e._v("Login")])])])])])},d=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("h1",{staticClass:"title"},[e._v("Welcome into the Manager "),r("br"),e._v("Dashboard")])}],f=r("1da1"),m=(r("96cf"),r("e9c4"),{name:"home",components:{},data:function(){return{username:"",password:""}},methods:{submitForm:function(){var e=this;return Object(f["a"])(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,fetch("/API/login/Managers",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e.username,email:e.email,password:e.password})});case 2:if(r=t.sent,""!=r){t.next=5;break}return t.abrupt("return",0);case 5:case"end":return t.stop()}}),t)})))()}}}),v=m,h=(r("ce04"),Object(s["a"])(v,p,d,!1,null,"b101d98e",null)),b=h.exports;n["a"].use(l["a"]);var g=[{path:"/",name:"Home",component:b},{path:"/about",name:"About",component:function(){return r.e("about").then(r.bind(null,"f820"))}}],y=new l["a"]({mode:"history",base:"/",routes:g}),w=y;r("92c6");n["a"].config.productionTip=!1,new n["a"]({router:w,render:function(e){return e(c)}}).$mount("#app")},"5c0b":function(e,t,r){"use strict";r("9c0c")},"9c0c":function(e,t,r){},ce04:function(e,t,r){"use strict";r("ff68")},ff68:function(e,t,r){}});
//# sourceMappingURL=app.2e8af314.js.map