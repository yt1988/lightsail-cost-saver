# AWS Lightsail 省钱计算器

[English](README.md) · **简体中文**

免费的单页 Amazon Lightsail 流量计算器。Lightsail 中**同地区、同规格的实例共享一个流量额度池**，本工具利用这条规则，告诉你本月是否安全、预计会超额多少，以及加几台流量实例最省钱。

- 纯静态单文件：无后端、无构建步骤
- 数据只保存在你的浏览器里（`localStorage`），可随时导出 / 导入 JSON 备份
- 10 种语言（English、简体中文、繁體中文、日本語、한국어、Español、Français、Deutsch、Português、Русский），自动识别，可手动切换
- 浅色 / 深色 / 跟随系统三种主题，手机可用
- 内置 19 个 AWS 地区的价格，用脚本从 AWS Price List API 更新

## 功能说明

| 模块 | 作用 |
|---|---|
| 状态栏 | 一眼看出**安全**、**预计超额**还是**已超额**，并直接给出超额金额和额度用完的时间 |
| 用量输入 | 直接填本月总用量，或分别填账单项 `TotalDataXfer-In-Bytes`、`TotalDataXfer-Out-Bytes`，自动加总 |
| 预测进度条 | 已用、预计到月底的部分、额度线，以及超出额度的部分 |
| 扩容方案 | 对比加 0、1、2… 台流量实例的总花费（实例费 + 超额费），最省的方案可一键添加 |
| 基石实例 | 按月费选择套餐，每张卡片标出流量和每 TB 成本，并标记最省的一档 |
| 流量实例 | 固定与基石同规格、使用 IPv6-only（同规格最便宜，且与双栈基石合并额度），每批可设开通和删除时间 |
| 下月建议 | 按本月节奏，给出下月「基石 + N 台流量实例」的配置 |
| 输入校验 | 月底预计低于已用流量、删除时间早于开通时间都会提示；导入的备份会逐项清洗 |

### 两种计算模式

| 模式 | 何时 | 怎么算 |
|---|---|---|
| 按实际用量 | 填了已用流量 | 日均从本月最早一台实例开通算起；已产生的超额不能被新实例抵消；新实例从下一个整点起按剩余时长折算 |
| 整月规划 | 只填了月底预计 | 不把今天之前当作已发生；所有运行中的实例按整月计算，给出整月不超额所需台数 |

## 计算口径

| 项目 | 规则 |
|---|---|
| 额度扣减 | 入站**和**出站都扣额度 |
| 超额收费 | 只收超出额度的出站流量（「出站占比」设置，默认 100%） |
| 叠加 | 同地区**且**同规格才合并；同规格双栈与 IPv6-only 可合并 |
| 月中开通 / 删除 | 按小时计费；额度按存在时长折算（官方文档未写明；AWS re:Post 上经 AWS Support 审核的回答为按小时累计，可在设置中关闭） |
| 已产生的超额 | 之后新增实例无法抵消 |
| 单位 | 1 TB = 1024 GB（Lightsail API 中 1 TB 套餐的 `transferPerMonthInGb` 为 1024）；计费月为 UTC 自然月 |
| 额度减半地区 | 孟买、悉尼、雅加达、马来西亚、香港、圣保罗 |

结果仅为估算，以 AWS 账单为准。本工具不是 AWS 官方工具。

## 部署

整个程序就是 `public/` 文件夹，任何静态托管都能用。下面是三种现成方式。

### Cloudflare（推荐）

静态资源请求免费、不计量，也没有商用限制。`wrangler.toml` 已配置为一个只托管 `public/` 静态资源的 Worker（没有 Worker 脚本），对应 Cloudflare 控制台目前默认的创建流程。

**方式 A：连接本仓库（Workers）**

1. Fork 本仓库。
2. Cloudflare 控制台 → **Workers & Pages** → **创建** → **导入存储库**，选择你的 Fork。
3. 设置：
   - 构建命令：*（留空）*
   - 部署命令：**`npx wrangler deploy`**（默认值即可）
   - 预览命令：保持默认；「启用预览构建」可开可关
4. 点 **部署**。之后每次推送到主分支都会自动重新部署。

**方式 B：Cloudflare Pages**

Workers & Pages → **创建** → **Pages** → **连接到 Git** → 框架预设选 **无**，构建命令留空，构建输出目录填 **`public`**。

**方式 C：在本机部署**

```bash
npx wrangler deploy
```

### Vercel

**方式 A：** Vercel 控制台 → **Add New** → **Project** → 导入你的 Fork。不需要选框架，也不需要构建命令，`vercel.json` 已把输出目录设为 `public`。

**方式 B：**

```bash
npx vercel --prod
```

注意：免费的 Hobby 版**仅限非商业用途**，每月请求额度用完后会停止服务。

### Docker

镜像已发布到 Docker Hub：`imxjp/lightsail-cost-saver`（nginx 托管静态页面，约 20 MB，支持 `linux/amd64` 和 `linux/arm64`）。

```bash
docker run -d --name lightsail-cost-saver -p 8080:80 --restart unless-stopped imxjp/lightsail-cost-saver:latest
```

然后打开 http://localhost:8080。

使用 Docker Compose：

```yaml
services:
  lightsail-cost-saver:
    image: imxjp/lightsail-cost-saver:latest
    ports:
      - "8080:80"
    restart: unless-stopped
```

如果想自己构建，克隆仓库后运行 `docker compose up -d --build` 即可。

## 部署前（可选）

```bash
# 从 AWS Price List API 拉取最新价格，写回 public/index.html（需要 Node 18+）
node scripts/update-prices.mjs

# 设置正式域名：写入 canonical / hreflang，生成 sitemap.xml 和 robots.txt
node scripts/set-site-url.mjs https://your-domain.example
```

两条命令都只在本地或 CI 里跑一次，不影响页面加载速度。某个地区价格下载失败时，会保留该地区原来的价格。

## 项目结构

```
public/index.html                 整个程序（标志已内嵌，无外部图片）
scripts/update-prices.mjs         从 AWS Price List API 更新价格
scripts/set-site-url.mjs          为你的域名生成 canonical / hreflang / sitemap / robots
assets/                           1ms 标志母版（浅色、深色），留档用
Dockerfile, nginx.conf            容器镜像
.github/workflows/docker.yml      构建并推送 Docker Hub 镜像
.github/workflows/pages.yml       可选的 GitHub Pages 部署
wrangler.toml, vercel.json, netlify.toml
```

## 官方文档

- [Lightsail 定价](https://aws.amazon.com/lightsail/pricing/)
- [流量额度 FAQ](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-faq-data-transfer-allowance.html)
- [计费 FAQ](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-frequently-asked-questions-faq-billing-and-account-management.html)
- [AWS 服务条款](https://aws.amazon.com/service-terms/)
