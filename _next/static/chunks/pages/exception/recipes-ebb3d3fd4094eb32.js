(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6564],{1507:function(s,e,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/exception/recipes",function(){return n(4445)}])},4445:function(s,e,n){"use strict";n.r(e),n.d(e,{__toc:function(){return l}});var i=n(4246),r=n(9304),o=n(1441);let l=[{depth:2,value:"Recipes",id:"recipes"},{depth:3,value:"Validation issues",id:"validation-issues"}];function t(s){let e=Object.assign({h2:"h2",h3:"h3",p:"p",a:"a",pre:"pre",code:"code",span:"span",blockquote:"blockquote"},(0,o.a)(),s.components);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(e.h2,{id:"recipes",children:"Recipes"}),"\n",(0,i.jsx)(e.h3,{id:"validation-issues",children:"Validation issues"}),"\n",(0,i.jsxs)(e.p,{children:["Although field validation issues aren't part of the specs, they are often used by frameworks or apis in\ncombination with the 422 status code (HttpUnprocessableEntity). For convenience, it's possible to directly\nattach them to the exception. That allows to easily access them in an error handler\n(ie: ",(0,i.jsx)(e.a,{href:"https://jsonapi.org/examples/#error-objects",children:"json-api errors"}),"...). Be aware that for simple request validation\nthe 400 status code is more appropriate (one message)."]}),"\n",(0,i.jsx)(e.pre,{"data-language":"typescript","data-theme":"default",children:(0,i.jsxs)(e.code,{"data-language":"typescript","data-theme":"default",children:[(0,i.jsxs)(e.span,{className:"line",children:[(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-keyword)"},children:"import"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" { HttpUnprocessableEntity } "}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-keyword)"},children:"from"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'@httpx/exception'"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:";"})]}),"\n",(0,i.jsx)(e.span,{className:"line",children:" "}),"\n",(0,i.jsxs)(e.span,{className:"line",children:[(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-constant)"},children:"e422"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-keyword)"},children:"new"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-function)"},children:"HttpUnprocessableEntity"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"({"})]}),"\n",(0,i.jsxs)(e.span,{className:"line",children:[(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"  issues"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-keyword)"},children:":"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" ["})]}),"\n",(0,i.jsx)(e.span,{className:"line",children:(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"    {"})}),"\n",(0,i.jsxs)(e.span,{className:"line",children:[(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"      message"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-keyword)"},children:":"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'Invalid email'"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-punctuation)"},children:","})]}),"\n",(0,i.jsxs)(e.span,{className:"line",children:[(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"      path"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-keyword)"},children:":"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'email'"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-punctuation)"},children:","})]}),"\n",(0,i.jsxs)(e.span,{className:"line",children:[(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"      code"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-keyword)"},children:":"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'invalid_email'"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-punctuation)"},children:","})]}),"\n",(0,i.jsxs)(e.span,{className:"line",children:[(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"    }"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-punctuation)"},children:","})]}),"\n",(0,i.jsx)(e.span,{className:"line",children:(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"    {"})}),"\n",(0,i.jsxs)(e.span,{className:"line",children:[(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"      message"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-keyword)"},children:":"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'Invalid address'"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-punctuation)"},children:","})]}),"\n",(0,i.jsxs)(e.span,{className:"line",children:[(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"      path"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-keyword)"},children:":"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" ["}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'addresses'"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-constant)"},children:"0"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'line1'"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"]"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-punctuation)"},children:","})]}),"\n",(0,i.jsxs)(e.span,{className:"line",children:[(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"      code"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-keyword)"},children:":"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'empty_string'"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-punctuation)"},children:","})]}),"\n",(0,i.jsxs)(e.span,{className:"line",children:[(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"    }"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-punctuation)"},children:","})]}),"\n",(0,i.jsxs)(e.span,{className:"line",children:[(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"  ]"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-punctuation)"},children:","})]}),"\n",(0,i.jsx)(e.span,{className:"line",children:(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"});"})}),"\n",(0,i.jsx)(e.span,{className:"line",children:" "}),"\n",(0,i.jsxs)(e.span,{className:"line",children:[(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-constant)"},children:"console"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-function)"},children:".log"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-token-constant)"},children:"e422"}),(0,i.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:".issues);"})]})]})}),"\n",(0,i.jsxs)(e.blockquote,{children:["\n",(0,i.jsxs)(e.p,{children:["For reference, see ",(0,i.jsx)(e.a,{href:"https://docs.github.com/en/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#client-errors",children:"github api"}),", rails or\napi-plaform."]}),"\n"]})]})}e.default=(0,r.j)({MDXContent:function(){let s=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:e}=Object.assign({},(0,o.a)(),s.components);return e?(0,i.jsx)(e,{...s,children:(0,i.jsx)(t,{...s})}):t(s)},pageOpts:{filePath:"src/pages/exception/recipes.mdx",route:"/exception/recipes",timestamp:1702136222e3,title:"Recipes",headings:l},pageNextRoute:"/exception/recipes"})}},function(s){s.O(0,[9304,2888,9774,179],function(){return s(s.s=1507)}),_N_E=s.O()}]);