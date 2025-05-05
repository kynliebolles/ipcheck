const fs = require('fs');
const path = require('path');

// 读取保存的优化版本站点地图
const optimizedSitemap = fs.readFileSync(
  path.join(__dirname, '../optimized-sitemap-0.xml'),
  'utf8'
);

// 将优化版本恢复到站点地图文件
fs.writeFileSync(
  path.join(__dirname, '../public/sitemap-0.xml'),
  optimizedSitemap,
  'utf8'
);

console.log('✅ 已恢复优化版本的站点地图');
