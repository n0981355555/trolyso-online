import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgLightLogo = `
<svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- White Background -->
  <rect width="500" height="500" fill="#FFFFFF"/>

  <!-- trolyso.online Wordmark (Centered vertically & horizontally) -->
  <text x="250" y="265" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="52" font-weight="800" letter-spacing="-0.03em">
    <tspan fill="#0063b6">trolyso</tspan><tspan fill="#49a2dc" font-weight="600">.online</tspan>
  </text>
</svg>
`;

const svgDarkLogo = `
<svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Dark Background (#0F172A) -->
  <rect width="500" height="500" fill="#0F172A"/>

  <!-- trolyso.online Wordmark (Centered vertically & horizontally) -->
  <text x="250" y="265" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="52" font-weight="800" letter-spacing="-0.03em">
    <tspan fill="#FFFFFF">trolyso</tspan><tspan fill="#49a2dc" font-weight="600">.online</tspan>
  </text>
</svg>
`;

const svgFbCover = `
<svg width="851" height="315" viewBox="0 0 851 315" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- White Background -->
  <rect width="851" height="315" fill="#FFFFFF"/>

  <!-- trolyso.online Wordmark (Centered vertically & horizontally for Facebook Cover) -->
  <text x="425.5" y="172" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="72" font-weight="800" letter-spacing="-0.03em">
    <tspan fill="#0063b6">trolyso</tspan><tspan fill="#49a2dc" font-weight="600">.online</tspan>
  </text>
</svg>
`;

async function main() {
  const desktopLightPath = 'C:/Users/JUNE/Desktop/logo-trolyso-light.png';
  const desktopDarkPath = 'C:/Users/JUNE/Desktop/logo-trolyso-dark.png';
  const desktopFbPath = 'C:/Users/JUNE/Desktop/logo-trolyso-facebook-cover.png';
  
  const publicLightPath = './public/logo-light.png';
  const publicDarkPath = './public/logo-dark.png';

  // Generate Light Logo
  await sharp(Buffer.from(svgLightLogo))
    .png()
    .toFile(desktopLightPath);
  console.log(`Successfully generated light logo at: ${desktopLightPath}`);

  await sharp(Buffer.from(svgLightLogo))
    .png()
    .toFile(publicLightPath);

  // Generate Dark Logo
  await sharp(Buffer.from(svgDarkLogo))
    .png()
    .toFile(desktopDarkPath);
  console.log(`Successfully generated dark logo at: ${desktopDarkPath}`);

  await sharp(Buffer.from(svgDarkLogo))
    .png()
    .toFile(publicDarkPath);

  // Generate FB Cover Logo
  await sharp(Buffer.from(svgFbCover))
    .png()
    .toFile(desktopFbPath);
  console.log(`Successfully generated facebook cover at: ${desktopFbPath}`);
}

main().catch(console.error);
