# 功能开发指南 (Feature Development Guide)

本指南说明在 IP Check Tools 项目中新增功能时需要遵循的规范和步骤。

## 🎨 页面布局规范

### 标题区域布局
```jsx
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
  <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('title')}</h1>
  <Link 
    href={`/${locale}`}
    className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-white hover:text-black"
  >
    <svg>{/* 首页图标 */}</svg>
    <span>{t('back_home')}</span>
  </Link>
</div>
```

**布局要求：**
- ✅ 标题在左边：`text-2xl sm:text-3xl font-bold text-white`
- ✅ Home按钮在右边：小图标 + 文字
- ✅ 响应式设计：移动端垂直排列，桌面端水平排列

### 描述文本
```jsx
<p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto text-center">
  {t('description')}
</p>
```

**样式要求：**
- ✅ 居中对齐：`text-center mx-auto`
- ✅ 最大宽度：`max-w-2xl`
- ✅ 灰色文字：`text-gray-400`

## 📁 文件结构

### 1. 页面文件
```
src/app/[locale]/功能名/page.tsx
```

**必需内容：**
- 元数据生成 (`generateMetadata`)
- 结构化数据 (`generateStructuredData`)
- 多语言支持
- SEO优化

### 2. 组件文件
```
src/components/功能名Content.tsx
```

**组件规范：**
- 使用 `'use client'` 指令
- 导入必要的 hooks：`useTranslations`, `useLocale`
- 遵循布局规范
- 包含错误处理

### 3. API文件（如需要）
```
src/app/api/功能名/route.ts
```

**API规范：**
- 输入验证
- 错误处理
- 超时控制
- 类型安全

## 🌍 多语言支持

### 翻译文件更新
需要更新三个文件：
- `src/messages/en.json`
- `src/messages/zh.json`
- `src/messages/zh-Hant.json`

### 必需的翻译键
```json
{
  "功能名": {
    "meta_title": "SEO标题",
    "meta_description": "SEO描述",
    "meta_keywords": "关键词",
    "og_title": "社交媒体标题",
    "og_description": "社交媒体描述",
    "title": "页面标题",
    "description": "页面描述",
    "back_home": "首页/Home/首頁"
  }
}
```

### 工具导航更新
在 `src/components/IPInfoClientComponent.tsx` 中添加：

```jsx
<Link
  href={`/${locale}/功能名`}
  className="flex items-center justify-start sm:justify-center gap-3 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
>
  <svg className="w-6 h-6 text-颜色-500">
    {/* 功能图标 */}
  </svg>
  <span className="text-gray-700 dark:text-gray-200 font-medium">{t("tools.功能名_title")}</span>
</Link>
```

## 🎨 设计规范

### 颜色使用
- **主色调**：黑白灰 (`bg-black`, `text-white`, `text-gray-400`)
- **强调色**：仅用于状态指示
  - 错误：`text-red-300`, `bg-red-900/50`, `border-red-700`
  - 成功：`text-green-300`, `bg-green-900/50`, `border-green-700`
  - 功能图标：`text-blue-500`, `text-purple-500`, `text-green-500`

### 间距规范
- 页面边距：`p-4 md:p-8`
- 标题下方：`mb-6`
- 描述下方：`mb-6`
- 组件间距：`mb-8`

### 响应式断点
- 手机：默认样式
- 平板：`sm:` (640px+)
- 桌面：`md:` (768px+)

## 🔧 开发步骤

### 1. 创建页面结构
```bash
# 1. 创建页面文件
touch src/app/[locale]/功能名/page.tsx

# 2. 创建组件文件
touch src/components/功能名Content.tsx

# 3. 创建API文件（如需要）
touch src/app/api/功能名/route.ts
```

### 2. 实现基础功能
- [ ] 页面元数据和SEO
- [ ] 组件基础结构
- [ ] 核心功能逻辑
- [ ] 错误处理

### 3. 多语言支持
- [ ] 英文翻译 (`en.json`)
- [ ] 简体中文翻译 (`zh.json`)
- [ ] 繁体中文翻译 (`zh-Hant.json`)
- [ ] 工具导航翻译

### 4. 界面集成
- [ ] 添加到主页工具栏
- [ ] 测试各语言版本
- [ ] 验证响应式布局

### 5. 测试验证
- [ ] 功能测试
- [ ] 多语言测试
- [ ] 响应式测试
- [ ] SEO验证
- [ ] 错误场景测试

## 📋 检查清单

### 布局规范 ✅
- [ ] 标题在左边，Home按钮在右边
- [ ] 描述文本居中对齐
- [ ] 响应式设计正常工作
- [ ] 与其他页面布局一致

### 多语言支持 ✅
- [ ] 英文版本完整
- [ ] 简体中文版本完整
- [ ] 繁体中文版本完整
- [ ] 所有翻译键都已定义

### 技术规范 ✅
- [ ] TypeScript 类型安全
- [ ] 错误处理完善
- [ ] 性能优化
- [ ] 无控制台错误

### SEO优化 ✅
- [ ] 元数据完整
- [ ] 结构化数据
- [ ] 多语言链接
- [ ] 语义化HTML

## 📝 示例模板

完整的功能开发可以参考 `geolocation` 功能的实现：
- 页面：`src/app/[locale]/geolocation/page.tsx`
- 组件：`src/components/GeolocationContent.tsx`
- 翻译：各语言JSON文件中的 `geolocation` 部分

## 🚨 常见错误

1. **JSON语法错误**：注意引号使用，避免中英文引号混用
2. **布局不一致**：确保使用标准的页面头部结构
3. **翻译缺失**：检查所有三种语言的翻译
4. **响应式问题**：测试移动端和桌面端布局
5. **类型错误**：确保TypeScript类型正确

---

遵循此指南可以确保新功能与项目整体风格保持一致，提供良好的用户体验。