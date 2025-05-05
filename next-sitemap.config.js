/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ipcheck.tools',
  generateRobotsTxt: false, // 不生成 robots.txt，保留手动编辑的版本
  generateIndexSitemap: false, // 不生成索引站点地图
  autoLastmod: false, // 不自动更新 lastmod 时间
  outDir: './temp-sitemap', // 将生成的文件放在临时目录，不覆盖现有文件
  exclude: [
    '/*', // 排除所有路径，实际上禁用站点地图生成
  ],
  // 禁用默认的 alternateRefs，因为我们需要为每个页面单独定义
  alternateRefs: [],
  // 完全自定义站点地图生成
  transform: async (config, path) => {
    // 基本配置
    const result = {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [],
    };
    
    // 提取路径部分（不包括域名）
    const pathWithoutDomain = path.replace(config.siteUrl, '');
    
    // 检查是否是带有语言前缀的路径
    const langPathMatch = pathWithoutDomain.match(/^\/(en|zh|zh-Hant)(\/.*)?$/);
    
    if (langPathMatch) {
      // 页面路径（不包括语言代码）
      const pagePath = langPathMatch[2] || '';
      
      // 为其他语言添加 alternateRefs
      const langs = ['en', 'zh', 'zh-Hant'];
      result.alternateRefs = langs.map(lang => ({
        href: `${config.siteUrl}/${lang}${pagePath}`,
        hreflang: lang
      }));
    } else if (pathWithoutDomain === '') {
      // 根路径特殊处理
      result.alternateRefs = [
        { href: `${config.siteUrl}/en`, hreflang: 'en' },
        { href: `${config.siteUrl}/zh`, hreflang: 'zh' },
        { href: `${config.siteUrl}/zh-Hant`, hreflang: 'zh-Hant' },
      ];
    } else if (['/speedtest', '/ipdistance', '/privacy'].includes(pathWithoutDomain)) {
      // 非语言前缀的功能页面
      result.alternateRefs = [
        { href: `${config.siteUrl}/en${pathWithoutDomain}`, hreflang: 'en' },
        { href: `${config.siteUrl}/zh${pathWithoutDomain}`, hreflang: 'zh' },
        { href: `${config.siteUrl}/zh-Hant${pathWithoutDomain}`, hreflang: 'zh-Hant' },
      ];
    }
    
    return result;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
      {
        userAgent: 'AdsBot-Google-Mobile',
        allow: '/',
      },
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
    ],
  },
}
