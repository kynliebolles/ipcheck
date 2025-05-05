const fs = require('fs');
const path = require('path');

// 保存优化版本的站点地图
const optimizedSitemap = fs.readFileSync(
  path.join(__dirname, '../public/sitemap-0.xml'),
  'utf8'
);

// 将优化版本保存到临时文件
fs.writeFileSync(
  path.join(__dirname, '../optimized-sitemap-0.xml'),
  optimizedSitemap,
  'utf8'
);

console.log('✅ 已保存优化版本的站点地图');
