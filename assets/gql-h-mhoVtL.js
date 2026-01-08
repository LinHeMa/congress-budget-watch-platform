var gt=Object.defineProperty;var Le=t=>{throw TypeError(t)};var vt=(t,e,n)=>e in t?gt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var be=(t,e,n)=>vt(t,typeof e!="symbol"?e+"":e,n),Pe=(t,e,n)=>e.has(t)||Le("Cannot "+n);var s=(t,e,n)=>(Pe(t,e,"read from private field"),n?n.call(t):e.get(t)),d=(t,e,n)=>e.has(t)?Le("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,n),u=(t,e,n,r)=>(Pe(t,e,"write to private field"),r?r.call(t,n):e.set(t,n),n),y=(t,e,n)=>(Pe(t,e,"access private method"),n);import{a as U,p as bt}from"./chunk-EPOLDU6W-BUbbWhPN.js";var Ge=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(t){return this.listeners.add(t),this.onSubscribe(),()=>{this.listeners.delete(t),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}},wt={setTimeout:(t,e)=>setTimeout(t,e),clearTimeout:t=>clearTimeout(t),setInterval:(t,e)=>setInterval(t,e),clearInterval:t=>clearInterval(t)},$,Be,Ze,Pt=(Ze=class{constructor(){d(this,$,wt);d(this,Be,!1)}setTimeoutProvider(t){u(this,$,t)}setTimeout(t,e){return s(this,$).setTimeout(t,e)}clearTimeout(t){s(this,$).clearTimeout(t)}setInterval(t,e){return s(this,$).setInterval(t,e)}clearInterval(t){s(this,$).clearInterval(t)}},$=new WeakMap,Be=new WeakMap,Ze),V=new Pt;function St(t){setTimeout(t,0)}var te=typeof window>"u"||"Deno"in globalThis;function pe(){}function bn(t,e){return typeof t=="function"?t(e):t}function Ce(t){return typeof t=="number"&&t>=0&&t!==1/0}function rt(t,e){return Math.max(t+(e||0)-Date.now(),0)}function se(t,e){return typeof t=="function"?t(e):t}function F(t,e){return typeof t=="function"?t(e):t}function wn(t,e){const{type:n="all",exact:r,fetchStatus:i,predicate:a,queryKey:c,stale:o}=t;if(c){if(r){if(e.queryHash!==Ct(c,e.options))return!1}else if(!Ne(e.queryKey,c))return!1}if(n!=="all"){const v=e.isActive();if(n==="active"&&!v||n==="inactive"&&v)return!1}return!(typeof o=="boolean"&&e.isStale()!==o||i&&i!==e.state.fetchStatus||a&&!a(e))}function Pn(t,e){const{exact:n,status:r,predicate:i,mutationKey:a}=t;if(a){if(!e.options.mutationKey)return!1;if(n){if(Ie(e.options.mutationKey)!==Ie(a))return!1}else if(!Ne(e.options.mutationKey,a))return!1}return!(r&&e.state.status!==r||i&&!i(e))}function Ct(t,e){return((e==null?void 0:e.queryKeyHashFn)||Ie)(t)}function Ie(t){return JSON.stringify(t,(e,n)=>Ee(n)?Object.keys(n).sort().reduce((r,i)=>(r[i]=n[i],r),{}):n)}function Ne(t,e){return t===e?!0:typeof t!=typeof e?!1:t&&e&&typeof t=="object"&&typeof e=="object"?Object.keys(e).every(n=>Ne(t[n],e[n])):!1}var It=Object.prototype.hasOwnProperty;function it(t,e){if(t===e)return t;const n=Qe(t)&&Qe(e);if(!n&&!(Ee(t)&&Ee(e)))return e;const i=(n?t:Object.keys(t)).length,a=n?e:Object.keys(e),c=a.length,o=n?new Array(c):{};let v=0;for(let m=0;m<c;m++){const w=n?m:a[m],p=t[w],S=e[w];if(p===S){o[w]=p,(n?m<i:It.call(t,w))&&v++;continue}if(p===null||S===null||typeof p!="object"||typeof S!="object"){o[w]=S;continue}const g=it(p,S);o[w]=g,g===p&&v++}return i===c&&v===i?t:o}function Re(t,e){if(!e||Object.keys(t).length!==Object.keys(e).length)return!1;for(const n in t)if(t[n]!==e[n])return!1;return!0}function Qe(t){return Array.isArray(t)&&t.length===Object.keys(t).length}function Ee(t){if(!Ve(t))return!1;const e=t.constructor;if(e===void 0)return!0;const n=e.prototype;return!(!Ve(n)||!n.hasOwnProperty("isPrototypeOf")||Object.getPrototypeOf(t)!==Object.prototype)}function Ve(t){return Object.prototype.toString.call(t)==="[object Object]"}function Rt(t){return new Promise(e=>{V.setTimeout(e,t)})}function De(t,e,n){return typeof n.structuralSharing=="function"?n.structuralSharing(t,e):n.structuralSharing!==!1?it(t,e):e}function Sn(t){return t}function Cn(t,e,n=0){const r=[...t,e];return n&&r.length>n?r.slice(1):r}function In(t,e,n=0){const r=[e,...t];return n&&r.length>n?r.slice(0,-1):r}var at=Symbol();function Et(t,e){return!t.queryFn&&(e!=null&&e.initialPromise)?()=>e.initialPromise:!t.queryFn||t.queryFn===at?()=>Promise.reject(new Error(`Missing queryFn: '${t.queryHash}'`)):t.queryFn}function ot(t,e){return typeof t=="function"?t(...e):!!t}function Rn(t,e,n){let r=!1,i;return Object.defineProperty(t,"signal",{enumerable:!0,get:()=>(i??(i=e()),r||(r=!0,i.aborted?n():i.addEventListener("abort",n,{once:!0})),i)}),t}var W,M,re,Xe,Dt=(Xe=class extends Ge{constructor(){super();d(this,W);d(this,M);d(this,re);u(this,re,e=>{if(!te&&window.addEventListener){const n=()=>e();return window.addEventListener("visibilitychange",n,!1),()=>{window.removeEventListener("visibilitychange",n)}}})}onSubscribe(){s(this,M)||this.setEventListener(s(this,re))}onUnsubscribe(){var e;this.hasListeners()||((e=s(this,M))==null||e.call(this),u(this,M,void 0))}setEventListener(e){var n;u(this,re,e),(n=s(this,M))==null||n.call(this),u(this,M,e(r=>{typeof r=="boolean"?this.setFocused(r):this.onFocus()}))}setFocused(e){s(this,W)!==e&&(u(this,W,e),this.onFocus())}onFocus(){const e=this.isFocused();this.listeners.forEach(n=>{n(e)})}isFocused(){var e;return typeof s(this,W)=="boolean"?s(this,W):((e=globalThis.document)==null?void 0:e.visibilityState)!=="hidden"}},W=new WeakMap,M=new WeakMap,re=new WeakMap,Xe),ut=new Dt;function _e(){let t,e;const n=new Promise((i,a)=>{t=i,e=a});n.status="pending",n.catch(()=>{});function r(i){Object.assign(n,i),delete n.resolve,delete n.reject}return n.resolve=i=>{r({status:"fulfilled",value:i}),t(i)},n.reject=i=>{r({status:"rejected",reason:i}),e(i)},n}var _t=St;function Ot(){let t=[],e=0,n=o=>{o()},r=o=>{o()},i=_t;const a=o=>{e?t.push(o):i(()=>{n(o)})},c=()=>{const o=t;t=[],o.length&&i(()=>{r(()=>{o.forEach(v=>{n(v)})})})};return{batch:o=>{let v;e++;try{v=o()}finally{e--,e||c()}return v},batchCalls:o=>(...v)=>{a(()=>{o(...v)})},schedule:a,setNotifyFunction:o=>{n=o},setBatchNotifyFunction:o=>{r=o},setScheduler:o=>{i=o}}}var $e=Ot(),ie,z,ae,et,Tt=(et=class extends Ge{constructor(){super();d(this,ie,!0);d(this,z);d(this,ae);u(this,ae,e=>{if(!te&&window.addEventListener){const n=()=>e(!0),r=()=>e(!1);return window.addEventListener("online",n,!1),window.addEventListener("offline",r,!1),()=>{window.removeEventListener("online",n),window.removeEventListener("offline",r)}}})}onSubscribe(){s(this,z)||this.setEventListener(s(this,ae))}onUnsubscribe(){var e;this.hasListeners()||((e=s(this,z))==null||e.call(this),u(this,z,void 0))}setEventListener(e){var n;u(this,ae,e),(n=s(this,z))==null||n.call(this),u(this,z,e(this.setOnline.bind(this)))}setOnline(e){s(this,ie)!==e&&(u(this,ie,e),this.listeners.forEach(r=>{r(e)}))}isOnline(){return s(this,ie)}},ie=new WeakMap,z=new WeakMap,ae=new WeakMap,et),ct=new Tt;function At(t){return Math.min(1e3*2**t,3e4)}function lt(t){return(t??"online")==="online"?ct.isOnline():!0}var Oe=class extends Error{constructor(t){super("CancelledError"),this.revert=t==null?void 0:t.revert,this.silent=t==null?void 0:t.silent}};function Ft(t){let e=!1,n=0,r;const i=_e(),a=()=>i.status!=="pending",c=P=>{var b;if(!a()){const C=new Oe(P);S(C),(b=t.onCancel)==null||b.call(t,C)}},o=()=>{e=!0},v=()=>{e=!1},m=()=>ut.isFocused()&&(t.networkMode==="always"||ct.isOnline())&&t.canRun(),w=()=>lt(t.networkMode)&&t.canRun(),p=P=>{a()||(r==null||r(),i.resolve(P))},S=P=>{a()||(r==null||r(),i.reject(P))},g=()=>new Promise(P=>{var b;r=C=>{(a()||m())&&P(C)},(b=t.onPause)==null||b.call(t)}).then(()=>{var P;r=void 0,a()||(P=t.onContinue)==null||P.call(t)}),E=()=>{if(a())return;let P;const b=n===0?t.initialPromise:void 0;try{P=b??t.fn()}catch(C){P=Promise.reject(C)}Promise.resolve(P).then(p).catch(C=>{var N;if(a())return;const O=t.retry??(te?0:3),x=t.retryDelay??At,l=typeof x=="function"?x(n,C):x,k=O===!0||typeof O=="number"&&n<O||typeof O=="function"&&O(n,C);if(e||!k){S(C);return}n++,(N=t.onFail)==null||N.call(t,n,C),Rt(l).then(()=>m()?void 0:g()).then(()=>{e?S(C):E()})})};return{promise:i,status:()=>i.status,cancel:c,continue:()=>(r==null||r(),i),cancelRetry:o,continueRetry:v,canStart:w,start:()=>(w()?E():g().then(E),i)}}var K,tt,Ut=(tt=class{constructor(){d(this,K)}destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),Ce(this.gcTime)&&u(this,K,V.setTimeout(()=>{this.optionalRemove()},this.gcTime))}updateGcTime(t){this.gcTime=Math.max(this.gcTime||0,t??(te?1/0:300*1e3))}clearGcTimeout(){s(this,K)&&(V.clearTimeout(s(this,K)),u(this,K,void 0))}},K=new WeakMap,tt),H,oe,A,Y,I,fe,J,j,B,nt,En=(nt=class extends Ut{constructor(e){super();d(this,j);d(this,H);d(this,oe);d(this,A);d(this,Y);d(this,I);d(this,fe);d(this,J);u(this,J,!1),u(this,fe,e.defaultOptions),this.setOptions(e.options),this.observers=[],u(this,Y,e.client),u(this,A,s(this,Y).getQueryCache()),this.queryKey=e.queryKey,this.queryHash=e.queryHash,u(this,H,Ke(this.options)),this.state=e.state??s(this,H),this.scheduleGc()}get meta(){return this.options.meta}get promise(){var e;return(e=s(this,I))==null?void 0:e.promise}setOptions(e){if(this.options={...s(this,fe),...e},this.updateGcTime(this.options.gcTime),this.state&&this.state.data===void 0){const n=Ke(this.options);n.data!==void 0&&(this.setState(We(n.data,n.dataUpdatedAt)),u(this,H,n))}}optionalRemove(){!this.observers.length&&this.state.fetchStatus==="idle"&&s(this,A).remove(this)}setData(e,n){const r=De(this.state.data,e,this.options);return y(this,j,B).call(this,{data:r,type:"success",dataUpdatedAt:n==null?void 0:n.updatedAt,manual:n==null?void 0:n.manual}),r}setState(e,n){y(this,j,B).call(this,{type:"setState",state:e,setStateOptions:n})}cancel(e){var r,i;const n=(r=s(this,I))==null?void 0:r.promise;return(i=s(this,I))==null||i.cancel(e),n?n.then(pe).catch(pe):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}reset(){this.destroy(),this.setState(s(this,H))}isActive(){return this.observers.some(e=>F(e.options.enabled,this)!==!1)}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===at||this.state.dataUpdateCount+this.state.errorUpdateCount===0}isStatic(){return this.getObserversCount()>0?this.observers.some(e=>se(e.options.staleTime,this)==="static"):!1}isStale(){return this.getObserversCount()>0?this.observers.some(e=>e.getCurrentResult().isStale):this.state.data===void 0||this.state.isInvalidated}isStaleByTime(e=0){return this.state.data===void 0?!0:e==="static"?!1:this.state.isInvalidated?!0:!rt(this.state.dataUpdatedAt,e)}onFocus(){var n;const e=this.observers.find(r=>r.shouldFetchOnWindowFocus());e==null||e.refetch({cancelRefetch:!1}),(n=s(this,I))==null||n.continue()}onOnline(){var n;const e=this.observers.find(r=>r.shouldFetchOnReconnect());e==null||e.refetch({cancelRefetch:!1}),(n=s(this,I))==null||n.continue()}addObserver(e){this.observers.includes(e)||(this.observers.push(e),this.clearGcTimeout(),s(this,A).notify({type:"observerAdded",query:this,observer:e}))}removeObserver(e){this.observers.includes(e)&&(this.observers=this.observers.filter(n=>n!==e),this.observers.length||(s(this,I)&&(s(this,J)?s(this,I).cancel({revert:!0}):s(this,I).cancelRetry()),this.scheduleGc()),s(this,A).notify({type:"observerRemoved",query:this,observer:e}))}getObserversCount(){return this.observers.length}invalidate(){this.state.isInvalidated||y(this,j,B).call(this,{type:"invalidate"})}async fetch(e,n){var v,m,w,p,S,g,E,P,b,C,O,x;if(this.state.fetchStatus!=="idle"&&((v=s(this,I))==null?void 0:v.status())!=="rejected"){if(this.state.data!==void 0&&(n!=null&&n.cancelRefetch))this.cancel({silent:!0});else if(s(this,I))return s(this,I).continueRetry(),s(this,I).promise}if(e&&this.setOptions(e),!this.options.queryFn){const l=this.observers.find(k=>k.options.queryFn);l&&this.setOptions(l.options)}const r=new AbortController,i=l=>{Object.defineProperty(l,"signal",{enumerable:!0,get:()=>(u(this,J,!0),r.signal)})},a=()=>{const l=Et(this.options,n),N=(()=>{const we={client:s(this,Y),queryKey:this.queryKey,meta:this.meta};return i(we),we})();return u(this,J,!1),this.options.persister?this.options.persister(l,N,this):l(N)},o=(()=>{const l={fetchOptions:n,options:this.options,queryKey:this.queryKey,client:s(this,Y),state:this.state,fetchFn:a};return i(l),l})();(m=this.options.behavior)==null||m.onFetch(o,this),u(this,oe,this.state),(this.state.fetchStatus==="idle"||this.state.fetchMeta!==((w=o.fetchOptions)==null?void 0:w.meta))&&y(this,j,B).call(this,{type:"fetch",meta:(p=o.fetchOptions)==null?void 0:p.meta}),u(this,I,Ft({initialPromise:n==null?void 0:n.initialPromise,fn:o.fetchFn,onCancel:l=>{l instanceof Oe&&l.revert&&this.setState({...s(this,oe),fetchStatus:"idle"}),r.abort()},onFail:(l,k)=>{y(this,j,B).call(this,{type:"failed",failureCount:l,error:k})},onPause:()=>{y(this,j,B).call(this,{type:"pause"})},onContinue:()=>{y(this,j,B).call(this,{type:"continue"})},retry:o.options.retry,retryDelay:o.options.retryDelay,networkMode:o.options.networkMode,canRun:()=>!0}));try{const l=await s(this,I).start();if(l===void 0)throw new Error(`${this.queryHash} data is undefined`);return this.setData(l),(g=(S=s(this,A).config).onSuccess)==null||g.call(S,l,this),(P=(E=s(this,A).config).onSettled)==null||P.call(E,l,this.state.error,this),l}catch(l){if(l instanceof Oe){if(l.silent)return s(this,I).promise;if(l.revert){if(this.state.data===void 0)throw l;return this.state.data}}throw y(this,j,B).call(this,{type:"error",error:l}),(C=(b=s(this,A).config).onError)==null||C.call(b,l,this),(x=(O=s(this,A).config).onSettled)==null||x.call(O,this.state.data,l,this),l}finally{this.scheduleGc()}}},H=new WeakMap,oe=new WeakMap,A=new WeakMap,Y=new WeakMap,I=new WeakMap,fe=new WeakMap,J=new WeakMap,j=new WeakSet,B=function(e){const n=r=>{switch(e.type){case"failed":return{...r,fetchFailureCount:e.failureCount,fetchFailureReason:e.error};case"pause":return{...r,fetchStatus:"paused"};case"continue":return{...r,fetchStatus:"fetching"};case"fetch":return{...r,...ht(r.data,this.options),fetchMeta:e.meta??null};case"success":const i={...r,...We(e.data,e.dataUpdatedAt),dataUpdateCount:r.dataUpdateCount+1,...!e.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return u(this,oe,e.manual?i:void 0),i;case"error":const a=e.error;return{...r,error:a,errorUpdateCount:r.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:r.fetchFailureCount+1,fetchFailureReason:a,fetchStatus:"idle",status:"error",isInvalidated:!0};case"invalidate":return{...r,isInvalidated:!0};case"setState":return{...r,...e.state}}};this.state=n(this.state),$e.batch(()=>{this.observers.forEach(r=>{r.onQueryUpdate()}),s(this,A).notify({query:this,type:"updated",action:e})})},nt);function ht(t,e){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:lt(e.networkMode)?"fetching":"paused",...t===void 0&&{error:null,status:"pending"}}}function We(t,e){return{data:t,dataUpdatedAt:e??Date.now(),error:null,isInvalidated:!1,status:"success"}}function Ke(t){const e=typeof t.initialData=="function"?t.initialData():t.initialData,n=e!==void 0,r=n?typeof t.initialDataUpdatedAt=="function"?t.initialDataUpdatedAt():t.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:n?r??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:n?"success":"pending",fetchStatus:"idle"}}var D,h,me,R,Z,ue,G,L,ye,ce,le,X,ee,Q,he,f,de,Te,Ae,Fe,Ue,je,xe,qe,dt,st,jt=(st=class extends Ge{constructor(e,n){super();d(this,f);d(this,D);d(this,h);d(this,me);d(this,R);d(this,Z);d(this,ue);d(this,G);d(this,L);d(this,ye);d(this,ce);d(this,le);d(this,X);d(this,ee);d(this,Q);d(this,he,new Set);this.options=n,u(this,D,e),u(this,L,null),u(this,G,_e()),this.bindMethods(),this.setOptions(n)}bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(s(this,h).addObserver(this),He(s(this,h),this.options)?y(this,f,de).call(this):this.updateResult(),y(this,f,Ue).call(this))}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return ke(s(this,h),this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return ke(s(this,h),this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,y(this,f,je).call(this),y(this,f,xe).call(this),s(this,h).removeObserver(this)}setOptions(e){const n=this.options,r=s(this,h);if(this.options=s(this,D).defaultQueryOptions(e),this.options.enabled!==void 0&&typeof this.options.enabled!="boolean"&&typeof this.options.enabled!="function"&&typeof F(this.options.enabled,s(this,h))!="boolean")throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");y(this,f,qe).call(this),s(this,h).setOptions(this.options),n._defaulted&&!Re(this.options,n)&&s(this,D).getQueryCache().notify({type:"observerOptionsUpdated",query:s(this,h),observer:this});const i=this.hasListeners();i&&Ye(s(this,h),r,this.options,n)&&y(this,f,de).call(this),this.updateResult(),i&&(s(this,h)!==r||F(this.options.enabled,s(this,h))!==F(n.enabled,s(this,h))||se(this.options.staleTime,s(this,h))!==se(n.staleTime,s(this,h)))&&y(this,f,Te).call(this);const a=y(this,f,Ae).call(this);i&&(s(this,h)!==r||F(this.options.enabled,s(this,h))!==F(n.enabled,s(this,h))||a!==s(this,Q))&&y(this,f,Fe).call(this,a)}getOptimisticResult(e){const n=s(this,D).getQueryCache().build(s(this,D),e),r=this.createResult(n,e);return qt(this,r)&&(u(this,R,r),u(this,ue,this.options),u(this,Z,s(this,h).state)),r}getCurrentResult(){return s(this,R)}trackResult(e,n){return new Proxy(e,{get:(r,i)=>(this.trackProp(i),n==null||n(i),i==="promise"&&(this.trackProp("data"),!this.options.experimental_prefetchInRender&&s(this,G).status==="pending"&&s(this,G).reject(new Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(r,i))})}trackProp(e){s(this,he).add(e)}getCurrentQuery(){return s(this,h)}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){const n=s(this,D).defaultQueryOptions(e),r=s(this,D).getQueryCache().build(s(this,D),n);return r.fetch().then(()=>this.createResult(r,n))}fetch(e){return y(this,f,de).call(this,{...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),s(this,R)))}createResult(e,n){var ze;const r=s(this,h),i=this.options,a=s(this,R),c=s(this,Z),o=s(this,ue),m=e!==r?e.state:s(this,me),{state:w}=e;let p={...w},S=!1,g;if(n._optimisticResults){const T=this.hasListeners(),ge=!T&&He(e,n),ne=T&&Ye(e,r,n,i);(ge||ne)&&(p={...p,...ht(w.data,e.options)}),n._optimisticResults==="isRestoring"&&(p.fetchStatus="idle")}let{error:E,errorUpdatedAt:P,status:b}=p;g=p.data;let C=!1;if(n.placeholderData!==void 0&&g===void 0&&b==="pending"){let T;a!=null&&a.isPlaceholderData&&n.placeholderData===(o==null?void 0:o.placeholderData)?(T=a.data,C=!0):T=typeof n.placeholderData=="function"?n.placeholderData((ze=s(this,le))==null?void 0:ze.state.data,s(this,le)):n.placeholderData,T!==void 0&&(b="success",g=De(a==null?void 0:a.data,T,n),S=!0)}if(n.select&&g!==void 0&&!C)if(a&&g===(c==null?void 0:c.data)&&n.select===s(this,ye))g=s(this,ce);else try{u(this,ye,n.select),g=n.select(g),g=De(a==null?void 0:a.data,g,n),u(this,ce,g),u(this,L,null)}catch(T){u(this,L,T)}s(this,L)&&(E=s(this,L),g=s(this,ce),P=Date.now(),b="error");const O=p.fetchStatus==="fetching",x=b==="pending",l=b==="error",k=x&&O,N=g!==void 0,q={status:b,fetchStatus:p.fetchStatus,isPending:x,isSuccess:b==="success",isError:l,isInitialLoading:k,isLoading:k,data:g,dataUpdatedAt:p.dataUpdatedAt,error:E,errorUpdatedAt:P,failureCount:p.fetchFailureCount,failureReason:p.fetchFailureReason,errorUpdateCount:p.errorUpdateCount,isFetched:p.dataUpdateCount>0||p.errorUpdateCount>0,isFetchedAfterMount:p.dataUpdateCount>m.dataUpdateCount||p.errorUpdateCount>m.errorUpdateCount,isFetching:O,isRefetching:O&&!x,isLoadingError:l&&!N,isPaused:p.fetchStatus==="paused",isPlaceholderData:S,isRefetchError:l&&N,isStale:Me(e,n),refetch:this.refetch,promise:s(this,G),isEnabled:F(n.enabled,e)!==!1};if(this.options.experimental_prefetchInRender){const T=ve=>{q.status==="error"?ve.reject(q.error):q.data!==void 0&&ve.resolve(q.data)},ge=()=>{const ve=u(this,G,q.promise=_e());T(ve)},ne=s(this,G);switch(ne.status){case"pending":e.queryHash===r.queryHash&&T(ne);break;case"fulfilled":(q.status==="error"||q.data!==ne.value)&&ge();break;case"rejected":(q.status!=="error"||q.error!==ne.reason)&&ge();break}}return q}updateResult(){const e=s(this,R),n=this.createResult(s(this,h),this.options);if(u(this,Z,s(this,h).state),u(this,ue,this.options),s(this,Z).data!==void 0&&u(this,le,s(this,h)),Re(n,e))return;u(this,R,n);const r=()=>{if(!e)return!0;const{notifyOnChangeProps:i}=this.options,a=typeof i=="function"?i():i;if(a==="all"||!a&&!s(this,he).size)return!0;const c=new Set(a??s(this,he));return this.options.throwOnError&&c.add("error"),Object.keys(s(this,R)).some(o=>{const v=o;return s(this,R)[v]!==e[v]&&c.has(v)})};y(this,f,dt).call(this,{listeners:r()})}onQueryUpdate(){this.updateResult(),this.hasListeners()&&y(this,f,Ue).call(this)}},D=new WeakMap,h=new WeakMap,me=new WeakMap,R=new WeakMap,Z=new WeakMap,ue=new WeakMap,G=new WeakMap,L=new WeakMap,ye=new WeakMap,ce=new WeakMap,le=new WeakMap,X=new WeakMap,ee=new WeakMap,Q=new WeakMap,he=new WeakMap,f=new WeakSet,de=function(e){y(this,f,qe).call(this);let n=s(this,h).fetch(this.options,e);return e!=null&&e.throwOnError||(n=n.catch(pe)),n},Te=function(){y(this,f,je).call(this);const e=se(this.options.staleTime,s(this,h));if(te||s(this,R).isStale||!Ce(e))return;const r=rt(s(this,R).dataUpdatedAt,e)+1;u(this,X,V.setTimeout(()=>{s(this,R).isStale||this.updateResult()},r))},Ae=function(){return(typeof this.options.refetchInterval=="function"?this.options.refetchInterval(s(this,h)):this.options.refetchInterval)??!1},Fe=function(e){y(this,f,xe).call(this),u(this,Q,e),!(te||F(this.options.enabled,s(this,h))===!1||!Ce(s(this,Q))||s(this,Q)===0)&&u(this,ee,V.setInterval(()=>{(this.options.refetchIntervalInBackground||ut.isFocused())&&y(this,f,de).call(this)},s(this,Q)))},Ue=function(){y(this,f,Te).call(this),y(this,f,Fe).call(this,y(this,f,Ae).call(this))},je=function(){s(this,X)&&(V.clearTimeout(s(this,X)),u(this,X,void 0))},xe=function(){s(this,ee)&&(V.clearInterval(s(this,ee)),u(this,ee,void 0))},qe=function(){const e=s(this,D).getQueryCache().build(s(this,D),this.options);if(e===s(this,h))return;const n=s(this,h);u(this,h,e),u(this,me,e.state),this.hasListeners()&&(n==null||n.removeObserver(this),e.addObserver(this))},dt=function(e){$e.batch(()=>{e.listeners&&this.listeners.forEach(n=>{n(s(this,R))}),s(this,D).getQueryCache().notify({query:s(this,h),type:"observerResultsUpdated"})})},st);function xt(t,e){return F(e.enabled,t)!==!1&&t.state.data===void 0&&!(t.state.status==="error"&&e.retryOnMount===!1)}function He(t,e){return xt(t,e)||t.state.data!==void 0&&ke(t,e,e.refetchOnMount)}function ke(t,e,n){if(F(e.enabled,t)!==!1&&se(e.staleTime,t)!=="static"){const r=typeof n=="function"?n(t):n;return r==="always"||r!==!1&&Me(t,e)}return!1}function Ye(t,e,n,r){return(t!==e||F(r.enabled,t)===!1)&&(!n.suspense||t.state.status!=="error")&&Me(t,n)}function Me(t,e){return F(e.enabled,t)!==!1&&t.isStaleByTime(se(e.staleTime,t))}function qt(t,e){return!Re(t.getCurrentResult(),e)}var pt=U.createContext(void 0),kt=t=>{const e=U.useContext(pt);if(!e)throw new Error("No QueryClient set, use QueryClientProvider to set one");return e},Dn=({client:t,children:e})=>(U.useEffect(()=>(t.mount(),()=>{t.unmount()}),[t]),bt.jsx(pt.Provider,{value:t,children:e})),ft=U.createContext(!1),Bt=()=>U.useContext(ft);ft.Provider;function Gt(){let t=!1;return{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t}}var Nt=U.createContext(Gt()),$t=()=>U.useContext(Nt),Mt=(t,e,n)=>{const r=n!=null&&n.state.error&&typeof t.throwOnError=="function"?ot(t.throwOnError,[n.state.error,n]):t.throwOnError;(t.suspense||t.experimental_prefetchInRender||r)&&(e.isReset()||(t.retryOnMount=!1))},zt=t=>{U.useEffect(()=>{t.clearReset()},[t])},Lt=({result:t,errorResetBoundary:e,throwOnError:n,query:r,suspense:i})=>t.isError&&!e.isReset()&&!t.isFetching&&r&&(i&&t.data===void 0||ot(n,[t.error,r])),Qt=t=>{if(t.suspense){const n=i=>i==="static"?i:Math.max(i??1e3,1e3),r=t.staleTime;t.staleTime=typeof r=="function"?(...i)=>n(r(...i)):n(r),typeof t.gcTime=="number"&&(t.gcTime=Math.max(t.gcTime,1e3))}},Vt=(t,e)=>t.isLoading&&t.isFetching&&!e,Wt=(t,e)=>(t==null?void 0:t.suspense)&&e.isPending,Je=(t,e,n)=>e.fetchOptimistic(t).catch(()=>{n.clearReset()});function Kt(t,e,n){var S,g,E,P;const r=Bt(),i=$t(),a=kt(),c=a.defaultQueryOptions(t);(g=(S=a.getDefaultOptions().queries)==null?void 0:S._experimental_beforeQuery)==null||g.call(S,c);const o=a.getQueryCache().get(c.queryHash);c._optimisticResults=r?"isRestoring":"optimistic",Qt(c),Mt(c,i,o),zt(i);const v=!a.getQueryCache().get(c.queryHash),[m]=U.useState(()=>new e(a,c)),w=m.getOptimisticResult(c),p=!r&&t.subscribed!==!1;if(U.useSyncExternalStore(U.useCallback(b=>{const C=p?m.subscribe($e.batchCalls(b)):pe;return m.updateResult(),C},[m,p]),()=>m.getCurrentResult(),()=>m.getCurrentResult()),U.useEffect(()=>{m.setOptions(c)},[c,m]),Wt(c,w))throw Je(c,m,i);if(Lt({result:w,errorResetBoundary:i,throwOnError:c.throwOnError,query:o,suspense:c.suspense}))throw w.error;if((P=(E=a.getDefaultOptions().queries)==null?void 0:E._experimental_afterQuery)==null||P.call(E,c,w),c.experimental_prefetchInRender&&!te&&Vt(w,r)){const b=v?Je(c,m,i):o==null?void 0:o.promise;b==null||b.catch(pe).finally(()=>{m.updateResult()})}return c.notifyOnChangeProps?w:m.trackResult(w)}function _n(t,e){return Kt(t,jt)}const Ht={};var Se={};const Yt="https://ly-budget-gql-prod-702918025200.asia-east1.run.app/api/graphql",Jt="https://ly-budget-gql-dev-702918025200.asia-east1.run.app/api/graphql",Zt=()=>typeof process<"u"?Se.VITE_GQL_ENDPOINT??Se.GQL_ENDPOINT??Se.GRAPHQL_ENDPOINT??null:null,Xt=()=>typeof import.meta<"u"&&typeof Ht<"u"||typeof process<"u"?"production":null,en=Zt(),mt=Xt();console.log({mode:mt});const yt=en??(mt==="production"?Yt:Jt);console.log({GQL_ENDPOINTS:yt});const On="/";async function Tn(t,...[e]){const n=await fetch(yt,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/graphql-response+json"},body:JSON.stringify({query:t,variables:e})});if(!n.ok)throw new Error("Network response was not ok");return(await n.json()).data}var tn=(t=>(t.Asc="asc",t.Desc="desc",t))(tn||{}),nn=(t=>(t.Freeze="freeze",t.Other="other",t.Reduce="reduce",t))(nn||{});class _ extends String{constructor(n,r){super(n);be(this,"__apiType");be(this,"value");be(this,"__meta__");this.value=n,this.__meta__=r}toString(){return this.value}}const An=new _(`
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
    `,{fragmentName:"VisualizationProposalBase"}),Fn=new _(`
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
}`,{fragmentName:"VisualizationProposalWithContext"}),sn=new _(`
    query GetLatestBudgetYear($skip: Int!, $take: Int!) {
  budgetYears(orderBy: [{year: desc}], skip: $skip, take: $take) {
    year
    budgetProgress
    dataProgress
    unfreezeProgress
  }
}
    `),rn=new _(`
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
    `),an=new _(`
    query GetGovernments {
  governments {
    id
    name
    category
    description
  }
}
    `),on=new _(`
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
    `),un=new _(`
    query RecognitionImages {
  recognitionImages(where: {verificationStatus: {equals: "verified"}}) {
    result
  }
  recognitionImagesCount
}
    `),cn=new _(`
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
    `),ln=new _(`
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
    `),hn=new _(`
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
    `),dn=new _(`
    query GetProposalYears {
  budgetYears(orderBy: [{year: desc}]) {
    id
    year
  }
}
    `),pn=new _(`
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
    `),fn=new _(`
    mutation UPDATE_PROPOSAL_REACTS($where: ProposalWhereUniqueInput!, $data: ProposalUpdateInput!) {
  updateProposal(where: $where, data: $data) {
    id
    react_angry
    react_disappoint
    react_good
    react_whatever
  }
}
    `),mn=new _(`
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
}`),yn={"\n  query GetLatestBudgetYear($skip: Int!, $take: Int!) {\n    budgetYears(orderBy: [{ year: desc }], skip: $skip, take: $take) {\n      year\n      budgetProgress\n      dataProgress\n      unfreezeProgress\n    }\n  }\n":sn,"\n  query GetBudgetsWithGovernment {\n    budgets {\n      id\n      type\n      year\n      projectName\n      projectDescription\n      budgetAmount\n      majorCategory\n      mediumCategory\n      minorCategory\n      description\n      government {\n        id\n        name\n        category\n      }\n    }\n    budgetsCount\n  }\n":rn,"\n  query GetGovernments {\n    governments {\n      id\n      name\n      category\n      description\n    }\n  }\n":an,"\n  query GetPeopleList {\n    peopleList(orderBy: [{ name: asc }]) {\n      id\n      name\n      type\n      description\n      party {\n        id\n        name\n      }\n    }\n  }\n":on,'\n  query RecognitionImages {\n    recognitionImages(where: { verificationStatus: { equals: "verified" } }) {\n      result\n    }\n    recognitionImagesCount\n  }\n':un,"\n  query People($where: PeopleWhereUniqueInput!) {\n    people(where: $where) {\n      id\n      name\n      description\n      party {\n        id\n        color\n        name\n      }\n      term {\n        termNumber\n        id\n      }\n      termCount\n      committees {\n        id\n        name\n        session\n        term {\n          id\n          startDate\n          termNumber\n        }\n      }\n    }\n  }\n":cn,"\n  query GetProposalsOrderedByIdDesc {\n    proposals(orderBy: [{ id: desc }]) {\n      id\n      description\n      reason\n      publishStatus\n      result\n      freezeAmount\n      reductionAmount\n      budgetImageUrl\n      proposalTypes\n      recognitionAnswer\n      unfreezeStatus\n      government {\n        id\n        name\n        category\n        description\n      }\n      budget {\n        id\n        projectName\n        budgetAmount\n        year\n        type\n        majorCategory\n        mediumCategory\n        minorCategory\n      }\n      proposers {\n        id\n        name\n        type\n        description\n      }\n      coSigners {\n        id\n        name\n        type\n      }\n    }\n    proposalsCount\n  }\n":ln,"\n  query GetProposalById($id: ID!) {\n    proposal(where: { id: $id }) {\n      id\n      description\n      reason\n      publishStatus\n      result\n      freezeAmount\n      reductionAmount\n      budgetImageUrl\n      proposalTypes\n      recognitionAnswer\n      unfreezeStatus\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n      budgetImageUrl\n      historicalParentProposals {\n        id\n      }\n      mergedParentProposals {\n        id\n        proposers {\n          id\n          name\n        }\n      }\n      historicalProposals {\n        id\n      }\n      government {\n        id\n        name\n        category\n        description\n      }\n      budget {\n        id\n        projectName\n        projectDescription\n        budgetAmount\n        budgetUrl\n        lastYearSettlement\n        year\n        type\n        majorCategory\n        mediumCategory\n        minorCategory\n        description\n      }\n      proposers {\n        id\n        name\n        type\n        description\n      }\n      coSigners {\n        id\n        name\n        type\n      }\n      meetings(orderBy: [{ meetingDate: desc }]) {\n        id\n        displayName\n        meetingDate\n        description\n        location\n        meetingRecordUrl\n        type\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      mergedProposals {\n        id\n        proposers {\n          id\n          name\n        }\n      }\n      historicalProposals {\n        id\n        meetings {\n          id\n        }\n        proposers {\n          id\n          name\n        }\n      }\n    }\n  }\n":hn,"\n  query GetProposalYears {\n    budgetYears(orderBy: [{ year: desc }]) {\n      id\n      year\n    }\n  }\n":dn,"\n  query GetPaginatedProposals(\n    $skip: Int!\n    $take: Int!\n    $orderBy: [ProposalOrderByInput!]!\n    $where: ProposalWhereInput!\n  ) {\n    proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {\n      id\n      description\n      year {\n        id\n        year\n      }\n      meetings {\n        id\n        type\n        committee {\n          displayName\n          name\n          endDate\n          startDate\n        }\n      }\n      reason\n      result\n      freezeAmount\n      reductionAmount\n      proposalTypes\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n      government {\n        id\n        name\n      }\n      budget {\n        id\n        budgetAmount\n      }\n      proposers {\n        id\n        name\n      }\n    }\n    proposalsCount(where: $where)\n  }\n":pn,"\n  mutation UPDATE_PROPOSAL_REACTS(\n    $where: ProposalWhereUniqueInput!\n    $data: ProposalUpdateInput!\n  ) {\n    updateProposal(where: $where, data: $data) {\n      id\n      react_angry\n      react_disappoint\n      react_good\n      react_whatever\n    }\n  }\n":fn,"\n  query GetVisualizationProposals($where: ProposalWhereInput!) {\n    proposals(where: $where) {\n      ...VisualizationProposalWithContext\n    }\n  }\n\n  fragment VisualizationProposalWithContext on Proposal {\n    ...VisualizationProposalBase\n    government {\n      name\n      category\n    }\n    year {\n      year\n    }\n  }\n\n  fragment VisualizationProposalBase on Proposal {\n    id\n    freezeAmount\n    reductionAmount\n    proposalTypes\n    proposers {\n      id\n      name\n      party {\n        name\n        color\n      }\n    }\n  }\n":mn};function Un(t){return yn[t]??{}}export{On as E,tn as O,nn as P,En as Q,Ut as R,Ge as S,Fn as V,In as a,Cn as b,Rn as c,pe as d,Et as e,wn as f,ut as g,Ct as h,bn as i,Ie as j,Tn as k,Dn as l,Pn as m,$e as n,ct as o,Ne as p,Sn as q,se as r,at as s,An as t,_n as u,Un as v,Re as w,kt as x,ot as y,Ft as z};
