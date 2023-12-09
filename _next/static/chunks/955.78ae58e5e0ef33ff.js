"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[955],{1955:function(t,e,i){i.d(e,{diagram:function(){return p}});var s=i(1687),n=i(1432);i(7693),i(7608),i(1699);var r=function(){var t=function(t,e,i,s){for(i=i||{},s=t.length;s--;i[t[s]]=e);return i},e=[1,4],i=[1,5],s=[1,6],n=[1,7],r=[1,9],l=[1,11,13,15,17,19,20,26,27,28,29],a=[2,5],c=[1,6,11,13,15,17,19,20,26,27,28,29],o=[26,27,28],h=[2,8],u=[1,18],y=[1,19],p=[1,20],d=[1,21],_=[1,22],g=[1,23],f=[1,28],m=[6,26,27,28,29],v={trace:function(){},yy:{},symbols_:{error:2,start:3,eol:4,directive:5,PIE:6,document:7,showData:8,line:9,statement:10,txt:11,value:12,title:13,title_value:14,acc_title:15,acc_title_value:16,acc_descr:17,acc_descr_value:18,acc_descr_multiline_value:19,section:20,openDirective:21,typeDirective:22,closeDirective:23,":":24,argDirective:25,NEWLINE:26,";":27,EOF:28,open_directive:29,type_directive:30,arg_directive:31,close_directive:32,$accept:0,$end:1},terminals_:{2:"error",6:"PIE",8:"showData",11:"txt",12:"value",13:"title",14:"title_value",15:"acc_title",16:"acc_title_value",17:"acc_descr",18:"acc_descr_value",19:"acc_descr_multiline_value",20:"section",24:":",26:"NEWLINE",27:";",28:"EOF",29:"open_directive",30:"type_directive",31:"arg_directive",32:"close_directive"},productions_:[0,[3,2],[3,2],[3,2],[3,3],[7,0],[7,2],[9,2],[10,0],[10,2],[10,2],[10,2],[10,2],[10,1],[10,1],[10,1],[5,3],[5,5],[4,1],[4,1],[4,1],[21,1],[22,1],[25,1],[23,1]],performAction:function(t,e,i,s,n,r,l){var a=r.length-1;switch(n){case 4:s.setShowData(!0);break;case 7:this.$=r[a-1];break;case 9:s.addSection(r[a-1],s.cleanupValue(r[a]));break;case 10:this.$=r[a].trim(),s.setDiagramTitle(this.$);break;case 11:this.$=r[a].trim(),s.setAccTitle(this.$);break;case 12:case 13:this.$=r[a].trim(),s.setAccDescription(this.$);break;case 14:s.addSection(r[a].substr(8)),this.$=r[a].substr(8);break;case 21:s.parseDirective("%%{","open_directive");break;case 22:s.parseDirective(r[a],"type_directive");break;case 23:r[a]=r[a].trim().replace(/'/g,'"'),s.parseDirective(r[a],"arg_directive");break;case 24:s.parseDirective("}%%","close_directive","pie")}},table:[{3:1,4:2,5:3,6:e,21:8,26:i,27:s,28:n,29:r},{1:[3]},{3:10,4:2,5:3,6:e,21:8,26:i,27:s,28:n,29:r},{3:11,4:2,5:3,6:e,21:8,26:i,27:s,28:n,29:r},t(l,a,{7:12,8:[1,13]}),t(c,[2,18]),t(c,[2,19]),t(c,[2,20]),{22:14,30:[1,15]},{30:[2,21]},{1:[2,1]},{1:[2,2]},t(o,h,{21:8,9:16,10:17,5:24,1:[2,3],11:u,13:y,15:p,17:d,19:_,20:g,29:r}),t(l,a,{7:25}),{23:26,24:[1,27],32:f},t([24,32],[2,22]),t(l,[2,6]),{4:29,26:i,27:s,28:n},{12:[1,30]},{14:[1,31]},{16:[1,32]},{18:[1,33]},t(o,[2,13]),t(o,[2,14]),t(o,[2,15]),t(o,h,{21:8,9:16,10:17,5:24,1:[2,4],11:u,13:y,15:p,17:d,19:_,20:g,29:r}),t(m,[2,16]),{25:34,31:[1,35]},t(m,[2,24]),t(l,[2,7]),t(o,[2,9]),t(o,[2,10]),t(o,[2,11]),t(o,[2,12]),{23:36,32:f},{32:[2,23]},t(m,[2,17])],defaultActions:{9:[2,21],10:[2,1],11:[2,2],35:[2,23]},parseError:function(t,e){if(e.recoverable)this.trace(t);else{var i=Error(t);throw i.hash=e,i}},parse:function(t){var e=this,i=[0],s=[],n=[null],r=[],l=this.table,a="",c=0,o=0,h=r.slice.call(arguments,1),u=Object.create(this.lexer),y={yy:{}};for(var p in this.yy)Object.prototype.hasOwnProperty.call(this.yy,p)&&(y.yy[p]=this.yy[p]);u.setInput(t,y.yy),y.yy.lexer=u,y.yy.parser=this,void 0===u.yylloc&&(u.yylloc={});var d=u.yylloc;r.push(d);var _=u.options&&u.options.ranges;"function"==typeof y.yy.parseError?this.parseError=y.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var g,f,m,v,b,k,x,S,$={};;){if(f=i[i.length-1],this.defaultActions[f]?m=this.defaultActions[f]:(null==g&&(g=function(){var t;return"number"!=typeof(t=s.pop()||u.lex()||1)&&(t instanceof Array&&(t=(s=t).pop()),t=e.symbols_[t]||t),t}()),m=l[f]&&l[f][g]),void 0===m||!m.length||!m[0]){var w="";for(b in S=[],l[f])this.terminals_[b]&&b>2&&S.push("'"+this.terminals_[b]+"'");w=u.showPosition?"Parse error on line "+(c+1)+":\n"+u.showPosition()+"\nExpecting "+S.join(", ")+", got '"+(this.terminals_[g]||g)+"'":"Parse error on line "+(c+1)+": Unexpected "+(1==g?"end of input":"'"+(this.terminals_[g]||g)+"'"),this.parseError(w,{text:u.match,token:this.terminals_[g]||g,line:u.yylineno,loc:d,expected:S})}if(m[0]instanceof Array&&m.length>1)throw Error("Parse Error: multiple actions possible at state: "+f+", token: "+g);switch(m[0]){case 1:i.push(g),n.push(u.yytext),r.push(u.yylloc),i.push(m[1]),g=null,o=u.yyleng,a=u.yytext,c=u.yylineno,d=u.yylloc;break;case 2:if(k=this.productions_[m[1]][1],$.$=n[n.length-k],$._$={first_line:r[r.length-(k||1)].first_line,last_line:r[r.length-1].last_line,first_column:r[r.length-(k||1)].first_column,last_column:r[r.length-1].last_column},_&&($._$.range=[r[r.length-(k||1)].range[0],r[r.length-1].range[1]]),void 0!==(v=this.performAction.apply($,[a,o,c,y.yy,m[1],n,r].concat(h))))return v;k&&(i=i.slice(0,-1*k*2),n=n.slice(0,-1*k),r=r.slice(0,-1*k)),i.push(this.productions_[m[1]][0]),n.push($.$),r.push($._$),x=l[i[i.length-2]][i[i.length-1]],i.push(x);break;case 3:return!0}}return!0}};function b(){this.yy={}}return v.lexer={EOF:1,parseError:function(t,e){if(this.yy.parser)this.yy.parser.parseError(t,e);else throw Error(t)},setInput:function(t,e){return this.yy=e||this.yy||{},this._input=t,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var t=this._input[0];return this.yytext+=t,this.yyleng++,this.offset++,this.match+=t,this.matched+=t,t.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),t},unput:function(t){var e=t.length,i=t.split(/(?:\r\n?|\n)/g);this._input=t+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-e),this.offset-=e;var s=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),i.length-1&&(this.yylineno-=i.length-1);var n=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:i?(i.length===s.length?this.yylloc.first_column:0)+s[s.length-i.length].length-i[0].length:this.yylloc.first_column-e},this.options.ranges&&(this.yylloc.range=[n[0],n[0]+this.yyleng-e]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){return this.options.backtrack_lexer?(this._backtrack=!0,this):this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},less:function(t){this.unput(this.match.slice(t))},pastInput:function(){var t=this.matched.substr(0,this.matched.length-this.match.length);return(t.length>20?"...":"")+t.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var t=this.match;return t.length<20&&(t+=this._input.substr(0,20-t.length)),(t.substr(0,20)+(t.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var t=this.pastInput(),e=Array(t.length+1).join("-");return t+this.upcomingInput()+"\n"+e+"^"},test_match:function(t,e){var i,s,n;if(this.options.backtrack_lexer&&(n={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(n.yylloc.range=this.yylloc.range.slice(0))),(s=t[0].match(/(?:\r\n?|\n).*/g))&&(this.yylineno+=s.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:s?s[s.length-1].length-s[s.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],i=this.performAction.call(this,this.yy,this,e,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),i)return i;if(this._backtrack)for(var r in n)this[r]=n[r];return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0),this._more||(this.yytext="",this.match="");for(var t,e,i,s,n=this._currentRules(),r=0;r<n.length;r++)if((i=this._input.match(this.rules[n[r]]))&&(!e||i[0].length>e[0].length)){if(e=i,s=r,this.options.backtrack_lexer){if(!1!==(t=this.test_match(i,n[r])))return t;if(!this._backtrack)return!1;e=!1;continue}if(!this.options.flex)break}return e?!1!==(t=this.test_match(e,n[s]))&&t:""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){return this.next()||this.lex()},begin:function(t){this.conditionStack.push(t)},popState:function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(t){return(t=this.conditionStack.length-1-Math.abs(t||0))>=0?this.conditionStack[t]:"INITIAL"},pushState:function(t){this.begin(t)},stateStackSize:function(){return this.conditionStack.length},options:{"case-insensitive":!0},performAction:function(t,e,i,s){switch(i){case 0:return this.begin("open_directive"),29;case 1:return this.begin("type_directive"),30;case 2:return this.popState(),this.begin("arg_directive"),24;case 3:return this.popState(),this.popState(),32;case 4:return 31;case 5:case 6:case 8:case 9:break;case 7:return 26;case 10:return this.begin("title"),13;case 11:return this.popState(),"title_value";case 12:return this.begin("acc_title"),15;case 13:return this.popState(),"acc_title_value";case 14:return this.begin("acc_descr"),17;case 15:return this.popState(),"acc_descr_value";case 16:this.begin("acc_descr_multiline");break;case 17:case 20:this.popState();break;case 18:return"acc_descr_multiline_value";case 19:this.begin("string");break;case 21:return"txt";case 22:return 6;case 23:return 8;case 24:return"value";case 25:return 28}},rules:[/^(?:%%\{)/i,/^(?:((?:(?!\}%%)[^:.])*))/i,/^(?::)/i,/^(?:\}%%)/i,/^(?:((?:(?!\}%%).|\n)*))/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n\r]+)/i,/^(?:%%[^\n]*)/i,/^(?:[\s]+)/i,/^(?:title\b)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:pie\b)/i,/^(?:showData\b)/i,/^(?::[\s]*[\d]+(?:\.[\d]+)?)/i,/^(?:$)/i],conditions:{acc_descr_multiline:{rules:[17,18],inclusive:!1},acc_descr:{rules:[15],inclusive:!1},acc_title:{rules:[13],inclusive:!1},close_directive:{rules:[],inclusive:!1},arg_directive:{rules:[3,4],inclusive:!1},type_directive:{rules:[2,3],inclusive:!1},open_directive:{rules:[1],inclusive:!1},title:{rules:[11],inclusive:!1},string:{rules:[20,21],inclusive:!1},INITIAL:{rules:[0,5,6,7,8,9,10,12,14,16,19,22,23,24,25],inclusive:!0}}},b.prototype=v,v.Parser=b,new b}();r.parser=r;let l=s.C.pie,a={sections:{},showData:!1},c=a.sections,o=a.showData,h=structuredClone(l),u={getConfig:()=>structuredClone(h),parseDirective:(t,e,i)=>{(0,s.D)(void 0,t,e,i)},clear:()=>{c=structuredClone(a.sections),o=a.showData,(0,s.v)()},setDiagramTitle:s.r,getDiagramTitle:s.t,setAccTitle:s.s,getAccTitle:s.g,setAccDescription:s.b,getAccDescription:s.a,addSection:(t,e)=>{void 0===c[t=(0,s.d)(t,(0,s.c)())]&&(c[t]=e,s.l.debug(`added new section: ${t}, with value: ${e}`))},getSections:()=>c,cleanupValue:t=>(":"===t.substring(0,1)&&(t=t.substring(1).trim()),Number(t.trim())),setShowData:t=>{o=t},getShowData:()=>o},y=t=>{let e=Object.entries(t).map(t=>({label:t[0],value:t[1]}));return(0,n.ve8)().value(t=>t.value)(e)},p={parser:r,db:u,renderer:{draw:(t,e,i,r)=>{var l,a;s.l.debug("rendering pie chart\n"+t);let c=r.db,o=(0,s.c)(),h=(0,s.E)(c.getConfig(),o.pie),u=(null==(a=null==(l=document.getElementById(e))?void 0:l.parentElement)?void 0:a.offsetWidth)??h.useWidth,p=(0,s.B)(e);p.attr("viewBox",`0 0 ${u} 450`),(0,s.i)(p,450,u,h.useMaxWidth);let d=p.append("g");d.attr("transform","translate("+u/2+",225)");let{themeVariables:_}=o,[g]=(0,s.F)(_.pieOuterStrokeWidth);g??(g=2);let f=h.textPosition,m=Math.min(u,450)/2-40,v=(0,n.Nb1)().innerRadius(0).outerRadius(m),b=(0,n.Nb1)().innerRadius(m*f).outerRadius(m*f);d.append("circle").attr("cx",0).attr("cy",0).attr("r",m+g/2).attr("class","pieOuterCircle");let k=c.getSections(),x=y(k),S=[_.pie1,_.pie2,_.pie3,_.pie4,_.pie5,_.pie6,_.pie7,_.pie8,_.pie9,_.pie10,_.pie11,_.pie12],$=(0,n.PKp)(S);d.selectAll("mySlices").data(x).enter().append("path").attr("d",v).attr("fill",t=>$(t.data.label)).attr("class","pieCircle");let w=0;Object.keys(k).forEach(t=>{w+=k[t]}),d.selectAll("mySlices").data(x).enter().append("text").text(t=>(t.data.value/w*100).toFixed(0)+"%").attr("transform",t=>"translate("+b.centroid(t)+")").style("text-anchor","middle").attr("class","slice"),d.append("text").text(c.getDiagramTitle()).attr("x",0).attr("y",-200).attr("class","pieTitleText");let E=d.selectAll(".legend").data($.domain()).enter().append("g").attr("class","legend").attr("transform",(t,e)=>"translate(216,"+(22*e-22*$.domain().length/2)+")");E.append("rect").attr("width",18).attr("height",18).style("fill",$).style("stroke",$),E.data(x).append("text").attr("x",22).attr("y",14).text(t=>{let{label:e,value:i}=t.data;return c.getShowData()?`${e} [${i}]`:e})}},styles:t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`}}}]);