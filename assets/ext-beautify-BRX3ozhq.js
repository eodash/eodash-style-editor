import{g as H}from"./index-Cd3ar7B7.js";function J(x,j){for(var d=0;d<j.length;d++){const f=j[d];if(typeof f!="string"&&!Array.isArray(f)){for(const v in f)if(v!=="default"&&!(v in x)){const B=Object.getOwnPropertyDescriptor(f,v);B&&Object.defineProperty(x,v,B.get?B:{enumerable:!0,get:()=>f[v]})}}}return Object.freeze(Object.defineProperty(x,Symbol.toStringTag,{value:"Module"}))}var N={exports:{}},z;function Q(){return z||(z=1,function(x,j){ace.define("ace/ext/beautify",["require","exports","module","ace/token_iterator"],function(d,f,v){var B=d("../token_iterator").TokenIterator;function s(m,b){return m.type.lastIndexOf(b+".xml")>-1}f.singletonTags=["area","base","br","col","command","embed","hr","html","img","input","keygen","link","meta","param","source","track","wbr"],f.blockTags=["article","aside","blockquote","body","div","dl","fieldset","footer","form","head","header","html","nav","ol","p","script","section","style","table","tbody","tfoot","thead","ul"],f.formatOptions={lineBreaksAfterCommasInCurlyBlock:!0},f.beautify=function(m){for(var b=new B(m,0,0),t=b.getCurrentToken(),M=m.getTabString(),V=f.singletonTags,F=f.blockTags,G=f.formatOptions||{},n,p=!1,o=!1,y=!1,r="",e="",D="",a=0,R=0,L=0,c=0,g=0,k=0,E=0,_,I=0,i=0,l,T=!1,S=!1,q=!1,h=!1,P={0:0},$=[],A=!1,w=function(){n&&n.value&&n.type!=="string.regexp"&&(n.value=n.value.replace(/^\s*/,""))},O=function(){for(var C=r.length-1;!(C==0||r[C]!==" ");)C=C-1;r=r.slice(0,C+1)},u=function(){r=r.trimRight(),p=!1};t!==null;){if(I=b.getCurrentTokenRow(),b.$rowTokens,n=b.stepForward(),typeof t<"u"){if(e=t.value,g=0,q=D==="style"||m.$modeId==="ace/mode/css",s(t,"tag-open")?(S=!0,n&&(h=F.indexOf(n.value)!==-1),e==="</"&&(h&&!p&&i<1&&i++,q&&(i=1),g=1,h=!1)):s(t,"tag-close")?S=!1:s(t,"comment.start")?h=!0:s(t,"comment.end")&&(h=!1),!S&&!i&&t.type==="paren.rparen"&&t.value.substr(0,1)==="}"&&i++,I!==_&&(i=I,_&&(i-=_)),i){for(u();i>0;i--)r+=`
`;p=!0,!s(t,"comment")&&!t.type.match(/^(comment|string)$/)&&(e=e.trimLeft())}if(e){if(t.type==="keyword"&&e.match(/^(if|else|elseif|for|foreach|while|switch)$/)?($[a]=e,w(),y=!0,e.match(/^(else|elseif)$/)&&r.match(/\}[\s]*$/)&&(u(),o=!0)):t.type==="paren.lparen"?(w(),e.substr(-1)==="{"&&(y=!0,T=!1,S||(i=1)),e.substr(0,1)==="{"&&(o=!0,r.substr(-1)!=="["&&r.trimRight().substr(-1)==="["?(u(),o=!1):r.trimRight().substr(-1)===")"?u():O())):t.type==="paren.rparen"?(g=1,e.substr(0,1)==="}"&&($[a-1]==="case"&&g++,r.trimRight().substr(-1)==="{"?u():(o=!0,q&&(i+=2))),e.substr(0,1)==="]"&&r.substr(-1)!=="}"&&r.trimRight().substr(-1)==="}"&&(o=!1,c++,u()),e.substr(0,1)===")"&&r.substr(-1)!=="("&&r.trimRight().substr(-1)==="("&&(o=!1,c++,u()),O()):(t.type==="keyword.operator"||t.type==="keyword")&&e.match(/^(=|==|===|!=|!==|&&|\|\||and|or|xor|\+=|.=|>|>=|<|<=|=>)$/)?(u(),w(),o=!0,y=!0):t.type==="punctuation.operator"&&e===";"?(u(),w(),y=!0,q&&i++):t.type==="punctuation.operator"&&e.match(/^(:|,)$/)?(u(),w(),e.match(/^(,)$/)&&E>0&&k===0&&G.lineBreaksAfterCommasInCurlyBlock?i++:(y=!0,p=!1)):t.type==="support.php_tag"&&e==="?>"&&!p?(u(),o=!0):s(t,"attribute-name")&&r.substr(-1).match(/^\s$/)?o=!0:s(t,"attribute-equals")?(O(),w()):s(t,"tag-close")?(O(),e==="/>"&&(o=!0)):t.type==="keyword"&&e.match(/^(case|default)$/)&&A&&(g=1),p&&!(t.type.match(/^(comment)$/)&&!e.substr(0,1).match(/^[/#]$/))&&!(t.type.match(/^(string)$/)&&!e.substr(0,1).match(/^['"@]$/))){if(c=L,a>R)for(c++,l=a;l>R;l--)P[l]=c;else a<R&&(c=P[a]);for(R=a,L=c,g&&(c-=g),T&&!k&&(c++,T=!1),l=0;l<c;l++)r+=M}if(t.type==="keyword"&&e.match(/^(case|default)$/)?A===!1&&($[a]=e,a++,A=!0):t.type==="keyword"&&e.match(/^(break)$/)&&$[a-1]&&$[a-1].match(/^(case|default)$/)&&(a--,A=!1),t.type==="paren.lparen"&&(k+=(e.match(/\(/g)||[]).length,E+=(e.match(/\{/g)||[]).length,a+=e.length),t.type==="keyword"&&e.match(/^(if|else|elseif|for|while)$/)?(T=!0,k=0):!k&&e.trim()&&t.type!=="comment"&&(T=!1),t.type==="paren.rparen")for(k-=(e.match(/\)/g)||[]).length,E-=(e.match(/\}/g)||[]).length,l=0;l<e.length;l++)a--,e.substr(l,1)==="}"&&$[a]==="case"&&a--;t.type=="text"&&(e=e.replace(/\s+$/," ")),o&&!p&&(O(),r.substr(-1)!==`
`&&(r+=" ")),r+=e,y&&(r+=" "),p=!1,o=!1,y=!1,(s(t,"tag-close")&&(h||F.indexOf(D)!==-1)||s(t,"doctype")&&e===">")&&(h&&n&&n.value==="</"?i=-1:i=1),n&&V.indexOf(n.value)===-1&&(s(t,"tag-open")&&e==="</"?a--:s(t,"tag-open")&&e==="<"?a++:s(t,"tag-close")&&e==="/>"&&a--),s(t,"tag-name")&&(D=e),_=I}}t=n}r=r.trim(),m.doc.setValue(r)},f.commands=[{name:"beautify",description:"Format selection (Beautify)",exec:function(m){f.beautify(m.session)},bindKey:"Ctrl-Shift-B"}]}),function(){ace.require(["ace/ext/beautify"],function(d){x.exports=d})}()}(N)),N.exports}var K=Q();const U=H(K),X=J({__proto__:null,default:U},[K]);export{X as e};
