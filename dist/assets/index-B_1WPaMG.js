var U=Object.defineProperty;var K=(d,t,e)=>t in d?U(d,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[t]=e;var l=(d,t,e)=>K(d,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=e(n);fetch(n.href,i)}})();class v{static blue(t){return'<span style="color: blue;">'+t+"</span>"}static green(t){return'<span style="color: green;">'+t+"</span>"}static red(t){return'<span style="color: red;">'+t+"</span>"}static clearScreen(){const t=document.getElementById("console");t&&(t.innerHTML="")}static prnt(t,e="color:black;"){this.prntBase(t,e)}static prntBase(t,e="",s="div"){const n=document.getElementById("console");if(n){const i=document.createElement(s);i.innerHTML="<div>"+t+"</div>",e&&(i.style.cssText=e),n.appendChild(i),n.scrollTop=n.scrollHeight}}static warn(t){this.prnt(t,"color: orange;")}static testPrint(){this.prnt("Hello, World!"),this.prnt("Error: Something went wrong!","color: red;"),this.prnt("Info: This is some information.","color: #00ff00;"),this.prnt("Warning: Be careful!","color: orange;")}}const k=class k{static prnt(t,e="color: black;"){v.prnt(t,e)}static str(t,e){const s=t.toString();if(s.length>=e)return s;const n=e-s.length;return s+k.emptyString.substring(0,n)}static sum(t){return!t||(t=t.filter(e=>e!==0),t.length===0)?0:t.reduce((e,s)=>e+s,0)}static toString(t){return`[${Array.from(t).map(String).join(", ")}]`}static px(){return(t,e)=>t}static equalArrays(t,e){if(t.length!==e.length)return!1;for(let s=0;s<t.length;s++)if(t[s]!==e[s])return!1;return!0}static shuffleArray(t){return t.sort(()=>Math.random()-.5)}static _sleep(t){return new Promise(e=>setTimeout(e,t))}static async sleep(t){await this._sleep(t)}};l(k,"emptyString","                                           ");let u=k;var r=(d=>(d.L="L",d.R="R",d.U="U",d.D="D",d))(r||{});class w{constructor(t,e){l(this,"state");l(this,"goals");l(this,"fixedElements");t instanceof w?(this.state=[...t.getState()],this.goals=[...t.getGoals()],this.fixedElements=[...t.getFixedElements()]):(this.state=[...t],this.goals=[...(e==null?void 0:e.getGoals())??[]],this.fixedElements=[...(e==null?void 0:e.getLockedStateElements())??[]])}getState(){return this.state}setState(t){this.state=t}getGoals(){return this.goals}setGoals(t){this.goals=t}getFixedElements(){return this.fixedElements}setFixedElements(t){this.fixedElements=t}getHashCodeV2(){const t=this.getHashCodeV3__();return this.hashString(t)}getHashCodeV3__(){return Array.from({length:16},(t,e)=>{let s;const n=this.state[e];return n===-1?s="*":this.goals.includes(n)?s=String(n):this.goals.includes(e+1)?s="o":s=" ",s=s+"	",e!==0&&(e+1)%4===0&&(s=s+`
`),s}).join("")}getHashCode(){const t=this.state.map(String).join(",");return this.hashString(t)}hashString(t){let e=0;for(let s=0;s<t.length;s++){const n=t.charCodeAt(s);e=(e<<5)-e+n,e|=0}return e}equals(t){return this.getHashCode()===t.getHashCode()}hashCode(){return this.getHashCode()}}class W{constructor(t,e,s=0,n=!1){l(this,"state");l(this,"action");l(this,"reward");l(this,"isTerminal");this.state=t,this.action=e,this.reward=s,this.isTerminal=n}}class O{constructor(t,e){this.key=t,this.value=e}getKey(){return this.key}getValue(){return this.value}static P(t,e){return new O(t,e)}}class p{static makeMove(t,e){const n=t.indexOf(-1),i=this.getXY(n);let o=i.getKey(),c=i.getValue();e===r.L&&(o-=1),e===r.R&&(o+=1),e===r.U&&(c-=1),e===r.D&&(c+=1);const h=this.getIndex(o,c),g=[...t],f=g[h];return g[n]=f,g[h]=-1,g}static getXY(t){const e=t%4,s=Math.floor(t/4);return O.P(e,s)}static getIndex(t,e){return e*4+t}static _getValidMoves(t){const e=this.getXY(t),s=Object.values(r).slice();return e.getKey()===0&&s.splice(s.indexOf(r.L),1),e.getKey()===3&&s.splice(s.indexOf(r.R),1),e.getValue()===0&&s.splice(s.indexOf(r.U),1),e.getValue()===3&&s.splice(s.indexOf(r.D),1),s}static getValidMoves(t,e){const s=this._getValidMoves(t),n=this.getXY(t);return this.contains(e,n.getKey()-1,n.getValue())&&s.splice(s.indexOf(r.L),1),this.contains(e,n.getKey()+1,n.getValue())&&s.splice(s.indexOf(r.R),1),this.contains(e,n.getKey(),n.getValue()-1)&&s.splice(s.indexOf(r.U),1),this.contains(e,n.getKey(),n.getValue()+1)&&s.splice(s.indexOf(r.D),1),s}static contains(t,e,s){return t.includes(this.getIndex(e,s))}static stateAsString(t,e){return Array.from({length:16},(s,n)=>{let i;const o=t[n];return o===-1?i=v.blue("*"):e.includes(o)?i=v.red(o.toString()):e.includes(n+1)?i=v.green(o.toString()):i=o.toString(),i+="	",n!==0&&(n+1)%4===0&&(i+=`
`),i}).join("")}static prntState(t,e){let s=this.stateAsString(t,e);v.prnt(s)}static getReverseAction(t){return t===r.D?r.U:t===r.U?r.D:t===r.L?r.R:t===r.R?r.L:null}}const m=class m{constructor(t){l(this,"state");l(this,"goals");l(this,"reverseAction",null);l(this,"bigCircleAction1",[]);l(this,"bigCircleAction2",[]);l(this,"smallCircleAction1",[]);l(this,"smallCircleAction2",[]);l(this,"circleAction",[]);m.stateProducer=t,m.stateProducer.resetState();const e=m.stateProducer.getState();this.goals=m.stateProducer.getGoals(),this.state=new w(e,m.stateProducer)}static isTerminalSuccess(t){return m._isTerminalSuccess(t.getState(),t.getGoals())}reset(){this.reverseAction=null,this.circleAction=[],this.bigCircleAction1=[],this.bigCircleAction2=[],this.smallCircleAction1=[],this.smallCircleAction2=[],this.bigCircleAction1.push(r.L,r.L,r.D,r.D,r.R,r.R,r.U,r.U),this.bigCircleAction2.push(r.R,r.R,r.D,r.D,r.L,r.L,r.U,r.U),this.smallCircleAction1.push(r.L,r.D,r.R,r.U,r.L),this.smallCircleAction2.push(r.R,r.D,r.L,r.U,r.R)}getInitState(){m.stateProducer.resetState();const t=m.stateProducer.getState();return this.goals=m.stateProducer.getGoals(),this.state=new w(t,m.stateProducer),this.state}static getPossibleActions(t){const e=t.getState().indexOf(-1),s=t.getFixedElements().map(n=>n-1);return p.getValidMoves(e,s)}executeAction(t,e){const s=p.makeMove(t.getState(),e),n=new w(s,m.stateProducer);let i=m._isTerminalSuccess(s,this.goals);this.state=new w(s,m.stateProducer);let o=NaN;this.reverseAction=p.getReverseAction(e),this.circleAction.push(e),this.circleAction.length>8&&this.circleAction.shift(),(u.equalArrays(this.circleAction,this.bigCircleAction1)||u.equalArrays(this.circleAction,this.bigCircleAction2)||u.equalArrays(this.circleAction,this.smallCircleAction1)||u.equalArrays(this.circleAction,this.smallCircleAction2))&&(i=!0);const c=this.state.getState().indexOf(-1);return m.stateProducer.isLockedIndex(c)&&(i=!0,o=-1),isNaN(o)&&(o=this.getReward(s,this.goals)),new W(n,e,o,i)}static _isTerminalSuccess(t,e){if(t.length!==16)throw new Error("newState.size() != 16");return e.filter(s=>t[s-1]===s).length===e.length}prntInfo(){u.prnt(`

================================================
`);const t=this.state.getState(),e=t.indexOf(-1),s=p.getXY(e);u.prnt(s);const n=p.getIndex(s.getKey(),s.getValue());u.prnt(`${e} - ${n}`);const i=p._getValidMoves(e);u.prnt(i);const o=this.getReward(t,this.goals);u.prnt(o),p.prntState(t,this.goals)}getReward(t,e){const s=t.indexOf(-1),n=p.getXY(s),o=e.map(h=>this.getDistance(p.getXY(t.indexOf(h)),p.getXY(h-1))).reduce((h,g)=>h+g,0);if(o===0)return 100.5;const c=e.reduce((h,g)=>h+this.getDistance(p.getXY(t.indexOf(g)),n),0);return u.prnt(`d0Sum: ${o}`),u.prnt(`d1Sum: ${c}`),1/(o+c)}getDistance(t,e){const s=Math.pow(e.getKey()-t.getKey(),2),n=Math.pow(e.getValue()-t.getValue(),2);return Math.sqrt(s+n)}};l(m,"stateProducer");let b=m;class I{constructor(t,e,s,n,i){l(this,"state");l(this,"action");l(this,"reward");l(this,"done");l(this,"newState");this.state=new w(t),this.action=e,this.reward=s,this.done=n,this.newState=new w(i)}getState(){return this.state}getAction(){return this.action}getReward(){return this.reward}isDone(){return this.done}getNewState(){return this.newState}equals(t){return t instanceof I?this.hashCode()===t.hashCode():!1}hashCode(){return this.state.getHashCodeV2()^this.newState.getHashCodeV2()}}class x{static main(){const t=C.generateLessons()[0];let e=[...t.getState()];const s=[...t.getGoals()];x.prntState(e,s),e=x.shuffle(e,t.getLockedStateElements(),1e3),x.prntState(e,s)}static shuffle(t,e,s){const n=e.map(o=>o-1);let i=0;for(;i<s;)t=x.makeRandomMove(t,n),i++;return t}static prntState(t,e){p.prntState(t,e)}static makeRandomMove(t,e){const s=t.indexOf(-1),n=p.getValidMoves(s,e),i=u.shuffleArray(n)[0];return t=p.makeMove(t,i),t}}const a=class a{constructor(t){l(this,"goals");l(this,"lockedStateElements");l(this,"state");l(this,"episodesToTrain");l(this,"lessonNb");this.lessonNb=t,this.goals=[],this.lockedStateElements=[],this.state=[],this.episodesToTrain=0}getState(){return this.state}getGoals(){return this.goals}getLockedStateElements(){return this.lockedStateElements}getEpisodesToTrain(){return this.episodesToTrain}static generateLessons0(){return[a.state1(0),a.moveHole(a.stateX(2,1),[1,4]),a.moveHole(a.stateX(3,2),[2,5]),a.moveHole(a.state3_4(3),[3,6]),a.moveHole(a.stateX(5,4),[6,7]),a.moveHole(a.stateX(6,5),[5,8]),a.moveHole(a.stateX(7,6),[6,9]),a.moveHole(a.state7_8(7),[8,11]),a.moveHole(a.state9_13(8),[10,11]),a.moveHole(a.state10_15(9),[9,13]),a.state12(10)]}static generateLessonsV1(){return[a.state1_2(0),a.moveHole(a.state3_4(1),[2,3,4]),a.moveHole(a.stateX(5,2),[6,7]),a.moveHole(a.stateX(6,3),[5,8]),a.moveHole(a.stateX(7,4),[6,9]),a.moveHole(a.state7_8(5),[8,11]),a.moveHole(a.state9_13(6),[10,11]),a.moveHole(a.state10_15(7),[9,13]),a.state12(8)]}static generateLessons(){return[a.state1_2(0),a.moveHole(a.state3_4(1),[2,3,4]),a.moveHole(a.state5_6(2),[6,7]),a.moveHole(a.state7_8(3),[8,9,6]),a.moveHole(a.state9_13(4),[10,11]),a.moveHole(a.state10_15(5),[9,13]),a.state12(6)]}static state1_2(t){const e=new a(t);return e.goals=[1,2],e.lockedStateElements=[],e.state=[...a.stateDone],e.episodesToTrain=100,a.shuffle(e,e.lockedStateElements),e}static state1(t){return a.stateX(1,t)}static state3_4(t){const e=new a(t);return e.goals=[3,4],e.lockedStateElements=[1,2],e.state=[...a.stateDone],e.episodesToTrain=100,a.shuffle(e,[1,2,3]),e}static state5_6(t){const e=new a(t);return e.goals=[5,6],e.lockedStateElements=[1,2,3,4],e.state=[...a.stateDone],e.episodesToTrain=100,a.shuffle(e,e.lockedStateElements),e}static stateX(t,e){const s=new a(e);return s.goals=[t],s.lockedStateElements=Array.from({length:t-1},(n,i)=>i+1),s.state=[...a.stateDone],s.episodesToTrain=100,a.shuffle(s,s.lockedStateElements),s}static moveHole(t,e){const s=u.shuffleArray(e)[0],n=t.state.indexOf(-1),i=t.state[s];return t.state[s]=-1,t.state[n]=i,t}static state7_8(t){const e=new a(t);return e.goals=[7,8],e.lockedStateElements=[1,2,3,4,5,6],e.state=[...a.stateDone],e.episodesToTrain=100,a.shuffle(e,[1,2,3,4,5,6,7]),e}static state9_13(t){const e=new a(t);return e.goals=[9,13],e.lockedStateElements=[1,2,3,4,5,6,7,8],e.state=[...a.stateDone],e.episodesToTrain=100,a.shuffle(e,e.lockedStateElements),e}static state10_15(t){const e=new a(t);return e.goals=[10,11,14,15],e.lockedStateElements=[1,2,3,4,5,6,7,8,9,13],e.state=x.shuffle([...a.stateDone],e.lockedStateElements,500),e.episodesToTrain=100,e}static state12(t){const e=new a(t);return e.goals=[12],e.lockedStateElements=[1,2,3,4,5,6,7,8,9,10,11,13,14,15],e.state=x.shuffle([...a.stateDone],e.lockedStateElements,500),e.episodesToTrain=10,e}isLockedIndex(t){return this.lockedStateElements.includes(t+1)}shuffleState(){this.state=x.shuffle(this.state,this.lockedStateElements,500)}static shuffle(t,e){let s=t.state.filter(n=>!e.includes(n));s=u.shuffleArray(s),t.state=[...e,...s]}resetState(){const t=a.generateLessons()[this.lessonNb];this.goals=[...t.goals],this.lockedStateElements=[...t.lockedStateElements],this.state=[...t.state]}};l(a,"stateDone",[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,-1]);let C=a;class ${static async train(t,e){const i=C.generateLessons(),o=async(h,g,f)=>{await D.runEpisode(h,t,.9,.1,g,f)},c=async(h,g)=>{for(let f=0;f<h.getEpisodesToTrain();f++)await o(h,f,g)};for(let h=0;h<e;h++){let g="Running training batch: "+(h+1)+" of "+e;await Promise.all(i.map(f=>c(f,g)))}u.prnt("training done")}}class G{constructor(t){l(this,"state");l(this,"qValues");this.state=t,this.qValues=new Map}setValue(t,e){const s=b.getPossibleActions(this.state);this.qValues.size===0&&s.forEach(n=>this.qValues.set(n,0)),s.includes(t)&&this.qValues.set(t,e)}getValue(t){return this.qValues.get(t)||0}getActionWithMaxValue(t){const e=b.getPossibleActions(this.state).filter(n=>n!==t),s=t===null?null:this.getAction(t);return s??(e.length>0?e[0]:r.D)}getAction(t){const s=Array.from(this.qValues.entries()).filter(([n])=>n!==t).reduce((n,i)=>i[1]>n[1]?i:n,[t,-1/0]);return s[1]>-1/0?s[0]:void 0}getMaxValue(){return this.qValues.size===0?0:Math.max(...Array.from(this.qValues.values()))}}class q{static updateQTable(t,e,s,n,i,o,c,h){let g;if(o)g=i;else{const f=this.getQValue(t,e,s),A=this.getMaxQValue(t,n);g=this.calcQValue(i,f,A,h,c)}this.addStateWithZeroValuesToQTableIfStateNotExist(t,e),this.updateQTableEntry(t,e.getHashCodeV2(),s,g)}static updateQTableEntry(t,e,s,n){var i;(i=t.get(e))==null||i.setValue(s,n)}static getMaxQValue(t,e){var n;const s=e.getHashCodeV2();return this.addStateWithZeroValuesToQTableIfStateNotExist(t,e),((n=t.get(s))==null?void 0:n.getMaxValue())??0}static getQValue(t,e,s){var i;const n=e.getHashCodeV2();return this.addStateWithZeroValuesToQTableIfStateNotExist(t,e),((i=t.get(n))==null?void 0:i.getValue(s))??0}static addStateWithZeroValuesToQTableIfStateNotExist(t,e){t.has(e.getHashCodeV2())||this.addStateWithZeroValuesToQTable(t,e)}static addStateWithZeroValuesToQTable(t,e){const s=e.getHashCodeV2(),n=new G(e);t.set(s,n)}static calcQValue(t,e,s,n,i){return e+i*(t+n*s-e)}}const y=class y{static async train(){await $.train(y.qTable,10)}static async test(){if(!y.testingEnabled)return;const t=y.qTable,e=this.getStatistics(t);for(u.prnt(e);;){if(!y.testingEnabled)return;await this.testQTable(t)}}static getStatistics(t){const e=Array.from(t.values()).flatMap(c=>Array.from(c.qValues.values())),s=e.reduce((c,h)=>c+h,0),n=e.length,i=n?s/n:0,o=new Y;return o.count=n,o.sum=s,o.average=i,o}static async testQTable(t){if(!y.testingEnabled)return;u.prnt("********************* test q table **********************"),u.prnt("********************* test q table **********************"),u.prnt("********************* test q table **********************");let e=0;const s=C.generateLessons(),n=s.length;let i=s[e],o=x.shuffle(C.stateDone,[],1e3),c=new w(o,i),h=i.getGoals();this.prntState(c);let g=!1,f=0,A=null;for(;!g&&f<200;){if(!y.testingEnabled)return;await u.sleep(1e3/2),v.clearScreen(),f++;const R=c.getHashCodeV2();q.addStateWithZeroValuesToQTableIfStateNotExist(t,c);const M=t.get(R),S=M?M.getActionWithMaxValue(A):r.D;A=p.getReverseAction(S);const T=p.makeMove(c.getState(),S),H=b._isTerminalSuccess(T,h);c=new w(T,i),g=u.equalArrays(c.getState(),C.stateDone),u.prnt(`${f}
----
`),this.prntState(c),H&&!g&&e<n-1&&(e++,i=s[e],h=i.getGoals(),u.prnt(`lesson change: ${e}`),u.prnt(h),c=new w(c.getState(),i))}const L=b.isTerminalSuccess(c);u.prnt(`success: ${L}`),await u.sleep(3e3)}static prntState(t){p.prntState(t.getState(),t.getGoals())}static getAction(t,e,s){var o;const n=e.getHashCodeV2();let i=b.getPossibleActions(e);return i=i.filter(c=>c!==s),t.has(n)?((o=t.get(n))==null?void 0:o.getActionWithMaxValue(s))||r.D:this.getRandomAction(i)}static getRandomAction(t){return t.length>0?t[Math.floor(Math.random()*t.length)]:r.D}};l(y,"qTable",new Map),l(y,"testingEnabled",!1);let V=y;class Y{constructor(){l(this,"count",0);l(this,"sum",0);l(this,"average",0)}}const E=class E{static async runEpisode(t,e,s,n,i,o){if(!E.trainingEnabled)return;const c=new B,h=new b(t);h.reset();let g=h.getInitState();h.prntInfo();const f=.5;let A=!1,L=0;for(;!A&&L<50;){if(!E.trainingEnabled)return;L++;let S;const T=b.getPossibleActions(g);if(h.reverseAction!==null){const P=T.indexOf(h.reverseAction);T.splice(P,1)}c.nextDouble()<f?(u.prnt(`
rndm move`),S=V.getRandomAction(T)):(u.prnt(`
qTable move`),S=V.getAction(e,g,h.reverseAction),T.includes(S)||(S=V.getAction(e,g,h.reverseAction))),u.prnt(`
--------------------------------------------------------`),u.prnt(`
action: `+S);const H=h.executeAction(g,S),Q=H.state;h.prntInfo();const X=H.reward;A=H.isTerminal,A&&(A=!0);const N=new I(g,S,X,A,Q);E.experience.add(N),g=H.state}E.replayExperience(E.experience,e,n,s,1e3);const R=Array.from(e.values()).reduce((S,T)=>S+T.qValues.size,0),M=`Episode ${i} done, states count: ${R}, experience size: ${E.experience.size}`;u.prnt(M),u.prnt(o),await u.sleep(500),v.clearScreen()}static replayExperience(t,e,s,n,i){Array.from(t).sort(()=>Math.random()-.5).slice(0,i).forEach(c=>{q.updateQTable(e,c.getState(),c.getAction(),c.getNewState(),c.getReward(),c.isDone(),s,n)})}};l(E,"trainingEnabled",!0),l(E,"experience",new Set);let D=E;class B{nextDouble(){return Math.random()}}class Z{static setupTools(){var t,e;(t=document.getElementById("startTraining"))==null||t.addEventListener("click",()=>this.startTraining().then()),(e=document.getElementById("startTesting"))==null||e.addEventListener("click",()=>this.startTesting().then())}static async startTraining(){v.clearScreen(),v.prnt("starting training session ... "),await u.sleep(0),V.testingEnabled=!1,D.trainingEnabled=!0,V.train().then(()=>this.startTesting().then())}static async startTesting(){v.clearScreen(),v.prnt("start testing ... "),await u.sleep(0),D.trainingEnabled=!1,V.testingEnabled=!0,V.test().then()}}Z.setupTools();