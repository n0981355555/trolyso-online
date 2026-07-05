import"./hoisted.mcbUyHrW.js";const d=document.getElementById("dropZone"),l=document.getElementById("fileInput"),b=document.getElementById("filesListContainer"),u=document.getElementById("filesList"),s=document.getElementById("btnMerge");let r=[];d.addEventListener("click",()=>l.click());d.addEventListener("dragover",t=>{t.preventDefault(),d.classList.add("border-brand-blue","dark:border-brand-mint")});d.addEventListener("dragleave",()=>{d.classList.remove("border-brand-blue","dark:border-brand-mint")});d.addEventListener("drop",t=>{t.preventDefault(),d.classList.remove("border-brand-blue","dark:border-brand-mint");const e=Array.from(t.dataTransfer.files).filter(a=>a.type==="application/pdf");p(e)});l.addEventListener("change",()=>{const t=Array.from(l.files);p(t),l.value=""});function p(t){t.length!==0&&(t.forEach(e=>{r.some(a=>a.name===e.name&&a.size===e.size)||r.push({file:e,name:e.name,size:e.size})}),i())}function i(){if(u.innerHTML="",r.length===0){b.classList.add("hidden"),s.disabled=!0;return}b.classList.remove("hidden"),s.disabled=r.length<2,r.forEach((t,e)=>{const a=document.createElement("div");a.className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80 transition-all";const o=(t.size/1024).toFixed(1);a.innerHTML=`
          <div class="flex items-center gap-3 truncate pr-4">
            <span class="text-lg">📄</span>
            <div class="truncate">
              <span class="block font-bold text-slate-800 dark:text-slate-200 truncate text-sm">${t.name}</span>
              <span class="text-xs text-slate-450 dark:text-slate-500">${o} KB</span>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <!-- Move Up -->
            <button class="btn-up p-2 bg-white dark:bg-brand-darkCard hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 transition" ${e===0?'disabled class="opacity-30 cursor-not-allowed"':""}>
              ↑
            </button>
            <!-- Move Down -->
            <button class="btn-down p-2 bg-white dark:bg-brand-darkCard hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 transition" ${e===r.length-1?'disabled class="opacity-30 cursor-not-allowed"':""}>
              ↓
            </button>
            <!-- Delete -->
            <button class="btn-del p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-lg text-xs font-bold border border-transparent transition">
              ✕
            </button>
          </div>
        `,a.querySelector(".btn-up").addEventListener("click",()=>{if(e>0){const n=r[e];r[e]=r[e-1],r[e-1]=n,i()}}),a.querySelector(".btn-down").addEventListener("click",()=>{if(e<r.length-1){const n=r[e];r[e]=r[e+1],r[e+1]=n,i()}}),a.querySelector(".btn-del").addEventListener("click",()=>{r.splice(e,1),i()}),u.appendChild(a)})}s.addEventListener("click",async()=>{if(!(r.length<2)){s.disabled=!0,s.textContent="ĐANG GỘP FILE...";try{const t=await PDFLib.PDFDocument.create();for(const f of r){const g=await f.file.arrayBuffer(),c=await PDFLib.PDFDocument.load(g);(await t.copyPages(c,c.getPageIndices())).forEach(m=>t.addPage(m))}const e=await t.save(),a=new Blob([e],{type:"application/pdf"}),o=URL.createObjectURL(a),n=document.createElement("a");n.href=o,n.download="gop-file-viettoolbox.pdf",document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(o)}catch(t){console.error(t),alert("Gặp lỗi trong quá trình gộp file PDF. Vui lòng kiểm tra lại tính hợp lệ của file.")}finally{s.disabled=!1,s.textContent="GỘP FILE PDF"}}});
