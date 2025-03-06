import{g as L}from"./index-Cd3ar7B7.js";function F(x,y){for(var i=0;i<y.length;i++){const c=y[i];if(typeof c!="string"&&!Array.isArray(c)){for(const m in c)if(m!=="default"&&!(m in x)){const f=Object.getOwnPropertyDescriptor(c,m);f&&Object.defineProperty(x,m,f.get?f:{enumerable:!0,get:()=>c[m]})}}}return Object.freeze(Object.defineProperty(x,Symbol.toStringTag,{value:"Module"}))}var S={exports:{}},M;function O(){return M||(M=1,function(x,y){ace.define("ace/mode/yaml_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(i,c,m){var f=i("../lib/oop"),s=i("./text_highlight_rules").TextHighlightRules,g=function(){this.$rules={start:[{token:"comment",regex:"#.*$"},{token:"list.markup",regex:/^(?:-{3}|\.{3})\s*(?=#|$)/},{token:"list.markup",regex:/^\s*[\-?](?:$|\s)/},{token:"constant",regex:"!![\\w//]+"},{token:"constant.language",regex:"[&\\*][a-zA-Z0-9-_]+"},{token:["meta.tag","keyword"],regex:/^(\s*\w[^\s:]*?)(:(?=\s|$))/},{token:["meta.tag","keyword"],regex:/(\w[^\s:]*?)(\s*:(?=\s|$))/},{token:"keyword.operator",regex:"<<\\w*:\\w*"},{token:"keyword.operator",regex:"-\\s*(?=[{])"},{token:"string",regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},{token:"string",regex:/[|>][-+\d]*(?:$|\s+(?:$|#))/,onMatch:function(l,n,a,e){e=e.replace(/ #.*/,"");var r=/^ *((:\s*)?-(\s*[^|>])?)?/.exec(e)[0].replace(/\S\s*$/,"").length,t=parseInt(/\d+[\s+-]*$/.exec(e));return t?(r+=t-1,this.next="mlString"):this.next="mlStringPre",a.length?(a[0]=this.next,a[1]=r):(a.push(this.next),a.push(r)),this.token},next:"mlString"},{token:"string",regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"},{token:"constant.numeric",regex:/(\b|[+\-\.])[\d_]+(?:(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)(?=[^\d-\w]|$)$/},{token:"constant.numeric",regex:/[+\-]?\.inf\b|NaN\b|0x[\dA-Fa-f_]+|0b[10_]+/},{token:"constant.language.boolean",regex:"\\b(?:true|false|TRUE|FALSE|True|False|yes|no)\\b"},{token:"paren.lparen",regex:"[[({]"},{token:"paren.rparen",regex:"[\\])}]"},{token:"text",regex:/[^\s,:\[\]\{\}]+/}],mlStringPre:[{token:"indent",regex:/^ *$/},{token:"indent",regex:/^ */,onMatch:function(l,n,a){var e=a[1];return e>=l.length?(this.next="start",a.shift(),a.shift()):(a[1]=l.length-1,this.next=a[0]="mlString"),this.token},next:"mlString"},{defaultToken:"string"}],mlString:[{token:"indent",regex:/^ *$/},{token:"indent",regex:/^ */,onMatch:function(l,n,a){var e=a[1];return e>=l.length?(this.next="start",a.splice(0)):this.next="mlString",this.token},next:"mlString"},{token:"string",regex:".+"}]},this.normalizeRules()};f.inherits(g,s),c.YamlHighlightRules=g}),ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(i,c,m){var f=i("../range").Range,s=function(){};(function(){this.checkOutdent=function(g,l){return/^\s+$/.test(g)?/^\s*\}/.test(l):!1},this.autoOutdent=function(g,l){var n=g.getLine(l),a=n.match(/^(\s*\})/);if(!a)return 0;var e=a[1].length,r=g.findMatchingBracket({row:l,column:e});if(!r||r.row==l)return 0;var t=this.$getIndent(g.getLine(r.row));g.replace(new f(l,0,l,e-1),t)},this.$getIndent=function(g){return g.match(/^\s*/)[0]}}).call(s.prototype),c.MatchingBraceOutdent=s}),ace.define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"],function(i,c,m){var f=i("../../lib/oop"),s=i("./fold_mode").FoldMode,g=i("../../range").Range,l=c.FoldMode=function(){};f.inherits(l,s),(function(){this.commentBlock=function(n,a){var e=/\S/,r=n.getLine(a),t=r.search(e);if(!(t==-1||r[t]!="#")){for(var d=r.length,h=n.getLength(),o=a,u=a;++a<h;){r=n.getLine(a);var v=r.search(e);if(v!=-1){if(r[v]!="#")break;u=a}}if(u>o){var k=n.getLine(u).length;return new g(o,d,u,k)}}},this.getFoldWidgetRange=function(n,a,e){var r=this.indentationBlock(n,e);if(r||(r=this.commentBlock(n,e),r))return r},this.getFoldWidget=function(n,a,e){var r=n.getLine(e),t=r.search(/\S/),d=n.getLine(e+1),h=n.getLine(e-1),o=h.search(/\S/),u=d.search(/\S/);if(t==-1)return n.foldWidgets[e-1]=o!=-1&&o<u?"start":"","";if(o==-1){if(t==u&&r[t]=="#"&&d[t]=="#")return n.foldWidgets[e-1]="",n.foldWidgets[e+1]="","start"}else if(o==t&&r[t]=="#"&&h[t]=="#"&&n.getLine(e-2).search(/\S/)==-1)return n.foldWidgets[e-1]="start",n.foldWidgets[e+1]="","";return o!=-1&&o<t?n.foldWidgets[e-1]="start":n.foldWidgets[e-1]="",t<u?"start":""}}).call(l.prototype)}),ace.define("ace/mode/folding/yaml",["require","exports","module","ace/lib/oop","ace/mode/folding/coffee","ace/range"],function(i,c,m){var f=i("../../lib/oop"),s=i("./coffee").FoldMode,g=i("../../range").Range,l=c.FoldMode=function(){};f.inherits(l,s),(function(){this.getFoldWidgetRange=function(n,a,e){var r=/\S/,t=n.getLine(e),d=t.search(r),h=t[d]==="#",o=t[d]==="-";if(d!=-1){var u=t.length,v=n.getLength(),k=e,_=e;if(h){var p=this.commentBlock(n,e);if(p)return p}else if(o){var p=this.indentationBlock(n,e);if(p)return p}else for(;++e<v;){var t=n.getLine(e),b=t.search(r);if(b!=-1){if(b<=d&&t[d]!=="-"){var $=n.getTokenAt(e,0);if(!$||$.type!=="string")break}_=e}}if(_>k){var W=n.getLine(_).length;return new g(k,u,_,W)}}},this.getFoldWidget=function(n,a,e){var r=n.getLine(e),t=r.search(/\S/),d=n.getLine(e+1),h=n.getLine(e-1),o=h.search(/\S/),u=d.search(/\S/),v=r[t]==="-";if(t==-1)return n.foldWidgets[e-1]=o!=-1&&o<u?"start":"","";if(o==-1){if(t==u&&r[t]=="#"&&d[t]=="#")return n.foldWidgets[e-1]="",n.foldWidgets[e+1]="","start"}else if(o==t&&r[t]=="#"&&h[t]=="#"&&n.getLine(e-2).search(/\S/)==-1)return n.foldWidgets[e-1]="start",n.foldWidgets[e+1]="","";return o!=-1&&o<t||o!=-1&&o==t&&v?n.foldWidgets[e-1]="start":n.foldWidgets[e-1]="",t<u?"start":""}}).call(l.prototype)}),ace.define("ace/mode/yaml",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/yaml_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/folding/yaml","ace/worker/worker_client"],function(i,c,m){var f=i("../lib/oop"),s=i("./text").Mode,g=i("./yaml_highlight_rules").YamlHighlightRules,l=i("./matching_brace_outdent").MatchingBraceOutdent,n=i("./folding/yaml").FoldMode,a=i("../worker/worker_client").WorkerClient,e=function(){this.HighlightRules=g,this.$outdent=new l,this.foldingRules=new n,this.$behaviour=this.$defaultBehaviour};f.inherits(e,s),(function(){this.lineCommentStart=["#"],this.getNextLineIndent=function(r,t,d){var h=this.$getIndent(t);if(r=="start"){var o=t.match(/^.*[\{\(\[]\s*$/);o&&(h+=d)}return h},this.checkOutdent=function(r,t,d){return this.$outdent.checkOutdent(t,d)},this.autoOutdent=function(r,t,d){this.$outdent.autoOutdent(t,d)},this.createWorker=function(r){var t=new a(["ace"],"ace/mode/yaml_worker","YamlWorker");return t.attachToDocument(r.getDocument()),t.on("annotate",function(d){r.setAnnotations(d.data)}),t.on("terminate",function(){r.clearAnnotations()}),t},this.$id="ace/mode/yaml"}).call(e.prototype),c.Mode=e}),function(){ace.require(["ace/mode/yaml"],function(i){x.exports=i})}()}(S)),S.exports}var R=O();const B=L(R),Y=F({__proto__:null,default:B},[R]);export{Y as m};
