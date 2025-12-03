var pt=Object.defineProperty;var Qe=t=>{throw TypeError(t)};var ft=(t,e,s)=>e in t?pt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var be=(t,e,s)=>ft(t,typeof e!="symbol"?e+"":e,s),Pe=(t,e,s)=>e.has(t)||Qe("Cannot "+s);var n=(t,e,s)=>(Pe(t,e,"read from private field"),s?s.call(t):e.get(t)),p=(t,e,s)=>e.has(t)?Qe("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),o=(t,e,s,r)=>(Pe(t,e,"write to private field"),r?r.call(t,s):e.set(t,s),s),g=(t,e,s)=>(Pe(t,e,"access private method"),s);import{a as U,p as yt}from"./chunk-FGUA77HG-BrA7_UWl.js";var qe=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(t){return this.listeners.add(t),this.onSubscribe(),()=>{this.listeners.delete(t),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}},mt={setTimeout:(t,e)=>setTimeout(t,e),clearTimeout:t=>clearTimeout(t),setInterval:(t,e)=>setInterval(t,e),clearInterval:t=>clearInterval(t)},G,ke,Je,gt=(Je=class{constructor(){p(this,G,mt);p(this,ke,!1)}setTimeoutProvider(t){o(this,G,t)}setTimeout(t,e){return n(this,G).setTimeout(t,e)}clearTimeout(t){n(this,G).clearTimeout(t)}setInterval(t,e){return n(this,G).setInterval(t,e)}clearInterval(t){n(this,G).clearInterval(t)}},G=new WeakMap,ke=new WeakMap,Je),V=new gt;function vt(t){setTimeout(t,0)}var te=typeof window>"u"||"Deno"in globalThis;function pe(){}function ls(t,e){return typeof t=="function"?t(e):t}function Ce(t){return typeof t=="number"&&t>=0&&t!==1/0}function nt(t,e){return Math.max(t+(e||0)-Date.now(),0)}function ne(t,e){return typeof t=="function"?t(e):t}function _(t,e){return typeof t=="function"?t(e):t}function hs(t,e){const{type:s="all",exact:r,fetchStatus:i,predicate:a,queryKey:c,stale:u}=t;if(c){if(r){if(e.queryHash!==bt(c,e.options))return!1}else if(!xe(e.queryKey,c))return!1}if(s!=="all"){const l=e.isActive();if(s==="active"&&!l||s==="inactive"&&l)return!1}return!(typeof u=="boolean"&&e.isStale()!==u||i&&i!==e.state.fetchStatus||a&&!a(e))}function ds(t,e){const{exact:s,status:r,predicate:i,mutationKey:a}=t;if(a){if(!e.options.mutationKey)return!1;if(s){if(Se(e.options.mutationKey)!==Se(a))return!1}else if(!xe(e.options.mutationKey,a))return!1}return!(r&&e.state.status!==r||i&&!i(e))}function bt(t,e){return((e==null?void 0:e.queryKeyHashFn)||Se)(t)}function Se(t){return JSON.stringify(t,(e,s)=>Re(s)?Object.keys(s).sort().reduce((r,i)=>(r[i]=s[i],r),{}):s)}function xe(t,e){return t===e?!0:typeof t!=typeof e?!1:t&&e&&typeof t=="object"&&typeof e=="object"?Object.keys(e).every(s=>xe(t[s],e[s])):!1}var wt=Object.prototype.hasOwnProperty;function rt(t,e){if(t===e)return t;const s=Le(t)&&Le(e);if(!s&&!(Re(t)&&Re(e)))return e;const i=(s?t:Object.keys(t)).length,a=s?e:Object.keys(e),c=a.length,u=s?new Array(c):{};let l=0;for(let b=0;b<c;b++){const C=s?b:a[b],f=t[C],S=e[C];if(f===S){u[C]=f,(s?b<i:wt.call(t,C))&&l++;continue}if(f===null||S===null||typeof f!="object"||typeof S!="object"){u[C]=S;continue}const m=rt(f,S);u[C]=m,m===f&&l++}return i===c&&l===i?t:u}function Ie(t,e){if(!e||Object.keys(t).length!==Object.keys(e).length)return!1;for(const s in t)if(t[s]!==e[s])return!1;return!0}function Le(t){return Array.isArray(t)&&t.length===Object.keys(t).length}function Re(t){if(!Ne(t))return!1;const e=t.constructor;if(e===void 0)return!0;const s=e.prototype;return!(!Ne(s)||!s.hasOwnProperty("isPrototypeOf")||Object.getPrototypeOf(t)!==Object.prototype)}function Ne(t){return Object.prototype.toString.call(t)==="[object Object]"}function Pt(t){return new Promise(e=>{V.setTimeout(e,t)})}function Oe(t,e,s){return typeof s.structuralSharing=="function"?s.structuralSharing(t,e):s.structuralSharing!==!1?rt(t,e):e}function ps(t){return t}function fs(t,e,s=0){const r=[...t,e];return s&&r.length>s?r.slice(1):r}function ys(t,e,s=0){const r=[e,...t];return s&&r.length>s?r.slice(0,-1):r}var it=Symbol();function Ct(t,e){return!t.queryFn&&(e!=null&&e.initialPromise)?()=>e.initialPromise:!t.queryFn||t.queryFn===it?()=>Promise.reject(new Error(`Missing queryFn: '${t.queryHash}'`)):t.queryFn}function St(t,e){return typeof t=="function"?t(...e):!!t}var W,z,re,Ze,It=(Ze=class extends qe{constructor(){super();p(this,W);p(this,z);p(this,re);o(this,re,e=>{if(!te&&window.addEventListener){const s=()=>e();return window.addEventListener("visibilitychange",s,!1),()=>{window.removeEventListener("visibilitychange",s)}}})}onSubscribe(){n(this,z)||this.setEventListener(n(this,re))}onUnsubscribe(){var e;this.hasListeners()||((e=n(this,z))==null||e.call(this),o(this,z,void 0))}setEventListener(e){var s;o(this,re,e),(s=n(this,z))==null||s.call(this),o(this,z,e(r=>{typeof r=="boolean"?this.setFocused(r):this.onFocus()}))}setFocused(e){n(this,W)!==e&&(o(this,W,e),this.onFocus())}onFocus(){const e=this.isFocused();this.listeners.forEach(s=>{s(e)})}isFocused(){var e;return typeof n(this,W)=="boolean"?n(this,W):((e=globalThis.document)==null?void 0:e.visibilityState)!=="hidden"}},W=new WeakMap,z=new WeakMap,re=new WeakMap,Ze),at=new It;function De(){let t,e;const s=new Promise((i,a)=>{t=i,e=a});s.status="pending",s.catch(()=>{});function r(i){Object.assign(s,i),delete s.resolve,delete s.reject}return s.resolve=i=>{r({status:"fulfilled",value:i}),t(i)},s.reject=i=>{r({status:"rejected",reason:i}),e(i)},s}var Rt=vt;function Ot(){let t=[],e=0,s=u=>{u()},r=u=>{u()},i=Rt;const a=u=>{e?t.push(u):i(()=>{s(u)})},c=()=>{const u=t;t=[],u.length&&i(()=>{r(()=>{u.forEach(l=>{s(l)})})})};return{batch:u=>{let l;e++;try{l=u()}finally{e--,e||c()}return l},batchCalls:u=>(...l)=>{a(()=>{u(...l)})},schedule:a,setNotifyFunction:u=>{s=u},setBatchNotifyFunction:u=>{r=u},setScheduler:u=>{i=u}}}var Me=Ot(),ie,Q,ae,Xe,Dt=(Xe=class extends qe{constructor(){super();p(this,ie,!0);p(this,Q);p(this,ae);o(this,ae,e=>{if(!te&&window.addEventListener){const s=()=>e(!0),r=()=>e(!1);return window.addEventListener("online",s,!1),window.addEventListener("offline",r,!1),()=>{window.removeEventListener("online",s),window.removeEventListener("offline",r)}}})}onSubscribe(){n(this,Q)||this.setEventListener(n(this,ae))}onUnsubscribe(){var e;this.hasListeners()||((e=n(this,Q))==null||e.call(this),o(this,Q,void 0))}setEventListener(e){var s;o(this,ae,e),(s=n(this,Q))==null||s.call(this),o(this,Q,e(this.setOnline.bind(this)))}setOnline(e){n(this,ie)!==e&&(o(this,ie,e),this.listeners.forEach(r=>{r(e)}))}isOnline(){return n(this,ie)}},ie=new WeakMap,Q=new WeakMap,ae=new WeakMap,Xe),ot=new Dt;function Et(t){return Math.min(1e3*2**t,3e4)}function ut(t){return(t??"online")==="online"?ot.isOnline():!0}var Ee=class extends Error{constructor(t){super("CancelledError"),this.revert=t==null?void 0:t.revert,this.silent=t==null?void 0:t.silent}};function Tt(t){let e=!1,s=0,r;const i=De(),a=()=>i.status!=="pending",c=w=>{var v;if(!a()){const P=new Ee(w);S(P),(v=t.onCancel)==null||v.call(t,P)}},u=()=>{e=!0},l=()=>{e=!1},b=()=>at.isFocused()&&(t.networkMode==="always"||ot.isOnline())&&t.canRun(),C=()=>ut(t.networkMode)&&t.canRun(),f=w=>{a()||(r==null||r(),i.resolve(w))},S=w=>{a()||(r==null||r(),i.reject(w))},m=()=>new Promise(w=>{var v;r=P=>{(a()||b())&&w(P)},(v=t.onPause)==null||v.call(t)}).then(()=>{var w;r=void 0,a()||(w=t.onContinue)==null||w.call(t)}),E=()=>{if(a())return;let w;const v=s===0?t.initialPromise:void 0;try{w=v??t.fn()}catch(P){w=Promise.reject(P)}Promise.resolve(w).then(f).catch(P=>{var M;if(a())return;const T=t.retry??(te?0:3),B=t.retryDelay??Et,h=typeof B=="function"?B(s,P):B,k=T===!0||typeof T=="number"&&s<T||typeof T=="function"&&T(s,P);if(e||!k){S(P);return}s++,(M=t.onFail)==null||M.call(t,s,P),Pt(h).then(()=>b()?void 0:m()).then(()=>{e?S(P):E()})})};return{promise:i,status:()=>i.status,cancel:c,continue:()=>(r==null||r(),i),cancelRetry:u,continueRetry:l,canStart:C,start:()=>(C()?E():m().then(E),i)}}var K,et,Ft=(et=class{constructor(){p(this,K)}destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),Ce(this.gcTime)&&o(this,K,V.setTimeout(()=>{this.optionalRemove()},this.gcTime))}updateGcTime(t){this.gcTime=Math.max(this.gcTime||0,t??(te?1/0:300*1e3))}clearGcTimeout(){n(this,K)&&(V.clearTimeout(n(this,K)),o(this,K,void 0))}},K=new WeakMap,et),H,oe,A,Y,I,fe,J,j,q,tt,ms=(tt=class extends Ft{constructor(e){super();p(this,j);p(this,H);p(this,oe);p(this,A);p(this,Y);p(this,I);p(this,fe);p(this,J);o(this,J,!1),o(this,fe,e.defaultOptions),this.setOptions(e.options),this.observers=[],o(this,Y,e.client),o(this,A,n(this,Y).getQueryCache()),this.queryKey=e.queryKey,this.queryHash=e.queryHash,o(this,H,We(this.options)),this.state=e.state??n(this,H),this.scheduleGc()}get meta(){return this.options.meta}get promise(){var e;return(e=n(this,I))==null?void 0:e.promise}setOptions(e){if(this.options={...n(this,fe),...e},this.updateGcTime(this.options.gcTime),this.state&&this.state.data===void 0){const s=We(this.options);s.data!==void 0&&(this.setState(Ve(s.data,s.dataUpdatedAt)),o(this,H,s))}}optionalRemove(){!this.observers.length&&this.state.fetchStatus==="idle"&&n(this,A).remove(this)}setData(e,s){const r=Oe(this.state.data,e,this.options);return g(this,j,q).call(this,{data:r,type:"success",dataUpdatedAt:s==null?void 0:s.updatedAt,manual:s==null?void 0:s.manual}),r}setState(e,s){g(this,j,q).call(this,{type:"setState",state:e,setStateOptions:s})}cancel(e){var r,i;const s=(r=n(this,I))==null?void 0:r.promise;return(i=n(this,I))==null||i.cancel(e),s?s.then(pe).catch(pe):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}reset(){this.destroy(),this.setState(n(this,H))}isActive(){return this.observers.some(e=>_(e.options.enabled,this)!==!1)}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===it||this.state.dataUpdateCount+this.state.errorUpdateCount===0}isStatic(){return this.getObserversCount()>0?this.observers.some(e=>ne(e.options.staleTime,this)==="static"):!1}isStale(){return this.getObserversCount()>0?this.observers.some(e=>e.getCurrentResult().isStale):this.state.data===void 0||this.state.isInvalidated}isStaleByTime(e=0){return this.state.data===void 0?!0:e==="static"?!1:this.state.isInvalidated?!0:!nt(this.state.dataUpdatedAt,e)}onFocus(){var s;const e=this.observers.find(r=>r.shouldFetchOnWindowFocus());e==null||e.refetch({cancelRefetch:!1}),(s=n(this,I))==null||s.continue()}onOnline(){var s;const e=this.observers.find(r=>r.shouldFetchOnReconnect());e==null||e.refetch({cancelRefetch:!1}),(s=n(this,I))==null||s.continue()}addObserver(e){this.observers.includes(e)||(this.observers.push(e),this.clearGcTimeout(),n(this,A).notify({type:"observerAdded",query:this,observer:e}))}removeObserver(e){this.observers.includes(e)&&(this.observers=this.observers.filter(s=>s!==e),this.observers.length||(n(this,I)&&(n(this,J)?n(this,I).cancel({revert:!0}):n(this,I).cancelRetry()),this.scheduleGc()),n(this,A).notify({type:"observerRemoved",query:this,observer:e}))}getObserversCount(){return this.observers.length}invalidate(){this.state.isInvalidated||g(this,j,q).call(this,{type:"invalidate"})}async fetch(e,s){var l,b,C,f,S,m,E,w,v,P,T,B;if(this.state.fetchStatus!=="idle"&&((l=n(this,I))==null?void 0:l.status())!=="rejected"){if(this.state.data!==void 0&&(s!=null&&s.cancelRefetch))this.cancel({silent:!0});else if(n(this,I))return n(this,I).continueRetry(),n(this,I).promise}if(e&&this.setOptions(e),!this.options.queryFn){const h=this.observers.find(k=>k.options.queryFn);h&&this.setOptions(h.options)}const r=new AbortController,i=h=>{Object.defineProperty(h,"signal",{enumerable:!0,get:()=>(o(this,J,!0),r.signal)})},a=()=>{const h=Ct(this.options,s),M=(()=>{const we={client:n(this,Y),queryKey:this.queryKey,meta:this.meta};return i(we),we})();return o(this,J,!1),this.options.persister?this.options.persister(h,M,this):h(M)},u=(()=>{const h={fetchOptions:s,options:this.options,queryKey:this.queryKey,client:n(this,Y),state:this.state,fetchFn:a};return i(h),h})();(b=this.options.behavior)==null||b.onFetch(u,this),o(this,oe,this.state),(this.state.fetchStatus==="idle"||this.state.fetchMeta!==((C=u.fetchOptions)==null?void 0:C.meta))&&g(this,j,q).call(this,{type:"fetch",meta:(f=u.fetchOptions)==null?void 0:f.meta}),o(this,I,Tt({initialPromise:s==null?void 0:s.initialPromise,fn:u.fetchFn,onCancel:h=>{h instanceof Ee&&h.revert&&this.setState({...n(this,oe),fetchStatus:"idle"}),r.abort()},onFail:(h,k)=>{g(this,j,q).call(this,{type:"failed",failureCount:h,error:k})},onPause:()=>{g(this,j,q).call(this,{type:"pause"})},onContinue:()=>{g(this,j,q).call(this,{type:"continue"})},retry:u.options.retry,retryDelay:u.options.retryDelay,networkMode:u.options.networkMode,canRun:()=>!0}));try{const h=await n(this,I).start();if(h===void 0)throw new Error(`${this.queryHash} data is undefined`);return this.setData(h),(m=(S=n(this,A).config).onSuccess)==null||m.call(S,h,this),(w=(E=n(this,A).config).onSettled)==null||w.call(E,h,this.state.error,this),h}catch(h){if(h instanceof Ee){if(h.silent)return n(this,I).promise;if(h.revert){if(this.state.data===void 0)throw h;return this.state.data}}throw g(this,j,q).call(this,{type:"error",error:h}),(P=(v=n(this,A).config).onError)==null||P.call(v,h,this),(B=(T=n(this,A).config).onSettled)==null||B.call(T,this.state.data,h,this),h}finally{this.scheduleGc()}}},H=new WeakMap,oe=new WeakMap,A=new WeakMap,Y=new WeakMap,I=new WeakMap,fe=new WeakMap,J=new WeakMap,j=new WeakSet,q=function(e){const s=r=>{switch(e.type){case"failed":return{...r,fetchFailureCount:e.failureCount,fetchFailureReason:e.error};case"pause":return{...r,fetchStatus:"paused"};case"continue":return{...r,fetchStatus:"fetching"};case"fetch":return{...r,...ct(r.data,this.options),fetchMeta:e.meta??null};case"success":const i={...r,...Ve(e.data,e.dataUpdatedAt),dataUpdateCount:r.dataUpdateCount+1,...!e.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return o(this,oe,e.manual?i:void 0),i;case"error":const a=e.error;return{...r,error:a,errorUpdateCount:r.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:r.fetchFailureCount+1,fetchFailureReason:a,fetchStatus:"idle",status:"error"};case"invalidate":return{...r,isInvalidated:!0};case"setState":return{...r,...e.state}}};this.state=s(this.state),Me.batch(()=>{this.observers.forEach(r=>{r.onQueryUpdate()}),n(this,A).notify({query:this,type:"updated",action:e})})},tt);function ct(t,e){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:ut(e.networkMode)?"fetching":"paused",...t===void 0&&{error:null,status:"pending"}}}function Ve(t,e){return{data:t,dataUpdatedAt:e??Date.now(),error:null,isInvalidated:!1,status:"success"}}function We(t){const e=typeof t.initialData=="function"?t.initialData():t.initialData,s=e!==void 0,r=s?typeof t.initialDataUpdatedAt=="function"?t.initialDataUpdatedAt():t.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:s?r??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:s?"success":"pending",fetchStatus:"idle"}}var O,d,ye,R,Z,ue,x,L,me,ce,le,X,ee,N,he,y,de,Te,Fe,Ae,_e,Ue,je,Be,lt,st,At=(st=class extends qe{constructor(e,s){super();p(this,y);p(this,O);p(this,d);p(this,ye);p(this,R);p(this,Z);p(this,ue);p(this,x);p(this,L);p(this,me);p(this,ce);p(this,le);p(this,X);p(this,ee);p(this,N);p(this,he,new Set);this.options=s,o(this,O,e),o(this,L,null),o(this,x,De()),this.bindMethods(),this.setOptions(s)}bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(n(this,d).addObserver(this),Ke(n(this,d),this.options)?g(this,y,de).call(this):this.updateResult(),g(this,y,_e).call(this))}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return $e(n(this,d),this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return $e(n(this,d),this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,g(this,y,Ue).call(this),g(this,y,je).call(this),n(this,d).removeObserver(this)}setOptions(e){const s=this.options,r=n(this,d);if(this.options=n(this,O).defaultQueryOptions(e),this.options.enabled!==void 0&&typeof this.options.enabled!="boolean"&&typeof this.options.enabled!="function"&&typeof _(this.options.enabled,n(this,d))!="boolean")throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");g(this,y,Be).call(this),n(this,d).setOptions(this.options),s._defaulted&&!Ie(this.options,s)&&n(this,O).getQueryCache().notify({type:"observerOptionsUpdated",query:n(this,d),observer:this});const i=this.hasListeners();i&&He(n(this,d),r,this.options,s)&&g(this,y,de).call(this),this.updateResult(),i&&(n(this,d)!==r||_(this.options.enabled,n(this,d))!==_(s.enabled,n(this,d))||ne(this.options.staleTime,n(this,d))!==ne(s.staleTime,n(this,d)))&&g(this,y,Te).call(this);const a=g(this,y,Fe).call(this);i&&(n(this,d)!==r||_(this.options.enabled,n(this,d))!==_(s.enabled,n(this,d))||a!==n(this,N))&&g(this,y,Ae).call(this,a)}getOptimisticResult(e){const s=n(this,O).getQueryCache().build(n(this,O),e),r=this.createResult(s,e);return Ut(this,r)&&(o(this,R,r),o(this,ue,this.options),o(this,Z,n(this,d).state)),r}getCurrentResult(){return n(this,R)}trackResult(e,s){return new Proxy(e,{get:(r,i)=>(this.trackProp(i),s==null||s(i),i==="promise"&&(this.trackProp("data"),!this.options.experimental_prefetchInRender&&n(this,x).status==="pending"&&n(this,x).reject(new Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(r,i))})}trackProp(e){n(this,he).add(e)}getCurrentQuery(){return n(this,d)}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){const s=n(this,O).defaultQueryOptions(e),r=n(this,O).getQueryCache().build(n(this,O),s);return r.fetch().then(()=>this.createResult(r,s))}fetch(e){return g(this,y,de).call(this,{...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),n(this,R)))}createResult(e,s){var ze;const r=n(this,d),i=this.options,a=n(this,R),c=n(this,Z),u=n(this,ue),b=e!==r?e.state:n(this,ye),{state:C}=e;let f={...C},S=!1,m;if(s._optimisticResults){const F=this.hasListeners(),ge=!F&&Ke(e,s),se=F&&He(e,r,s,i);(ge||se)&&(f={...f,...ct(C.data,e.options)}),s._optimisticResults==="isRestoring"&&(f.fetchStatus="idle")}let{error:E,errorUpdatedAt:w,status:v}=f;m=f.data;let P=!1;if(s.placeholderData!==void 0&&m===void 0&&v==="pending"){let F;a!=null&&a.isPlaceholderData&&s.placeholderData===(u==null?void 0:u.placeholderData)?(F=a.data,P=!0):F=typeof s.placeholderData=="function"?s.placeholderData((ze=n(this,le))==null?void 0:ze.state.data,n(this,le)):s.placeholderData,F!==void 0&&(v="success",m=Oe(a==null?void 0:a.data,F,s),S=!0)}if(s.select&&m!==void 0&&!P)if(a&&m===(c==null?void 0:c.data)&&s.select===n(this,me))m=n(this,ce);else try{o(this,me,s.select),m=s.select(m),m=Oe(a==null?void 0:a.data,m,s),o(this,ce,m),o(this,L,null)}catch(F){o(this,L,F)}n(this,L)&&(E=n(this,L),m=n(this,ce),w=Date.now(),v="error");const T=f.fetchStatus==="fetching",B=v==="pending",h=v==="error",k=B&&T,M=m!==void 0,$={status:v,fetchStatus:f.fetchStatus,isPending:B,isSuccess:v==="success",isError:h,isInitialLoading:k,isLoading:k,data:m,dataUpdatedAt:f.dataUpdatedAt,error:E,errorUpdatedAt:w,failureCount:f.fetchFailureCount,failureReason:f.fetchFailureReason,errorUpdateCount:f.errorUpdateCount,isFetched:f.dataUpdateCount>0||f.errorUpdateCount>0,isFetchedAfterMount:f.dataUpdateCount>b.dataUpdateCount||f.errorUpdateCount>b.errorUpdateCount,isFetching:T,isRefetching:T&&!B,isLoadingError:h&&!M,isPaused:f.fetchStatus==="paused",isPlaceholderData:S,isRefetchError:h&&M,isStale:Ge(e,s),refetch:this.refetch,promise:n(this,x),isEnabled:_(s.enabled,e)!==!1};if(this.options.experimental_prefetchInRender){const F=ve=>{$.status==="error"?ve.reject($.error):$.data!==void 0&&ve.resolve($.data)},ge=()=>{const ve=o(this,x,$.promise=De());F(ve)},se=n(this,x);switch(se.status){case"pending":e.queryHash===r.queryHash&&F(se);break;case"fulfilled":($.status==="error"||$.data!==se.value)&&ge();break;case"rejected":($.status!=="error"||$.error!==se.reason)&&ge();break}}return $}updateResult(){const e=n(this,R),s=this.createResult(n(this,d),this.options);if(o(this,Z,n(this,d).state),o(this,ue,this.options),n(this,Z).data!==void 0&&o(this,le,n(this,d)),Ie(s,e))return;o(this,R,s);const r=()=>{if(!e)return!0;const{notifyOnChangeProps:i}=this.options,a=typeof i=="function"?i():i;if(a==="all"||!a&&!n(this,he).size)return!0;const c=new Set(a??n(this,he));return this.options.throwOnError&&c.add("error"),Object.keys(n(this,R)).some(u=>{const l=u;return n(this,R)[l]!==e[l]&&c.has(l)})};g(this,y,lt).call(this,{listeners:r()})}onQueryUpdate(){this.updateResult(),this.hasListeners()&&g(this,y,_e).call(this)}},O=new WeakMap,d=new WeakMap,ye=new WeakMap,R=new WeakMap,Z=new WeakMap,ue=new WeakMap,x=new WeakMap,L=new WeakMap,me=new WeakMap,ce=new WeakMap,le=new WeakMap,X=new WeakMap,ee=new WeakMap,N=new WeakMap,he=new WeakMap,y=new WeakSet,de=function(e){g(this,y,Be).call(this);let s=n(this,d).fetch(this.options,e);return e!=null&&e.throwOnError||(s=s.catch(pe)),s},Te=function(){g(this,y,Ue).call(this);const e=ne(this.options.staleTime,n(this,d));if(te||n(this,R).isStale||!Ce(e))return;const r=nt(n(this,R).dataUpdatedAt,e)+1;o(this,X,V.setTimeout(()=>{n(this,R).isStale||this.updateResult()},r))},Fe=function(){return(typeof this.options.refetchInterval=="function"?this.options.refetchInterval(n(this,d)):this.options.refetchInterval)??!1},Ae=function(e){g(this,y,je).call(this),o(this,N,e),!(te||_(this.options.enabled,n(this,d))===!1||!Ce(n(this,N))||n(this,N)===0)&&o(this,ee,V.setInterval(()=>{(this.options.refetchIntervalInBackground||at.isFocused())&&g(this,y,de).call(this)},n(this,N)))},_e=function(){g(this,y,Te).call(this),g(this,y,Ae).call(this,g(this,y,Fe).call(this))},Ue=function(){n(this,X)&&(V.clearTimeout(n(this,X)),o(this,X,void 0))},je=function(){n(this,ee)&&(V.clearInterval(n(this,ee)),o(this,ee,void 0))},Be=function(){const e=n(this,O).getQueryCache().build(n(this,O),this.options);if(e===n(this,d))return;const s=n(this,d);o(this,d,e),o(this,ye,e.state),this.hasListeners()&&(s==null||s.removeObserver(this),e.addObserver(this))},lt=function(e){Me.batch(()=>{e.listeners&&this.listeners.forEach(s=>{s(n(this,R))}),n(this,O).getQueryCache().notify({query:n(this,d),type:"observerResultsUpdated"})})},st);function _t(t,e){return _(e.enabled,t)!==!1&&t.state.data===void 0&&!(t.state.status==="error"&&e.retryOnMount===!1)}function Ke(t,e){return _t(t,e)||t.state.data!==void 0&&$e(t,e,e.refetchOnMount)}function $e(t,e,s){if(_(e.enabled,t)!==!1&&ne(e.staleTime,t)!=="static"){const r=typeof s=="function"?s(t):s;return r==="always"||r!==!1&&Ge(t,e)}return!1}function He(t,e,s,r){return(t!==e||_(r.enabled,t)===!1)&&(!s.suspense||t.state.status!=="error")&&Ge(t,s)}function Ge(t,e){return _(e.enabled,t)!==!1&&t.isStaleByTime(ne(e.staleTime,t))}function Ut(t,e){return!Ie(t.getCurrentResult(),e)}var ht=U.createContext(void 0),jt=t=>{const e=U.useContext(ht);if(!e)throw new Error("No QueryClient set, use QueryClientProvider to set one");return e},gs=({client:t,children:e})=>(U.useEffect(()=>(t.mount(),()=>{t.unmount()}),[t]),yt.jsx(ht.Provider,{value:t,children:e})),dt=U.createContext(!1),Bt=()=>U.useContext(dt);dt.Provider;function $t(){let t=!1;return{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t}}var kt=U.createContext($t()),qt=()=>U.useContext(kt),xt=(t,e)=>{(t.suspense||t.throwOnError||t.experimental_prefetchInRender)&&(e.isReset()||(t.retryOnMount=!1))},Mt=t=>{U.useEffect(()=>{t.clearReset()},[t])},Gt=({result:t,errorResetBoundary:e,throwOnError:s,query:r,suspense:i})=>t.isError&&!e.isReset()&&!t.isFetching&&r&&(i&&t.data===void 0||St(s,[t.error,r])),zt=t=>{if(t.suspense){const s=i=>i==="static"?i:Math.max(i??1e3,1e3),r=t.staleTime;t.staleTime=typeof r=="function"?(...i)=>s(r(...i)):s(r),typeof t.gcTime=="number"&&(t.gcTime=Math.max(t.gcTime,1e3))}},Qt=(t,e)=>t.isLoading&&t.isFetching&&!e,Lt=(t,e)=>(t==null?void 0:t.suspense)&&e.isPending,Ye=(t,e,s)=>e.fetchOptimistic(t).catch(()=>{s.clearReset()});function Nt(t,e,s){var f,S,m,E,w;const r=Bt(),i=qt(),a=jt(),c=a.defaultQueryOptions(t);(S=(f=a.getDefaultOptions().queries)==null?void 0:f._experimental_beforeQuery)==null||S.call(f,c),c._optimisticResults=r?"isRestoring":"optimistic",zt(c),xt(c,i),Mt(i);const u=!a.getQueryCache().get(c.queryHash),[l]=U.useState(()=>new e(a,c)),b=l.getOptimisticResult(c),C=!r&&t.subscribed!==!1;if(U.useSyncExternalStore(U.useCallback(v=>{const P=C?l.subscribe(Me.batchCalls(v)):pe;return l.updateResult(),P},[l,C]),()=>l.getCurrentResult(),()=>l.getCurrentResult()),U.useEffect(()=>{l.setOptions(c)},[c,l]),Lt(c,b))throw Ye(c,l,i);if(Gt({result:b,errorResetBoundary:i,throwOnError:c.throwOnError,query:a.getQueryCache().get(c.queryHash),suspense:c.suspense}))throw b.error;if((E=(m=a.getDefaultOptions().queries)==null?void 0:m._experimental_afterQuery)==null||E.call(m,c,b),c.experimental_prefetchInRender&&!te&&Qt(b,r)){const v=u?Ye(c,l,i):(w=a.getQueryCache().get(c.queryHash))==null?void 0:w.promise;v==null||v.catch(pe).finally(()=>{l.updateResult()})}return c.notifyOnChangeProps?b:l.trackResult(b)}function vs(t,e){return Nt(t,At)}const Vt="https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql",bs="/";async function ws(t,...[e]){const s=await fetch(Vt,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/graphql-response+json"},body:JSON.stringify({query:t,variables:e})});if(!s.ok)throw new Error("Network response was not ok");return(await s.json()).data}var Wt=(t=>(t.Asc="asc",t.Desc="desc",t))(Wt||{}),Kt=(t=>(t.Freeze="freeze",t.Other="other",t.Reduce="reduce",t))(Kt||{});class D extends String{constructor(s,r){super(s);be(this,"__apiType");be(this,"value");be(this,"__meta__");this.value=s,this.__meta__=r}toString(){return this.value}}const Ps=new D(`
    fragment VisualizationProposalBase on Proposal {
  id
  freezeAmount
  reductionAmount
  proposalTypes
  proposers {
    id
    name
    party {
      name
      color
    }
  }
}
    `,{fragmentName:"VisualizationProposalBase"}),Cs=new D(`
    fragment VisualizationProposalWithContext on Proposal {
  ...VisualizationProposalBase
  government {
    name
    category
  }
  year {
    year
  }
}
    fragment VisualizationProposalBase on Proposal {
  id
  freezeAmount
  reductionAmount
  proposalTypes
  proposers {
    id
    name
    party {
      name
      color
    }
  }
}`,{fragmentName:"VisualizationProposalWithContext"}),Ht=new D(`
    query GetLatestBudgetYear($skip: Int!, $take: Int!) {
  budgetYears(orderBy: [{year: desc}], skip: $skip, take: $take) {
    year
    budgetProgress
    dataProgress
  }
}
    `),Yt=new D(`
    query GetBudgetsWithGovernment {
  budgets {
    id
    type
    year
    projectName
    projectDescription
    budgetAmount
    majorCategory
    mediumCategory
    minorCategory
    description
    government {
      id
      name
      category
    }
  }
  budgetsCount
}
    `),Jt=new D(`
    query GetGovernments {
  governments {
    id
    name
    category
    description
  }
}
    `),Zt=new D(`
    query GetPeopleList {
  peopleList(orderBy: [{name: asc}]) {
    id
    name
    type
    description
    party {
      id
      name
    }
  }
}
    `),Xt=new D(`
    query RecognitionImages {
  recognitionImages {
    result
  }
  recognitionImagesCount
}
    `),es=new D(`
    query People($where: PeopleWhereUniqueInput!) {
  people(where: $where) {
    id
    name
    description
    party {
      id
      color
      name
    }
    term {
      termNumber
      id
    }
    termCount
    committees {
      id
      name
      session
      term {
        id
        startDate
        termNumber
      }
    }
  }
}
    `),ts=new D(`
    query GetProposalsOrderedByIdDesc {
  proposals(orderBy: [{id: desc}]) {
    id
    description
    reason
    publishStatus
    result
    freezeAmount
    reductionAmount
    budgetImageUrl
    proposalTypes
    recognitionAnswer
    unfreezeStatus
    government {
      id
      name
      category
      description
    }
    budget {
      id
      projectName
      budgetAmount
      year
      type
      majorCategory
      mediumCategory
      minorCategory
    }
    proposers {
      id
      name
      type
      description
    }
    coSigners {
      id
      name
      type
    }
  }
  proposalsCount
}
    `),ss=new D(`
    query GetProposalById($id: ID!) {
  proposal(where: {id: $id}) {
    id
    description
    reason
    publishStatus
    result
    freezeAmount
    reductionAmount
    budgetImageUrl
    proposalTypes
    recognitionAnswer
    unfreezeStatus
    react_angry
    react_disappoint
    react_good
    react_whatever
    budgetImageUrl
    historicalParentProposals {
      id
    }
    mergedParentProposals {
      id
      proposers {
        id
        name
      }
    }
    historicalProposals {
      id
    }
    government {
      id
      name
      category
      description
    }
    budget {
      id
      projectName
      projectDescription
      budgetAmount
      budgetUrl
      lastYearSettlement
      year
      type
      majorCategory
      mediumCategory
      minorCategory
      description
    }
    proposers {
      id
      name
      type
      description
    }
    coSigners {
      id
      name
      type
    }
    meetings(orderBy: [{meetingDate: desc}]) {
      id
      displayName
      meetingDate
      description
      location
      meetingRecordUrl
      type
    }
    mergedProposals {
      id
      proposers {
        id
        name
      }
    }
    historicalProposals {
      id
      meetings {
        id
      }
      proposers {
        id
        name
      }
    }
  }
}
    `),ns=new D(`
    query GetProposalYears {
  budgetYears(orderBy: [{year: desc}]) {
    id
    year
  }
}
    `),rs=new D(`
    query GetPaginatedProposals($skip: Int!, $take: Int!, $orderBy: [ProposalOrderByInput!]!, $where: ProposalWhereInput!) {
  proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {
    id
    description
    year {
      id
      year
    }
    meetings {
      id
      type
      committee {
        endDate
        startDate
      }
    }
    reason
    result
    freezeAmount
    reductionAmount
    proposalTypes
    react_angry
    react_disappoint
    react_good
    react_whatever
    government {
      id
      name
    }
    budget {
      id
      budgetAmount
    }
    proposers {
      id
      name
    }
  }
  proposalsCount(where: $where)
}
    `),is=new D(`
    mutation UPDATE_PROPOSAL_REACTS($where: ProposalWhereUniqueInput!, $data: ProposalUpdateInput!) {
  updateProposal(where: $where, data: $data) {
    id
    react_angry
    react_disappoint
    react_good
    react_whatever
  }
}
    `),as=new D(`
    query GetVisualizationProposals($skip: Int!, $orderBy: [ProposalOrderByInput!]!, $where: ProposalWhereInput!) {
  proposals(skip: $skip, orderBy: $orderBy, where: $where) {
    ...VisualizationProposalWithContext
  }
}
    fragment VisualizationProposalWithContext on Proposal {
  ...VisualizationProposalBase
  government {
    name
    category
  }
  year {
    year
  }
}
fragment VisualizationProposalBase on Proposal {
  id
  freezeAmount
  reductionAmount
  proposalTypes
  proposers {
    id
    name
    party {
      name
      color
    }
  }
}`),os={"\n  query GetLatestBudgetYear($skip: Int!, $take: Int!) {\n    budgetYears(orderBy: [{ year: desc }], skip: $skip, take: $take) {\n      year\n      budgetProgress\n      dataProgress\n    }\n  }\n":Ht,"\n  query GetBudgetsWithGovernment {\n    budgets {\n      id\n      type\n      year\n      projectName\n      projectDescription\n      budgetAmount\n      majorCategory\n      mediumCategory\n      minorCategory\n      description\n      government {\n        id\n        name\n        category\n      }\n    }\n    budgetsCount\n  }\n":Yt,"\n  query GetGovernments {\n    governments {\n      id\n      name\n      category\n      description\n    }\n  }\n":Jt,"\n  query GetPeopleList {\n    peopleList(orderBy: [{ name: asc }]) {\n      id\n      name\n      type\n      description\n      party {\n        id\n        name\n      }\n    }\n  }\n":Zt,"\n  query RecognitionImages {\n    recognitionImages {\n      result\n    }\n    recognitionImagesCount\n  }\n":Xt,"\n  query People($where: PeopleWhereUniqueInput!) {\n    people(where: $where) {\n      id\n      name\n      description\n      party {\n        id\n        color\n        name\n      }\n      term {\n        termNumber\n        id\n      }\n      termCount\n      committees {\n        id\n        name\n        session\n        term {\n          id\n          startDate\n          termNumber\n        }\n      }\n    }\n  }\n":es,"\n  query GetProposalsOrderedByIdDesc {\n    proposals(orderBy: [{ id: desc }]) {\n      id\n      description\n      reason\n      publishStatus\n      result\n      freezeAmount\n      reductionAmount\n      budgetImageUrl\n      proposalTypes\n      recognitionAnswer\n      unfreezeStatus\n      government {\n        id\n        name\n        category\n        description\n      }\n      budget {\n        id\n        projectName\n        budgetAmount\n        year\n        type\n        majorCategory\n        mediumCategory\n        minorCategory\n      }\n      proposers {\n        id\n        name\n        type\n        description\n      }\n      coSigners {\n        id\n        name\n        type\n      }\n    }\n    proposalsCount\n  }\n":ts,"\n  query GetProposalById($id: ID!) {\n    proposal(where: { id: $id }) {\n      id\n      description\n      reason\n      publishStatus\n      result\n      freezeAmount\n      reductionAmount\n      budgetImageUrl\n      proposalTypes\n      recognitionAnswer\n      unfreezeStatus\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n      budgetImageUrl\n      historicalParentProposals {\n        id\n      }\n      mergedParentProposals {\n        id\n        proposers {\n          id\n          name\n        }\n      }\n      historicalProposals {\n        id\n      }\n      government {\n        id\n        name\n        category\n        description\n      }\n      budget {\n        id\n        projectName\n        projectDescription\n        budgetAmount\n        budgetUrl\n        lastYearSettlement\n        year\n        type\n        majorCategory\n        mediumCategory\n        minorCategory\n        description\n      }\n      proposers {\n        id\n        name\n        type\n        description\n      }\n      coSigners {\n        id\n        name\n        type\n      }\n      meetings(orderBy: [{ meetingDate: desc }]) {\n        id\n        displayName\n        meetingDate\n        description\n        location\n        meetingRecordUrl\n        type\n      }\n      mergedProposals {\n        id\n        proposers {\n          id\n          name\n        }\n      }\n      historicalProposals {\n        id\n        meetings {\n          id\n        }\n        proposers {\n          id\n          name\n        }\n      }\n    }\n  }\n":ss,"\n  query GetProposalYears {\n    budgetYears(orderBy: [{ year: desc }]) {\n      id\n      year\n    }\n  }\n":ns,"\n  query GetPaginatedProposals(\n    $skip: Int!\n    $take: Int!\n    $orderBy: [ProposalOrderByInput!]!\n    $where: ProposalWhereInput!\n  ) {\n    proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {\n      id\n      description\n      year {\n        id\n        year\n      }\n      meetings {\n        id\n        type\n        committee {\n          endDate\n          startDate\n        }\n      }\n      reason\n      result\n      freezeAmount\n      reductionAmount\n      proposalTypes\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n      government {\n        id\n        name\n      }\n      budget {\n        id\n        budgetAmount\n      }\n      proposers {\n        id\n        name\n      }\n    }\n    proposalsCount(where: $where)\n  }\n":rs,"\n  mutation UPDATE_PROPOSAL_REACTS(\n    $where: ProposalWhereUniqueInput!\n    $data: ProposalUpdateInput!\n  ) {\n    updateProposal(where: $where, data: $data) {\n      id\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n    }\n  }\n":is,"\n  query GetVisualizationProposals(\n    $skip: Int!\n    $orderBy: [ProposalOrderByInput!]!\n    $where: ProposalWhereInput!\n  ) {\n    proposals(skip: $skip, orderBy: $orderBy, where: $where) {\n      ...VisualizationProposalWithContext\n    }\n  }\n\n  fragment VisualizationProposalWithContext on Proposal {\n    ...VisualizationProposalBase\n    government {\n      name\n      category\n    }\n    year {\n      year\n    }\n  }\n\n  fragment VisualizationProposalBase on Proposal {\n    id\n    freezeAmount\n    reductionAmount\n    proposalTypes\n    proposers {\n      id\n      name\n      party {\n        name\n        color\n      }\n    }\n  }\n":as};function Ss(t){return os[t]??{}}export{bs as E,Wt as O,Kt as P,ms as Q,Ft as R,qe as S,Ps as V,ys as a,fs as b,pe as c,hs as d,Ct as e,at as f,ls as g,bt as h,Se as i,ws as j,gs as k,ps as l,ds as m,Me as n,ot as o,xe as p,Cs as q,ne as r,it as s,Ss as t,vs as u,Ie as v,jt as w,St as x,Tt as y};
