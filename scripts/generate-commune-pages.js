import fs from 'fs';
import path from 'path';
import dvhcvn from 'dvhcvn';
import { getSlug } from '../src/utils/slugify.js';

const __dirname = path.resolve();

// Full 34 Merged Provinces after sáp nhập (Phases 1, 2, 3, 4)
const mergedProvinces = [
  // Miền Bắc (Phase 1 & Phase 2)
  { name: "Thành phố Hà Nội", slug: "ha-noi", codes: ["01"] },
  { name: "Tỉnh Quảng Ninh", slug: "quang-ninh", codes: ["22"] },
  { name: "Tỉnh Bắc Ninh", slug: "bac-ninh", codes: ["24", "27"] }, // Bắc Giang & Bắc Ninh
  { name: "Thành phố Hải Phòng", slug: "hai-phong", codes: ["30", "31"] }, // Hải Dương & Hải Phòng
  { name: "Tỉnh Cao Bằng", slug: "cao-bang", codes: ["04"] },
  { name: "Tỉnh Điện Biên", slug: "dien-bien", codes: ["11"] },
  { name: "Tỉnh Lai Châu", slug: "lai-chau", codes: ["12"] },
  { name: "Tỉnh Lạng Sơn", slug: "lang-son", codes: ["20"] },
  { name: "Tỉnh Sơn La", slug: "son-la", codes: ["14"] },
  { name: "Tỉnh Tuyên Quang", slug: "tuyen-quang", codes: ["02", "08"] }, // Hà Giang & Tuyên Quang
  { name: "Tỉnh Lào Cai", slug: "lao-cai", codes: ["10", "15"] }, // Lào Cai & Yên Bái
  { name: "Tỉnh Thái Nguyên", slug: "thai-nguyen", codes: ["06", "19"] }, // Bắc Kạn & Thái Nguyên
  { name: "Tỉnh Phú Thọ", slug: "phu-tho", codes: ["26", "17", "25"] }, // Vĩnh Phúc, Hòa Bình & Phú Thọ
  { name: "Tỉnh Hưng Yên", slug: "hung-yen", codes: ["34", "33"] }, // Thái Bình & Hưng Yên
  { name: "Tỉnh Ninh Bình", slug: "ninh-binh", codes: ["35", "36", "37"] }, // Hà Nam, Nam Định & Ninh Bình

  // Miền Nam (Phase 3)
  { name: "Thành phố Hồ Chí Minh", slug: "ho-chi-minh", codes: ["77", "74", "79"] }, // Bà Rịa-Vũng Tàu, Bình Dương & TP. HCM
  { name: "Tỉnh Đồng Nai", slug: "dong-nai", codes: ["70", "75"] }, // Bình Phước & Đồng Nai
  { name: "Tỉnh Tây Ninh", slug: "tay-ninh", codes: ["80", "72"] }, // Long An & Tây Ninh
  { name: "Thành phố Cần Thơ", slug: "can-tho", codes: ["94", "93", "92"] }, // Sóc Trăng, Hậu Giang & Cần Thơ
  { name: "Tỉnh Vĩnh Long", slug: "vinh-long", codes: ["83", "86", "84"] }, // Bến Tre, Vĩnh Long & Trà Vinh
  { name: "Tỉnh Đồng Tháp", slug: "dong-thap", codes: ["82", "87"] }, // Tiền Giang & Đồng Tháp
  { name: "Tỉnh Cà Mau", slug: "ca-mau", codes: ["95", "96"] }, // Bạc Liêu & Cà Mau
  { name: "Tỉnh An Giang", slug: "an-giang", codes: ["91", "89"] }, // Kiên Giang & An Giang

  // Miền Trung (Phase 4)
  { name: "Thành phố Huế", slug: "hue", codes: ["46"] }, // Thừa Thiên Huế
  { name: "Tỉnh Hà Tĩnh", slug: "ha-tinh", codes: ["42"] },
  { name: "Tỉnh Nghệ An", slug: "nghe-an", codes: ["40"] },
  { name: "Tỉnh Thanh Hóa", slug: "thanh-hoa", codes: ["38"] },
  { name: "Tỉnh Quảng Trị", slug: "quang-tri", codes: ["44", "45"] }, // Quảng Bình & Quảng Trị
  { name: "Thành phố Đà Nẵng", slug: "da-nang", codes: ["49", "48"] }, // Quảng Nam & Đà Nẵng
  { name: "Tỉnh Quảng Ngãi", slug: "quang-ngai", codes: ["62", "51"] }, // Kon Tum & Quảng Ngãi
  { name: "Tỉnh Gia Lai", slug: "gia-lai", codes: ["52", "64"] }, // Bình Định & Gia Lai
  { name: "Tỉnh Khánh Hòa", slug: "khanh-hoa", codes: ["58", "56"] }, // Ninh Thuận & Khánh Hòa
  { name: "Tỉnh Lâm Đồng", slug: "lam-dong", codes: ["67", "60", "68"] }, // Đắk Nông, Bình Thuận & Lâm Đồng
  { name: "Tỉnh Đắk Lắk", slug: "dak-lak", codes: ["54", "66"] } // Phú Yên & Đắk Lắk
];

async function generateData() {
  console.log("Generating regions.json with merged provinces...");
  const regions = [];
  
  for (const target of mergedProvinces) {
    const provinceObj = {
      name: target.name,
      code: target.slug, // Use slug as code
      slug: target.slug,
      districts: []
    };
    
    // Find matching level 1 items in dvhcvn
    const matchingProvinces = dvhcvn.level1s.filter(p => target.codes.includes(p.id));
    
    for (const p of matchingProvinces) {
      for (const d of p.children) {
        const districtObj = {
          name: d.name,
          code: d.id,
          slug: getSlug(d.name),
          wards: []
        };
        
        for (const w of d.children) {
          districtObj.wards.push({
            name: w.name,
            code: w.id,
            slug: getSlug(w.name)
          });
        }
        provinceObj.districts.push(districtObj);
      }
    }
    regions.push(provinceObj);
  }
  
  const regionsPath = path.join(__dirname, 'src/data/regions.json');
  fs.writeFileSync(regionsPath, JSON.stringify(regions, null, 2));
  console.log(`Wrote ${regions.length} merged provinces to regions.json`);

  // Now generate new URLs for searchIndex and sitemap
  console.log("Updating searchIndex and sitemap...");
  const searchEntries = [];
  const sitemapUrls = [];
  
  regions.forEach(prov => {
    prov.districts.forEach(dist => {
      const wardsList = dist.wards.map(w => ({
        name: w.name,
        rawSlug: getSlug(w.name),
        districtName: dist.name
      }));
      
      const slugCounts = {};
      wardsList.forEach(w => {
        slugCounts[w.rawSlug] = (slugCounts[w.rawSlug] || 0) + 1;
      });
      
      wardsList.forEach(w => {
        const finalSlug = slugCounts[w.rawSlug] > 1 
          ? `${w.rawSlug}-${getSlug(w.districtName)}` 
          : w.rawSlug;
          
        const url = `/calculators/lich-cat-dien/${prov.slug}/${finalSlug}/`;
        
        let unitType = "Xã";
        if (w.name.toLowerCase().startsWith("phương") || w.name.toLowerCase().startsWith("phường")) {
          unitType = "Phường";
        } else if (w.name.toLowerCase().startsWith("thị trấn")) {
          unitType = "Thị trấn";
        } else if (w.name.toLowerCase().startsWith("đặc khu")) {
          unitType = "Đặc khu";
        }
        const cleanWardName = w.name.replace(/^(Phường|Xã|Thị trấn|Đặc khu)\s+/gi, '').trim();

        sitemapUrls.push(`  <url>\n    <loc>https://trolyso.com${url}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`);
        
        searchEntries.push(`          { title: "Lịch cắt điện ${unitType} ${cleanWardName} - ${prov.name}", desc: "Tra cứu lịch cúp điện chi tiết tại ${unitType.toLowerCase()} ${cleanWardName}, ${prov.name} hôm nay.", url: "${url}" }`);
      });
    });
  });

  // Inject into Layout.astro
  const layoutPath = path.join(__dirname, 'src/layouts/Layout.astro');
  let layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  // Clean up any previously injected dynamic entries if we re-run
  layoutContent = layoutContent.replace(/\/\* DYNAMIC_COMMUNES_START \*\/[\s\S]*?\/\* DYNAMIC_COMMUNES_END \*\//, '');
  
  // Inject new entries
  const injectionStr = `/* DYNAMIC_COMMUNES_START */\n${searchEntries.join(',\n')}\n/* DYNAMIC_COMMUNES_END */\n`;
  layoutContent = layoutContent.replace('        ];', `${injectionStr}        ];`);
  
  fs.writeFileSync(layoutPath, layoutContent);
  console.log(`Injected ${searchEntries.length} items into Layout.astro searchIndex.`);

  // Inject into sitemap.xml
  const sitemapPath = path.join(__dirname, 'public/sitemap.xml');
  let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  
  sitemapContent = sitemapContent.replace(/<!-- DYNAMIC_COMMUNES_START -->[\s\S]*?<!-- DYNAMIC_COMMUNES_END -->/, '');
  const sitemapInjectionStr = `<!-- DYNAMIC_COMMUNES_START -->\n${sitemapUrls.join('\n')}\n<!-- DYNAMIC_COMMUNES_END -->\n`;
  sitemapContent = sitemapContent.replace('</urlset>', `${sitemapInjectionStr}</urlset>`);
  
  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log(`Injected ${sitemapUrls.length} items into sitemap.xml.`);

  // Update [tinh]/[xa]/index.astro to use dynamic rawRegions loop
  const astroPath = path.join(__dirname, 'src/pages/calculators/lich-cat-dien/[tinh]/[xa]/index.astro');
  let astroContent = fs.readFileSync(astroPath, 'utf8');
  
  // Replace the entire getStaticPaths function to dynamically loop rawRegions
  const newGetStaticPaths = `export async function getStaticPaths() {
  const paths = [];
  
  rawRegions.forEach(prov => {
    const wards = [];
    prov.districts.forEach(dist => {
      dist.wards.forEach(w => {
        wards.push({
          name: w.name,
          rawSlug: getSlug(w.name),
          districtName: dist.name,
          code: w.code
        });
      });
    });
    
    const slugCounts = {};
    wards.forEach(w => {
      slugCounts[w.rawSlug] = (slugCounts[w.rawSlug] || 0) + 1;
    });
    
    wards.forEach(w => {
      const finalSlug = slugCounts[w.rawSlug] > 1 
        ? \`\${w.rawSlug}-\${getSlug(w.districtName)}\` 
        : w.rawSlug;
        
      paths.push({
        params: {
          tinh: prov.slug,
          xa: finalSlug
        },
        props: {
          provinceName: prov.name,
          wardName: w.name,
          districtName: w.districtName,
          code: w.code
        }
      });
    });
  });
  
  return paths;
}`;

  // Find export async function getStaticPaths() and replace it
  astroContent = astroContent.replace(/export async function getStaticPaths\(\) \{[\s\S]*?\n\}/, newGetStaticPaths);
  
  fs.writeFileSync(astroPath, astroContent);
  console.log(`Updated getStaticPaths in [tinh]/[xa]/index.astro to be dynamic`);
  
  console.log("Done generating commune pages setup!");
}

generateData();
