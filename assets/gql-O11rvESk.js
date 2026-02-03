var bt=Object.defineProperty;var Ve=t=>{throw TypeError(t)};var Pt=(t,e,n)=>e in t?bt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var Pe=(t,e,n)=>Pt(t,typeof e!="symbol"?e+"":e,n),Se=(t,e,n)=>e.has(t)||Ve("Cannot "+n);var s=(t,e,n)=>(Se(t,e,"read from private field"),n?n.call(t):e.get(t)),d=(t,e,n)=>e.has(t)?Ve("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,n),u=(t,e,n,r)=>(Se(t,e,"write to private field"),r?r.call(t,n):e.set(t,n),n),y=(t,e,n)=>(Se(t,e,"access private method"),n);import{a as U,p as wt}from"./chunk-JZWAC4HX-Ct9RjdWh.js";var Ne=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(t){return this.listeners.add(t),this.onSubscribe(),()=>{this.listeners.delete(t),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}},St={setTimeout:(t,e)=>setTimeout(t,e),clearTimeout:t=>clearTimeout(t),setInterval:(t,e)=>setInterval(t,e),clearInterval:t=>clearInterval(t)},k,Ge,et,Ct=(et=class{constructor(){d(this,k,St);d(this,Ge,!1)}setTimeoutProvider(t){u(this,k,t)}setTimeout(t,e){return s(this,k).setTimeout(t,e)}clearTimeout(t){s(this,k).clearTimeout(t)}setInterval(t,e){return s(this,k).setInterval(t,e)}clearInterval(t){s(this,k).clearInterval(t)}},k=new WeakMap,Ge=new WeakMap,et),V=new Ct;function Rt(t){setTimeout(t,0)}var te=typeof window>"u"||"Deno"in globalThis;function pe(){}function Sn(t,e){return typeof t=="function"?t(e):t}function Re(t){return typeof t=="number"&&t>=0&&t!==1/0}function at(t,e){return Math.max(t+(e||0)-Date.now(),0)}function ne(t,e){return typeof t=="function"?t(e):t}function F(t,e){return typeof t=="function"?t(e):t}function Cn(t,e){const{type:n="all",exact:r,fetchStatus:i,predicate:a,queryKey:c,stale:o}=t;if(c){if(r){if(e.queryHash!==It(c,e.options))return!1}else if(!ke(e.queryKey,c))return!1}if(n!=="all"){const g=e.isActive();if(n==="active"&&!g||n==="inactive"&&g)return!1}return!(typeof o=="boolean"&&e.isStale()!==o||i&&i!==e.state.fetchStatus||a&&!a(e))}function Rn(t,e){const{exact:n,status:r,predicate:i,mutationKey:a}=t;if(a){if(!e.options.mutationKey)return!1;if(n){if(Ie(e.options.mutationKey)!==Ie(a))return!1}else if(!ke(e.options.mutationKey,a))return!1}return!(r&&e.state.status!==r||i&&!i(e))}function It(t,e){return((e==null?void 0:e.queryKeyHashFn)||Ie)(t)}function Ie(t){return JSON.stringify(t,(e,n)=>Ee(n)?Object.keys(n).sort().reduce((r,i)=>(r[i]=n[i],r),{}):n)}function ke(t,e){return t===e?!0:typeof t!=typeof e?!1:t&&e&&typeof t=="object"&&typeof e=="object"?Object.keys(e).every(n=>ke(t[n],e[n])):!1}var Dt=Object.prototype.hasOwnProperty;function ot(t,e,n=0){if(t===e)return t;if(n>500)return e;const r=We(t)&&We(e);if(!r&&!(Ee(t)&&Ee(e)))return e;const a=(r?t:Object.keys(t)).length,c=r?e:Object.keys(e),o=c.length,g=r?new Array(o):{};let v=0;for(let w=0;w<o;w++){const p=r?w:c[w],S=t[p],m=e[p];if(S===m){g[p]=S,(r?w<a:Dt.call(t,p))&&v++;continue}if(S===null||m===null||typeof S!="object"||typeof m!="object"){g[p]=m;continue}const I=ot(S,m,n+1);g[p]=I,I===S&&v++}return a===o&&v===a?t:g}function De(t,e){if(!e||Object.keys(t).length!==Object.keys(e).length)return!1;for(const n in t)if(t[n]!==e[n])return!1;return!0}function We(t){return Array.isArray(t)&&t.length===Object.keys(t).length}function Ee(t){if(!Ke(t))return!1;const e=t.constructor;if(e===void 0)return!0;const n=e.prototype;return!(!Ke(n)||!n.hasOwnProperty("isPrototypeOf")||Object.getPrototypeOf(t)!==Object.prototype)}function Ke(t){return Object.prototype.toString.call(t)==="[object Object]"}function Et(t){return new Promise(e=>{V.setTimeout(e,t)})}function _e(t,e,n){return typeof n.structuralSharing=="function"?n.structuralSharing(t,e):n.structuralSharing!==!1?ot(t,e):e}function In(t){return t}function Dn(t,e,n=0){const r=[...t,e];return n&&r.length>n?r.slice(1):r}function En(t,e,n=0){const r=[e,...t];return n&&r.length>n?r.slice(0,-1):r}var ut=Symbol();function _t(t,e){return!t.queryFn&&(e!=null&&e.initialPromise)?()=>e.initialPromise:!t.queryFn||t.queryFn===ut?()=>Promise.reject(new Error(`Missing queryFn: '${t.queryHash}'`)):t.queryFn}function ct(t,e){return typeof t=="function"?t(...e):!!t}function _n(t,e,n){let r=!1,i;return Object.defineProperty(t,"signal",{enumerable:!0,get:()=>(i??(i=e()),r||(r=!0,i.aborted?n():i.addEventListener("abort",n,{once:!0})),i)}),t}var W,L,se,tt,Ot=(tt=class extends Ne{constructor(){super();d(this,W);d(this,L);d(this,se);u(this,se,e=>{if(!te&&window.addEventListener){const n=()=>e();return window.addEventListener("visibilitychange",n,!1),()=>{window.removeEventListener("visibilitychange",n)}}})}onSubscribe(){s(this,L)||this.setEventListener(s(this,se))}onUnsubscribe(){var e;this.hasListeners()||((e=s(this,L))==null||e.call(this),u(this,L,void 0))}setEventListener(e){var n;u(this,se,e),(n=s(this,L))==null||n.call(this),u(this,L,e(r=>{typeof r=="boolean"?this.setFocused(r):this.onFocus()}))}setFocused(e){s(this,W)!==e&&(u(this,W,e),this.onFocus())}onFocus(){const e=this.isFocused();this.listeners.forEach(n=>{n(e)})}isFocused(){var e;return typeof s(this,W)=="boolean"?s(this,W):((e=globalThis.document)==null?void 0:e.visibilityState)!=="hidden"}},W=new WeakMap,L=new WeakMap,se=new WeakMap,tt),lt=new Ot;function Oe(){let t,e;const n=new Promise((i,a)=>{t=i,e=a});n.status="pending",n.catch(()=>{});function r(i){Object.assign(n,i),delete n.resolve,delete n.reject}return n.resolve=i=>{r({status:"fulfilled",value:i}),t(i)},n.reject=i=>{r({status:"rejected",reason:i}),e(i)},n}var Tt=Rt;function At(){let t=[],e=0,n=o=>{o()},r=o=>{o()},i=Tt;const a=o=>{e?t.push(o):i(()=>{n(o)})},c=()=>{const o=t;t=[],o.length&&i(()=>{r(()=>{o.forEach(g=>{n(g)})})})};return{batch:o=>{let g;e++;try{g=o()}finally{e--,e||c()}return g},batchCalls:o=>(...g)=>{a(()=>{o(...g)})},schedule:a,setNotifyFunction:o=>{n=o},setBatchNotifyFunction:o=>{r=o},setScheduler:o=>{i=o}}}var Le=At(),re,$,ie,nt,Ft=(nt=class extends Ne{constructor(){super();d(this,re,!0);d(this,$);d(this,ie);u(this,ie,e=>{if(!te&&window.addEventListener){const n=()=>e(!0),r=()=>e(!1);return window.addEventListener("online",n,!1),window.addEventListener("offline",r,!1),()=>{window.removeEventListener("online",n),window.removeEventListener("offline",r)}}})}onSubscribe(){s(this,$)||this.setEventListener(s(this,ie))}onUnsubscribe(){var e;this.hasListeners()||((e=s(this,$))==null||e.call(this),u(this,$,void 0))}setEventListener(e){var n;u(this,ie,e),(n=s(this,$))==null||n.call(this),u(this,$,e(this.setOnline.bind(this)))}setOnline(e){s(this,re)!==e&&(u(this,re,e),this.listeners.forEach(r=>{r(e)}))}isOnline(){return s(this,re)}},re=new WeakMap,$=new WeakMap,ie=new WeakMap,nt),ht=new Ft;function Ut(t){return Math.min(1e3*2**t,3e4)}function dt(t){return(t??"online")==="online"?ht.isOnline():!0}var Te=class extends Error{constructor(t){super("CancelledError"),this.revert=t==null?void 0:t.revert,this.silent=t==null?void 0:t.silent}};function jt(t){let e=!1,n=0,r;const i=Oe(),a=()=>i.status!=="pending",c=P=>{var b;if(!a()){const C=new Te(P);S(C),(b=t.onCancel)==null||b.call(t,C)}},o=()=>{e=!0},g=()=>{e=!1},v=()=>lt.isFocused()&&(t.networkMode==="always"||ht.isOnline())&&t.canRun(),w=()=>dt(t.networkMode)&&t.canRun(),p=P=>{a()||(r==null||r(),i.resolve(P))},S=P=>{a()||(r==null||r(),i.reject(P))},m=()=>new Promise(P=>{var b;r=C=>{(a()||v())&&P(C)},(b=t.onPause)==null||b.call(t)}).then(()=>{var P;r=void 0,a()||(P=t.onContinue)==null||P.call(t)}),I=()=>{if(a())return;let P;const b=n===0?t.initialPromise:void 0;try{P=b??t.fn()}catch(C){P=Promise.reject(C)}Promise.resolve(P).then(p).catch(C=>{var G;if(a())return;const O=t.retry??(te?0:3),x=t.retryDelay??Ut,l=typeof x=="function"?x(n,C):x,B=O===!0||typeof O=="number"&&n<O||typeof O=="function"&&O(n,C);if(e||!B){S(C);return}n++,(G=t.onFail)==null||G.call(t,n,C),Et(l).then(()=>v()?void 0:m()).then(()=>{e?S(C):I()})})};return{promise:i,status:()=>i.status,cancel:c,continue:()=>(r==null||r(),i),cancelRetry:o,continueRetry:g,canStart:w,start:()=>(w()?I():m().then(I),i)}}var K,st,xt=(st=class{constructor(){d(this,K)}destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),Re(this.gcTime)&&u(this,K,V.setTimeout(()=>{this.optionalRemove()},this.gcTime))}updateGcTime(t){this.gcTime=Math.max(this.gcTime||0,t??(te?1/0:300*1e3))}clearGcTimeout(){s(this,K)&&(V.clearTimeout(s(this,K)),u(this,K,void 0))}},K=new WeakMap,st),Y,ae,A,H,R,fe,J,j,z,rt,On=(rt=class extends xt{constructor(e){super();d(this,j);d(this,Y);d(this,ae);d(this,A);d(this,H);d(this,R);d(this,fe);d(this,J);u(this,J,!1),u(this,fe,e.defaultOptions),this.setOptions(e.options),this.observers=[],u(this,H,e.client),u(this,A,s(this,H).getQueryCache()),this.queryKey=e.queryKey,this.queryHash=e.queryHash,u(this,Y,He(this.options)),this.state=e.state??s(this,Y),this.scheduleGc()}get meta(){return this.options.meta}get promise(){var e;return(e=s(this,R))==null?void 0:e.promise}setOptions(e){if(this.options={...s(this,fe),...e},this.updateGcTime(this.options.gcTime),this.state&&this.state.data===void 0){const n=He(this.options);n.data!==void 0&&(this.setState(Ye(n.data,n.dataUpdatedAt)),u(this,Y,n))}}optionalRemove(){!this.observers.length&&this.state.fetchStatus==="idle"&&s(this,A).remove(this)}setData(e,n){const r=_e(this.state.data,e,this.options);return y(this,j,z).call(this,{data:r,type:"success",dataUpdatedAt:n==null?void 0:n.updatedAt,manual:n==null?void 0:n.manual}),r}setState(e,n){y(this,j,z).call(this,{type:"setState",state:e,setStateOptions:n})}cancel(e){var r,i;const n=(r=s(this,R))==null?void 0:r.promise;return(i=s(this,R))==null||i.cancel(e),n?n.then(pe).catch(pe):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}reset(){this.destroy(),this.setState(s(this,Y))}isActive(){return this.observers.some(e=>F(e.options.enabled,this)!==!1)}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===ut||this.state.dataUpdateCount+this.state.errorUpdateCount===0}isStatic(){return this.getObserversCount()>0?this.observers.some(e=>ne(e.options.staleTime,this)==="static"):!1}isStale(){return this.getObserversCount()>0?this.observers.some(e=>e.getCurrentResult().isStale):this.state.data===void 0||this.state.isInvalidated}isStaleByTime(e=0){return this.state.data===void 0?!0:e==="static"?!1:this.state.isInvalidated?!0:!at(this.state.dataUpdatedAt,e)}onFocus(){var n;const e=this.observers.find(r=>r.shouldFetchOnWindowFocus());e==null||e.refetch({cancelRefetch:!1}),(n=s(this,R))==null||n.continue()}onOnline(){var n;const e=this.observers.find(r=>r.shouldFetchOnReconnect());e==null||e.refetch({cancelRefetch:!1}),(n=s(this,R))==null||n.continue()}addObserver(e){this.observers.includes(e)||(this.observers.push(e),this.clearGcTimeout(),s(this,A).notify({type:"observerAdded",query:this,observer:e}))}removeObserver(e){this.observers.includes(e)&&(this.observers=this.observers.filter(n=>n!==e),this.observers.length||(s(this,R)&&(s(this,J)?s(this,R).cancel({revert:!0}):s(this,R).cancelRetry()),this.scheduleGc()),s(this,A).notify({type:"observerRemoved",query:this,observer:e}))}getObserversCount(){return this.observers.length}invalidate(){this.state.isInvalidated||y(this,j,z).call(this,{type:"invalidate"})}async fetch(e,n){var g,v,w,p,S,m,I,P,b,C,O,x;if(this.state.fetchStatus!=="idle"&&((g=s(this,R))==null?void 0:g.status())!=="rejected"){if(this.state.data!==void 0&&(n!=null&&n.cancelRefetch))this.cancel({silent:!0});else if(s(this,R))return s(this,R).continueRetry(),s(this,R).promise}if(e&&this.setOptions(e),!this.options.queryFn){const l=this.observers.find(B=>B.options.queryFn);l&&this.setOptions(l.options)}const r=new AbortController,i=l=>{Object.defineProperty(l,"signal",{enumerable:!0,get:()=>(u(this,J,!0),r.signal)})},a=()=>{const l=_t(this.options,n),G=(()=>{const we={client:s(this,H),queryKey:this.queryKey,meta:this.meta};return i(we),we})();return u(this,J,!1),this.options.persister?this.options.persister(l,G,this):l(G)},o=(()=>{const l={fetchOptions:n,options:this.options,queryKey:this.queryKey,client:s(this,H),state:this.state,fetchFn:a};return i(l),l})();(v=this.options.behavior)==null||v.onFetch(o,this),u(this,ae,this.state),(this.state.fetchStatus==="idle"||this.state.fetchMeta!==((w=o.fetchOptions)==null?void 0:w.meta))&&y(this,j,z).call(this,{type:"fetch",meta:(p=o.fetchOptions)==null?void 0:p.meta}),u(this,R,jt({initialPromise:n==null?void 0:n.initialPromise,fn:o.fetchFn,onCancel:l=>{l instanceof Te&&l.revert&&this.setState({...s(this,ae),fetchStatus:"idle"}),r.abort()},onFail:(l,B)=>{y(this,j,z).call(this,{type:"failed",failureCount:l,error:B})},onPause:()=>{y(this,j,z).call(this,{type:"pause"})},onContinue:()=>{y(this,j,z).call(this,{type:"continue"})},retry:o.options.retry,retryDelay:o.options.retryDelay,networkMode:o.options.networkMode,canRun:()=>!0}));try{const l=await s(this,R).start();if(l===void 0)throw new Error(`${this.queryHash} data is undefined`);return this.setData(l),(m=(S=s(this,A).config).onSuccess)==null||m.call(S,l,this),(P=(I=s(this,A).config).onSettled)==null||P.call(I,l,this.state.error,this),l}catch(l){if(l instanceof Te){if(l.silent)return s(this,R).promise;if(l.revert){if(this.state.data===void 0)throw l;return this.state.data}}throw y(this,j,z).call(this,{type:"error",error:l}),(C=(b=s(this,A).config).onError)==null||C.call(b,l,this),(x=(O=s(this,A).config).onSettled)==null||x.call(O,this.state.data,l,this),l}finally{this.scheduleGc()}}},Y=new WeakMap,ae=new WeakMap,A=new WeakMap,H=new WeakMap,R=new WeakMap,fe=new WeakMap,J=new WeakMap,j=new WeakSet,z=function(e){const n=r=>{switch(e.type){case"failed":return{...r,fetchFailureCount:e.failureCount,fetchFailureReason:e.error};case"pause":return{...r,fetchStatus:"paused"};case"continue":return{...r,fetchStatus:"fetching"};case"fetch":return{...r,...pt(r.data,this.options),fetchMeta:e.meta??null};case"success":const i={...r,...Ye(e.data,e.dataUpdatedAt),dataUpdateCount:r.dataUpdateCount+1,...!e.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return u(this,ae,e.manual?i:void 0),i;case"error":const a=e.error;return{...r,error:a,errorUpdateCount:r.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:r.fetchFailureCount+1,fetchFailureReason:a,fetchStatus:"idle",status:"error",isInvalidated:!0};case"invalidate":return{...r,isInvalidated:!0};case"setState":return{...r,...e.state}}};this.state=n(this.state),Le.batch(()=>{this.observers.forEach(r=>{r.onQueryUpdate()}),s(this,A).notify({query:this,type:"updated",action:e})})},rt);function pt(t,e){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:dt(e.networkMode)?"fetching":"paused",...t===void 0&&{error:null,status:"pending"}}}function Ye(t,e){return{data:t,dataUpdatedAt:e??Date.now(),error:null,isInvalidated:!1,status:"success"}}function He(t){const e=typeof t.initialData=="function"?t.initialData():t.initialData,n=e!==void 0,r=n?typeof t.initialDataUpdatedAt=="function"?t.initialDataUpdatedAt():t.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:n?r??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:n?"success":"pending",fetchStatus:"idle"}}var _,h,me,D,Z,oe,q,M,ye,ue,ce,X,ee,Q,le,f,de,Ae,Fe,Ue,je,xe,Be,ze,ft,it,Bt=(it=class extends Ne{constructor(e,n){super();d(this,f);d(this,_);d(this,h);d(this,me);d(this,D);d(this,Z);d(this,oe);d(this,q);d(this,M);d(this,ye);d(this,ue);d(this,ce);d(this,X);d(this,ee);d(this,Q);d(this,le,new Set);this.options=n,u(this,_,e),u(this,M,null),u(this,q,Oe()),this.bindMethods(),this.setOptions(n)}bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(s(this,h).addObserver(this),Je(s(this,h),this.options)?y(this,f,de).call(this):this.updateResult(),y(this,f,je).call(this))}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return qe(s(this,h),this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return qe(s(this,h),this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,y(this,f,xe).call(this),y(this,f,Be).call(this),s(this,h).removeObserver(this)}setOptions(e){const n=this.options,r=s(this,h);if(this.options=s(this,_).defaultQueryOptions(e),this.options.enabled!==void 0&&typeof this.options.enabled!="boolean"&&typeof this.options.enabled!="function"&&typeof F(this.options.enabled,s(this,h))!="boolean")throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");y(this,f,ze).call(this),s(this,h).setOptions(this.options),n._defaulted&&!De(this.options,n)&&s(this,_).getQueryCache().notify({type:"observerOptionsUpdated",query:s(this,h),observer:this});const i=this.hasListeners();i&&Ze(s(this,h),r,this.options,n)&&y(this,f,de).call(this),this.updateResult(),i&&(s(this,h)!==r||F(this.options.enabled,s(this,h))!==F(n.enabled,s(this,h))||ne(this.options.staleTime,s(this,h))!==ne(n.staleTime,s(this,h)))&&y(this,f,Ae).call(this);const a=y(this,f,Fe).call(this);i&&(s(this,h)!==r||F(this.options.enabled,s(this,h))!==F(n.enabled,s(this,h))||a!==s(this,Q))&&y(this,f,Ue).call(this,a)}getOptimisticResult(e){const n=s(this,_).getQueryCache().build(s(this,_),e),r=this.createResult(n,e);return qt(this,r)&&(u(this,D,r),u(this,oe,this.options),u(this,Z,s(this,h).state)),r}getCurrentResult(){return s(this,D)}trackResult(e,n){return new Proxy(e,{get:(r,i)=>(this.trackProp(i),n==null||n(i),i==="promise"&&(this.trackProp("data"),!this.options.experimental_prefetchInRender&&s(this,q).status==="pending"&&s(this,q).reject(new Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(r,i))})}trackProp(e){s(this,le).add(e)}getCurrentQuery(){return s(this,h)}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){const n=s(this,_).defaultQueryOptions(e),r=s(this,_).getQueryCache().build(s(this,_),n);return r.fetch().then(()=>this.createResult(r,n))}fetch(e){return y(this,f,de).call(this,{...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),s(this,D)))}createResult(e,n){var Me;const r=s(this,h),i=this.options,a=s(this,D),c=s(this,Z),o=s(this,oe),v=e!==r?e.state:s(this,me),{state:w}=e;let p={...w},S=!1,m;if(n._optimisticResults){const T=this.hasListeners(),he=!T&&Je(e,n),ge=T&&Ze(e,r,n,i);(he||ge)&&(p={...p,...pt(w.data,e.options)}),n._optimisticResults==="isRestoring"&&(p.fetchStatus="idle")}let{error:I,errorUpdatedAt:P,status:b}=p;m=p.data;let C=!1;if(n.placeholderData!==void 0&&m===void 0&&b==="pending"){let T;a!=null&&a.isPlaceholderData&&n.placeholderData===(o==null?void 0:o.placeholderData)?(T=a.data,C=!0):T=typeof n.placeholderData=="function"?n.placeholderData((Me=s(this,ce))==null?void 0:Me.state.data,s(this,ce)):n.placeholderData,T!==void 0&&(b="success",m=_e(a==null?void 0:a.data,T,n),S=!0)}if(n.select&&m!==void 0&&!C)if(a&&m===(c==null?void 0:c.data)&&n.select===s(this,ye))m=s(this,ue);else try{u(this,ye,n.select),m=n.select(m),m=_e(a==null?void 0:a.data,m,n),u(this,ue,m),u(this,M,null)}catch(T){u(this,M,T)}s(this,M)&&(I=s(this,M),m=s(this,ue),P=Date.now(),b="error");const O=p.fetchStatus==="fetching",x=b==="pending",l=b==="error",B=x&&O,G=m!==void 0,N={status:b,fetchStatus:p.fetchStatus,isPending:x,isSuccess:b==="success",isError:l,isInitialLoading:B,isLoading:B,data:m,dataUpdatedAt:p.dataUpdatedAt,error:I,errorUpdatedAt:P,failureCount:p.fetchFailureCount,failureReason:p.fetchFailureReason,errorUpdateCount:p.errorUpdateCount,isFetched:p.dataUpdateCount>0||p.errorUpdateCount>0,isFetchedAfterMount:p.dataUpdateCount>v.dataUpdateCount||p.errorUpdateCount>v.errorUpdateCount,isFetching:O,isRefetching:O&&!x,isLoadingError:l&&!G,isPaused:p.fetchStatus==="paused",isPlaceholderData:S,isRefetchError:l&&G,isStale:$e(e,n),refetch:this.refetch,promise:s(this,q),isEnabled:F(n.enabled,e)!==!1};if(this.options.experimental_prefetchInRender){const T=N.data!==void 0,he=N.status==="error"&&!T,ge=be=>{he?be.reject(N.error):T&&be.resolve(N.data)},Qe=()=>{const be=u(this,q,N.promise=Oe());ge(be)},ve=s(this,q);switch(ve.status){case"pending":e.queryHash===r.queryHash&&ge(ve);break;case"fulfilled":(he||N.data!==ve.value)&&Qe();break;case"rejected":(!he||N.error!==ve.reason)&&Qe();break}}return N}updateResult(){const e=s(this,D),n=this.createResult(s(this,h),this.options);if(u(this,Z,s(this,h).state),u(this,oe,this.options),s(this,Z).data!==void 0&&u(this,ce,s(this,h)),De(n,e))return;u(this,D,n);const r=()=>{if(!e)return!0;const{notifyOnChangeProps:i}=this.options,a=typeof i=="function"?i():i;if(a==="all"||!a&&!s(this,le).size)return!0;const c=new Set(a??s(this,le));return this.options.throwOnError&&c.add("error"),Object.keys(s(this,D)).some(o=>{const g=o;return s(this,D)[g]!==e[g]&&c.has(g)})};y(this,f,ft).call(this,{listeners:r()})}onQueryUpdate(){this.updateResult(),this.hasListeners()&&y(this,f,je).call(this)}},_=new WeakMap,h=new WeakMap,me=new WeakMap,D=new WeakMap,Z=new WeakMap,oe=new WeakMap,q=new WeakMap,M=new WeakMap,ye=new WeakMap,ue=new WeakMap,ce=new WeakMap,X=new WeakMap,ee=new WeakMap,Q=new WeakMap,le=new WeakMap,f=new WeakSet,de=function(e){y(this,f,ze).call(this);let n=s(this,h).fetch(this.options,e);return e!=null&&e.throwOnError||(n=n.catch(pe)),n},Ae=function(){y(this,f,xe).call(this);const e=ne(this.options.staleTime,s(this,h));if(te||s(this,D).isStale||!Re(e))return;const r=at(s(this,D).dataUpdatedAt,e)+1;u(this,X,V.setTimeout(()=>{s(this,D).isStale||this.updateResult()},r))},Fe=function(){return(typeof this.options.refetchInterval=="function"?this.options.refetchInterval(s(this,h)):this.options.refetchInterval)??!1},Ue=function(e){y(this,f,Be).call(this),u(this,Q,e),!(te||F(this.options.enabled,s(this,h))===!1||!Re(s(this,Q))||s(this,Q)===0)&&u(this,ee,V.setInterval(()=>{(this.options.refetchIntervalInBackground||lt.isFocused())&&y(this,f,de).call(this)},s(this,Q)))},je=function(){y(this,f,Ae).call(this),y(this,f,Ue).call(this,y(this,f,Fe).call(this))},xe=function(){s(this,X)&&(V.clearTimeout(s(this,X)),u(this,X,void 0))},Be=function(){s(this,ee)&&(V.clearInterval(s(this,ee)),u(this,ee,void 0))},ze=function(){const e=s(this,_).getQueryCache().build(s(this,_),this.options);if(e===s(this,h))return;const n=s(this,h);u(this,h,e),u(this,me,e.state),this.hasListeners()&&(n==null||n.removeObserver(this),e.addObserver(this))},ft=function(e){Le.batch(()=>{e.listeners&&this.listeners.forEach(n=>{n(s(this,D))}),s(this,_).getQueryCache().notify({query:s(this,h),type:"observerResultsUpdated"})})},it);function zt(t,e){return F(e.enabled,t)!==!1&&t.state.data===void 0&&!(t.state.status==="error"&&e.retryOnMount===!1)}function Je(t,e){return zt(t,e)||t.state.data!==void 0&&qe(t,e,e.refetchOnMount)}function qe(t,e,n){if(F(e.enabled,t)!==!1&&ne(e.staleTime,t)!=="static"){const r=typeof n=="function"?n(t):n;return r==="always"||r!==!1&&$e(t,e)}return!1}function Ze(t,e,n,r){return(t!==e||F(r.enabled,t)===!1)&&(!n.suspense||t.state.status!=="error")&&$e(t,n)}function $e(t,e){return F(e.enabled,t)!==!1&&t.isStaleByTime(ne(e.staleTime,t))}function qt(t,e){return!De(t.getCurrentResult(),e)}var mt=U.createContext(void 0),Gt=t=>{const e=U.useContext(mt);if(!e)throw new Error("No QueryClient set, use QueryClientProvider to set one");return e},Tn=({client:t,children:e})=>(U.useEffect(()=>(t.mount(),()=>{t.unmount()}),[t]),wt.jsx(mt.Provider,{value:t,children:e})),yt=U.createContext(!1),Nt=()=>U.useContext(yt);yt.Provider;function kt(){let t=!1;return{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t}}var Lt=U.createContext(kt()),$t=()=>U.useContext(Lt),Mt=(t,e,n)=>{const r=n!=null&&n.state.error&&typeof t.throwOnError=="function"?ct(t.throwOnError,[n.state.error,n]):t.throwOnError;(t.suspense||t.experimental_prefetchInRender||r)&&(e.isReset()||(t.retryOnMount=!1))},Qt=t=>{U.useEffect(()=>{t.clearReset()},[t])},Vt=({result:t,errorResetBoundary:e,throwOnError:n,query:r,suspense:i})=>t.isError&&!e.isReset()&&!t.isFetching&&r&&(i&&t.data===void 0||ct(n,[t.error,r])),Wt=t=>{if(t.suspense){const n=i=>i==="static"?i:Math.max(i??1e3,1e3),r=t.staleTime;t.staleTime=typeof r=="function"?(...i)=>n(r(...i)):n(r),typeof t.gcTime=="number"&&(t.gcTime=Math.max(t.gcTime,1e3))}},Kt=(t,e)=>t.isLoading&&t.isFetching&&!e,Yt=(t,e)=>(t==null?void 0:t.suspense)&&e.isPending,Xe=(t,e,n)=>e.fetchOptimistic(t).catch(()=>{n.clearReset()});function Ht(t,e,n){var S,m,I,P;const r=Nt(),i=$t(),a=Gt(),c=a.defaultQueryOptions(t);(m=(S=a.getDefaultOptions().queries)==null?void 0:S._experimental_beforeQuery)==null||m.call(S,c);const o=a.getQueryCache().get(c.queryHash);c._optimisticResults=r?"isRestoring":"optimistic",Wt(c),Mt(c,i,o),Qt(i);const g=!a.getQueryCache().get(c.queryHash),[v]=U.useState(()=>new e(a,c)),w=v.getOptimisticResult(c),p=!r&&t.subscribed!==!1;if(U.useSyncExternalStore(U.useCallback(b=>{const C=p?v.subscribe(Le.batchCalls(b)):pe;return v.updateResult(),C},[v,p]),()=>v.getCurrentResult(),()=>v.getCurrentResult()),U.useEffect(()=>{v.setOptions(c)},[c,v]),Yt(c,w))throw Xe(c,v,i);if(Vt({result:w,errorResetBoundary:i,throwOnError:c.throwOnError,query:o,suspense:c.suspense}))throw w.error;if((P=(I=a.getDefaultOptions().queries)==null?void 0:I._experimental_afterQuery)==null||P.call(I,c,w),c.experimental_prefetchInRender&&!te&&Kt(w,r)){const b=g?Xe(c,v,i):o==null?void 0:o.promise;b==null||b.catch(pe).finally(()=>{v.updateResult()})}return c.notifyOnChangeProps?w:v.trackResult(w)}function An(t,e){return Ht(t,Bt)}const Jt={};var Ce={};const Zt="https://ly-budget-gql-prod-702918025200.asia-east1.run.app/api/graphql",Xt="https://ly-budget-gql-dev-702918025200.asia-east1.run.app/api/graphql",en=()=>typeof process<"u"?Ce.VITE_GQL_ENDPOINT??Ce.GQL_ENDPOINT??Ce.GRAPHQL_ENDPOINT??null:null,tn=()=>typeof import.meta<"u"&&typeof Jt<"u"||typeof process<"u"?"production":null,nn=en(),gt=tn();console.log({mode:gt});const vt=nn??(gt==="production"?Zt:Xt);console.log({GQL_ENDPOINTS:vt});const Fn="/";async function Un(t,...[e]){const n=await fetch(vt,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/graphql-response+json"},body:JSON.stringify({query:t,variables:e})});if(!n.ok)throw new Error("Network response was not ok");return(await n.json()).data}var sn=(t=>(t.Asc="asc",t.Desc="desc",t))(sn||{}),rn=(t=>(t.Freeze="freeze",t.Other="other",t.Reduce="reduce",t))(rn||{});class E extends String{constructor(n,r){super(n);Pe(this,"__apiType");Pe(this,"value");Pe(this,"__meta__");this.value=n,this.__meta__=r}toString(){return this.value}}const jn=new E(`
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
    `,{fragmentName:"VisualizationProposalBase"}),xn=new E(`
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
}`,{fragmentName:"VisualizationProposalWithContext"}),an=new E(`
    query GetLatestBudgetYear($skip: Int!, $take: Int!) {
  budgetYears(orderBy: [{year: desc}], skip: $skip, take: $take) {
    year
    budgetProgress
    dataProgress
    unfreezeProgress
  }
}
    `),on=new E(`
    query GetBudgetYearsList {
  budgetYears(orderBy: [{year: desc}]) {
    id
    year
  }
}
    `),un=new E(`
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
    `),cn=new E(`
    query GetGovernments {
  governments {
    id
    name
    category
    description
  }
}
    `),ln=new E(`
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
    `),hn=new E(`
    query RecognitionImages {
  recognitionImages(where: {verificationStatus: {equals: "verified"}}) {
    result
  }
  recognitionImagesCount
}
    `),dn=new E(`
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
    `),pn=new E(`
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
    `),fn=new E(`
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
    unfreezeReport
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
      committee {
        displayName
        name
        endDate
        startDate
      }
    }
    unfreezeHistory {
      id
      displayName
      meetingDate
      description
      location
      meetingRecordUrl
      type
      committee {
        displayName
        name
        endDate
        startDate
      }
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
    `),mn=new E(`
    query GetProposalYears {
  budgetYears(orderBy: [{year: desc}]) {
    id
    year
    budgetProgress
    dataProgress
    unfreezeProgress
  }
}
    `),yn=new E(`
    query GetPaginatedProposals($skip: Int!, $take: Int!, $orderBy: [ProposalOrderByInput!]!, $where: ProposalWhereInput!) {
  proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {
    id
    description
    year {
      id
      year
    }
    unfreezeStatus
    meetings {
      id
      type
      committee {
        displayName
        name
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
    `),gn=new E(`
    mutation UPDATE_PROPOSAL_REACTS($where: ProposalWhereUniqueInput!, $data: ProposalUpdateInput!) {
  updateProposal(where: $where, data: $data) {
    id
    react_angry
    react_disappoint
    react_good
    react_whatever
  }
}
    `),vn=new E(`
    query GetVisualizationProposals($where: ProposalWhereInput!) {
  proposals(where: $where) {
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
}`),bn={"\n  query GetLatestBudgetYear($skip: Int!, $take: Int!) {\n    budgetYears(orderBy: [{ year: desc }], skip: $skip, take: $take) {\n      year\n      budgetProgress\n      dataProgress\n      unfreezeProgress\n    }\n  }\n":an,"\n  query GetBudgetYearsList {\n    budgetYears(orderBy: [{ year: desc }]) {\n      id\n      year\n    }\n  }\n":on,"\n  query GetBudgetsWithGovernment {\n    budgets {\n      id\n      type\n      year\n      projectName\n      projectDescription\n      budgetAmount\n      majorCategory\n      mediumCategory\n      minorCategory\n      description\n      government {\n        id\n        name\n        category\n      }\n    }\n    budgetsCount\n  }\n":un,"\n  query GetGovernments {\n    governments {\n      id\n      name\n      category\n      description\n    }\n  }\n":cn,"\n  query GetPeopleList {\n    peopleList(orderBy: [{ name: asc }]) {\n      id\n      name\n      type\n      description\n      party {\n        id\n        name\n      }\n    }\n  }\n":ln,'\n  query RecognitionImages {\n    recognitionImages(where: { verificationStatus: { equals: "verified" } }) {\n      result\n    }\n    recognitionImagesCount\n  }\n':hn,"\n  query People($where: PeopleWhereUniqueInput!) {\n    people(where: $where) {\n      id\n      name\n      description\n      party {\n        id\n        color\n        name\n      }\n      term {\n        termNumber\n        id\n      }\n      termCount\n      committees {\n        id\n        name\n        session\n        term {\n          id\n          startDate\n          termNumber\n        }\n      }\n    }\n  }\n":dn,"\n  query GetProposalsOrderedByIdDesc {\n    proposals(orderBy: [{ id: desc }]) {\n      id\n      description\n      reason\n      publishStatus\n      result\n      freezeAmount\n      reductionAmount\n      budgetImageUrl\n      proposalTypes\n      recognitionAnswer\n      unfreezeStatus\n      government {\n        id\n        name\n        category\n        description\n      }\n      budget {\n        id\n        projectName\n        budgetAmount\n        year\n        type\n        majorCategory\n        mediumCategory\n        minorCategory\n      }\n      proposers {\n        id\n        name\n        type\n        description\n      }\n      coSigners {\n        id\n        name\n        type\n      }\n    }\n    proposalsCount\n  }\n":pn,"\n  query GetProposalById($id: ID!) {\n    proposal(where: { id: $id }) {\n      id\n      description\n      reason\n      publishStatus\n      result\n      freezeAmount\n      reductionAmount\n      budgetImageUrl\n      proposalTypes\n      recognitionAnswer\n      unfreezeStatus\n      unfreezeReport\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n      budgetImageUrl\n      historicalParentProposals {\n        id\n      }\n      mergedParentProposals {\n        id\n        proposers {\n          id\n          name\n        }\n      }\n      historicalProposals {\n        id\n      }\n      government {\n        id\n        name\n        category\n        description\n      }\n      budget {\n        id\n        projectName\n        projectDescription\n        budgetAmount\n        budgetUrl\n        lastYearSettlement\n        year\n        type\n        majorCategory\n        mediumCategory\n        minorCategory\n        description\n      }\n      proposers {\n        id\n        name\n        type\n        description\n      }\n      coSigners {\n        id\n        name\n        type\n      }\n      meetings(orderBy: [{ meetingDate: desc }]) {\n        id\n        displayName\n        meetingDate\n        description\n        location\n        meetingRecordUrl\n        type\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      unfreezeHistory {\n        id\n        displayName\n        meetingDate\n        description\n        location\n        meetingRecordUrl\n        type\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      mergedProposals {\n        id\n        proposers {\n          id\n          name\n        }\n      }\n      historicalProposals {\n        id\n        meetings {\n          id\n        }\n        proposers {\n          id\n          name\n        }\n      }\n    }\n  }\n":fn,"\n  query GetProposalYears {\n    budgetYears(orderBy: [{ year: desc }]) {\n      id\n      year\n      budgetProgress\n      dataProgress\n      unfreezeProgress\n    }\n  }\n":mn,"\n  query GetPaginatedProposals(\n    $skip: Int!\n    $take: Int!\n    $orderBy: [ProposalOrderByInput!]!\n    $where: ProposalWhereInput!\n  ) {\n    proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {\n      id\n      description\n      year {\n        id\n        year\n      }\n      unfreezeStatus\n      meetings {\n        id\n        type\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      reason\n      result\n      freezeAmount\n      reductionAmount\n      proposalTypes\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n      government {\n        id\n        name\n      }\n      budget {\n        id\n        budgetAmount\n      }\n      proposers {\n        id\n        name\n      }\n    }\n    proposalsCount(where: $where)\n  }\n":yn,"\n  mutation UPDATE_PROPOSAL_REACTS(\n    $where: ProposalWhereUniqueInput!\n    $data: ProposalUpdateInput!\n  ) {\n    updateProposal(where: $where, data: $data) {\n      id\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n    }\n  }\n":gn,"\n  query GetVisualizationProposals($where: ProposalWhereInput!) {\n    proposals(where: $where) {\n      ...VisualizationProposalWithContext\n    }\n  }\n\n  fragment VisualizationProposalWithContext on Proposal {\n    ...VisualizationProposalBase\n    government {\n      name\n      category\n    }\n    year {\n      year\n    }\n  }\n\n  fragment VisualizationProposalBase on Proposal {\n    id\n    freezeAmount\n    reductionAmount\n    proposalTypes\n    proposers {\n      id\n      name\n      party {\n        name\n        color\n      }\n    }\n  }\n":vn};function Bn(t){return bn[t]??{}}export{Fn as E,sn as O,rn as P,On as Q,xt as R,Ne as S,xn as V,En as a,Dn as b,_n as c,pe as d,_t as e,Cn as f,lt as g,It as h,Sn as i,Ie as j,Un as k,Tn as l,Rn as m,Le as n,ht as o,ke as p,In as q,ne as r,ut as s,jn as t,An as u,Bn as v,De as w,Gt as x,ct as y,jt as z};
