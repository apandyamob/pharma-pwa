if(!self.define){let e,s={};const i=(i,c)=>(i=new URL(i+".js",c).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(c,r)=>{const f=e||("document"in self?document.currentScript.src:"")||location.href;if(s[f])return;let d={};const t=e=>i(e,f),n={module:{uri:f},exports:d,require:t};s[f]=Promise.all(c.map((e=>n[e]||t(e)))).then((e=>(r(...e),d)))}}define(["./workbox-d249b2c8"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"3rdpartylicenses.txt",revision:"888b7f564df5ea4b176b4c6ae277fe45"},{url:"assets/favicon.ico",revision:"ff6bb1a5358e909defc705773bc12ef4"},{url:"assets/readme.txt",revision:"dc263b3c53d6a13d83939b9afe245f6b"},{url:"firebase-messaging-sw.js",revision:"90d9fa8355dfc59963c3a002052d280e"},{url:"index.html",revision:"e3114ec1db1bdc52d843047dcef283d9"},{url:"main.dc82dffc5c6bb6a5.esm.js",revision:"fb3bd05e97bff979eda86a6331d4258a"},{url:"main.dc82dffc5c6bb6a5.esm.js.LICENSE.txt",revision:"b114cc85da504a772f040e3f40f8e46a"},{url:"polyfills.cd2c42f87092e8f8.esm.js",revision:"5080c83cacef9a32b4bf5ac65cc044f3"},{url:"robots.txt",revision:"fa1ded1ed7c11438a9b0385b1e112850"},{url:"runtime.c1411f2a2fb6c6b8.esm.js",revision:"b34634b1d93b3d249ac331df75a29690"}],{})}));
//# sourceMappingURL=service-worker.js.map
