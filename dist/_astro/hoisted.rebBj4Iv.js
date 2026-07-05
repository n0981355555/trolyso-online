import"./hoisted.CnadU4V_.js";let d=[{id:1,company:"Công ty Cổ phần X",title:"Nhân viên Hành chính Tổng hợp",date:"01/2024 - Hiện tại",desc:"Quản lý văn thư lưu trữ, soạn thảo các thông báo hành chính nội bộ chính xác. Tổ chức sắp xếp hồ sơ và điều hành đội ngũ văn phòng suôn sẻ."}],l=[{id:1,school:"Đại học Khoa học Xã hội và Nhân văn",degree:"Cử nhân Quản trị Văn phòng",date:"2020 - 2024",desc:"Tốt nghiệp loại Giỏi. Nghiên cứu sâu về quy trình tối ưu hóa hành chính công và tin học văn phòng nâng cao."}];const m=document.getElementById("cvName"),E=document.getElementById("cvTitle"),o=document.getElementById("cvEmail"),c=document.getElementById("cvPhone"),p=document.getElementById("cvAddress"),k=document.getElementById("cvSummary"),f=document.getElementById("cvSkills"),L=document.getElementById("pvName"),T=document.getElementById("pvTitle"),w=document.getElementById("pvEmail"),I=document.getElementById("pvPhone"),B=document.getElementById("pvAddress"),$=document.getElementById("pvSummary"),x=document.getElementById("pvSkills"),g=document.getElementById("expInputsList"),u=document.getElementById("pvExpList"),M=document.getElementById("btnAddExp"),y=document.getElementById("eduInputsList"),b=document.getElementById("pvEduList"),S=document.getElementById("btnAddEdu"),s=document.getElementById("btnExportPDF"),P=document.getElementById("cvPaper");function C(){L.textContent=m.value||"Tên Của Bạn",T.textContent=E.value||"Vị trí ứng tuyển",w.textContent=o.value?`✉ ${o.value}`:"✉ email@gmail.com",I.textContent=c.value?`📞 ${c.value}`:"📞 0900.000.000",B.textContent=p.value?`📍 ${p.value}`:"📍 Địa chỉ liên lạc",$.textContent=k.value||"Tóm tắt giới thiệu bản thân...",x.innerHTML="",f.value.split(",").map(t=>t.trim()).filter(t=>t.length>0).forEach(t=>{const n=document.createElement("li");n.textContent=t,x.appendChild(n)})}[m,E,o,c,p,k,f].forEach(e=>{e.addEventListener("input",C)});function v(){g.innerHTML="",u.innerHTML="",d.forEach((e,t)=>{const n=document.createElement("div");n.className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 relative space-y-2",n.innerHTML=`
          <button class="absolute top-2 right-2 text-red-500 text-xs font-bold hover:underline" onclick="this.dispatchEvent(new CustomEvent('remove-exp', {bubbles: true, detail: ${e.id}}))">✕ Xóa</button>
          <div>
            <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Tên công ty / Cơ quan</label>
            <input type="text" value="${e.company}" class="inp-company w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-darkCard text-xs font-bold" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Chức danh</label>
              <input type="text" value="${e.title}" class="inp-title w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-darkCard text-xs font-semibold" />
            </div>
            <div>
              <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Thời gian</label>
              <input type="text" value="${e.date}" class="inp-date w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-darkCard text-xs font-semibold" />
            </div>
          </div>
          <div>
            <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Mô tả công việc</label>
            <textarea rows="2" class="inp-desc w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-darkCard text-xs font-semibold">${e.desc}</textarea>
          </div>
        `,n.querySelector(".inp-company").addEventListener("input",a=>{d[t].company=a.target.value,r()}),n.querySelector(".inp-title").addEventListener("input",a=>{d[t].title=a.target.value,r()}),n.querySelector(".inp-date").addEventListener("input",a=>{d[t].date=a.target.value,r()}),n.querySelector(".inp-desc").addEventListener("input",a=>{d[t].desc=a.target.value,r()}),g.appendChild(n)}),r()}function r(){u.innerHTML="",d.forEach(e=>{const t=document.createElement("div");t.className="space-y-1",t.innerHTML=`
          <div class="flex justify-between items-baseline font-semibold text-[11px] text-slate-900">
            <span class="font-bold">${e.company}</span>
            <span class="text-slate-500 font-normal">${e.date}</span>
          </div>
          <div class="text-[10.5px] italic text-slate-700 font-semibold mb-1">${e.title}</div>
          <p class="text-slate-600 leading-relaxed text-[11px] whitespace-pre-line">${e.desc}</p>
        `,u.appendChild(t)})}function h(){y.innerHTML="",b.innerHTML="",l.forEach((e,t)=>{const n=document.createElement("div");n.className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 relative space-y-2",n.innerHTML=`
          <button class="absolute top-2 right-2 text-red-500 text-xs font-bold hover:underline" onclick="this.dispatchEvent(new CustomEvent('remove-edu', {bubbles: true, detail: ${e.id}}))">✕ Xóa</button>
          <div>
            <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Tên trường học / Cơ sở đào tạo</label>
            <input type="text" value="${e.school}" class="inp-school w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-darkCard text-xs font-bold" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Bằng cấp / Ngành học</label>
              <input type="text" value="${e.degree}" class="inp-degree w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-darkCard text-xs font-semibold" />
            </div>
            <div>
              <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Thời gian học</label>
              <input type="text" value="${e.date}" class="inp-date w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-darkCard text-xs font-semibold" />
            </div>
          </div>
          <div>
            <label class="block text-[10px] text-slate-450 dark:text-slate-500 mb-0.5">Thành tích / Mô tả</label>
            <textarea rows="2" class="inp-desc w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-darkCard text-xs font-semibold">${e.desc}</textarea>
          </div>
        `,n.querySelector(".inp-school").addEventListener("input",a=>{l[t].school=a.target.value,i()}),n.querySelector(".inp-degree").addEventListener("input",a=>{l[t].degree=a.target.value,i()}),n.querySelector(".inp-date").addEventListener("input",a=>{l[t].date=a.target.value,i()}),n.querySelector(".inp-desc").addEventListener("input",a=>{l[t].desc=a.target.value,i()}),y.appendChild(n)}),i()}function i(){b.innerHTML="",l.forEach(e=>{const t=document.createElement("div");t.className="space-y-1",t.innerHTML=`
          <div class="flex justify-between items-baseline font-semibold text-[11px] text-slate-900">
            <span class="font-bold">${e.school}</span>
            <span class="text-slate-500 font-normal">${e.date}</span>
          </div>
          <div class="text-[10.5px] italic text-slate-700 font-semibold mb-1">${e.degree}</div>
          <p class="text-slate-600 leading-relaxed text-[11px] whitespace-pre-line">${e.desc}</p>
        `,b.appendChild(t)})}M.addEventListener("click",()=>{const e=d.length>0?Math.max(...d.map(t=>t.id))+1:1;d.push({id:e,company:"Tên Công ty Mới",title:"Chức danh công việc",date:"01/2024 - 06/2024",desc:"Mô tả tóm tắt kinh nghiệm..."}),v()});S.addEventListener("click",()=>{const e=l.length>0?Math.max(...l.map(t=>t.id))+1:1;l.push({id:e,school:"Tên Trường học Mới",degree:"Chuyên ngành học",date:"2020 - 2024",desc:"Mô tả học tập, điểm số hoặc giải thưởng..."}),h()});document.addEventListener("remove-exp",e=>{d=d.filter(t=>t.id!==e.detail),v()});document.addEventListener("remove-edu",e=>{l=l.filter(t=>t.id!==e.detail),h()});s.addEventListener("click",()=>{s.disabled=!0,s.textContent="ĐANG XUẤT...";const e={margin:0,filename:`${m.value.replace(/\s+/g,"-").toLowerCase()}-cv.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2.5,useCORS:!0},jsPDF:{unit:"in",format:"letter",orientation:"portrait"}};html2pdf().from(P).set(e).save().then(()=>{s.disabled=!1,s.textContent="XUẤT PDF"}).catch(t=>{console.error(t),alert("Lỗi xuất file PDF."),s.disabled=!1,s.textContent="XUẤT PDF"})});C();v();h();
