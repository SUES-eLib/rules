document.getElementById("search-stats").innerText="正在下载搜索索引。",document.getElementById("search-result").style.display="none",document.getElementById("loading").style.display=null,document.addEventListener("DOMContentLoaded",(()=>{var e={preload:!1,trigger:"auto"};const t=new LocalSearch({path:"/rules/search.json",top_n_per_article:2,unescape:!1});t.fetchData();const n=document.querySelector(".search-input"),s=()=>{if(!t.isfetched)return void document.querySelector(".search-result-container").classList.remove("no-result");document.querySelector(".search-result-container").classList.add("no-result"),document.getElementById("loading").style.display="none",document.getElementById("search-result").style.display=null;const e=n.value.trim().toLowerCase(),s=e.split(/[-\s]+/),r=document.querySelector(".search-result-container"),o=document.getElementById("search-stats"),l=document.querySelector(".search-result-list");let d=[];e.length>0&&(d=t.getResultItems(s)),1===s.length&&""===s[0]||0===d.length?r.classList.add("no-result"):(d.sort(((e,t)=>e.includedCount!==t.includedCount?t.includedCount-e.includedCount:e.hitCount!==t.hitCount?t.hitCount-e.hitCount:t.id-e.id)),o.innerHTML="找到 ${hits} 个搜索结果".replace("${hits}",d.length),r.classList.remove("no-result"),l.innerHTML=d.map((e=>e.item)).join(""))};t.highlightSearchWords(document.querySelector(".post-body")),e.preload&&t.fetchData(),"auto"===e.trigger?n.addEventListener("input",s):(document.querySelector(".search-icon").addEventListener("click",s),n.addEventListener("keypress",(e=>{"Enter"===e.key&&s()}))),window.addEventListener("search:loaded",s)}));