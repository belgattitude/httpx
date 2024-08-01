"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1724],{1724:function(t,e,r){r.d(e,{a:function(){return s},b:function(){return T},c:function(){return d},d:function(){return j},e:function(){return M},f:function(){return N},g:function(){return _},h:function(){return Z},i:function(){return y},j:function(){return H},k:function(){return Y},l:function(){return h},m:function(){return P},p:function(){return B},s:function(){return S},u:function(){return o}});var a=r(9523),i=r(8090),n=r(9549);let l={extension:(t,e,r)=>{a.l.trace("Making markers for ",r),t.append("defs").append("marker").attr("id",r+"_"+e+"-extensionStart").attr("class","marker extension "+e).attr("refX",18).attr("refY",7).attr("markerWidth",190).attr("markerHeight",240).attr("orient","auto").append("path").attr("d","M 1,7 L18,13 V 1 Z"),t.append("defs").append("marker").attr("id",r+"_"+e+"-extensionEnd").attr("class","marker extension "+e).attr("refX",1).attr("refY",7).attr("markerWidth",20).attr("markerHeight",28).attr("orient","auto").append("path").attr("d","M 1,1 V 13 L18,7 Z")},composition:(t,e,r)=>{t.append("defs").append("marker").attr("id",r+"_"+e+"-compositionStart").attr("class","marker composition "+e).attr("refX",18).attr("refY",7).attr("markerWidth",190).attr("markerHeight",240).attr("orient","auto").append("path").attr("d","M 18,7 L9,13 L1,7 L9,1 Z"),t.append("defs").append("marker").attr("id",r+"_"+e+"-compositionEnd").attr("class","marker composition "+e).attr("refX",1).attr("refY",7).attr("markerWidth",20).attr("markerHeight",28).attr("orient","auto").append("path").attr("d","M 18,7 L9,13 L1,7 L9,1 Z")},aggregation:(t,e,r)=>{t.append("defs").append("marker").attr("id",r+"_"+e+"-aggregationStart").attr("class","marker aggregation "+e).attr("refX",18).attr("refY",7).attr("markerWidth",190).attr("markerHeight",240).attr("orient","auto").append("path").attr("d","M 18,7 L9,13 L1,7 L9,1 Z"),t.append("defs").append("marker").attr("id",r+"_"+e+"-aggregationEnd").attr("class","marker aggregation "+e).attr("refX",1).attr("refY",7).attr("markerWidth",20).attr("markerHeight",28).attr("orient","auto").append("path").attr("d","M 18,7 L9,13 L1,7 L9,1 Z")},dependency:(t,e,r)=>{t.append("defs").append("marker").attr("id",r+"_"+e+"-dependencyStart").attr("class","marker dependency "+e).attr("refX",6).attr("refY",7).attr("markerWidth",190).attr("markerHeight",240).attr("orient","auto").append("path").attr("d","M 5,7 L9,13 L1,7 L9,1 Z"),t.append("defs").append("marker").attr("id",r+"_"+e+"-dependencyEnd").attr("class","marker dependency "+e).attr("refX",13).attr("refY",7).attr("markerWidth",20).attr("markerHeight",28).attr("orient","auto").append("path").attr("d","M 18,7 L9,13 L14,7 L9,1 Z")},lollipop:(t,e,r)=>{t.append("defs").append("marker").attr("id",r+"_"+e+"-lollipopStart").attr("class","marker lollipop "+e).attr("refX",13).attr("refY",7).attr("markerWidth",190).attr("markerHeight",240).attr("orient","auto").append("circle").attr("stroke","black").attr("fill","transparent").attr("cx",7).attr("cy",7).attr("r",6),t.append("defs").append("marker").attr("id",r+"_"+e+"-lollipopEnd").attr("class","marker lollipop "+e).attr("refX",1).attr("refY",7).attr("markerWidth",190).attr("markerHeight",240).attr("orient","auto").append("circle").attr("stroke","black").attr("fill","transparent").attr("cx",7).attr("cy",7).attr("r",6)},point:(t,e,r)=>{t.append("marker").attr("id",r+"_"+e+"-pointEnd").attr("class","marker "+e).attr("viewBox","0 0 10 10").attr("refX",6).attr("refY",5).attr("markerUnits","userSpaceOnUse").attr("markerWidth",12).attr("markerHeight",12).attr("orient","auto").append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("class","arrowMarkerPath").style("stroke-width",1).style("stroke-dasharray","1,0"),t.append("marker").attr("id",r+"_"+e+"-pointStart").attr("class","marker "+e).attr("viewBox","0 0 10 10").attr("refX",4.5).attr("refY",5).attr("markerUnits","userSpaceOnUse").attr("markerWidth",12).attr("markerHeight",12).attr("orient","auto").append("path").attr("d","M 0 5 L 10 10 L 10 0 z").attr("class","arrowMarkerPath").style("stroke-width",1).style("stroke-dasharray","1,0")},circle:(t,e,r)=>{t.append("marker").attr("id",r+"_"+e+"-circleEnd").attr("class","marker "+e).attr("viewBox","0 0 10 10").attr("refX",11).attr("refY",5).attr("markerUnits","userSpaceOnUse").attr("markerWidth",11).attr("markerHeight",11).attr("orient","auto").append("circle").attr("cx","5").attr("cy","5").attr("r","5").attr("class","arrowMarkerPath").style("stroke-width",1).style("stroke-dasharray","1,0"),t.append("marker").attr("id",r+"_"+e+"-circleStart").attr("class","marker "+e).attr("viewBox","0 0 10 10").attr("refX",-1).attr("refY",5).attr("markerUnits","userSpaceOnUse").attr("markerWidth",11).attr("markerHeight",11).attr("orient","auto").append("circle").attr("cx","5").attr("cy","5").attr("r","5").attr("class","arrowMarkerPath").style("stroke-width",1).style("stroke-dasharray","1,0")},cross:(t,e,r)=>{t.append("marker").attr("id",r+"_"+e+"-crossEnd").attr("class","marker cross "+e).attr("viewBox","0 0 11 11").attr("refX",12).attr("refY",5.2).attr("markerUnits","userSpaceOnUse").attr("markerWidth",11).attr("markerHeight",11).attr("orient","auto").append("path").attr("d","M 1,1 l 9,9 M 10,1 l -9,9").attr("class","arrowMarkerPath").style("stroke-width",2).style("stroke-dasharray","1,0"),t.append("marker").attr("id",r+"_"+e+"-crossStart").attr("class","marker cross "+e).attr("viewBox","0 0 11 11").attr("refX",-1).attr("refY",5.2).attr("markerUnits","userSpaceOnUse").attr("markerWidth",11).attr("markerHeight",11).attr("orient","auto").append("path").attr("d","M 1,1 l 9,9 M 10,1 l -9,9").attr("class","arrowMarkerPath").style("stroke-width",2).style("stroke-dasharray","1,0")},barb:(t,e,r)=>{t.append("defs").append("marker").attr("id",r+"_"+e+"-barbEnd").attr("refX",19).attr("refY",7).attr("markerWidth",20).attr("markerHeight",14).attr("markerUnits","strokeWidth").attr("orient","auto").append("path").attr("d","M 19,7 L9,13 L14,7 L9,1 Z")}},s=(t,e,r,a)=>{e.forEach(e=>{l[e](t,r,a)})},d=(t,e,r,n)=>{let l=t||"";if("object"==typeof l&&(l=l[0]),(0,a.m)((0,a.c)().flowchart.htmlLabels))return l=l.replace(/\\n|\n/g,"<br />"),a.l.debug("vertexText"+l),function(t){var e;let r=(0,i.Ys)(document.createElementNS("http://www.w3.org/2000/svg","foreignObject")),a=r.append("xhtml:div"),n=t.label,l=t.isNode?"nodeLabel":"edgeLabel";return a.html('<span class="'+l+'" '+(t.labelStyle?'style="'+t.labelStyle+'"':"")+">"+n+"</span>"),(e=t.labelStyle)&&a.attr("style",e),a.style("display","inline-block"),a.style("white-space","nowrap"),a.attr("xmlns","http://www.w3.org/1999/xhtml"),r.node()}({isNode:n,label:(0,a.M)(l).replace(/fa[blrs]?:fa-[\w-]+/g,t=>`<i class='${t.replace(":"," ")}'></i>`),labelStyle:e.replace("fill:","color:")});{let t=document.createElementNS("http://www.w3.org/2000/svg","text");t.setAttribute("style",e.replace("color:","fill:"));for(let e of"string"==typeof l?l.split(/\\n|\n|<br\s*\/?>/gi):Array.isArray(l)?l:[]){let a=document.createElementNS("http://www.w3.org/2000/svg","tspan");a.setAttributeNS("http://www.w3.org/XML/1998/namespace","xml:space","preserve"),a.setAttribute("dy","1em"),a.setAttribute("x","0"),r?a.setAttribute("class","title-row"):a.setAttribute("class","row"),a.textContent=e.trim(),t.appendChild(a)}return t}},h=async(t,e,r,l)=>{let s,h,o;let c=e.useHtmlLabels||(0,a.m)((0,a.c)().flowchart.htmlLabels);s=r||"node default";let y=t.insert("g").attr("class",s).attr("id",e.domId||e.id),p=y.insert("g").attr("class","label").attr("style",e.labelStyle);h=void 0===e.labelText?"":"string"==typeof e.labelText?e.labelText:e.labelText[0];let g=p.node(),x=(o="markdown"===e.labelType?(0,n.a)(p,(0,a.d)((0,a.M)(h),(0,a.c)()),{useHtmlLabels:c,width:e.width||(0,a.c)().flowchart.wrappingWidth,classes:"markdown-node-label"}):g.appendChild(d((0,a.d)((0,a.M)(h),(0,a.c)()),e.labelStyle,!1,l))).getBBox(),f=e.padding/2;if((0,a.m)((0,a.c)().flowchart.htmlLabels)){let t=o.children[0],e=(0,i.Ys)(o),r=t.getElementsByTagName("img");if(r){let t=""===h.replace(/<img[^>]*>/g,"").trim();await Promise.all([...r].map(e=>new Promise(r=>{function i(){if(e.style.display="flex",e.style.flexDirection="column",t){let t=5*parseInt((0,a.c)().fontSize?(0,a.c)().fontSize:window.getComputedStyle(document.body).fontSize,10)+"px";e.style.minWidth=t,e.style.maxWidth=t}else e.style.width="100%";r(e)}setTimeout(()=>{e.complete&&i()}),e.addEventListener("error",i),e.addEventListener("load",i)})))}x=t.getBoundingClientRect(),e.attr("width",x.width),e.attr("height",x.height)}return c?p.attr("transform","translate("+-x.width/2+", "+-x.height/2+")"):p.attr("transform","translate(0, "+-x.height/2+")"),e.centerLabel&&p.attr("transform","translate("+-x.width/2+", "+-x.height/2+")"),p.insert("rect",":first-child"),{shapeSvg:y,bbox:x,halfPadding:f,label:p}},o=(t,e)=>{let r=e.node().getBBox();t.width=r.width,t.height=r.height};function c(t,e,r,a){return t.insert("polygon",":first-child").attr("points",a.map(function(t){return t.x+","+t.y}).join(" ")).attr("class","label-container").attr("transform","translate("+-e/2+","+r/2+")")}let y=(t,e)=>{var r,a,i=t.x,n=t.y,l=e.x-i,s=e.y-n,d=t.width/2,h=t.height/2;return Math.abs(s)*d>Math.abs(l)*h?(s<0&&(h=-h),r=0===s?0:h*l/s,a=h):(l<0&&(d=-d),r=d,a=0===l?0:d*s/l),{x:i+r,y:n+a}},p=function(t,e,r){var a,i,n,l,s,d,h;return a=t.x,i=t.y,n=a-r.x,s=Math.sqrt(e*e*(l=i-r.y)*l+e*e*n*n),d=Math.abs(e*e*n/s),r.x<a&&(d=-d),h=Math.abs(e*e*l/s),r.y<i&&(h=-h),{x:a+d,y:i+h}},g=function(t,e,r){var a=t.x,i=t.y,n=[],l=Number.POSITIVE_INFINITY,s=Number.POSITIVE_INFINITY;"function"==typeof e.forEach?e.forEach(function(t){l=Math.min(l,t.x),s=Math.min(s,t.y)}):(l=Math.min(l,e.x),s=Math.min(s,e.y));for(var d=a-t.width/2-l,h=i-t.height/2-s,o=0;o<e.length;o++){var c=e[o],y=e[o<e.length-1?o+1:0],p=function(t,e,r,a){var i,n,l,s,d,h,o,c,y,p,g,x,f;if(i=e.y-t.y,l=t.x-e.x,d=e.x*t.y-t.x*e.y,y=i*r.x+l*r.y+d,p=i*a.x+l*a.y+d,(0===y||0===p||!(y*p>0))&&(n=a.y-r.y,s=r.x-a.x,h=a.x*r.y-r.x*a.y,o=n*t.x+s*t.y+h,c=n*e.x+s*e.y+h,!(0!==o&&0!==c&&o*c>0)&&0!=(g=i*s-n*l)))return x=Math.abs(g/2),{x:(f=l*h-s*d)<0?(f-x)/g:(f+x)/g,y:(f=n*d-i*h)<0?(f-x)/g:(f+x)/g}}(t,r,{x:d+c.x,y:h+c.y},{x:d+y.x,y:h+y.y});p&&n.push(p)}return n.length?(n.length>1&&n.sort(function(t,e){var a=t.x-r.x,i=t.y-r.y,n=Math.sqrt(a*a+i*i),l=e.x-r.x,s=e.y-r.y,d=Math.sqrt(l*l+s*s);return n<d?-1:n===d?0:1}),n[0]):t},x=t=>{let e=new Set;for(let r of t)switch(r){case"x":e.add("right"),e.add("left");break;case"y":e.add("up"),e.add("down");break;default:e.add(r)}return e},f=(t,e,r)=>{let a=x(t),i=e.height+2*r.padding,n=i/2,l=e.width+2*n+r.padding,s=r.padding/2;return a.has("right")&&a.has("left")&&a.has("up")&&a.has("down")?[{x:0,y:0},{x:n,y:0},{x:l/2,y:2*s},{x:l-n,y:0},{x:l,y:0},{x:l,y:-i/3},{x:l+2*s,y:-i/2},{x:l,y:-2*i/3},{x:l,y:-i},{x:l-n,y:-i},{x:l/2,y:-i-2*s},{x:n,y:-i},{x:0,y:-i},{x:0,y:-2*i/3},{x:-2*s,y:-i/2},{x:0,y:-i/3}]:a.has("right")&&a.has("left")&&a.has("up")?[{x:n,y:0},{x:l-n,y:0},{x:l,y:-i/2},{x:l-n,y:-i},{x:n,y:-i},{x:0,y:-i/2}]:a.has("right")&&a.has("left")&&a.has("down")?[{x:0,y:0},{x:n,y:-i},{x:l-n,y:-i},{x:l,y:0}]:a.has("right")&&a.has("up")&&a.has("down")?[{x:0,y:0},{x:l,y:-n},{x:l,y:-i+n},{x:0,y:-i}]:a.has("left")&&a.has("up")&&a.has("down")?[{x:l,y:0},{x:0,y:-n},{x:0,y:-i+n},{x:l,y:-i}]:a.has("right")&&a.has("left")?[{x:n,y:0},{x:n,y:-s},{x:l-n,y:-s},{x:l-n,y:0},{x:l,y:-i/2},{x:l-n,y:-i},{x:l-n,y:-i+s},{x:n,y:-i+s},{x:n,y:-i},{x:0,y:-i/2}]:a.has("up")&&a.has("down")?[{x:l/2,y:0},{x:0,y:-s},{x:n,y:-s},{x:n,y:-i+s},{x:0,y:-i+s},{x:l/2,y:-i},{x:l,y:-i+s},{x:l-n,y:-i+s},{x:l-n,y:-s},{x:l,y:-s}]:a.has("right")&&a.has("up")?[{x:0,y:0},{x:l,y:-n},{x:0,y:-i}]:a.has("right")&&a.has("down")?[{x:0,y:0},{x:l,y:0},{x:0,y:-i}]:a.has("left")&&a.has("up")?[{x:l,y:0},{x:0,y:-n},{x:l,y:-i}]:a.has("left")&&a.has("down")?[{x:l,y:0},{x:0,y:0},{x:l,y:-i}]:a.has("right")?[{x:n,y:-s},{x:n,y:-s},{x:l-n,y:-s},{x:l-n,y:0},{x:l,y:-i/2},{x:l-n,y:-i},{x:l-n,y:-i+s},{x:n,y:-i+s},{x:n,y:-i+s}]:a.has("left")?[{x:n,y:0},{x:n,y:-s},{x:l-n,y:-s},{x:l-n,y:-i+s},{x:n,y:-i+s},{x:n,y:-i},{x:0,y:-i/2}]:a.has("up")?[{x:n,y:-s},{x:n,y:-i+s},{x:0,y:-i+s},{x:l/2,y:-i},{x:l,y:-i+s},{x:l-n,y:-i+s},{x:l-n,y:-s}]:a.has("down")?[{x:l/2,y:0},{x:0,y:-s},{x:n,y:-s},{x:n,y:-i+s},{x:l-n,y:-i+s},{x:l-n,y:-s},{x:l,y:-s}]:[{x:0,y:0}]},u=t=>t?" "+t:"",w=(t,e)=>`${e||"node default"}${u(t.classes)} ${u(t.class)}`,b=async(t,e)=>{let{shapeSvg:r,bbox:i}=await h(t,e,w(e,void 0),!0),n=i.width+e.padding+(i.height+e.padding),l=[{x:n/2,y:0},{x:n,y:-n/2},{x:n/2,y:-n},{x:0,y:-n/2}];a.l.info("Question main (Circle)");let s=c(r,n,n,l);return s.attr("style",e.style),o(e,s),e.intersect=function(t){return a.l.warn("Intersect called"),g(e,l,t)},r};function m(t,e,r,i){let n=[],l=t=>{n.push(t,0)},s=t=>{n.push(0,t)};e.includes("t")?(a.l.debug("add top border"),l(r)):s(r),e.includes("r")?(a.l.debug("add right border"),l(i)):s(i),e.includes("b")?(a.l.debug("add bottom border"),l(r)):s(r),e.includes("l")?(a.l.debug("add left border"),l(i)):s(i),t.attr("stroke-dasharray",n.join(" "))}let k=(t,e,r)=>{let a=t.insert("g").attr("class","node default").attr("id",e.domId||e.id),i=70,n=10;return"LR"===r&&(i=10,n=70),o(e,a.append("rect").attr("x",-1*i/2).attr("y",-1*n/2).attr("width",i).attr("height",n).attr("class","fork-join")),e.height=e.height+e.padding/2,e.width=e.width+e.padding/2,e.intersect=function(t){return y(e,t)},a},L={rhombus:b,composite:async(t,e)=>{let{shapeSvg:r,bbox:i,halfPadding:n}=await h(t,e,"node "+e.classes,!0),l=r.insert("rect",":first-child"),s=e.positioned?e.width:i.width+e.padding,d=e.positioned?e.height:i.height+e.padding,c=e.positioned?-s/2:-i.width/2-n,p=e.positioned?-d/2:-i.height/2-n;if(l.attr("class","basic cluster composite label-container").attr("style",e.style).attr("rx",e.rx).attr("ry",e.ry).attr("x",c).attr("y",p).attr("width",s).attr("height",d),e.props){let t=new Set(Object.keys(e.props));e.props.borders&&(m(l,e.props.borders,s,d),t.delete("borders")),t.forEach(t=>{a.l.warn(`Unknown node property ${t}`)})}return o(e,l),e.intersect=function(t){return y(e,t)},r},question:b,rect:async(t,e)=>{let{shapeSvg:r,bbox:i,halfPadding:n}=await h(t,e,"node "+e.classes+" "+e.class,!0),l=r.insert("rect",":first-child"),s=e.positioned?e.width:i.width+e.padding,d=e.positioned?e.height:i.height+e.padding,c=e.positioned?-s/2:-i.width/2-n,p=e.positioned?-d/2:-i.height/2-n;if(l.attr("class","basic label-container").attr("style",e.style).attr("rx",e.rx).attr("ry",e.ry).attr("x",c).attr("y",p).attr("width",s).attr("height",d),e.props){let t=new Set(Object.keys(e.props));e.props.borders&&(m(l,e.props.borders,s,d),t.delete("borders")),t.forEach(t=>{a.l.warn(`Unknown node property ${t}`)})}return o(e,l),e.intersect=function(t){return y(e,t)},r},labelRect:async(t,e)=>{let{shapeSvg:r}=await h(t,e,"label",!0);a.l.trace("Classes = ",e.class);let i=r.insert("rect",":first-child");if(i.attr("width",0).attr("height",0),r.attr("class","label edgeLabel"),e.props){let t=new Set(Object.keys(e.props));e.props.borders&&(m(i,e.props.borders,0,0),t.delete("borders")),t.forEach(t=>{a.l.warn(`Unknown node property ${t}`)})}return o(e,i),e.intersect=function(t){return y(e,t)},r},rectWithTitle:(t,e)=>{let r;r=e.classes?"node "+e.classes:"node default";let n=t.insert("g").attr("class",r).attr("id",e.domId||e.id),l=n.insert("rect",":first-child"),s=n.insert("line"),h=n.insert("g").attr("class","label"),c=e.labelText.flat?e.labelText.flat():e.labelText,p="";p="object"==typeof c?c[0]:c,a.l.info("Label text abc79",p,c,"object"==typeof c);let g=h.node().appendChild(d(p,e.labelStyle,!0,!0)),x={width:0,height:0};if((0,a.m)((0,a.c)().flowchart.htmlLabels)){let t=g.children[0],e=(0,i.Ys)(g);x=t.getBoundingClientRect(),e.attr("width",x.width),e.attr("height",x.height)}a.l.info("Text 2",c);let f=c.slice(1,c.length),u=g.getBBox(),w=h.node().appendChild(d(f.join?f.join("<br/>"):f,e.labelStyle,!0,!0));if((0,a.m)((0,a.c)().flowchart.htmlLabels)){let t=w.children[0],e=(0,i.Ys)(w);x=t.getBoundingClientRect(),e.attr("width",x.width),e.attr("height",x.height)}let b=e.padding/2;return(0,i.Ys)(w).attr("transform","translate( "+(x.width>u.width?0:(u.width-x.width)/2)+", "+(u.height+b+5)+")"),(0,i.Ys)(g).attr("transform","translate( "+(x.width<u.width?0:-(u.width-x.width)/2)+", 0)"),x=h.node().getBBox(),h.attr("transform","translate("+-x.width/2+", "+(-x.height/2-b+3)+")"),l.attr("class","outer title-state").attr("x",-x.width/2-b).attr("y",-x.height/2-b).attr("width",x.width+e.padding).attr("height",x.height+e.padding),s.attr("class","divider").attr("x1",-x.width/2-b).attr("x2",x.width/2+b).attr("y1",-x.height/2-b+u.height+b).attr("y2",-x.height/2-b+u.height+b),o(e,l),e.intersect=function(t){return y(e,t)},n},choice:(t,e)=>{let r=t.insert("g").attr("class","node default").attr("id",e.domId||e.id);return r.insert("polygon",":first-child").attr("points",[{x:0,y:14},{x:14,y:0},{x:0,y:-14},{x:-14,y:0}].map(function(t){return t.x+","+t.y}).join(" ")).attr("class","state-start").attr("r",7).attr("width",28).attr("height",28),e.width=28,e.height=28,e.intersect=function(t){return p(e,14,t)},r},circle:async(t,e)=>{let{shapeSvg:r,bbox:i,halfPadding:n}=await h(t,e,w(e,void 0),!0),l=r.insert("circle",":first-child");return l.attr("style",e.style).attr("rx",e.rx).attr("ry",e.ry).attr("r",i.width/2+n).attr("width",i.width+e.padding).attr("height",i.height+e.padding),a.l.info("Circle main"),o(e,l),e.intersect=function(t){return a.l.info("Circle intersect",e,i.width/2+n,t),p(e,i.width/2+n,t)},r},doublecircle:async(t,e)=>{let{shapeSvg:r,bbox:i,halfPadding:n}=await h(t,e,w(e,void 0),!0),l=r.insert("g",":first-child"),s=l.insert("circle"),d=l.insert("circle");return l.attr("class",e.class),s.attr("style",e.style).attr("rx",e.rx).attr("ry",e.ry).attr("r",i.width/2+n+5).attr("width",i.width+e.padding+10).attr("height",i.height+e.padding+10),d.attr("style",e.style).attr("rx",e.rx).attr("ry",e.ry).attr("r",i.width/2+n).attr("width",i.width+e.padding).attr("height",i.height+e.padding),a.l.info("DoubleCircle main"),o(e,s),e.intersect=function(t){return a.l.info("DoubleCircle intersect",e,i.width/2+n+5,t),p(e,i.width/2+n+5,t)},r},stadium:async(t,e)=>{let{shapeSvg:r,bbox:a}=await h(t,e,w(e,void 0),!0),i=a.height+e.padding,n=a.width+i/4+e.padding,l=r.insert("rect",":first-child").attr("style",e.style).attr("rx",i/2).attr("ry",i/2).attr("x",-n/2).attr("y",-i/2).attr("width",n).attr("height",i);return o(e,l),e.intersect=function(t){return y(e,t)},r},hexagon:async(t,e)=>{let{shapeSvg:r,bbox:a}=await h(t,e,w(e,void 0),!0),i=a.height+e.padding,n=i/4,l=a.width+2*n+e.padding,s=[{x:n,y:0},{x:l-n,y:0},{x:l,y:-i/2},{x:l-n,y:-i},{x:n,y:-i},{x:0,y:-i/2}],d=c(r,l,i,s);return d.attr("style",e.style),o(e,d),e.intersect=function(t){return g(e,s,t)},r},block_arrow:async(t,e)=>{let{shapeSvg:r,bbox:a}=await h(t,e,void 0,!0),i=a.height+2*e.padding,n=i/2,l=a.width+2*n+e.padding,s=f(e.directions,a,e),d=c(r,l,i,s);return d.attr("style",e.style),o(e,d),e.intersect=function(t){return g(e,s,t)},r},rect_left_inv_arrow:async(t,e)=>{let{shapeSvg:r,bbox:a}=await h(t,e,w(e,void 0),!0),i=a.width+e.padding,n=a.height+e.padding,l=[{x:-n/2,y:0},{x:i,y:0},{x:i,y:-n},{x:-n/2,y:-n},{x:0,y:-n/2}];return c(r,i,n,l).attr("style",e.style),e.width=i+n,e.height=n,e.intersect=function(t){return g(e,l,t)},r},lean_right:async(t,e)=>{let{shapeSvg:r,bbox:a}=await h(t,e,w(e),!0),i=a.width+e.padding,n=a.height+e.padding,l=[{x:-2*n/6,y:0},{x:i-n/6,y:0},{x:i+2*n/6,y:-n},{x:n/6,y:-n}],s=c(r,i,n,l);return s.attr("style",e.style),o(e,s),e.intersect=function(t){return g(e,l,t)},r},lean_left:async(t,e)=>{let{shapeSvg:r,bbox:a}=await h(t,e,w(e,void 0),!0),i=a.width+e.padding,n=a.height+e.padding,l=[{x:2*n/6,y:0},{x:i+n/6,y:0},{x:i-2*n/6,y:-n},{x:-n/6,y:-n}],s=c(r,i,n,l);return s.attr("style",e.style),o(e,s),e.intersect=function(t){return g(e,l,t)},r},trapezoid:async(t,e)=>{let{shapeSvg:r,bbox:a}=await h(t,e,w(e,void 0),!0),i=a.width+e.padding,n=a.height+e.padding,l=[{x:-2*n/6,y:0},{x:i+2*n/6,y:0},{x:i-n/6,y:-n},{x:n/6,y:-n}],s=c(r,i,n,l);return s.attr("style",e.style),o(e,s),e.intersect=function(t){return g(e,l,t)},r},inv_trapezoid:async(t,e)=>{let{shapeSvg:r,bbox:a}=await h(t,e,w(e,void 0),!0),i=a.width+e.padding,n=a.height+e.padding,l=[{x:n/6,y:0},{x:i-n/6,y:0},{x:i+2*n/6,y:-n},{x:-2*n/6,y:-n}],s=c(r,i,n,l);return s.attr("style",e.style),o(e,s),e.intersect=function(t){return g(e,l,t)},r},rect_right_inv_arrow:async(t,e)=>{let{shapeSvg:r,bbox:a}=await h(t,e,w(e,void 0),!0),i=a.width+e.padding,n=a.height+e.padding,l=[{x:0,y:0},{x:i+n/2,y:0},{x:i,y:-n/2},{x:i+n/2,y:-n},{x:0,y:-n}],s=c(r,i,n,l);return s.attr("style",e.style),o(e,s),e.intersect=function(t){return g(e,l,t)},r},cylinder:async(t,e)=>{let{shapeSvg:r,bbox:a}=await h(t,e,w(e,void 0),!0),i=a.width+e.padding,n=i/2,l=n/(2.5+i/50),s=a.height+l+e.padding,d=r.attr("label-offset-y",l).insert("path",":first-child").attr("style",e.style).attr("d","M 0,"+l+" a "+n+","+l+" 0,0,0 "+i+" 0 a "+n+","+l+" 0,0,0 "+-i+" 0 l 0,"+s+" a "+n+","+l+" 0,0,0 "+i+" 0 l 0,"+-s).attr("transform","translate("+-i/2+","+-(s/2+l)+")");return o(e,d),e.intersect=function(t){let r=y(e,t),a=r.x-e.x;if(0!=n&&(Math.abs(a)<e.width/2||Math.abs(a)==e.width/2&&Math.abs(r.y-e.y)>e.height/2-l)){let i=l*l*(1-a*a/(n*n));0!=i&&(i=Math.sqrt(i)),i=l-i,t.y-e.y>0&&(i=-i),r.y+=i}return r},r},start:(t,e)=>{let r=t.insert("g").attr("class","node default").attr("id",e.domId||e.id),a=r.insert("circle",":first-child");return a.attr("class","state-start").attr("r",7).attr("width",14).attr("height",14),o(e,a),e.intersect=function(t){return p(e,7,t)},r},end:(t,e)=>{let r=t.insert("g").attr("class","node default").attr("id",e.domId||e.id),a=r.insert("circle",":first-child"),i=r.insert("circle",":first-child");return i.attr("class","state-start").attr("r",7).attr("width",14).attr("height",14),a.attr("class","state-end").attr("r",5).attr("width",10).attr("height",10),o(e,i),e.intersect=function(t){return p(e,7,t)},r},note:async(t,e)=>{e.useHtmlLabels||(0,a.c)().flowchart.htmlLabels||(e.centerLabel=!0);let{shapeSvg:r,bbox:i,halfPadding:n}=await h(t,e,"node "+e.classes,!0);a.l.info("Classes = ",e.classes);let l=r.insert("rect",":first-child");return l.attr("rx",e.rx).attr("ry",e.ry).attr("x",-i.width/2-n).attr("y",-i.height/2-n).attr("width",i.width+e.padding).attr("height",i.height+e.padding),o(e,l),e.intersect=function(t){return y(e,t)},r},subroutine:async(t,e)=>{let{shapeSvg:r,bbox:a}=await h(t,e,w(e,void 0),!0),i=a.width+e.padding,n=a.height+e.padding,l=[{x:0,y:0},{x:i,y:0},{x:i,y:-n},{x:0,y:-n},{x:0,y:0},{x:-8,y:0},{x:i+8,y:0},{x:i+8,y:-n},{x:-8,y:-n},{x:-8,y:0}],s=c(r,i,n,l);return s.attr("style",e.style),o(e,s),e.intersect=function(t){return g(e,l,t)},r},fork:k,join:k,class_box:(t,e)=>{let r;let n=e.padding/2;r=e.classes?"node "+e.classes:"node default";let l=t.insert("g").attr("class",r).attr("id",e.domId||e.id),s=l.insert("rect",":first-child"),h=l.insert("line"),c=l.insert("line"),p=0,g=4,x=l.insert("g").attr("class","label"),f=0,u=e.classData.annotations&&e.classData.annotations[0],w=e.classData.annotations[0]?"\xab"+e.classData.annotations[0]+"\xbb":"",b=x.node().appendChild(d(w,e.labelStyle,!0,!0)),m=b.getBBox();if((0,a.m)((0,a.c)().flowchart.htmlLabels)){let t=b.children[0],e=(0,i.Ys)(b);m=t.getBoundingClientRect(),e.attr("width",m.width),e.attr("height",m.height)}e.classData.annotations[0]&&(g+=m.height+4,p+=m.width);let k=e.classData.label;void 0!==e.classData.type&&""!==e.classData.type&&((0,a.c)().flowchart.htmlLabels?k+="&lt;"+e.classData.type+"&gt;":k+="<"+e.classData.type+">");let L=x.node().appendChild(d(k,e.labelStyle,!0,!0));(0,i.Ys)(L).attr("class","classTitle");let v=L.getBBox();if((0,a.m)((0,a.c)().flowchart.htmlLabels)){let t=L.children[0],e=(0,i.Ys)(L);v=t.getBoundingClientRect(),e.attr("width",v.width),e.attr("height",v.height)}g+=v.height+4,v.width>p&&(p=v.width);let M=[];e.classData.members.forEach(t=>{let r=t.getDisplayDetails(),n=r.displayText;(0,a.c)().flowchart.htmlLabels&&(n=n.replace(/</g,"&lt;").replace(/>/g,"&gt;"));let l=x.node().appendChild(d(n,r.cssStyle?r.cssStyle:e.labelStyle,!0,!0)),s=l.getBBox();if((0,a.m)((0,a.c)().flowchart.htmlLabels)){let t=l.children[0],e=(0,i.Ys)(l);s=t.getBoundingClientRect(),e.attr("width",s.width),e.attr("height",s.height)}s.width>p&&(p=s.width),g+=s.height+4,M.push(l)}),g+=8;let S=[];if(e.classData.methods.forEach(t=>{let r=t.getDisplayDetails(),n=r.displayText;(0,a.c)().flowchart.htmlLabels&&(n=n.replace(/</g,"&lt;").replace(/>/g,"&gt;"));let l=x.node().appendChild(d(n,r.cssStyle?r.cssStyle:e.labelStyle,!0,!0)),s=l.getBBox();if((0,a.m)((0,a.c)().flowchart.htmlLabels)){let t=l.children[0],e=(0,i.Ys)(l);s=t.getBoundingClientRect(),e.attr("width",s.width),e.attr("height",s.height)}s.width>p&&(p=s.width),g+=s.height+4,S.push(l)}),g+=8,u){let t=(p-m.width)/2;(0,i.Ys)(b).attr("transform","translate( "+(-1*p/2+t)+", "+-1*g/2+")"),f=m.height+4}let T=(p-v.width)/2;return(0,i.Ys)(L).attr("transform","translate( "+(-1*p/2+T)+", "+(-1*g/2+f)+")"),f+=v.height+4,h.attr("class","divider").attr("x1",-p/2-n).attr("x2",p/2+n).attr("y1",-g/2-n+8+f).attr("y2",-g/2-n+8+f),f+=8,M.forEach(t=>{(0,i.Ys)(t).attr("transform","translate( "+-p/2+", "+(-1*g/2+f+4)+")");let e=null==t?void 0:t.getBBox();f+=((null==e?void 0:e.height)??0)+4}),f+=8,c.attr("class","divider").attr("x1",-p/2-n).attr("x2",p/2+n).attr("y1",-g/2-n+8+f).attr("y2",-g/2-n+8+f),f+=8,S.forEach(t=>{(0,i.Ys)(t).attr("transform","translate( "+-p/2+", "+(-1*g/2+f)+")");let e=null==t?void 0:t.getBBox();f+=((null==e?void 0:e.height)??0)+4}),s.attr("style",e.style).attr("class","outer title-state").attr("x",-p/2-n).attr("y",-(g/2)-n).attr("width",p+e.padding).attr("height",g+e.padding),o(e,s),e.intersect=function(t){return y(e,t)},l}},v={},M=async(t,e,r)=>{let i,n;if(e.link){let l;"sandbox"===(0,a.c)().securityLevel?l="_top":e.linkTarget&&(l=e.linkTarget||"_blank"),i=t.insert("svg:a").attr("xlink:href",e.link).attr("target",l),n=await L[e.shape](i,e,r)}else i=n=await L[e.shape](t,e,r);return e.tooltip&&n.attr("title",e.tooltip),e.class&&n.attr("class","node default "+e.class),i.attr("data-node","true"),i.attr("data-id",e.id),v[e.id]=i,e.haveCallback&&v[e.id].attr("class",v[e.id].attr("class")+" clickable"),i},S=(t,e)=>{v[e.id]=t},T=()=>{v={}},B=t=>{let e=v[t.id];a.l.trace("Transforming node",t.diff,t,"translate("+(t.x-t.width/2-5)+", "+t.width/2+")");let r=t.diff||0;return t.clusterNode?e.attr("transform","translate("+(t.x+r-t.width/2)+", "+(t.y-t.height/2-8)+")"):e.attr("transform","translate("+t.x+", "+t.y+")"),r},_=({flowchart:t})=>{var e,r;let a=(null==(e=null==t?void 0:t.subGraphTitleMargin)?void 0:e.top)??0,i=(null==(r=null==t?void 0:t.subGraphTitleMargin)?void 0:r.bottom)??0;return{subGraphTitleTopMargin:a,subGraphTitleBottomMargin:i,subGraphTitleTotalMargin:a+i}},C={aggregation:18,extension:18,composition:18,dependency:6,lollipop:13.5,arrow_point:5.3};function E(t,e){if(void 0===t||void 0===e)return{angle:0,deltaX:0,deltaY:0};t=$(t),e=$(e);let[r,a]=[t.x,t.y],[i,n]=[e.x,e.y],l=i-r,s=n-a;return{angle:Math.atan(s/l),deltaX:l,deltaY:s}}let $=t=>Array.isArray(t)?{x:t[0],y:t[1]}:t,Y=t=>({x:function(e,r,a){let i=0;if(0===r&&Object.hasOwn(C,t.arrowTypeStart)){let{angle:e,deltaX:r}=E(a[0],a[1]);i=C[t.arrowTypeStart]*Math.cos(e)*(r>=0?1:-1)}else if(r===a.length-1&&Object.hasOwn(C,t.arrowTypeEnd)){let{angle:e,deltaX:r}=E(a[a.length-1],a[a.length-2]);i=C[t.arrowTypeEnd]*Math.cos(e)*(r>=0?1:-1)}return $(e).x+i},y:function(e,r,a){let i=0;if(0===r&&Object.hasOwn(C,t.arrowTypeStart)){let{angle:e,deltaY:r}=E(a[0],a[1]);i=C[t.arrowTypeStart]*Math.abs(Math.sin(e))*(r>=0?1:-1)}else if(r===a.length-1&&Object.hasOwn(C,t.arrowTypeEnd)){let{angle:e,deltaY:r}=E(a[a.length-1],a[a.length-2]);i=C[t.arrowTypeEnd]*Math.abs(Math.sin(e))*(r>=0?1:-1)}return $(e).y+i}}),P=(t,e,r,a,i)=>{e.arrowTypeStart&&O(t,"start",e.arrowTypeStart,r,a,i),e.arrowTypeEnd&&O(t,"end",e.arrowTypeEnd,r,a,i)},R={arrow_cross:"cross",arrow_point:"point",arrow_barb:"barb",arrow_circle:"circle",aggregation:"aggregation",extension:"extension",composition:"composition",dependency:"dependency",lollipop:"lollipop"},O=(t,e,r,i,n,l)=>{let s=R[r];if(!s){a.l.warn(`Unknown arrow type: ${r}`);return}t.attr(`marker-${e}`,`url(${i}#${n}_${l}-${s}${"start"===e?"Start":"End"})`)},W={},I={},j=()=>{W={},I={}},N=(t,e)=>{let r;let l=(0,a.m)((0,a.c)().flowchart.htmlLabels),s="markdown"===e.labelType?(0,n.a)(t,e.label,{style:e.labelStyle,useHtmlLabels:l,addSvgBackground:!0}):d(e.label,e.labelStyle),h=t.insert("g").attr("class","edgeLabel"),o=h.insert("g").attr("class","label");o.node().appendChild(s);let c=s.getBBox();if(l){let t=s.children[0],e=(0,i.Ys)(s);c=t.getBoundingClientRect(),e.attr("width",c.width),e.attr("height",c.height)}if(o.attr("transform","translate("+-c.width/2+", "+-c.height/2+")"),W[e.id]=h,e.width=c.width,e.height=c.height,e.startLabelLeft){let a=d(e.startLabelLeft,e.labelStyle),i=t.insert("g").attr("class","edgeTerminals"),n=i.insert("g").attr("class","inner");r=n.node().appendChild(a);let l=a.getBBox();n.attr("transform","translate("+-l.width/2+", "+-l.height/2+")"),I[e.id]||(I[e.id]={}),I[e.id].startLeft=i,D(r,e.startLabelLeft)}if(e.startLabelRight){let a=d(e.startLabelRight,e.labelStyle),i=t.insert("g").attr("class","edgeTerminals"),n=i.insert("g").attr("class","inner");r=i.node().appendChild(a),n.node().appendChild(a);let l=a.getBBox();n.attr("transform","translate("+-l.width/2+", "+-l.height/2+")"),I[e.id]||(I[e.id]={}),I[e.id].startRight=i,D(r,e.startLabelRight)}if(e.endLabelLeft){let a=d(e.endLabelLeft,e.labelStyle),i=t.insert("g").attr("class","edgeTerminals"),n=i.insert("g").attr("class","inner");r=n.node().appendChild(a);let l=a.getBBox();n.attr("transform","translate("+-l.width/2+", "+-l.height/2+")"),i.node().appendChild(a),I[e.id]||(I[e.id]={}),I[e.id].endLeft=i,D(r,e.endLabelLeft)}if(e.endLabelRight){let a=d(e.endLabelRight,e.labelStyle),i=t.insert("g").attr("class","edgeTerminals"),n=i.insert("g").attr("class","inner");r=n.node().appendChild(a);let l=a.getBBox();n.attr("transform","translate("+-l.width/2+", "+-l.height/2+")"),i.node().appendChild(a),I[e.id]||(I[e.id]={}),I[e.id].endRight=i,D(r,e.endLabelRight)}return s};function D(t,e){(0,a.c)().flowchart.htmlLabels&&t&&(t.style.width=9*e.length+"px",t.style.height="12px")}let H=(t,e)=>{a.l.debug("Moving label abc88 ",t.id,t.label,W[t.id],e);let r=e.updatedPath?e.updatedPath:e.originalPath,{subGraphTitleTotalMargin:i}=_((0,a.c)());if(t.label){let n=W[t.id],l=t.x,s=t.y;if(r){let i=a.u.calcLabelPosition(r);a.l.debug("Moving label "+t.label+" from (",l,",",s,") to (",i.x,",",i.y,") abc88"),e.updatedPath&&(l=i.x,s=i.y)}n.attr("transform",`translate(${l}, ${s+i/2})`)}if(t.startLabelLeft){let e=I[t.id].startLeft,i=t.x,n=t.y;if(r){let e=a.u.calcTerminalLabelPosition(t.arrowTypeStart?10:0,"start_left",r);i=e.x,n=e.y}e.attr("transform",`translate(${i}, ${n})`)}if(t.startLabelRight){let e=I[t.id].startRight,i=t.x,n=t.y;if(r){let e=a.u.calcTerminalLabelPosition(t.arrowTypeStart?10:0,"start_right",r);i=e.x,n=e.y}e.attr("transform",`translate(${i}, ${n})`)}if(t.endLabelLeft){let e=I[t.id].endLeft,i=t.x,n=t.y;if(r){let e=a.u.calcTerminalLabelPosition(t.arrowTypeEnd?10:0,"end_left",r);i=e.x,n=e.y}e.attr("transform",`translate(${i}, ${n})`)}if(t.endLabelRight){let e=I[t.id].endRight,i=t.x,n=t.y;if(r){let e=a.u.calcTerminalLabelPosition(t.arrowTypeEnd?10:0,"end_right",r);i=e.x,n=e.y}e.attr("transform",`translate(${i}, ${n})`)}},X=(t,e)=>{let r=t.x,a=t.y,i=Math.abs(e.x-r),n=Math.abs(e.y-a),l=t.width/2,s=t.height/2;return i>=l||n>=s},U=(t,e,r)=>{a.l.debug(`intersection calc abc89:
  outsidePoint: ${JSON.stringify(e)}
  insidePoint : ${JSON.stringify(r)}
  node        : x:${t.x} y:${t.y} w:${t.width} h:${t.height}`);let i=t.x,n=t.y,l=Math.abs(i-r.x),s=t.width/2,d=r.x<e.x?s-l:s+l,h=t.height/2,o=Math.abs(e.y-r.y),c=Math.abs(e.x-r.x);if(Math.abs(n-e.y)*s>Math.abs(i-e.x)*h){let t=r.y<e.y?e.y-h-n:n-h-e.y;d=c*t/o;let i={x:r.x<e.x?r.x+d:r.x-c+d,y:r.y<e.y?r.y+o-t:r.y-o+t};return 0===d&&(i.x=e.x,i.y=e.y),0===c&&(i.x=e.x),0===o&&(i.y=e.y),a.l.debug(`abc89 topp/bott calc, Q ${o}, q ${t}, R ${c}, r ${d}`,i),i}{let t=o*(d=r.x<e.x?e.x-s-i:i-s-e.x)/c,n=r.x<e.x?r.x+c-d:r.x-c+d,l=r.y<e.y?r.y+t:r.y-t;return a.l.debug(`sides calc abc89, Q ${o}, q ${t}, R ${c}, r ${d}`,{_x:n,_y:l}),0===d&&(n=e.x,l=e.y),0===c&&(n=e.x),0===o&&(l=e.y),{x:n,y:l}}},A=(t,e)=>{a.l.debug("abc88 cutPathAtIntersect",t,e);let r=[],i=t[0],n=!1;return t.forEach(t=>{if(X(e,t)||n)i=t,n||r.push(t);else{let a=U(e,i,t),l=!1;r.forEach(t=>{l=l||t.x===a.x&&t.y===a.y}),r.some(t=>t.x===a.x&&t.y===a.y)||r.push(a),n=!0}}),r},Z=function(t,e,r,n,l,s,d){let h,o=r.points;a.l.debug("abc88 InsertEdge: edge=",r,"e=",e);let c=!1,y=s.node(e.v);var p=s.node(e.w);(null==p?void 0:p.intersect)&&(null==y?void 0:y.intersect)&&((o=o.slice(1,r.points.length-1)).unshift(y.intersect(o[0])),o.push(p.intersect(o[o.length-1]))),r.toCluster&&(a.l.debug("to cluster abc88",n[r.toCluster]),o=A(r.points,n[r.toCluster].node),c=!0),r.fromCluster&&(a.l.debug("from cluster abc88",n[r.fromCluster]),o=A(o.reverse(),n[r.fromCluster].node).reverse(),c=!0);let g=o.filter(t=>!Number.isNaN(t.y)),x=i.$0Z;r.curve&&("graph"===l||"flowchart"===l)&&(x=r.curve);let{x:f,y:u}=Y(r),w=(0,i.jvg)().x(f).y(u).curve(x);switch(r.thickness){case"normal":h="edge-thickness-normal";break;case"thick":case"invisible":h="edge-thickness-thick";break;default:h=""}switch(r.pattern){case"solid":h+=" edge-pattern-solid";break;case"dotted":h+=" edge-pattern-dotted";break;case"dashed":h+=" edge-pattern-dashed"}let b=t.append("path").attr("d",w(g)).attr("id",r.id).attr("class"," "+h+(r.classes?" "+r.classes:"")).attr("style",r.style),m="";((0,a.c)().flowchart.arrowMarkerAbsolute||(0,a.c)().state.arrowMarkerAbsolute)&&(m=(m=(m=window.location.protocol+"//"+window.location.host+window.location.pathname+window.location.search).replace(/\(/g,"\\(")).replace(/\)/g,"\\)")),P(b,r,m,d,l);let k={};return c&&(k.updatedPath=o),k.originalPath=r.points,k}}}]);