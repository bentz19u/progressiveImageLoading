!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("vue-progressive-image-loading",[],t):"object"==typeof exports?exports["vue-progressive-image-loading"]=t():e["vue-progressive-image-loading"]=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){n(1);var r=n(6)(n(7),n(8),"data-v-8adc35c0",null);e.exports=r.exports},function(e,t,n){var r=n(2);"string"==typeof r&&(r=[[e.id,r,""]]),r.locals&&(e.exports=r.locals);n(4)("782f528a",r,!0)},function(e,t,n){t=e.exports=n(3)(void 0),t.push([e.id,"div[data-v-8adc35c0]{position:relative;width:20%;max-width:20%;height:200px;max-height:200px;margin:10px 2.5%}img[data-v-8adc35c0]{width:100%;height:100%;max-width:100%;max-height:100%;position:absolute;left:0;opacity:1;transition:opacity .5s linear}.hidden[data-v-8adc35c0]{opacity:0}",""])},function(e,t){function n(e,t){var n=e[1]||"",o=e[3];if(!o)return n;if(t&&"function"==typeof btoa){var i=r(o),a=o.sources.map(function(e){return"/*# sourceURL="+o.sourceRoot+e+" */"});return[n].concat(a).concat([i]).join("\n")}return[n].join("\n")}function r(e){var t=btoa(unescape(encodeURIComponent(JSON.stringify(e)))),n="sourceMappingURL=data:application/json;charset=utf-8;base64,"+t;return"/*# "+n+" */"}e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var r=n(t,e);return t[2]?"@media "+t[2]+"{"+r+"}":r}).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(r[i]=!0)}for(o=0;o<e.length;o++){var a=e[o];"number"==typeof a[0]&&r[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),t.push(a))}},t}},function(e,t,n){function r(e){for(var t=0;t<e.length;t++){var n=e[t],r=u[n.id];if(r){r.refs++;for(var o=0;o<r.parts.length;o++)r.parts[o](n.parts[o]);for(;o<n.parts.length;o++)r.parts.push(i(n.parts[o]));r.parts.length>n.parts.length&&(r.parts.length=n.parts.length)}else{for(var a=[],o=0;o<n.parts.length;o++)a.push(i(n.parts[o]));u[n.id]={id:n.id,refs:1,parts:a}}}}function o(){var e=document.createElement("style");return e.type="text/css",f.appendChild(e),e}function i(e){var t,n,r=document.querySelector('style[data-vue-ssr-id~="'+e.id+'"]');if(r){if(h)return g;r.parentNode.removeChild(r)}if(v){var i=l++;r=p||(p=o()),t=a.bind(null,r,i,!1),n=a.bind(null,r,i,!0)}else r=o(),t=s.bind(null,r),n=function(){r.parentNode.removeChild(r)};return t(e),function(r){if(r){if(r.css===e.css&&r.media===e.media&&r.sourceMap===e.sourceMap)return;t(e=r)}else n()}}function a(e,t,n,r){var o=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=m(t,o);else{var i=document.createTextNode(o),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(i,a[t]):e.appendChild(i)}}function s(e,t){var n=t.css,r=t.media,o=t.sourceMap;if(r&&e.setAttribute("media",r),o&&(n+="\n/*# sourceURL="+o.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */"),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}var c="undefined"!=typeof document,d=n(5),u={},f=c&&(document.head||document.getElementsByTagName("head")[0]),p=null,l=0,h=!1,g=function(){},v="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());e.exports=function(e,t,n){h=n;var o=d(e,t);return r(o),function(t){for(var n=[],i=0;i<o.length;i++){var a=o[i],s=u[a.id];s.refs--,n.push(s)}t?(o=d(e,t),r(o)):o=[];for(var i=0;i<n.length;i++){var s=n[i];if(0===s.refs){for(var c=0;c<s.parts.length;c++)s.parts[c]();delete u[s.id]}}}};var m=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()},function(e,t){e.exports=function(e,t){for(var n=[],r={},o=0;o<t.length;o++){var i=t[o],a=i[0],s=i[1],c=i[2],d=i[3],u={id:e+":"+o,css:s,media:c,sourceMap:d};r[a]?r[a].parts.push(u):n.push(r[a]={id:a,parts:[u]})}return n}},function(e,t){e.exports=function(e,t,n,r){var o,i=e=e||{},a=typeof e["default"];"object"!==a&&"function"!==a||(o=e,i=e["default"]);var s="function"==typeof i?i.options:i;if(t&&(s.render=t.render,s.staticRenderFns=t.staticRenderFns),n&&(s._scopeId=n),r){var c=Object.create(s.computed||null);Object.keys(r).forEach(function(e){var t=r[e];c[e]=function(){return t}}),s.computed=c}return{esModule:o,exports:i,options:s}}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={name:"progressiveImageLoading",props:["imgLow","imgHigh"],data:function(){return{imgHighAfficher:"",imgLowHidden:!1}},methods:{onLoadLow:function(){this.imgHighAfficher=this.imgHigh},onLoadHigh:function(){this.imgLowHidden=!0}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("img",{"class":{hidden:e.imgLowHidden},attrs:{src:e.imgLow},on:{load:e.onLoadLow}}),e._v(" "),n("img",{"class":{hidden:!e.imgLowHidden},attrs:{src:e.imgHighAfficher},on:{load:e.onLoadHigh}})])},staticRenderFns:[]}}])});