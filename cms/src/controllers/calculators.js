import fs from 'fs';
import path from 'path';

export async function getCalculators(req, res) {
  try {
    const calcDir = path.resolve('../src/pages/calculators');
    
    if (!fs.existsSync(calcDir)) {
      return res.json([]);
    }

    const folders = fs.readdirSync(calcDir);
    const list = [];

    folders.forEach(folder => {
      const folderPath = path.join(calcDir, folder);
      const stat = fs.statSync(folderPath);

      if (stat.isDirectory()) {
        const astroFile = path.join(folderPath, 'index.astro');
        let title = folder.replace(/-/g, ' '); // Fallback human readable
        title = title.charAt(0).toUpperCase() + title.slice(1);

        if (fs.existsSync(astroFile)) {
          try {
            const content = fs.readFileSync(astroFile, 'utf8');
            // Match title attribute in Layout component
            const match = content.match(/title=["']([^"']+)["']/i);
            if (match && match[1]) {
              // Strip site name to keep clean name
              title = match[1].replace(/\s*-\s*Trợ Lý Số.*$/i, '').trim();
            }
          } catch (e) {
            console.error(`Failed to read astro file for ${folder}:`, e);
          }
        }

        list.push({
          name: title,
          url: `/calculators/${folder}/`
        });
      }
    });

    return res.json(list);
  } catch (error) {
    console.error('Error fetching calculators:', error);
    return res.status(500).json({ message: 'Không thể tải danh sách công cụ' });
  }
}
