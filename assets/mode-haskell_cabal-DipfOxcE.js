import{g as x}from"./index-Cd3ar7B7.js";function H(h,f){for(var a=0;a<f.length;a++){const l=f[a];if(typeof l!="string"&&!Array.isArray(l)){for(const r in l)if(r!=="default"&&!(r in h)){const n=Object.getOwnPropertyDescriptor(l,r);n&&Object.defineProperty(h,r,n.get?n:{enumerable:!0,get:()=>l[r]})}}}return Object.freeze(Object.defineProperty(h,Symbol.toStringTag,{value:"Module"}))}var p={exports:{}},_;function R(){return _||(_=1,function(h,f){ace.define("ace/mode/haskell_cabal_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(a,l,r){var n=a("../lib/oop"),c=a("./text_highlight_rules").TextHighlightRules,d=function(){this.$rules={start:[{token:"comment",regex:"^\\s*--.*$"},{token:["keyword"],regex:/^(\s*\w.*?)(:(?:\s+|$))/},{token:"constant.numeric",regex:/[\d_]+(?:(?:[\.\d_]*)?)/},{token:"constant.language.boolean",regex:"(?:true|false|TRUE|FALSE|True|False|yes|no)\\b"},{token:"markup.heading",regex:/^(\w.*)$/}]}};n.inherits(d,c),l.CabalHighlightRules=d}),ace.define("ace/mode/folding/haskell_cabal",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"],function(a,l,r){var n=a("../../lib/oop"),c=a("./fold_mode").FoldMode,d=a("../../range").Range,u=l.FoldMode=function(){};n.inherits(u,c),(function(){this.isHeading=function(t,g){var e="markup.heading",o=t.getTokens(g)[0];return g==0||o&&o.type.lastIndexOf(e,0)===0},this.getFoldWidget=function(t,g,e){if(this.isHeading(t,e))return"start";if(g==="markbeginend"&&!/^\s*$/.test(t.getLine(e))){for(var o=t.getLength();++e<o&&/^\s*$/.test(t.getLine(e)););if(e==o||this.isHeading(t,e))return"end"}return""},this.getFoldWidgetRange=function(t,g,e){var o=t.getLine(e),m=o.length,k=t.getLength(),s=e,i=e;if(this.isHeading(t,e)){for(;++e<k;)if(this.isHeading(t,e)){e--;break}if(i=e,i>s)for(;i>s&&/^\s*$/.test(t.getLine(i));)i--;if(i>s){var b=t.getLine(i).length;return new d(s,m,i,b)}}else if(this.getFoldWidget(t,g,e)==="end"){for(var i=e,b=t.getLine(i).length;--e>=0&&!this.isHeading(t,e););var o=t.getLine(e),m=o.length;return new d(e,m,i,b)}}}).call(u.prototype)}),ace.define("ace/mode/haskell_cabal",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/haskell_cabal_highlight_rules","ace/mode/folding/haskell_cabal"],function(a,l,r){var n=a("../lib/oop"),c=a("./text").Mode,d=a("./haskell_cabal_highlight_rules").CabalHighlightRules,u=a("./folding/haskell_cabal").FoldMode,t=function(){this.HighlightRules=d,this.foldingRules=new u,this.$behaviour=this.$defaultBehaviour};n.inherits(t,c),(function(){this.lineCommentStart="--",this.blockComment=null,this.$id="ace/mode/haskell_cabal"}).call(t.prototype),l.Mode=t}),function(){ace.require(["ace/mode/haskell_cabal"],function(a){h.exports=a})}()}(p)),p.exports}var v=R();const M=x(v),F=H({__proto__:null,default:M},[v]);export{F as m};
