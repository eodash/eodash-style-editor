import{g as T}from"./index-Cd3ar7B7.js";function w(x,h){for(var t=0;t<h.length;t++){const r=h[t];if(typeof r!="string"&&!Array.isArray(r)){for(const d in r)if(d!=="default"&&!(d in x)){const a=Object.getOwnPropertyDescriptor(r,d);a&&Object.defineProperty(x,d,a.get?a:{enumerable:!0,get:()=>r[d]})}}}return Object.freeze(Object.defineProperty(x,Symbol.toStringTag,{value:"Module"}))}var k={exports:{}},_;function q(){return _||(_=1,function(x,h){ace.define("ace/mode/elixir_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(t,r,d){var a=t("../lib/oop"),p=t("./text_highlight_rules").TextHighlightRules,s=function(){this.$rules={start:[{token:["meta.module.elixir","keyword.control.module.elixir","meta.module.elixir","entity.name.type.module.elixir"],regex:"^(\\s*)(defmodule)(\\s+)((?:[A-Z]\\w*\\s*\\.\\s*)*[A-Z]\\w*)"},{token:"comment.documentation.heredoc",regex:'@(?:module|type)?doc (?:~[a-z])?"""',push:[{token:"comment.documentation.heredoc",regex:'\\s*"""',next:"pop"},{include:"#interpolated_elixir"},{include:"#escaped_char"},{defaultToken:"comment.documentation.heredoc"}],comment:"@doc with heredocs is treated as documentation"},{token:"comment.documentation.heredoc",regex:'@(?:module|type)?doc ~[A-Z]"""',push:[{token:"comment.documentation.heredoc",regex:'\\s*"""',next:"pop"},{defaultToken:"comment.documentation.heredoc"}],comment:"@doc with heredocs is treated as documentation"},{token:"comment.documentation.heredoc",regex:"@(?:module|type)?doc (?:~[a-z])?'''",push:[{token:"comment.documentation.heredoc",regex:"\\s*'''",next:"pop"},{include:"#interpolated_elixir"},{include:"#escaped_char"},{defaultToken:"comment.documentation.heredoc"}],comment:"@doc with heredocs is treated as documentation"},{token:"comment.documentation.heredoc",regex:"@(?:module|type)?doc ~[A-Z]'''",push:[{token:"comment.documentation.heredoc",regex:"\\s*'''",next:"pop"},{defaultToken:"comment.documentation.heredoc"}],comment:"@doc with heredocs is treated as documentation"},{token:"comment.documentation.false",regex:"@(?:module|type)?doc false",comment:"@doc false is treated as documentation"},{token:"comment.documentation.string",regex:'@(?:module|type)?doc "',push:[{token:"comment.documentation.string",regex:'"',next:"pop"},{include:"#interpolated_elixir"},{include:"#escaped_char"},{defaultToken:"comment.documentation.string"}],comment:"@doc with string is treated as documentation"},{token:"keyword.control.elixir",regex:"\\b(?:do|end|case|bc|lc|for|if|cond|unless|try|receive|fn|defmodule|defp?|defprotocol|defimpl|defrecord|defstruct|defmacrop?|defdelegate|defcallback|defmacrocallback|defexception|defoverridable|exit|after|rescue|catch|else|raise|throw|import|require|alias|use|quote|unquote|super)\\b(?![?!])",TODO:"FIXME: regexp doesn't have js equivalent",originalRegex:"(?<!\\.)\\b(do|end|case|bc|lc|for|if|cond|unless|try|receive|fn|defmodule|defp?|defprotocol|defimpl|defrecord|defstruct|defmacrop?|defdelegate|defcallback|defmacrocallback|defexception|defoverridable|exit|after|rescue|catch|else|raise|throw|import|require|alias|use|quote|unquote|super)\\b(?![?!])"},{token:"keyword.operator.elixir",regex:"\\b(?:and|not|or|when|xor|in|inlist|inbits)\\b",TODO:"FIXME: regexp doesn't have js equivalent",originalRegex:"(?<!\\.)\\b(and|not|or|when|xor|in|inlist|inbits)\\b",comment:" as above, just doesn't need a 'end' and does a logic operation"},{token:"constant.language.elixir",regex:"\\b(?:nil|true|false)\\b(?![?!])"},{token:"variable.language.elixir",regex:"\\b__(?:CALLER|ENV|MODULE|DIR)__\\b(?![?!])"},{token:["punctuation.definition.variable.elixir","variable.other.readwrite.module.elixir"],regex:"(@)([a-zA-Z_]\\w*)"},{token:["punctuation.definition.variable.elixir","variable.other.anonymous.elixir"],regex:"(&)(\\d*)"},{token:"variable.other.constant.elixir",regex:"\\b[A-Z]\\w*\\b"},{token:"constant.numeric.elixir",regex:"\\b(?:0x[\\da-fA-F](?:_?[\\da-fA-F])*|\\d(?:_?\\d)*(?:\\.(?![^[:space:][:digit:]])(?:_?\\d)*)?(?:[eE][-+]?\\d(?:_?\\d)*)?|0b[01]+|0o[0-7]+)\\b",TODO:"FIXME: regexp doesn't have js equivalent",originalRegex:"\\b(0x\\h(?>_?\\h)*|\\d(?>_?\\d)*(\\.(?![^[:space:][:digit:]])(?>_?\\d)*)?([eE][-+]?\\d(?>_?\\d)*)?|0b[01]+|0o[0-7]+)\\b"},{token:"punctuation.definition.constant.elixir",regex:":'",push:[{token:"punctuation.definition.constant.elixir",regex:"'",next:"pop"},{include:"#interpolated_elixir"},{include:"#escaped_char"},{defaultToken:"constant.other.symbol.single-quoted.elixir"}]},{token:"punctuation.definition.constant.elixir",regex:':"',push:[{token:"punctuation.definition.constant.elixir",regex:'"',next:"pop"},{include:"#interpolated_elixir"},{include:"#escaped_char"},{defaultToken:"constant.other.symbol.double-quoted.elixir"}]},{token:"punctuation.definition.string.begin.elixir",regex:"(?:''')",TODO:"FIXME: regexp doesn't have js equivalent",originalRegex:"(?>''')",push:[{token:"punctuation.definition.string.end.elixir",regex:"^\\s*'''",next:"pop"},{include:"#interpolated_elixir"},{include:"#escaped_char"},{defaultToken:"support.function.variable.quoted.single.heredoc.elixir"}],comment:"Single-quoted heredocs"},{token:"punctuation.definition.string.begin.elixir",regex:"'",push:[{token:"punctuation.definition.string.end.elixir",regex:"'",next:"pop"},{include:"#interpolated_elixir"},{include:"#escaped_char"},{defaultToken:"support.function.variable.quoted.single.elixir"}],comment:"single quoted string (allows for interpolation)"},{token:"punctuation.definition.string.begin.elixir",regex:'(?:""")',TODO:"FIXME: regexp doesn't have js equivalent",originalRegex:'(?>""")',push:[{token:"punctuation.definition.string.end.elixir",regex:'^\\s*"""',next:"pop"},{include:"#interpolated_elixir"},{include:"#escaped_char"},{defaultToken:"string.quoted.double.heredoc.elixir"}],comment:"Double-quoted heredocs"},{token:"punctuation.definition.string.begin.elixir",regex:'"',push:[{token:"punctuation.definition.string.end.elixir",regex:'"',next:"pop"},{include:"#interpolated_elixir"},{include:"#escaped_char"},{defaultToken:"string.quoted.double.elixir"}],comment:"double quoted string (allows for interpolation)"},{token:"punctuation.definition.string.begin.elixir",regex:'~[a-z](?:""")',TODO:"FIXME: regexp doesn't have js equivalent",originalRegex:'~[a-z](?>""")',push:[{token:"punctuation.definition.string.end.elixir",regex:'^\\s*"""',next:"pop"},{include:"#interpolated_elixir"},{include:"#escaped_char"},{defaultToken:"string.quoted.double.heredoc.elixir"}],comment:"Double-quoted heredocs sigils"},{token:"punctuation.definition.string.begin.elixir",regex:"~[a-z]\\{",push:[{token:"punctuation.definition.string.end.elixir",regex:"\\}[a-z]*",next:"pop"},{include:"#interpolated_elixir"},{include:"#escaped_char"},{defaultToken:"string.interpolated.elixir"}],comment:"sigil (allow for interpolation)"},{token:"punctuation.definition.string.begin.elixir",regex:"~[a-z]\\[",push:[{token:"punctuation.definition.string.end.elixir",regex:"\\][a-z]*",next:"pop"},{include:"#interpolated_elixir"},{include:"#escaped_char"},{defaultToken:"string.interpolated.elixir"}],comment:"sigil (allow for interpolation)"},{token:"punctuation.definition.string.begin.elixir",regex:"~[a-z]\\<",push:[{token:"punctuation.definition.string.end.elixir",regex:"\\>[a-z]*",next:"pop"},{include:"#interpolated_elixir"},{include:"#escaped_char"},{defaultToken:"string.interpolated.elixir"}],comment:"sigil (allow for interpolation)"},{token:"punctuation.definition.string.begin.elixir",regex:"~[a-z]\\(",push:[{token:"punctuation.definition.string.end.elixir",regex:"\\)[a-z]*",next:"pop"},{include:"#interpolated_elixir"},{include:"#escaped_char"},{defaultToken:"string.interpolated.elixir"}],comment:"sigil (allow for interpolation)"},{token:"punctuation.definition.string.begin.elixir",regex:"~[a-z][^\\w]",push:[{token:"punctuation.definition.string.end.elixir",regex:"[^\\w][a-z]*",next:"pop"},{include:"#interpolated_elixir"},{include:"#escaped_char"},{include:"#escaped_char"},{defaultToken:"string.interpolated.elixir"}],comment:"sigil (allow for interpolation)"},{token:"punctuation.definition.string.begin.elixir",regex:'~[A-Z](?:""")',TODO:"FIXME: regexp doesn't have js equivalent",originalRegex:'~[A-Z](?>""")',push:[{token:"punctuation.definition.string.end.elixir",regex:'^\\s*"""',next:"pop"},{defaultToken:"string.quoted.other.literal.upper.elixir"}],comment:"Double-quoted heredocs sigils"},{token:"punctuation.definition.string.begin.elixir",regex:"~[A-Z]\\{",push:[{token:"punctuation.definition.string.end.elixir",regex:"\\}[a-z]*",next:"pop"},{defaultToken:"string.quoted.other.literal.upper.elixir"}],comment:"sigil (without interpolation)"},{token:"punctuation.definition.string.begin.elixir",regex:"~[A-Z]\\[",push:[{token:"punctuation.definition.string.end.elixir",regex:"\\][a-z]*",next:"pop"},{defaultToken:"string.quoted.other.literal.upper.elixir"}],comment:"sigil (without interpolation)"},{token:"punctuation.definition.string.begin.elixir",regex:"~[A-Z]\\<",push:[{token:"punctuation.definition.string.end.elixir",regex:"\\>[a-z]*",next:"pop"},{defaultToken:"string.quoted.other.literal.upper.elixir"}],comment:"sigil (without interpolation)"},{token:"punctuation.definition.string.begin.elixir",regex:"~[A-Z]\\(",push:[{token:"punctuation.definition.string.end.elixir",regex:"\\)[a-z]*",next:"pop"},{defaultToken:"string.quoted.other.literal.upper.elixir"}],comment:"sigil (without interpolation)"},{token:"punctuation.definition.string.begin.elixir",regex:"~[A-Z][^\\w]",push:[{token:"punctuation.definition.string.end.elixir",regex:"[^\\w][a-z]*",next:"pop"},{defaultToken:"string.quoted.other.literal.upper.elixir"}],comment:"sigil (without interpolation)"},{token:["punctuation.definition.constant.elixir","constant.other.symbol.elixir"],regex:"(:)([a-zA-Z_][\\w@]*(?:[?!]|=(?![>=]))?|\\<\\>|===?|!==?|<<>>|<<<|>>>|~~~|::|<\\-|\\|>|=>|~|~=|=|/|\\\\\\\\|\\*\\*?|\\.\\.?\\.?|>=?|<=?|&&?&?|\\+\\+?|\\-\\-?|\\|\\|?\\|?|\\!|@|\\%?\\{\\}|%|\\[\\]|\\^(?:\\^\\^)?)",TODO:"FIXME: regexp doesn't have js equivalent",originalRegex:"(?<!:)(:)(?>[a-zA-Z_][\\w@]*(?>[?!]|=(?![>=]))?|\\<\\>|===?|!==?|<<>>|<<<|>>>|~~~|::|<\\-|\\|>|=>|~|~=|=|/|\\\\\\\\|\\*\\*?|\\.\\.?\\.?|>=?|<=?|&&?&?|\\+\\+?|\\-\\-?|\\|\\|?\\|?|\\!|@|\\%?\\{\\}|%|\\[\\]|\\^(\\^\\^)?)",comment:"symbols"},{token:"punctuation.definition.constant.elixir",regex:"(?:[a-zA-Z_][\\w@]*(?:[?!])?):(?!:)",TODO:"FIXME: regexp doesn't have js equivalent",originalRegex:"(?>[a-zA-Z_][\\w@]*(?>[?!])?)(:)(?!:)",comment:"symbols"},{token:["punctuation.definition.comment.elixir","comment.line.number-sign.elixir"],regex:"(#)(.*)"},{token:"constant.numeric.elixir",regex:"\\?(?:\\\\(?:x[\\da-fA-F]{1,2}(?![\\da-fA-F])\\b|[^xMC])|[^\\s\\\\])",TODO:"FIXME: regexp doesn't have js equivalent",originalRegex:"(?<!\\w)\\?(\\\\(x\\h{1,2}(?!\\h)\\b|[^xMC])|[^\\s\\\\])",comment:`
			matches questionmark-letters.

			examples (1st alternation = hex):
			?\\x1     ?\\x61

			examples (2rd alternation = escaped):
			?\\n      ?\\b

			examples (3rd alternation = normal):
			?a       ?A       ?0 
			?*       ?"       ?( 
			?.       ?#
			
			the negative lookbehind prevents against matching
			p(42.tainted?)
			`},{token:"keyword.operator.assignment.augmented.elixir",regex:"\\+=|\\-=|\\|\\|=|~=|&&="},{token:"keyword.operator.comparison.elixir",regex:"===?|!==?|<=?|>=?"},{token:"keyword.operator.bitwise.elixir",regex:"\\|{3}|&{3}|\\^{3}|<{3}|>{3}|~{3}"},{token:"keyword.operator.logical.elixir",regex:"!+|\\bnot\\b|&&|\\band\\b|\\|\\||\\bor\\b|\\bxor\\b",originalRegex:"(?<=[ \\t])!+|\\bnot\\b|&&|\\band\\b|\\|\\||\\bor\\b|\\bxor\\b"},{token:"keyword.operator.arithmetic.elixir",regex:"\\*|\\+|\\-|/"},{token:"keyword.operator.other.elixir",regex:"\\||\\+\\+|\\-\\-|\\*\\*|\\\\\\\\|\\<\\-|\\<\\>|\\<\\<|\\>\\>|\\:\\:|\\.\\.|\\|>|~|=>"},{token:"keyword.operator.assignment.elixir",regex:"="},{token:"punctuation.separator.other.elixir",regex:":"},{token:"punctuation.separator.statement.elixir",regex:"\\;"},{token:"punctuation.separator.object.elixir",regex:","},{token:"punctuation.separator.method.elixir",regex:"\\."},{token:"punctuation.section.scope.elixir",regex:"\\{|\\}"},{token:"punctuation.section.array.elixir",regex:"\\[|\\]"},{token:"punctuation.section.function.elixir",regex:"\\(|\\)"}],"#escaped_char":[{token:"constant.character.escape.elixir",regex:"\\\\(?:x[\\da-fA-F]{1,2}|.)"}],"#interpolated_elixir":[{token:["source.elixir.embedded.source","source.elixir.embedded.source.empty"],regex:"(#\\{)(\\})"},{todo:{token:"punctuation.section.embedded.elixir",regex:"#\\{",push:[{token:"punctuation.section.embedded.elixir",regex:"\\}",next:"pop"},{include:"#nest_curly_and_self"},{include:"$self"},{defaultToken:"source.elixir.embedded.source"}]}}],"#nest_curly_and_self":[{token:"punctuation.section.scope.elixir",regex:"\\{",push:[{token:"punctuation.section.scope.elixir",regex:"\\}",next:"pop"},{include:"#nest_curly_and_self"}]},{include:"$self"}],"#regex_sub":[{include:"#interpolated_elixir"},{include:"#escaped_char"},{token:["punctuation.definition.arbitrary-repitition.elixir","string.regexp.arbitrary-repitition.elixir","string.regexp.arbitrary-repitition.elixir","punctuation.definition.arbitrary-repitition.elixir"],regex:"(\\{)(\\d+)((?:,\\d+)?)(\\})"},{token:"punctuation.definition.character-class.elixir",regex:"\\[(?:\\^?\\])?",push:[{token:"punctuation.definition.character-class.elixir",regex:"\\]",next:"pop"},{include:"#escaped_char"},{defaultToken:"string.regexp.character-class.elixir"}]},{token:"punctuation.definition.group.elixir",regex:"\\(",push:[{token:"punctuation.definition.group.elixir",regex:"\\)",next:"pop"},{include:"#regex_sub"},{defaultToken:"string.regexp.group.elixir"}]},{token:["punctuation.definition.comment.elixir","comment.line.number-sign.elixir"],regex:"(?:^|\\s)(#)(\\s[[a-zA-Z0-9,. \\t?!-][^\\x00-\\x7F]]*$)",originalRegex:"(?<=^|\\s)(#)\\s[[a-zA-Z0-9,. \\t?!-][^\\x{00}-\\x{7F}]]*$",comment:"We are restrictive in what we allow to go after the comment character to avoid false positives, since the availability of comments depend on regexp flags."}]},this.normalizeRules()};s.metaData={comment:"Textmate bundle for Elixir Programming Language.",fileTypes:["ex","exs"],firstLineMatch:"^#!/.*\\belixir",foldingStartMarker:"(after|else|catch|rescue|\\-\\>|\\{|\\[|do)\\s*$",foldingStopMarker:"^\\s*((\\}|\\]|after|else|catch|rescue)\\s*$|end\\b)",keyEquivalent:"^~E",name:"Elixir",scopeName:"source.elixir"},a.inherits(s,p),r.ElixirHighlightRules=s}),ace.define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"],function(t,r,d){var a=t("../../lib/oop"),p=t("./fold_mode").FoldMode,s=t("../../range").Range,g=r.FoldMode=function(){};a.inherits(g,p),(function(){this.commentBlock=function(e,c){var i=/\S/,n=e.getLine(c),o=n.search(i);if(!(o==-1||n[o]!="#")){for(var m=n.length,f=e.getLength(),l=c,u=c;++c<f;){n=e.getLine(c);var b=n.search(i);if(b!=-1){if(n[b]!="#")break;u=c}}if(u>l){var y=e.getLine(u).length;return new s(l,m,u,y)}}},this.getFoldWidgetRange=function(e,c,i){var n=this.indentationBlock(e,i);if(n||(n=this.commentBlock(e,i),n))return n},this.getFoldWidget=function(e,c,i){var n=e.getLine(i),o=n.search(/\S/),m=e.getLine(i+1),f=e.getLine(i-1),l=f.search(/\S/),u=m.search(/\S/);if(o==-1)return e.foldWidgets[i-1]=l!=-1&&l<u?"start":"","";if(l==-1){if(o==u&&n[o]=="#"&&m[o]=="#")return e.foldWidgets[i-1]="",e.foldWidgets[i+1]="","start"}else if(l==o&&n[o]=="#"&&f[o]=="#"&&e.getLine(i-2).search(/\S/)==-1)return e.foldWidgets[i-1]="start",e.foldWidgets[i+1]="","";return l!=-1&&l<o?e.foldWidgets[i-1]="start":e.foldWidgets[i-1]="",o<u?"start":""}}).call(g.prototype)}),ace.define("ace/mode/elixir",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/elixir_highlight_rules","ace/mode/folding/coffee"],function(t,r,d){var a=t("../lib/oop"),p=t("./text").Mode,s=t("./elixir_highlight_rules").ElixirHighlightRules,g=t("./folding/coffee").FoldMode,e=function(){this.HighlightRules=s,this.foldingRules=new g,this.$behaviour=this.$defaultBehaviour};a.inherits(e,p),(function(){this.lineCommentStart="#",this.$id="ace/mode/elixir"}).call(e.prototype),r.Mode=e}),function(){ace.require(["ace/mode/elixir"],function(t){x.exports=t})}()}(k)),k.exports}var v=q();const E=T(v),M=w({__proto__:null,default:E},[v]);export{M as m};
