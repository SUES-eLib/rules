class LocalSearch{constructor({path:t="",unescape:e=!1,top_n_per_article:n=1}){this.path=t,this.unescape=e,this.top_n_per_article=n,this.isfetched=!1,this.datas=null}getIndexByWord(t,e,n=!1){const s=[],o=new Set;return n||(e=e.toLowerCase()),t.forEach((t=>{if(this.unescape){const e=document.createElement("div");e.innerText=t,t=e.innerHTML}const r=t.length;if(0===r)return;let h=0,i=-1;for(n||(t=t.toLowerCase());(i=e.indexOf(t,h))>-1;)s.push({position:i,word:t}),o.add(t),h=i+r})),s.sort(((t,e)=>t.position!==e.position?t.position-e.position:e.word.length-t.word.length)),[s,o]}mergeIntoSlice(t,e,n){let s=n[0],{position:o,word:r}=s;const h=[],i=new Set;for(;o+r.length<=e&&0!==n.length;){i.add(r),h.push({position:o,length:r.length});const t=o+r.length;for(n.shift();0!==n.length&&(s=n[0],o=s.position,r=s.word,t>o);)n.shift()}return{hits:h,start:t,end:e,count:i.size}}highlightKeyword(t,e){let n="",s=e.start;for(const{position:o,length:r}of e.hits)n+=t.substring(s,o),s=o+r,n+=`<mark class="search-keyword">${t.substr(o,r)}</mark>`;return n+=t.substring(s,e.end),n}getResultItems(t){const e=[];return this.datas.forEach((({title:n,content:s,url:o})=>{const[r,h]=this.getIndexByWord(t,n),[i,l]=this.getIndexByWord(t,s),a=new Set([...h,...l]).size,c=r.length+i.length;if(0===c)return;const d=[];0!==r.length&&d.push(this.mergeIntoSlice(0,n.length,r));let g=[];for(;0!==i.length;){const t=i[0],{position:e}=t,n=s.lastIndexOf("\n",e),o=-1==n?Math.max(0,e-20):Math.max(0,e-20,n),r=s.indexOf("\n",e),h=-1==r?Math.min(s.length,e+80):Math.min(s.length,e+80,r);g.push(this.mergeIntoSlice(o,h,i))}g.sort(((t,e)=>t.count!==e.count?e.count-t.count:t.hits.length!==e.hits.length?e.hits.length-t.hits.length:t.start-e.start));const u=parseInt(this.top_n_per_article,10);u>=0&&(g=g.slice(0,u));let p="";(o=new URL(o,location.origin)).searchParams.append("highlight",t.join(" ")),0!==d.length?p+=`<li><a href="${o.href}" class="search-result-title">${this.highlightKeyword(n,d[0])}</a>`:p+=`<li><a href="${o.href}" class="search-result-title">${n}</a>`,g.forEach((t=>{p+=`<p class="search-result">${this.highlightKeyword(s,t)}...</p>`})),p+="</li>",e.push({item:p,id:e.length,hitCount:c,includedCount:a})})),e}fetchData(){const t=!this.path.endsWith("json");fetch(this.path).then((t=>t.text())).then((e=>{this.isfetched=!0,this.datas=t?[...(new DOMParser).parseFromString(e,"text/xml").querySelectorAll("entry")].map((t=>({title:t.querySelector("title").textContent,content:t.querySelector("content").textContent,url:t.querySelector("url").textContent}))):JSON.parse(e),this.datas=this.datas.filter((t=>t.title)).map((t=>(t.title=t.title.trim(),t.content=t.content?t.content.trim().replace(/<[^>]+>/g,""):"",t.url=decodeURIComponent(t.url).replace(/\/{2,}/g,"/"),t))),window.dispatchEvent(new Event("search:loaded"))}))}highlightText(t,e,n){const s=t.nodeValue;let o=e.start;const r=[];for(const{position:t,length:h}of e.hits){const e=document.createTextNode(s.substring(o,t));o=t+h;const i=document.createElement("mark");i.className=n,i.appendChild(document.createTextNode(s.substr(t,h))),r.push(e,i)}t.nodeValue=s.substring(o,e.end),r.forEach((e=>{t.parentNode.insertBefore(e,t)}))}highlightSearchWords(t){const e=new URL(location.href).searchParams.get("highlight"),n=e?e.split(" "):[];if(!n.length||!t)return;const s=document.createTreeWalker(t,NodeFilter.SHOW_TEXT,null),o=[];for(;s.nextNode();)s.currentNode.parentNode.matches("button, select, textarea")||o.push(s.currentNode);o.forEach((t=>{const[e]=this.getIndexByWord(n,t.nodeValue);if(!e.length)return;const s=this.mergeIntoSlice(0,t.nodeValue.length,e);this.highlightText(t,s,"search-keyword")}))}}