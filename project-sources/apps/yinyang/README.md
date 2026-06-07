# BaZi · 现代八字数据仪表盘

一个现代、极简的八字排盘工具。基础命盘由本地规则引擎计算，AI 只读取计算结果做联合推理，不负责重算四柱。

## 启动

1. 在项目根目录创建 `.env.local`：

```dotenv
OPENAI_API_KEY=你的_OpenAI_API_Key
OPENAI_MODEL=gpt-5.2
```

2. 启动服务：

```powershell
npm start
```

3. 打开：

```text
http://127.0.0.1:4173
```

`.env.local` 已被 Git 忽略，服务端也会拒绝通过 HTTP 读取该文件。不要把 API Key 写进 `assets/app.js`、HTML 或任何浏览器代码。

部署到服务器时可设置：

```dotenv
HOST=0.0.0.0
PORT=4173
```

## AI 综合推理

结果页中的 AI 功能需要用户主动点击，不会自动产生 API 费用。请求只发送：

- 出生日期、时间、性别与真太阳时开关
- 已计算的四柱、五行、十神、藏干、十二长生
- 纳音、神煞、空亡、胎元、命宫
- 大运、所选流年与本地规则分析结果

姓名和出生地点不会发送给 OpenAI。输出固定为结构化 JSON，覆盖四柱落点、特殊因素、七个现实领域、大运流年联动与行动建议。

如果页面提示“额度不足”，需要在 OpenAI Platform 为该 API 项目配置有效的计费额度。

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
    },
    onAiResult(message) {
      console.log('AI 联合推理结果', message.result);
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
server.js               静态服务与 OpenAI 代理
assets/engine.js        排盘引擎
assets/analysis.js      本地规则分析
assets/app.js           页面与 AI 结果渲染
assets/embed-host.js    宿主网站嵌入 API
assets/styles.css       视觉样式
assets/lunar.js         lunar-javascript
```

历法计算使用 [lunar-javascript](https://github.com/6tail/lunar-javascript)，许可证位于 `assets/LUNAR-LICENSE`。
