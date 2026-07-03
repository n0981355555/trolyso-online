import"./hoisted.DU_6QoWZ.js";const c=document.getElementById("sigName"),g=document.getElementById("sigTitle"),p=document.getElementById("sigCompany"),m=document.getElementById("sigPhone"),y=document.getElementById("sigEmail"),h=document.getElementById("sigWebsite"),b=document.getElementById("sigTemplate"),l=document.getElementById("signatureContainer"),f=document.getElementById("btnCopySignature");function d(){if(!l)return;const t=c.value||"Họ và tên",e=g.value||"Chức vụ",i=p.value||"Tên công ty",a=m.value||"Số điện thoại",o=y.value||"contact@domain.com",n=h.value||"www.domain.com",r=b.value;let s="";r==="modern"?s=`
        <table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #333333; min-width: 320px;">
          <tr>
            <td style="vertical-align: top; padding-right: 15px; border-right: 3px solid #0063b6; padding-bottom: 5px;">
              <strong style="font-size: 18px; color: #0063b6;">${t}</strong>
              <div style="font-size: 13px; color: #666666; font-style: italic; margin-top: 2px;">${e}</div>
              <div style="font-size: 13px; font-weight: bold; color: #333333; margin-top: 4px;">${i}</div>
            </td>
            <td style="vertical-align: top; padding-left: 15px; padding-bottom: 5px; font-size: 13px; color: #555555;">
              <div style="margin-bottom: 3px;">📞 Phone: <a href="tel:${a}" style="color: #49a2dc; text-decoration: none;">${a}</a></div>
              <div style="margin-bottom: 3px;">✉️ Email: <a href="mailto:${o}" style="color: #49a2dc; text-decoration: none;">${o}</a></div>
              <div>🌐 Web: <a href="https://${n}" target="_blank" style="color: #49a2dc; text-decoration: none;">${n}</a></div>
            </td>
          </tr>
        </table>
      `:r==="classic"?s=`
        <table cellpadding="0" cellspacing="0" style="font-family: Georgia, serif; font-size: 14px; line-height: 1.6; color: #222222;">
          <tr>
            <td style="padding-bottom: 8px;">
              <strong style="font-size: 17px; color: #111111;">${t}</strong> | <span style="font-size: 13px; color: #555555;">${e}</span>
              <div style="font-size: 13px; font-weight: bold; color: #777777; margin-top: 2px;">${i}</div>
            </td>
          </tr>
          <tr style="border-top: 1px solid #dddddd;">
            <td style="padding-top: 8px; font-size: 12px; color: #666666; border-top: 1px solid #eeeeee;">
              <span style="margin-right: 15px;"><strong>Điện thoại:</strong> ${a}</span>
              <span style="margin-right: 15px;"><strong>Email:</strong> <a href="mailto:${o}" style="color: #0063b6; text-decoration: none;">${o}</a></span>
              <span><strong>Web:</strong> <a href="https://${n}" target="_blank" style="color: #0063b6; text-decoration: none;">${n}</a></span>
            </td>
          </tr>
        </table>
      `:r==="minimalist"&&(s=`
        <div style="font-family: Arial, sans-serif; font-size: 13px; color: #444444; line-height: 1.4;">
          <div style="font-size: 15px; font-weight: bold; color: #333333; margin-bottom: 2px;">${t}</div>
          <div style="color: #777777; margin-bottom: 6px;">${e} @ ${i}</div>
          <div style="color: #999999;">
            t: ${a} &nbsp;|&nbsp; e: <a href="mailto:${o}" style="color: #444444; text-decoration: none; font-weight: bold;">${o}</a> &nbsp;|&nbsp; w: <a href="https://${n}" target="_blank" style="color: #444444; text-decoration: none; font-weight: bold;">${n}</a>
          </div>
        </div>
      `),l.innerHTML=s}[c,g,p,m,y,h,b].forEach(t=>{t.addEventListener("input",d),t.addEventListener("change",d)});f?.addEventListener("click",async()=>{if(l)try{const t="text/html",e=new Blob([l.innerHTML],{type:t}),i=[new ClipboardItem({[t]:e})];await navigator.clipboard.write(i),alert("Đã sao chép chữ ký! Hãy mở Outlook/Gmail dán (Ctrl+V) vào ô chữ ký.")}catch{try{await navigator.clipboard.writeText(l.innerText),alert("Đã sao chép chữ ký dạng chữ thường!")}catch{alert("Không thể sao chép tự động. Vui lòng tự bôi đen chữ ký và nhấn Ctrl+C!")}}});d();
