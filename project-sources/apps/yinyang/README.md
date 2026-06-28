# BaZi · 现代八字数据仪表盘

一个现代、极简的八字排盘工具。命盘和解读均由本地规则引擎计算。

推衍方法以《子平真诠》《滴天髓》《三命通会》《渊海子平》的常见规则为参考，并在页面中显示来源、适用边界和置信度。五行百分比是产品用于可视化的结构指数，不是古籍原有的固定计分法。

当前版本包含：

- 公历 / 农历出生信息输入与真太阳时校正
- 四柱、天干地支、十神、藏干、纳音、五行结构和大运
- 指定流年星级分析与五行雷达图
- 今日运势、幸运颜色、双人合盘和分享海报
- 天機閣仪表盘：首页运势、排盘命理、周易起卦、星座运势、天机问答、运势分析、历史记录、缘分配对、偏好设置

## 启动

安装依赖：

```powershell
npm install
```

启动 Electron 桌面版：

```powershell
npm start
```

桌面版默认打开 `index.html`，窗口固定为 `1440 × 900`。

如需预览网页版本：

```powershell
npm run web
```

浏览器打开：

```text
http://127.0.0.1:4173
```

部署到服务器时，可在 `.env.local` 中设置监听地址：

```dotenv
HOST=0.0.0.0
PORT=4173
```

## 上传到 GitHub

这个项目现在是纯静态前端 + 可选本地静态服务，适合直接上传到 GitHub。

建议上传这些文件：

```text
.github/
assets/
docs/
scripts/
.gitignore
.nojekyll
embed-example.html
embed.html
index.html
package.json
README.md
server.js
```

不要上传：

```text
dist/
release/
node_modules/
.env
.env.local
```

本地检查：

```powershell
npm run check
```

生成 GitHub Pages 静态产物：

```powershell
npm run build:pages
```

产物会输出到 `dist/`。这个目录已加入 `.gitignore`，通常不需要提交。

生成 Windows 桌面安装包：

```powershell
npm run dist:win
```

安装包会输出到 `release/`。这个目录已加入 `.gitignore`，通常不需要提交。

### GitHub Pages 自动部署

仓库已包含 `.github/workflows/pages.yml`。推送到 `main` 分支后，GitHub Actions 会：

1. 检查 JavaScript 语法
2. 生成 `dist/`
3. 上传静态页面 artifact
4. 部署到 GitHub Pages

在 GitHub 仓库中进入：

```text
Settings → Pages → Build and deployment → Source → GitHub Actions
```

之后每次 push 到 `main` 都会自动发布。

## 嵌入网站

推荐使用自动高度组件：

```html
<div id="bazi-widget"></div>
<script src="https://your-domain.com/bazi/assets/embed-host.js"></script>
<script>
  const widget = BaZiEmbed.mount('#bazi-widget', {
    src: 'https://your-domain.com/bazi/embed.html',
    theme: 'light',
    screen: 'form',
    maxHeight: 1600,
    onResult(message) {
      console.log('排盘结果', message);
    }
  });
</script>
```

可用方法：

```js
widget.setTheme('dark');
widget.setBirth({
  name: 'Yang',
  year: 1996,
  month: 5,
  day: 18,
  hour: 9,
  minute: 30,
  calendar: 'solar',
  leapMonth: false,
  gender: 'male',
  place: '上海'
});
widget.calculate();
widget.reset();
widget.destroy();
```

也可以直接使用 iframe：

```html
<iframe
  src="https://your-domain.com/bazi/embed.html?theme=light&screen=form"
  title="八字排盘"
  style="width:100%;height:1200px;border:0"
></iframe>
```

支持的 URL 参数：

- `theme=light|dark|auto`
- `screen=form|home`
- `transparent=1`
- `date=1996-05-18`
- `time=09:30`
- `calendar=solar|lunar`
- `leapMonth=1`
- `gender=male|female`
- `place=上海`
- `trueSolarTime=1`
- `longitude=121.47`
- `meridian=120`
- `autostart=1`

## 文件结构

```text
index.html              独立页面
embed.html              iframe 页面
embed-example.html      嵌入示例
server.js               本地静态服务
electron/main.cjs       Electron 桌面应用入口
assets/engine.js        排盘引擎
assets/analysis.js      本地规则分析
assets/app.js           页面与结果渲染
assets/tianji.js        天機閣仪表盘渲染
assets/embed-host.js    宿主网站嵌入 API
assets/styles.css       视觉样式
assets/tianji.css       天機閣视觉样式
assets/lunar.js         lunar-javascript
```

历法计算使用 [lunar-javascript](https://github.com/6tail/lunar-javascript)，许可证位于 `assets/LUNAR-LICENSE`。
