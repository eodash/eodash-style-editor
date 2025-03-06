import{g as k}from"./index-Cd3ar7B7.js";function _(l,x){for(var e=0;e<x.length;e++){const n=x[e];if(typeof n!="string"&&!Array.isArray(n)){for(const i in n)if(i!=="default"&&!(i in l)){const o=Object.getOwnPropertyDescriptor(n,i);o&&Object.defineProperty(l,i,o.get?o:{enumerable:!0,get:()=>n[i]})}}}return Object.freeze(Object.defineProperty(l,Symbol.toStringTag,{value:"Module"}))}var p={exports:{}},m;function b(){return m||(m=1,function(l,x){ace.define("ace/mode/tex_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/text_highlight_rules"],function(e,n,i){var o=e("../lib/oop");e("../lib/lang");var a=e("./text_highlight_rules").TextHighlightRules,r=function(t){t||(t="text"),this.$rules={start:[{token:"comment",regex:"%.*$"},{token:t,regex:"\\\\[$&%#\\{\\}]"},{token:"keyword",regex:"\\\\(?:documentclass|usepackage|newcounter|setcounter|addtocounter|value|arabic|stepcounter|newenvironment|renewenvironment|ref|vref|eqref|pageref|label|cite[a-zA-Z]*|tag|begin|end|bibitem)\\b",next:"nospell"},{token:"keyword",regex:"\\\\(?:[a-zA-Z0-9]+|[^a-zA-Z0-9])"},{token:"paren.keyword.operator",regex:"[[({]"},{token:"paren.keyword.operator",regex:"[\\])}]"},{token:t,regex:"\\s+"}],nospell:[{token:"comment",regex:"%.*$",next:"start"},{token:"nospell."+t,regex:"\\\\[$&%#\\{\\}]"},{token:"keyword",regex:"\\\\(?:documentclass|usepackage|newcounter|setcounter|addtocounter|value|arabic|stepcounter|newenvironment|renewenvironment|ref|vref|eqref|pageref|label|cite[a-zA-Z]*|tag|begin|end|bibitem)\\b"},{token:"keyword",regex:"\\\\(?:[a-zA-Z0-9]+|[^a-zA-Z0-9])",next:"start"},{token:"paren.keyword.operator",regex:"[[({]"},{token:"paren.keyword.operator",regex:"[\\])]"},{token:"paren.keyword.operator",regex:"}",next:"start"},{token:"nospell."+t,regex:"\\s+"},{token:"nospell."+t,regex:"\\w+"}]}};o.inherits(r,a),n.TexHighlightRules=r}),ace.define("ace/mode/r_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/text_highlight_rules","ace/mode/tex_highlight_rules"],function(e,n,i){var o=e("../lib/oop"),a=e("../lib/lang"),r=e("./text_highlight_rules").TextHighlightRules,t=e("./tex_highlight_rules").TexHighlightRules,c=function(){var g=a.arrayToMap("function|if|in|break|next|repeat|else|for|return|switch|while|try|tryCatch|stop|warning|require|library|attach|detach|source|setMethod|setGeneric|setGroupGeneric|setClass".split("|")),h=a.arrayToMap("NULL|NA|TRUE|FALSE|T|F|Inf|NaN|NA_integer_|NA_real_|NA_character_|NA_complex_".split("|"));this.$rules={start:[{token:"comment.sectionhead",regex:"#+(?!').*(?:----|====|####)\\s*$"},{token:"comment",regex:"#+'",next:"rd-start"},{token:"comment",regex:"#.*$"},{token:"string",regex:'["]',next:"qqstring"},{token:"string",regex:"[']",next:"qstring"},{token:"constant.numeric",regex:"0[xX][0-9a-fA-F]+[Li]?\\b"},{token:"constant.numeric",regex:"\\d+L\\b"},{token:"constant.numeric",regex:"\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d*)?i?\\b"},{token:"constant.numeric",regex:"\\.\\d+(?:[eE][+\\-]?\\d*)?i?\\b"},{token:"constant.language.boolean",regex:"(?:TRUE|FALSE|T|F)\\b"},{token:"identifier",regex:"`.*?`"},{onMatch:function(d){return g[d]?"keyword":h[d]?"constant.language":d=="..."||d.match(/^\.\.\d+$/)?"variable.language":"identifier"},regex:"[a-zA-Z.][a-zA-Z0-9._]*\\b"},{token:"keyword.operator",regex:"%%|>=|<=|==|!=|\\->|<\\-|\\|\\||&&|=|\\+|\\-|\\*|/|\\^|>|<|!|&|\\||~|\\$|:"},{token:"keyword.operator",regex:"%.*?%"},{token:"paren.keyword.operator",regex:"[[({]"},{token:"paren.keyword.operator",regex:"[\\])}]"},{token:"text",regex:"\\s+"}],qqstring:[{token:"string",regex:'(?:(?:\\\\.)|(?:[^"\\\\]))*?"',next:"start"},{token:"string",regex:".+"}],qstring:[{token:"string",regex:"(?:(?:\\\\.)|(?:[^'\\\\]))*?'",next:"start"},{token:"string",regex:".+"}]};for(var s=new t("comment").getRules(),u=0;u<s.start.length;u++)s.start[u].token+=".virtual-comment";this.addRules(s,"rd-"),this.$rules["rd-start"].unshift({token:"text",regex:"^",next:"start"}),this.$rules["rd-start"].unshift({token:"keyword",regex:"@(?!@)[^ ]*"}),this.$rules["rd-start"].unshift({token:"comment",regex:"@@"}),this.$rules["rd-start"].push({token:"comment",regex:"[^%\\\\[({\\])}]+"})};o.inherits(c,r),n.RHighlightRules=c}),ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(e,n,i){var o=e("../range").Range,a=function(){};(function(){this.checkOutdent=function(r,t){return/^\s+$/.test(r)?/^\s*\}/.test(t):!1},this.autoOutdent=function(r,t){var c=r.getLine(t),g=c.match(/^(\s*\})/);if(!g)return 0;var h=g[1].length,s=r.findMatchingBracket({row:t,column:h});if(!s||s.row==t)return 0;var u=this.$getIndent(r.getLine(s.row));r.replace(new o(t,0,t,h-1),u)},this.$getIndent=function(r){return r.match(/^\s*/)[0]}}).call(a.prototype),n.MatchingBraceOutdent=a}),ace.define("ace/mode/r",["require","exports","module","ace/unicode","ace/range","ace/lib/oop","ace/mode/text","ace/mode/text_highlight_rules","ace/mode/r_highlight_rules","ace/mode/matching_brace_outdent"],function(e,n,i){var o=e("../unicode");e("../range").Range;var a=e("../lib/oop"),r=e("./text").Mode;e("./text_highlight_rules").TextHighlightRules;var t=e("./r_highlight_rules").RHighlightRules,c=e("./matching_brace_outdent").MatchingBraceOutdent,g=function(){this.HighlightRules=t,this.$outdent=new c,this.$behaviour=this.$defaultBehaviour};a.inherits(g,r),(function(){this.lineCommentStart="#",this.tokenRe=new RegExp("^["+o.wordChars+"._]+","g"),this.nonTokenRe=new RegExp("^(?:[^"+o.wordChars+"._]|s])+","g"),this.$id="ace/mode/r",this.snippetFileId="ace/snippets/r"}).call(g.prototype),n.Mode=g}),function(){ace.require(["ace/mode/r"],function(e){l.exports=e})}()}(p)),p.exports}var f=b();const v=k(f),w=_({__proto__:null,default:v},[f]);export{w as m};
