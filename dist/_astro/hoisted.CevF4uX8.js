import"./hoisted.CnadU4V_.js";let d=[{id:1,company:"Công ty Cổ phần X",title:"Nhân viên Hành chính Tổng hợp",date:"01/2024 - Hiện tại",desc:"Quản lý văn thư lưu trữ, soạn thảo các thông báo hành chính nội bộ chính xác. Tổ chức sắp xếp hồ sơ và điều hành đội ngũ văn phòng suôn sẻ."}],l=[{id:1,school:"Đại học Khoa học Xã hội và Nhân văn",degree:"Cử nhân Quản trị Văn phòng",date:"2020 - 2024",desc:"Tốt nghiệp loại Giỏi. Nghiên cứu sâu về quy trình tối ưu hóa hành chính công và tin học văn phòng nâng cao."}];const h=document.getElementById("cvName"),y=document.getElementById("cvTitle"),c=document.getElementById("cvEmail"),p=document.getElementById("cvPhone"),u=document.getElementById("cvAddress"),f=document.getElementById("cvSummary"),k=document.getElementById("cvSkills"),L=document.getElementById("pvName"),C=document.getElementById("pvTitle"),T=document.getElementById("pvEmail"),I=document.getElementById("pvPhone"),w=document.getElementById("pvAddress"),B=document.getElementById("pvSummary"),b=document.getElementById("pvSkills"),m=document.getElementById("expInputsList"),v=document.getElementById("pvExpList"),M=document.getElementById("btnAddExp"),g=document.getElementById("eduInputsList"),x=document.getElementById("pvEduList"),$=document.getElementById("btnAddEdu"),r=document.getElementById("btnUpdatePreview"),s=document.getElementById("btnExportPDF"),P=document.getElementById("cvPaper");function S(){L.textContent=h.value||"Tên Của Bạn",C.textContent=y.value||"Vị trí ứng tuyển",T.textContent=c.value?`✉ ${c.value}`:"✉ email@gmail.com",I.textContent=p.value?`📞 ${p.value}`:"📞 0900.000.000",w.textContent=u.value?`📍 ${u.value}`:"📍 Địa chỉ liên lạc",B.textContent=f.value||"Tóm tắt giới thiệu bản thân...",b.innerHTML="",k.value.split(",").map(t=>t.trim()).filter(t=>t.length>0).forEach(t=>{const n=document.createElement("li");n.textContent=t,b.appendChild(n)})}function i(){m.innerHTML="",d.forEach((e,t)=>{const n=document.createElement("div");n.className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 relative space-y-2",n.innerHTML=`
          <button class="absolute top-2 right-2 text-red-500 text-xs font-bold hover:underline" onclick="this.dispatchEvent(new CustomEvent('remove-exp', {bubbles: true, detail: ${e.id}}))">✕ Xóa</button>
          <div>
            <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Tên công ty / Cơ quan</label>
            <input type="text" value="${e.company}" class="inp-company w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-brand-darkCard text-xs font-bold" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Chức danh</label>
              <input type="text" value="${e.title}" class="inp-title w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-brand-darkCard text-xs font-semibold" />
            </div>
            <div>
              <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Thời gian</label>
              <input type="text" value="${e.date}" class="inp-date w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-brand-darkCard text-xs font-semibold" />
            </div>
          </div>
          <div>
            <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Mô tả công việc</label>
            <textarea rows="2" class="inp-desc w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-brand-darkCard text-xs font-semibold">${e.desc}</textarea>
          </div>
        `,n.querySelector(".inp-company").addEventListener("input",a=>{d[t].company=a.target.value}),n.querySelector(".inp-title").addEventListener("input",a=>{d[t].title=a.target.value}),n.querySelector(".inp-date").addEventListener("input",a=>{d[t].date=a.target.value}),n.querySelector(".inp-desc").addEventListener("input",a=>{d[t].desc=a.target.value}),m.appendChild(n)})}function H(){v.innerHTML="",d.forEach(e=>{const t=document.createElement("div");t.className="space-y-1",t.innerHTML=`
          <div class="flex justify-between items-baseline font-semibold text-[11px] text-slate-900">
            <span class="font-bold">${e.company}</span>
            <span class="text-slate-500 font-normal font-mono">${e.date}</span>
          </div>
          <div class="text-[10.5px] italic text-slate-700 font-semibold mb-1">${e.title}</div>
          <p class="text-slate-600 leading-relaxed text-[11px] whitespace-pre-line">${e.desc}</p>
        `,v.appendChild(t)})}function o(){g.innerHTML="",l.forEach((e,t)=>{const n=document.createElement("div");n.className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 relative space-y-2",n.innerHTML=`
          <button class="absolute top-2 right-2 text-red-500 text-xs font-bold hover:underline" onclick="this.dispatchEvent(new CustomEvent('remove-edu', {bubbles: true, detail: ${e.id}}))">✕ Xóa</button>
          <div>
            <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Tên trường học / Cơ sở đào tạo</label>
            <input type="text" value="${e.school}" class="inp-school w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-brand-darkCard text-xs font-bold" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Bằng cấp / Ngành học</label>
              <input type="text" value="${e.degree}" class="inp-degree w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-brand-darkCard text-xs font-semibold" />
            </div>
            <div>
              <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Thời gian học</label>
              <input type="text" value="${e.date}" class="inp-date w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-brand-darkCard text-xs font-semibold" />
            </div>
          </div>
          <div>
            <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Thành tích / Mô tả</label>
            <textarea rows="2" class="inp-desc w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-brand-darkCard text-xs font-semibold">${e.desc}</textarea>
          </div>
        `,n.querySelector(".inp-school").addEventListener("input",a=>{l[t].school=a.target.value}),n.querySelector(".inp-degree").addEventListener("input",a=>{l[t].degree=a.target.value}),n.querySelector(".inp-date").addEventListener("input",a=>{l[t].date=a.target.value}),n.querySelector(".inp-desc").addEventListener("input",a=>{l[t].desc=a.target.value}),g.appendChild(n)})}function N(){x.innerHTML="",l.forEach(e=>{const t=document.createElement("div");t.className="space-y-1",t.innerHTML=`
          <div class="flex justify-between items-baseline font-semibold text-[11px] text-slate-900">
            <span class="font-bold">${e.school}</span>
            <span class="text-slate-500 font-normal font-mono">${e.date}</span>
          </div>
          <div class="text-[10.5px] italic text-slate-700 font-semibold mb-1">${e.degree}</div>
          <p class="text-slate-600 leading-relaxed text-[11px] whitespace-pre-line">${e.desc}</p>
        `,x.appendChild(t)})}M.addEventListener("click",()=>{const e=d.length>0?Math.max(...d.map(t=>t.id))+1:1;d.push({id:e,company:"Tên Công ty Mới",title:"Chức danh công việc",date:"01/2024 - 06/2024",desc:"Mô tả tóm tắt kinh nghiệm..."}),i()});$.addEventListener("click",()=>{const e=l.length>0?Math.max(...l.map(t=>t.id))+1:1;l.push({id:e,school:"Tên Trường học Mới",degree:"Chuyên ngành học",date:"2020 - 2024",desc:"Mô tả học tập, điểm số hoặc giải thưởng..."}),o()});document.addEventListener("remove-exp",e=>{d=d.filter(t=>t.id!==e.detail),i()});document.addEventListener("remove-edu",e=>{l=l.filter(t=>t.id!==e.detail),o()});function E(){if(S(),H(),N(),r){const e=r.innerHTML;r.innerHTML="✓ ĐÃ CẬP NHẬT BẢN XEM TRƯỚC",r.classList.replace("bg-brand-blue","bg-emerald-500"),setTimeout(()=>{r.innerHTML=e,r.classList.replace("bg-emerald-500","bg-brand-blue")},1500)}}r.addEventListener("click",E);s.addEventListener("click",()=>{s.disabled=!0,s.textContent="ĐANG TẢI...";const e={margin:0,filename:`${h.value.replace(/\s+/g,"-").toLowerCase()}-cv.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2.5,useCORS:!0},jsPDF:{unit:"in",format:"letter",orientation:"portrait"}};html2pdf().from(P).set(e).save().then(()=>{s.disabled=!1,s.textContent="📥 TẢI FILE CV VỀ MÁY (PDF)"}).catch(t=>{console.error(t),alert("Lỗi xuất file PDF."),s.disabled=!1,s.textContent="📥 TẢI FILE CV VỀ MÁY (PDF)"})});E();i();o();
