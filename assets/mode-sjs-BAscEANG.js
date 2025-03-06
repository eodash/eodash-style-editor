import{g as F}from"./index-Cd3ar7B7.js";function C(_,w){for(var u=0;u<w.length;u++){const h=w[u];if(typeof h!="string"&&!Array.isArray(h)){for(const k in h)if(k!=="default"&&!(k in _)){const x=Object.getOwnPropertyDescriptor(h,k);x&&Object.defineProperty(_,k,x.get?x:{enumerable:!0,get:()=>h[k]})}}}return Object.freeze(Object.defineProperty(_,Symbol.toStringTag,{value:"Module"}))}var R={exports:{}},S;function M(){return S||(S=1,function(_,w){ace.define("ace/mode/jsdoc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(u,h,k){var x=u("../lib/oop"),p=u("./text_highlight_rules").TextHighlightRules,d=function(){this.$rules={start:[{token:["comment.doc.tag","comment.doc.text","lparen.doc"],regex:"(@(?:param|member|typedef|property|namespace|var|const|callback))(\\s*)({)",push:[{token:"lparen.doc",regex:"{",push:[{include:"doc-syntax"},{token:"rparen.doc",regex:"}|(?=$)",next:"pop"}]},{token:["rparen.doc","text.doc","variable.parameter.doc","lparen.doc","variable.parameter.doc","rparen.doc"],regex:/(})(\s*)(?:([\w=:\/\.]+)|(?:(\[)([\w=:\/\.\-\'\" ]+)(\])))/,next:"pop"},{token:"rparen.doc",regex:"}|(?=$)",next:"pop"},{include:"doc-syntax"},{defaultToken:"text.doc"}]},{token:["comment.doc.tag","text.doc","lparen.doc"],regex:"(@(?:returns?|yields|type|this|suppress|public|protected|private|package|modifies|implements|external|exception|throws|enum|define|extends))(\\s*)({)",push:[{token:"lparen.doc",regex:"{",push:[{include:"doc-syntax"},{token:"rparen.doc",regex:"}|(?=$)",next:"pop"}]},{token:"rparen.doc",regex:"}|(?=$)",next:"pop"},{include:"doc-syntax"},{defaultToken:"text.doc"}]},{token:["comment.doc.tag","text.doc","variable.parameter.doc"],regex:'(@(?:alias|memberof|instance|module|name|lends|namespace|external|this|template|requires|param|implements|function|extends|typedef|mixes|constructor|var|memberof\\!|event|listens|exports|class|constructs|interface|emits|fires|throws|const|callback|borrows|augments))(\\s+)(\\w[\\w#.:/~"\\-]*)?'},{token:["comment.doc.tag","text.doc","variable.parameter.doc"],regex:"(@method)(\\s+)(\\w[\\w.\\(\\)]*)"},{token:"comment.doc.tag",regex:"@access\\s+(?:private|public|protected)"},{token:"comment.doc.tag",regex:"@kind\\s+(?:class|constant|event|external|file|function|member|mixin|module|namespace|typedef)"},{token:"comment.doc.tag",regex:"@\\w+(?=\\s|$)"},d.getTagRule(),{defaultToken:"comment.doc.body",caseInsensitive:!0}],"doc-syntax":[{token:"operator.doc",regex:/[|:]/},{token:"paren.doc",regex:/[\[\]]/}]},this.normalizeRules()};x.inherits(d,p),d.getTagRule=function(l){return{token:"comment.doc.tag.storage.type",regex:"\\b(?:TODO|FIXME|XXX|HACK)\\b"}},d.getStartRule=function(l){return{token:"comment.doc",regex:/\/\*\*(?!\/)/,next:l}},d.getEndRule=function(l){return{token:"comment.doc",regex:"\\*\\/",next:l}},h.JsDocCommentHighlightRules=d}),ace.define("ace/mode/javascript_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/jsdoc_comment_highlight_rules","ace/mode/text_highlight_rules"],function(u,h,k){var x=u("../lib/oop"),p=u("./jsdoc_comment_highlight_rules").JsDocCommentHighlightRules,d=u("./text_highlight_rules").TextHighlightRules,l="[a-zA-Z\\$_¡-￿][a-zA-Z\\d\\$_¡-￿]*",c=function(o){var n={"variable.language":"Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|Symbol|Namespace|QName|XML|XMLList|ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt|JSON|Math|this|arguments|prototype|window|document",keyword:"const|yield|import|get|set|async|await|break|case|catch|continue|default|delete|do|else|finally|for|if|in|of|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|debugger|__parent__|__count__|escape|unescape|with|__proto__|class|enum|extends|super|export|implements|private|public|interface|package|protected|static|constructor","storage.type":"const|let|var|function","constant.language":"null|Infinity|NaN|undefined","support.function":"alert","constant.language.boolean":"true|false"},r=this.createKeywordMapper(n,"identifier"),t="case|do|else|finally|in|instanceof|return|throw|try|typeof|yield|void",e="\\\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|u{[0-9a-fA-F]{1,6}}|[0-2][0-7]{0,2}|3[0-7][0-7]?|[4-7][0-7]?|.)",a="(function)(\\s*)(\\*?)",s={token:["identifier","text","paren.lparen"],regex:"(\\b(?!"+Object.values(n).join("|")+"\\b)"+l+")(\\s*)(\\()"};this.$rules={no_regex:[p.getStartRule("doc-start"),i("no_regex"),s,{token:"string",regex:"'(?=.)",next:"qstring"},{token:"string",regex:'"(?=.)',next:"qqstring"},{token:"constant.numeric",regex:/0(?:[xX][0-9a-fA-F]+|[oO][0-7]+|[bB][01]+)\b/},{token:"constant.numeric",regex:/(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?/},{token:["entity.name.function","text","keyword.operator","text","storage.type","text","storage.type","text","paren.lparen"],regex:"("+l+")(\\s*)(=)(\\s*)"+a+"(\\s*)(\\()",next:"function_arguments"},{token:["storage.type","text","storage.type","text","text","entity.name.function","text","paren.lparen"],regex:"(function)(?:(?:(\\s*)(\\*)(\\s*))|(\\s+))("+l+")(\\s*)(\\()",next:"function_arguments"},{token:["entity.name.function","text","punctuation.operator","text","storage.type","text","storage.type","text","paren.lparen"],regex:"("+l+")(\\s*)(:)(\\s*)"+a+"(\\s*)(\\()",next:"function_arguments"},{token:["text","text","storage.type","text","storage.type","text","paren.lparen"],regex:"(:)(\\s*)"+a+"(\\s*)(\\()",next:"function_arguments"},{token:"keyword",regex:`from(?=\\s*('|"))`},{token:"keyword",regex:"(?:"+t+")\\b",next:"start"},{token:"support.constant",regex:/that\b/},{token:["storage.type","punctuation.operator","support.function.firebug"],regex:/(console)(\.)(warn|info|log|error|debug|time|trace|timeEnd|assert)\b/},{token:r,regex:l},{token:"punctuation.operator",regex:/[.](?![.])/,next:"property"},{token:"storage.type",regex:/=>/,next:"start"},{token:"keyword.operator",regex:/--|\+\+|\.{3}|===|==|=|!=|!==|<+=?|>+=?|!|&&|\|\||\?:|[!$%&*+\-~\/^]=?/,next:"start"},{token:"punctuation.operator",regex:/[?:,;.]/,next:"start"},{token:"paren.lparen",regex:/[\[({]/,next:"start"},{token:"paren.rparen",regex:/[\])}]/},{token:"comment",regex:/^#!.*$/}],property:[{token:"text",regex:"\\s+"},{token:"keyword.operator",regex:/=/},{token:["storage.type","text","storage.type","text","paren.lparen"],regex:a+"(\\s*)(\\()",next:"function_arguments"},{token:["storage.type","text","storage.type","text","text","entity.name.function","text","paren.lparen"],regex:"(function)(?:(?:(\\s*)(\\*)(\\s*))|(\\s+))(\\w+)(\\s*)(\\()",next:"function_arguments"},{token:"punctuation.operator",regex:/[.](?![.])/},{token:"support.function",regex:"prototype"},{token:"support.function",regex:/(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:op|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|lter|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward|rEach)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\b(?=\()/},{token:"support.function.dom",regex:/(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName|ClassName)|ById)|Attribute(?:Node)?)|blur)\b(?=\()/},{token:"support.constant",regex:/(s(?:ystemLanguage|cr(?:ipts|ollbars|een(?:X|Y|Top|Left))|t(?:yle(?:Sheets)?|atus(?:Text|bar)?)|ibling(?:Below|Above)|ource|uffixes|e(?:curity(?:Policy)?|l(?:ection|f)))|h(?:istory|ost(?:name)?|as(?:h|Focus))|y|X(?:MLDocument|SLDocument)|n(?:ext|ame(?:space(?:s|URI)|Prop))|M(?:IN_VALUE|AX_VALUE)|c(?:haracterSet|o(?:n(?:structor|trollers)|okieEnabled|lorDepth|mp(?:onents|lete))|urrent|puClass|l(?:i(?:p(?:boardData)?|entInformation)|osed|asses)|alle(?:e|r)|rypto)|t(?:o(?:olbar|p)|ext(?:Transform|Indent|Decoration|Align)|ags)|SQRT(?:1_2|2)|i(?:n(?:ner(?:Height|Width)|put)|ds|gnoreCase)|zIndex|o(?:scpu|n(?:readystatechange|Line)|uter(?:Height|Width)|p(?:sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(?:i(?:splay|alog(?:Height|Top|Width|Left|Arguments)|rectories)|e(?:scription|fault(?:Status|Ch(?:ecked|arset)|View)))|u(?:ser(?:Profile|Language|Agent)|n(?:iqueID|defined)|pdateInterval)|_content|p(?:ixelDepth|ort|ersonalbar|kcs11|l(?:ugins|atform)|a(?:thname|dding(?:Right|Bottom|Top|Left)|rent(?:Window|Layer)?|ge(?:X(?:Offset)?|Y(?:Offset)?))|r(?:o(?:to(?:col|type)|duct(?:Sub)?|mpter)|e(?:vious|fix)))|e(?:n(?:coding|abledPlugin)|x(?:ternal|pando)|mbeds)|v(?:isibility|endor(?:Sub)?|Linkcolor)|URLUnencoded|P(?:I|OSITIVE_INFINITY)|f(?:ilename|o(?:nt(?:Size|Family|Weight)|rmName)|rame(?:s|Element)|gColor)|E|whiteSpace|l(?:i(?:stStyleType|n(?:eHeight|kColor))|o(?:ca(?:tion(?:bar)?|lName)|wsrc)|e(?:ngth|ft(?:Context)?)|a(?:st(?:M(?:odified|atch)|Index|Paren)|yer(?:s|X)|nguage))|a(?:pp(?:MinorVersion|Name|Co(?:deName|re)|Version)|vail(?:Height|Top|Width|Left)|ll|r(?:ity|guments)|Linkcolor|bove)|r(?:ight(?:Context)?|e(?:sponse(?:XML|Text)|adyState))|global|x|m(?:imeTypes|ultiline|enubar|argin(?:Right|Bottom|Top|Left))|L(?:N(?:10|2)|OG(?:10E|2E))|b(?:o(?:ttom|rder(?:Width|RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(?:Color|Image)))\b/},{token:"identifier",regex:l},{regex:"",token:"empty",next:"no_regex"}],start:[p.getStartRule("doc-start"),i("start"),{token:"string.regexp",regex:"\\/",next:"regex"},{token:"text",regex:"\\s+|^$",next:"start"},{token:"empty",regex:"",next:"no_regex"}],regex:[{token:"regexp.keyword.operator",regex:"\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"},{token:"string.regexp",regex:"/[sxngimy]*",next:"no_regex"},{token:"invalid",regex:/\{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/},{token:"constant.language.escape",regex:/\(\?[:=!]|\)|\{\d+\b,?\d*\}|[+*]\?|[()$^+*?.]/},{token:"constant.language.delimiter",regex:/\|/},{token:"constant.language.escape",regex:/\[\^?/,next:"regex_character_class"},{token:"empty",regex:"$",next:"no_regex"},{defaultToken:"string.regexp"}],regex_character_class:[{token:"regexp.charclass.keyword.operator",regex:"\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"},{token:"constant.language.escape",regex:"]",next:"regex"},{token:"constant.language.escape",regex:"-"},{token:"empty",regex:"$",next:"no_regex"},{defaultToken:"string.regexp.charachterclass"}],default_parameter:[{token:"string",regex:"'(?=.)",push:[{token:"string",regex:"'|$",next:"pop"},{include:"qstring"}]},{token:"string",regex:'"(?=.)',push:[{token:"string",regex:'"|$',next:"pop"},{include:"qqstring"}]},{token:"constant.language",regex:"null|Infinity|NaN|undefined"},{token:"constant.numeric",regex:/0(?:[xX][0-9a-fA-F]+|[oO][0-7]+|[bB][01]+)\b/},{token:"constant.numeric",regex:/(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?/},{token:"punctuation.operator",regex:",",next:"function_arguments"},{token:"text",regex:"\\s+"},{token:"punctuation.operator",regex:"$"},{token:"empty",regex:"",next:"no_regex"}],function_arguments:[i("function_arguments"),{token:"variable.parameter",regex:l},{token:"punctuation.operator",regex:","},{token:"text",regex:"\\s+"},{token:"punctuation.operator",regex:"$"},{token:"empty",regex:"",next:"no_regex"}],qqstring:[{token:"constant.language.escape",regex:e},{token:"string",regex:"\\\\$",consumeLineEnd:!0},{token:"string",regex:'"|$',next:"no_regex"},{defaultToken:"string"}],qstring:[{token:"constant.language.escape",regex:e},{token:"string",regex:"\\\\$",consumeLineEnd:!0},{token:"string",regex:"'|$",next:"no_regex"},{defaultToken:"string"}]},(!o||!o.noES6)&&(this.$rules.no_regex.unshift({regex:"[{}]",onMatch:function(f,v,m){if(this.next=f=="{"?this.nextState:"",f=="{"&&m.length)m.unshift("start",v);else if(f=="}"&&m.length&&(m.shift(),this.next=m.shift(),this.next.indexOf("string")!=-1||this.next.indexOf("jsx")!=-1))return"paren.quasi.end";return f=="{"?"paren.lparen":"paren.rparen"},nextState:"start"},{token:"string.quasi.start",regex:/`/,push:[{token:"constant.language.escape",regex:e},{token:"paren.quasi.start",regex:/\${/,push:"start"},{token:"string.quasi.end",regex:/`/,next:"pop"},{defaultToken:"string.quasi"}]},{token:["variable.parameter","text"],regex:"("+l+")(\\s*)(?=\\=>)"},{token:"paren.lparen",regex:"(\\()(?=[^\\(]+\\s*=>)",next:"function_arguments"},{token:"variable.language",regex:"(?:(?:(?:Weak)?(?:Set|Map))|Promise)\\b"}),this.$rules.function_arguments.unshift({token:"keyword.operator",regex:"=",next:"default_parameter"},{token:"keyword.operator",regex:"\\.{3}"}),this.$rules.property.unshift({token:"support.function",regex:"(findIndex|repeat|startsWith|endsWith|includes|isSafeInteger|trunc|cbrt|log2|log10|sign|then|catch|finally|resolve|reject|race|any|all|allSettled|keys|entries|isInteger)\\b(?=\\()"},{token:"constant.language",regex:"(?:MAX_SAFE_INTEGER|MIN_SAFE_INTEGER|EPSILON)\\b"}),(!o||o.jsx!=!1)&&g.call(this)),this.embedRules(p,"doc-",[p.getEndRule("no_regex")]),this.normalizeRules()};x.inherits(c,d);function g(){var o=l.replace("\\d","\\d\\-"),n={onMatch:function(t,e,a){var s=t.charAt(1)=="/"?2:1;return s==1?(e!=this.nextState?a.unshift(this.next,this.nextState,0):a.unshift(this.next),a[2]++):s==2&&e==this.nextState&&(a[1]--,(!a[1]||a[1]<0)&&(a.shift(),a.shift())),[{type:"meta.tag.punctuation."+(s==1?"":"end-")+"tag-open.xml",value:t.slice(0,s)},{type:"meta.tag.tag-name.xml",value:t.substr(s)}]},regex:"</?(?:"+o+"|(?=>))",next:"jsxAttributes",nextState:"jsx"};this.$rules.start.unshift(n);var r={regex:"{",token:"paren.quasi.start",push:"start"};this.$rules.jsx=[r,n,{include:"reference"},{defaultToken:"string.xml"}],this.$rules.jsxAttributes=[{token:"meta.tag.punctuation.tag-close.xml",regex:"/?>",onMatch:function(t,e,a){return e==a[0]&&a.shift(),t.length==2&&(a[0]==this.nextState&&a[1]--,(!a[1]||a[1]<0)&&a.splice(0,2)),this.next=a[0]||"start",[{type:this.token,value:t}]},nextState:"jsx"},r,i("jsxAttributes"),{token:"entity.other.attribute-name.xml",regex:o},{token:"keyword.operator.attribute-equals.xml",regex:"="},{token:"text.tag-whitespace.xml",regex:"\\s+"},{token:"string.attribute-value.xml",regex:"'",stateName:"jsx_attr_q",push:[{token:"string.attribute-value.xml",regex:"'",next:"pop"},{include:"reference"},{defaultToken:"string.attribute-value.xml"}]},{token:"string.attribute-value.xml",regex:'"',stateName:"jsx_attr_qq",push:[{token:"string.attribute-value.xml",regex:'"',next:"pop"},{include:"reference"},{defaultToken:"string.attribute-value.xml"}]},n],this.$rules.reference=[{token:"constant.language.escape.reference.xml",regex:"(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"}]}function i(o){return[{token:"comment",regex:/\/\*/,next:[p.getTagRule(),{token:"comment",regex:"\\*\\/",next:o||"pop"},{defaultToken:"comment",caseInsensitive:!0}]},{token:"comment",regex:"\\/\\/",next:[p.getTagRule(),{token:"comment",regex:"$|^",next:o||"pop"},{defaultToken:"comment",caseInsensitive:!0}]}]}h.JavaScriptHighlightRules=c}),ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(u,h,k){var x=u("../range").Range,p=function(){};(function(){this.checkOutdent=function(d,l){return/^\s+$/.test(d)?/^\s*\}/.test(l):!1},this.autoOutdent=function(d,l){var c=d.getLine(l),g=c.match(/^(\s*\})/);if(!g)return 0;var i=g[1].length,o=d.findMatchingBracket({row:l,column:i});if(!o||o.row==l)return 0;var n=this.$getIndent(d.getLine(o.row));d.replace(new x(l,0,l,i-1),n)},this.$getIndent=function(d){return d.match(/^\s*/)[0]}}).call(p.prototype),h.MatchingBraceOutdent=p}),ace.define("ace/mode/behaviour/xml",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/token_iterator"],function(u,h,k){var x=u("../../lib/oop"),p=u("../behaviour").Behaviour,d=u("../../token_iterator").TokenIterator;function l(g,i){return g&&g.type.lastIndexOf(i+".xml")>-1}var c=function(){this.add("string_dquotes","insertion",function(g,i,o,n,r){if(r=='"'||r=="'"){var t=r,e=n.doc.getTextRange(o.getSelectionRange());if(e!==""&&e!=="'"&&e!='"'&&o.getWrapBehavioursEnabled())return{text:t+e+t,selection:!1};var a=o.getCursorPosition(),s=n.doc.getLine(a.row),f=s.substring(a.column,a.column+1),v=new d(n,a.row,a.column),m=v.getCurrentToken();if(f==t&&(l(m,"attribute-value")||l(m,"string")))return{text:"",selection:[1,1]};if(m||(m=v.stepBackward()),!m)return;for(;l(m,"tag-whitespace")||l(m,"whitespace");)m=v.stepBackward();var b=!f||f.match(/\s/);if(l(m,"attribute-equals")&&(b||f==">")||l(m,"decl-attribute-equals")&&(b||f=="?"))return{text:t+t,selection:[1,1]}}}),this.add("string_dquotes","deletion",function(g,i,o,n,r){var t=n.doc.getTextRange(r);if(!r.isMultiLine()&&(t=='"'||t=="'")){var e=n.doc.getLine(r.start.row),a=e.substring(r.start.column+1,r.start.column+2);if(a==t)return r.end.column++,r}}),this.add("autoclosing","insertion",function(g,i,o,n,r){if(r==">"){var t=o.getSelectionRange().start,e=new d(n,t.row,t.column),a=e.getCurrentToken()||e.stepBackward();if(!a||!(l(a,"tag-name")||l(a,"tag-whitespace")||l(a,"attribute-name")||l(a,"attribute-equals")||l(a,"attribute-value"))||l(a,"reference.attribute-value"))return;if(l(a,"attribute-value")){var s=e.getCurrentTokenColumn()+a.value.length;if(t.column<s)return;if(t.column==s){var f=e.stepForward();if(f&&l(f,"attribute-value"))return;e.stepBackward()}}if(/^\s*>/.test(n.getLine(t.row).slice(t.column)))return;for(;!l(a,"tag-name");)if(a=e.stepBackward(),a.value=="<"){a=e.stepForward();break}var v=e.getCurrentTokenRow(),m=e.getCurrentTokenColumn();if(l(e.stepBackward(),"end-tag-open"))return;var b=a.value;return v==t.row&&(b=b.substring(0,t.column-m)),this.voidElements&&this.voidElements.hasOwnProperty(b.toLowerCase())?void 0:{text:"></"+b+">",selection:[1,1]}}}),this.add("autoindent","insertion",function(g,i,o,n,r){if(r==`
`){var t=o.getCursorPosition(),e=n.getLine(t.row),a=new d(n,t.row,t.column),s=a.getCurrentToken();if(l(s,"")&&s.type.indexOf("tag-close")!==-1){if(s.value=="/>")return;for(;s&&s.type.indexOf("tag-name")===-1;)s=a.stepBackward();if(!s)return;var f=s.value,v=a.getCurrentTokenRow();if(s=a.stepBackward(),!s||s.type.indexOf("end-tag")!==-1)return;if(this.voidElements&&!this.voidElements[f]||!this.voidElements){var m=n.getTokenAt(t.row,t.column+1),e=n.getLine(v),b=this.$getIndent(e),y=b+n.getTabString();return m&&m.value==="</"?{text:`
`+y+`
`+b,selection:[1,y.length,1,y.length]}:{text:`
`+y}}}}})};x.inherits(c,p),h.XmlBehaviour=c}),ace.define("ace/mode/behaviour/javascript",["require","exports","module","ace/lib/oop","ace/token_iterator","ace/mode/behaviour/cstyle","ace/mode/behaviour/xml"],function(u,h,k){var x=u("../../lib/oop"),p=u("../../token_iterator").TokenIterator,d=u("../behaviour/cstyle").CstyleBehaviour,l=u("../behaviour/xml").XmlBehaviour,c=function(){var g=new l({closeCurlyBraces:!0}).getBehaviours();this.addBehaviours(g),this.inherit(d),this.add("autoclosing-fragment","insertion",function(i,o,n,r,t){if(t==">"){var e=n.getSelectionRange().start,a=new p(r,e.row,e.column),s=a.getCurrentToken()||a.stepBackward();if(!s)return;if(s.value=="<")return{text:"></>",selection:[1,1]}}})};x.inherits(c,d),h.JavaScriptBehaviour=c}),ace.define("ace/mode/folding/xml",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(u,h,k){var x=u("../../lib/oop"),p=u("../../range").Range,d=u("./fold_mode").FoldMode,l=h.FoldMode=function(i,o){d.call(this),this.voidElements=i||{},this.optionalEndTags=x.mixin({},this.voidElements),o&&x.mixin(this.optionalEndTags,o)};x.inherits(l,d);var c=function(){this.tagName="",this.closing=!1,this.selfClosing=!1,this.start={row:0,column:0},this.end={row:0,column:0}};function g(i,o){return i.type.lastIndexOf(o+".xml")>-1}(function(){this.getFoldWidget=function(i,o,n){var r=this._getFirstTagInLine(i,n);return r?r.closing||!r.tagName&&r.selfClosing?o==="markbeginend"?"end":"":!r.tagName||r.selfClosing||this.voidElements.hasOwnProperty(r.tagName.toLowerCase())||this._findEndTagInLine(i,n,r.tagName,r.end.column)?"":"start":this.getCommentFoldWidget(i,n)},this.getCommentFoldWidget=function(i,o){return/comment/.test(i.getState(o))&&/<!-/.test(i.getLine(o))?"start":""},this._getFirstTagInLine=function(i,o){for(var n=i.getTokens(o),r=new c,t=0;t<n.length;t++){var e=n[t];if(g(e,"tag-open")){if(r.end.column=r.start.column+e.value.length,r.closing=g(e,"end-tag-open"),e=n[++t],!e)return null;if(r.tagName=e.value,e.value===""){if(e=n[++t],!e)return null;r.tagName=e.value}for(r.end.column+=e.value.length,t++;t<n.length;t++)if(e=n[t],r.end.column+=e.value.length,g(e,"tag-close")){r.selfClosing=e.value=="/>";break}return r}else if(g(e,"tag-close"))return r.selfClosing=e.value=="/>",r;r.start.column+=e.value.length}return null},this._findEndTagInLine=function(i,o,n,r){for(var t=i.getTokens(o),e=0,a=0;a<t.length;a++){var s=t[a];if(e+=s.value.length,!(e<r-1)&&g(s,"end-tag-open")&&(s=t[a+1],g(s,"tag-name")&&s.value===""&&(s=t[a+2]),s&&s.value==n))return!0}return!1},this.getFoldWidgetRange=function(i,o,n){var r=this._getFirstTagInLine(i,n);if(!r)return this.getCommentFoldWidget(i,n)&&i.getCommentFoldRange(n,i.getLine(n).length);var t=i.getMatchingTags({row:n,column:0});if(t)return new p(t.openTag.end.row,t.openTag.end.column,t.closeTag.start.row,t.closeTag.start.column)}}).call(l.prototype)}),ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(u,h,k){var x=u("../../lib/oop"),p=u("../../range").Range,d=u("./fold_mode").FoldMode,l=h.FoldMode=function(c){c&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+c.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+c.end)))};x.inherits(l,d),(function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(c,g,i){var o=c.getLine(i);if(this.singleLineBlockCommentRe.test(o)&&!this.startRegionRe.test(o)&&!this.tripleStarBlockCommentRe.test(o))return"";var n=this._getFoldWidgetBase(c,g,i);return!n&&this.startRegionRe.test(o)?"start":n},this.getFoldWidgetRange=function(c,g,i,o){var n=c.getLine(i);if(this.startRegionRe.test(n))return this.getCommentRegionBlock(c,n,i);var e=n.match(this.foldingStartMarker);if(e){var r=e.index;if(e[1])return this.openingBracketBlock(c,e[1],i,r);var t=c.getCommentFoldRange(i,r+e[0].length,1);return t&&!t.isMultiLine()&&(o?t=this.getSectionRange(c,i):g!="all"&&(t=null)),t}if(g!=="markbegin"){var e=n.match(this.foldingStopMarker);if(e){var r=e.index+e[0].length;return e[1]?this.closingBracketBlock(c,e[1],i,r):c.getCommentFoldRange(i,r,-1)}}},this.getSectionRange=function(c,g){var i=c.getLine(g),o=i.search(/\S/),n=g,r=i.length;g=g+1;for(var t=g,e=c.getLength();++g<e;){i=c.getLine(g);var a=i.search(/\S/);if(a!==-1){if(o>a)break;var s=this.getFoldWidgetRange(c,"all",g);if(s){if(s.start.row<=n)break;if(s.isMultiLine())g=s.end.row;else if(o==a)break}t=g}}return new p(n,r,t,c.getLine(t).length)},this.getCommentRegionBlock=function(c,g,i){for(var o=g.search(/\s*$/),n=c.getLength(),r=i,t=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,e=1;++i<n;){g=c.getLine(i);var a=t.exec(g);if(a&&(a[1]?e--:e++,!e))break}var s=i;if(s>r)return new p(r,o,s,g.length)}}).call(l.prototype)}),ace.define("ace/mode/folding/javascript",["require","exports","module","ace/lib/oop","ace/mode/folding/xml","ace/mode/folding/cstyle"],function(u,h,k){var x=u("../../lib/oop"),p=u("./xml").FoldMode,d=u("./cstyle").FoldMode,l=h.FoldMode=function(c){c&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+c.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+c.end))),this.xmlFoldMode=new p};x.inherits(l,d),(function(){this.getFoldWidgetRangeBase=this.getFoldWidgetRange,this.getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(c,g,i){var o=this.getFoldWidgetBase(c,g,i);return o||this.xmlFoldMode.getFoldWidget(c,g,i)},this.getFoldWidgetRange=function(c,g,i,o){var n=this.getFoldWidgetRangeBase(c,g,i,o);return n||this.xmlFoldMode.getFoldWidgetRange(c,g,i)}}).call(l.prototype)}),ace.define("ace/mode/javascript",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/javascript_highlight_rules","ace/mode/matching_brace_outdent","ace/worker/worker_client","ace/mode/behaviour/javascript","ace/mode/folding/javascript"],function(u,h,k){var x=u("../lib/oop"),p=u("./text").Mode,d=u("./javascript_highlight_rules").JavaScriptHighlightRules,l=u("./matching_brace_outdent").MatchingBraceOutdent,c=u("../worker/worker_client").WorkerClient,g=u("./behaviour/javascript").JavaScriptBehaviour,i=u("./folding/javascript").FoldMode,o=function(){this.HighlightRules=d,this.$outdent=new l,this.$behaviour=new g,this.foldingRules=new i};x.inherits(o,p),(function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$quotes={'"':'"',"'":"'","`":"`"},this.$pairQuotesAfter={"`":/\w/},this.getNextLineIndent=function(n,r,t){var e=this.$getIndent(r),a=this.getTokenizer().getLineTokens(r,n),s=a.tokens,f=a.state;if(s.length&&s[s.length-1].type=="comment")return e;if(n=="start"||n=="no_regex"){var v=r.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/);v&&(e+=t)}else if(n=="doc-start"&&(f=="start"||f=="no_regex"))return"";return e},this.checkOutdent=function(n,r,t){return this.$outdent.checkOutdent(r,t)},this.autoOutdent=function(n,r,t){this.$outdent.autoOutdent(r,t)},this.createWorker=function(n){var r=new c(["ace"],"ace/mode/javascript_worker","JavaScriptWorker");return r.attachToDocument(n.getDocument()),r.on("annotate",function(t){n.setAnnotations(t.data)}),r.on("terminate",function(){n.clearAnnotations()}),r},this.$id="ace/mode/javascript",this.snippetFileId="ace/snippets/javascript"}).call(o.prototype),h.Mode=o}),ace.define("ace/mode/sjs_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/javascript_highlight_rules","ace/mode/text_highlight_rules"],function(u,h,k){var x=u("../lib/oop"),p=u("./javascript_highlight_rules").JavaScriptHighlightRules,d=u("./text_highlight_rules").TextHighlightRules,l=function(){var c=new p({noES6:!0}),g="\\\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|[0-2][0-7]{0,2}|3[0-6][0-7]?|37[0-7]?|[4-7][0-7]?|.)",i=function(s){return s.isContextAware=!0,s},o=function(s){return{token:s.token,regex:s.regex,next:i(function(f,v){return v.length===0&&v.unshift(f),v.unshift(s.next),s.next})}},n=function(s){return{token:s.token,regex:s.regex,next:i(function(f,v){return v.shift(),v[0]||"start"})}};this.$rules=c.$rules,this.$rules.no_regex=[{token:"keyword",regex:"(waitfor|or|and|collapse|spawn|retract)\\b"},{token:"keyword.operator",regex:"(->|=>|\\.\\.)"},{token:"variable.language",regex:"(hold|default)\\b"},o({token:"string",regex:"`",next:"bstring"}),o({token:"string",regex:'"',next:"qqstring"}),o({token:"string",regex:'"',next:"qqstring"}),{token:["paren.lparen","text","paren.rparen"],regex:"(\\{)(\\s*)(\\|)",next:"block_arguments"}].concat(this.$rules.no_regex),this.$rules.block_arguments=[{token:"paren.rparen",regex:"\\|",next:"no_regex"}].concat(this.$rules.function_arguments),this.$rules.bstring=[{token:"constant.language.escape",regex:g},{token:"string",regex:"\\\\$",next:"bstring"},o({token:"paren.lparen",regex:"\\$\\{",next:"string_interp"}),o({token:"paren.lparen",regex:"\\$",next:"bstring_interp_single"}),n({token:"string",regex:"`"}),{defaultToken:"string"}],this.$rules.qqstring=[{token:"constant.language.escape",regex:g},{token:"string",regex:"\\\\$",next:"qqstring"},o({token:"paren.lparen",regex:"#\\{",next:"string_interp"}),n({token:"string",regex:'"'}),{defaultToken:"string"}];for(var r=[],t=0;t<this.$rules.no_regex.length;t++){var e=this.$rules.no_regex[t],a=String(e.token);a.indexOf("paren")==-1&&(!e.next||e.next.isContextAware)&&r.push(e)}this.$rules.string_interp=[n({token:"paren.rparen",regex:"\\}"}),o({token:"paren.lparen",regex:"{",next:"string_interp"})].concat(r),this.$rules.bstring_interp_single=[{token:["identifier","paren.lparen"],regex:"(\\w+)(\\()",next:"bstring_interp_single_call"},n({token:"identifier",regex:"\\w*"})],this.$rules.bstring_interp_single_call=[o({token:"paren.lparen",regex:"\\(",next:"bstring_interp_single_call"}),n({token:"paren.rparen",regex:"\\)"})].concat(r)};x.inherits(l,d),h.SJSHighlightRules=l}),ace.define("ace/mode/sjs",["require","exports","module","ace/lib/oop","ace/mode/javascript","ace/mode/sjs_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/folding/cstyle"],function(u,h,k){var x=u("../lib/oop"),p=u("./javascript").Mode,d=u("./sjs_highlight_rules").SJSHighlightRules,l=u("./matching_brace_outdent").MatchingBraceOutdent,c=u("./folding/cstyle").FoldMode,g=function(){this.HighlightRules=d,this.$outdent=new l,this.$behaviour=this.$defaultBehaviour,this.foldingRules=new c};x.inherits(g,p),(function(){this.createWorker=function(i){return null},this.$id="ace/mode/sjs"}).call(g.prototype),h.Mode=g}),function(){ace.require(["ace/mode/sjs"],function(u){_.exports=u})}()}(R)),R.exports}var T=M();const $=F(T),B=C({__proto__:null,default:$},[T]);export{B as m};
