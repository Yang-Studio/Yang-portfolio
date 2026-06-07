# BaZi · 现代八字数据仪表盘

一个现代、极简的八字排盘工具。命盘和解读均由本地规则引擎计算。

推衍方法以《子平真诠》《滴天髓》《三命通会》《渊海子平》的常见规则为参考，并在页面中显示来源、适用边界和置信度。五行百分比是产品用于可视化的结构指数，不是古籍原有的固定计分法。

## 启动

```powershell
npm start
```

打开：

```text
http://127.0.0.1:4173
```

部署到服务器时，可在 `.env.local` 中设置监听地址：

```dotenv
HOST=0.0.0.0
PORT=4173
```

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
assets/engine.js        排盘引擎
assets/analysis.js      本地规则分析
assets/app.js           页面与结果渲染
assets/embed-host.js    宿主网站嵌入 API
assets/styles.css       视觉样式
assets/lunar.js         lunar-javascript
```

历法计算使用 [lunar-javascript](https://github.com/6tail/lunar-javascript)，许可证位于 `assets/LUNAR-LICENSE`。
