const fs = require('fs');
const path = require('path');
const potrace = require('potrace');

async function traceFile(filePath, opt = {}) {
  return new Promise((resolve, reject) => {
    potrace.trace(filePath, { optCurve: true, optTolerance: 0.2, ...opt }, (err, svg) => {
      if (err) reject(err);
      else resolve(svg);
    });
  });
}

function extractPathD(svg) {
  const match = svg.match(/d="([^"]+)"/);
  return match ? match[1] : '';
}

async function run() {
  const logoLayers = [
    { name: 'logo_dark_green', color: '#033826' },
    { name: 'logo_teal', color: '#00d084' },
    { name: 'logo_neon', color: '#22ec76' },
    { name: 'logo_orange', color: '#ffba05' },
    { name: 'logo_idot', color: '#00c051' },
  ];

  const iconLayers = [
    { name: 'icon_white_d', color: '#ffffff' },
    { name: 'icon_teal', color: '#00d084' },
    { name: 'icon_neon', color: '#22ec76' },
    { name: 'icon_orange', color: '#ffba05' },
  ];

  const results = {};
  for (const layer of [...logoLayers, ...iconLayers]) {
    const bmpPath = `/tmp/masks/${layer.name}.bmp`;
    if (fs.existsSync(bmpPath)) {
      const svg = await traceFile(bmpPath);
      results[layer.name] = {
        d: extractPathD(svg),
        color: layer.color
      };
      console.log(`Layer ${layer.name} traced. Path length: ${results[layer.name].d.length}`);
    }
  }

  fs.writeFileSync('/tmp/masks/traced_layers.json', JSON.stringify(results, null, 2));
  console.log('Saved /tmp/masks/traced_layers.json');
}

run().catch(console.error);
