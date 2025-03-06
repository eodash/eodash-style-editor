import{g as R}from"./index-Cd3ar7B7.js";function T(b,$){for(var a=0;a<$.length;a++){const d=$[a];if(typeof d!="string"&&!Array.isArray(d)){for(const k in d)if(k!=="default"&&!(k in b)){const x=Object.getOwnPropertyDescriptor(d,k);x&&Object.defineProperty(b,k,x.get?x:{enumerable:!0,get:()=>d[k]})}}}return Object.freeze(Object.defineProperty(b,Symbol.toStringTag,{value:"Module"}))}var A={exports:{}},F;function N(){return F||(F=1,function(b,$){ace.define("ace/mode/crystal_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(a,d,k){var x=a("../lib/oop"),m=a("./text_highlight_rules").TextHighlightRules,u=function(){var l="puts|initialize|previous_def|typeof|as|pointerof|sizeof|instance_sizeof",r="if|end|else|elsif|unless|case|when|break|while|next|until|def|return|class|new|getter|setter|property|lib|fun|do|struct|private|protected|public|module|super|abstract|include|extend|begin|enum|raise|yield|with|alias|rescue|ensure|macro|uninitialized|union|type|require",p="true|TRUE|false|FALSE|nil|NIL|__LINE__|__END_LINE__|__FILE__|__DIR__",n="$DEBUG|$defout|$FILENAME|$LOAD_PATH|$SAFE|$stdin|$stdout|$stderr|$VERBOSE|root_url|flash|session|cookies|params|request|response|logger|self",t=this.$keywords=this.createKeywordMapper({keyword:r,"constant.language":p,"variable.language":n,"support.function":l},"identifier"),e="(?:0[xX][\\dA-Fa-f]+)",o="(?:[0-9][\\d_]*)",c="(?:0o[0-7][0-7]*)",s="(?:0[bB][01]+)",g="(?:[+-]?)(?:"+e+"|"+o+"|"+c+"|"+s+")(?:_?[iIuU](?:8|16|32|64))?\\b",v=/\\(?:[nsrtvfbae'"\\]|[0-7]{3}|x[\da-fA-F]{2}|u[\da-fA-F]{4}|u{[\da-fA-F]{1,6}})/,i=/\\(?:[nsrtvfbae'"\\]|[0-7]{3}|x[\da-fA-F]{2}|u[\da-fA-F]{4}|u{[\da-fA-F]{1,6}}|u{(:?[\da-fA-F]{2}\s)*[\da-fA-F]{2}})/;this.$rules={start:[{token:"comment",regex:"#.*$"},{token:"string.regexp",regex:"[/]",push:[{token:"constant.language.escape",regex:i},{token:"string.regexp",regex:"[/][imx]*(?=[).,;\\s]|$)",next:"pop"},{defaultToken:"string.regexp"}]},[{regex:"[{}]",onMatch:function(h,_,f){return this.next=h=="{"?this.nextState:"",h=="{"&&f.length?(f.unshift("start",_),"paren.lparen"):h=="}"&&f.length&&(f.shift(),this.next=f.shift(),this.next.indexOf("string")!=-1)?"paren.end":h=="{"?"paren.lparen":"paren.rparen"},nextState:"start"},{token:"string.start",regex:/"/,push:[{token:"constant.language.escape",regex:i},{token:"string",regex:/\\#{/},{token:"paren.start",regex:/#{/,push:"start"},{token:"string.end",regex:/"/,next:"pop"},{defaultToken:"string"}]},{token:"string.start",regex:/`/,push:[{token:"constant.language.escape",regex:i},{token:"string",regex:/\\#{/},{token:"paren.start",regex:/#{/,push:"start"},{token:"string.end",regex:/`/,next:"pop"},{defaultToken:"string"}]},{stateName:"rpstring",token:"string.start",regex:/%[Qx]?\(/,push:[{token:"constant.language.escape",regex:i},{token:"string.start",regex:/\(/,push:"rpstring"},{token:"string.end",regex:/\)/,next:"pop"},{token:"paren.start",regex:/#{/,push:"start"},{defaultToken:"string"}]},{stateName:"spstring",token:"string.start",regex:/%[Qx]?\[/,push:[{token:"constant.language.escape",regex:i},{token:"string.start",regex:/\[/,push:"spstring"},{token:"string.end",regex:/]/,next:"pop"},{token:"paren.start",regex:/#{/,push:"start"},{defaultToken:"string"}]},{stateName:"fpstring",token:"string.start",regex:/%[Qx]?{/,push:[{token:"constant.language.escape",regex:i},{token:"string.start",regex:/{/,push:"fpstring"},{token:"string.end",regex:/}/,next:"pop"},{token:"paren.start",regex:/#{/,push:"start"},{defaultToken:"string"}]},{stateName:"tpstring",token:"string.start",regex:/%[Qx]?</,push:[{token:"constant.language.escape",regex:i},{token:"string.start",regex:/</,push:"tpstring"},{token:"string.end",regex:/>/,next:"pop"},{token:"paren.start",regex:/#{/,push:"start"},{defaultToken:"string"}]},{stateName:"ppstring",token:"string.start",regex:/%[Qx]?\|/,push:[{token:"constant.language.escape",regex:i},{token:"string.end",regex:/\|/,next:"pop"},{token:"paren.start",regex:/#{/,push:"start"},{defaultToken:"string"}]},{stateName:"rpqstring",token:"string.start",regex:/%[qwir]\(/,push:[{token:"string.start",regex:/\(/,push:"rpqstring"},{token:"string.end",regex:/\)/,next:"pop"},{defaultToken:"string"}]},{stateName:"spqstring",token:"string.start",regex:/%[qwir]\[/,push:[{token:"string.start",regex:/\[/,push:"spqstring"},{token:"string.end",regex:/]/,next:"pop"},{defaultToken:"string"}]},{stateName:"fpqstring",token:"string.start",regex:/%[qwir]{/,push:[{token:"string.start",regex:/{/,push:"fpqstring"},{token:"string.end",regex:/}/,next:"pop"},{defaultToken:"string"}]},{stateName:"tpqstring",token:"string.start",regex:/%[qwir]</,push:[{token:"string.start",regex:/</,push:"tpqstring"},{token:"string.end",regex:/>/,next:"pop"},{defaultToken:"string"}]},{stateName:"ppqstring",token:"string.start",regex:/%[qwir]\|/,push:[{token:"string.end",regex:/\|/,next:"pop"},{defaultToken:"string"}]},{token:"string.start",regex:/'/,push:[{token:"constant.language.escape",regex:v},{token:"string.end",regex:/'|$/,next:"pop"},{defaultToken:"string"}]}],{token:"text",regex:"::"},{token:"variable.instance",regex:"@{1,2}[a-zA-Z_\\d]+"},{token:"variable.fresh",regex:"%[a-zA-Z_\\d]+"},{token:"support.class",regex:"[A-Z][a-zA-Z_\\d]+"},{token:"constant.other.symbol",regex:"[:](?:(?:===|<=>|\\[]\\?|\\[]=|\\[]|>>|\\*\\*|<<|==|!=|>=|<=|!~|=~|<|\\+|-|\\*|\\/|%|&|\\||\\^|>|!|~)|(?:(?:[A-Za-z_]|[@$](?=[a-zA-Z0-9_]))[a-zA-Z0-9_]*[!=?]?))"},{token:"constant.numeric",regex:"[+-]?\\d(?:\\d|_(?=\\d))*(?:(?:\\.\\d(?:\\d|_(?=\\d))*)?(?:[eE][+-]?\\d+)?)?(?:_?[fF](?:32|64))?\\b"},{token:"constant.numeric",regex:g},{token:"constant.other.symbol",regex:':"',push:[{token:"constant.language.escape",regex:i},{token:"constant.other.symbol",regex:'"',next:"pop"},{defaultToken:"constant.other.symbol"}]},{token:"constant.language.boolean",regex:"(?:true|false)\\b"},{token:"support.function",regex:"(?:is_a\\?|nil\\?|responds_to\\?|as\\?)"},{token:t,regex:"[a-zA-Z_$][a-zA-Z0-9_$!?]*\\b"},{token:"variable.system",regex:"\\$\\!|\\$\\?"},{token:"punctuation.separator.key-value",regex:"=>"},{stateName:"heredoc",onMatch:function(h,_,f){var M="heredoc",y=h.split(this.splitRegex);return f.push(M,y[3]),[{type:"constant",value:y[1]},{type:"string",value:y[2]},{type:"support.class",value:y[3]},{type:"string",value:y[4]}]},regex:"(<<-)([']?)([\\w]+)([']?)",rules:{heredoc:[{token:"string",regex:"^ +"},{onMatch:function(h,_,f){return h===f[1]?(f.shift(),f.shift(),this.next=f[0]||"start","support.class"):(this.next="","string")},regex:".*$",next:"start"}]}},{regex:"$",token:"empty",next:function(h,_){return _[0]==="heredoc"?_[0]:h}},{token:"punctuation.operator",regex:/[.]\s*(?![.])/,push:[{token:"punctuation.operator",regex:/[.]\s*(?![.])/},{token:"support.function",regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{regex:"",token:"empty",next:"pop"}]},{token:"keyword.operator",regex:"!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|\\?|\\:|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\^|\\|"},{token:"punctuation.operator",regex:/[?:,;.]/},{token:"paren.lparen",regex:"[[({]"},{token:"paren.rparen",regex:"[\\])}]"},{token:"text",regex:"\\s+"}]},this.normalizeRules()};x.inherits(u,m),d.CrystalHighlightRules=u}),ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(a,d,k){var x=a("../range").Range,m=function(){};(function(){this.checkOutdent=function(u,l){return/^\s+$/.test(u)?/^\s*\}/.test(l):!1},this.autoOutdent=function(u,l){var r=u.getLine(l),p=r.match(/^(\s*\})/);if(!p)return 0;var n=p[1].length,t=u.findMatchingBracket({row:l,column:n});if(!t||t.row==l)return 0;var e=this.$getIndent(u.getLine(t.row));u.replace(new x(l,0,l,n-1),e)},this.$getIndent=function(u){return u.match(/^\s*/)[0]}}).call(m.prototype),d.MatchingBraceOutdent=m}),ace.define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"],function(a,d,k){var x=a("../../lib/oop"),m=a("./fold_mode").FoldMode,u=a("../../range").Range,l=d.FoldMode=function(){};x.inherits(l,m),(function(){this.commentBlock=function(r,p){var n=/\S/,t=r.getLine(p),e=t.search(n);if(!(e==-1||t[e]!="#")){for(var o=t.length,c=r.getLength(),s=p,g=p;++p<c;){t=r.getLine(p);var v=t.search(n);if(v!=-1){if(t[v]!="#")break;g=p}}if(g>s){var i=r.getLine(g).length;return new u(s,o,g,i)}}},this.getFoldWidgetRange=function(r,p,n){var t=this.indentationBlock(r,n);if(t||(t=this.commentBlock(r,n),t))return t},this.getFoldWidget=function(r,p,n){var t=r.getLine(n),e=t.search(/\S/),o=r.getLine(n+1),c=r.getLine(n-1),s=c.search(/\S/),g=o.search(/\S/);if(e==-1)return r.foldWidgets[n-1]=s!=-1&&s<g?"start":"","";if(s==-1){if(e==g&&t[e]=="#"&&o[e]=="#")return r.foldWidgets[n-1]="",r.foldWidgets[n+1]="","start"}else if(s==e&&t[e]=="#"&&c[e]=="#"&&r.getLine(n-2).search(/\S/)==-1)return r.foldWidgets[n-1]="start",r.foldWidgets[n+1]="","";return s!=-1&&s<e?r.foldWidgets[n-1]="start":r.foldWidgets[n-1]="",e<g?"start":""}}).call(l.prototype)}),ace.define("ace/mode/crystal",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/crystal_highlight_rules","ace/mode/matching_brace_outdent","ace/range","ace/mode/folding/coffee"],function(a,d,k){var x=a("../lib/oop"),m=a("./text").Mode,u=a("./crystal_highlight_rules").CrystalHighlightRules,l=a("./matching_brace_outdent").MatchingBraceOutdent,r=a("../range").Range,p=a("./folding/coffee").FoldMode,n=function(){this.HighlightRules=u,this.$outdent=new l,this.$behaviour=this.$defaultBehaviour,this.foldingRules=new p};x.inherits(n,m),(function(){this.lineCommentStart="#",this.getNextLineIndent=function(t,e,o){var c=this.$getIndent(e),s=this.getTokenizer().getLineTokens(e,t),g=s.tokens;if(g.length&&g[g.length-1].type=="comment")return c;if(t=="start"){var v=e.match(/^.*[\{\(\[]\s*$/),i=e.match(/^\s*(class|def|module)\s.*$/),h=e.match(/.*do(\s*|\s+\|.*\|\s*)$/),_=e.match(/^\s*(if|else|when)\s*/);(v||i||h||_)&&(c+=o)}return c},this.checkOutdent=function(t,e,o){return/^\s+(end|else)$/.test(e+o)||this.$outdent.checkOutdent(e,o)},this.autoOutdent=function(t,e,o){var c=e.getLine(o);if(/}/.test(c))return this.$outdent.autoOutdent(e,o);var s=this.$getIndent(c),g=e.getLine(o-1),v=this.$getIndent(g),i=e.getTabString();v.length<=s.length&&s.slice(-i.length)==i&&e.remove(new r(o,s.length-i.length,o,s.length))},this.$id="ace/mode/crystal"}).call(n.prototype),d.Mode=n}),function(){ace.require(["ace/mode/crystal"],function(a){b.exports=a})}()}(A)),A.exports}var L=N();const z=R(L),O=T({__proto__:null,default:z},[L]);export{O as m};
