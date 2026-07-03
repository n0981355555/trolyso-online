import"./hoisted.DU_6QoWZ.js";const u=document.getElementById("docGroup"),t=document.getElementById("docType"),h=document.getElementById("issuingAuthority"),c=document.getElementById("issuingSubAuthority"),d=document.getElementById("locationDate"),a=document.getElementById("docTitle"),m=document.getElementById("docSummary"),s=document.getElementById("docBody"),r=document.getElementById("signerRole"),g=document.getElementById("signerName"),o=document.getElementById("paperDocument"),B=document.getElementById("btnCopyDoc"),C={hanhchinh:[{value:"QuyetDinh",name:"Quyết định (cá biệt)"},{value:"NghiQuyet",name:"Nghị quyết (cá biệt)"},{value:"ChiThi",name:"Chỉ thị"},{value:"QuyChe",name:"Quy chế"},{value:"QuyDinh",name:"Quy định"},{value:"ThongBao",name:"Thông báo"},{value:"HuongDan",name:"Hướng dẫn"},{value:"ChuongTrinh",name:"Chương trình"},{value:"KeHoach",name:"Kế hoạch"},{value:"PhuongAn",name:"Phương án"},{value:"DeAn",name:"Đề án"},{value:"DuAn",name:"Dự án"},{value:"BaoCao",name:"Báo cáo"},{value:"BienBan",name:"Biên bản"},{value:"ToTrinh",name:"Tờ trình"},{value:"HopDong",name:"Hợp đồng"},{value:"CongVan",name:"Công văn"},{value:"CongDien",name:"Công điện"},{value:"BanGhiNho",name:"Bản ghi nhớ"},{value:"BanThoaThuan",name:"Bản thỏa thuận"},{value:"GiayUyQuyen",name:"Giấy ủy quyền"},{value:"GiayMoi",name:"Giấy mời"},{value:"GiayGioiThieu",name:"Giấy giới thiệu"},{value:"GiayNghiPhep",name:"Giấy nghỉ phép"},{value:"GiayDiDuong",name:"Giấy đi đường"},{value:"BienNhan",name:"Biên nhận"},{value:"PhieuGui",name:"Phiếu gửi"},{value:"PhieuChuyen",name:"Phiếu chuyển"},{value:"ThuCong",name:"Thư công"}],quypfam:[{value:"Luat",name:"Luật"},{value:"NghiQuyetQP",name:"Nghị quyết"},{value:"PhapLenh",name:"Pháp lệnh"},{value:"Lenh",name:"Lệnh"},{value:"QuyetDinhQP",name:"Quyết định"},{value:"ChiThiQP",name:"Chỉ thị"},{value:"ThongTu",name:"Thông tư"},{value:"NghiDinh",name:"Nghị định"},{value:"NghiQuyetLienTich",name:"Nghị quyết liên tịch"},{value:"ThongTuLienTich",name:"Thông tư liên tịch"},{value:"QuyCheQP",name:"Quy chế"},{value:"QuyDinhQP",name:"Quy định"},{value:"HienPhap",name:"Hiến pháp"},{value:"BoLuat",name:"Bộ luật"},{value:"LuatSuaDoi",name:"Luật sửa đổi, bổ sung"}]};function p(){const e=u.value,n=C[e];t&&(t.innerHTML=n.map(i=>`<option value="${i.value}">${i.name}</option>`).join(""))}t?.addEventListener("change",()=>{const e=t.options[t.selectedIndex].text;a&&(a.value=e.toUpperCase()),l()});u?.addEventListener("change",()=>{p();const e=t.options[t.selectedIndex].text;a&&(a.value=e.toUpperCase()),l()});function l(){if(!o)return;const e=h.value||"TÊN CƠ QUAN CHỦ QUẢN",n=c.value||"Số: ...",i=d.value||"..., ngày ... tháng ... năm ...",v=a.value||"TÊN VĂN BẢN",y=m.value||"Về việc ...",f=(s.value||"").replace(/\n/g,"<br />"),b=r.value||"CHỨC VỤ",x=g.value||"Họ và tên",T=`
      <!-- Header double-column table layout -->
      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', Times, serif; font-size: 13px; margin-bottom: 30px;">
        <tr>
          <td style="width: 45%; text-align: center; vertical-align: top;">
            <div style="font-weight: bold; text-transform: uppercase;">${e}</div>
            <div style="font-weight: bold; margin-top: 3px;">${n}</div>
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
        <h2 style="font-size: 15px; font-weight: bold; margin: 0; text-transform: uppercase; line-height: 1.3;">${v}</h2>
        <div style="font-size: 13px; font-style: italic; margin-top: 5px; font-weight: bold;">${y}</div>
        <div style="width: 100px; border-bottom: 1px solid black; margin: 10px auto 0 auto;"></div>
      </div>

      <!-- Main Body content -->
      <div style="font-family: 'Times New Roman', Times, serif; font-size: 13px; line-height: 1.5; text-align: justify; margin-bottom: 40px; text-indent: 20px;">
        ${f}
      </div>

      <!-- Signature & Recipient Area -->
      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', Times, serif; font-size: 13px;">
        <tr>
          <!-- Left column: Recipient (Nơi nhận) -->
          <td style="width: 50%; vertical-align: top; font-size: 11px; line-height: 1.4;">
            <div style="font-weight: bold; font-style: italic; font-size: 12px; margin-bottom: 5px;">Nơi nhận:</div>
            <div>- Như Điều 3;</div>
            <div>- Lưu: VT, HC.</div>
          </td>
          <!-- Right column: Signer -->
          <td style="width: 50%; text-align: center; vertical-align: top;">
            <div style="font-weight: bold; text-transform: uppercase;">${b}</div>
            <div style="font-style: italic; font-size: 12px; margin-top: 3px; color: #888888; height: 70px; display: flex; items-center; justify-content: center;">(Chữ ký, dấu)</div>
            <div style="font-weight: bold; margin-top: 10px; font-size: 14px;">${x}</div>
          </td>
        </tr>
      </table>
    `;o.innerHTML=T}[h,c,d,a,m,s,r,g].forEach(e=>{e.addEventListener("input",l)});B?.addEventListener("click",async()=>{if(o)try{const e="text/html",n=new Blob([o.innerHTML],{type:e}),i=[new ClipboardItem({[e]:n})];await navigator.clipboard.write(i),alert("Đã sao chép văn bản! Hãy mở Microsoft Word ra nhấn Ctrl+V để dán chuẩn Nghị định 30.")}catch{try{await navigator.clipboard.writeText(o.innerText),alert("Đã sao chép văn bản dạng chữ thường!")}catch{alert("Không thể tự động sao chép. Vui lòng tự bôi đen văn bản và nhấn Ctrl+C!")}}});p();l();
