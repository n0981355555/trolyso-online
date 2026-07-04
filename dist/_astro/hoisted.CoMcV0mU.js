import"./hoisted.B5sk4XYo.js";const g=document.getElementById("docGroup"),s=document.getElementById("docType"),y=document.getElementById("issuingAuthority"),v=document.getElementById("issuingSubAuthority"),f=document.getElementById("locationDate"),c=document.getElementById("docTitle"),b=document.getElementById("docSummary"),x=document.getElementById("docBody"),r=document.getElementById("paperDocument"),E=document.getElementById("btnCopyDoc"),C=document.getElementById("btnDownloadDoc"),u=document.getElementById("showRecipient"),w=document.getElementById("recipientText"),p=document.getElementById("recipientInputWrapper"),h=document.getElementById("signerCount"),m=[{role:document.getElementById("signerRole1"),name:document.getElementById("signerName1"),wrapper:null},{role:document.getElementById("signerRole2"),name:document.getElementById("signerName2"),wrapper:document.getElementById("signerWrapper2")},{role:document.getElementById("signerRole3"),name:document.getElementById("signerName3"),wrapper:document.getElementById("signerWrapper3")},{role:document.getElementById("signerRole4"),name:document.getElementById("signerName4"),wrapper:document.getElementById("signerWrapper4")},{role:document.getElementById("signerRole5"),name:document.getElementById("signerName5"),wrapper:document.getElementById("signerWrapper5")}],I={hanhchinh:[{value:"QuyetDinh",name:"Quyết định (cá biệt)"},{value:"NghiQuyet",name:"Nghị quyết (cá biệt)"},{value:"ChiThi",name:"Chỉ thị"},{value:"QuyChe",name:"Quy chế"},{value:"QuyDinh",name:"Quy định"},{value:"ThongBao",name:"Thông báo"},{value:"HuongDan",name:"Hướng dẫn"},{value:"ChuongTrinh",name:"Chương trình"},{value:"KeHoach",name:"Kế hoạch"},{value:"PhuongAn",name:"Phương án"},{value:"DeAn",name:"Đề án"},{value:"DuAn",name:"Dự án"},{value:"BaoCao",name:"Báo cáo"},{value:"BienBan",name:"Biên bản"},{value:"ToTrinh",name:"Tờ trình"},{value:"HopDong",name:"Hợp đồng"},{value:"CongVan",name:"Công văn"},{value:"CongDien",name:"Công điện"},{value:"BanGhiNho",name:"Bản ghi nhớ"},{value:"BanThoaThuan",name:"Bản thỏa thuận"},{value:"GiayUyQuyen",name:"Giấy ủy quyền"},{value:"GiayMoi",name:"Giấy mời"},{value:"GiayGioiThieu",name:"Giấy giới thiệu"},{value:"GiayNghiPhep",name:"Giấy nghỉ phép"},{value:"GiayDiDuong",name:"Giấy đi đường"},{value:"BienNhan",name:"Biên nhận"},{value:"PhieuGui",name:"Phiếu gửi"},{value:"PhieuChuyen",name:"Phiếu chuyển"},{value:"ThuCong",name:"Thư công"}],quypfam:[{value:"Luat",name:"Luật"},{value:"NghiQuyetQP",name:"Nghị quyết"},{value:"PhapLenh",name:"Pháp lệnh"},{value:"Lenh",name:"Lệnh"},{value:"QuyetDinhQP",name:"Quyết định"},{value:"ChiThiQP",name:"Chỉ thị"},{value:"ThongTu",name:"Thông tư"},{value:"NghiDinh",name:"Nghị định"},{value:"NghiQuyetLienTich",name:"Nghị quyết liên tịch"},{value:"ThongTuLienTich",name:"Thông tư liên tịch"},{value:"QuyCheQP",name:"Quy chế"},{value:"QuyDinhQP",name:"Quy định"},{value:"HienPhap",name:"Hiến pháp"},{value:"BoLuat",name:"Bộ luật"},{value:"LuatSuaDoi",name:"Luật sửa đổi, bổ sung"}]};function T(){const e=g.value,t=I[e];s&&(s.innerHTML=t.map(i=>`<option value="${i.value}">${i.name}</option>`).join(""))}function B(){const e=parseInt(h.value);for(let t=1;t<m.length;t++){const i=m[t];i.wrapper&&(t<e?i.wrapper.classList.remove("hidden"):i.wrapper.classList.add("hidden"))}a()}u?.addEventListener("change",()=>{u.checked?p?.classList.remove("hidden"):p?.classList.add("hidden"),a()});w?.addEventListener("input",a);h?.addEventListener("change",B);s?.addEventListener("change",()=>{const e=s.options[s.selectedIndex].text;c&&(c.value=e.toUpperCase()),a()});g?.addEventListener("change",()=>{T();const e=s.options[s.selectedIndex].text;c&&(c.value=e.toUpperCase()),a()});function N(){const e=parseInt(h.value),t=[];for(let n=0;n<e;n++)t.push({role:m[n].role.value||`CHỨC DANH ${n+1}`,name:m[n].name.value||`Họ tên người ký ${n+1}`});let i="";u.checked&&(i=`
        <div style="font-weight: bold; font-style: italic; font-size: 12px; margin-bottom: 5px; text-align: left;">Nơi nhận:</div>
        <div style="text-align: left;">
          ${(w.value||"").split(`
`).map(o=>`<div style="font-size: 11px; line-height: 1.4; text-align: left;">${o}</div>`).join("")}
        </div>
      `);let d="";if(e===1)d=`
        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', Times, serif; font-size: 13px;">
          <tr>
            <td style="width: 45%; vertical-align: top; text-align: left;">
              ${i}
            </td>
            <td style="width: 55%; text-align: center; vertical-align: top;">
              <div style="font-weight: bold; text-transform: uppercase;">${t[0].role}</div>
              <div style="font-style: italic; font-size: 12px; margin-top: 3px; color: #888888; height: 65px; display: flex; align-items: center; justify-content: center;">(Chữ ký, dấu)</div>
              <div style="font-weight: bold; margin-top: 10px; font-size: 14px;">${t[0].name}</div>
            </td>
          </tr>
        </table>
      `;else{let n="";const o=[];o.push({left:t[1],right:t[0]}),e>=3&&o.push({left:t[3]||null,right:t[2]}),e===5&&o.push({left:null,right:t[4]}),n=o.map(l=>`
        <tr>
          <td style="width: 50%; text-align: center; vertical-align: top; padding-bottom: 25px;">
            ${l.left?`
              <div style="font-weight: bold; text-transform: uppercase;">${l.left.role}</div>
              <div style="font-style: italic; font-size: 12px; margin-top: 3px; color: #888888; height: 60px; display: flex; align-items: center; justify-content: center;">(Chữ ký)</div>
              <div style="font-weight: bold; margin-top: 10px; font-size: 14px;">${l.left.name}</div>
            `:""}
          </td>
          <td style="width: 50%; text-align: center; vertical-align: top; padding-bottom: 25px;">
            ${l.right?`
              <div style="font-weight: bold; text-transform: uppercase;">${l.right.role}</div>
              <div style="font-style: italic; font-size: 12px; margin-top: 3px; color: #888888; height: 60px; display: flex; align-items: center; justify-content: center;">(Chữ ký, dấu)</div>
              <div style="font-weight: bold; margin-top: 10px; font-size: 14px;">${l.right.name}</div>
            `:""}
          </td>
        </tr>
      `).join(""),d=`
        <!-- Nếu có nơi nhận, vẽ nơi nhận riêng ở phía trên bên trái signature block -->
        ${u.checked?`
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', Times, serif; font-size: 13px; margin-bottom: 15px;">
            <tr>
              <td style="width: 50%; vertical-align: top; text-align: left; padding-bottom: 10px;">
                ${i}
              </td>
              <td style="width: 50%;"></td>
            </tr>
          </table>
        `:""}

        <!-- Bảng chữ ký nhiều người -->
        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', Times, serif; font-size: 13px;">
          ${n}
        </table>
      `}return d}function a(){if(!r)return;const e=y.value||"TÊN CƠ QUAN CHỦ QUẢN",t=v.value||"Số: ...",i=f.value||"..., ngày ... tháng ... năm ...",d=c.value||"TÊN VĂN BẢN",n=b.value||"Về việc ...",o=(x.value||"").replace(/\n/g,"<br />"),l=`
      <!-- Header double-column table layout -->
      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', Times, serif; font-size: 13px; margin-bottom: 30px;">
        <tr>
          <td style="width: 45%; text-align: center; vertical-align: top;">
            <div style="font-weight: bold; text-transform: uppercase;">${e}</div>
            <div style="font-weight: bold; margin-top: 3px;">${t}</div>
            <div style="width: 60px; border-bottom: 1px solid black; margin: 8px auto 0 auto;"></div>
          </td>
          <td style="width: 55%; text-align: center; vertical-align: top; padding-left: 10px;">
            <div style="font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div style="font-weight: bold; text-decoration: underline; margin-top: 3px;">Độc lập - Tự do - Hạnh phúc</div>
            <div style="font-style: italic; margin-top: 8px;">${i}</div>
          </td>
        </tr>
      </table>

      <!-- Title area -->
      <div style="text-align: center; font-family: 'Times New Roman', Times, serif; margin-bottom: 25px;">
        <h2 style="font-size: 15px; font-weight: bold; margin: 0; text-transform: uppercase; line-height: 1.3;">${d}</h2>
        <div style="font-size: 13px; font-style: italic; margin-top: 5px; font-weight: bold;">${n}</div>
        <div style="width: 100px; border-bottom: 1px solid black; margin: 10px auto 0 auto;"></div>
      </div>

      <!-- Main Body content -->
      <div style="font-family: 'Times New Roman', Times, serif; font-size: 13px; line-height: 1.5; text-align: justify; margin-bottom: 40px; text-indent: 20px;">
        ${o}
      </div>

      <!-- Signature & Recipient Area -->
      ${N()}
    `;r.innerHTML=l}const L=[y,v,f,c,b,x];L.forEach(e=>{e.addEventListener("input",a)});m.forEach(e=>{e.role.addEventListener("input",a),e.name.addEventListener("input",a)});E?.addEventListener("click",async()=>{if(r)try{const e="text/html",t=new Blob([r.innerHTML],{type:e}),i=[new ClipboardItem({[e]:t})];await navigator.clipboard.write(i),alert("Đã sao chép văn bản! Hãy mở Microsoft Word ra nhấn Ctrl+V để dán chuẩn Nghị định 30.")}catch{try{await navigator.clipboard.writeText(r.innerText),alert("Đã sao chép văn bản dạng chữ thường!")}catch{alert("Không thể tự động sao chép. Vui lòng tự bôi đen văn bản và nhấn Ctrl+C!")}}});C?.addEventListener("click",()=>{if(!r)return;const t=`
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Van Ban Hanh Chinh</title>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; }
        table { border-collapse: collapse; width: 100%; }
        td { font-family: 'Times New Roman', serif; font-size: 13pt; vertical-align: top; }
      </style>
      </head>
      <body>
        ${r.innerHTML}
      </body>
      </html>
    `,i=new Blob(["\uFEFF"+t],{type:"application/msword"}),d=URL.createObjectURL(i),n=document.createElement("a");n.href=d,n.download="van-ban-hanh-chinh-trolyso.doc",document.body.appendChild(n),n.click(),document.body.removeChild(n)});T();B();a();
