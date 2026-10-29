// The page script. scripts/build.mjs publishes it as public/assets/js/app.<hash>.js and links it from every page;
// it also reads the PRICES, I18N and CALC blocks from here.
(function () {
  "use strict";
  // Rewritten by scripts/update-prices.mjs from the AWS Price List API. Per region: overage $/GB and
  // Linux general purpose bundles [RAM GB, dual-stack $/mo, IPv6-only $/mo, transfer TB (already halved where AWS halves it)].
  /* PRICES:BEGIN */
  const PRICES = {"date":"2026-10-25","regions":{
    "us-east-1":{"over":0.09,"q":[[0.5,5,3.5,1],[1,7,5,2],[2,12,10,3],[4,24,20,4],[8,44,40,5],[16,84,80,6],[32,164,160,7],[64,384,380,8]]},
    "us-east-2":{"over":0.09,"q":[[0.5,5,3.5,1],[1,7,5,2],[2,12,10,3],[4,24,20,4],[8,44,40,5],[16,84,80,6],[32,164,160,7],[64,384,380,8]]},
    "us-west-2":{"over":0.09,"q":[[0.5,5,3.5,1],[1,7,5,2],[2,12,10,3],[4,24,20,4],[8,44,40,5],[16,84,80,6],[32,164,160,7],[64,384,380,8]]},
    "ca-central-1":{"over":0.09,"q":[[0.5,5,3.5,1],[1,7,5,2],[2,12,10,3],[4,24,20,4],[8,44,40,5],[16,84,80,6],[32,164,160,7],[64,384,380,8]]},
    "eu-central-1":{"over":0.09,"q":[[0.5,5,3.5,1],[1,7,5,2],[2,12,10,3],[4,24,20,4],[8,44,40,5],[16,84,80,6],[32,164,160,7],[64,384,380,8]]},
    "eu-west-1":{"over":0.09,"q":[[0.5,5,3.5,1],[1,7,5,2],[2,12,10,3],[4,24,20,4],[8,44,40,5],[16,84,80,6],[32,164,160,7],[64,384,380,8]]},
    "eu-west-2":{"over":0.09,"q":[[0.5,5,3.5,1],[1,7,5,2],[2,12,10,3],[4,24,20,4],[8,44,40,5],[16,84,80,6],[32,164,160,7],[64,384,380,8]]},
    "eu-west-3":{"over":0.09,"q":[[0.5,5,3.5,1],[1,7,5,2],[2,12,10,3],[4,24,20,4],[8,44,40,5],[16,84,80,6],[32,164,160,7],[64,384,380,8]]},
    "eu-north-1":{"over":0.09,"q":[[0.5,5,3.5,1],[1,7,5,2],[2,12,10,3],[4,24,20,4],[8,44,40,5],[16,84,80,6],[32,164,160,7],[64,384,380,8]]},
    "eu-south-2":{"over":0.12,"q":[[0.5,5,3.5,1],[1,7,5,2],[2,12,10,3],[4,24,20,4],[8,44,40,5],[16,84,80,6],[32,164,160,7],[64,384,380,8]]},
    "ap-northeast-1":{"over":0.14,"q":[[0.5,5,3.5,1],[1,7,5,2],[2,12,10,3],[4,24,20,4],[8,44,40,5],[16,84,80,6],[32,164,160,7],[64,384,380,8]]},
    "ap-northeast-2":{"over":0.13,"q":[[0.5,5,3.5,1],[1,7,5,2],[2,12,10,3],[4,24,20,4],[8,44,40,5],[16,84,80,6],[32,164,160,7],[64,384,380,8]]},
    "ap-southeast-1":{"over":0.12,"q":[[0.5,5,3.5,1],[1,7,5,2],[2,12,10,3],[4,24,20,4],[8,44,40,5],[16,84,80,6],[32,164,160,7],[64,384,380,8]]},
    "ap-east-1":{"over":0.09,"q":[[0.5,5,3.5,0.5],[1,7,5,1],[2,12,10,1.5],[4,24,20,2],[8,44,40,2.5],[16,84,80,3],[32,164,160,3.5],[64,384,380,4]]},
    "ap-south-1":{"over":0.13,"q":[[0.5,5,3.5,0.5],[1,7,5,1],[2,12,10,1.5],[4,24,20,2],[8,44,40,2.5],[16,84,80,3],[32,164,160,3.5],[64,384,380,4]]},
    "ap-southeast-2":{"over":0.17,"q":[[0.5,5,3.5,0.5],[1,7,5,1],[2,12,10,1.5],[4,24,20,2],[8,44,40,2.5],[16,84,80,3],[32,164,160,3.5],[64,384,380,4]]},
    "ap-southeast-3":{"over":0.132,"q":[[0.5,5,3.5,0.5],[1,7,5,1],[2,12,10,1.5],[4,24,20,2],[8,44,40,2.5],[16,84,80,3],[32,164,160,3.5],[64,384,380,4]]},
    "ap-southeast-5":{"over":0.108,"q":[[0.5,5,3.5,0.5],[1,7,5,1],[2,12,10,1.5],[4,24,20,2],[8,44,40,2.5],[16,84,80,3],[32,164,160,3.5],[64,384,380,4]]},
    "sa-east-1":{"over":0.15,"q":[[0.5,5,3.5,0.5],[1,7,5,1],[2,12,10,1.5],[4,24,20,2],[8,44,40,2.5],[16,84,80,3],[32,164,160,3.5],[64,384,380,4]]}
  }};
  /* PRICES:END */
  /* I18N:BEGIN (also read by scripts/build.mjs to pre-render one static page per language) */
  const REGION_ORDER = ["us-east-1","us-east-2","us-west-2","ca-central-1","eu-central-1","eu-west-1","eu-west-2","eu-west-3","eu-north-1","eu-south-2",
    "ap-northeast-1","ap-northeast-2","ap-southeast-1","ap-east-1","ap-south-1","ap-southeast-2","ap-southeast-3","ap-southeast-5","sa-east-1"];
  const REGION_NAMES = {
    "zh-CN": ["美东 · 弗吉尼亚","美东 · 俄亥俄","美西 · 俄勒冈","加拿大 · 中部","欧洲 · 法兰克福","欧洲 · 爱尔兰","欧洲 · 伦敦","欧洲 · 巴黎","欧洲 · 斯德哥尔摩","欧洲 · 西班牙","亚太 · 东京","亚太 · 首尔","亚太 · 新加坡","亚太 · 香港","亚太 · 孟买","亚太 · 悉尼","亚太 · 雅加达","亚太 · 马来西亚","南美 · 圣保罗"],
    "zh-TW": ["美東 · 維吉尼亞","美東 · 俄亥俄","美西 · 奧勒岡","加拿大 · 中部","歐洲 · 法蘭克福","歐洲 · 愛爾蘭","歐洲 · 倫敦","歐洲 · 巴黎","歐洲 · 斯德哥爾摩","歐洲 · 西班牙","亞太 · 東京","亞太 · 首爾","亞太 · 新加坡","亞太 · 香港","亞太 · 孟買","亞太 · 雪梨","亞太 · 雅加達","亞太 · 馬來西亞","南美 · 聖保羅"],
    ja: ["米国東部 (バージニア北部)","米国東部 (オハイオ)","米国西部 (オレゴン)","カナダ (中部)","欧州 (フランクフルト)","欧州 (アイルランド)","欧州 (ロンドン)","欧州 (パリ)","欧州 (ストックホルム)","欧州 (スペイン)","アジアパシフィック (東京)","アジアパシフィック (ソウル)","アジアパシフィック (シンガポール)","アジアパシフィック (香港)","アジアパシフィック (ムンバイ)","アジアパシフィック (シドニー)","アジアパシフィック (ジャカルタ)","アジアパシフィック (マレーシア)","南米 (サンパウロ)"],
    en: ["US East (N. Virginia)","US East (Ohio)","US West (Oregon)","Canada (Central)","Europe (Frankfurt)","Europe (Ireland)","Europe (London)","Europe (Paris)","Europe (Stockholm)","Europe (Spain)","Asia Pacific (Tokyo)","Asia Pacific (Seoul)","Asia Pacific (Singapore)","Asia Pacific (Hong Kong)","Asia Pacific (Mumbai)","Asia Pacific (Sydney)","Asia Pacific (Jakarta)","Asia Pacific (Malaysia)","South America (São Paulo)"]
  };
  const LINKS = ["https://aws.amazon.com/lightsail/pricing/",
    "https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-faq-data-transfer-allowance.html",
    "https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-frequently-asked-questions-faq-billing-and-account-management.html",
    "https://aws.amazon.com/service-terms/", "https://console.aws.amazon.com/billing/home#/bills"];
  const BILL = "https://console.aws.amazon.com/billing/home#/bills";
  const RULE_ICONS = ["⇅","↑","=","h","✕","↺","⇄","≈"], RULE_WARN = [4];

  // ---------- language packs ----------
  const LANGS = [["zh-CN","简体中文"],["zh-TW","繁體中文"],["en","English"],["ja","日本語"],["ko","한국어"],["es","Español"],["fr","Français"],["de","Deutsch"],["pt","Português"],["ru","Русский"]];
  // each language is its own pre-rendered page at this path below the site root ("" = the root, English)
  const LANG_PATHS = {"en":"","zh-CN":"zh/","zh-TW":"zh-tw/","ja":"ja/","ko":"ko/","es":"es/","fr":"fr/","de":"de/","pt":"pt/","ru":"ru/"};
  const I18N = {
    "zh-CN": {
      name: "AWS Lightsail 省钱计算器", tagline: "基于“同地域同规格流量池共享”规则，帮你找出更省钱的弹性流量方案",
      region: "地区：流量池只在同一地区内合并", lang: "语言", over: "超额", half: "额度减半",
      settings: "高级设置", outRatio: "出站占比", outRatioHint: "超额只对出站收费。不确定就保持 100%。", prorate: "月中开通的额度按时长折算",
      exp: "导出备份", imp: "导入备份", sample: "载入示例", reset: "重置全部数据", resetHold: "按住 1 秒确认重置", copyLink: "复制配置链接", copied: "已复制", linkLoaded: "已载入链接中的配置，你原来的数据已备份。", undo: "恢复原来的数据", gh: "在 GitHub 查看源码", theme: "主题", th_system: "跟随系统", th_light: "浅色", th_dark: "深色",
      roll: "已进入 {m}：保留基石实例和运行中的流量实例，清零已用流量？", rollBtn: "开始新月份",
      usedUnit: "GB 已用", usedAria: "本月已用流量",
      recorded: "记录于 {t} · 日均 {v}", toBill: "去账单查看",
      allow: "本月额度", remain: "剩余", exceeded: "已超出", forecast: "月底预计", forecastTip: "留空按日均自动推算；也可手动填入预期的月总量（GB）", fcErr: "不能低于已用流量 {v}", endErr: "删除时间需晚于开通时间", localTime: "本地时间", utcNote: "AWS 按 UTC 自然月计费，本月从本地时间 {t} 开始",
      cost: "本月预估费用", inclOver: "含超额 {v}",
      bandGood: "安全 · 额度够用", bandWarn: "预计超额 {v}", bandBad: "已超额 · 预计多付 {v}", bandIdle: "待填用量", lgUsed: "已用 {v}", lgEnd: "月底预计 {v}", lgOver: "超出 {v}",
      fill: "先填入本月已用流量", fillHint: "在 {a}AWS 账单（Bills → Lightsail）{/a}中找到 {in} 和 {out} 两项，相加即可。",
      enough: "额度够用，不用加流量实例", leftEnd: "月底剩 {v}",
      suggest: "建议添加 {n} 台流量实例", apply: "一键添加", from: "{spec}，从 {t} 起", saveV: "比不加省 {v}",
      exPred: "额度预计 {t} 用完", exPast: "额度已于 {t} 用完", noAdd: "不加流量实例更省", planMode: "按整月规划", planNote: "每台流量实例 +{a} · {c}/月", optimal: "已是最省配置，剩余超额无法再避免",
      optNone: "不加", optN: "+{n} 台", barTip: "实例 {a} · 超额 {o}", locked: "已超出的 {v} 无法被新实例抵消，已计入。",
      next: "下月", nextLine: "按本月节奏（{v}），配 {cfg}，约 {c}/月", cfgBase: "基石实例", cfgPlus: "基石实例 + {n} 台流量实例",
      fleet: "实例总览", fleetSum: "{n} 台 · {c}", base: "基石实例", baseHint: "流量池中的地基，新添加的流量实例需要与它规格一致。",
      best: "最省", v4: "需要公网 IPv4", dual: "双栈", start: "开通时间",
     
      nodes: "流量实例", share: "同地区、同规格实例共享流量池，IPv6-only。", nodeAdd: "现在新增 1 台：+{a} · {c}（按至月底时长）", add: "添加流量实例",
      nStart: "开通", nEnd: "删除（运行中留空）", planned: "计划", gone: "已删除", dec: "减少", inc: "增加", count: "台数", del: "删除",
      seoDesc: "免费的 AWS Lightsail 流量计算器。同地区同规格实例共享流量池：查看已用和剩余额度，预测月底超额费用，算出加几台 IPv6 实例最省钱。", seoKw: "AWS Lightsail, Lightsail 流量, Lightsail 超额, 流量池, 流量计算器, Lightsail 价格, IPv6 实例, VPS 流量费用, AWS 账单",
      agent: "接入 Agent", secCalc: "计算", secData: "数据",
      ag: {"title":"在 AI Agent 里使用","sub":"让 Agent 读一份简短说明，它就能替你算，并给你一个可以在这里核对的链接。","close":"关闭","tabs":["快速开始","典型用例","开发者"],"s1":"复制这段提示词","prompt":"请先阅读 {url}，按其中的 Lightsail 计费规则帮我计算流量池。\n我的情况：区域 ___，套餐 ___（如 $7 / 2 TB 流量），本月已用 ___ GB（截至 ___）。\n请告诉我这个月会不会超额、加几台流量实例最省钱，并给我一个预填好的计算器链接方便核对。","copyPrompt":"复制提示词","s2":"粘贴到能联网的 Agent 里","s2n":"ChatGPT、Claude、Gemini、Cursor 等都可以。把空白处填上，或者直接粘贴账单里的流量明细。","s3":"打开它给你的链接","s3n":"链接会把配置载入这个页面，方便你核对数字。你原来的数据会先备份，可以一键恢复。","privacy":"这个页面不上传任何数据。配置链接里带有你的用量数字，分享前请留意。","casesIntro":"复制一句提问，改成你的数字，发给 Agent 即可。每句都已带上说明文档地址。","does":"Agent 会：","copyQ":"复制这句提问","ref":"（规则和算法见 {url}）","perm":{"none":"无需权限","ro":"需 AWS 只读权限","rw":"需 AWS 写权限 · 产生费用"},"cases":[["会不会超","月中想知道这个月的额度够不够。","我在东京用 $12 / 3 TB 的 Lightsail 套餐，本月已用 2800 GB，这个月会超吗？要加几台流量实例？","按日均用量预测月底，给出最省钱的方案。"],["部署选型","新项目上线前，选区域和套餐。","我的应用每月大约 8 TB 流量，用户主要在东南亚，用 Lightsail 怎么配最便宜？","对比各区域单价、半额区域，以及套餐加流量实例的组合。"],["下月规划","月初按预计总量定好实例数。","下个月预计在法兰克福跑 12000 GB，用 $7 / 2 TB 的套餐，开几台流量实例成本最低？","用整月规划模式算出台数和月成本。"],["账单解读","看不懂账单里的流量明细。","这是我 AWS 账单里 Lightsail 的流量明细：（粘贴）。还剩多少额度？会被收费吗？","汇总 DataXfer-In/Out 两项，并给你一个核对链接。"],["流量预警","每天自动检查，快超额前提醒你。","每天早上读取我 Lightsail 实例的网络流量指标，如果这个月预计会超额就提醒我。","用 AWS CLI 或 SDK 读取 NetworkIn/Out，代入计算后通知你。"],["自动扩容","预计超额时自动加流量实例。","如果预计会超额，就在同一区域按推荐数量创建同套餐的 IPv6 实例。创建前先让我确认。","根据推荐结果调用 Lightsail API 创建实例。"]],"scaleWarn":"自动扩容会创建真实计费的实例。只给 Agent 必要的权限，要求它创建前确认，并设好实例数上限。","devIntro":"所有文件都是静态的，允许跨域读取，没有服务端 API，也不需要密钥。","files":["给 Agent 读的说明：计费规则、链接参数、返回字段","各区域的价格与额度","计算模块（ES Module），和这个页面同一套代码"],"copyUrl":"复制地址","codeH":"在代码里调用","copy":"复制","paramsH":"预填链接参数","params":["AWS 区域代码，如 us-east-1","套餐，以内存 GB 标识，如 $7 / 2 TB 为 1","本月已用 GB（入站 + 出站）","预计月底总量 GB；单独使用时按整月规划","流量实例，格式 数量@开始[~结束]，UTC"],"more":"完整参数和返回字段见 llms.txt。Node.js 不能直接从网址导入，可以下载 calc.js 或从仓库复制。"},
      cT: "清空全部数据？", cB: "实例、已用流量和设置都会恢复默认，无法撤销。需要的话先在高级设置里导出备份。", cancel: "取消", clear: "清空",
      rules: "计费规则速查",
      r: ["入站 + 出站<b>都扣额度</b>",
        "超额<b>只收出站</b>，入站永远免费",
        "同地区、<b>同规格</b>才合并；同规格双栈与 IPv6-only 可合并",
        "按小时计费，<b>停机照样计费</b>，删除才停止",
        "已产生的超额，<b>新加实例无法抵消</b>，要在用完前扩容",
        "删除后重建<b>不会重置</b>本月已用量",
        "同地区走<b>私网 IP</b>：扣额度，但超额也免费",
        "按 1 TB = 1024 GB、UTC 自然月估算，以 AWS 账单为准"],
      links: ["官方定价", "流量额度 FAQ", "计费 FAQ", "服务条款", "查看账单用量"],
      foot: "数据只保存在当前浏览器 · 价格核对于 {d} · 非 AWS 官方工具", allowLbl: "额度 {v}"
    },
    "zh-TW": {
      name: "AWS Lightsail 省錢計算器", tagline: "基於「同地域同規格流量池共享」規則，幫你找出更省錢的彈性流量方案",
      region: "地區：流量池只在同一地區內合併", lang: "語言", over: "超額", half: "額度減半",
      settings: "進階設定", outRatio: "出站占比", outRatioHint: "超額只對出站收費。不確定就保持 100%。", prorate: "月中開通的額度按時長折算",
      exp: "匯出備份", imp: "匯入備份", sample: "載入範例", reset: "重設全部資料", resetHold: "按住 1 秒確認重設", copyLink: "複製設定連結", copied: "已複製", linkLoaded: "已載入連結中的設定，你原本的資料已備份。", undo: "恢復原本的資料", gh: "在 GitHub 查看原始碼", theme: "主題", th_system: "跟隨系統", th_light: "淺色", th_dark: "深色",
      roll: "已進入 {m}：保留基石實例和運行中的流量實例，清零已用流量？", rollBtn: "開始新月份",
      usedUnit: "GB 已用", usedAria: "本月已用流量",
      recorded: "記錄於 {t} · 日均 {v}", toBill: "前往帳單查看",
      allow: "本月額度", remain: "剩餘", exceeded: "已超出", forecast: "月底預計", forecastTip: "留空按日均自動推算；也可手動填入預期的月總量（GB）", fcErr: "不能低於已用流量 {v}", endErr: "刪除時間需晚於開通時間", localTime: "本地時間", utcNote: "AWS 按 UTC 自然月計費，本月從本地時間 {t} 開始",
      cost: "本月預估費用", inclOver: "含超額 {v}",
      bandGood: "安全 · 額度夠用", bandWarn: "預計超額 {v}", bandBad: "已超額 · 預計多付 {v}", bandIdle: "待填用量", lgUsed: "已用 {v}", lgEnd: "月底預計 {v}", lgOver: "超出 {v}",
      fill: "先填入本月已用流量", fillHint: "在 {a}AWS 帳單（Bills → Lightsail）{/a}中找到 {in} 和 {out} 兩項，相加即可。",
      enough: "額度夠用，不用加流量實例", leftEnd: "月底剩 {v}",
      suggest: "建議新增 {n} 台流量實例", apply: "一鍵新增", from: "{spec}，從 {t} 起", saveV: "比不加省 {v}",
      exPred: "額度預計 {t} 用完", exPast: "額度已於 {t} 用完", noAdd: "不加流量實例更省", planMode: "按整月規劃", planNote: "每台流量實例 +{a} · {c}/月", optimal: "已是最省配置，剩餘超額無法再避免",
      optNone: "不加", optN: "+{n} 台", barTip: "實例 {a} · 超額 {o}", locked: "已超出的 {v} 無法被新實例抵消，已計入。",
      next: "下月", nextLine: "按本月節奏（{v}），配 {cfg}，約 {c}/月", cfgBase: "基石實例", cfgPlus: "基石實例 + {n} 台流量實例",
      fleet: "實例總覽", fleetSum: "{n} 台 · {c}", base: "基石實例", baseHint: "流量池中的地基，新增的流量實例需要與它規格一致。",
      best: "最省", v4: "需要公網 IPv4", dual: "雙棧", start: "開通時間",
     
      nodes: "流量實例", share: "同地區、同規格實例共享流量池，IPv6-only。", nodeAdd: "現在新增 1 台：+{a} · {c}（按至月底時長）", add: "新增流量實例",
      nStart: "開通", nEnd: "刪除（運行中留空）", planned: "計畫", gone: "已刪除", dec: "減少", inc: "增加", count: "台數", del: "刪除",
      seoDesc: "免費的 AWS Lightsail 流量計算器。同區域同方案執行個體共享流量池：查看已用與剩餘額度，預測月底超額費用，算出加幾台 IPv6 執行個體最省錢。", seoKw: "AWS Lightsail, Lightsail 流量, Lightsail 超額, 流量池, 流量計算器, Lightsail 價格, IPv6 執行個體, VPS 流量費用, AWS 帳單",
      agent: "接入 Agent", secCalc: "計算", secData: "資料",
      ag: {"title":"在 AI Agent 裡使用","sub":"讓 Agent 讀一份簡短說明，它就能替你算，並給你一個可以在這裡核對的連結。","close":"關閉","tabs":["快速開始","典型用例","開發者"],"s1":"複製這段提示詞","prompt":"請先閱讀 {url}，按其中的 Lightsail 計費規則幫我計算流量池。\n我的情況：區域 ___，方案 ___（如 $7 / 2 TB 流量），本月已用 ___ GB（截至 ___）。\n請告訴我這個月會不會超額、加幾台流量執行個體最省錢，並給我一個預先填好的計算器連結方便核對。","copyPrompt":"複製提示詞","s2":"貼到能連網的 Agent 裡","s2n":"ChatGPT、Claude、Gemini、Cursor 等都可以。把空白處填上，或直接貼上帳單裡的流量明細。","s3":"開啟它給你的連結","s3n":"連結會把設定載入這個頁面，方便你核對數字。你原本的資料會先備份，可以一鍵恢復。","privacy":"這個頁面不上傳任何資料。設定連結裡帶有你的用量數字，分享前請留意。","casesIntro":"複製一句提問，改成你的數字，傳給 Agent 即可。每句都已帶上說明文件網址。","does":"Agent 會：","copyQ":"複製這句提問","ref":"（規則和演算法見 {url}）","perm":{"none":"無需權限","ro":"需 AWS 唯讀權限","rw":"需 AWS 寫入權限 · 產生費用"},"cases":[["會不會超","月中想知道這個月的額度夠不夠。","我在東京用 $12 / 3 TB 的 Lightsail 方案，本月已用 2800 GB，這個月會超嗎？要加幾台流量執行個體？","按日均用量預測月底，給出最省錢的方案。"],["部署選型","新專案上線前，選區域和方案。","我的應用每月大約 8 TB 流量，使用者主要在東南亞，用 Lightsail 怎麼配最便宜？","比較各區域單價、半額區域，以及方案加流量執行個體的組合。"],["下月規劃","月初按預計總量定好執行個體數。","下個月預計在法蘭克福跑 12000 GB，用 $7 / 2 TB 的方案，開幾台流量執行個體成本最低？","用整月規劃模式算出台數和月成本。"],["帳單解讀","看不懂帳單裡的流量明細。","這是我 AWS 帳單裡 Lightsail 的流量明細：（貼上）。還剩多少額度？會被收費嗎？","加總 DataXfer-In/Out 兩項，並給你一個核對連結。"],["流量預警","每天自動檢查，快超額前提醒你。","每天早上讀取我 Lightsail 執行個體的網路流量指標，如果這個月預計會超額就提醒我。","用 AWS CLI 或 SDK 讀取 NetworkIn/Out，代入計算後通知你。"],["自動擴容","預計超額時自動加流量執行個體。","如果預計會超額，就在同一區域按建議數量建立同方案的 IPv6 執行個體。建立前先讓我確認。","根據建議結果呼叫 Lightsail API 建立執行個體。"]],"scaleWarn":"自動擴容會建立真實計費的執行個體。只給 Agent 必要的權限，要求它建立前確認，並設好執行個體數上限。","devIntro":"所有檔案都是靜態的，允許跨域讀取，沒有伺服器 API，也不需要金鑰。","files":["給 Agent 讀的說明：計費規則、連結參數、回傳欄位","各區域的價格與額度","計算模組（ES Module），和這個頁面同一套程式碼"],"copyUrl":"複製網址","codeH":"在程式碼裡呼叫","copy":"複製","paramsH":"預填連結參數","params":["AWS 區域代碼，如 us-east-1","方案，以記憶體 GB 標識，如 $7 / 2 TB 為 1","本月已用 GB（輸入 + 輸出）","預計月底總量 GB；單獨使用時按整月規劃","流量執行個體，格式 數量@開始[~結束]，UTC"],"more":"完整參數和回傳欄位見 llms.txt。Node.js 不能直接從網址匯入，可以下載 calc.js 或從儲存庫複製。"},
      cT: "清空全部資料？", cB: "實例、已用流量和設定都會恢復預設，無法復原。需要的話先在進階設定裡匯出備份。", cancel: "取消", clear: "清空",
      rules: "計費規則速查",
      r: ["入站 + 出站<b>都扣額度</b>",
        "超額<b>只收出站</b>，入站永遠免費",
        "同地區、<b>同規格</b>才合併；同規格雙棧與 IPv6-only 可合併",
        "按小時計費，<b>停機照樣計費</b>，刪除才停止",
        "已產生的超額，<b>新加實例無法抵消</b>，要在用完前擴容",
        "刪除後重建<b>不會重設</b>本月已用量",
        "同地區走<b>私網 IP</b>：扣額度，但超額也免費",
        "按 1 TB = 1024 GB、UTC 自然月估算，以 AWS 帳單為準"],
      links: ["官方定價", "流量額度 FAQ", "計費 FAQ", "服務條款", "查看帳單用量"],
      foot: "資料只儲存在目前瀏覽器 · 價格核對於 {d} · 非 AWS 官方工具", allowLbl: "額度 {v}"
    },
    en: {
      name: "AWS Lightsail Cost Saver", tagline: "Uses the rule that same-region, same-size instances share one transfer pool to find the cheapest plan for elastic traffic.",
      region: "Region: allowances only pool within one region", lang: "Language", over: "overage", half: "half allowance",
      settings: "Advanced settings", outRatio: "Outbound share", outRatioHint: "Only outbound traffic is billed as overage. Keep 100% if unsure.", prorate: "Prorate allowance for mid-month instances",
      exp: "Export backup", imp: "Import backup", sample: "Load example", reset: "Reset all data", resetHold: "Hold 1 s to reset", copyLink: "Copy config link", copied: "Copied", linkLoaded: "Loaded the configuration from the link. Your previous data is backed up.", undo: "Restore my data", gh: "View source on GitHub", theme: "Theme", th_system: "System", th_light: "Light", th_dark: "Dark",
      roll: "{m} has started. Keep the base and running traffic instances and clear usage?", rollBtn: "Start new month",
      usedUnit: "GB used", usedAria: "Data used this month",
      recorded: "Recorded {t} · {v}/day", toBill: "Open Bills",
      allow: "Allowance", remain: "Remaining", exceeded: "Over by", forecast: "Month-end forecast", forecastTip: "Leave empty to project from the daily average, or enter your expected monthly total (GB)", fcErr: "Can’t be below used ({v})", endErr: "Deletion must be after creation", localTime: "local time", utcNote: "AWS bills by UTC calendar month; this month began {t} your time",
      cost: "Estimated cost", inclOver: "incl. {v} overage",
      bandGood: "Safe · within allowance", bandWarn: "Overage expected: {v}", bandBad: "Over allowance · about {v} extra", bandIdle: "Enter usage", lgUsed: "Used {v}", lgEnd: "Month end {v}", lgOver: "Over by {v}",
      fill: "Enter this month’s data usage first", fillHint: "In {a}AWS Bills → Lightsail{/a}, add up the {in} and {out} line items.",
      enough: "Allowance is enough, no extra instances needed", leftEnd: "{v} left at month end",
      suggest: "Add {n} traffic instance(s)", apply: "Add now", from: "{spec}, from {t}", saveV: "saves {v} vs. adding none",
      exPred: "allowance runs out {t}", exPast: "allowance ran out {t}", noAdd: "Adding none is cheaper", planMode: "Full-month plan", planNote: "Each traffic instance: +{a} · {c}/mo", optimal: "Already the cheapest setup; the remaining overage can’t be avoided",
      optNone: "None", optN: "+{n}", barTip: "Instances {a} · Overage {o}", locked: "The {v} already over cannot be offset by new instances and is included.",
      next: "Next month", nextLine: "At this month’s pace ({v}), use {cfg}, about {c}/mo", cfgBase: "the base instance", cfgPlus: "base + {n} traffic instance(s)",
      fleet: "Instances", fleetSum: "{n} · {c}", base: "Base instance", baseHint: "The foundation of the pool. Every traffic instance you add must match its size.",
      best: "Best", v4: "Needs public IPv4", dual: "Dual-stack", start: "Created",
     
      nodes: "Traffic instances", share: "Same-region, same-size instances share the pool. IPv6-only.", nodeAdd: "Add 1 now: +{a} · {c} (prorated to month end)", add: "Add traffic instance",
      nStart: "Created", nEnd: "Deleted (blank if running)", planned: "Planned", gone: "Deleted", dec: "Decrease", inc: "Increase", count: "Count", del: "Remove",
      agent: "Use with AI", secCalc: "Calculation", secData: "Data",
      ag: {"title":"Use it with an AI agent","sub":"Your agent reads one short guide, does the math for you and hands back a link you can check here.","close":"Close","tabs":["Quick start","Use cases","Developers"],"s1":"Copy this prompt","prompt":"Read {url} first, then use its Lightsail billing rules to work out my data transfer pool.\nMy setup: region ___, bundle ___ (e.g. $7 / 2 TB transfer), ___ GB used this month (as of ___).\nTell me whether I'll go over this month and the cheapest number of traffic instances to add, and give me a pre-filled calculator link so I can check.","copyPrompt":"Copy prompt","s2":"Paste it into an agent that can browse the web","s2n":"ChatGPT, Claude, Gemini, Cursor and similar all work. Fill in the blanks, or paste the data transfer lines from your bill instead.","s3":"Open the link it returns","s3n":"The link loads the setup here so you can check the numbers. Your current data is backed up first and can be restored.","privacy":"This page uploads nothing. Config links contain your usage numbers, so check before sharing them.","casesIntro":"Copy a question, change the numbers and send it to your agent. Each one already points it at the guide.","does":"Agent: ","copyQ":"Copy question","ref":" (Rules and method: {url})","perm":{"none":"No access needed","ro":"AWS read-only","rw":"AWS write · costs money"},"cases":[["Will I go over?","A mid-month check on whether the pool will last.","I'm on the $12 / 3 TB Lightsail bundle in Tokyo and have used 2800 GB this month. Will I go over, and how many traffic instances should I add?","projects month-end use from the daily pace and finds the cheapest fix."],["Choose a setup","Planning a new project before you deploy.","My app will push about 8 TB a month, mostly to users in Southeast Asia. What's the cheapest Lightsail region and bundle setup?","compares region prices, half-allowance regions and bundle plus traffic-instance combinations."],["Plan next month","Sizing the fleet at the start of the month.","Next month I expect about 12,000 GB in Frankfurt on the $7 / 2 TB bundle. How many traffic instances keep the cost lowest?","runs a full-month plan and returns the count and monthly cost."],["Explain my bill","The data transfer lines on the bill are hard to read.","Here are the Lightsail data transfer lines from my AWS bill: (paste). How much allowance is left, and will I be charged?","adds up the DataXfer-In/Out items and gives you a link to verify."],["Usage alerts","A daily check that warns you before overage.","Every morning, read the network metrics of my Lightsail instances and warn me if this month is heading for overage.","reads NetworkIn/Out with the AWS CLI or SDK, runs the numbers and notifies you."],["Auto scale-up","Add traffic instances automatically when overage is coming.","If overage is expected, create the recommended number of IPv6-only instances of my bundle in the same region. Ask me to confirm before creating anything.","uses the recommendation to call the Lightsail API and create instances."]],"scaleWarn":"Auto scale-up creates real, billed instances. Give the agent only the permissions it needs, require confirmation and cap the instance count.","devIntro":"Everything is static and readable from any origin. There is no server API and no key.","files":["Guide for agents: rules, link parameters, result fields","Prices and allowances for every region","The calculation module (ES module), the same code as this page"],"copyUrl":"Copy URL","codeH":"Call it from code","copy":"Copy","paramsH":"Pre-filled link parameters","params":["AWS Region code, e.g. us-east-1","Bundle, identified by RAM in GB; $7 / 2 TB is 1","GB used so far this month (in + out)","Expected month-end total in GB; on its own, plans the full month","Traffic instances as count@start[~end], UTC"],"more":"All parameters and result fields are in llms.txt. Node.js can't import from a URL: download calc.js or copy it from the repository."},
      cT: "Clear all data?", cB: "Instances, usage and settings return to defaults. This cannot be undone. Export a backup in Advanced settings first if needed.", cancel: "Cancel", clear: "Clear",
      rules: "Billing rules",
      r: ["Inbound + outbound <b>both use the allowance</b>",
        "Overage is <b>charged on outbound only</b>; inbound is always free",
        "Only same-region, <b>same-size</b> instances pool; dual-stack and IPv6-only of one size pool together",
        "Billed hourly; <b>stopped instances still bill</b>, only deletion stops it",
        "Overage already incurred <b>cannot be offset</b> by new instances; scale up before you run out",
        "Deleting and recreating <b>does not reset</b> this month’s usage",
        "Traffic over <b>private IPs</b> in one region uses allowance but is never charged",
        "Estimates use 1 TB = 1024 GB and UTC calendar months; your AWS bill is final"],
      links: ["Pricing", "Data transfer FAQ", "Billing FAQ", "Service terms", "View bill usage"],
      foot: "Data stays in this browser · Prices checked {d} · Not an official AWS tool", allowLbl: "Allowance {v}"
    },
    ja: {
      name: "AWS Lightsail 節約計算機", tagline: "「同じリージョン・同じプランのデータ転送量はプールで共有」というルールで、変動する通信量に最も安いプランを見つけます。",
      region: "リージョン：プールは同じリージョン内でのみ合算", lang: "言語", over: "超過", half: "枠半分",
      settings: "詳細設定", outRatio: "送信の割合", outRatioHint: "超過料金は送信のみ。不明なら 100% のままに。", prorate: "月途中の作成分は枠を時間按分",
      exp: "バックアップを書き出す", imp: "バックアップを読み込む", sample: "サンプルを読み込む", reset: "全データをリセット", resetHold: "1 秒長押しでリセット", copyLink: "設定リンクをコピー", copied: "コピーしました", linkLoaded: "リンクの設定を読み込みました。以前のデータはバックアップ済みです。", undo: "元のデータに戻す", gh: "GitHub でソースを見る", theme: "テーマ", th_system: "システム", th_light: "ライト", th_dark: "ダーク",
      roll: "{m} になりました。ベースと稼働中のトラフィック用インスタンスを残し、使用量をクリアしますか？", rollBtn: "新しい月を開始",
      usedUnit: "GB 使用", usedAria: "今月の使用量",
      recorded: "{t} 記録 · 1日平均 {v}", toBill: "請求書を開く",
      allow: "今月の枠", remain: "残り", exceeded: "超過", forecast: "月末予測", forecastTip: "空欄なら日平均から推定。予想する月合計 (GB) を入力することもできます", fcErr: "使用量 {v} 未満にはできません", endErr: "削除日時は作成日時より後にしてください", localTime: "ローカル時間", utcNote: "AWS は UTC の暦月で課金。今月はローカル時間 {t} から",
      cost: "今月の見積額", inclOver: "超過 {v} を含む",
      bandGood: "安全 · 枠内に収まります", bandWarn: "超過見込み {v}", bandBad: "超過中 · 追加 約 {v}", bandIdle: "使用量を入力", lgUsed: "使用 {v}", lgEnd: "月末予測 {v}", lgOver: "超過 {v}",
      fill: "まず今月の使用量を入力", fillHint: "{a}AWS 請求書 (Bills → Lightsail){/a} の {in} と {out} を合計してください。",
      enough: "枠は十分です。追加は不要", leftEnd: "月末に {v} 残る見込み",
      suggest: "トラフィック用インスタンスを {n} 台追加", apply: "追加する", from: "{spec}、{t} から", saveV: "追加しない場合より {v} 節約",
      exPred: "枠は {t} に尽きる見込み", exPast: "枠は {t} に尽きました", noAdd: "追加しない方が安い", planMode: "月全体で計画", planNote: "トラフィック用 1 台あたり +{a} · {c}/月", optimal: "すでに最安の構成です。残りの超過は避けられません",
      optNone: "追加なし", optN: "+{n} 台", barTip: "インスタンス {a} · 超過 {o}", locked: "既に超過した {v} は新規インスタンスで相殺できず、計上済みです。",
      next: "来月", nextLine: "今月のペース ({v}) なら {cfg}、約 {c}/月", cfgBase: "ベースのみ", cfgPlus: "ベース + {n} 台",
      fleet: "インスタンス一覧", fleetSum: "{n} 台 · {c}", base: "ベースインスタンス", baseHint: "プールの土台。追加するトラフィック用インスタンスは同じプランにする必要があります。",
      best: "最安", v4: "パブリック IPv4 が必要", dual: "デュアルスタック", start: "作成日時",
     
      nodes: "トラフィック用インスタンス", share: "同じリージョン・同じプランのインスタンスはプールを共有。IPv6-only。", nodeAdd: "今 1 台追加：+{a} · {c}（月末まで按分）", add: "トラフィック用インスタンスを追加",
      nStart: "作成", nEnd: "削除 (稼働中は空欄)", planned: "予定", gone: "削除済み", dec: "減らす", inc: "増やす", count: "台数", del: "削除",
      seoDesc: "無料の AWS Lightsail データ転送計算ツール。同じリージョン・同じプランのインスタンスは転送量の枠を共有します。使用量と残りの枠、月末の超過料金を予測し、最も安い IPv6 インスタンスの追加台数を求めます。", seoKw: "AWS Lightsail, Lightsail 転送量, Lightsail 超過料金, データ転送, 転送量計算, Lightsail 料金, IPv6, VPS",
      agent: "AI で使う", secCalc: "計算", secData: "データ",
      ag: {"title":"AI エージェントで使う","sub":"短いガイドを読ませるだけで、エージェントが計算し、ここで確認できるリンクを返します。","close":"閉じる","tabs":["クイックスタート","活用例","開発者向け"],"s1":"このプロンプトをコピー","prompt":"まず {url} を読み、その Lightsail の課金ルールでデータ転送プールを計算してください。\n私の構成：リージョン ___、プラン ___（例：$7 / 転送量 2 TB）、今月の使用量 ___ GB（___ 時点）。\n今月超過するか、最も安く済むトラフィック用インスタンスの追加台数を教えてください。確認用に入力済みの計算機リンクもください。","copyPrompt":"プロンプトをコピー","s2":"Web を閲覧できるエージェントに貼り付ける","s2n":"ChatGPT、Claude、Gemini、Cursor などで使えます。空欄を埋めるか、請求書の転送量の明細をそのまま貼り付けてください。","s3":"返ってきたリンクを開く","s3n":"リンクを開くと構成がこのページに読み込まれ、数値を確認できます。元のデータは先にバックアップされ、復元できます。","privacy":"このページは何もアップロードしません。設定リンクには使用量が含まれるので、共有前に確認してください。","casesIntro":"質問をコピーして数値を書き換え、エージェントに送るだけです。どの質問にもガイドの URL が入っています。","does":"エージェント：","copyQ":"質問をコピー","ref":"（ルールと計算方法：{url}）","perm":{"none":"権限不要","ro":"AWS 読み取り権限","rw":"AWS 書き込み権限・費用発生"},"cases":[["超過する？","月の途中で、枠が足りるか確認したい。","東京で $12 / 3 TB の Lightsail プランを使っていて、今月は 2800 GB 使いました。今月超過しますか？トラフィック用インスタンスを何台追加すべき？","1 日あたりのペースから月末を予測し、最も安い対策を出します。"],["構成を選ぶ","新規プロジェクトのデプロイ前に検討したい。","月に約 8 TB 転送するアプリで、ユーザーは主に東南アジアです。Lightsail で最も安いリージョンとプランの組み合わせは？","リージョン単価、枠半分のリージョン、プランとトラフィック用インスタンスの組み合わせを比較します。"],["来月の計画","月初に台数を決めたい。","来月はフランクフルトの $7 / 2 TB プランで約 12000 GB を見込んでいます。トラフィック用インスタンスは何台が最安ですか？","月全体の計画モードで台数と月額を出します。"],["請求書を読む","請求書の転送量の明細がわかりにくい。","AWS 請求書の Lightsail 転送量の明細です：（貼り付け）。枠はあとどれくらいで、課金されますか？","DataXfer-In/Out を合計し、確認用リンクを返します。"],["使用量アラート","毎日チェックして、超過前に知らせてほしい。","毎朝 Lightsail インスタンスのネットワーク指標を読み取り、今月超過しそうなら知らせてください。","AWS CLI または SDK で NetworkIn/Out を読み、計算して通知します。"],["自動スケールアップ","超過しそうなときに自動で追加したい。","超過が見込まれる場合、同じリージョンに同じプランの IPv6 インスタンスを推奨台数だけ作成してください。作成前に必ず確認を求めてください。","推奨結果に従って Lightsail API でインスタンスを作成します。"]],"scaleWarn":"自動スケールアップは実際に課金されるインスタンスを作成します。必要最小限の権限だけを与え、作成前の確認と台数の上限を設定してください。","devIntro":"すべて静的ファイルで、どのオリジンからも読み込めます。サーバー API もキーもありません。","files":["エージェント向けガイド：ルール、リンクのパラメータ、結果のフィールド","全リージョンの料金と転送枠","計算モジュール（ES Module）、このページと同じコード"],"copyUrl":"URL をコピー","codeH":"コードから呼び出す","copy":"コピー","paramsH":"入力済みリンクのパラメータ","params":["AWS リージョンコード（例 us-east-1）","プラン（メモリ GB で指定）。$7 / 2 TB は 1","今月の使用量 GB（受信 + 送信）","月末の見込み合計 GB。単独なら月全体の計画","トラフィック用インスタンス：台数@開始[~終了]、UTC"],"more":"すべてのパラメータと結果のフィールドは llms.txt にあります。Node.js は URL から直接 import できないため、calc.js をダウンロードするかリポジトリからコピーしてください。"},
      cT: "全データを消去しますか？", cB: "インスタンス、使用量、設定が初期状態に戻り、元に戻せません。必要なら先に詳細設定から書き出してください。", cancel: "キャンセル", clear: "消去",
      rules: "料金ルール早見表",
      r: ["受信 + 送信の<b>両方が枠を消費</b>",
        "超過料金は<b>送信のみ</b>、受信は常に無料",
        "同じリージョン・<b>同じプラン</b>のみ合算。同じプランのデュアルスタックと IPv6-only は合算可",
        "時間課金。<b>停止中も課金</b>、削除で停止",
        "発生済みの超過は<b>新規インスタンスで相殺不可</b>。尽きる前に追加を",
        "削除して再作成しても今月の使用量は<b>リセットされない</b>",
        "同一リージョンの<b>プライベート IP</b> 通信は枠を消費するが超過でも無料",
        "1 TB = 1024 GB、UTC の暦月で見積もり。最終的には AWS の請求が基準"],
      links: ["料金", "データ転送 FAQ", "請求 FAQ", "サービス条件", "請求の使用量を見る"],
      foot: "データはこのブラウザにのみ保存 · 価格確認 {d} · AWS 公式ツールではありません", allowLbl: "枠 {v}"
    },
    ko: {
      name: "AWS Lightsail 절약 계산기", tagline: "‘같은 리전·같은 사양 인스턴스는 전송량 풀을 공유’하는 규칙으로 변동 트래픽에 가장 저렴한 구성을 찾아줍니다.",
      region: "리전: 풀은 같은 리전 안에서만 합산", lang: "언어", over: "초과", half: "할당량 절반",
      settings: "고급 설정", outRatio: "아웃바운드 비율", outRatioHint: "초과 요금은 아웃바운드에만 부과됩니다. 모르면 100% 유지.", prorate: "월 중간 생성분 할당량을 시간 비례 계산",
      exp: "백업 내보내기", imp: "백업 가져오기", sample: "예시 불러오기", reset: "모든 데이터 초기화", resetHold: "1초간 눌러 초기화", copyLink: "설정 링크 복사", copied: "복사됨", linkLoaded: "링크의 설정을 불러왔습니다. 이전 데이터는 백업되었습니다.", undo: "이전 데이터 복원", gh: "GitHub에서 소스 보기", theme: "테마", th_system: "시스템", th_light: "라이트", th_dark: "다크",
      roll: "{m}이 시작되었습니다. 기본 인스턴스와 실행 중인 트래픽 인스턴스는 유지하고 사용량을 초기화할까요?", rollBtn: "새 달 시작",
      usedUnit: "GB 사용", usedAria: "이번 달 사용량",
      recorded: "{t} 기록 · 일평균 {v}", toBill: "청구서 열기",
      allow: "이번 달 할당량", remain: "남음", exceeded: "초과", forecast: "월말 예상", forecastTip: "비워 두면 일평균으로 추정하며, 예상 월 총량(GB)을 직접 입력할 수도 있습니다", fcErr: "사용량 {v}보다 작을 수 없습니다", endErr: "삭제 시각은 생성 시각보다 늦어야 합니다", localTime: "현지 시간", utcNote: "AWS는 UTC 달력 월 기준 과금. 이번 달은 현지 시간 {t}부터",
      cost: "이번 달 예상 비용", inclOver: "초과 {v} 포함",
      bandGood: "안전 · 할당량 이내", bandWarn: "초과 예상 {v}", bandBad: "초과됨 · 추가 약 {v}", bandIdle: "사용량 입력", lgUsed: "사용 {v}", lgEnd: "월말 예상 {v}", lgOver: "초과 {v}",
      fill: "먼저 이번 달 사용량을 입력하세요", fillHint: "{a}AWS 청구서(Bills → Lightsail){/a}에서 {in}와 {out}를 더하면 됩니다.",
      enough: "할당량이 충분합니다. 추가 불필요", leftEnd: "월말 {v} 남음",
      suggest: "트래픽 인스턴스 {n}대 추가 권장", apply: "바로 추가", from: "{spec}, {t}부터", saveV: "추가하지 않을 때보다 {v} 절약",
      exPred: "할당량 {t} 소진 예상", exPast: "할당량 {t}에 소진됨", noAdd: "추가하지 않는 편이 저렴", planMode: "한 달 전체 기준", planNote: "트래픽 인스턴스 1대당 +{a} · {c}/월", optimal: "이미 가장 저렴한 구성입니다. 남은 초과는 피할 수 없습니다",
      optNone: "추가 안 함", optN: "+{n}대", barTip: "인스턴스 {a} · 초과 {o}", locked: "이미 초과한 {v}는 새 인스턴스로 상쇄할 수 없어 포함했습니다.",
      next: "다음 달", nextLine: "이번 달 속도({v})라면 {cfg}, 약 {c}/월", cfgBase: "기본 인스턴스만", cfgPlus: "기본 + 트래픽 {n}대",
      fleet: "인스턴스 개요", fleetSum: "{n}대 · {c}", base: "기본 인스턴스", baseHint: "풀의 기반. 새로 추가하는 트래픽 인스턴스는 같은 사양이어야 합니다.",
      best: "최저가", v4: "퍼블릭 IPv4 필요", dual: "듀얼 스택", start: "생성 시각",
     
      nodes: "트래픽 인스턴스", share: "같은 리전·같은 사양 인스턴스는 풀을 공유. IPv6-only.", nodeAdd: "지금 1대 추가: +{a} · {c} (월말까지 비례)", add: "트래픽 인스턴스 추가",
      nStart: "생성", nEnd: "삭제 (실행 중이면 비움)", planned: "예정", gone: "삭제됨", dec: "줄이기", inc: "늘리기", count: "대수", del: "삭제",
      seoDesc: "무료 AWS Lightsail 데이터 전송 계산기. 같은 리전·같은 플랜 인스턴스는 전송량 할당을 공유합니다. 사용량과 남은 할당량, 월말 초과 요금을 예측하고 가장 저렴한 IPv6 인스턴스 추가 대수를 찾아줍니다.", seoKw: "AWS Lightsail, Lightsail 데이터 전송, Lightsail 초과 요금, 전송량 계산기, Lightsail 요금, IPv6 인스턴스, VPS",
      agent: "AI로 사용", secCalc: "계산", secData: "데이터",
      ag: {"title":"AI 에이전트에서 사용하기","sub":"짧은 안내 문서만 읽히면 에이전트가 대신 계산하고, 여기서 확인할 수 있는 링크를 돌려줍니다.","close":"닫기","tabs":["빠른 시작","활용 예시","개발자"],"s1":"이 프롬프트를 복사하세요","prompt":"먼저 {url} 을 읽고, 그 Lightsail 과금 규칙으로 내 데이터 전송 풀을 계산해 주세요.\n내 구성: 리전 ___, 플랜 ___(예: $7 / 전송량 2 TB), 이번 달 사용량 ___ GB(___ 기준).\n이번 달 초과 여부와 가장 저렴한 트래픽 인스턴스 추가 대수를 알려 주고, 확인용으로 값이 채워진 계산기 링크도 주세요.","copyPrompt":"프롬프트 복사","s2":"웹 검색이 되는 에이전트에 붙여 넣기","s2n":"ChatGPT, Claude, Gemini, Cursor 등 모두 됩니다. 빈칸을 채우거나 청구서의 전송량 항목을 그대로 붙여 넣으세요.","s3":"돌려받은 링크 열기","s3n":"링크를 열면 구성이 이 페이지에 불러와져 숫자를 확인할 수 있습니다. 기존 데이터는 먼저 백업되며 복원할 수 있습니다.","privacy":"이 페이지는 아무것도 업로드하지 않습니다. 설정 링크에는 사용량이 들어 있으니 공유 전에 확인하세요.","casesIntro":"질문을 복사해 숫자만 바꿔 에이전트에 보내세요. 모든 질문에 안내 문서 주소가 들어 있습니다.","does":"에이전트: ","copyQ":"질문 복사","ref":" (규칙과 계산 방법: {url})","perm":{"none":"권한 불필요","ro":"AWS 읽기 권한","rw":"AWS 쓰기 권한 · 비용 발생"},"cases":[["초과할까?","월 중간에 할당량이 충분한지 확인.","도쿄에서 $12 / 3 TB Lightsail 플랜을 쓰고 이번 달 2800 GB를 썼습니다. 이번 달 초과하나요? 트래픽 인스턴스를 몇 대 추가해야 하나요?","일평균 속도로 월말을 예측하고 가장 저렴한 해결책을 찾습니다."],["구성 선택","새 프로젝트 배포 전에 검토.","월 약 8 TB를 전송하는 앱이고 사용자는 주로 동남아시아에 있습니다. Lightsail에서 가장 저렴한 리전과 플랜 구성은?","리전 단가, 할당량 절반 리전, 플랜과 트래픽 인스턴스 조합을 비교합니다."],["다음 달 계획","월초에 인스턴스 수를 정하기.","다음 달 프랑크푸르트 $7 / 2 TB 플랜으로 약 12000 GB를 예상합니다. 트래픽 인스턴스를 몇 대 두면 가장 저렴한가요?","월 전체 계획 모드로 대수와 월 비용을 계산합니다."],["청구서 해석","청구서의 전송량 항목이 이해하기 어려움.","AWS 청구서의 Lightsail 전송량 항목입니다: (붙여 넣기). 남은 할당량은 얼마이고 요금이 나오나요?","DataXfer-In/Out 항목을 합산하고 확인용 링크를 줍니다."],["사용량 알림","매일 점검해 초과 전에 알림.","매일 아침 내 Lightsail 인스턴스의 네트워크 지표를 읽고, 이번 달 초과가 예상되면 알려 주세요.","AWS CLI 또는 SDK로 NetworkIn/Out을 읽어 계산한 뒤 알려 줍니다."],["자동 확장","초과가 예상되면 트래픽 인스턴스를 자동 추가.","초과가 예상되면 같은 리전에 같은 플랜의 IPv6 인스턴스를 추천 대수만큼 만들어 주세요. 만들기 전에 반드시 확인을 받으세요.","추천 결과에 따라 Lightsail API로 인스턴스를 만듭니다."]],"scaleWarn":"자동 확장은 실제로 과금되는 인스턴스를 만듭니다. 필요한 권한만 주고, 생성 전 확인과 인스턴스 수 상한을 설정하세요.","devIntro":"모든 파일은 정적이며 어느 출처에서나 읽을 수 있습니다. 서버 API도 키도 없습니다.","files":["에이전트용 안내: 규칙, 링크 매개변수, 결과 필드","모든 리전의 가격과 할당량","계산 모듈(ES Module), 이 페이지와 같은 코드"],"copyUrl":"URL 복사","codeH":"코드에서 호출","copy":"복사","paramsH":"미리 채운 링크 매개변수","params":["AWS 리전 코드(예: us-east-1)","플랜(메모리 GB로 지정). $7 / 2 TB는 1","이번 달 사용량 GB(수신 + 송신)","예상 월말 총량 GB; 단독으로 쓰면 월 전체 계획","트래픽 인스턴스: 대수@시작[~종료], UTC"],"more":"모든 매개변수와 결과 필드는 llms.txt에 있습니다. Node.js는 URL에서 바로 import할 수 없으니 calc.js를 내려받거나 저장소에서 복사하세요."},
      cT: "모든 데이터를 지울까요?", cB: "인스턴스, 사용량, 설정이 기본값으로 돌아가며 되돌릴 수 없습니다. 필요하면 먼저 고급 설정에서 내보내세요.", cancel: "취소", clear: "지우기",
      rules: "요금 규칙 요약",
      r: ["인바운드 + 아웃바운드 <b>모두 할당량 차감</b>",
        "초과 요금은 <b>아웃바운드만</b>, 인바운드는 항상 무료",
        "같은 리전·<b>같은 사양</b>만 합산. 같은 사양의 듀얼 스택과 IPv6-only는 합산 가능",
        "시간 단위 과금. <b>중지해도 과금</b>, 삭제해야 중단",
        "이미 발생한 초과는 <b>새 인스턴스로 상쇄 불가</b>. 소진 전에 추가하세요",
        "삭제 후 재생성해도 이번 달 사용량은 <b>초기화되지 않음</b>",
        "같은 리전 <b>프라이빗 IP</b> 트래픽은 할당량을 차감하지만 초과해도 무료",
        "1 TB = 1024 GB, UTC 달력 월 기준 추정. 최종 금액은 AWS 청구서 기준"],
      links: ["요금", "데이터 전송 FAQ", "청구 FAQ", "서비스 약관", "청구 사용량 보기"],
      foot: "데이터는 이 브라우저에만 저장 · 가격 확인 {d} · AWS 공식 도구 아님", allowLbl: "할당량 {v}"
    },
    es: {
      name: "Calculadora de ahorro AWS Lightsail", tagline: "Aprovecha que las instancias de la misma región y tamaño comparten la transferencia para hallar el plan más barato con tráfico variable.",
      region: "Región: la cuota solo se combina dentro de una región", lang: "Idioma", over: "exceso", half: "cuota a la mitad",
      settings: "Ajustes avanzados", outRatio: "Proporción saliente", outRatioHint: "Solo el tráfico saliente se cobra como exceso. Deja 100 % si no lo sabes.", prorate: "Prorratear la cuota de instancias creadas a mitad de mes",
      exp: "Exportar copia", imp: "Importar copia", sample: "Cargar ejemplo", reset: "Restablecer todo", resetHold: "Mantén 1 s para restablecer", copyLink: "Copiar enlace de configuración", copied: "Copiado", linkLoaded: "Se cargó la configuración del enlace. Tus datos anteriores están respaldados.", undo: "Restaurar mis datos", gh: "Ver el código en GitHub", theme: "Tema", th_system: "Sistema", th_light: "Claro", th_dark: "Oscuro",
      roll: "Ha empezado {m}. ¿Conservar la base y las instancias de tráfico activas y poner el uso a cero?", rollBtn: "Empezar mes nuevo",
      usedUnit: "GB usados", usedAria: "Datos usados este mes",
      recorded: "Registrado {t} · {v}/día", toBill: "Abrir facturas",
      allow: "Cuota", remain: "Restante", exceeded: "Excedido", forecast: "Previsión a fin de mes", forecastTip: "Vacío = proyección por media diaria; o escribe el total mensual esperado (GB)", fcErr: "No puede ser menor que lo usado ({v})", endErr: "La eliminación debe ser posterior a la creación", localTime: "hora local", utcNote: "AWS factura por mes natural UTC; este mes empezó el {t} (hora local)",
      cost: "Coste estimado", inclOver: "incl. {v} de exceso",
      bandGood: "Seguro · dentro de cuota", bandWarn: "Exceso previsto: {v}", bandBad: "Cuota superada · unos {v} extra", bandIdle: "Introduce el uso", lgUsed: "Usado {v}", lgEnd: "Fin de mes {v}", lgOver: "Exceso {v}",
      fill: "Primero introduce el uso de este mes", fillHint: "En {a}AWS Bills → Lightsail{/a}, suma los conceptos {in} y {out}.",
      enough: "La cuota alcanza, no hace falta añadir", leftEnd: "Quedarán {v} a fin de mes",
      suggest: "Añade {n} instancia(s) de tráfico", apply: "Añadir", from: "{spec}, desde {t}", saveV: "ahorra {v} frente a no añadir",
      exPred: "la cuota se agota el {t}", exPast: "la cuota se agotó el {t}", noAdd: "No añadir es más barato", planMode: "Plan de mes completo", planNote: "Cada instancia de tráfico: +{a} · {c}/mes", optimal: "Ya es la configuración más barata; el exceso restante es inevitable",
      optNone: "Ninguna", optN: "+{n}", barTip: "Instancias {a} · Exceso {o}", locked: "Los {v} ya excedidos no se compensan con instancias nuevas y están incluidos.",
      next: "Próximo mes", nextLine: "Al ritmo de este mes ({v}), usa {cfg}, unos {c}/mes", cfgBase: "solo la base", cfgPlus: "base + {n} de tráfico",
      fleet: "Resumen de instancias", fleetSum: "{n} · {c}", base: "Instancia base", baseHint: "La base del pool. Cada instancia de tráfico que añadas debe tener su mismo tamaño.",
      best: "Mejor", v4: "Necesita IPv4 pública", dual: "Doble pila", start: "Creada",
     
      nodes: "Instancias de tráfico", share: "Las instancias de la misma región y tamaño comparten el pool. Solo IPv6.", nodeAdd: "Añadir 1 ahora: +{a} · {c} (prorrateado a fin de mes)", add: "Añadir instancia de tráfico",
      nStart: "Creada", nEnd: "Eliminada (vacío si activa)", planned: "Prevista", gone: "Eliminada", dec: "Restar", inc: "Sumar", count: "Cantidad", del: "Quitar",
      seoDesc: "Calculadora gratuita de transferencia de datos de AWS Lightsail. Las instancias del mismo tamaño en la misma región comparten la asignación: controla el uso, prevé el exceso a fin de mes y encuentra cuántas instancias IPv6 añadir al menor coste.", seoKw: "AWS Lightsail, transferencia de datos Lightsail, exceso Lightsail, calculadora, precios Lightsail, instancia IPv6, VPS",
      agent: "Usar con IA", secCalc: "Cálculo", secData: "Datos",
      ag: {"title":"Úsalo con un agente de IA","sub":"Tu agente lee una guía breve, hace las cuentas por ti y te devuelve un enlace para comprobarlas aquí.","close":"Cerrar","tabs":["Inicio rápido","Casos de uso","Desarrolladores"],"s1":"Copia este prompt","prompt":"Lee primero {url} y usa sus reglas de facturación de Lightsail para calcular mi pool de transferencia de datos.\nMi configuración: región ___, plan ___ (p. ej. $7 / 2 TB de transferencia), ___ GB usados este mes (a fecha de ___).\nDime si me pasaré este mes y cuántas instancias de tráfico añadir para pagar lo mínimo, y dame un enlace de la calculadora ya rellenado para comprobarlo.","copyPrompt":"Copiar prompt","s2":"Pégalo en un agente con acceso a la web","s2n":"Sirven ChatGPT, Claude, Gemini, Cursor y similares. Completa los huecos o pega las líneas de transferencia de tu factura.","s3":"Abre el enlace que te devuelve","s3n":"El enlace carga la configuración aquí para que compruebes los números. Tus datos actuales se guardan antes y puedes restaurarlos.","privacy":"Esta página no sube nada. Los enlaces de configuración incluyen tus cifras de uso: revísalos antes de compartirlos.","casesIntro":"Copia una pregunta, cambia los números y envíala a tu agente. Todas incluyen ya la dirección de la guía.","does":"El agente: ","copyQ":"Copiar pregunta","ref":" (Reglas y método: {url})","perm":{"none":"Sin permisos","ro":"AWS solo lectura","rw":"AWS escritura · genera costes"},"cases":[["¿Me pasaré?","A mitad de mes, saber si el pool aguanta.","Tengo el plan Lightsail de $12 / 3 TB en Tokio y llevo 2800 GB este mes. ¿Me pasaré? ¿Cuántas instancias de tráfico debo añadir?","proyecta el fin de mes con el ritmo diario y busca la solución más barata."],["Elegir configuración","Planificar un proyecto nuevo antes de desplegar.","Mi app moverá unos 8 TB al mes, sobre todo a usuarios del sudeste asiático. ¿Qué región y plan de Lightsail sale más barato?","compara precios por región, regiones con media asignación y combinaciones de plan e instancias de tráfico."],["Planificar el mes","Dimensionar la flota a principio de mes.","El mes que viene espero unos 12 000 GB en Fráncfort con el plan de $7 / 2 TB. ¿Cuántas instancias de tráfico minimizan el coste?","hace un plan de mes completo y devuelve el número y el coste mensual."],["Entender la factura","Las líneas de transferencia de la factura cuestan de leer.","Estas son las líneas de transferencia de Lightsail de mi factura de AWS: (pegar). ¿Cuánta asignación me queda y me cobrarán?","suma los conceptos DataXfer-In/Out y te da un enlace para verificar."],["Alertas de uso","Una comprobación diaria que avisa antes del exceso.","Cada mañana, lee las métricas de red de mis instancias Lightsail y avísame si este mes va camino de pasarse.","lee NetworkIn/Out con la CLI o el SDK de AWS, hace el cálculo y te avisa."],["Escalado automático","Añadir instancias de tráfico solas cuando se acerca el exceso.","Si se prevé exceso, crea en la misma región el número recomendado de instancias solo IPv6 de mi plan. Pídeme confirmación antes de crear nada.","usa la recomendación para llamar a la API de Lightsail y crear instancias."]],"scaleWarn":"El escalado automático crea instancias reales que se facturan. Da al agente solo los permisos necesarios, exige confirmación y fija un máximo de instancias.","devIntro":"Todo es estático y se puede leer desde cualquier origen. No hay API de servidor ni clave.","files":["Guía para agentes: reglas, parámetros del enlace, campos del resultado","Precios y asignaciones de todas las regiones","El módulo de cálculo (ES module), el mismo código que esta página"],"copyUrl":"Copiar URL","codeH":"Llamarlo desde código","copy":"Copiar","paramsH":"Parámetros del enlace prellenado","params":["Código de región de AWS, p. ej. us-east-1","Plan, identificado por su RAM en GB; $7 / 2 TB es 1","GB usados este mes (entrada + salida)","Total previsto a fin de mes en GB; solo, planifica el mes completo","Instancias de tráfico: cantidad@inicio[~fin], UTC"],"more":"Todos los parámetros y campos del resultado están en llms.txt. Node.js no puede importar desde una URL: descarga calc.js o cópialo del repositorio."},
      cT: "¿Borrar todos los datos?", cB: "Instancias, uso y ajustes vuelven a los valores iniciales. No se puede deshacer. Exporta una copia antes si la necesitas.", cancel: "Cancelar", clear: "Borrar",
      rules: "Reglas de facturación",
      r: ["Entrante + saliente <b>consumen la cuota</b>",
        "El exceso <b>solo se cobra en saliente</b>; el entrante es gratis",
        "Solo se combinan instancias de la misma región y <b>mismo tamaño</b>; doble pila e IPv6 del mismo tamaño se combinan",
        "Facturación por hora; <b>detenida también cobra</b>, solo eliminarla lo detiene",
        "El exceso ya generado <b>no se compensa</b> con instancias nuevas; amplía antes de agotar",
        "Eliminar y recrear <b>no reinicia</b> el uso del mes",
        "El tráfico por <b>IP privada</b> en la región consume cuota pero nunca se cobra",
        "Estimación con 1 TB = 1024 GB y meses UTC; manda la factura de AWS"],
      links: ["Precios", "FAQ de transferencia", "FAQ de facturación", "Términos del servicio", "Ver uso en la factura"],
      foot: "Los datos se quedan en este navegador · Precios revisados {d} · No es una herramienta oficial de AWS", allowLbl: "Cuota {v}"
    },
    fr: {
      name: "Calculateur d’économies AWS Lightsail", tagline: "S’appuie sur le partage du quota de transfert entre instances de même région et même taille pour trouver le plan le moins cher.",
      region: "Région : les quotas ne se cumulent que dans une région", lang: "Langue", over: "dépassement", half: "quota divisé par deux",
      settings: "Réglages avancés", outRatio: "Part sortante", outRatioHint: "Seul le trafic sortant est facturé en dépassement. Gardez 100 % en cas de doute.", prorate: "Proratiser le quota des instances créées en cours de mois",
      exp: "Exporter", imp: "Importer", sample: "Charger un exemple", reset: "Tout réinitialiser", resetHold: "Maintenez 1 s pour réinitialiser", copyLink: "Copier le lien de configuration", copied: "Copié", linkLoaded: "Configuration du lien chargée. Vos données précédentes sont sauvegardées.", undo: "Restaurer mes données", gh: "Voir le code sur GitHub", theme: "Thème", th_system: "Système", th_light: "Clair", th_dark: "Sombre",
      roll: "{m} a commencé. Garder la base et les instances de trafic actives et remettre l’usage à zéro ?", rollBtn: "Nouveau mois",
      usedUnit: "Go utilisés", usedAria: "Données utilisées ce mois",
      recorded: "Relevé {t} · {v}/jour", toBill: "Ouvrir les factures",
      allow: "Quota", remain: "Restant", exceeded: "Dépassé de", forecast: "Prévision fin de mois", forecastTip: "Vide = projection selon la moyenne quotidienne ; ou saisissez le total mensuel attendu (Go)", fcErr: "Ne peut pas être inférieur à l’usage ({v})", endErr: "La suppression doit être postérieure à la création", localTime: "heure locale", utcNote: "AWS facture par mois civil UTC ; ce mois a commencé le {t} (heure locale)",
      cost: "Coût estimé", inclOver: "dont {v} de dépassement",
      bandGood: "Sûr · dans le quota", bandWarn: "Dépassement prévu : {v}", bandBad: "Quota dépassé · environ {v} en plus", bandIdle: "Saisir l’usage", lgUsed: "Utilisé {v}", lgEnd: "Fin de mois {v}", lgOver: "Dépassement {v}",
      fill: "Saisissez d’abord l’usage du mois", fillHint: "Dans {a}AWS Bills → Lightsail{/a}, additionnez les lignes {in} et {out}.",
      enough: "Le quota suffit, rien à ajouter", leftEnd: "{v} restants en fin de mois",
      suggest: "Ajoutez {n} instance(s) de trafic", apply: "Ajouter", from: "{spec}, dès le {t}", saveV: "économise {v} par rapport à ne rien ajouter",
      exPred: "quota épuisé le {t}", exPast: "quota épuisé depuis le {t}", noAdd: "Ne rien ajouter coûte moins", planMode: "Plan sur le mois entier", planNote: "Par instance de trafic : +{a} · {c}/mois", optimal: "Configuration déjà optimale ; le dépassement restant est inévitable",
      optNone: "Aucune", optN: "+{n}", barTip: "Instances {a} · Dépassement {o}", locked: "Les {v} déjà dépassés ne peuvent pas être compensés et sont inclus.",
      next: "Mois prochain", nextLine: "Au rythme actuel ({v}), prévoyez {cfg}, environ {c}/mois", cfgBase: "la base seule", cfgPlus: "base + {n} de trafic",
      fleet: "Vue des instances", fleetSum: "{n} · {c}", base: "Instance de base", baseHint: "Le socle du pool. Chaque instance de trafic ajoutée doit avoir la même taille.",
      best: "Optimal", v4: "IPv4 publique requise", dual: "Double pile", start: "Créée le",
     
      nodes: "Instances de trafic", share: "Même région, même taille : le pool est partagé. IPv6 seul.", nodeAdd: "Ajouter 1 maintenant : +{a} · {c} (au prorata jusqu’à fin de mois)", add: "Ajouter une instance de trafic",
      nStart: "Créée", nEnd: "Supprimée (vide si active)", planned: "Prévue", gone: "Supprimée", dec: "Moins", inc: "Plus", count: "Nombre", del: "Retirer",
      seoDesc: "Calculateur gratuit du transfert de données AWS Lightsail. Les instances de même taille dans une même région partagent leur quota : suivez la consommation, anticipez le dépassement de fin de mois et trouvez combien d’instances IPv6 ajouter au moindre coût.", seoKw: "AWS Lightsail, transfert de données Lightsail, dépassement Lightsail, calculateur, tarifs Lightsail, instance IPv6, VPS",
      agent: "Utiliser avec l’IA", secCalc: "Calcul", secData: "Données",
      ag: {"title":"L’utiliser avec un agent IA","sub":"Votre agent lit un court guide, fait le calcul et vous renvoie un lien à vérifier ici.","close":"Fermer","tabs":["Démarrage","Cas d’usage","Développeurs"],"s1":"Copiez ce prompt","prompt":"Lis d’abord {url}, puis applique ses règles de facturation Lightsail pour calculer mon pool de transfert de données.\nMa configuration : région ___, forfait ___ (ex. 7 $ / 2 To de transfert), ___ Go utilisés ce mois-ci (au ___).\nDis-moi si je vais dépasser ce mois-ci et combien d’instances de trafic ajouter au moindre coût, et donne-moi un lien de calculatrice pré-rempli pour vérifier.","copyPrompt":"Copier le prompt","s2":"Collez-le dans un agent qui accède au web","s2n":"ChatGPT, Claude, Gemini, Cursor et équivalents conviennent. Remplissez les blancs ou collez les lignes de transfert de votre facture.","s3":"Ouvrez le lien qu’il renvoie","s3n":"Le lien charge la configuration ici pour vérifier les chiffres. Vos données actuelles sont d’abord sauvegardées et restaurables.","privacy":"Cette page n’envoie rien. Les liens de configuration contiennent vos chiffres d’usage : vérifiez avant de les partager.","casesIntro":"Copiez une question, changez les chiffres et envoyez-la à votre agent. Chacune indique déjà l’adresse du guide.","does":"L’agent : ","copyQ":"Copier la question","ref":" (Règles et méthode : {url})","perm":{"none":"Aucun accès requis","ro":"AWS lecture seule","rw":"AWS écriture · payant"},"cases":[["Vais-je dépasser ?","En milieu de mois, savoir si le pool tiendra.","J’ai le forfait Lightsail à 12 $ / 3 To à Tokyo et j’ai utilisé 2800 Go ce mois-ci. Vais-je dépasser ? Combien d’instances de trafic ajouter ?","projette la fin du mois au rythme quotidien et trouve la solution la moins chère."],["Choisir une config","Préparer un nouveau projet avant le déploiement.","Mon app enverra environ 8 To par mois, surtout vers l’Asie du Sud-Est. Quelle région et quel forfait Lightsail coûtent le moins ?","compare les prix par région, les régions à quota réduit de moitié et les combinaisons forfait + instances de trafic."],["Planifier le mois","Dimensionner la flotte en début de mois.","Le mois prochain, je prévois environ 12 000 Go à Francfort avec le forfait à 7 $ / 2 To. Combien d’instances de trafic pour le coût le plus bas ?","fait un plan sur le mois entier et renvoie le nombre et le coût mensuel."],["Lire ma facture","Les lignes de transfert de la facture sont peu lisibles.","Voici les lignes de transfert Lightsail de ma facture AWS : (coller). Combien de quota me reste-t-il et serai-je facturé ?","additionne les postes DataXfer-In/Out et vous donne un lien de vérification."],["Alertes d’usage","Un contrôle quotidien qui prévient avant le dépassement.","Chaque matin, lis les métriques réseau de mes instances Lightsail et préviens-moi si ce mois-ci s’oriente vers un dépassement.","lit NetworkIn/Out via l’AWS CLI ou le SDK, fait le calcul et vous prévient."],["Montée en charge auto","Ajouter des instances de trafic automatiquement avant un dépassement.","Si un dépassement est prévu, crée dans la même région le nombre recommandé d’instances IPv6 seulement de mon forfait. Demande-moi confirmation avant toute création.","s’appuie sur la recommandation pour appeler l’API Lightsail et créer les instances."]],"scaleWarn":"La montée en charge auto crée de vraies instances facturées. Donnez à l’agent le strict nécessaire, exigez une confirmation et plafonnez le nombre d’instances.","devIntro":"Tout est statique et lisible depuis n’importe quelle origine. Pas d’API serveur, pas de clé.","files":["Guide pour agents : règles, paramètres de lien, champs du résultat","Prix et quotas de chaque région","Le module de calcul (module ES), le même code que cette page"],"copyUrl":"Copier l’URL","codeH":"L’appeler depuis du code","copy":"Copier","paramsH":"Paramètres du lien pré-rempli","params":["Code de région AWS, ex. us-east-1","Forfait, identifié par sa RAM en Go ; 7 $ / 2 To vaut 1","Go utilisés ce mois-ci (entrant + sortant)","Total prévu en fin de mois en Go ; seul, planifie le mois entier","Instances de trafic : nombre@début[~fin], UTC"],"more":"Tous les paramètres et champs du résultat sont dans llms.txt. Node.js ne peut pas importer depuis une URL : téléchargez calc.js ou copiez-le depuis le dépôt."},
      cT: "Effacer toutes les données ?", cB: "Instances, usage et réglages reviennent aux valeurs par défaut, sans retour possible. Exportez une sauvegarde avant si besoin.", cancel: "Annuler", clear: "Effacer",
      rules: "Règles de facturation",
      r: ["Entrant + sortant <b>consomment le quota</b>",
        "Le dépassement est <b>facturé en sortant uniquement</b> ; l’entrant est gratuit",
        "Seules les instances de même région et <b>même taille</b> se cumulent ; double pile et IPv6 de même taille aussi",
        "Facturation à l’heure ; <b>arrêtée, elle est facturée</b>, seule la suppression l’arrête",
        "Un dépassement déjà subi <b>n’est pas compensé</b> par de nouvelles instances ; ajoutez avant l’épuisement",
        "Supprimer puis recréer <b>ne remet pas à zéro</b> l’usage du mois",
        "Le trafic par <b>IP privée</b> dans la région consomme le quota mais n’est jamais facturé",
        "Estimation avec 1 To = 1024 Go et mois UTC ; la facture AWS fait foi"],
      links: ["Tarifs", "FAQ transfert", "FAQ facturation", "Conditions de service", "Voir l’usage facturé"],
      foot: "Les données restent dans ce navigateur · Tarifs vérifiés {d} · Outil non officiel AWS", allowLbl: "Quota {v}"
    },
    de: {
      name: "AWS Lightsail Sparrechner", tagline: "Nutzt die Regel, dass Instanzen gleicher Region und Größe ein Transfervolumen teilen, und findet den günstigsten Plan für schwankenden Traffic.",
      region: "Region: Kontingente werden nur innerhalb einer Region zusammengelegt", lang: "Sprache", over: "Überschreitung", half: "halbes Kontingent",
      settings: "Erweiterte Einstellungen", outRatio: "Ausgehender Anteil", outRatioHint: "Nur ausgehender Traffic wird als Überschreitung berechnet. Im Zweifel 100 % lassen.", prorate: "Kontingent bei Erstellung im Monat anteilig rechnen",
      exp: "Backup exportieren", imp: "Backup importieren", sample: "Beispiel laden", reset: "Alle Daten zurücksetzen", resetHold: "1 s halten zum Zurücksetzen", copyLink: "Konfigurationslink kopieren", copied: "Kopiert", linkLoaded: "Konfiguration aus dem Link geladen. Deine vorherigen Daten sind gesichert.", undo: "Meine Daten wiederherstellen", gh: "Quellcode auf GitHub ansehen", theme: "Design", th_system: "System", th_light: "Hell", th_dark: "Dunkel",
      roll: "{m} hat begonnen. Basis und laufende Traffic-Instanzen behalten und Verbrauch zurücksetzen?", rollBtn: "Neuen Monat starten",
      usedUnit: "GB genutzt", usedAria: "Verbrauch in diesem Monat",
      recorded: "Erfasst {t} · {v}/Tag", toBill: "Rechnungen öffnen",
      allow: "Kontingent", remain: "Übrig", exceeded: "Überschritten um", forecast: "Prognose Monatsende", forecastTip: "Leer = Hochrechnung aus dem Tagesschnitt; oder erwartete Monatssumme (GB) eintragen", fcErr: "Darf nicht unter dem Verbrauch liegen ({v})", endErr: "Löschen muss nach dem Erstellen liegen", localTime: "Ortszeit", utcNote: "AWS rechnet nach UTC-Kalendermonat ab; dieser Monat begann am {t} (Ortszeit)",
      cost: "Geschätzte Kosten", inclOver: "inkl. {v} Überschreitung",
      bandGood: "Sicher · im Kontingent", bandWarn: "Erwartete Überschreitung: {v}", bandBad: "Überschritten · ca. {v} extra", bandIdle: "Verbrauch eingeben", lgUsed: "Genutzt {v}", lgEnd: "Monatsende {v}", lgOver: "Überschreitung {v}",
      fill: "Zuerst den Verbrauch dieses Monats eingeben", fillHint: "In {a}AWS Bills → Lightsail{/a} die Posten {in} und {out} addieren.",
      enough: "Kontingent reicht, nichts hinzufügen", leftEnd: "{v} übrig am Monatsende",
      suggest: "{n} Traffic-Instanz(en) hinzufügen", apply: "Hinzufügen", from: "{spec}, ab {t}", saveV: "spart {v} gegenüber keiner",
      exPred: "Kontingent voraussichtlich am {t} aufgebraucht", exPast: "Kontingent seit {t} aufgebraucht", noAdd: "Keine hinzuzufügen ist günstiger", planMode: "Planung für den ganzen Monat", planNote: "Je Traffic-Instanz: +{a} · {c}/Monat", optimal: "Bereits die günstigste Konfiguration; die restliche Überschreitung ist unvermeidbar",
      optNone: "Keine", optN: "+{n}", barTip: "Instanzen {a} · Überschreitung {o}", locked: "Die bereits überschrittenen {v} lassen sich nicht ausgleichen und sind enthalten.",
      next: "Nächster Monat", nextLine: "Beim aktuellen Tempo ({v}) {cfg}, ca. {c}/Monat", cfgBase: "nur die Basis", cfgPlus: "Basis + {n} Traffic",
      fleet: "Instanzübersicht", fleetSum: "{n} · {c}", base: "Basisinstanz", baseHint: "Das Fundament des Pools. Jede neue Traffic-Instanz muss dieselbe Größe haben.",
      best: "Günstigste", v4: "Öffentliche IPv4 nötig", dual: "Dual-Stack", start: "Erstellt",
     
      nodes: "Traffic-Instanzen", share: "Gleiche Region, gleiche Größe: gemeinsamer Pool. Nur IPv6.", nodeAdd: "Jetzt 1 hinzufügen: +{a} · {c} (anteilig bis Monatsende)", add: "Traffic-Instanz hinzufügen",
      nStart: "Erstellt", nEnd: "Gelöscht (leer, wenn aktiv)", planned: "Geplant", gone: "Gelöscht", dec: "Weniger", inc: "Mehr", count: "Anzahl", del: "Entfernen",
      seoDesc: "Kostenloser Rechner für den Datentransfer von AWS Lightsail. Gleich große Instanzen in derselben Region teilen sich ein Kontingent: Verbrauch verfolgen, Überziehung zum Monatsende vorhersagen und die günstigste Zahl zusätzlicher IPv6-Instanzen finden.", seoKw: "AWS Lightsail, Lightsail Datentransfer, Lightsail Überziehung, Rechner, Lightsail Preise, IPv6-Instanz, VPS",
      agent: "Mit KI nutzen", secCalc: "Berechnung", secData: "Daten",
      ag: {"title":"Mit einem KI-Agenten nutzen","sub":"Ihr Agent liest eine kurze Anleitung, rechnet für Sie und gibt einen Link zurück, den Sie hier prüfen können.","close":"Schließen","tabs":["Schnellstart","Anwendungsfälle","Entwickler"],"s1":"Diesen Prompt kopieren","prompt":"Lies zuerst {url} und berechne mit den dortigen Lightsail-Abrechnungsregeln meinen Datentransfer-Pool.\nMein Setup: Region ___, Paket ___ (z. B. $7 / 2 TB Transfer), diesen Monat ___ GB verbraucht (Stand ___).\nSag mir, ob ich diesen Monat überziehe und wie viele Traffic-Instanzen ich am günstigsten hinzufüge, und gib mir einen vorausgefüllten Rechner-Link zum Prüfen.","copyPrompt":"Prompt kopieren","s2":"In einen Agenten mit Webzugriff einfügen","s2n":"ChatGPT, Claude, Gemini, Cursor und ähnliche funktionieren. Füllen Sie die Lücken aus oder fügen Sie die Transferzeilen Ihrer Rechnung ein.","s3":"Den zurückgegebenen Link öffnen","s3n":"Der Link lädt das Setup hier, damit Sie die Zahlen prüfen können. Ihre bisherigen Daten werden vorher gesichert und lassen sich wiederherstellen.","privacy":"Diese Seite lädt nichts hoch. Konfigurationslinks enthalten Ihre Verbrauchszahlen – prüfen Sie sie vor dem Teilen.","casesIntro":"Frage kopieren, Zahlen anpassen und an den Agenten senden. Jede Frage enthält bereits die Adresse der Anleitung.","does":"Der Agent: ","copyQ":"Frage kopieren","ref":" (Regeln und Methode: {url})","perm":{"none":"Kein Zugriff nötig","ro":"AWS nur lesen","rw":"AWS schreiben · kostet Geld"},"cases":[["Überziehe ich?","Zur Monatsmitte prüfen, ob der Pool reicht.","Ich nutze das Lightsail-Paket für $12 / 3 TB in Tokio und habe diesen Monat 2800 GB verbraucht. Überziehe ich? Wie viele Traffic-Instanzen sollte ich hinzufügen?","hochrechnet das Monatsende aus dem Tagesschnitt und findet die günstigste Lösung."],["Setup wählen","Ein neues Projekt vor dem Deployment planen.","Meine App überträgt etwa 8 TB im Monat, vor allem nach Südostasien. Welche Lightsail-Region und welches Paket sind am günstigsten?","vergleicht Regionspreise, Regionen mit halbem Kontingent und Kombinationen aus Paket und Traffic-Instanzen."],["Nächsten Monat planen","Die Flotte zu Monatsbeginn dimensionieren.","Nächsten Monat erwarte ich etwa 12.000 GB in Frankfurt mit dem Paket für $7 / 2 TB. Wie viele Traffic-Instanzen sind am günstigsten?","rechnet einen ganzen Monat durch und liefert Anzahl und Monatskosten."],["Rechnung verstehen","Die Transferzeilen der Rechnung sind schwer zu lesen.","Hier die Lightsail-Transferzeilen meiner AWS-Rechnung: (einfügen). Wie viel Kontingent bleibt, und wird mir etwas berechnet?","summiert die Posten DataXfer-In/Out und gibt Ihnen einen Prüf-Link."],["Verbrauchswarnung","Eine tägliche Prüfung, die vor dem Überziehen warnt.","Lies jeden Morgen die Netzwerkmetriken meiner Lightsail-Instanzen und warne mich, wenn dieser Monat auf eine Überziehung zuläuft.","liest NetworkIn/Out per AWS CLI oder SDK, rechnet und benachrichtigt Sie."],["Auto-Skalierung","Traffic-Instanzen automatisch hinzufügen, wenn eine Überziehung droht.","Wenn eine Überziehung erwartet wird, erstelle in derselben Region die empfohlene Anzahl reiner IPv6-Instanzen meines Pakets. Frag mich vor jeder Erstellung um Bestätigung.","ruft anhand der Empfehlung die Lightsail-API auf und erstellt Instanzen."]],"scaleWarn":"Erstellt echte, kostenpflichtige Instanzen: nur nötige Rechte vergeben, Bestätigung verlangen, Anzahl begrenzen.","devIntro":"Alles ist statisch und von jedem Origin lesbar. Es gibt keine Server-API und keinen Schlüssel.","files":["Anleitung für Agenten: Regeln, Link-Parameter, Ergebnisfelder","Preise und Kontingente aller Regionen","Das Rechenmodul (ES-Modul), derselbe Code wie diese Seite"],"copyUrl":"URL kopieren","codeH":"Aus Code aufrufen","copy":"Kopieren","paramsH":"Parameter für vorausgefüllte Links","params":["AWS-Regionscode, z. B. us-east-1","Paket, angegeben über RAM in GB; $7 / 2 TB ist 1","Diesen Monat verbrauchte GB (ein + aus)","Erwartete Gesamtmenge zum Monatsende in GB; allein plant es den ganzen Monat","Traffic-Instanzen als Anzahl@Start[~Ende], UTC"],"more":"Alle Parameter und Ergebnisfelder stehen in llms.txt. Node.js kann nicht von einer URL importieren: calc.js herunterladen oder aus dem Repository kopieren."},
      cT: "Alle Daten löschen?", cB: "Instanzen, Verbrauch und Einstellungen werden zurückgesetzt. Das lässt sich nicht rückgängig machen. Bei Bedarf vorher ein Backup exportieren.", cancel: "Abbrechen", clear: "Löschen",
      rules: "Abrechnungsregeln",
      r: ["Eingehend + ausgehend <b>zählen beide</b> zum Kontingent",
        "Überschreitung wird <b>nur ausgehend berechnet</b>; eingehend ist kostenlos",
        "Nur Instanzen gleicher Region und <b>gleicher Größe</b> werden zusammengelegt; Dual-Stack und IPv6 gleicher Größe auch",
        "Stundenabrechnung; <b>gestoppte Instanzen kosten weiter</b>, erst Löschen beendet es",
        "Bereits angefallene Überschreitung ist <b>nicht ausgleichbar</b>; rechtzeitig erweitern",
        "Löschen und neu erstellen <b>setzt den Verbrauch nicht zurück</b>",
        "Traffic über <b>private IPs</b> in der Region zählt zum Kontingent, kostet aber nie extra",
        "Schätzung mit 1 TB = 1024 GB und UTC-Monaten; maßgeblich ist die AWS-Rechnung"],
      links: ["Preise", "FAQ Datenübertragung", "FAQ Abrechnung", "Servicebedingungen", "Verbrauch auf der Rechnung"],
      foot: "Daten bleiben in diesem Browser · Preise geprüft {d} · Kein offizielles AWS-Tool", allowLbl: "Kontingent {v}"
    },
    pt: {
      name: "Calculadora de economia AWS Lightsail", tagline: "Usa a regra de que instâncias da mesma região e tamanho compartilham a transferência para achar o plano mais barato para tráfego variável.",
      region: "Região: a cota só é somada dentro de uma região", lang: "Idioma", over: "excedente", half: "metade da cota",
      settings: "Configurações avançadas", outRatio: "Parcela de saída", outRatioHint: "Só o tráfego de saída é cobrado como excedente. Mantenha 100% se não souber.", prorate: "Proporcionalizar a cota de instâncias criadas no meio do mês",
      exp: "Exportar backup", imp: "Importar backup", sample: "Carregar exemplo", reset: "Redefinir tudo", resetHold: "Segure 1 s para redefinir", copyLink: "Copiar link da configuração", copied: "Copiado", linkLoaded: "Configuração do link carregada. Seus dados anteriores foram salvos.", undo: "Restaurar meus dados", gh: "Ver o código no GitHub", theme: "Tema", th_system: "Sistema", th_light: "Claro", th_dark: "Escuro",
      roll: "{m} começou. Manter a base e as instâncias de tráfego ativas e zerar o uso?", rollBtn: "Iniciar novo mês",
      usedUnit: "GB usados", usedAria: "Dados usados neste mês",
      recorded: "Registrado {t} · {v}/dia", toBill: "Abrir faturas",
      allow: "Cota", remain: "Restante", exceeded: "Excedido", forecast: "Previsão fim do mês", forecastTip: "Vazio = projeção pela média diária; ou informe o total mensal esperado (GB)", fcErr: "Não pode ser menor que o usado ({v})", endErr: "A exclusão deve ser depois da criação", localTime: "hora local", utcNote: "A AWS cobra por mês civil UTC; este mês começou em {t} (hora local)",
      cost: "Custo estimado", inclOver: "inclui {v} de excedente",
      bandGood: "Seguro · dentro da cota", bandWarn: "Excedente previsto: {v}", bandBad: "Cota excedida · cerca de {v} a mais", bandIdle: "Informe o uso", lgUsed: "Usado {v}", lgEnd: "Fim do mês {v}", lgOver: "Excedente {v}",
      fill: "Primeiro informe o uso deste mês", fillHint: "Em {a}AWS Bills → Lightsail{/a}, some os itens {in} e {out}.",
      enough: "A cota basta, nada a adicionar", leftEnd: "Sobram {v} no fim do mês",
      suggest: "Adicione {n} instância(s) de tráfego", apply: "Adicionar", from: "{spec}, a partir de {t}", saveV: "economiza {v} em relação a não adicionar",
      exPred: "a cota acaba em {t}", exPast: "a cota acabou em {t}", noAdd: "Não adicionar é mais barato", planMode: "Plano do mês inteiro", planNote: "Cada instância de tráfego: +{a} · {c}/mês", optimal: "Já é a configuração mais barata; o excedente restante é inevitável",
      optNone: "Nenhuma", optN: "+{n}", barTip: "Instâncias {a} · Excedente {o}", locked: "Os {v} já excedidos não podem ser compensados e estão incluídos.",
      next: "Próximo mês", nextLine: "No ritmo deste mês ({v}), use {cfg}, cerca de {c}/mês", cfgBase: "só a base", cfgPlus: "base + {n} de tráfego",
      fleet: "Visão das instâncias", fleetSum: "{n} · {c}", base: "Instância base", baseHint: "A fundação do pool. Toda instância de tráfego adicionada precisa ter o mesmo tamanho.",
      best: "Melhor", v4: "Precisa de IPv4 público", dual: "Pilha dupla", start: "Criada em",
     
      nodes: "Instâncias de tráfego", share: "Mesma região e tamanho compartilham o pool. Só IPv6.", nodeAdd: "Adicionar 1 agora: +{a} · {c} (proporcional até o fim do mês)", add: "Adicionar instância de tráfego",
      nStart: "Criada", nEnd: "Excluída (vazio se ativa)", planned: "Planejada", gone: "Excluída", dec: "Diminuir", inc: "Aumentar", count: "Quantidade", del: "Remover",
      seoDesc: "Calculadora gratuita de transferência de dados do AWS Lightsail. Instâncias do mesmo tamanho na mesma região compartilham a franquia: acompanhe o uso, preveja o excedente no fim do mês e descubra quantas instâncias IPv6 adicionar pelo menor custo.", seoKw: "AWS Lightsail, transferência de dados Lightsail, excedente Lightsail, calculadora, preços Lightsail, instância IPv6, VPS",
      agent: "Usar com IA", secCalc: "Cálculo", secData: "Dados",
      ag: {"title":"Use com um agente de IA","sub":"Seu agente lê um guia curto, faz as contas por você e devolve um link para conferir aqui.","close":"Fechar","tabs":["Início rápido","Casos de uso","Desenvolvedores"],"s1":"Copie este prompt","prompt":"Leia primeiro {url} e use as regras de cobrança do Lightsail descritas lá para calcular meu pool de transferência de dados.\nMinha configuração: região ___, plano ___ (ex. $7 / 2 TB de transferência), ___ GB usados este mês (até ___).\nDiga se vou ultrapassar este mês e quantas instâncias de tráfego adicionar pelo menor custo, e me dê um link da calculadora já preenchido para conferir.","copyPrompt":"Copiar prompt","s2":"Cole em um agente com acesso à web","s2n":"ChatGPT, Claude, Gemini, Cursor e similares funcionam. Preencha as lacunas ou cole as linhas de transferência da sua fatura.","s3":"Abra o link que ele devolver","s3n":"O link carrega a configuração aqui para você conferir os números. Seus dados atuais são salvos antes e podem ser restaurados.","privacy":"Esta página não envia nada. Links de configuração contêm seus números de uso: confira antes de compartilhar.","casesIntro":"Copie uma pergunta, troque os números e envie ao seu agente. Todas já incluem o endereço do guia.","does":"O agente: ","copyQ":"Copiar pergunta","ref":" (Regras e método: {url})","perm":{"none":"Sem permissões","ro":"AWS somente leitura","rw":"AWS escrita · gera custos"},"cases":[["Vou ultrapassar?","No meio do mês, saber se o pool vai durar.","Uso o plano Lightsail de $12 / 3 TB em Tóquio e já gastei 2800 GB este mês. Vou ultrapassar? Quantas instâncias de tráfego devo adicionar?","projeta o fim do mês pelo ritmo diário e encontra a solução mais barata."],["Escolher a configuração","Planejar um projeto novo antes de implantar.","Meu app vai transferir cerca de 8 TB por mês, principalmente para o Sudeste Asiático. Qual região e plano do Lightsail saem mais baratos?","compara preços por região, regiões com metade da franquia e combinações de plano e instâncias de tráfego."],["Planejar o mês","Dimensionar a frota no início do mês.","No próximo mês espero cerca de 12.000 GB em Frankfurt no plano de $7 / 2 TB. Quantas instâncias de tráfego deixam o custo mais baixo?","faz um plano do mês inteiro e devolve a quantidade e o custo mensal."],["Entender a fatura","As linhas de transferência da fatura são difíceis de ler.","Estas são as linhas de transferência do Lightsail da minha fatura da AWS: (colar). Quanto de franquia sobra e serei cobrado?","soma os itens DataXfer-In/Out e dá um link para conferir."],["Alertas de uso","Uma verificação diária que avisa antes do excedente.","Toda manhã, leia as métricas de rede das minhas instâncias Lightsail e me avise se este mês estiver a caminho de ultrapassar.","lê NetworkIn/Out com a AWS CLI ou SDK, faz o cálculo e avisa você."],["Escalar automaticamente","Adicionar instâncias de tráfego sozinho quando o excedente se aproxima.","Se houver excedente previsto, crie na mesma região a quantidade recomendada de instâncias só IPv6 do meu plano. Peça minha confirmação antes de criar qualquer coisa.","usa a recomendação para chamar a API do Lightsail e criar instâncias."]],"scaleWarn":"Escalar automaticamente cria instâncias reais e cobradas. Dê ao agente só as permissões necessárias, exija confirmação e limite o número de instâncias.","devIntro":"Tudo é estático e pode ser lido de qualquer origem. Não há API de servidor nem chave.","files":["Guia para agentes: regras, parâmetros do link, campos do resultado","Preços e franquias de todas as regiões","O módulo de cálculo (ES module), o mesmo código desta página"],"copyUrl":"Copiar URL","codeH":"Chamar pelo código","copy":"Copiar","paramsH":"Parâmetros do link pré-preenchido","params":["Código da região AWS, ex. us-east-1","Plano, identificado pela RAM em GB; $7 / 2 TB é 1","GB usados este mês (entrada + saída)","Total previsto no fim do mês em GB; sozinho, planeja o mês inteiro","Instâncias de tráfego: quantidade@início[~fim], UTC"],"more":"Todos os parâmetros e campos do resultado estão no llms.txt. O Node.js não importa de uma URL: baixe o calc.js ou copie do repositório."},
      cT: "Apagar todos os dados?", cB: "Instâncias, uso e configurações voltam ao padrão. Não dá para desfazer. Exporte um backup antes, se precisar.", cancel: "Cancelar", clear: "Apagar",
      rules: "Regras de cobrança",
      r: ["Entrada + saída <b>consomem a cota</b>",
        "O excedente é <b>cobrado só na saída</b>; a entrada é grátis",
        "Só somam instâncias da mesma região e <b>mesmo tamanho</b>; pilha dupla e IPv6 do mesmo tamanho somam juntas",
        "Cobrança por hora; <b>parada também é cobrada</b>, só excluir encerra",
        "Excedente já gerado <b>não é compensado</b> por novas instâncias; amplie antes de acabar",
        "Excluir e recriar <b>não zera</b> o uso do mês",
        "Tráfego por <b>IP privado</b> na região consome cota, mas nunca é cobrado",
        "Estimativa com 1 TB = 1024 GB e meses UTC; vale a fatura da AWS"],
      links: ["Preços", "FAQ de transferência", "FAQ de cobrança", "Termos de serviço", "Ver uso na fatura"],
      foot: "Os dados ficam neste navegador · Preços conferidos em {d} · Não é uma ferramenta oficial da AWS", allowLbl: "Cota {v}"
    },
    ru: {
      name: "Калькулятор экономии AWS Lightsail", tagline: "Использует правило общего пула трафика для инстансов одного региона и размера, чтобы найти самый дешёвый план при переменном трафике.",
      region: "Регион: лимиты суммируются только внутри региона", lang: "Язык", over: "превышение", half: "половина лимита",
      settings: "Дополнительно", outRatio: "Доля исходящего", outRatioHint: "Превышение оплачивается только за исходящий трафик. Если не уверены, оставьте 100%.", prorate: "Пропорциональный лимит для созданных в середине месяца",
      exp: "Экспорт копии", imp: "Импорт копии", sample: "Загрузить пример", reset: "Сбросить все данные", resetHold: "Удерживайте 1 с для сброса", copyLink: "Копировать ссылку на настройки", copied: "Скопировано", linkLoaded: "Настройки из ссылки загружены. Прежние данные сохранены.", undo: "Вернуть мои данные", gh: "Исходный код на GitHub", theme: "Тема", th_system: "Системная", th_light: "Светлая", th_dark: "Тёмная",
      roll: "Начался {m}. Оставить базовый и работающие трафик-инстансы и обнулить расход?", rollBtn: "Начать новый месяц",
      usedUnit: "ГБ израсходовано", usedAria: "Расход за месяц",
      recorded: "Записано {t} · {v}/день", toBill: "Открыть счета",
      allow: "Лимит", remain: "Осталось", exceeded: "Превышено на", forecast: "Прогноз на конец месяца", forecastTip: "Пусто = прогноз по среднему за день; или введите ожидаемый итог за месяц (ГБ)", fcErr: "Не может быть меньше расхода ({v})", endErr: "Удаление должно быть позже создания", localTime: "местное время", utcNote: "AWS считает по календарному месяцу UTC; этот месяц начался {t} по местному времени",
      cost: "Оценка стоимости", inclOver: "вкл. {v} превышения",
      bandGood: "Безопасно · в пределах лимита", bandWarn: "Ожидается превышение: {v}", bandBad: "Лимит превышен · около {v} сверху", bandIdle: "Введите расход", lgUsed: "Израсходовано {v}", lgEnd: "К концу месяца {v}", lgOver: "Превышение {v}",
      fill: "Сначала введите расход за этот месяц", fillHint: "В {a}AWS Bills → Lightsail{/a} сложите статьи {in} и {out}.",
      enough: "Лимита хватает, добавлять не нужно", leftEnd: "к концу месяца останется {v}",
      suggest: "Добавьте трафик-инстансов: {n}", apply: "Добавить", from: "{spec}, с {t}", saveV: "экономия {v} по сравнению с отказом",
      exPred: "лимит закончится {t}", exPast: "лимит закончился {t}", noAdd: "Выгоднее ничего не добавлять", planMode: "План на весь месяц", planNote: "Каждый трафик-инстанс: +{a} · {c}/мес.", optimal: "Это уже самая дешёвая конфигурация; оставшееся превышение неизбежно",
      optNone: "Нет", optN: "+{n}", barTip: "Инстансы {a} · Превышение {o}", locked: "Уже превышенные {v} нельзя компенсировать новыми инстансами, они учтены.",
      next: "Следующий месяц", nextLine: "При текущем темпе ({v}) возьмите {cfg}, около {c}/мес.", cfgBase: "только базовый", cfgPlus: "базовый + {n} трафик",
      fleet: "Обзор инстансов", fleetSum: "{n} шт. · {c}", base: "Базовый инстанс", baseHint: "Основа пула. Новые трафик-инстансы должны быть того же размера.",
      best: "Выгодно", v4: "Нужен публичный IPv4", dual: "Двойной стек", start: "Создан",
     
      nodes: "Трафик-инстансы", share: "Инстансы одного региона и размера делят пул. Только IPv6.", nodeAdd: "Добавить 1 сейчас: +{a} · {c} (пропорционально до конца месяца)", add: "Добавить трафик-инстанс",
      nStart: "Создан", nEnd: "Удалён (пусто, если работает)", planned: "План", gone: "Удалён", dec: "Меньше", inc: "Больше", count: "Количество", del: "Убрать",
      seoDesc: "Бесплатный калькулятор трафика AWS Lightsail. Инстансы одного размера в одном регионе делят общий лимит: следите за расходом, прогнозируйте превышение к концу месяца и узнайте, сколько IPv6-инстансов добавить дешевле всего.", seoKw: "AWS Lightsail, трафик Lightsail, превышение Lightsail, калькулятор трафика, цены Lightsail, IPv6-инстанс, VPS",
      agent: "ИИ-агент", secCalc: "Расчёт", secData: "Данные",
      ag: {"title":"Использовать с ИИ-агентом","sub":"Агент читает короткую инструкцию, считает за вас и возвращает ссылку, которую можно проверить здесь.","close":"Закрыть","tabs":["Быстрый старт","Сценарии","Разработчикам"],"s1":"Скопируйте этот промпт","prompt":"Сначала прочитай {url} и по описанным там правилам тарификации Lightsail рассчитай мой пул трафика.\nМоя конфигурация: регион ___, тариф ___ (напр. $7 / 2 ТБ трафика), в этом месяце израсходовано ___ ГБ (на ___).\nСкажи, превышу ли я лимит в этом месяце и сколько трафик-инстансов добавить, чтобы заплатить меньше всего, и дай заполненную ссылку на калькулятор для проверки.","copyPrompt":"Копировать промпт","s2":"Вставьте его в агента с доступом к вебу","s2n":"Подойдут ChatGPT, Claude, Gemini, Cursor и подобные. Заполните пропуски или вставьте строки трафика из счёта.","s3":"Откройте ссылку, которую он вернёт","s3n":"Ссылка загрузит конфигурацию сюда, чтобы вы проверили цифры. Ваши текущие данные сначала сохраняются, их можно восстановить.","privacy":"Эта страница ничего не отправляет. Ссылки на конфигурацию содержат цифры расхода — проверьте их, прежде чем делиться.","casesIntro":"Скопируйте вопрос, подставьте свои цифры и отправьте агенту. В каждом уже есть адрес инструкции.","does":"Агент: ","copyQ":"Копировать вопрос","ref":" (Правила и методика: {url})","perm":{"none":"Доступ не нужен","ro":"AWS только чтение","rw":"AWS запись · платно"},"cases":[["Превышу ли?","В середине месяца понять, хватит ли пула.","У меня тариф Lightsail $12 / 3 ТБ в Токио, в этом месяце израсходовано 2800 ГБ. Превышу ли я лимит? Сколько трафик-инстансов добавить?","прогнозирует конец месяца по дневному темпу и находит самое дешёвое решение."],["Выбор конфигурации","Спланировать новый проект до развёртывания.","Моё приложение будет отдавать около 8 ТБ в месяц, в основном в Юго-Восточную Азию. Какой регион и тариф Lightsail выйдут дешевле всего?","сравнивает цены регионов, регионы с половинным лимитом и сочетания тарифа с трафик-инстансами."],["План на месяц","Определить число инстансов в начале месяца.","В следующем месяце ожидаю около 12 000 ГБ во Франкфурте на тарифе $7 / 2 ТБ. Сколько трафик-инстансов дадут минимальную стоимость?","строит план на весь месяц и возвращает количество и месячную стоимость."],["Разбор счёта","Строки трафика в счёте трудно понять.","Вот строки трафика Lightsail из моего счёта AWS: (вставить). Сколько лимита осталось и будут ли списания?","суммирует статьи DataXfer-In/Out и даёт ссылку для проверки."],["Оповещения","Ежедневная проверка с предупреждением до превышения.","Каждое утро читай сетевые метрики моих инстансов Lightsail и предупреди меня, если в этом месяце намечается превышение.","читает NetworkIn/Out через AWS CLI или SDK, считает и уведомляет вас."],["Автомасштаб","Автоматически добавлять трафик-инстансы перед превышением.","Если ожидается превышение, создай в том же регионе рекомендованное число инстансов моего тарифа только с IPv6. Перед созданием обязательно спроси подтверждение.","по рекомендации вызывает API Lightsail и создаёт инстансы."]],"scaleWarn":"Создаёт настоящие платные инстансы: давайте только нужные права, требуйте подтверждения и ограничьте их число.","devIntro":"Всё статично и доступно с любого источника. Нет серверного API и ключей.","files":["Инструкция для агентов: правила, параметры ссылки, поля результата","Цены и лимиты всех регионов","Модуль расчёта (ES-модуль), тот же код, что на этой странице"],"copyUrl":"Копировать URL","codeH":"Вызов из кода","copy":"Копировать","paramsH":"Параметры заполненной ссылки","params":["Код региона AWS, напр. us-east-1","Тариф, задаётся объёмом RAM в ГБ; $7 / 2 ТБ — это 1","Израсходовано в этом месяце, ГБ (вход + выход)","Ожидаемый итог на конец месяца, ГБ; отдельно — план на весь месяц","Трафик-инстансы: количество@начало[~конец], UTC"],"more":"Все параметры и поля результата — в llms.txt. Node.js не импортирует по URL: скачайте calc.js или скопируйте его из репозитория."},
      cT: "Удалить все данные?", cB: "Инстансы, расход и настройки вернутся к исходным. Отменить нельзя. При необходимости сначала экспортируйте копию.", cancel: "Отмена", clear: "Удалить",
      rules: "Правила тарификации",
      r: ["Входящий + исходящий <b>расходуют лимит</b>",
        "Превышение <b>оплачивается только за исходящий</b>; входящий бесплатен",
        "Суммируются только инстансы одного региона и <b>одного размера</b>; двойной стек и IPv6 одного размера тоже",
        "Почасовая оплата; <b>остановленный тоже оплачивается</b>, только удаление прекращает",
        "Уже возникшее превышение <b>не компенсируется</b> новыми инстансами; добавляйте заранее",
        "Удаление и пересоздание <b>не сбрасывает</b> расход месяца",
        "Трафик по <b>частным IP</b> в регионе расходует лимит, но никогда не оплачивается",
        "Оценка при 1 ТБ = 1024 ГБ и месяцах по UTC; окончательно — счёт AWS"],
      links: ["Цены", "FAQ по трафику", "FAQ по оплате", "Условия сервиса", "Расход в счёте"],
      foot: "Данные хранятся только в этом браузере · Цены проверены {d} · Не официальный инструмент AWS", allowLbl: "Лимит {v}"
    }
  };
  /* I18N:END */
  const KEY = "lightsail-pool:v2", OLD_KEY = "lightsail-pool:v1", LANG_KEY = "lightsail-pool:lang", THEME_KEY = "lightsail-pool:theme";
  const HOUR = 36e5, DAY = 864e5, IN = "TotalDataXfer-In-Bytes", OUT = "TotalDataXfer-Out-Bytes";

  /* CALC:BEGIN — shared calculation core. scripts/build.mjs copies this block verbatim into public/calc.js,
     so it must stay self-contained (no DOM, no page state, no globals). */
  const CALC_VERSION = 1;
  // Lightsail counts allowance in binary units: the API's transferPerMonthInGb is 1024 for a 1 TB plan
  const GB_PER_TB = 1024, HOUR_MS = 36e5;
  const monthKey = d => d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0");
  const monthRange = k => { const [y, m] = k.split("-").map(Number); return [Date.UTC(y, m - 1, 1), Date.UTC(y, m, 1)]; };

  // Accepts the compact page format ({ q: [[ram, dual, ipv6, tb]] }) or the published prices.json format.
  function normalizePrices(prices) {
    const regions = {};
    for (const [id, r] of Object.entries(prices.regions || {})) {
      const rows = r.q ? r.q.map(([ram, p4, p6, tb]) => ({ ram, p4, p6, tb }))
        : (r.bundles || []).map(b => ({ ram: b.ramGB, p4: b.dualStackMonthly, p6: b.ipv6OnlyMonthly, tb: b.transferTB }));
      regions[id] = { over: r.over ?? r.overagePerGB, bundles: rows };
    }
    return { date: prices.date, regions };
  }
  function regionInfo(prices, id) {
    const norm = normalizePrices(prices), ids = Object.keys(norm.regions);
    const rid = norm.regions[id] ? id : ids[0], r = norm.regions[rid], one = r.bundles.find(b => b.ram === 1);
    return { id: rid, price: r.over, half: !!one && one.tb < 2, bundles: r.bundles };
  }

  // state: { month "YYYY-MM", region, size (RAM GB), ipv4, baseStart ms, used GB|null, usedAt ms, forecast GB|null,
  //          outRatio 0-100, prorate, nodes: [{ count, start ms|null, end ms|null }] }
  function computeCore(state, prices, nowReal) {
    const clamp = (v, a, z) => Math.min(z, Math.max(a, v));
    const R = regionInfo(prices, state.region);
    const b = R.bundles.find(x => x.ram === state.size) || R.bundles.find(x => x.ram === 1) || R.bundles[0];
    const full = b.tb * GB_PER_TB, [m0, m1] = monthRange(state.month), M = m1 - m0;
    const now = clamp(nowReal, m0, m1), nodesIn = state.nodes || [];
    const span = (s, e) => { s = Math.max(s == null ? m0 : s, m0); e = Math.min(e == null ? m1 : e, m1); return e > s ? (e - s) / M : 0; };
    const allowOf = (n, f) => n * full * (state.prorate ? f : (f > 0 ? 1 : 0));
    // Plan mode: only a month-end total is given, no usage yet. Treat the month as a whole and assume every
    // running instance is configured for all of it, so the answer is "how many for the full month".
    const hasU = state.used != null, auto = state.forecast == null, has = hasU || !auto, plan = !hasU && !auto;
    const life = (s, e) => plan && e == null ? 1 : span(s, e);
    const bf = life(state.baseStart, null);
    const base = { allow: allowOf(1, bf), cost: (state.ipv4 ? b.p4 : b.p6) * bf };
    // allowFuture: instances that start later can only cover traffic from then on, never overage already incurred
    const basePlanned = !plan && state.baseStart != null && state.baseStart > now;
    let allow = base.allow, allowFuture = basePlanned ? base.allow : 0, cost = base.cost, live = 1;
    const nodes = nodesIn.map(n => {
      const f = life(n.start, n.end), r = {
        allow: allowOf(n.count, f), cost: n.count * b.p6 * f,
        planned: !plan && n.start != null && n.start > nowReal, gone: n.end != null && n.end <= nowReal
      };
      allow += r.allow; cost += r.cost; if (!r.gone) live += n.count;
      if (!plan && n.start != null && n.start > now) allowFuture += r.allow;
      return r;
    });
    const allowPast = allow - allowFuture;
    // Traffic can only flow once the first instance exists, so the daily pace is measured from there, not from the 1st
    const starts = [state.baseStart, ...nodesIn.map(n => n.start)].map(v => v == null ? m0 : v);
    const p0 = plan ? m0 : clamp(Math.min(...starts), m0, m1 - HOUR_MS);
    const tU = clamp(hasU ? (state.usedAt || now) : now, p0 + HOUR_MS, m1);
    const U = hasU ? +state.used : 0;
    const rate = U / (tU - p0);
    const P = auto ? U + rate * (m1 - tU) : Math.max(+state.forecast, U);
    const fr = plan ? 0 : m1 > tU ? (P - U) / (m1 - tU) : 0;
    const Unow = U + fr * Math.max(0, now - tU);
    const ratio = state.outRatio / 100;
    // overage already incurred is fixed; the rest of the month is covered by leftover current allowance plus later instances
    const lockedGB = plan ? 0 : Math.max(0, Unow - allowPast);
    const F = Math.max(0, P - Unow), Rem = Math.max(0, allowPast - Unow) + allowFuture;
    const overGB = (lockedGB + Math.max(0, F - Rem)) * ratio, overCost = overGB * R.price;
    let exhaust = !has || plan ? null : lockedGB > 0 ? (rate > 0 ? p0 + allowPast / rate : null)
      : allow <= U ? (rate > 0 ? p0 + allow / rate : null) : (fr > 0 ? tU + (allow - U) / fr : null);
    if (exhaust != null && exhaust >= m1) exhaust = null;
    // options: add N IPv6-only traffic instances from the next full hour (a whole month each in plan mode)
    const t0 = Math.ceil(now / HOUR_MS) * HOUR_MS, rf = plan ? 1 : Math.max(0, (m1 - t0) / M);
    const ai = full * (state.prorate ? rf : 1), ci = b.p6 * rf;
    const optFor = N => { const o = (lockedGB + Math.max(0, F - Rem - N * ai)) * ratio * R.price; return { N, add: N * ci, over: o, total: N * ci + o }; };
    const Nmin = ai > 0 && F > Rem ? Math.ceil((F - Rem) / ai) : 0;
    const ns = Nmin <= 3 ? [...Array(Nmin + 2).keys()] : [0, Nmin - 1, Nmin, Nmin + 1];
    const opts = has && rf > 0 && overGB > 0 ? ns.map(optFor) : [];
    const best = opts.reduce((a, o) => (!a || o.total < a.total - 1e-9 ? o : a), null);
    const status = !has ? "idle" : lockedGB > 0 ? "bad" : overGB > 0 ? "warn" : "good";
    const nextNodes = has ? Math.max(0, Math.ceil(P / full) - 1) : 0;
    const nextCost = (state.ipv4 ? b.p4 : b.p6) + nextNodes * b.p6;
    return { R, b, full, m0, m1, now, p0, base, allow, cost, live, has, hasU, plan, U, tU, rate, P, auto, Unow, overGB, overCost, lockedGB, exhaust,
      t0, ai, ci, opts, best, status, nextNodes, nextCost, nodes };
  }

  // Friendly input (what agents and links use) <-> internal state. Dates may be ms, ISO strings or Date objects.
  function toState(input = {}, now = Date.now()) {
    const ms = v => v == null || v === "" ? null : typeof v === "number" ? v : new Date(v).getTime();
    const num = v => v == null || v === "" || !isFinite(+v) ? null : +v;
    const month = /^\d{4}-(0[1-9]|1[0-2])$/.test(input.month || "") ? input.month : monthKey(new Date(now));
    const [m0] = monthRange(month);
    const inGB = num(input.inGB), outGB = num(input.outGB);
    const used = num(input.usedGB) ?? (inGB != null || outGB != null ? (inGB || 0) + (outGB || 0) : null);
    return {
      v: 2, month, region: input.region || "us-east-1", size: num(input.sizeGB) ?? 1, ipv4: input.ipv4 !== false,
      baseStart: ms(input.baseStart) ?? m0, used, usedAt: used == null ? null : ms(input.usedAt) ?? now,
      usedIn: inGB, usedOut: outGB, forecast: num(input.forecastGB),
      outRatio: num(input.outboundPercent) ?? 100, prorate: input.prorate !== false,
      nodes: (input.trafficInstances || []).map(n => ({ count: Math.max(1, Math.floor(num(n.count) || 1)), start: ms(n.start), end: ms(n.end) }))
    };
  }
  function fromState(s) {
    const iso = v => v == null ? undefined : new Date(v).toISOString();
    const out = { month: s.month, region: s.region, sizeGB: s.size, ipv4: s.ipv4, baseStart: iso(s.baseStart) };
    if (s.usedIn != null || s.usedOut != null) { out.inGB = s.usedIn ?? 0; out.outGB = s.usedOut ?? 0; }
    else if (s.used != null) out.usedGB = s.used;
    if (s.used != null) out.usedAt = iso(s.usedAt);
    if (s.forecast != null) out.forecastGB = s.forecast;
    if (s.outRatio !== 100) out.outboundPercent = s.outRatio;
    if (s.prorate === false) out.prorate = false;
    out.trafficInstances = (s.nodes || []).map(n => ({ count: n.count, start: iso(n.start), end: iso(n.end) }));
    return out;
  }

  // calculate(input, prices[, now]) -> plain JSON answer, the same numbers the page shows
  function calculate(input, prices, now = Date.now()) {
    const s = toState(input, now), c = computeCore(s, prices, now);
    const r2 = v => Math.round(v * 100) / 100, iso = v => v == null ? null : new Date(v).toISOString();
    const statusName = { idle: "needs-input", good: "safe", warn: "overage-expected", bad: "over-allowance" }[c.status];
    return {
      version: CALC_VERSION, pricesDate: normalizePrices(prices).date, month: s.month,
      mode: c.plan ? "full-month-plan" : c.hasU ? "actual-usage" : "needs-input", status: statusName,
      region: { id: c.R.id, overagePerGB: c.R.price, halfAllowance: c.R.half },
      base: { ramGB: c.b.ram, network: s.ipv4 ? "dual-stack" : "ipv6-only", monthlyPrice: s.ipv4 ? c.b.p4 : c.b.p6, transferTB: c.b.tb },
      allowanceGB: r2(c.allow), usedGB: c.hasU ? r2(c.Unow) : null, forecastGB: c.has ? r2(c.P) : null,
      overageGB: r2(c.overGB), overageCost: r2(c.overCost), instanceCost: r2(c.cost), totalCost: r2(c.cost + c.overCost),
      allowanceRunsOutAt: iso(c.exhaust), unavoidableOverageGB: r2(c.lockedGB),
      recommendation: c.best ? {
        addTrafficInstances: c.best.N, startingAt: c.plan ? null : iso(c.t0),
        eachAddsGB: r2(c.ai), eachCosts: r2(c.ci), resultingCost: r2(c.best.total), savesVsAddingNone: r2(c.opts[0].total - c.best.total)
      } : null,
      options: c.opts.map(o => ({ addTrafficInstances: o.N, instanceCost: r2(o.add), overageCost: r2(o.over), total: r2(o.total) })),
      nextMonth: c.has ? { trafficInstances: c.nextNodes, monthlyCost: r2(c.nextCost) } : null
    };
  }

  // Shareable links: ?region=&size=&ipv4=&base=&used=|in=&out=&at=&forecast=&outpct=&prorate=&nodes=count@start[~end],...
  const LINK_KEYS = ["region", "size", "ipv4", "base", "used", "in", "out", "at", "forecast", "outpct", "prorate", "nodes"];
  function buildLink(input, base = "https://ls.1ms.dog/") {
    const u = new URL(base), p = u.searchParams, set = (k, v) => { if (v != null && v !== "") p.set(k, String(v)); };
    set("region", input.region); set("size", input.sizeGB);
    if (input.ipv4 === false) p.set("ipv4", "0");
    set("base", input.baseStart && new Date(input.baseStart).toISOString().slice(0, 16) + "Z");
    set("used", input.usedGB); set("in", input.inGB); set("out", input.outGB);
    set("at", input.usedAt && new Date(input.usedAt).toISOString().slice(0, 16) + "Z");
    set("forecast", input.forecastGB); set("outpct", input.outboundPercent);
    if (input.prorate === false) p.set("prorate", "0");
    const t = v => v ? new Date(v).toISOString().slice(0, 16) + "Z" : "";
    if ((input.trafficInstances || []).length) p.set("nodes", input.trafficInstances.map(n => n.count + "@" + t(n.start) + (n.end ? "~" + t(n.end) : "")).join(","));
    // keep ":" "@" "," readable; URLSearchParams would percent-encode them
    const q = [...p].map(([k, v]) => k + "=" + encodeURIComponent(v).replace(/%3A/g, ":").replace(/%40/g, "@").replace(/%2C/g, ",")).join("&");
    return u.origin + u.pathname + (q ? "?" + q : "");
  }
  function parseLink(search) {
    const p = new URLSearchParams(search), g = k => p.get(k);
    if (!LINK_KEYS.some(k => p.has(k))) return null;
    const out = {};
    if (g("region")) out.region = g("region");
    if (g("size")) out.sizeGB = +g("size");
    if (g("ipv4") === "0") out.ipv4 = false;
    if (g("base")) out.baseStart = g("base");
    if (g("used")) out.usedGB = +g("used");
    if (g("in")) out.inGB = +g("in");
    if (g("out")) out.outGB = +g("out");
    if (g("at")) out.usedAt = g("at");
    if (g("forecast")) out.forecastGB = +g("forecast");
    if (g("outpct")) out.outboundPercent = +g("outpct");
    if (g("prorate") === "0") out.prorate = false;
    if (g("nodes")) out.trafficInstances = g("nodes").split(",").filter(Boolean).map(x => {
      const [count, rest = ""] = x.split("@"), [start, end] = rest.split("~");
      return { count: +count || 1, start: start || null, end: end || null };
    });
    return out;
  }
  /* CALC:END */

  // ---------- helpers ----------
  const $ = s => document.querySelector(s);
  const uid = () => Math.random().toString(36).slice(2, 9);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad = n => String(n).padStart(2, "0");
  const REGION_IDS = REGION_ORDER.filter(id => PRICES.regions[id]);
  const bundles = () => (PRICES.regions[S.region] || PRICES.regions[REGION_IDS[0]]).q.map(([ram, p4, p6, tb]) => ({ ram, p4, p6, tb }));
  const bundle = ram => { const all = bundles(); return all.find(b => b.ram === ram) || all.find(b => b.ram === 1) || all[0]; };
  const regionOf = id => { const r = PRICES.regions[id], one = r.q.find(x => x[0] === 1); return { id, price: r.over, half: !!one && one[3] < 2 }; };
  const region = () => regionOf(PRICES.regions[S.region] ? S.region : REGION_IDS[0]);
  const ramLabel = r => r < 1 ? "512M" : r + "G";
  const fullAllow = b => b.tb * GB_PER_TB;
  const fmtGB = g => { g = Math.max(0, g || 0); return g >= GB_PER_TB ? (g / GB_PER_TB).toFixed(g >= 10 * GB_PER_TB ? 1 : 2) + " TB" : Math.round(g) + " GB"; };
  const fmtUSD = x => "$" + (x >= 1000 ? Math.round(x).toLocaleString("en-US") : x.toFixed(2));
  const toInput = ms => { if (ms == null) return ""; const d = new Date(ms); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes()); };
  const fromInput = s => { if (!s) return null; const t = new Date(s).getTime(); return isNaN(t) ? null : t; };
  const nextHour = t => Math.ceil(t / HOUR) * HOUR;
  const perTB = (b, v4) => (v4 ? b.p4 : b.p6) / b.tb;

  // ---------- language ----------
  // the language is fixed per page: <html lang> is set by scripts/build.mjs for each pre-rendered page
  const LANG = I18N[document.documentElement.lang] ? document.documentElement.lang : "en";
  // the site root, also when the site lives below a path (e.g. GitHub Pages)
  const SITE_ROOT = location.pathname.replace(/[^/]*$/, "").replace(LANG === "en" ? /$/ : /[^/]+\/$/, "");
  const langHref = l => SITE_ROOT + (LANG_PATHS[l] ?? "");
  const t = (k, v) => { let s = (I18N[LANG][k] ?? I18N.en[k] ?? k); if (v) for (const p in v) s = s.split("{" + p + "}").join(v[p]); return s; };
  const fmtDate = ms => new Intl.DateTimeFormat(LANG, { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(ms);
  const regionName = id => (REGION_NAMES[LANG] || REGION_NAMES.en)[REGION_ORDER.indexOf(id)];

  function applyLang() {
    document.querySelectorAll("[data-i]").forEach(el => { el.textContent = t(el.dataset.i); });
    $("#footTxt").textContent = t("foot", { d: PRICES.date });
    $("#ghBtn").title = t("gh"); $("#ghBtn").setAttribute("aria-label", t("gh"));
    $("#agentBtn").title = t("agent"); $("#agentBtn").setAttribute("aria-label", t("agent"));
    renderAgent();
    fitHeader();
    $("#regionWrap").title = t("region"); $("#region").setAttribute("aria-label", t("region"));
    $("#langWrap").title = t("lang"); $("#lang").setAttribute("aria-label", t("lang"));
    $("#settingsBtn").title = t("settings"); $("#settingsBtn").setAttribute("aria-label", t("settings"));
    $("#used").setAttribute("aria-label", t("usedAria"));
    $("#forecast").title = t("forecastTip");
    $("#outRatio").setAttribute("aria-label", t("outRatio"));
    $("#ipv4").setAttribute("aria-label", t("v4"));
    $("#baseStart").setAttribute("aria-label", t("start"));
    $("#region").innerHTML = REGION_IDS.map(id => { const r = regionOf(id); return `<option value="${id}">${regionName(id)} · ${t("over")} $${r.price}/GB${r.half ? " · " + t("half") : ""}</option>`; }).join("");
    $("#region").value = S.region;
    $("#rules").innerHTML = I18N[LANG].r.map((txt, i) => `<div class="rule${RULE_WARN.includes(i) ? " w" : ""}"><span class="ic">${RULE_ICONS[i]}</span><span>${txt}</span></div>`).join("");
    $("#links").innerHTML = I18N[LANG].links.map((txt, i) => `<a href="${LINKS[i]}" target="_blank" rel="noopener">${txt}</a>`).join("");
  }
  $("#lang").innerHTML = LANGS.map(([c, n]) => `<option value="${c}">${n}</option>`).join("");

  // ---------- state ----------
  function defaults() {
    const mk = monthKey(new Date()), [m0] = monthRange(mk);
    return { v: 2, month: mk, region: "us-east-1", size: 1, ipv4: true, baseStart: m0,
      used: null, usedAt: null, usedIn: null, usedOut: null, forecast: null, outRatio: 100, prorate: true, nodes: [] };
  }
  const valid = s => s && s.v === 2 && Array.isArray(s.nodes);
  // Rebuild state field by field from untrusted input (imported files, old storage): known keys and sane values only
  function sanitize(s) {
    const d = defaults();
    const num = (v, min = 0, max = Infinity) => typeof v === "number" && isFinite(v) && v >= min && v <= max ? v : null;
    const time = v => num(v, Date.UTC(2020, 0, 1), Date.UTC(2100, 0, 1));
    if (typeof s.month === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(s.month)) d.month = s.month;
    if (PRICES.regions[s.region]) d.region = s.region;
    if (PRICES.regions[d.region].q.some(r => r[0] === s.size)) d.size = s.size;
    d.ipv4 = s.ipv4 !== false; d.prorate = s.prorate !== false;
    d.baseStart = time(s.baseStart) ?? d.baseStart;
    for (const k of ["used", "usedIn", "usedOut", "forecast"]) d[k] = num(s[k], 0, 1e7);
    d.usedAt = time(s.usedAt);
    d.outRatio = num(s.outRatio, 0, 100) ?? 100;
    d.nodes = s.nodes.slice(0, 200).map(n => n && typeof n === "object" ? {
      id: uid(), count: Math.min(999, Math.max(1, Math.floor(num(n.count, 1) || 1))), start: time(n.start), end: time(n.end)
    } : null).filter(Boolean);
    return d;
  }
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (valid(s)) return sanitize(s); } catch (e) {}
    try { // carry over the first version's region, base and usage
      const o = JSON.parse(localStorage.getItem(OLD_KEY));
      if (o && Array.isArray(o.instances)) {
        const d = defaults(), base = o.instances.find(i => i.base) || o.instances[0], u = base && o.usage && o.usage[String(base.ram)];
        if (o.region) d.region = o.region;
        if (base) { d.size = base.ram; d.ipv4 = base.net !== "v6"; }
        if (u && u.used != null) { d.used = u.used; d.usedAt = u.at; }
        if (o.month === d.month) d.nodes = o.instances.filter(i => i !== base && i.ram === d.size).map(i => ({ id: uid(), count: i.count, start: i.start, end: i.end }));
        return d;
      }
    } catch (e) {}
    return defaults();
  }
  let S = load();
  // A config link (?region=…&used=…, see llms.txt) replaces the saved setup in this browser.
  // The previous setup is kept so the banner can undo it, and the config params are dropped from the address bar.
  let linkLoaded = false, linkBackup = null;
  try {
    const linked = parseLink(location.search);
    if (linked) {
      linkBackup = localStorage.getItem(KEY);
      S = sanitize(toState(linked, Date.now())); linkLoaded = true; save();
      const u = new URL(location.href); LINK_KEYS.forEach(k => u.searchParams.delete(k)); history.replaceState(null, "", u);
    }
  } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  // ---------- model ----------
  // the numbers come from the shared core above, so the page, calc.js and any agent agree
  function compute() {
    const c = computeCore(S, PRICES, Date.now());
    S.nodes.forEach((n, i) => { const r = c.nodes[i]; n._allow = r.allow; n._cost = r.cost; n._planned = r.planned; n._gone = r.gone; });
    return c;
  }

  // ---------- render ----------
  function renderSizes() {
    const v4 = S.ipv4, all = bundles(), costs = all.map(b => perTB(b, v4)), min = Math.min(...costs);
    $("#sizes").innerHTML = all.map((b, i) => `<button type="button" class="size${b.ram === S.size ? " on" : ""}" data-size="${b.ram}" aria-pressed="${b.ram === S.size}" title="${ramLabel(b.ram)}B RAM">
      ${Math.abs(costs[i] - min) < 1e-9 ? `<span class="star">${t("best")}</span>` : ""}
      <span class="p"><b>$${v4 ? b.p4 : b.p6}</b><span>${b.tb}TB</span></span><span class="u">$${costs[i].toFixed(2)}/TB</span></button>`).join("");
  }

  function renderNodes() {
    const xs = '<svg viewBox="0 0 16 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>';
    $("#nodes").innerHTML = S.nodes.map(n => `
      <div class="node" data-id="${n.id}">
        <div class="node-top">
          <span class="stepper"><button type="button" data-step="-1" aria-label="${t("dec")}">−</button><input data-f="count" type="number" min="1" value="${n.count}" aria-label="${t("count")}"><button type="button" data-step="1" aria-label="${t("inc")}">+</button></span>
          <span class="meta" data-meta></span><span class="chip" data-chip hidden></span>
          <button class="x" type="button" data-del aria-label="${t("del")}">${xs}</button>
        </div>
        <div class="node-times">
          <label><span class="lbl">${t("nStart")}</span><input class="time" type="datetime-local" data-f="start" value="${toInput(n.start)}"></label>
          <label><span class="lbl">${t("nEnd")}</span><input class="time" type="datetime-local" data-f="end" value="${toInput(n.end)}"></label>
        </div>
        <div class="node-err" data-err hidden>${t("endErr")}</div>
      </div>`).join("");
  }

  function actHTML(c) {
    const codes = { in: `<code>${IN}</code>`, out: `<code>${OUT}</code>`, a: `<a href="${BILL}" target="_blank" rel="noopener noreferrer">`, "/a": "</a>" };
    if (!c.has) return `<div class="act-h"><strong>${t("fill")}</strong></div><div class="note">${t("fillHint", codes)}</div>`;
    const cfg = c.nextNodes ? t("cfgPlus", { n: c.nextNodes }) : t("cfgBase");
    const next = `<div class="next"><span class="tag">${t("next")}</span><span>${t("nextLine", { v: fmtGB(c.P), cfg: `<b>${cfg}</b>`, c: `<b class="num">${fmtUSD(c.nextCost)}</b>` })}</span></div>`;
    if (!c.opts.length) return `<div class="act-h"><strong>${t("enough")}</strong><span class="save">${t("leftEnd", { v: fmtGB(c.allow - c.P) })}</span></div>` + next;
    const b = c.best, zero = c.opts[0];
    const ex = c.exhaust ? " · " + t(c.lockedGB > 0 ? "exPast" : "exPred", { t: `<b>${fmtDate(c.exhaust)}</b>` }) : "";
    const head = b.N > 0
      ? `<div class="act-h"><strong>${t("suggest", { n: b.N })}</strong><button class="btn ink sm" type="button" id="applyBtn" data-n="${b.N}">${t("apply")}</button></div>
         <div class="note">${c.plan ? t("planNote", { a: `<b>${fmtGB(c.ai)}</b>`, c: `<b>${fmtUSD(c.ci)}</b>` }) : t("from", { spec: `${ramLabel(c.b.ram)} IPv6-only`, t: `<b>${fmtDate(c.t0)}</b>` })} · ${t("saveV", { v: `<b style="color:var(--pool)">${fmtUSD(zero.total - b.total)}</b>` })}${ex}</div>`
      : `<div class="act-h"><strong>${t(c.lockedGB > 0 ? "optimal" : "noAdd")}</strong></div>`;
    const max = Math.max(...c.opts.map(o => o.total), .01);
    const rows = b.N === 0 ? "" : c.opts.map(o => `<div class="opt${o === b ? " best" : ""}"><span>${o.N ? t("optN", { n: o.N }) : t("optNone")}</span>
      <span class="bar" title="${t("barTip", { a: fmtUSD(o.add), o: fmtUSD(o.over) })}"><i style="width:${o.add / max * 100}%;background:var(--pool)"></i><i style="width:${o.over / max * 100}%;background:var(--bad)"></i></span>
      <span class="tot">${fmtUSD(o.total)}</span></div>`).join("");
    const lock = c.lockedGB > 0 ? `<div class="note">${t("locked", { v: `<b>${fmtGB(c.lockedGB)}</b>` })}</div>` : "";
    return head + rows + lock + next;
  }

  function refresh() {
    const c = compute();
    const band = $("#band"), money = v => `<span class="num">${fmtUSD(v)}</span>`;
    band.className = "band " + c.status;
    $("#bandIc").textContent = { idle: "?", good: "✓", warn: "!", bad: "!" }[c.status];
    $("#bandT").innerHTML = c.status === "good" ? t("bandGood") : c.status === "warn" ? t("bandWarn", { v: money(c.overCost) })
      : c.status === "bad" ? t("bandBad", { v: money(c.overCost) }) : t("bandIdle");
    $("#bandSub").innerHTML = (c.plan ? t("planMode") + " · " : "") + (!c.has ? t("fill") : c.status === "good" ? t("leftEnd", { v: `<b class="num">${fmtGB(c.allow - c.P)}</b>` })
      : (c.exhaust ? t(c.lockedGB > 0 ? "exPast" : "exPred", { t: `<b>${fmtDate(c.exhaust)}</b>` }) + " · " : "") + t("lgOver", { v: `<b class="num">${fmtGB(c.overGB)}</b>` }));
    $("#usedWrap").classList.toggle("need", !c.has);
    const rec = $("#usedRec"); rec.hidden = !c.hasU;
    if (c.hasU) rec.innerHTML = t("recorded", { t: `<b>${fmtDate(c.tU)}</b>`, v: `<b>${fmtGB(c.rate * DAY)}</b>` });
    const bl = $("#billLink"); bl.href = BILL; bl.textContent = t("toBill") + " ↗";
    const sc = Math.max(c.allow, c.P, c.Unow, 1) * 1.02, pc = v => clamp(v / sc * 100, 0, 100) + "%", g = $("#gauge").children;
    const seg = (el, from, to) => { el.style.left = pc(from); el.style.width = to > from ? pc(to - from) : "0"; };
    const A = c.allow, Un = c.has ? c.Unow : 0, Pn = c.has ? c.P : 0;
    seg(g[0], 0, Math.min(Un, A)); seg(g[1], A, Math.max(A, Un));
    seg(g[2], Math.min(Un, A), Math.min(Pn, A)); seg(g[3], Math.max(Un, A), Math.max(Pn, A));
    g[4].style.left = `calc(${pc(A)} - 1px)`;
    const label = k => t(k, { v: "" }).replace(/[\s:：(（]+$/, "");
    $("#flegend").innerHTML = `<span><i style="background:var(--pool)"></i>${label("lgUsed")}</span>`
      + (c.has ? `<span><i style="background:repeating-linear-gradient(-45deg,var(--pool) 0 2px,transparent 2px 4px)"></i>${label("lgEnd")}</span>` : "")
      + `<span><i style="background:var(--fg);width:3px"></i>${label("allowLbl")}</span>`
      + (c.overGB > 0 ? `<span class="ov"><i style="background:var(--bad)"></i>${label("lgOver")}</span>` : "");
    const remain = c.allow - c.Unow;
    $("#sAllow").textContent = fmtGB(c.allow);
    $("#sRemainL").textContent = t(remain >= 0 ? "remain" : "exceeded");
    const r = $("#sRemain"); r.textContent = fmtGB(Math.abs(remain)); r.className = "v " + (remain >= 0 ? "good" : "bad");
    const fc = $("#forecast"); fc.placeholder = c.has ? String(Math.round(c.P)) : "—"; if (document.activeElement !== fc) fc.value = S.forecast ?? "";
    $("#sCost").innerHTML = fmtUSD(c.cost + c.overCost) + (c.overCost > 0 ? `<span class="lbl" style="display:block;white-space:normal;color:var(--bad)">${t("inclOver", { v: fmtUSD(c.overCost) })}</span>` : "");
    $("#act").innerHTML = actHTML(c);
    $("#fleetSum").textContent = t("fleetSum", { n: c.live, c: fmtUSD(c.cost) });
    $("#netLbl").textContent = S.ipv4 ? `${t("dual")} $${c.b.p4}` : `IPv6-only $${c.b.p6}`;
    const hc = $("#halfChip"); hc.hidden = !c.R.half; hc.textContent = t("half");
    $("#nodeSpec").textContent = c.ai <= 0 ? "" : c.plan ? t("planNote", { a: fmtGB(c.ai), c: fmtUSD(c.ci) }) : t("nodeAdd", { a: fmtGB(c.ai), c: fmtUSD(c.ci) });
    for (const n of S.nodes) {
      const row = document.querySelector(`.node[data-id="${n.id}"]`); if (!row) continue;
      row.querySelector("[data-meta]").innerHTML = `<b>+${fmtGB(n._allow)}</b> · ${fmtUSD(n._cost)}`;
      const ch = row.querySelector("[data-chip]"); ch.hidden = !(n._planned || n._gone); ch.textContent = t(n._planned ? "planned" : "gone");
      const bad = n.end != null && n.start != null && n.end <= n.start;
      row.classList.toggle("bad", bad); row.querySelector("[data-err]").hidden = !bad;
      row.querySelector('[data-f="end"]').setAttribute("aria-invalid", bad ? "true" : "false");
    }
    // a forecast typed earlier may fall below usage entered later: say so instead of silently using the usage
    const fcEl = $("#forecast");
    if (document.activeElement !== fcEl) fcError(S.forecast != null && S.used != null && +S.forecast < +S.used ? t("fcErr", { v: Math.round(+S.used) + " GB" }) : "");
    const off = -new Date().getTimezoneOffset(), oh = Math.floor(Math.abs(off) / 60), om = Math.abs(off) % 60;
    $("#tzLbl").textContent = `(${t("localTime")} UTC${off >= 0 ? "+" : "-"}${oh}${om ? ":" + pad(om) : ""})`;
    $("#utcNote").textContent = t("utcNote", { t: fmtDate(c.m0) });
    $("#linkBanner").hidden = !linkLoaded;
    const cur = monthKey(new Date()), ro = $("#rollover");
    ro.hidden = cur === S.month;
    if (!ro.hidden) $("#rolloverText").textContent = t("roll", { m: cur });
  }

  function full() {
    applyLang();
    $("#lang").value = LANG;
    $("#outRatio").value = S.outRatio; $("#outRatioV").textContent = S.outRatio + "%";
    $("#prorate").checked = S.prorate; $("#ipv4").checked = S.ipv4;
    $("#used").value = S.used ?? ""; $("#usedIn").value = S.usedIn ?? ""; $("#usedOut").value = S.usedOut ?? ""; $("#baseStart").value = toInput(S.baseStart);
    renderSizes(); renderNodes(); refresh();
  }
  const change = () => { save(); refresh(); };

  // ---------- events ----------
  // switching language opens that language's page; the choice is remembered for later visits to the root
  $("#lang").addEventListener("change", e => {
    const l = e.target.value;
    try { localStorage.setItem(LANG_KEY, l); } catch (x) {}
    location.href = langHref(l);
  });
  $("#region").addEventListener("change", e => { S.region = e.target.value; save(); renderSizes(); refresh(); });
  $("#sizes").addEventListener("click", e => { const b = e.target.closest("[data-size]"); if (!b) return; S.size = +b.dataset.size; save(); renderSizes(); refresh(); });
  $("#ipv4").addEventListener("change", e => { S.ipv4 = e.target.checked; save(); renderSizes(); refresh(); });
  $("#baseStart").addEventListener("input", e => { S.baseStart = fromInput(e.target.value); change(); });
  // the total can be typed directly, or built from the two bill items (typing the total clears them)
  $("#used").addEventListener("input", e => {
    S.used = e.target.value === "" ? null : Math.max(0, +e.target.value); S.usedAt = Date.now();
    S.usedIn = S.usedOut = null; $("#usedIn").value = $("#usedOut").value = "";
    change();
  });
  const onPart = () => {
    const num = el => el.value === "" ? null : Math.max(0, +el.value || 0);
    S.usedIn = num($("#usedIn")); S.usedOut = num($("#usedOut"));
    S.used = S.usedIn == null && S.usedOut == null ? null : Math.round(((S.usedIn || 0) + (S.usedOut || 0)) * 100) / 100;
    S.usedAt = Date.now(); $("#used").value = S.used ?? "";
    change();
  };
  $("#usedIn").addEventListener("input", onPart);
  $("#usedOut").addEventListener("input", onPart);
  // month-end forecast: must not be below what is already used; invalid input is shown but not applied
  const fcBox = () => $("#forecast").parentNode, fcErr = $("#fcErr");
  const fcError = msg => { fcErr.textContent = msg || ""; fcErr.hidden = !msg; fcBox().classList.toggle("err", !!msg); $("#forecast").setAttribute("aria-invalid", msg ? "true" : "false"); };
  $("#forecast").addEventListener("input", e => {
    if (e.target.value === "") { fcError(""); S.forecast = null; return change(); }
    const v = +e.target.value;
    if (!(v >= 0)) return fcError(t("fcErr", { v: "0 GB" }));
    if (S.used != null && v < +S.used) return fcError(t("fcErr", { v: Math.round(+S.used) + " GB" }));
    fcError(""); S.forecast = v; change();
  });
  $("#forecast").addEventListener("blur", e => { if (!fcErr.hidden) { e.target.value = S.forecast ?? ""; fcError(""); } });
  $("#outRatio").addEventListener("input", e => { S.outRatio = +e.target.value; $("#outRatioV").textContent = S.outRatio + "%"; change(); });
  $("#prorate").addEventListener("change", e => { S.prorate = e.target.checked; change(); });

  function addNodes(count) {
    const [m0, m1] = monthRange(S.month);
    S.nodes.push({ id: uid(), count, start: clamp(nextHour(Date.now()), m0, m1), end: null });
    save(); renderNodes(); refresh();
  }
  $("#addNode").addEventListener("click", () => addNodes(1));
  $("#act").addEventListener("click", e => { const b = e.target.closest("#applyBtn"); if (b) addNodes(+b.dataset.n); });
  const nodeOf = el => { const r = el.closest(".node"); return r && S.nodes.find(n => n.id === r.dataset.id); };
  $("#nodes").addEventListener("input", e => {
    const n = nodeOf(e.target), f = e.target.dataset.f; if (!n || !f) return;
    if (f === "count") n.count = Math.max(1, Math.floor(+e.target.value || 1));
    if (f === "start") n.start = fromInput(e.target.value);
    if (f === "end") n.end = fromInput(e.target.value);
    change();
  });
  $("#nodes").addEventListener("click", e => {
    const n = nodeOf(e.target); if (!n) return;
    const step = e.target.closest("[data-step]");
    if (step) { n.count = Math.max(1, n.count + +step.dataset.step); e.target.closest(".node").querySelector('[data-f="count"]').value = n.count; change(); }
    if (e.target.closest("[data-del]")) { S.nodes = S.nodes.filter(x => x !== n); save(); renderNodes(); refresh(); }
  });

  $("#rolloverBtn").addEventListener("click", () => {
    const cur = monthKey(new Date()), [m0] = monthRange(cur);
    S.nodes = S.nodes.filter(n => n.end == null || n.end > m0).map(n => Object.assign(n, { start: Math.max(n.start ?? m0, m0) }));
    S.baseStart = Math.max(S.baseStart ?? m0, m0);
    Object.assign(S, { month: cur, used: null, usedAt: null, usedIn: null, usedOut: null, forecast: null }); save(); full();
  });

  // global reset: hold the button for 1 s (a bar fills across it); letting go early cancels. Language choice is kept.
  const HOLD_MS = 1000;
  let holdTimer = 0, tipTimer = 0;
  function resetLabel(tip) {
    const b = $("#resetBtn");
    b.classList.toggle("tip", tip); $("#resetHint").hidden = !tip && !b.classList.contains("hold");
    $("#resetBtn span").textContent = t(tip || b.classList.contains("hold") ? "resetHold" : "reset");
  }
  function startHold(e) {
    if (e.button > 0) return;
    const b = $("#resetBtn");
    clearTimeout(tipTimer); b.classList.remove("hold"); void b.offsetWidth; b.classList.add("hold"); resetLabel(false);
    if (e.pointerId != null) try { b.setPointerCapture(e.pointerId); } catch (x) {}
    holdTimer = setTimeout(() => {
      disarmReset();
      try { localStorage.removeItem(KEY); localStorage.removeItem(OLD_KEY); } catch (x) {}
      S = defaults(); save(); $("#settings").open = false; full();
    }, HOLD_MS);
  }
  // released early: cancel, and leave the "hold 3 s" hint up for a moment so a plain click explains itself
  function endHold() {
    const b = $("#resetBtn"); if (!b.classList.contains("hold")) return;
    clearTimeout(holdTimer); b.classList.remove("hold"); resetLabel(true);
    clearTimeout(tipTimer); tipTimer = setTimeout(() => resetLabel(false), 2200);
  }
  function disarmReset() { clearTimeout(holdTimer); clearTimeout(tipTimer); $("#resetBtn").classList.remove("hold"); resetLabel(false); }
  const rb = $("#resetBtn");
  rb.addEventListener("pointerdown", startHold);
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(ev => rb.addEventListener(ev, endHold));
  rb.addEventListener("contextmenu", e => e.preventDefault());
  rb.addEventListener("keydown", e => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); startHold(e); } });
  rb.addEventListener("keyup", e => { if (e.key === " " || e.key === "Enter") endHold(); });
  rb.addEventListener("blur", endHold);
  $("#settings").addEventListener("toggle", () => { if (!$("#settings").open) disarmReset(); });
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (!$("#agent").hidden) closeAgent(); else $("#settings").open = false;
  });

  $("#linkUndo").addEventListener("click", () => {
    try { if (linkBackup == null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, linkBackup); } catch (e) {}
    S = load(); linkLoaded = false; full();
  });
  async function copyText(s) {
    try { await navigator.clipboard.writeText(s); return true; } catch (x) {
      try { const ta = document.createElement("textarea"); ta.value = s; document.body.appendChild(ta); ta.select(); const ok = document.execCommand("copy"); ta.remove(); return ok; } catch (y) { return false; }
    }
  }
  // links always point at the public site (canonical), not wherever this copy happens to be served from
  function siteBase() {
    const canon = document.querySelector('link[rel="canonical"]');
    return canon ? new URL(canon.href).origin + "/" : location.origin + location.pathname;
  }
  $("#copyLinkBtn").addEventListener("click", async e => {
    const btn = e.currentTarget, url = buildLink(fromState(S), siteBase() + LANG_PATHS[LANG]);
    const ok = await copyText(url);
    const label = btn.querySelector("span");
    label.textContent = ok ? t("copied") : url;
    setTimeout(() => { label.textContent = t("copyLink"); }, 1800);
  });
  $("#exportBtn").addEventListener("click", () => {
    try {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: "application/json" }));
      a.download = `lightsail-pool-${S.month}.json`; document.body.appendChild(a); a.click(); a.remove();
    } catch (e) {}
  });
  $("#importFile").addEventListener("change", e => {
    const f = e.target.files[0]; if (!f) return;
    f.text().then(txt => { const s = JSON.parse(txt); if (valid(s)) { S = sanitize(s); save(); full(); } }).catch(() => {});
    e.target.value = "";
  });
  $("#sampleBtn").addEventListener("click", () => {
    const [m0, m1] = monthRange(S.month), now = clamp(Date.now(), m0 + DAY, m1), el = (now - m0) / DAY;
    Object.assign(S, { size: 1, ipv4: true, baseStart: m0, used: Math.round(el * 125), usedAt: now, usedIn: null, usedOut: null, forecast: null,
      nodes: [{ id: uid(), count: 1, start: m0 + 10 * DAY < now ? m0 + 10 * DAY : m0, end: null }] });
    save(); full(); $("#settings").open = false;
  });
  document.addEventListener("click", e => { const d = $("#settings"); if (d.open && !d.contains(e.target)) d.open = false; });

  // theme: system / light / dark, remembered per browser
  const THEMES = ["system", "light", "dark"];
  let theme = "system"; try { theme = localStorage.getItem(THEME_KEY) || "system"; } catch (e) {}
  if (!THEMES.includes(theme)) theme = "system";
  function applyTheme() {
    if (theme === "system") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll("#themeSeg button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.t === theme)));
  }
  $("#themeSeg").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    theme = b.dataset.t; try { localStorage.setItem(THEME_KEY, theme); } catch (x) {} applyTheme();
  });
  applyTheme();

  function fitHeader() {
    const top = $(".top"), tools = $(".tools"), brand = $(".brand-row"), region = $("#regionWrap");
    const gap = parseFloat(getComputedStyle(tools).columnGap);
    // sum the controls: right-aligned overflow spills to the left, which scrollWidth doesn't count
    const rowWidth = () => { const items = [...tools.children].filter(el => el.offsetWidth); return items.reduce((s, el) => s + el.offsetWidth, 0) + (items.length - 1) * gap; };
    const fits = () => {
      const cs = getComputedStyle(top), oneCol = cs.gridTemplateColumns.trim().split(/\s+/).length === 1;
      return rowWidth() + (oneCol ? 0 : brand.scrollWidth + parseFloat(cs.columnGap)) <= top.clientWidth + 1;
    };
    top.classList.remove("stack", "split", "compact");
    if (fits()) return;
    // nearly fits: the AI button keeps only its icon and the region picker gets narrower, still in one row
    top.classList.add("compact");
    if (fits()) return;
    // under the logo: one row with a shrinking region picker, or, if that would get too narrow, the picker on its own row
    top.classList.remove("compact");
    const row = rowWidth();
    top.classList.add("stack");
    const room = top.clientWidth - (row - region.offsetWidth);
    if (room < Math.min(region.offsetWidth, 180)) top.classList.add("split");
  }
  addEventListener("resize", fitHeader);
  // the title and controls change width when the web font arrives or the language changes; stacking itself doesn't resize them
  if (window.ResizeObserver) { const ro = new ResizeObserver(fitHeader); [$(".brand-row h1"), ...$(".tools").children].forEach(el => ro.observe(el)); }

  // agent dialog: how to hand this calculator to an AI agent (prompt, use cases, developer files)
  const CASE_PERM = ["none", "none", "none", "none", "ro", "rw"];
  const AG_ICON_INFO = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="8" cy="8" r="6.2"/><path d="M8 7.2v3.6M8 5.2v.1"/></svg>';
  const AG_ICON_WARN = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.2l6.2 11H1.8z"/><path d="M8 6.6v3M8 11.4v.1"/></svg>';
  const AG_ICON_COPY = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5"/></svg>';
  const AG_ICON_OK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>';
  let agTab = "start", agCopies = [];
  const escH = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function renderAgent() {
    const A = Object.assign({}, I18N.en.ag, I18N[LANG].ag), base = siteBase(), llms = base + "llms.txt";
    const copyBtn = (text, label) => { agCopies.push(text); return `<button class="btn sm" type="button" data-copy="${agCopies.length - 1}" data-label="${escH(label)}">${escH(label)}</button>`; };
    const copyIc = (text, label) => { agCopies.push(text); return `<button class="copy-ic" type="button" data-copy="${agCopies.length - 1}" data-icon="1" title="${escH(label)}" aria-label="${escH(label)}">${AG_ICON_COPY}</button>`; };
    const sub = (s, v) => { for (const p in v) s = s.split("{" + p + "}").join(v[p]); return s; };
    agCopies = [];
    $("#agentT").textContent = A.title; $("#agentSub").textContent = A.sub;
    $("#agentX").title = A.close; $("#agentX").setAttribute("aria-label", A.close);
    $("#tab-start").textContent = A.tabs[0]; $("#tab-cases").textContent = A.tabs[1]; $("#tab-dev").textContent = A.tabs[2];
    const prompt = sub(A.prompt, { url: llms });
    $("#pane-start").innerHTML = `<ol class="steps">
      <li><div><b>${escH(A.s1)}</b><div class="prompt"><pre>${escH(prompt)}</pre><div class="prompt-f">${copyBtn(prompt, A.copyPrompt)}</div></div></div></li>
      <li><div><b>${escH(A.s2)}</b><div class="note">${escH(A.s2n)}</div></div></li>
      <li><div><b>${escH(A.s3)}</b><div class="note">${escH(A.s3n)}</div></div></li></ol>
      <div class="callout">${AG_ICON_INFO}<span>${escH(A.privacy)}</span></div>`;
    $("#pane-cases").innerHTML = `<div class="cases">${A.cases.map((c, i) => {
      const p = CASE_PERM[i], q = c[2] + sub(A.ref, { url: llms });
      return `<div class="case${p === "rw" ? " rw" : ""}"><div class="case-h"><b title="${escH(c[1])}">${escH(c[0])}</b><span class="tag${p === "none" ? "" : " " + p}">${escH(A.perm[p])}</span></div>
        <div class="prompt"><pre>${escH(c[2])}</pre>${copyIc(q, A.copyQ)}</div>
        <div class="lbl">${escH(A.does)}${escH(c[3])}</div></div>`;
    }).join("")}</div><div class="callout w">${AG_ICON_WARN}<span>${escH(A.scaleWarn)}</span></div>`;
    const code = `const base = "${base}";
const { calculate, buildLink } =
  await import(base + "calc.js");
const prices =
  await (await fetch(base + "prices.json")).json();

const input = {
  region: "us-east-1",
  sizeGB: 1,              // the $7 / 2 TB bundle
  usedGB: 3150,
  trafficInstances: [
    { count: 1, start: "2026-10-11T00:00Z" }
  ]
};
const result = calculate(input, prices);
// result.status, .overageCost, .recommendation …
const link = buildLink(input, base);`;
    const files = [["llms.txt", A.files[0]], ["prices.json", A.files[1]], ["calc.js", A.files[2]]];
    const params = ["region", "size", "used", "forecast", "nodes"];
    $("#pane-dev").innerHTML = `<div class="note">${escH(A.devIntro)}</div>
      <div class="dev"><div class="dev-col">
        <div class="files">${files.map(([n, d]) => `<div class="file"><a class="file-n" href="${base + n}" target="_blank" rel="noopener" title="${escH(base + n)}">${n} ↗</a>${copyBtn(base + n, A.copyUrl)}<span class="lbl file-m">${escH(d)}</span></div>`).join("")}</div>
        <div class="ag-h">${escH(A.paramsH)}</div>
        <table class="params">${params.map((p, i) => `<tr><td>${p}</td><td>${escH(A.params[i])}</td></tr>`).join("")}</table>
      </div><div class="dev-col">
        <div class="ag-h"><span>${escH(A.codeH)}</span>${copyBtn(code, A.copy)}</div><div class="code"><pre>${escH(code)}</pre></div>
        <div class="note">${escH(A.more)}</div>
        <div class="ag-links"><a href="${llms}" target="_blank" rel="noopener">llms.txt ↗</a><a href="https://github.com/yt1988/lightsail-cost-saver" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div>
      </div></div>`;
    showAgentTab(agTab, false);
    sizeAgent();
  }
  function sizeAgent() {
    if ($("#agent").hidden) return;
    const body = $(".ag-body"), cs = getComputedStyle(body);
    body.style.height = "";
    let max = 0;
    document.querySelectorAll(".ag-body [role=tabpanel]").forEach(p => { const was = p.hidden; p.hidden = false; max = Math.max(max, p.offsetHeight); p.hidden = was; });
    body.style.height = Math.ceil(max + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)) + "px";
    // on a short screen the dialog's max-height squeezes the body; pin it to what is actually visible
    body.style.height = body.offsetHeight + "px";
    agMore();
  }
  function agMore() { const bd = $(".ag-body"); $(".dialog.ag").classList.toggle("more", bd.scrollTop + bd.clientHeight < bd.scrollHeight - 2); }
  $(".ag-body").addEventListener("scroll", agMore, { passive: true });
  addEventListener("resize", sizeAgent);
  function showAgentTab(id, focus) {
    agTab = id;
    document.querySelectorAll("#agentTabs [role=tab]").forEach(b => {
      const on = b.dataset.tab === id;
      b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1;
      $("#pane-" + b.dataset.tab).hidden = !on;
      if (on && focus) b.focus();
    });
    $(".ag-body").scrollTop = 0; agMore();
  }
  function openAgent() { $("#settings").open = false; $("#agent").hidden = false; sizeAgent(); document.documentElement.style.overflow = "hidden"; $("#tab-" + agTab).focus(); }
  function closeAgent() { $("#agent").hidden = true; document.documentElement.style.overflow = ""; $("#agentBtn").focus(); }
  $("#agentBtn").addEventListener("click", openAgent);
  $("#agentX").addEventListener("click", closeAgent);
  $("#agent").addEventListener("click", async e => {
    if (e.target === e.currentTarget) return closeAgent();
    const tab = e.target.closest("[role=tab]"); if (tab) return showAgentTab(tab.dataset.tab, false);
    const b = e.target.closest("[data-copy]"); if (!b) return;
    const ok = await copyText(agCopies[+b.dataset.copy]);
    clearTimeout(b._t);
    if (b.dataset.icon) { b.innerHTML = ok ? AG_ICON_OK : "✕"; b.classList.toggle("ok", ok); b._t = setTimeout(() => { b.innerHTML = AG_ICON_COPY; b.classList.remove("ok"); }, 1600); }
    else { b.textContent = ok ? t("copied") : "✕"; b._t = setTimeout(() => { b.textContent = b.dataset.label; }, 1600); }
  });
  $("#agentTabs").addEventListener("keydown", e => {
    const ids = ["start", "cases", "dev"], i = ids.indexOf(agTab);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); showAgentTab(ids[(i + (e.key === "ArrowRight" ? 1 : 2)) % 3], true); }
  });

  full();
  setInterval(refresh, 60e3);
})();
