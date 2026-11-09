(function() {
  "use strict";
  const PRICES = { "date": "2026-10-25", "regions": {
    "us-east-1": { "over": 0.09, "q": [[0.5, 5, 3.5, 1], [1, 7, 5, 2], [2, 12, 10, 3], [4, 24, 20, 4], [8, 44, 40, 5], [16, 84, 80, 6], [32, 164, 160, 7], [64, 384, 380, 8]] },
    "us-east-2": { "over": 0.09, "q": [[0.5, 5, 3.5, 1], [1, 7, 5, 2], [2, 12, 10, 3], [4, 24, 20, 4], [8, 44, 40, 5], [16, 84, 80, 6], [32, 164, 160, 7], [64, 384, 380, 8]] },
    "us-west-2": { "over": 0.09, "q": [[0.5, 5, 3.5, 1], [1, 7, 5, 2], [2, 12, 10, 3], [4, 24, 20, 4], [8, 44, 40, 5], [16, 84, 80, 6], [32, 164, 160, 7], [64, 384, 380, 8]] },
    "ca-central-1": { "over": 0.09, "q": [[0.5, 5, 3.5, 1], [1, 7, 5, 2], [2, 12, 10, 3], [4, 24, 20, 4], [8, 44, 40, 5], [16, 84, 80, 6], [32, 164, 160, 7], [64, 384, 380, 8]] },
    "eu-central-1": { "over": 0.09, "q": [[0.5, 5, 3.5, 1], [1, 7, 5, 2], [2, 12, 10, 3], [4, 24, 20, 4], [8, 44, 40, 5], [16, 84, 80, 6], [32, 164, 160, 7], [64, 384, 380, 8]] },
    "eu-west-1": { "over": 0.09, "q": [[0.5, 5, 3.5, 1], [1, 7, 5, 2], [2, 12, 10, 3], [4, 24, 20, 4], [8, 44, 40, 5], [16, 84, 80, 6], [32, 164, 160, 7], [64, 384, 380, 8]] },
    "eu-west-2": { "over": 0.09, "q": [[0.5, 5, 3.5, 1], [1, 7, 5, 2], [2, 12, 10, 3], [4, 24, 20, 4], [8, 44, 40, 5], [16, 84, 80, 6], [32, 164, 160, 7], [64, 384, 380, 8]] },
    "eu-west-3": { "over": 0.09, "q": [[0.5, 5, 3.5, 1], [1, 7, 5, 2], [2, 12, 10, 3], [4, 24, 20, 4], [8, 44, 40, 5], [16, 84, 80, 6], [32, 164, 160, 7], [64, 384, 380, 8]] },
    "eu-north-1": { "over": 0.09, "q": [[0.5, 5, 3.5, 1], [1, 7, 5, 2], [2, 12, 10, 3], [4, 24, 20, 4], [8, 44, 40, 5], [16, 84, 80, 6], [32, 164, 160, 7], [64, 384, 380, 8]] },
    "eu-south-2": { "over": 0.12, "q": [[0.5, 5, 3.5, 1], [1, 7, 5, 2], [2, 12, 10, 3], [4, 24, 20, 4], [8, 44, 40, 5], [16, 84, 80, 6], [32, 164, 160, 7], [64, 384, 380, 8]] },
    "ap-northeast-1": { "over": 0.14, "q": [[0.5, 5, 3.5, 1], [1, 7, 5, 2], [2, 12, 10, 3], [4, 24, 20, 4], [8, 44, 40, 5], [16, 84, 80, 6], [32, 164, 160, 7], [64, 384, 380, 8]] },
    "ap-northeast-2": { "over": 0.13, "q": [[0.5, 5, 3.5, 1], [1, 7, 5, 2], [2, 12, 10, 3], [4, 24, 20, 4], [8, 44, 40, 5], [16, 84, 80, 6], [32, 164, 160, 7], [64, 384, 380, 8]] },
    "ap-southeast-1": { "over": 0.12, "q": [[0.5, 5, 3.5, 1], [1, 7, 5, 2], [2, 12, 10, 3], [4, 24, 20, 4], [8, 44, 40, 5], [16, 84, 80, 6], [32, 164, 160, 7], [64, 384, 380, 8]] },
    "ap-east-1": { "over": 0.09, "q": [[0.5, 5, 3.5, 0.5], [1, 7, 5, 1], [2, 12, 10, 1.5], [4, 24, 20, 2], [8, 44, 40, 2.5], [16, 84, 80, 3], [32, 164, 160, 3.5], [64, 384, 380, 4]] },
    "ap-south-1": { "over": 0.13, "q": [[0.5, 5, 3.5, 0.5], [1, 7, 5, 1], [2, 12, 10, 1.5], [4, 24, 20, 2], [8, 44, 40, 2.5], [16, 84, 80, 3], [32, 164, 160, 3.5], [64, 384, 380, 4]] },
    "ap-southeast-2": { "over": 0.17, "q": [[0.5, 5, 3.5, 0.5], [1, 7, 5, 1], [2, 12, 10, 1.5], [4, 24, 20, 2], [8, 44, 40, 2.5], [16, 84, 80, 3], [32, 164, 160, 3.5], [64, 384, 380, 4]] },
    "ap-southeast-3": { "over": 0.132, "q": [[0.5, 5, 3.5, 0.5], [1, 7, 5, 1], [2, 12, 10, 1.5], [4, 24, 20, 2], [8, 44, 40, 2.5], [16, 84, 80, 3], [32, 164, 160, 3.5], [64, 384, 380, 4]] },
    "ap-southeast-5": { "over": 0.108, "q": [[0.5, 5, 3.5, 0.5], [1, 7, 5, 1], [2, 12, 10, 1.5], [4, 24, 20, 2], [8, 44, 40, 2.5], [16, 84, 80, 3], [32, 164, 160, 3.5], [64, 384, 380, 4]] },
    "sa-east-1": { "over": 0.15, "q": [[0.5, 5, 3.5, 0.5], [1, 7, 5, 1], [2, 12, 10, 1.5], [4, 24, 20, 2], [8, 44, 40, 2.5], [16, 84, 80, 3], [32, 164, 160, 3.5], [64, 384, 380, 4]] }
  } };
  const REGION_ORDER = [
    "us-east-1",
    "us-east-2",
    "us-west-2",
    "ca-central-1",
    "eu-central-1",
    "eu-west-1",
    "eu-west-2",
    "eu-west-3",
    "eu-north-1",
    "eu-south-2",
    "ap-northeast-1",
    "ap-northeast-2",
    "ap-southeast-1",
    "ap-east-1",
    "ap-south-1",
    "ap-southeast-2",
    "ap-southeast-3",
    "ap-southeast-5",
    "sa-east-1"
  ];
  const REGION_NAMES = {
    "zh-CN": ["美东 · 弗吉尼亚", "美东 · 俄亥俄", "美西 · 俄勒冈", "加拿大 · 中部", "欧洲 · 法兰克福", "欧洲 · 爱尔兰", "欧洲 · 伦敦", "欧洲 · 巴黎", "欧洲 · 斯德哥尔摩", "欧洲 · 西班牙", "亚太 · 东京", "亚太 · 首尔", "亚太 · 新加坡", "亚太 · 香港", "亚太 · 孟买", "亚太 · 悉尼", "亚太 · 雅加达", "亚太 · 马来西亚", "南美 · 圣保罗"],
    "zh-TW": ["美東 · 維吉尼亞", "美東 · 俄亥俄", "美西 · 奧勒岡", "加拿大 · 中部", "歐洲 · 法蘭克福", "歐洲 · 愛爾蘭", "歐洲 · 倫敦", "歐洲 · 巴黎", "歐洲 · 斯德哥爾摩", "歐洲 · 西班牙", "亞太 · 東京", "亞太 · 首爾", "亞太 · 新加坡", "亞太 · 香港", "亞太 · 孟買", "亞太 · 雪梨", "亞太 · 雅加達", "亞太 · 馬來西亞", "南美 · 聖保羅"],
    ja: ["米国東部 (バージニア北部)", "米国東部 (オハイオ)", "米国西部 (オレゴン)", "カナダ (中部)", "欧州 (フランクフルト)", "欧州 (アイルランド)", "欧州 (ロンドン)", "欧州 (パリ)", "欧州 (ストックホルム)", "欧州 (スペイン)", "アジアパシフィック (東京)", "アジアパシフィック (ソウル)", "アジアパシフィック (シンガポール)", "アジアパシフィック (香港)", "アジアパシフィック (ムンバイ)", "アジアパシフィック (シドニー)", "アジアパシフィック (ジャカルタ)", "アジアパシフィック (マレーシア)", "南米 (サンパウロ)"],
    en: ["US East (N. Virginia)", "US East (Ohio)", "US West (Oregon)", "Canada (Central)", "Europe (Frankfurt)", "Europe (Ireland)", "Europe (London)", "Europe (Paris)", "Europe (Stockholm)", "Europe (Spain)", "Asia Pacific (Tokyo)", "Asia Pacific (Seoul)", "Asia Pacific (Singapore)", "Asia Pacific (Hong Kong)", "Asia Pacific (Mumbai)", "Asia Pacific (Sydney)", "Asia Pacific (Jakarta)", "Asia Pacific (Malaysia)", "South America (São Paulo)"],
    ko: ["미국 동부 (버지니아 북부)", "미국 동부 (오하이오)", "미국 서부 (오레곤)", "캐나다 (중부)", "유럽 (프랑크푸르트)", "유럽 (아일랜드)", "유럽 (런던)", "유럽 (파리)", "유럽 (스톡홀름)", "유럽 (스페인)", "아시아 태평양 (도쿄)", "아시아 태평양 (서울)", "아시아 태평양 (싱가포르)", "아시아 태평양 (홍콩)", "아시아 태평양 (뭄바이)", "아시아 태평양 (시드니)", "아시아 태평양 (자카르타)", "아시아 태평양 (말레이시아)", "남아메리카 (상파울루)"],
    es: ["EE. UU. Este (Norte de Virginia)", "EE. UU. Este (Ohio)", "EE. UU. Oeste (Oregón)", "Canadá (Centro)", "Europa (Fráncfort)", "Europa (Irlanda)", "Europa (Londres)", "Europa (París)", "Europa (Estocolmo)", "Europa (España)", "Asia-Pacífico (Tokio)", "Asia-Pacífico (Seúl)", "Asia-Pacífico (Singapur)", "Asia-Pacífico (Hong Kong)", "Asia-Pacífico (Bombay)", "Asia-Pacífico (Sídney)", "Asia-Pacífico (Yakarta)", "Asia-Pacífico (Malasia)", "América del Sur (São Paulo)"],
    fr: ["USA Est (Virginie du Nord)", "USA Est (Ohio)", "USA Ouest (Oregon)", "Canada (Centre)", "Europe (Francfort)", "Europe (Irlande)", "Europe (Londres)", "Europe (Paris)", "Europe (Stockholm)", "Europe (Espagne)", "Asie-Pacifique (Tokyo)", "Asie-Pacifique (Séoul)", "Asie-Pacifique (Singapour)", "Asie-Pacifique (Hong Kong)", "Asie-Pacifique (Mumbai)", "Asie-Pacifique (Sydney)", "Asie-Pacifique (Jakarta)", "Asie-Pacifique (Malaisie)", "Amérique du Sud (São Paulo)"],
    de: ["USA Ost (Nord-Virginia)", "USA Ost (Ohio)", "USA West (Oregon)", "Kanada (Zentral)", "Europa (Frankfurt)", "Europa (Irland)", "Europa (London)", "Europa (Paris)", "Europa (Stockholm)", "Europa (Spanien)", "Asien-Pazifik (Tokio)", "Asien-Pazifik (Seoul)", "Asien-Pazifik (Singapur)", "Asien-Pazifik (Hongkong)", "Asien-Pazifik (Mumbai)", "Asien-Pazifik (Sydney)", "Asien-Pazifik (Jakarta)", "Asien-Pazifik (Malaysia)", "Südamerika (São Paulo)"],
    pt: ["Leste dos EUA (Norte da Virgínia)", "Leste dos EUA (Ohio)", "Oeste dos EUA (Oregon)", "Canadá (Central)", "Europa (Frankfurt)", "Europa (Irlanda)", "Europa (Londres)", "Europa (Paris)", "Europa (Estocolmo)", "Europa (Espanha)", "Ásia-Pacífico (Tóquio)", "Ásia-Pacífico (Seul)", "Ásia-Pacífico (Singapura)", "Ásia-Pacífico (Hong Kong)", "Ásia-Pacífico (Mumbai)", "Ásia-Pacífico (Sydney)", "Ásia-Pacífico (Jacarta)", "Ásia-Pacífico (Malásia)", "América do Sul (São Paulo)"],
    ru: ["Восток США (Северная Виргиния)", "Восток США (Огайо)", "Запад США (Орегон)", "Канада (Центр)", "Европа (Франкфурт)", "Европа (Ирландия)", "Европа (Лондон)", "Европа (Париж)", "Европа (Стокгольм)", "Европа (Испания)", "Азия и Тихий океан (Токио)", "Азия и Тихий океан (Сеул)", "Азия и Тихий океан (Сингапур)", "Азия и Тихий океан (Гонконг)", "Азия и Тихий океан (Мумбаи)", "Азия и Тихий океан (Сидней)", "Азия и Тихий океан (Джакарта)", "Азия и Тихий океан (Малайзия)", "Южная Америка (Сан-Паулу)"]
  };
  const LINKS = [
    "https://aws.amazon.com/lightsail/pricing/",
    "https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-faq-data-transfer-allowance.html",
    "https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-frequently-asked-questions-faq-billing-and-account-management.html",
    "https://aws.amazon.com/service-terms/",
    "https://console.aws.amazon.com/billing/home#/bills"
  ];
  const BILL = "https://console.aws.amazon.com/billing/home#/bills";
  const HELP = [["r", 0], ["r", 1], ["over"], ["r", 2], ["r", 3], ["r", 4], ["r", 5], ["r", 6], ["r", 7], ["links"]];
  const LANGS = [["zh-CN", "简体中文"], ["zh-TW", "繁體中文"], ["en", "English"], ["ja", "日本語"], ["ko", "한국어"], ["es", "Español"], ["fr", "Français"], ["de", "Deutsch"], ["pt", "Português"], ["ru", "Русский"]];
  const LANG_PATHS = { "en": "", "zh-CN": "zh-cn/", "zh-TW": "zh-tw/", "ja": "ja/", "ko": "ko/", "es": "es/", "fr": "fr/", "de": "de/", "pt": "pt/", "ru": "ru/" };
  const I18N = {
    "zh-CN": {
      seoTitle: "AWS Lightsail 流量计算器 · 预测超额费用，算出最省钱的加机方案",
      ogSub: "这个月会不会超额？加几台实例最省钱？",
      name: "AWS Lightsail 省钱计算器",
      tagline: "同地区、同套餐的 Lightsail 实例，流量额度可以合起来用。这里帮你算这个月会不会超额、加几台小实例最省钱。",
      region: "地区（只有同一地区的实例能合用额度）",
      lang: "语言",
      over: "超额",
      half: "额度减半",
      settings: "高级设置",
      outRatio: "出站流量占比",
      outRatioHint: "超额只按出站流量（从服务器发出去的）收费。不清楚就保持 100%。",
      prorate: "月中开通的实例，额度按剩余时长折算",
      exp: "导出备份",
      imp: "导入备份",
      sample: "载入示例",
      reset: "重置全部数据",
      resetHold: "按住 1 秒确认",
      copyLink: "复制配置链接",
      copied: "已复制",
      linkLoaded: "已按链接载入配置。你原来的数据已备份，随时可以恢复。",
      undo: "恢复我的数据",
      gh: "在 GitHub 查看源码",
      theme: "主题",
      th_system: "跟随系统",
      th_light: "浅色",
      th_dark: "深色",
      close: "关闭",
      qPrev: "上一个",
      qNext: "下一个",
      roll: "已经到 {m} 了。要清零上个月的已用流量吗？主实例和还在运行的流量实例会保留。",
      rollBtn: "开始新的一个月",
      usedUnit: "GB 已用",
      usedAria: "本月已用流量",
      recorded: "{t} 填写 · 日均 {v}",
      toBill: "去账单查看",
      allow: "本月额度",
      remain: "剩余",
      exceeded: "已超出",
      forecast: "月底预计",
      forecastTip: "留空会按日均用量推算；知道月总量（GB）也可以直接填。",
      fcErr: "不能少于已用的 {v}",
      endErr: "删除时间要晚于开通时间",
      localTime: "本地时间",
      utcNote: "AWS 按 UTC 时间的自然月结算，本月从你当地时间 {t} 开始算",
      cost: "本月预计花费",
      inclOver: "其中超额 {v}",
      bandGood: "放心 · 额度够用",
      bandWarn: "预计超额 · 多付 {v}",
      bandBad: "已超额 · 约多付 {v}",
      bandIdle: "填入用量后开始计算",
      lgUsed: "已用 {v}",
      lgEnd: "月底预计 {v}",
      lgOver: "超出 {v}",
      fill: "先填本月已用流量",
      fillHint: "打开 {a}AWS 账单（Bills → Lightsail）{/a}，把 {in} 和 {out} 两项加起来就是。",
      enough: "额度够用，不需要加实例",
      leftEnd: "月底还剩 {v}",
      suggest: "建议加 {n} 台流量实例",
      apply: "一键加上",
      from: "{spec}，{t} 开始",
      saveV: "比不加省 {v}",
      exPred: "额度预计 {t} 用完",
      exPast: "额度已在 {t} 用完",
      noAdd: "不加实例反而更省",
      planMode: "整月规划",
      planNote: "每台流量实例 +{a} 额度 · {c}/月",
      optimal: "这已经是最省的配置，剩下的超额躲不掉了",
      optNone: "不加",
      optN: "+{n} 台",
      barTip: "实例费 {a} · 超额费 {o}",
      locked: "已经超出的 {v}，新加实例也抵不掉，已算进费用。",
      next: "下个月",
      nextLine: "照这个月的用量（{v}），用 {cfg}，约 {c}/月",
      cfgBase: "只用主实例",
      cfgPlus: "主实例 + {n} 台流量实例",
      fleet: "实例总览",
      fleetSum: "{n} 台 · {c}",
      m2c: "先测你到各个 AWS 区域的延迟",
      xcost: "对比各家云的流量费和总成本",
      base: "主实例",
      baseHint: "你现在在用的那台。新加的流量实例要和它同一个套餐，额度才能合在一起。",
      best: "最省",
      v4: "需要公网 IPv4",
      dual: "双栈",
      start: "开通时间",
      nodes: "流量实例",
      share: "同地区、同套餐的实例共用一个流量池。流量实例选 IPv6-only，比带公网 IPv4 的便宜。",
      nodeAdd: "现在加 1 台：+{a} 额度 · {c}（按到月底的时长计费）",
      add: "加一台流量实例",
      nStart: "开通",
      nEnd: "删除（还在运行就留空）",
      planned: "计划中",
      gone: "已删除",
      dec: "减少",
      inc: "增加",
      count: "台数",
      del: "删除",
      seoDesc: "免费的 AWS Lightsail 流量计算器。同地区、同套餐的实例共用流量池：填入本月已用流量，就能看到剩余额度、月底会不会超额、要多付多少，以及加几台 IPv6 实例最省钱。",
      seoKw: "AWS Lightsail, Lightsail 流量, Lightsail 超额, 流量池, 流量计算器, Lightsail 价格, IPv6 实例, VPS 流量费用, AWS 账单",
      agent: "接入 Agent",
      secCalc: "计算",
      secData: "数据",
      ag: { "title": "在 AI Agent 里使用", "sub": "把一份简短说明交给 AI Agent，它就能替你算，最后给你一个链接，在这里打开就能核对。", "close": "关闭", "tabs": ["快速开始", "常见用法", "开发者"], "s1": "复制这段提示词", "prompt": "请先阅读 {url}，按其中的 Lightsail 计费规则帮我计算流量池。\n我的情况：区域 ___，套餐 ___（如 $7 / 2 TB 流量），本月已用 ___ GB（截至 ___）。\n请告诉我这个月会不会超额、加几台流量实例最省钱，并给我一个预填好的计算器链接方便核对。", "copyPrompt": "复制提示词", "s2": "粘贴到能联网的 Agent 里", "s2n": "ChatGPT、Claude、Gemini、Cursor 等都可以。把空白处填上，或者直接粘贴账单里的流量明细。", "s3": "打开它给你的链接", "s3n": "打开链接会把配置载入这个页面，方便核对数字。你原来的数据会先备份，一键就能恢复。", "privacy": "这个页面不会上传任何数据。配置链接里有你的用量数字，分享前留意一下。", "casesIntro": "复制一句提问，改成你的数字，发给 Agent 即可。每句都已带上说明文档地址。", "does": "Agent 会：", "copyQ": "复制这句提问", "ref": "（规则和算法见 {url}）", "perm": { "none": "无需权限", "ro": "需 AWS 只读权限", "rw": "需 AWS 写权限 · 产生费用" }, "cases": [["会不会超", "月中想知道这个月的额度够不够。", "我在东京用 $12 / 3 TB 的 Lightsail 套餐，本月已用 2800 GB，这个月会超吗？要加几台流量实例？", "按日均用量预测月底，给出最省钱的方案。"], ["部署选型", "新项目上线前，选区域和套餐。", "我的应用每月大约 8 TB 流量，用户主要在东南亚，用 Lightsail 怎么配最便宜？", "对比各地区的单价、额度减半的地区，以及套餐加流量实例的各种组合。"], ["下月规划", "月初按预计总量定好实例数。", "下个月预计在法兰克福跑 12000 GB，用 $7 / 2 TB 的套餐，开几台流量实例成本最低？", "用整月规划模式算出台数和月成本。"], ["账单解读", "看不懂账单里的流量明细。", "这是我 AWS 账单里 Lightsail 的流量明细：（粘贴）。还剩多少额度？会被收费吗？", "汇总 DataXfer-In/Out 两项，并给你一个核对链接。"], ["流量预警", "每天自动检查，快超额前提醒你。", "每天早上读取我 Lightsail 实例的网络流量指标，如果这个月预计会超额就提醒我。", "用 AWS CLI 或 SDK 读取 NetworkIn/Out，代入计算后通知你。"], ["自动扩容", "预计超额时自动加流量实例。", "如果预计会超额，就在同一区域按推荐数量创建同套餐的 IPv6 实例。创建前先让我确认。", "根据推荐结果调用 Lightsail API 创建实例。"]], "scaleWarn": "自动扩容会创建真实收费的实例。只给 Agent 必要的权限，要求它创建前确认，并设好实例数上限。", "devIntro": "所有文件都是静态的，可以跨域读取。没有服务端 API，也不需要密钥。", "files": ["给 Agent 读的说明：计费规则、链接参数、返回字段", "各区域的价格与额度", "计算模块（ES Module），和这个页面同一套代码"], "copyUrl": "复制地址", "codeH": "在代码里调用", "copy": "复制", "paramsH": "预填链接参数", "params": ["AWS 区域代码，如 us-east-1", "套餐，以内存 GB 标识，如 $7 / 2 TB 为 1", "本月已用 GB（入站 + 出站）", "预计月底总量 GB；单独使用时按整月规划", "流量实例，格式 数量@开始[~结束]，UTC"], "more": "完整参数和返回字段见 llms.txt。Node.js 不能直接从网址导入，可以下载 calc.js 或从仓库复制。" },
      cT: "清空全部数据？",
      cB: "实例、已用流量和设置都会恢复默认，清空后找不回来。需要的话，先在高级设置里导出备份。",
      cancel: "取消",
      clear: "清空",
      rules: "计费规则速查",
      r: [
        "入站和出站流量<b>都算进额度</b>",
        "超额<b>只收出站</b>费用，入站永远免费",
        "只有同地区、<b>同套餐</b>的实例能合用额度；同套餐的双栈和 IPv6-only 实例也能合用",
        "按小时计费，<b>关机也照常收费</b>，删除实例才停止",
        "已经产生的超额，<b>新加实例也抵不掉</b>，要在额度用完前加",
        "删掉再重建，本月已用流量<b>不会清零</b>",
        "同地区内走<b>私有 IP</b> 的流量：算进额度，但超额也不收费",
        "按 1 TB = 1024 GB、UTC 自然月估算，实际以 AWS 账单为准"
      ],
      helpQ: ["入站流量也算额度吗？", "入站流量要收费吗？", "超额怎么收费？", "哪些实例能合用额度？", "关机的实例还收费吗？", "新加实例能抵掉已经产生的超额吗？", "删掉重建能清零用量吗？", "内网流量收费吗？", "估算准不准？", "AWS 官方链接"],
      overA: "看地区：超出流量池的出站流量，<b>每 GB {lo}–{hi}</b>。计算器按你选的地区价格算。",
      links: ["官方定价", "流量额度 FAQ", "计费 FAQ", "服务条款", "查看账单用量"],
      foot: "价格核对于 {d} · 非 AWS 官方工具",
      allowLbl: "额度 {v}",
      rpBtn: "结果不对？",
      rpPre: "计算结果不对：",
      rpRegion: "地区",
      rpPrice: "价格核对"
    },
    "zh-TW": {
      seoTitle: "AWS Lightsail 流量計算機｜預測超額費用，算出最省錢的加機方案",
      ogSub: "這個月會不會超額？加幾台執行個體最划算？",
      name: "AWS Lightsail 省錢計算機",
      tagline: "同區域、同方案的 Lightsail 執行個體，流量額度可以合起來用。這裡幫你算這個月會不會超額、加幾台小執行個體最划算。",
      region: "區域（只有同一區域的執行個體能合用額度）",
      lang: "語言",
      over: "超額",
      half: "額度減半",
      settings: "進階設定",
      outRatio: "出站流量比例",
      outRatioHint: "超額只看出站流量（從伺服器送出去的）收費。不確定的話維持 100% 就好。",
      prorate: "月中才建立的執行個體，額度依剩餘時數折算",
      exp: "匯出備份",
      imp: "匯入備份",
      sample: "載入範例",
      reset: "重設所有資料",
      resetHold: "按住 1 秒確認",
      copyLink: "複製設定連結",
      copied: "已複製",
      linkLoaded: "已依連結載入設定。你原本的資料已備份，隨時可以還原。",
      undo: "還原我的資料",
      gh: "在 GitHub 查看原始碼",
      theme: "主題",
      th_system: "跟隨系統",
      th_light: "淺色",
      th_dark: "深色",
      close: "關閉",
      qPrev: "上一個",
      qNext: "下一個",
      roll: "已經是 {m} 了。要把上個月的用量歸零嗎？主執行個體和還在執行的流量執行個體會保留。",
      rollBtn: "開始新的月份",
      usedUnit: "GB 已用",
      usedAria: "本月已用流量",
      recorded: "{t} 填寫 · 日均 {v}",
      toBill: "前往帳單",
      allow: "本月額度",
      remain: "剩餘",
      exceeded: "已超出",
      forecast: "月底預計",
      forecastTip: "留空會依日均用量推算；如果知道月總量（GB），也可以直接填。",
      fcErr: "不能少於已用的 {v}",
      endErr: "刪除時間要晚於建立時間",
      localTime: "當地時間",
      utcNote: "AWS 以 UTC 的自然月計費，本月從你當地時間 {t} 開始算",
      cost: "本月預估費用",
      inclOver: "其中超額 {v}",
      bandGood: "放心 · 額度夠用",
      bandWarn: "預計超額 · 多付 {v}",
      bandBad: "已超額 · 約多付 {v}",
      bandIdle: "填入用量後開始計算",
      lgUsed: "已用 {v}",
      lgEnd: "月底預計 {v}",
      lgOver: "超出 {v}",
      fill: "請先填入本月已用流量",
      fillHint: "打開 {a}AWS 帳單（Bills → Lightsail）{/a}，把 {in} 和 {out} 兩項加起來就是了。",
      enough: "額度夠用，不需要加執行個體",
      leftEnd: "月底還剩 {v}",
      suggest: "建議加 {n} 台流量執行個體",
      apply: "一鍵加入",
      from: "{spec}，{t} 開始",
      saveV: "比不加省 {v}",
      exPred: "額度預計 {t} 用完",
      exPast: "額度已在 {t} 用完",
      noAdd: "不加執行個體反而更省",
      planMode: "整月規劃",
      planNote: "每台流量執行個體 +{a} 額度 · {c}/月",
      optimal: "這已經是最省的配置，剩下的超額避不掉了",
      optNone: "不加",
      optN: "+{n} 台",
      barTip: "執行個體費 {a} · 超額費 {o}",
      locked: "已經超出的 {v}，新加執行個體也抵不掉，已算進費用。",
      next: "下個月",
      nextLine: "照這個月的用量（{v}），用 {cfg}，約 {c}/月",
      cfgBase: "只用主執行個體",
      cfgPlus: "主執行個體 + {n} 台流量執行個體",
      fleet: "執行個體總覽",
      fleetSum: "{n} 台 · {c}",
      m2c: "先測你到各個 AWS 區域的延遲",
      xcost: "比較各家雲端的流量費和總成本",
      base: "主執行個體",
      baseHint: "你現在在用的那台。新加的流量執行個體要跟它同一個方案，額度才能合在一起。",
      best: "最省",
      v4: "需要公用 IPv4",
      dual: "雙堆疊",
      start: "建立時間",
      nodes: "流量執行個體",
      share: "同區域、同方案的執行個體共用一個流量池。流量執行個體選 IPv6-only，比附公用 IPv4 的便宜。",
      nodeAdd: "現在加 1 台：+{a} 額度 · {c}（依到月底的時數計費）",
      add: "加一台流量執行個體",
      nStart: "建立",
      nEnd: "刪除（還在執行就留空）",
      planned: "規劃中",
      gone: "已刪除",
      dec: "減少",
      inc: "增加",
      count: "台數",
      del: "刪除",
      seoDesc: "免費的 AWS Lightsail 流量計算機。同區域、同方案的執行個體共用流量池：填入本月已用流量，就能看到剩餘額度、月底會不會超額、要多付多少，以及加幾台 IPv6 執行個體最省錢。",
      seoKw: "AWS Lightsail, Lightsail 流量, Lightsail 超額, 流量池, 流量計算器, Lightsail 價格, IPv6 執行個體, VPS 流量費用, AWS 帳單",
      agent: "接入 Agent",
      secCalc: "計算",
      secData: "資料",
      ag: { "title": "在 AI Agent 裡使用", "sub": "把一份簡短說明交給 AI Agent，它就能幫你算，最後給你一個連結，在這裡打開就能核對。", "close": "關閉", "tabs": ["快速開始", "常見用法", "開發者"], "s1": "複製這段提示詞", "prompt": "請先閱讀 {url}，按其中的 Lightsail 計費規則幫我計算流量池。\n我的情況：區域 ___，方案 ___（如 $7 / 2 TB 流量），本月已用 ___ GB（截至 ___）。\n請告訴我這個月會不會超額、加幾台流量執行個體最省錢，並給我一個預先填好的計算器連結方便核對。", "copyPrompt": "複製提示詞", "s2": "貼到能連網的 Agent 裡", "s2n": "ChatGPT、Claude、Gemini、Cursor 等都可以。把空白處填上，或直接貼上帳單裡的流量明細。", "s3": "開啟它給你的連結", "s3n": "打開連結會把設定載入這個頁面，方便核對數字。你原本的資料會先備份，一鍵就能還原。", "privacy": "這個頁面不會上傳任何資料。設定連結裡有你的用量數字，分享前請留意。", "casesIntro": "複製一句提問，改成你的數字，傳給 Agent 即可。每句都已帶上說明文件網址。", "does": "Agent 會：", "copyQ": "複製這句提問", "ref": "（規則和演算法見 {url}）", "perm": { "none": "無需權限", "ro": "需 AWS 唯讀權限", "rw": "需 AWS 寫入權限 · 產生費用" }, "cases": [["會不會超", "月中想知道這個月的額度夠不夠。", "我在東京用 $12 / 3 TB 的 Lightsail 方案，本月已用 2800 GB，這個月會超嗎？要加幾台流量執行個體？", "按日均用量預測月底，給出最省錢的方案。"], ["選擇配置", "新專案上線前，選區域和方案。", "我的服務每月大約 8 TB 流量，使用者主要在東南亞，用 Lightsail 怎麼配最便宜？", "比較各區域的單價、額度減半的區域，以及方案加流量執行個體的各種組合。"], ["下月規劃", "月初按預計總量定好執行個體數。", "下個月預計在法蘭克福跑 12000 GB，用 $7 / 2 TB 的方案，開幾台流量執行個體成本最低？", "用整月規劃模式算出台數和月成本。"], ["帳單解讀", "看不懂帳單裡的流量明細。", "這是我 AWS 帳單裡 Lightsail 的流量明細：（貼上）。還剩多少額度？會被收費嗎？", "加總 DataXfer-In/Out 兩項，並給你一個核對連結。"], ["流量預警", "每天自動檢查，快超額前提醒你。", "每天早上讀取我 Lightsail 執行個體的網路流量指標，如果這個月預計會超額就提醒我。", "用 AWS CLI 或 SDK 讀取 NetworkIn/Out，代入計算後通知你。"], ["自動擴充", "預計超額時自動加流量執行個體。", "如果預計會超額，就在同一區域按建議數量建立同方案的 IPv6 執行個體。建立前先讓我確認。", "根據建議結果呼叫 Lightsail API 建立執行個體。"]], "scaleWarn": "自動擴充會建立真實計費的執行個體。只給 Agent 必要的權限，要求它建立前確認，並設好執行個體數上限。", "devIntro": "所有檔案都是靜態的，可以跨網域讀取。沒有伺服器 API，也不需要金鑰。", "files": ["給 Agent 讀的說明：計費規則、連結參數、回傳欄位", "各區域的價格與額度", "計算模組（ES Module），和這個頁面同一套程式碼"], "copyUrl": "複製網址", "codeH": "在程式碼裡呼叫", "copy": "複製", "paramsH": "預填連結參數", "params": ["AWS 區域代碼，如 us-east-1", "方案，以記憶體 GB 標識，如 $7 / 2 TB 為 1", "本月已用 GB（入站 + 出站）", "預計月底總量 GB；單獨使用時按整月規劃", "流量執行個體，格式 數量@開始[~結束]，UTC"], "more": "完整參數和回傳欄位見 llms.txt。Node.js 不能直接從網址匯入，可以下載 calc.js 或從儲存庫複製。" },
      cT: "清除所有資料？",
      cB: "執行個體、已用流量和設定都會恢復預設，清除後無法復原。需要的話，請先在進階設定匯出備份。",
      cancel: "取消",
      clear: "清除",
      rules: "計費規則速查",
      r: [
        "入站和出站流量<b>都會算進額度</b>",
        "超額<b>只收出站</b>費用，入站永遠免費",
        "只有同區域、<b>同方案</b>的執行個體能合用額度；同方案的雙堆疊和 IPv6-only 執行個體也能合用",
        "按小時計費，<b>關機一樣收費</b>，刪除執行個體才會停止",
        "已經產生的超額，<b>新加執行個體也抵不掉</b>，要在額度用完前加",
        "刪掉再重建，本月已用流量<b>不會歸零</b>",
        "同區域內走<b>私有 IP</b> 的流量：會算進額度，但超額也不收費",
        "以 1 TB = 1024 GB、UTC 自然月估算，實際以 AWS 帳單為準"
      ],
      helpQ: ["入站流量也算額度嗎？", "入站流量要收費嗎？", "超額怎麼收費？", "哪些執行個體能合用額度？", "關機的執行個體還會收費嗎？", "新加執行個體能抵掉已經產生的超額嗎？", "刪掉重建能讓用量歸零嗎？", "內網流量要收費嗎？", "估算準不準？", "AWS 官方連結"],
      overA: "依區域而定：超出流量池的出站流量，<b>每 GB {lo}–{hi}</b>。計算機會用你選的區域價格。",
      links: ["官方定價", "流量額度 FAQ", "計費 FAQ", "服務條款", "查看帳單用量"],
      foot: "價格核對於 {d} · 非 AWS 官方工具",
      allowLbl: "額度 {v}",
      rpBtn: "結果不對？",
      rpPre: "計算結果不對：",
      rpRegion: "區域",
      rpPrice: "價格核對"
    },
    en: {
      seoTitle: "AWS Lightsail data transfer calculator: forecast overage and cut costs",
      ogSub: "Will you go over your allowance this month, and what’s the cheapest fix?",
      name: "AWS Lightsail Cost Saver",
      tagline: "Lightsail instances with the same bundle in the same region share one data transfer allowance. See whether you’ll go over this month and how many cheap instances to add to avoid it.",
      region: "Region (allowances only combine within one region)",
      lang: "Language",
      over: "overage",
      half: "half allowance",
      settings: "Advanced settings",
      outRatio: "Outbound share",
      outRatioHint: "Overage is charged on outbound traffic only (data your servers send). Leave it at 100% if unsure.",
      prorate: "Prorate the allowance of instances created mid-month",
      exp: "Export backup",
      imp: "Import backup",
      sample: "Load example",
      reset: "Reset all data",
      resetHold: "Hold 1 s to confirm",
      copyLink: "Copy config link",
      copied: "Copied",
      linkLoaded: "Loaded the setup from the link. Your previous data is backed up and can be restored.",
      undo: "Restore my data",
      gh: "View source on GitHub",
      theme: "Theme",
      th_system: "System",
      th_light: "Light",
      th_dark: "Dark",
      close: "Close",
      qPrev: "Previous",
      qNext: "Next",
      roll: "{m} has started. Clear last month’s usage? Your main instance and running traffic instances stay.",
      rollBtn: "Start new month",
      usedUnit: "GB used",
      usedAria: "Data used this month",
      recorded: "Entered {t} · {v}/day",
      toBill: "Open Bills",
      allow: "Allowance",
      remain: "Remaining",
      exceeded: "Over by",
      forecast: "Month-end forecast",
      forecastTip: "Leave blank to project from your daily average, or enter the monthly total you expect (GB)",
      fcErr: "Can’t be less than what you’ve used ({v})",
      endErr: "Deletion time must be after creation time",
      localTime: "local time",
      utcNote: "AWS bills by calendar month in UTC. This month started at {t} your time.",
      cost: "Estimated cost this month",
      inclOver: "incl. {v} overage",
      bandGood: "You’re fine · within allowance",
      bandWarn: "Overage ahead · about {v} extra",
      bandBad: "Over allowance · about {v} extra",
      bandIdle: "Enter your usage to start",
      lgUsed: "Used {v}",
      lgEnd: "Month end {v}",
      lgOver: "Over by {v}",
      fill: "Start with this month’s data usage",
      fillHint: "In {a}AWS Bills → Lightsail{/a}, add the {in} and {out} lines together.",
      enough: "Your allowance is enough. No extra instances needed",
      leftEnd: "{v} left at month end",
      suggest: "Add {n} traffic instance(s)",
      apply: "Add them",
      from: "{spec}, from {t}",
      saveV: "saves {v} compared with adding none",
      exPred: "allowance runs out {t}",
      exPast: "allowance ran out {t}",
      noAdd: "Adding none is cheaper",
      planMode: "Full-month plan",
      planNote: "Each traffic instance: +{a} allowance · {c}/mo",
      optimal: "This is already the cheapest setup. The remaining overage can’t be avoided.",
      optNone: "None",
      optN: "+{n}",
      barTip: "Instances {a} · Overage {o}",
      locked: "The {v} you’re already over can’t be covered by new instances, so it’s included.",
      next: "Next month",
      nextLine: "At this month’s pace ({v}), run {cfg} for about {c}/mo",
      cfgBase: "just your main instance",
      cfgPlus: "your main instance + {n} traffic instance(s)",
      fleet: "Instances",
      fleetSum: "{n} · {c}",
      m2c: "Test your latency to each AWS Region first",
      xcost: "Compare transfer fees and total cost across clouds",
      base: "Main instance",
      baseHint: "The instance you already run. Traffic instances must use the same bundle so their allowances combine.",
      best: "Best",
      v4: "Needs public IPv4",
      dual: "Dual-stack",
      start: "Created",
      nodes: "Traffic instances",
      share: "Instances with the same bundle in the same region share one pool. Traffic instances are IPv6-only, which costs less than public IPv4.",
      nodeAdd: "Add 1 now: +{a} allowance · {c} (prorated to month end)",
      add: "Add traffic instance",
      nStart: "Created",
      nEnd: "Deleted (leave blank if running)",
      planned: "Planned",
      gone: "Deleted",
      dec: "Decrease",
      inc: "Increase",
      count: "Count",
      del: "Remove",
      seoDesc: "Free AWS Lightsail data transfer calculator. Instances with the same bundle in one region share an allowance pool. Enter this month’s usage to see what’s left, whether you’ll pay overage, and how many IPv6 instances to add to pay the least.",
      agent: "Use with AI",
      secCalc: "Calculation",
      secData: "Data",
      ag: { "title": "Use it with an AI agent", "sub": "Your agent reads one short guide, does the math for you and hands back a link you can check here.", "close": "Close", "tabs": ["Quick start", "Use cases", "Developers"], "s1": "Copy this prompt", "prompt": "Read {url} first, then use its Lightsail billing rules to work out my data transfer pool.\nMy setup: region ___, bundle ___ (e.g. $7 / 2 TB transfer), ___ GB used this month (as of ___).\nTell me whether I'll go over this month and the cheapest number of traffic instances to add, and give me a pre-filled calculator link so I can check.", "copyPrompt": "Copy prompt", "s2": "Paste it into an agent that can browse the web", "s2n": "ChatGPT, Claude, Gemini, Cursor and similar all work. Fill in the blanks, or paste the data transfer lines from your bill instead.", "s3": "Open the link it returns", "s3n": "The link loads the setup here so you can check the numbers. Your current data is backed up first and can be restored.", "privacy": "This page uploads nothing. Config links contain your usage numbers, so check before sharing them.", "casesIntro": "Copy a question, change the numbers and send it to your agent. Each one already points it at the guide.", "does": "Agent: ", "copyQ": "Copy question", "ref": " (Rules and method: {url})", "perm": { "none": "No access needed", "ro": "AWS read-only", "rw": "AWS write · costs money" }, "cases": [["Will I go over?", "A mid-month check on whether the pool will last.", "I'm on the $12 / 3 TB Lightsail bundle in Tokyo and have used 2800 GB this month. Will I go over, and how many traffic instances should I add?", "projects month-end use from the daily pace and finds the cheapest fix."], ["Choose a setup", "Planning a new project before you deploy.", "My app will push about 8 TB a month, mostly to users in Southeast Asia. What's the cheapest Lightsail region and bundle setup?", "compares region prices, half-allowance regions and bundle plus traffic-instance combinations."], ["Plan next month", "Sizing the fleet at the start of the month.", "Next month I expect about 12,000 GB in Frankfurt on the $7 / 2 TB bundle. How many traffic instances keep the cost lowest?", "runs a full-month plan and returns the count and monthly cost."], ["Explain my bill", "The data transfer lines on the bill are hard to read.", "Here are the Lightsail data transfer lines from my AWS bill: (paste). How much allowance is left, and will I be charged?", "adds up the DataXfer-In/Out items and gives you a link to verify."], ["Usage alerts", "A daily check that warns you before overage.", "Every morning, read the network metrics of my Lightsail instances and warn me if this month is heading for overage.", "reads NetworkIn/Out with the AWS CLI or SDK, runs the numbers and notifies you."], ["Auto scale-up", "Add traffic instances automatically when overage is coming.", "If overage is expected, create the recommended number of IPv6-only instances of my bundle in the same region. Ask me to confirm before creating anything.", "uses the recommendation to call the Lightsail API and create instances."]], "scaleWarn": "Auto scale-up creates real, billed instances. Give the agent only the permissions it needs, require confirmation and cap the instance count.", "devIntro": "Everything is static and readable from any origin. There is no server API and no key.", "files": ["Guide for agents: rules, link parameters, result fields", "Prices and allowances for every region", "The calculation module (ES module), the same code as this page"], "copyUrl": "Copy URL", "codeH": "Call it from code", "copy": "Copy", "paramsH": "Pre-filled link parameters", "params": ["AWS Region code, e.g. us-east-1", "Bundle, identified by RAM in GB; $7 / 2 TB is 1", "GB used so far this month (in + out)", "Expected month-end total in GB; on its own, plans the full month", "Traffic instances as count@start[~end], UTC"], "more": "All parameters and result fields are in llms.txt. Node.js can't import from a URL: download calc.js or copy it from the repository." },
      cT: "Clear all data?",
      cB: "Instances, usage and settings go back to defaults, and this can’t be undone. Export a backup in Advanced settings first if you need one.",
      cancel: "Cancel",
      clear: "Clear",
      rules: "Billing rules",
      r: [
        "Inbound and outbound traffic <b>both count</b> toward the allowance",
        "Overage is <b>charged on outbound only</b>; inbound is always free",
        "Only instances in the same region with the <b>same bundle</b> share a pool; dual-stack and IPv6-only versions of one bundle pool together",
        "Billed by the hour. <b>Stopped instances still bill</b>; only deleting stops it",
        "Overage you’ve already run up <b>can’t be offset</b> by new instances, so add them before you run out",
        "Deleting and recreating an instance <b>doesn’t reset</b> this month’s usage",
        "Traffic over <b>private IPs</b> within a region counts toward the allowance but is never charged",
        "Estimates use 1 TB = 1024 GB and UTC calendar months. Your AWS bill has the final numbers"
      ],
      helpQ: ["Does inbound traffic count toward the allowance?", "Is inbound traffic ever charged?", "How much does overage cost?", "Which instances share a pool?", "Do stopped instances still bill?", "Can new instances cancel out overage?", "Does recreating an instance reset usage?", "Is private IP traffic charged?", "How accurate are the estimates?", "Official AWS links"],
      overA: "It depends on the region: <b>{lo}–{hi} per GB</b> of outbound traffic beyond the pool. The calculator uses the rate for the region you picked.",
      links: ["Pricing", "Data transfer FAQ", "Billing FAQ", "Service terms", "View bill usage"],
      foot: "Prices checked {d} · Not an official AWS tool",
      allowLbl: "Allowance {v}",
      rpBtn: "Result wrong?",
      rpPre: "The result is wrong:",
      rpRegion: "Region",
      rpPrice: "Prices checked"
    },
    ja: {
      seoTitle: "AWS Lightsail 転送量計算ツール｜超過料金を予測して最安の対策を計算",
      ogSub: "今月は枠を超える？何台足せば一番安い？",
      name: "AWS Lightsail 節約計算機",
      tagline: "同じリージョン・同じプランの Lightsail インスタンスは、転送量の枠を合算して使えます。今月超過するか、何台足せば一番安いかを計算します。",
      region: "リージョン（枠を合算できるのは同じリージョン内だけ）",
      lang: "言語",
      over: "超過",
      half: "枠が半分",
      settings: "詳細設定",
      outRatio: "送信の割合",
      outRatioHint: "超過料金がかかるのは送信（サーバーから外へ出る通信）だけです。わからなければ 100% のままで大丈夫です。",
      prorate: "月の途中で作成したインスタンスの枠を稼働時間で按分",
      exp: "バックアップを書き出す",
      imp: "バックアップを読み込む",
      sample: "サンプルを読み込む",
      reset: "全データをリセット",
      resetHold: "1 秒長押しで確定",
      copyLink: "設定リンクをコピー",
      copied: "コピーしました",
      linkLoaded: "リンクの設定を読み込みました。元のデータはバックアップしてあり、いつでも戻せます。",
      undo: "元のデータに戻す",
      gh: "GitHub でソースを見る",
      theme: "テーマ",
      th_system: "システム",
      th_light: "ライト",
      th_dark: "ダーク",
      close: "閉じる",
      qPrev: "前へ",
      qNext: "次へ",
      roll: "{m} になりました。先月の使用量をクリアしますか？メインと稼働中の追加インスタンスはそのまま残ります。",
      rollBtn: "新しい月を始める",
      usedUnit: "GB 使用済み",
      usedAria: "今月の使用量",
      recorded: "{t} 入力 · 1 日平均 {v}",
      toBill: "請求書を開く",
      allow: "今月の枠",
      remain: "残り",
      exceeded: "超過",
      forecast: "月末予測",
      forecastTip: "空欄なら 1 日平均から推定します。月の合計 (GB) がわかっていれば直接入力もできます",
      fcErr: "使用済みの {v} より少なくはできません",
      endErr: "削除日時は作成日時より後にしてください",
      localTime: "ローカル時間",
      utcNote: "AWS は UTC の暦月で請求します。今月はあなたの時間で {t} から始まりました",
      cost: "今月の見込み額",
      inclOver: "うち超過 {v}",
      bandGood: "大丈夫 · 枠内に収まります",
      bandWarn: "超過見込み · 約 {v}",
      bandBad: "超過中 · 約 {v}",
      bandIdle: "使用量を入力してください",
      lgUsed: "使用 {v}",
      lgEnd: "月末予測 {v}",
      lgOver: "超過 {v}",
      fill: "まず今月の使用量を入力",
      fillHint: "{a}AWS の請求書 (Bills → Lightsail){/a} にある {in} と {out} を足した値です。",
      enough: "枠は足りています。追加は不要です",
      leftEnd: "月末に {v} 残る見込み",
      suggest: "追加インスタンスを {n} 台足す",
      apply: "追加する",
      from: "{spec}、{t} から",
      saveV: "足さない場合より {v} 安い",
      exPred: "{t} に枠を使い切る見込み",
      exPast: "{t} に枠を使い切りました",
      noAdd: "足さない方が安い",
      planMode: "1 か月分で計画",
      planNote: "追加 1 台ごとに枠 +{a} · {c}/月",
      optimal: "これが最も安い構成です。残りの超過は避けられません",
      optNone: "なし",
      optN: "+{n} 台",
      barTip: "インスタンス代 {a} · 超過料金 {o}",
      locked: "すでに超過した {v} は、インスタンスを足しても取り消せないため含めています。",
      next: "来月",
      nextLine: "今月のペース ({v}) なら {cfg}、月 約 {c}",
      cfgBase: "メインのみ",
      cfgPlus: "メイン + 追加 {n} 台",
      fleet: "インスタンス一覧",
      fleetSum: "{n} 台 · {c}",
      m2c: "まず各 AWS リージョンへの遅延を測定",
      xcost: "各クラウドの転送料金と総コストを比較",
      base: "メインのインスタンス",
      baseHint: "いま使っているインスタンスです。追加インスタンスは同じプランにしないと枠を合算できません。",
      best: "最安",
      v4: "パブリック IPv4 が必要",
      dual: "デュアルスタック",
      start: "作成日時",
      nodes: "追加インスタンス",
      share: "同じリージョン・同じプランなら枠を合算できます。追加分は IPv6-only にすると、パブリック IPv4 付きより安く済みます。",
      nodeAdd: "今 1 台足すと：枠 +{a} · {c}（月末まで按分）",
      add: "追加インスタンスを足す",
      nStart: "作成",
      nEnd: "削除（稼働中なら空欄）",
      planned: "予定",
      gone: "削除済み",
      dec: "減らす",
      inc: "増やす",
      count: "台数",
      del: "削除",
      seoDesc: "無料の AWS Lightsail 転送量計算ツール。同じリージョン・同じプランのインスタンスは転送量の枠を合算できます。今月の使用量を入れるだけで、残りの枠、月末に超過するか、IPv6 インスタンスを何台足すと一番安いかがわかります。",
      seoKw: "AWS Lightsail, Lightsail 転送量, Lightsail 超過料金, データ転送, 転送量計算, Lightsail 料金, IPv6, VPS",
      agent: "AI で使う",
      secCalc: "計算",
      secData: "データ",
      ag: { "title": "AI エージェントで使う", "sub": "短いガイドを読ませるだけで、エージェントが計算し、ここで確認できるリンクを返します。", "close": "閉じる", "tabs": ["クイックスタート", "使い方の例", "開発者向け"], "s1": "このプロンプトをコピー", "prompt": "まず {url} を読み、その Lightsail の課金ルールでデータ転送プールを計算してください。\n私の構成：リージョン ___、プラン ___（例：$7 / 転送量 2 TB）、今月の使用量 ___ GB（___ 時点）。\n今月超過するか、最も安く済む追加インスタンスの追加台数を教えてください。確認用に入力済みの計算機リンクもください。", "copyPrompt": "プロンプトをコピー", "s2": "Web を閲覧できるエージェントに貼り付ける", "s2n": "ChatGPT、Claude、Gemini、Cursor などで使えます。空欄を埋めるか、請求書の転送量の明細をそのまま貼り付けてください。", "s3": "返ってきたリンクを開く", "s3n": "リンクを開くと構成がこのページに読み込まれ、数値を確認できます。元のデータは先にバックアップされ、復元できます。", "privacy": "このページは何もアップロードしません。設定リンクには使用量が含まれるので、共有前に確認してください。", "casesIntro": "質問をコピーして数値を書き換え、エージェントに送るだけです。どの質問にもガイドの URL が入っています。", "does": "エージェント：", "copyQ": "質問をコピー", "ref": "（ルールと計算方法：{url}）", "perm": { "none": "権限不要", "ro": "AWS 読み取り権限", "rw": "AWS 書き込み権限・費用発生" }, "cases": [["超過する？", "月の途中で、枠が足りるか確認したい。", "東京で $12 / 3 TB の Lightsail プランを使っていて、今月は 2800 GB 使いました。今月超過しますか？追加インスタンスを何台追加すべき？", "1 日あたりのペースから月末を予測し、最も安い対策を出します。"], ["構成を選ぶ", "新規プロジェクトのデプロイ前に検討したい。", "月に約 8 TB 転送するアプリで、ユーザーは主に東南アジアです。Lightsail で最も安いリージョンとプランの組み合わせは？", "リージョン単価、枠半分のリージョン、プランと追加インスタンスの組み合わせを比較します。"], ["来月の計画", "月初に台数を決めたい。", "来月はフランクフルトの $7 / 2 TB プランで約 12000 GB を見込んでいます。追加インスタンスは何台が最安ですか？", "月全体の計画モードで台数と月額を出します。"], ["請求書を読む", "請求書の転送量の明細がわかりにくい。", "AWS 請求書の Lightsail 転送量の明細です：（貼り付け）。枠はあとどれくらいで、課金されますか？", "DataXfer-In/Out を合計し、確認用リンクを返します。"], ["使用量アラート", "毎日チェックして、超過前に知らせてほしい。", "毎朝 Lightsail インスタンスのネットワーク指標を読み取り、今月超過しそうなら知らせてください。", "AWS CLI または SDK で NetworkIn/Out を読み、計算して通知します。"], ["自動スケールアップ", "超過しそうなときに自動で追加したい。", "超過が見込まれる場合、同じリージョンに同じプランの IPv6 インスタンスを推奨台数だけ作成してください。作成前に必ず確認を求めてください。", "推奨結果に従って Lightsail API でインスタンスを作成します。"]], "scaleWarn": "自動スケールアップは実際に課金されるインスタンスを作成します。必要最小限の権限だけを与え、作成前の確認と台数の上限を設定してください。", "devIntro": "すべて静的ファイルで、どのオリジンからも読み込めます。サーバー API もキーもありません。", "files": ["エージェント向けガイド：ルール、リンクのパラメータ、結果のフィールド", "全リージョンの料金と転送枠", "計算モジュール（ES Module）、このページと同じコード"], "copyUrl": "URL をコピー", "codeH": "コードから呼び出す", "copy": "コピー", "paramsH": "入力済みリンクのパラメータ", "params": ["AWS リージョンコード（例 us-east-1）", "プラン（メモリ GB で指定）。$7 / 2 TB は 1", "今月の使用量 GB（受信 + 送信）", "月末の見込み合計 GB。単独なら月全体の計画", "追加インスタンス：台数@開始[~終了]、UTC"], "more": "すべてのパラメータと結果のフィールドは llms.txt にあります。Node.js は URL から直接 import できないため、calc.js をダウンロードするかリポジトリからコピーしてください。" },
      cT: "全データを消去しますか？",
      cB: "インスタンス、使用量、設定がすべて初期状態に戻ります。元には戻せません。必要なら先に詳細設定からバックアップを書き出してください。",
      cancel: "キャンセル",
      clear: "消去",
      rules: "料金ルールまとめ",
      r: [
        "受信も送信も<b>枠を消費します</b>",
        "超過料金は<b>送信だけ</b>。受信はいつでも無料",
        "合算できるのは同じリージョン・<b>同じプラン</b>だけ。同じプランならデュアルスタックと IPv6-only も合算可",
        "時間単位の課金。<b>停止中も課金</b>され、止まるのは削除したときだけ",
        "すでに発生した超過は<b>あとから足しても取り消せません</b>。枠を使い切る前に追加を",
        "削除して作り直しても、今月の使用量は<b>リセットされません</b>",
        "同じリージョン内の<b>プライベート IP</b> 通信は枠を消費しますが、超過しても無料",
        "1 TB = 1024 GB、UTC の暦月で計算しています。最終的な金額は AWS の請求書で確認してください"
      ],
      helpQ: ["受信も枠を消費しますか？", "受信に料金はかかりますか？", "超過料金はいくら？", "どのインスタンスが枠を合算できますか？", "停止中のインスタンスにも料金はかかりますか？", "インスタンスを足せば超過は消えますか？", "作り直せば使用量はリセットされますか？", "プライベート IP の通信は有料ですか？", "見積もりはどれくらい正確？", "AWS 公式リンク"],
      overA: "リージョンによって違い、プールを超えた送信は<b>1 GB あたり {lo}–{hi}</b>です。計算には選んだリージョンの料金を使います。",
      links: ["料金", "データ転送 FAQ", "請求 FAQ", "サービス条件", "請求の使用量を見る"],
      foot: "価格確認 {d} · AWS 公式ツールではありません",
      allowLbl: "枠 {v}",
      rpBtn: "結果が違いますか？",
      rpPre: "計算結果が違います：",
      rpRegion: "リージョン",
      rpPrice: "価格確認"
    },
    ko: {
      seoTitle: "AWS Lightsail 전송량 계산기: 초과 요금 예측과 가장 싼 해결책",
      ogSub: "이번 달 한도를 넘을까요? 몇 대를 더하면 가장 쌀까요?",
      name: "AWS Lightsail 절약 계산기",
      tagline: "같은 리전·같은 플랜의 Lightsail 인스턴스는 전송량 한도를 합쳐서 써요. 이번 달 초과 여부와, 몇 대를 더하면 가장 싼지 계산해 드려요.",
      region: "리전 (한도는 같은 리전 안에서만 합쳐져요)",
      lang: "언어",
      over: "초과",
      half: "한도 절반",
      settings: "고급 설정",
      outRatio: "아웃바운드 비율",
      outRatioHint: "초과 요금은 아웃바운드(서버에서 내보내는 트래픽)에만 붙어요. 잘 모르겠으면 100%로 두세요.",
      prorate: "월 중간에 만든 인스턴스는 한도를 사용 시간만큼 나눠 계산",
      exp: "백업 내보내기",
      imp: "백업 가져오기",
      sample: "예시 불러오기",
      reset: "모든 데이터 초기화",
      resetHold: "1초 길게 눌러 확인",
      copyLink: "설정 링크 복사",
      copied: "복사됨",
      linkLoaded: "링크의 설정을 불러왔어요. 기존 데이터는 백업해 두었으니 언제든 되돌릴 수 있어요.",
      undo: "이전 데이터 복원",
      gh: "GitHub에서 소스 보기",
      theme: "테마",
      th_system: "시스템",
      th_light: "라이트",
      th_dark: "다크",
      close: "닫기",
      qPrev: "이전",
      qNext: "다음",
      roll: "새 달 시작 ({m}): 지난달 사용량을 지울까요? 메인 인스턴스와 실행 중인 트래픽 인스턴스는 그대로 남아요.",
      rollBtn: "새 달 시작",
      usedUnit: "GB 사용",
      usedAria: "이번 달 사용량",
      recorded: "{t} 입력 · 하루 평균 {v}",
      toBill: "청구서 열기",
      allow: "이번 달 한도",
      remain: "남음",
      exceeded: "초과",
      forecast: "월말 예상",
      forecastTip: "비워 두면 하루 평균으로 추정해요. 예상 월 합계(GB)를 직접 넣어도 돼요",
      fcErr: "이미 쓴 {v}보다 적을 수 없어요",
      endErr: "삭제 시각은 생성 시각보다 뒤여야 해요",
      localTime: "현지 시간",
      utcNote: "AWS는 UTC 기준 달력 월로 청구해요. 이번 달은 현지 시간 {t}부터예요",
      cost: "이번 달 예상 비용",
      inclOver: "초과 {v} 포함",
      bandGood: "괜찮아요 · 한도 안이에요",
      bandWarn: "초과 예상 · 약 {v} 추가",
      bandBad: "초과됨 · 약 {v} 추가",
      bandIdle: "사용량을 입력하세요",
      lgUsed: "사용 {v}",
      lgEnd: "월말 예상 {v}",
      lgOver: "초과 {v}",
      fill: "먼저 이번 달 사용량을 입력하세요",
      fillHint: "{a}AWS 청구서 (Bills → Lightsail){/a}에서 {in}과 {out}을 더한 값이에요.",
      enough: "한도가 충분해요. 더 추가할 필요 없어요",
      leftEnd: "월말 {v} 남음",
      suggest: "트래픽 인스턴스 {n}대 추가 권장",
      apply: "바로 추가",
      from: "{spec}, {t}부터",
      saveV: "추가하지 않을 때보다 {v} 절약",
      exPred: "{t}에 한도 소진 예상",
      exPast: "할당량 {t}에 소진됨",
      noAdd: "추가하지 않는 편이 저렴",
      planMode: "한 달 전체 기준",
      planNote: "트래픽 인스턴스 1대당 한도 +{a} · {c}/월",
      optimal: "이미 가장 싼 구성이에요. 남은 초과는 피할 수 없어요",
      optNone: "추가 안 함",
      optN: "+{n}대",
      barTip: "인스턴스 {a} · 초과 {o}",
      locked: "이미 넘은 {v}는 인스턴스를 더해도 상쇄되지 않아 비용에 포함했어요.",
      next: "다음 달",
      nextLine: "이번 달 속도({v})라면 {cfg}, 월 약 {c}",
      cfgBase: "메인 인스턴스만",
      cfgPlus: "메인 + 트래픽 {n}대",
      fleet: "인스턴스 개요",
      fleetSum: "{n}대 · {c}",
      m2c: "먼저 각 AWS 리전까지의 지연 시간 측정",
      xcost: "클라우드별 전송 요금과 총비용 비교",
      base: "메인 인스턴스",
      baseHint: "지금 쓰고 있는 인스턴스예요. 트래픽 인스턴스는 같은 플랜이어야 한도가 합쳐져요.",
      best: "최저가",
      v4: "퍼블릭 IPv4 필요",
      dual: "듀얼 스택",
      start: "생성 시각",
      nodes: "트래픽 인스턴스",
      share: "같은 리전·같은 플랜이면 한도를 함께 써요. 트래픽 인스턴스는 IPv6-only라 퍼블릭 IPv4보다 저렴해요.",
      nodeAdd: "지금 1대 추가: 한도 +{a} · {c} (월말까지 시간 비례)",
      add: "트래픽 인스턴스 추가",
      nStart: "생성",
      nEnd: "삭제 (실행 중이면 비워 두기)",
      planned: "예정",
      gone: "삭제됨",
      dec: "줄이기",
      inc: "늘리기",
      count: "대수",
      del: "삭제",
      seoDesc: "무료 AWS Lightsail 전송량 계산기. 같은 리전·같은 플랜의 인스턴스는 전송량 한도를 함께 씁니다. 이번 달 사용량만 넣으면 남은 한도, 초과 요금 여부, IPv6 인스턴스를 몇 대 더해야 가장 싼지 알려 줍니다.",
      seoKw: "AWS Lightsail, Lightsail 데이터 전송, Lightsail 초과 요금, 전송량 계산기, Lightsail 요금, IPv6 인스턴스, VPS",
      agent: "AI로 사용",
      secCalc: "계산",
      secData: "데이터",
      ag: { "title": "AI 에이전트에서 사용하기", "sub": "짧은 안내 문서만 읽히면 에이전트가 대신 계산하고, 여기서 확인할 수 있는 링크를 돌려줍니다.", "close": "닫기", "tabs": ["빠른 시작", "활용 예시", "개발자"], "s1": "이 프롬프트를 복사하세요", "prompt": "먼저 {url} 을 읽고, 그 Lightsail 과금 규칙으로 내 데이터 전송 풀을 계산해 주세요.\n내 구성: 리전 ___, 플랜 ___(예: $7 / 전송량 2 TB), 이번 달 사용량 ___ GB(___ 기준).\n이번 달 초과 여부와 가장 저렴한 트래픽 인스턴스 추가 대수를 알려 주고, 확인용으로 값이 채워진 계산기 링크도 주세요.", "copyPrompt": "프롬프트 복사", "s2": "웹 검색이 되는 에이전트에 붙여 넣기", "s2n": "ChatGPT, Claude, Gemini, Cursor 등 모두 됩니다. 빈칸을 채우거나 청구서의 전송량 항목을 그대로 붙여 넣으세요.", "s3": "돌려받은 링크 열기", "s3n": "링크를 열면 구성이 이 페이지에 불러와져 숫자를 확인할 수 있습니다. 기존 데이터는 먼저 백업되며 복원할 수 있습니다.", "privacy": "이 페이지는 아무것도 업로드하지 않습니다. 설정 링크에는 사용량이 들어 있으니 공유 전에 확인하세요.", "casesIntro": "질문을 복사해 숫자만 바꿔 에이전트에 보내세요. 모든 질문에 안내 문서 주소가 들어 있습니다.", "does": "에이전트: ", "copyQ": "질문 복사", "ref": " (규칙과 계산 방법: {url})", "perm": { "none": "권한 불필요", "ro": "AWS 읽기 권한", "rw": "AWS 쓰기 권한 · 비용 발생" }, "cases": [["초과할까?", "월 중간에 한도가 충분한지 확인.", "도쿄에서 $12 / 3 TB Lightsail 플랜을 쓰고 이번 달 2800 GB를 썼습니다. 이번 달 초과하나요? 트래픽 인스턴스를 몇 대 추가해야 하나요?", "일평균 속도로 월말을 예측하고 가장 저렴한 해결책을 찾습니다."], ["구성 선택", "새 프로젝트 배포 전에 검토.", "월 약 8 TB를 전송하는 앱이고 사용자는 주로 동남아시아에 있습니다. Lightsail에서 가장 저렴한 리전과 플랜 구성은?", "리전 단가, 한도 절반 리전, 플랜과 트래픽 인스턴스 조합을 비교합니다."], ["다음 달 계획", "월초에 인스턴스 수를 정하기.", "다음 달 프랑크푸르트 $7 / 2 TB 플랜으로 약 12000 GB를 예상합니다. 트래픽 인스턴스를 몇 대 두면 가장 저렴한가요?", "월 전체 계획 모드로 대수와 월 비용을 계산합니다."], ["청구서 해석", "청구서의 전송량 항목이 이해하기 어려움.", "AWS 청구서의 Lightsail 전송량 항목입니다: (붙여 넣기). 남은 한도는 얼마이고 요금이 나오나요?", "DataXfer-In/Out 항목을 합산하고 확인용 링크를 줍니다."], ["사용량 알림", "매일 점검해 초과 전에 알림.", "매일 아침 내 Lightsail 인스턴스의 네트워크 지표를 읽고, 이번 달 초과가 예상되면 알려 주세요.", "AWS CLI 또는 SDK로 NetworkIn/Out을 읽어 계산한 뒤 알려 줍니다."], ["자동 확장", "초과가 예상되면 트래픽 인스턴스를 자동 추가.", "초과가 예상되면 같은 리전에 같은 플랜의 IPv6 인스턴스를 추천 대수만큼 만들어 주세요. 만들기 전에 반드시 확인을 받으세요.", "추천 결과에 따라 Lightsail API로 인스턴스를 만듭니다."]], "scaleWarn": "자동 확장은 실제로 과금되는 인스턴스를 만듭니다. 필요한 권한만 주고, 생성 전 확인과 인스턴스 수 상한을 설정하세요.", "devIntro": "모든 파일은 정적이며 어느 출처에서나 읽을 수 있습니다. 서버 API도 키도 없습니다.", "files": ["에이전트용 안내: 규칙, 링크 매개변수, 결과 필드", "모든 리전의 가격과 한도", "계산 모듈(ES Module), 이 페이지와 같은 코드"], "copyUrl": "URL 복사", "codeH": "코드에서 호출", "copy": "복사", "paramsH": "미리 채운 링크 매개변수", "params": ["AWS 리전 코드(예: us-east-1)", "플랜(메모리 GB로 지정). $7 / 2 TB는 1", "이번 달 사용량 GB(수신 + 송신)", "예상 월말 총량 GB; 단독으로 쓰면 월 전체 계획", "트래픽 인스턴스: 대수@시작[~종료], UTC"], "more": "모든 매개변수와 결과 필드는 llms.txt에 있습니다. Node.js는 URL에서 바로 import할 수 없으니 calc.js를 내려받거나 저장소에서 복사하세요." },
      cT: "모든 데이터를 지울까요?",
      cB: "인스턴스, 사용량, 설정이 모두 기본값으로 돌아가며 되돌릴 수 없어요. 필요하면 먼저 고급 설정에서 백업을 내보내세요.",
      cancel: "취소",
      clear: "지우기",
      rules: "요금 규칙 요약",
      r: [
        "인바운드와 아웃바운드 <b>모두 한도에서 차감</b>돼요",
        "초과 요금은 <b>아웃바운드에만</b> 붙고, 인바운드는 항상 무료예요",
        "같은 리전·<b>같은 플랜</b>만 한도를 합칠 수 있어요. 같은 플랜이면 듀얼 스택과 IPv6-only도 합쳐져요",
        "시간 단위 과금이에요. <b>중지해도 요금이 나가고</b>, 삭제해야 멈춰요",
        "이미 생긴 초과는 <b>나중에 추가해도 상쇄되지 않아요</b>. 한도를 다 쓰기 전에 추가하세요",
        "삭제 후 다시 만들어도 이번 달 사용량은 <b>초기화되지 않아요</b>",
        "같은 리전 안의 <b>프라이빗 IP</b> 트래픽은 한도에서 차감되지만 초과해도 무료예요",
        "1 TB = 1024 GB, UTC 달력 월 기준 추정이에요. 최종 금액은 AWS 청구서를 확인하세요"
      ],
      helpQ: ["인바운드도 한도에서 빠지나요?", "인바운드에 요금이 붙나요?", "초과 요금은 얼마인가요?", "어떤 인스턴스가 한도를 함께 쓰나요?", "중지한 인스턴스도 요금이 나가나요?", "인스턴스를 더하면 이미 생긴 초과가 사라지나요?", "다시 만들면 사용량이 초기화되나요?", "프라이빗 IP 트래픽은 유료인가요?", "추정은 얼마나 정확한가요?", "AWS 공식 링크"],
      overA: "리전마다 달라요. 풀을 넘은 아웃바운드는 <b>GB당 {lo}–{hi}</b>이고, 계산기는 선택한 리전의 요금을 써요.",
      links: ["요금", "데이터 전송 FAQ", "청구 FAQ", "서비스 약관", "청구 사용량 보기"],
      foot: "가격 확인 {d} · AWS 공식 도구 아님",
      allowLbl: "한도 {v}",
      rpBtn: "결과가 다른가요?",
      rpPre: "계산 결과가 다릅니다:",
      rpRegion: "리전",
      rpPrice: "가격 확인"
    },
    es: {
      seoTitle: "Calculadora de transferencia de AWS Lightsail: prevé el exceso y ahorra",
      ogSub: "¿Te pasarás de la cuota este mes? ¿Cuántas instancias te conviene añadir?",
      name: "Calculadora de ahorro AWS Lightsail",
      tagline: "Las instancias de Lightsail con el mismo plan y en la misma región comparten la cuota de transferencia. Descubre si te pasarás este mes y cuántas instancias baratas añadir para evitarlo.",
      region: "Región (las cuotas solo se suman dentro de una región)",
      lang: "Idioma",
      over: "exceso",
      half: "cuota a la mitad",
      settings: "Ajustes avanzados",
      outRatio: "Proporción saliente",
      outRatioHint: "El exceso solo se cobra sobre el tráfico de salida (lo que envían tus servidores). Si no estás seguro, déjalo en 100 %.",
      prorate: "Prorratear la cuota de las instancias creadas a mitad de mes",
      exp: "Exportar copia",
      imp: "Importar copia",
      sample: "Cargar ejemplo",
      reset: "Restablecer todo",
      resetHold: "Mantén pulsado 1 s para confirmar",
      copyLink: "Copiar enlace de configuración",
      copied: "Copiado",
      linkLoaded: "Se cargó la configuración del enlace. Tus datos anteriores están guardados y puedes recuperarlos.",
      undo: "Restaurar mis datos",
      gh: "Ver el código en GitHub",
      theme: "Tema",
      th_system: "Sistema",
      th_light: "Claro",
      th_dark: "Oscuro",
      close: "Cerrar",
      qPrev: "Anterior",
      qNext: "Siguiente",
      roll: "Nuevo mes ({m}). ¿Borrar el uso del mes pasado? Tu instancia principal y las instancias de tráfico activas se mantienen.",
      rollBtn: "Empezar mes nuevo",
      usedUnit: "GB usados",
      usedAria: "Datos usados este mes",
      recorded: "Anotado {t} · {v}/día",
      toBill: "Abrir facturas",
      allow: "Cuota",
      remain: "Restante",
      exceeded: "Excedido",
      forecast: "Previsión a fin de mes",
      forecastTip: "Déjalo vacío para estimarlo con la media diaria, o escribe el total mensual que esperas (GB)",
      fcErr: "No puede ser menor que lo ya usado ({v})",
      endErr: "La eliminación debe ser posterior a la creación",
      localTime: "hora local",
      utcNote: "AWS factura por mes natural en UTC. Este mes empezó el {t} en tu hora local",
      cost: "Costo estimado de este mes",
      inclOver: "incl. {v} de exceso",
      bandGood: "Todo bien · dentro de la cuota",
      bandWarn: "Exceso previsto · unos {v} extra",
      bandBad: "Cuota superada · unos {v} extra",
      bandIdle: "Escribe tu uso para empezar",
      lgUsed: "Usado {v}",
      lgEnd: "Fin de mes {v}",
      lgOver: "Exceso {v}",
      fill: "Primero, escribe el uso de este mes",
      fillHint: "En {a}AWS Bills → Lightsail{/a}, suma las líneas {in} y {out}.",
      enough: "La cuota alcanza. No hace falta añadir instancias",
      leftEnd: "Quedarán {v} a fin de mes",
      suggest: "Añade {n} instancia(s) de tráfico",
      apply: "Añadir",
      from: "{spec}, desde {t}",
      saveV: "ahorra {v} frente a no añadir ninguna",
      exPred: "la cuota se agota el {t}",
      exPast: "la cuota se agotó el {t}",
      noAdd: "No añadir es más barato",
      planMode: "Plan de mes completo",
      planNote: "Cada instancia de tráfico: +{a} de cuota · {c}/mes",
      optimal: "Ya es la configuración más barata. El exceso restante no se puede evitar.",
      optNone: "Ninguna",
      optN: "+{n}",
      barTip: "Instancias {a} · Exceso {o}",
      locked: "Los {v} que ya superaste no se compensan con instancias nuevas, así que están incluidos.",
      next: "Próximo mes",
      nextLine: "Al ritmo de este mes ({v}), usa {cfg}: unos {c}/mes",
      cfgBase: "solo tu instancia principal",
      cfgPlus: "tu instancia principal + {n} de tráfico",
      fleet: "Resumen de instancias",
      fleetSum: "{n} · {c}",
      m2c: "Mide antes tu latencia a cada región de AWS",
      xcost: "Compara tarifas de transferencia y coste total entre nubes",
      base: "Instancia principal",
      baseHint: "La instancia que ya tienes. Las instancias de tráfico deben usar el mismo plan para sumar sus cuotas.",
      best: "Mejor",
      v4: "Necesita IPv4 pública",
      dual: "Doble pila",
      start: "Creada",
      nodes: "Instancias de tráfico",
      share: "Las instancias con el mismo plan en la misma región comparten una sola cuota. Las de tráfico son solo IPv6 (IPv6-only), más baratas que con IPv4 pública.",
      nodeAdd: "Añade 1 ahora: +{a} de cuota · {c} (prorrateado hasta fin de mes)",
      add: "Añadir instancia de tráfico",
      nStart: "Creada",
      nEnd: "Eliminada (vacío si sigue activa)",
      planned: "Prevista",
      gone: "Eliminada",
      dec: "Restar",
      inc: "Sumar",
      count: "Cantidad",
      del: "Quitar",
      seoDesc: "Calculadora gratuita de transferencia de datos de AWS Lightsail. Las instancias con el mismo plan en una región comparten la cuota. Escribe el uso de este mes y verás cuánto te queda, si pagarás exceso y cuántas instancias IPv6 añadir para pagar lo mínimo.",
      seoKw: "AWS Lightsail, transferencia de datos Lightsail, exceso Lightsail, calculadora, precios Lightsail, instancia IPv6, VPS",
      agent: "Usar con IA",
      secCalc: "Cálculo",
      secData: "Datos",
      ag: { "title": "Úsalo con un agente de IA", "sub": "Tu agente lee una guía breve, hace las cuentas por ti y te devuelve un enlace para comprobarlas aquí.", "close": "Cerrar", "tabs": ["Inicio rápido", "Casos de uso", "Desarrolladores"], "s1": "Copia este prompt", "prompt": "Lee primero {url} y usa sus reglas de facturación de Lightsail para calcular mi pool de transferencia de datos.\nMi configuración: región ___, plan ___ (p. ej. $7 / 2 TB de transferencia), ___ GB usados este mes (a fecha de ___).\nDime si me pasaré este mes y cuántas instancias de tráfico añadir para pagar lo mínimo, y dame un enlace de la calculadora ya rellenado para comprobarlo.", "copyPrompt": "Copiar prompt", "s2": "Pégalo en un agente con acceso a la web", "s2n": "Sirven ChatGPT, Claude, Gemini, Cursor y similares. Completa los huecos o pega las líneas de transferencia de tu factura.", "s3": "Abre el enlace que te devuelve", "s3n": "El enlace carga la configuración aquí para que compruebes los números. Tus datos actuales se guardan antes y puedes restaurarlos.", "privacy": "Esta página no sube nada. Los enlaces de configuración incluyen tus cifras de uso: revísalos antes de compartirlos.", "casesIntro": "Copia una pregunta, cambia los números y envíala a tu agente. Todas incluyen ya la dirección de la guía.", "does": "El agente: ", "copyQ": "Copiar pregunta", "ref": " (Reglas y método: {url})", "perm": { "none": "Sin permisos", "ro": "AWS solo lectura", "rw": "AWS escritura · genera costes" }, "cases": [["¿Me pasaré?", "A mitad de mes, saber si el pool aguanta.", "Tengo el plan Lightsail de $12 / 3 TB en Tokio y llevo 2800 GB este mes. ¿Me pasaré? ¿Cuántas instancias de tráfico debo añadir?", "proyecta el fin de mes con el ritmo diario y busca la solución más barata."], ["Elegir configuración", "Planificar un proyecto nuevo antes de desplegar.", "Mi app moverá unos 8 TB al mes, sobre todo a usuarios del sudeste asiático. ¿Qué región y plan de Lightsail sale más barato?", "compara precios por región, regiones con media asignación y combinaciones de plan e instancias de tráfico."], ["Planificar el mes", "Dimensionar la flota a principio de mes.", "El mes que viene espero unos 12 000 GB en Fráncfort con el plan de $7 / 2 TB. ¿Cuántas instancias de tráfico minimizan el coste?", "hace un plan de mes completo y devuelve el número y el coste mensual."], ["Entender la factura", "Las líneas de transferencia de la factura cuestan de leer.", "Estas son las líneas de transferencia de Lightsail de mi factura de AWS: (pegar). ¿Cuánta asignación me queda y me cobrarán?", "suma los conceptos DataXfer-In/Out y te da un enlace para verificar."], ["Alertas de uso", "Una comprobación diaria que avisa antes del exceso.", "Cada mañana, lee las métricas de red de mis instancias Lightsail y avísame si este mes va camino de pasarse.", "lee NetworkIn/Out con la CLI o el SDK de AWS, hace el cálculo y te avisa."], ["Escalado automático", "Añadir instancias de tráfico solas cuando se acerca el exceso.", "Si se prevé exceso, crea en la misma región el número recomendado de instancias solo IPv6 de mi plan. Pídeme confirmación antes de crear nada.", "usa la recomendación para llamar a la API de Lightsail y crear instancias."]], "scaleWarn": "El escalado automático crea instancias reales que se facturan. Da al agente solo los permisos necesarios, exige confirmación y fija un máximo de instancias.", "devIntro": "Todo es estático y se puede leer desde cualquier origen. No hay API de servidor ni clave.", "files": ["Guía para agentes: reglas, parámetros del enlace, campos del resultado", "Precios y asignaciones de todas las regiones", "El módulo de cálculo (ES module), el mismo código que esta página"], "copyUrl": "Copiar URL", "codeH": "Llamarlo desde código", "copy": "Copiar", "paramsH": "Parámetros del enlace prellenado", "params": ["Código de región de AWS, p. ej. us-east-1", "Plan, identificado por su RAM en GB; $7 / 2 TB es 1", "GB usados este mes (entrada + salida)", "Total previsto a fin de mes en GB; solo, planifica el mes completo", "Instancias de tráfico: cantidad@inicio[~fin], UTC"], "more": "Todos los parámetros y campos del resultado están en llms.txt. Node.js no puede importar desde una URL: descarga calc.js o cópialo del repositorio." },
      cT: "¿Borrar todos los datos?",
      cB: "Las instancias, el uso y los ajustes vuelven a sus valores iniciales, y no se puede deshacer. Si lo necesitas, exporta antes una copia en Ajustes avanzados.",
      cancel: "Cancelar",
      clear: "Borrar",
      rules: "Reglas de facturación",
      r: [
        "El tráfico de entrada y el de salida <b>cuentan para la cuota</b>",
        "El exceso <b>solo se cobra sobre la salida</b>; la entrada siempre es gratis",
        "Solo comparten cuota las instancias de la misma región y el <b>mismo plan</b>; las versiones de doble pila e IPv6-only de un mismo plan se suman",
        "Se cobra por hora. <b>Una instancia detenida sigue cobrando</b>; solo deja de hacerlo al eliminarla",
        "El exceso ya generado <b>no se compensa</b> con instancias nuevas: añádelas antes de agotar la cuota",
        "Eliminar y volver a crear una instancia <b>no reinicia</b> el uso del mes",
        "El tráfico por <b>IP privada</b> dentro de una región cuenta para la cuota, pero nunca se cobra",
        "Se calcula con 1 TB = 1024 GB y meses naturales en UTC. Las cifras finales son las de tu factura de AWS"
      ],
      helpQ: ["¿El tráfico de entrada cuenta para la cuota?", "¿Se cobra alguna vez el tráfico de entrada?", "¿Cuánto cuesta el exceso?", "¿Qué instancias comparten cuota?", "¿Una instancia detenida sigue cobrando?", "¿Añadir instancias anula el exceso?", "¿Recrear una instancia reinicia el uso?", "¿Se cobra el tráfico por IP privada?", "¿Qué tan precisas son las estimaciones?", "Enlaces oficiales de AWS"],
      overA: "Depende de la región: <b>{lo}–{hi} por GB</b> de salida por encima de la cuota. La calculadora usa la tarifa de la región que elegiste.",
      links: ["Precios", "FAQ de transferencia", "FAQ de facturación", "Términos del servicio", "Ver uso en la factura"],
      foot: "Precios revisados {d} · No es una herramienta oficial de AWS",
      allowLbl: "Cuota {v}",
      rpBtn: "¿El resultado no cuadra?",
      rpPre: "El resultado no cuadra:",
      rpRegion: "Región",
      rpPrice: "Precios verificados"
    },
    fr: {
      seoTitle: "Calculateur de transfert AWS Lightsail : anticipez le dépassement et payez moins",
      ogSub: "Allez-vous dépasser votre quota ce mois-ci ? Combien d’instances ajouter ?",
      name: "Calculateur d’économies AWS Lightsail",
      tagline: "Les instances Lightsail du même forfait dans la même région partagent un quota de transfert. Voyez si vous allez le dépasser ce mois-ci et combien d’instances bon marché ajouter pour l’éviter.",
      region: "Région (les quotas ne se cumulent qu’au sein d’une région)",
      lang: "Langue",
      over: "dépassement",
      half: "quota divisé par deux",
      settings: "Réglages avancés",
      outRatio: "Part sortante",
      outRatioHint: "Le dépassement n’est facturé que sur le trafic sortant (ce que vos serveurs envoient). Dans le doute, laissez 100 %.",
      prorate: "Calculer au prorata le quota des instances créées en cours de mois",
      exp: "Exporter",
      imp: "Importer",
      sample: "Charger un exemple",
      reset: "Tout réinitialiser",
      resetHold: "Maintenez 1 s pour confirmer",
      copyLink: "Copier le lien de configuration",
      copied: "Copié",
      linkLoaded: "Configuration chargée depuis le lien. Vos données précédentes sont sauvegardées et peuvent être restaurées.",
      undo: "Restaurer mes données",
      gh: "Voir le code sur GitHub",
      theme: "Thème",
      th_system: "Système",
      th_light: "Clair",
      th_dark: "Sombre",
      close: "Fermer",
      qPrev: "Précédent",
      qNext: "Suivant",
      roll: "Nouveau mois ({m}). Effacer la consommation du mois dernier ? Votre instance principale et les instances de trafic actives sont conservées.",
      rollBtn: "Nouveau mois",
      usedUnit: "Go utilisés",
      usedAria: "Données utilisées ce mois",
      recorded: "Saisi le {t} · {v}/jour",
      toBill: "Ouvrir les factures",
      allow: "Quota",
      remain: "Restant",
      exceeded: "Dépassé de",
      forecast: "Prévision fin de mois",
      forecastTip: "Laissez vide pour une estimation à partir de la moyenne journalière, ou saisissez le total mensuel attendu (GB)",
      fcErr: "Ne peut pas être inférieur à la consommation actuelle ({v})",
      endErr: "La suppression doit être postérieure à la création",
      localTime: "heure locale",
      utcNote: "AWS facture par mois calendaire en UTC. Ce mois a commencé le {t}, heure locale",
      cost: "Coût estimé ce mois-ci",
      inclOver: "dont {v} de dépassement",
      bandGood: "Tout va bien · quota suffisant",
      bandWarn: "Dépassement prévu · environ {v} en plus",
      bandBad: "Quota dépassé · environ {v} en plus",
      bandIdle: "Saisissez votre consommation",
      lgUsed: "Utilisé {v}",
      lgEnd: "Fin de mois {v}",
      lgOver: "Dépassement {v}",
      fill: "Commencez par la consommation de ce mois",
      fillHint: "Dans {a}AWS Bills → Lightsail{/a}, additionnez les lignes {in} et {out}.",
      enough: "Le quota suffit. Inutile d’ajouter des instances",
      leftEnd: "{v} restants en fin de mois",
      suggest: "Ajoutez {n} instance(s) de trafic",
      apply: "Ajouter",
      from: "{spec}, dès le {t}",
      saveV: "{v} d’économie par rapport à aucun ajout",
      exPred: "quota épuisé le {t}",
      exPast: "quota épuisé depuis le {t}",
      noAdd: "Ne rien ajouter coûte moins",
      planMode: "Plan sur le mois entier",
      planNote: "Chaque instance de trafic : +{a} de quota · {c}/mois",
      optimal: "C’est déjà la configuration la moins chère. Le dépassement restant est inévitable.",
      optNone: "Aucune",
      optN: "+{n}",
      barTip: "Instances {a} · Dépassement {o}",
      locked: "Les {v} déjà dépassés ne peuvent pas être compensés par de nouvelles instances ; ils sont inclus.",
      next: "Mois prochain",
      nextLine: "Au rythme de ce mois ({v}), prévoyez {cfg}, environ {c}/mois",
      cfgBase: "votre instance principale seule",
      cfgPlus: "votre instance principale + {n} de trafic",
      fleet: "Vue des instances",
      fleetSum: "{n} · {c}",
      m2c: "Mesurez d’abord votre latence vers chaque région AWS",
      xcost: "Comparez frais de transfert et coût total entre clouds",
      base: "Instance principale",
      baseHint: "L’instance que vous avez déjà. Les instances de trafic doivent avoir le même forfait pour que leurs quotas se cumulent.",
      best: "Optimal",
      v4: "IPv4 publique requise",
      dual: "Double pile",
      start: "Créée le",
      nodes: "Instances de trafic",
      share: "Les instances du même forfait dans la même région partagent un seul quota. Les instances de trafic sont en IPv6 uniquement (IPv6-only), moins chères qu’avec une IPv4 publique.",
      nodeAdd: "En ajouter 1 maintenant : +{a} de quota · {c} (au prorata jusqu’à la fin du mois)",
      add: "Ajouter une instance de trafic",
      nStart: "Créée",
      nEnd: "Supprimée (vide si active)",
      planned: "Prévue",
      gone: "Supprimée",
      dec: "Moins",
      inc: "Plus",
      count: "Nombre",
      del: "Retirer",
      seoDesc: "Calculateur gratuit du transfert de données AWS Lightsail. Les instances du même forfait dans une région partagent un quota. Saisissez votre consommation du mois pour voir ce qui reste, si vous paierez un dépassement et combien d’instances IPv6 ajouter pour payer le moins possible.",
      seoKw: "AWS Lightsail, transfert de données Lightsail, dépassement Lightsail, calculateur, tarifs Lightsail, instance IPv6, VPS",
      agent: "Utiliser avec l’IA",
      secCalc: "Calcul",
      secData: "Données",
      ag: { "title": "L’utiliser avec un agent IA", "sub": "Votre agent lit un court guide, fait le calcul et vous renvoie un lien à vérifier ici.", "close": "Fermer", "tabs": ["Démarrage", "Cas d’usage", "Développeurs"], "s1": "Copiez ce prompt", "prompt": "Lis d’abord {url}, puis applique ses règles de facturation Lightsail pour calculer mon pool de transfert de données.\nMa configuration : région ___, forfait ___ (ex. 7 $ / 2 To de transfert), ___ Go utilisés ce mois-ci (au ___).\nDis-moi si je vais dépasser ce mois-ci et combien d’instances de trafic ajouter au moindre coût, et donne-moi un lien de calculatrice pré-rempli pour vérifier.", "copyPrompt": "Copier le prompt", "s2": "Collez-le dans un agent qui accède au web", "s2n": "ChatGPT, Claude, Gemini, Cursor et équivalents conviennent. Remplissez les blancs ou collez les lignes de transfert de votre facture.", "s3": "Ouvrez le lien qu’il renvoie", "s3n": "Le lien charge la configuration ici pour vérifier les chiffres. Vos données actuelles sont d’abord sauvegardées et restaurables.", "privacy": "Cette page n’envoie rien. Les liens de configuration contiennent vos chiffres d’usage : vérifiez avant de les partager.", "casesIntro": "Copiez une question, changez les chiffres et envoyez-la à votre agent. Chacune indique déjà l’adresse du guide.", "does": "L’agent : ", "copyQ": "Copier la question", "ref": " (Règles et méthode : {url})", "perm": { "none": "Aucun accès requis", "ro": "AWS lecture seule", "rw": "AWS écriture · payant" }, "cases": [["Vais-je dépasser ?", "En milieu de mois, savoir si le pool tiendra.", "J’ai le forfait Lightsail à 12 $ / 3 To à Tokyo et j’ai utilisé 2800 Go ce mois-ci. Vais-je dépasser ? Combien d’instances de trafic ajouter ?", "projette la fin du mois au rythme quotidien et trouve la solution la moins chère."], ["Choisir une config", "Préparer un nouveau projet avant le déploiement.", "Mon app enverra environ 8 To par mois, surtout vers l’Asie du Sud-Est. Quelle région et quel forfait Lightsail coûtent le moins ?", "compare les prix par région, les régions à quota réduit de moitié et les combinaisons forfait + instances de trafic."], ["Planifier le mois", "Dimensionner la flotte en début de mois.", "Le mois prochain, je prévois environ 12 000 Go à Francfort avec le forfait à 7 $ / 2 To. Combien d’instances de trafic pour le coût le plus bas ?", "fait un plan sur le mois entier et renvoie le nombre et le coût mensuel."], ["Lire ma facture", "Les lignes de transfert de la facture sont peu lisibles.", "Voici les lignes de transfert Lightsail de ma facture AWS : (coller). Combien de quota me reste-t-il et serai-je facturé ?", "additionne les postes DataXfer-In/Out et vous donne un lien de vérification."], ["Alertes d’usage", "Un contrôle quotidien qui prévient avant le dépassement.", "Chaque matin, lis les métriques réseau de mes instances Lightsail et préviens-moi si ce mois-ci s’oriente vers un dépassement.", "lit NetworkIn/Out via l’AWS CLI ou le SDK, fait le calcul et vous prévient."], ["Montée en charge auto", "Ajouter des instances de trafic automatiquement avant un dépassement.", "Si un dépassement est prévu, crée dans la même région le nombre recommandé d’instances IPv6 seulement de mon forfait. Demande-moi confirmation avant toute création.", "s’appuie sur la recommandation pour appeler l’API Lightsail et créer les instances."]], "scaleWarn": "La montée en charge auto crée de vraies instances facturées. Donnez à l’agent le strict nécessaire, exigez une confirmation et plafonnez le nombre d’instances.", "devIntro": "Tout est statique et lisible depuis n’importe quelle origine. Pas d’API serveur, pas de clé.", "files": ["Guide pour agents : règles, paramètres de lien, champs du résultat", "Prix et quotas de chaque région", "Le module de calcul (module ES), le même code que cette page"], "copyUrl": "Copier l’URL", "codeH": "L’appeler depuis du code", "copy": "Copier", "paramsH": "Paramètres du lien pré-rempli", "params": ["Code de région AWS, ex. us-east-1", "Forfait, identifié par sa RAM en Go ; 7 $ / 2 To vaut 1", "Go utilisés ce mois-ci (entrant + sortant)", "Total prévu en fin de mois en Go ; seul, planifie le mois entier", "Instances de trafic : nombre@début[~fin], UTC"], "more": "Tous les paramètres et champs du résultat sont dans llms.txt. Node.js ne peut pas importer depuis une URL : téléchargez calc.js ou copiez-le depuis le dépôt." },
      cT: "Effacer toutes les données ?",
      cB: "Les instances, la consommation et les réglages reviennent aux valeurs par défaut, sans retour possible. Exportez d’abord une sauvegarde dans les Réglages avancés si besoin.",
      cancel: "Annuler",
      clear: "Effacer",
      rules: "Règles de facturation",
      r: [
        "Le trafic entrant et sortant <b>compte dans le quota</b>",
        "Le dépassement est <b>facturé sur le sortant uniquement</b> ; l’entrant est toujours gratuit",
        "Seules les instances de la même région et du <b>même forfait</b> partagent un quota ; les versions double pile et IPv6-only d’un même forfait se cumulent",
        "Facturation à l’heure. <b>Une instance arrêtée reste facturée</b> ; seule la suppression arrête la facturation",
        "Un dépassement déjà constaté <b>ne peut pas être compensé</b> par de nouvelles instances : ajoutez-les avant d’épuiser le quota",
        "Supprimer puis recréer une instance <b>ne remet pas à zéro</b> la consommation du mois",
        "Le trafic par <b>IP privée</b> dans une région compte dans le quota mais n’est jamais facturé",
        "Estimations sur la base de 1 TB = 1024 GB et de mois calendaires en UTC. Votre facture AWS fait foi"
      ],
      helpQ: ["Le trafic entrant compte-t-il dans le quota ?", "Le trafic entrant est-il facturé ?", "Combien coûte le dépassement ?", "Quelles instances partagent un quota ?", "Une instance arrêtée est-elle facturée ?", "Ajouter des instances annule-t-il un dépassement ?", "Recréer une instance remet-elle la consommation à zéro ?", "Le trafic par IP privée est-il facturé ?", "Les estimations sont-elles fiables ?", "Liens officiels AWS"],
      overA: "Cela dépend de la région : <b>{lo}–{hi} par GB</b> de trafic sortant au-delà du quota. Le calculateur utilise le tarif de la région choisie.",
      links: ["Tarifs", "FAQ transfert", "FAQ facturation", "Conditions de service", "Voir l’usage facturé"],
      foot: "Tarifs vérifiés {d} · Outil non officiel AWS",
      allowLbl: "Quota {v}",
      rpBtn: "Résultat faux ?",
      rpPre: "Le résultat est faux :",
      rpRegion: "Région",
      rpPrice: "Prix vérifiés"
    },
    de: {
      seoTitle: "AWS Lightsail Traffic-Rechner: Mehrkosten vorhersagen und sparen",
      ogSub: "Reicht dein Traffic-Kontingent diesen Monat? Wie viele Instanzen lohnen sich?",
      name: "AWS Lightsail Sparrechner",
      tagline: "Lightsail-Instanzen mit demselben Tarif in derselben Region teilen sich ein Traffic-Kontingent. Sieh, ob du es diesen Monat überschreitest und wie viele günstige Instanzen das verhindern.",
      region: "Region (Kontingente werden nur innerhalb einer Region zusammengelegt)",
      lang: "Sprache",
      over: "Überschreitung",
      half: "halbes Kontingent",
      settings: "Erweiterte Einstellungen",
      outRatio: "Ausgehender Anteil",
      outRatioHint: "Mehrkosten fallen nur für ausgehenden Traffic an (was deine Server senden). Im Zweifel 100 % lassen.",
      prorate: "Kontingent von Instanzen, die im Laufe des Monats erstellt wurden, anteilig rechnen",
      exp: "Backup exportieren",
      imp: "Backup importieren",
      sample: "Beispiel laden",
      reset: "Alle Daten zurücksetzen",
      resetHold: "1 s gedrückt halten zum Bestätigen",
      copyLink: "Konfigurationslink kopieren",
      copied: "Kopiert",
      linkLoaded: "Einstellungen aus dem Link geladen. Deine bisherigen Daten sind gesichert und lassen sich wiederherstellen.",
      undo: "Meine Daten wiederherstellen",
      gh: "Quellcode auf GitHub ansehen",
      theme: "Design",
      th_system: "System",
      th_light: "Hell",
      th_dark: "Dunkel",
      close: "Schließen",
      qPrev: "Zurück",
      qNext: "Weiter",
      roll: "Neuer Monat ({m}). Verbrauch vom Vormonat zurücksetzen? Deine Hauptinstanz und laufende Traffic-Instanzen bleiben.",
      rollBtn: "Neuen Monat starten",
      usedUnit: "GB genutzt",
      usedAria: "Verbrauch in diesem Monat",
      recorded: "Eingetragen {t} · {v}/Tag",
      toBill: "Rechnungen öffnen",
      allow: "Kontingent",
      remain: "Übrig",
      exceeded: "Überschritten um",
      forecast: "Prognose Monatsende",
      forecastTip: "Leer lassen, um aus dem Tagesdurchschnitt hochzurechnen, oder die erwartete Monatssumme (GB) eintragen",
      fcErr: "Darf nicht unter dem bisherigen Verbrauch liegen ({v})",
      endErr: "Löschzeitpunkt muss nach dem Erstellen liegen",
      localTime: "Ortszeit",
      utcNote: "AWS rechnet nach Kalendermonat in UTC ab. Dieser Monat begann bei dir um {t}",
      cost: "Geschätzte Kosten diesen Monat",
      inclOver: "inkl. {v} Überschreitung",
      bandGood: "Alles gut · Kontingent reicht",
      bandWarn: "Mehrkosten erwartet · ca. {v}",
      bandBad: "Kontingent überschritten · ca. {v} extra",
      bandIdle: "Verbrauch eintragen",
      lgUsed: "Genutzt {v}",
      lgEnd: "Monatsende {v}",
      lgOver: "Überschreitung {v}",
      fill: "Trag zuerst den Verbrauch dieses Monats ein",
      fillHint: "Addiere in {a}AWS Bills → Lightsail{/a} die Posten {in} und {out}.",
      enough: "Das Kontingent reicht. Keine zusätzlichen Instanzen nötig",
      leftEnd: "{v} übrig am Monatsende",
      suggest: "{n} Traffic-Instanz(en) hinzufügen",
      apply: "Hinzufügen",
      from: "{spec}, ab {t}",
      saveV: "spart {v} gegenüber keiner zusätzlichen",
      exPred: "Kontingent voraussichtlich am {t} aufgebraucht",
      exPast: "Kontingent seit {t} aufgebraucht",
      noAdd: "Keine hinzuzufügen ist günstiger",
      planMode: "Planung für den ganzen Monat",
      planNote: "Jede Traffic-Instanz: +{a} Kontingent · {c}/Monat",
      optimal: "Das ist schon die günstigste Konfiguration. Die restlichen Mehrkosten lassen sich nicht vermeiden.",
      optNone: "Keine",
      optN: "+{n}",
      barTip: "Instanzen {a} · Überschreitung {o}",
      locked: "Die bereits überschrittenen {v} lassen sich mit neuen Instanzen nicht ausgleichen und sind eingerechnet.",
      next: "Nächster Monat",
      nextLine: "Beim Tempo dieses Monats ({v}): {cfg}, ca. {c}/Monat",
      cfgBase: "nur deine Hauptinstanz",
      cfgPlus: "Hauptinstanz + {n} Traffic-Instanz(en)",
      fleet: "Instanzübersicht",
      fleetSum: "{n} · {c}",
      m2c: "Zuerst deine Latenz zu jeder AWS-Region messen",
      xcost: "Transfergebühren und Gesamtkosten der Clouds vergleichen",
      base: "Hauptinstanz",
      baseHint: "Die Instanz, die du schon betreibst. Traffic-Instanzen brauchen denselben Tarif, damit sich die Kontingente addieren.",
      best: "Günstigste",
      v4: "Öffentliche IPv4 nötig",
      dual: "Dual-Stack",
      start: "Erstellt",
      nodes: "Traffic-Instanzen",
      share: "Instanzen mit demselben Tarif in derselben Region teilen sich ein Kontingent. Traffic-Instanzen laufen nur mit IPv6 (IPv6-only) und kosten weniger als mit öffentlicher IPv4.",
      nodeAdd: "Jetzt 1 hinzufügen: +{a} Kontingent · {c} (anteilig bis Monatsende)",
      add: "Traffic-Instanz hinzufügen",
      nStart: "Erstellt",
      nEnd: "Gelöscht (leer, wenn sie läuft)",
      planned: "Geplant",
      gone: "Gelöscht",
      dec: "Weniger",
      inc: "Mehr",
      count: "Anzahl",
      del: "Entfernen",
      seoDesc: "Kostenloser Traffic-Rechner für AWS Lightsail. Instanzen mit demselben Tarif in einer Region teilen sich ein Traffic-Kontingent. Trag den Verbrauch dieses Monats ein und sieh, was übrig bleibt, ob Mehrkosten drohen und wie viele IPv6-Instanzen am günstigsten sind.",
      seoKw: "AWS Lightsail, Lightsail Datentransfer, Lightsail Überziehung, Rechner, Lightsail Preise, IPv6-Instanz, VPS",
      agent: "Mit KI nutzen",
      secCalc: "Berechnung",
      secData: "Daten",
      ag: { "title": "Mit einem KI-Agenten nutzen", "sub": "Ihr Agent liest eine kurze Anleitung, rechnet für Sie und gibt einen Link zurück, den Sie hier prüfen können.", "close": "Schließen", "tabs": ["Schnellstart", "Anwendungsfälle", "Entwickler"], "s1": "Diesen Prompt kopieren", "prompt": "Lies zuerst {url} und berechne mit den dortigen Lightsail-Abrechnungsregeln meinen Datentransfer-Pool.\nMein Setup: Region ___, Paket ___ (z. B. $7 / 2 TB Transfer), diesen Monat ___ GB verbraucht (Stand ___).\nSag mir, ob ich diesen Monat überziehe und wie viele Traffic-Instanzen ich am günstigsten hinzufüge, und gib mir einen vorausgefüllten Rechner-Link zum Prüfen.", "copyPrompt": "Prompt kopieren", "s2": "In einen Agenten mit Webzugriff einfügen", "s2n": "ChatGPT, Claude, Gemini, Cursor und ähnliche funktionieren. Füllen Sie die Lücken aus oder fügen Sie die Transferzeilen Ihrer Rechnung ein.", "s3": "Den zurückgegebenen Link öffnen", "s3n": "Der Link lädt das Setup hier, damit Sie die Zahlen prüfen können. Ihre bisherigen Daten werden vorher gesichert und lassen sich wiederherstellen.", "privacy": "Diese Seite lädt nichts hoch. Konfigurationslinks enthalten Ihre Verbrauchszahlen – prüfen Sie sie vor dem Teilen.", "casesIntro": "Frage kopieren, Zahlen anpassen und an den Agenten senden. Jede Frage enthält bereits die Adresse der Anleitung.", "does": "Der Agent: ", "copyQ": "Frage kopieren", "ref": " (Regeln und Methode: {url})", "perm": { "none": "Kein Zugriff nötig", "ro": "AWS nur lesen", "rw": "AWS schreiben · kostet Geld" }, "cases": [["Überziehe ich?", "Zur Monatsmitte prüfen, ob der Pool reicht.", "Ich nutze das Lightsail-Paket für $12 / 3 TB in Tokio und habe diesen Monat 2800 GB verbraucht. Überziehe ich? Wie viele Traffic-Instanzen sollte ich hinzufügen?", "hochrechnet das Monatsende aus dem Tagesschnitt und findet die günstigste Lösung."], ["Setup wählen", "Ein neues Projekt vor dem Deployment planen.", "Meine App überträgt etwa 8 TB im Monat, vor allem nach Südostasien. Welche Lightsail-Region und welches Paket sind am günstigsten?", "vergleicht Regionspreise, Regionen mit halbem Kontingent und Kombinationen aus Paket und Traffic-Instanzen."], ["Nächsten Monat planen", "Die Flotte zu Monatsbeginn dimensionieren.", "Nächsten Monat erwarte ich etwa 12.000 GB in Frankfurt mit dem Paket für $7 / 2 TB. Wie viele Traffic-Instanzen sind am günstigsten?", "rechnet einen ganzen Monat durch und liefert Anzahl und Monatskosten."], ["Rechnung verstehen", "Die Transferzeilen der Rechnung sind schwer zu lesen.", "Hier die Lightsail-Transferzeilen meiner AWS-Rechnung: (einfügen). Wie viel Kontingent bleibt, und wird mir etwas berechnet?", "summiert die Posten DataXfer-In/Out und gibt Ihnen einen Prüf-Link."], ["Verbrauchswarnung", "Eine tägliche Prüfung, die vor dem Überziehen warnt.", "Lies jeden Morgen die Netzwerkmetriken meiner Lightsail-Instanzen und warne mich, wenn dieser Monat auf eine Überziehung zuläuft.", "liest NetworkIn/Out per AWS CLI oder SDK, rechnet und benachrichtigt Sie."], ["Auto-Skalierung", "Traffic-Instanzen automatisch hinzufügen, wenn eine Überziehung droht.", "Wenn eine Überziehung erwartet wird, erstelle in derselben Region die empfohlene Anzahl reiner IPv6-Instanzen meines Pakets. Frag mich vor jeder Erstellung um Bestätigung.", "ruft anhand der Empfehlung die Lightsail-API auf und erstellt Instanzen."]], "scaleWarn": "Erstellt echte, kostenpflichtige Instanzen: nur nötige Rechte vergeben, Bestätigung verlangen, Anzahl begrenzen.", "devIntro": "Alles ist statisch und von jedem Origin lesbar. Es gibt keine Server-API und keinen Schlüssel.", "files": ["Anleitung für Agenten: Regeln, Link-Parameter, Ergebnisfelder", "Preise und Kontingente aller Regionen", "Das Rechenmodul (ES-Modul), derselbe Code wie diese Seite"], "copyUrl": "URL kopieren", "codeH": "Aus Code aufrufen", "copy": "Kopieren", "paramsH": "Parameter für vorausgefüllte Links", "params": ["AWS-Regionscode, z. B. us-east-1", "Paket, angegeben über RAM in GB; $7 / 2 TB ist 1", "Diesen Monat verbrauchte GB (ein + aus)", "Erwartete Gesamtmenge zum Monatsende in GB; allein plant es den ganzen Monat", "Traffic-Instanzen als Anzahl@Start[~Ende], UTC"], "more": "Alle Parameter und Ergebnisfelder stehen in llms.txt. Node.js kann nicht von einer URL importieren: calc.js herunterladen oder aus dem Repository kopieren." },
      cT: "Alle Daten löschen?",
      cB: "Instanzen, Verbrauch und Einstellungen werden zurückgesetzt. Das lässt sich nicht rückgängig machen. Exportiere bei Bedarf vorher ein Backup in den erweiterten Einstellungen.",
      cancel: "Abbrechen",
      clear: "Löschen",
      rules: "Abrechnungsregeln",
      r: [
        "Ein- und ausgehender Traffic <b>zählen beide</b> zum Kontingent",
        "Mehrkosten gibt es <b>nur für ausgehenden Traffic</b>; eingehender ist immer kostenlos",
        "Nur Instanzen in derselben Region mit <b>demselben Tarif</b> teilen sich ein Kontingent; Dual-Stack- und IPv6-only-Varianten eines Tarifs zählen zusammen",
        "Abrechnung pro Stunde. <b>Gestoppte Instanzen kosten weiter</b>; erst Löschen beendet die Abrechnung",
        "Bereits entstandene Mehrkosten <b>lassen sich nicht ausgleichen</b>; füge Instanzen hinzu, bevor das Kontingent aufgebraucht ist",
        "Löschen und neu erstellen <b>setzt den Monatsverbrauch nicht zurück</b>",
        "Traffic über <b>private IPs</b> innerhalb einer Region zählt zum Kontingent, kostet aber nie extra",
        "Gerechnet mit 1 TB = 1024 GB und Kalendermonaten in UTC. Maßgeblich ist deine AWS-Rechnung"
      ],
      helpQ: ["Zählt eingehender Traffic zum Kontingent?", "Kostet eingehender Traffic jemals etwas?", "Wie teuer ist Traffic über dem Kontingent?", "Welche Instanzen teilen sich ein Kontingent?", "Kosten gestoppte Instanzen weiter?", "Gleichen neue Instanzen Mehrkosten aus?", "Setzt Neuerstellen den Verbrauch zurück?", "Kostet Traffic über private IPs etwas?", "Wie genau sind die Schätzungen?", "Offizielle AWS-Links"],
      overA: "Das hängt von der Region ab: <b>{lo}–{hi} pro GB</b> ausgehender Traffic über dem Kontingent. Der Rechner nutzt den Preis der gewählten Region.",
      links: ["Preise", "FAQ Datenübertragung", "FAQ Abrechnung", "Servicebedingungen", "Verbrauch auf der Rechnung"],
      foot: "Preise geprüft {d} · Kein offizielles AWS-Tool",
      allowLbl: "Kontingent {v}",
      rpBtn: "Ergebnis falsch?",
      rpPre: "Das Ergebnis stimmt nicht:",
      rpRegion: "Region",
      rpPrice: "Preise geprüft"
    },
    pt: {
      seoTitle: "Calculadora de tráfego do AWS Lightsail: preveja o excedente e economize",
      ogSub: "Sua franquia vai estourar este mês? Quantas instâncias vale a pena adicionar?",
      name: "Calculadora de economia AWS Lightsail",
      tagline: "Instâncias do Lightsail com o mesmo plano na mesma região dividem uma franquia de transferência. Veja se você vai estourar este mês e quantas instâncias baratas adicionar para evitar isso.",
      region: "Região (as franquias só se somam dentro de uma região)",
      lang: "Idioma",
      over: "excedente",
      half: "metade da franquia",
      settings: "Configurações avançadas",
      outRatio: "Parcela de saída",
      outRatioHint: "O excedente só é cobrado sobre o tráfego de saída (o que seus servidores enviam). Se não tiver certeza, deixe em 100%.",
      prorate: "Calcular proporcionalmente a franquia de instâncias criadas no meio do mês",
      exp: "Exportar backup",
      imp: "Importar backup",
      sample: "Carregar exemplo",
      reset: "Redefinir tudo",
      resetHold: "Segure 1 s para confirmar",
      copyLink: "Copiar link da configuração",
      copied: "Copiado",
      linkLoaded: "A configuração do link foi carregada. Seus dados anteriores estão salvos e podem ser restaurados.",
      undo: "Restaurar meus dados",
      gh: "Ver o código no GitHub",
      theme: "Tema",
      th_system: "Sistema",
      th_light: "Claro",
      th_dark: "Escuro",
      close: "Fechar",
      qPrev: "Anterior",
      qNext: "Próximo",
      roll: "Novo mês ({m}). Zerar o uso do mês passado? Sua instância principal e as instâncias de tráfego ativas continuam.",
      rollBtn: "Iniciar novo mês",
      usedUnit: "GB usados",
      usedAria: "Dados usados neste mês",
      recorded: "Anotado em {t} · {v}/dia",
      toBill: "Abrir faturas",
      allow: "Franquia",
      remain: "Restante",
      exceeded: "Excedido",
      forecast: "Previsão fim do mês",
      forecastTip: "Deixe vazio para estimar pela média diária, ou informe o total mensal esperado (GB)",
      fcErr: "Não pode ser menor que o já usado ({v})",
      endErr: "A exclusão precisa ser depois da criação",
      localTime: "hora local",
      utcNote: "A AWS cobra por mês do calendário em UTC. Este mês começou em {t} no seu horário",
      cost: "Custo estimado do mês",
      inclOver: "inclui {v} de excedente",
      bandGood: "Tudo certo · dentro da franquia",
      bandWarn: "Vai estourar · cerca de {v} a mais",
      bandBad: "Franquia estourada · cerca de {v} a mais",
      bandIdle: "Informe seu uso para começar",
      lgUsed: "Usado {v}",
      lgEnd: "Fim do mês {v}",
      lgOver: "Excedente {v}",
      fill: "Primeiro, informe o uso deste mês",
      fillHint: "Em {a}AWS Bills → Lightsail{/a}, some as linhas {in} e {out}.",
      enough: "A franquia dá conta. Não precisa adicionar instâncias",
      leftEnd: "Sobram {v} no fim do mês",
      suggest: "Adicione {n} instância(s) de tráfego",
      apply: "Adicionar",
      from: "{spec}, a partir de {t}",
      saveV: "economiza {v} em relação a não adicionar nenhuma",
      exPred: "a franquia acaba em {t}",
      exPast: "a cota acabou em {t}",
      noAdd: "Não adicionar é mais barato",
      planMode: "Plano do mês inteiro",
      planNote: "Cada instância de tráfego: +{a} de franquia · {c}/mês",
      optimal: "Esta já é a configuração mais barata. O excedente restante não tem como evitar.",
      optNone: "Nenhuma",
      optN: "+{n}",
      barTip: "Instâncias {a} · Excedente {o}",
      locked: "Os {v} que já estouraram não são compensados por novas instâncias e já estão incluídos.",
      next: "Próximo mês",
      nextLine: "No ritmo deste mês ({v}), use {cfg}: cerca de {c}/mês",
      cfgBase: "só sua instância principal",
      cfgPlus: "sua instância principal + {n} de tráfego",
      fleet: "Visão das instâncias",
      fleetSum: "{n} · {c}",
      m2c: "Meça antes sua latência para cada região da AWS",
      xcost: "Compare taxas de transferência e custo total entre nuvens",
      base: "Instância principal",
      baseHint: "A instância que você já usa. As instâncias de tráfego precisam ter o mesmo plano para somar as franquias.",
      best: "Melhor",
      v4: "Precisa de IPv4 público",
      dual: "Pilha dupla",
      start: "Criada em",
      nodes: "Instâncias de tráfego",
      share: "Instâncias com o mesmo plano na mesma região dividem uma única franquia. As de tráfego são só IPv6 (IPv6-only), mais baratas que com IPv4 público.",
      nodeAdd: "Adicionar 1 agora: +{a} de franquia · {c} (proporcional até o fim do mês)",
      add: "Adicionar instância de tráfego",
      nStart: "Criada",
      nEnd: "Excluída (vazio se ainda estiver ativa)",
      planned: "Planejada",
      gone: "Excluída",
      dec: "Diminuir",
      inc: "Aumentar",
      count: "Quantidade",
      del: "Remover",
      seoDesc: "Calculadora gratuita de tráfego do AWS Lightsail. Instâncias com o mesmo plano em uma região dividem a franquia. Informe o uso deste mês e veja quanto resta, se vai pagar excedente e quantas instâncias IPv6 adicionar para pagar o mínimo.",
      seoKw: "AWS Lightsail, transferência de dados Lightsail, excedente Lightsail, calculadora, preços Lightsail, instância IPv6, VPS",
      agent: "Usar com IA",
      secCalc: "Cálculo",
      secData: "Dados",
      ag: { "title": "Use com um agente de IA", "sub": "Seu agente lê um guia curto, faz as contas por você e devolve um link para conferir aqui.", "close": "Fechar", "tabs": ["Início rápido", "Casos de uso", "Desenvolvedores"], "s1": "Copie este prompt", "prompt": "Leia primeiro {url} e use as regras de cobrança do Lightsail descritas lá para calcular meu pool de transferência de dados.\nMinha configuração: região ___, plano ___ (ex. $7 / 2 TB de transferência), ___ GB usados este mês (até ___).\nDiga se vou ultrapassar este mês e quantas instâncias de tráfego adicionar pelo menor custo, e me dê um link da calculadora já preenchido para conferir.", "copyPrompt": "Copiar prompt", "s2": "Cole em um agente com acesso à web", "s2n": "ChatGPT, Claude, Gemini, Cursor e similares funcionam. Preencha as lacunas ou cole as linhas de transferência da sua fatura.", "s3": "Abra o link que ele devolver", "s3n": "O link carrega a configuração aqui para você conferir os números. Seus dados atuais são salvos antes e podem ser restaurados.", "privacy": "Esta página não envia nada. Links de configuração contêm seus números de uso: confira antes de compartilhar.", "casesIntro": "Copie uma pergunta, troque os números e envie ao seu agente. Todas já incluem o endereço do guia.", "does": "O agente: ", "copyQ": "Copiar pergunta", "ref": " (Regras e método: {url})", "perm": { "none": "Sem permissões", "ro": "AWS somente leitura", "rw": "AWS escrita · gera custos" }, "cases": [["Vou ultrapassar?", "No meio do mês, saber se o pool vai durar.", "Uso o plano Lightsail de $12 / 3 TB em Tóquio e já gastei 2800 GB este mês. Vou ultrapassar? Quantas instâncias de tráfego devo adicionar?", "projeta o fim do mês pelo ritmo diário e encontra a solução mais barata."], ["Escolher a configuração", "Planejar um projeto novo antes de implantar.", "Meu app vai transferir cerca de 8 TB por mês, principalmente para o Sudeste Asiático. Qual região e plano do Lightsail saem mais baratos?", "compara preços por região, regiões com metade da franquia e combinações de plano e instâncias de tráfego."], ["Planejar o mês", "Dimensionar a frota no início do mês.", "No próximo mês espero cerca de 12.000 GB em Frankfurt no plano de $7 / 2 TB. Quantas instâncias de tráfego deixam o custo mais baixo?", "faz um plano do mês inteiro e devolve a quantidade e o custo mensal."], ["Entender a fatura", "As linhas de transferência da fatura são difíceis de ler.", "Estas são as linhas de transferência do Lightsail da minha fatura da AWS: (colar). Quanto de franquia sobra e serei cobrado?", "soma os itens DataXfer-In/Out e dá um link para conferir."], ["Alertas de uso", "Uma verificação diária que avisa antes do excedente.", "Toda manhã, leia as métricas de rede das minhas instâncias Lightsail e me avise se este mês estiver a caminho de ultrapassar.", "lê NetworkIn/Out com a AWS CLI ou SDK, faz o cálculo e avisa você."], ["Escalar automaticamente", "Adicionar instâncias de tráfego sozinho quando o excedente se aproxima.", "Se houver excedente previsto, crie na mesma região a quantidade recomendada de instâncias só IPv6 do meu plano. Peça minha confirmação antes de criar qualquer coisa.", "usa a recomendação para chamar a API do Lightsail e criar instâncias."]], "scaleWarn": "Escalar automaticamente cria instâncias reais e cobradas. Dê ao agente só as permissões necessárias, exija confirmação e limite o número de instâncias.", "devIntro": "Tudo é estático e pode ser lido de qualquer origem. Não há API de servidor nem chave.", "files": ["Guia para agentes: regras, parâmetros do link, campos do resultado", "Preços e franquias de todas as regiões", "O módulo de cálculo (ES module), o mesmo código desta página"], "copyUrl": "Copiar URL", "codeH": "Chamar pelo código", "copy": "Copiar", "paramsH": "Parâmetros do link pré-preenchido", "params": ["Código da região AWS, ex. us-east-1", "Plano, identificado pela RAM em GB; $7 / 2 TB é 1", "GB usados este mês (entrada + saída)", "Total previsto no fim do mês em GB; sozinho, planeja o mês inteiro", "Instâncias de tráfego: quantidade@início[~fim], UTC"], "more": "Todos os parâmetros e campos do resultado estão no llms.txt. O Node.js não importa de uma URL: baixe o calc.js ou copie do repositório." },
      cT: "Apagar todos os dados?",
      cB: "Instâncias, uso e configurações voltam ao padrão, e não dá para desfazer. Se precisar, exporte antes um backup em Configurações avançadas.",
      cancel: "Cancelar",
      clear: "Apagar",
      rules: "Regras de cobrança",
      r: [
        "Tráfego de entrada e de saída <b>contam para a franquia</b>",
        "O excedente é <b>cobrado só na saída</b>; a entrada é sempre grátis",
        "Só dividem franquia instâncias da mesma região com o <b>mesmo plano</b>; as versões pilha dupla e IPv6-only de um plano somam juntas",
        "Cobrança por hora. <b>Instância parada continua cobrando</b>; só a exclusão para a cobrança",
        "O excedente que já aconteceu <b>não é compensado</b> por novas instâncias: adicione antes de a franquia acabar",
        "Excluir e recriar uma instância <b>não zera</b> o uso do mês",
        "Tráfego por <b>IP privado</b> dentro da região conta para a franquia, mas nunca é cobrado",
        "Estimativa com 1 TB = 1024 GB e meses do calendário em UTC. Os valores finais são os da sua fatura da AWS"
      ],
      helpQ: ["O tráfego de entrada conta para a franquia?", "O tráfego de entrada é cobrado?", "Quanto custa o excedente?", "Quais instâncias dividem a franquia?", "Instância parada continua cobrando?", "Adicionar instâncias cancela o excedente?", "Recriar a instância zera o uso?", "Tráfego por IP privado é cobrado?", "As estimativas são precisas?", "Links oficiais da AWS"],
      overA: "Depende da região: <b>{lo}–{hi} por GB</b> de saída acima da franquia. A calculadora usa o preço da região escolhida.",
      links: ["Preços", "FAQ de transferência", "FAQ de cobrança", "Termos de serviço", "Ver uso na fatura"],
      foot: "Preços conferidos em {d} · Não é uma ferramenta oficial da AWS",
      allowLbl: "Franquia {v}",
      rpBtn: "Resultado errado?",
      rpPre: "O resultado está errado:",
      rpRegion: "Região",
      rpPrice: "Preços verificados"
    },
    ru: {
      seoTitle: "Калькулятор трафика AWS Lightsail: прогноз перерасхода и экономия",
      ogSub: "Хватит ли лимита трафика в этом месяце и сколько инстансов добавить?",
      name: "Калькулятор экономии AWS Lightsail",
      tagline: "Инстансы Lightsail на одном тарифе в одном регионе делят общий лимит трафика. Узнайте, превысите ли вы его в этом месяце и сколько дешёвых инстансов добавить, чтобы этого избежать.",
      region: "Регион (лимиты суммируются только внутри одного региона)",
      lang: "Язык",
      over: "превышение",
      half: "половина лимита",
      settings: "Дополнительно",
      outRatio: "Доля исходящего",
      outRatioHint: "Перерасход оплачивается только за исходящий трафик (то, что отправляют ваши серверы). Если не уверены, оставьте 100 %.",
      prorate: "Считать лимит инстансов, созданных в середине месяца, пропорционально",
      exp: "Экспорт копии",
      imp: "Импорт копии",
      sample: "Загрузить пример",
      reset: "Сбросить все данные",
      resetHold: "Удерживайте 1 с для подтверждения",
      copyLink: "Копировать ссылку на настройки",
      copied: "Скопировано",
      linkLoaded: "Настройки загружены из ссылки. Ваши прежние данные сохранены, их можно вернуть.",
      undo: "Вернуть мои данные",
      gh: "Исходный код на GitHub",
      theme: "Тема",
      th_system: "Системная",
      th_light: "Светлая",
      th_dark: "Тёмная",
      close: "Закрыть",
      qPrev: "Назад",
      qNext: "Далее",
      roll: "Начался новый месяц ({m}). Обнулить расход за прошлый месяц? Основной инстанс и работающие инстансы под трафик останутся.",
      rollBtn: "Начать новый месяц",
      usedUnit: "ГБ израсходовано",
      usedAria: "Расход за месяц",
      recorded: "Внесено {t} · {v}/день",
      toBill: "Открыть счета",
      allow: "Лимит",
      remain: "Осталось",
      exceeded: "Превышено на",
      forecast: "Прогноз на месяц",
      forecastTip: "Оставьте пустым, и мы посчитаем по среднему за день. Или введите ожидаемый объём за месяц (GB)",
      fcErr: "Не может быть меньше уже израсходованного ({v})",
      endErr: "Время удаления должно быть позже времени создания",
      localTime: "местное время",
      utcNote: "AWS выставляет счёт за календарный месяц по UTC. Этот месяц начался {t} по вашему времени",
      cost: "Примерные расходы за месяц",
      inclOver: "вкл. {v} превышения",
      bandGood: "Всё в порядке · лимита хватает",
      bandWarn: "Ожидается перерасход · около {v}",
      bandBad: "Лимит превышен · около {v} сверху",
      bandIdle: "Введите расход трафика",
      lgUsed: "Израсходовано {v}",
      lgEnd: "К концу месяца {v}",
      lgOver: "Превышение {v}",
      fill: "Сначала введите расход за этот месяц",
      fillHint: "В {a}AWS Bills → Lightsail{/a} сложите строки {in} и {out}.",
      enough: "Лимита хватает. Добавлять инстансы не нужно",
      leftEnd: "к концу месяца останется {v}",
      suggest: "Добавьте инстансов под трафик: {n}",
      apply: "Добавить",
      from: "{spec}, с {t}",
      saveV: "экономия {v} по сравнению с вариантом без добавления",
      exPred: "лимит закончится {t}",
      exPast: "лимит закончился {t}",
      noAdd: "Выгоднее ничего не добавлять",
      planMode: "План на весь месяц",
      planNote: "Каждый инстанс под трафик: +{a} лимита · {c}/мес.",
      optimal: "Это уже самая дешёвая конфигурация. Оставшегося перерасхода не избежать.",
      optNone: "Нет",
      optN: "+{n}",
      barTip: "Инстансы {a} · Превышение {o}",
      locked: "Уже превышенные {v} новыми инстансами не компенсировать, они учтены.",
      next: "Следующий месяц",
      nextLine: "При темпе этого месяца ({v}) берите {cfg}, около {c}/мес.",
      cfgBase: "только основной инстанс",
      cfgPlus: "основной + {n} под трафик",
      fleet: "Обзор инстансов",
      fleetSum: "{n} шт. · {c}",
      m2c: "Сначала проверьте задержку до каждого региона AWS",
      xcost: "Сравните плату за трафик и общую стоимость в разных облаках",
      base: "Основной инстанс",
      baseHint: "Инстанс, который у вас уже работает. Инстансы под трафик должны быть на том же тарифе, иначе лимиты не суммируются.",
      best: "Выгодно",
      v4: "Нужен публичный IPv4",
      dual: "Двойной стек",
      start: "Создан",
      nodes: "Инстансы под трафик",
      share: "Инстансы на одном тарифе в одном регионе делят общий лимит. Инстансы под трафик работают только по IPv6 (IPv6-only) и стоят дешевле, чем с публичным IPv4.",
      nodeAdd: "Добавить 1 сейчас: +{a} лимита · {c} (пропорционально до конца месяца)",
      add: "Добавить инстанс под трафик",
      nStart: "Создан",
      nEnd: "Удалён (пусто, если работает)",
      planned: "План",
      gone: "Удалён",
      dec: "Меньше",
      inc: "Больше",
      count: "Количество",
      del: "Убрать",
      seoDesc: "Бесплатный калькулятор трафика AWS Lightsail. Инстансы на одном тарифе в регионе делят общий лимит. Введите расход за месяц и узнайте, сколько осталось, будет ли перерасход и сколько IPv6-инстансов добавить, чтобы платить меньше всего.",
      seoKw: "AWS Lightsail, трафик Lightsail, превышение Lightsail, калькулятор трафика, цены Lightsail, IPv6-инстанс, VPS",
      agent: "ИИ-агент",
      secCalc: "Расчёт",
      secData: "Данные",
      ag: { "title": "Использовать с ИИ-агентом", "sub": "Агент читает короткую инструкцию, считает за вас и возвращает ссылку, которую можно проверить здесь.", "close": "Закрыть", "tabs": ["Быстрый старт", "Сценарии", "Разработчикам"], "s1": "Скопируйте этот промпт", "prompt": "Сначала прочитай {url} и по описанным там правилам тарификации Lightsail рассчитай мой пул трафика.\nМоя конфигурация: регион ___, тариф ___ (напр. $7 / 2 ТБ трафика), в этом месяце израсходовано ___ ГБ (на ___).\nСкажи, превышу ли я лимит в этом месяце и сколько инстансов под трафик добавить, чтобы заплатить меньше всего, и дай заполненную ссылку на калькулятор для проверки.", "copyPrompt": "Копировать промпт", "s2": "Вставьте его в агента с доступом к вебу", "s2n": "Подойдут ChatGPT, Claude, Gemini, Cursor и подобные. Заполните пропуски или вставьте строки трафика из счёта.", "s3": "Откройте ссылку, которую он вернёт", "s3n": "Ссылка загрузит конфигурацию сюда, чтобы вы проверили цифры. Ваши текущие данные сначала сохраняются, их можно восстановить.", "privacy": "Эта страница ничего не отправляет. Ссылки на конфигурацию содержат цифры расхода — проверьте их, прежде чем делиться.", "casesIntro": "Скопируйте вопрос, подставьте свои цифры и отправьте агенту. В каждом уже есть адрес инструкции.", "does": "Агент: ", "copyQ": "Копировать вопрос", "ref": " (Правила и методика: {url})", "perm": { "none": "Доступ не нужен", "ro": "AWS только чтение", "rw": "AWS запись · платно" }, "cases": [["Превышу ли?", "В середине месяца понять, хватит ли пула.", "У меня тариф Lightsail $12 / 3 ТБ в Токио, в этом месяце израсходовано 2800 ГБ. Превышу ли я лимит? Сколько инстансов под трафик добавить?", "прогнозирует конец месяца по дневному темпу и находит самое дешёвое решение."], ["Выбор конфигурации", "Спланировать новый проект до развёртывания.", "Моё приложение будет отдавать около 8 ТБ в месяц, в основном в Юго-Восточную Азию. Какой регион и тариф Lightsail выйдут дешевле всего?", "сравнивает цены регионов, регионы с половинным лимитом и сочетания тарифа с инстансами под трафик."], ["План на месяц", "Определить число инстансов в начале месяца.", "В следующем месяце ожидаю около 12 000 ГБ во Франкфурте на тарифе $7 / 2 ТБ. Сколько инстансов под трафик дадут минимальную стоимость?", "строит план на весь месяц и возвращает количество и месячную стоимость."], ["Разбор счёта", "Строки трафика в счёте трудно понять.", "Вот строки трафика Lightsail из моего счёта AWS: (вставить). Сколько лимита осталось и будут ли списания?", "суммирует статьи DataXfer-In/Out и даёт ссылку для проверки."], ["Оповещения", "Ежедневная проверка с предупреждением до превышения.", "Каждое утро читай сетевые метрики моих инстансов Lightsail и предупреди меня, если в этом месяце намечается превышение.", "читает NetworkIn/Out через AWS CLI или SDK, считает и уведомляет вас."], ["Автомасштаб", "Автоматически добавлять инстансы под трафик перед превышением.", "Если ожидается превышение, создай в том же регионе рекомендованное число инстансов моего тарифа только с IPv6. Перед созданием обязательно спроси подтверждение.", "по рекомендации вызывает API Lightsail и создаёт инстансы."]], "scaleWarn": "Создаёт настоящие платные инстансы: давайте только нужные права, требуйте подтверждения и ограничьте их число.", "devIntro": "Всё статично и доступно с любого источника. Нет серверного API и ключей.", "files": ["Инструкция для агентов: правила, параметры ссылки, поля результата", "Цены и лимиты всех регионов", "Модуль расчёта (ES-модуль), тот же код, что на этой странице"], "copyUrl": "Копировать URL", "codeH": "Вызов из кода", "copy": "Копировать", "paramsH": "Параметры заполненной ссылки", "params": ["Код региона AWS, напр. us-east-1", "Тариф, задаётся объёмом RAM в ГБ; $7 / 2 ТБ — это 1", "Израсходовано в этом месяце, ГБ (вход + выход)", "Ожидаемый итог на конец месяца, ГБ; отдельно — план на весь месяц", "Инстансы под трафик: количество@начало[~конец], UTC"], "more": "Все параметры и поля результата — в llms.txt. Node.js не импортирует по URL: скачайте calc.js или скопируйте его из репозитория." },
      cT: "Удалить все данные?",
      cB: "Инстансы, расход и настройки вернутся к значениям по умолчанию. Отменить это нельзя. При необходимости сначала экспортируйте резервную копию в дополнительных настройках.",
      cancel: "Отмена",
      clear: "Удалить",
      rules: "Правила тарификации",
      r: [
        "Входящий и исходящий трафик <b>расходуют лимит</b>",
        "Перерасход <b>оплачивается только за исходящий</b> трафик; входящий всегда бесплатен",
        "Лимит делят только инстансы одного региона на <b>одном тарифе</b>; варианты с двойным стеком и IPv6-only одного тарифа суммируются",
        "Оплата почасовая. <b>Остановленный инстанс тоже оплачивается</b>; списания прекращаются только после удаления",
        "Уже случившийся перерасход <b>не компенсировать</b> новыми инстансами: добавляйте их до того, как лимит кончится",
        "Удаление и повторное создание инстанса <b>не обнуляет</b> расход за месяц",
        "Трафик по <b>частным IP</b> внутри региона расходует лимит, но никогда не оплачивается",
        "Расчёт исходит из 1 TB = 1024 GB и календарных месяцев по UTC. Окончательные суммы указаны в вашем счёте AWS"
      ],
      helpQ: ["Входящий трафик расходует лимит?", "Платят ли за входящий трафик?", "Сколько стоит перерасход?", "Какие инстансы делят лимит?", "Остановленный инстанс тоже оплачивается?", "Можно ли новыми инстансами погасить перерасход?", "Пересоздание инстанса обнуляет расход?", "Платят ли за трафик по частным IP?", "Насколько точны расчёты?", "Официальные ссылки AWS"],
      overA: "Зависит от региона: <b>{lo}–{hi} за GB</b> исходящего трафика сверх лимита. Калькулятор берёт цену выбранного региона.",
      links: ["Цены", "FAQ по трафику", "FAQ по оплате", "Условия сервиса", "Расход в счёте"],
      foot: "Цены проверены {d} · Не официальный инструмент AWS",
      allowLbl: "Лимит {v}",
      rpBtn: "Результат неверный?",
      rpPre: "Результат неверный:",
      rpRegion: "Регион",
      rpPrice: "Цены проверены"
    }
  };
  const KEY = "lightsail-pool:v2", OLD_KEY = "lightsail-pool:v1", LANG_KEY = "lightsail-pool:lang", THEME_KEY = "lightsail-pool:theme";
  const HOUR = 36e5, DAY = 864e5, IN = "TotalDataXfer-In-Bytes", OUT = "TotalDataXfer-Out-Bytes";
  const CALC_VERSION = 1;
  const GB_PER_TB = 1024, HOUR_MS = 36e5;
  const monthKey = (d) => d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0");
  const monthRange = (k) => {
    const [y, m] = k.split("-").map(Number);
    return [Date.UTC(y, m - 1, 1), Date.UTC(y, m, 1)];
  };
  function normalizePrices(prices) {
    var _a;
    const regions = {};
    for (const [id, r] of Object.entries(prices.regions || {})) {
      const rows = r.q ? r.q.map(([ram, p4, p6, tb]) => ({ ram, p4, p6, tb })) : (r.bundles || []).map((b) => ({ ram: b.ramGB, p4: b.dualStackMonthly, p6: b.ipv6OnlyMonthly, tb: b.transferTB }));
      regions[id] = { over: (_a = r.over) != null ? _a : r.overagePerGB, bundles: rows };
    }
    return { date: prices.date, regions };
  }
  function regionInfo(prices, id) {
    const norm = normalizePrices(prices), ids = Object.keys(norm.regions);
    const rid = norm.regions[id] ? id : ids[0], r = norm.regions[rid], one = r.bundles.find((b) => b.ram === 1);
    return { id: rid, price: r.over, half: !!one && one.tb < 2, bundles: r.bundles };
  }
  function computeCore(state, prices, nowReal) {
    const clamp2 = (v, a, z) => Math.min(z, Math.max(a, v));
    const R = regionInfo(prices, state.region);
    const b = R.bundles.find((x) => x.ram === state.size) || R.bundles.find((x) => x.ram === 1) || R.bundles[0];
    const full2 = b.tb * GB_PER_TB, [m0, m1] = monthRange(state.month), M = m1 - m0;
    const now = clamp2(nowReal, m0, m1), nodesIn = state.nodes || [];
    const span = (s, e) => {
      s = Math.max(s == null ? m0 : s, m0);
      e = Math.min(e == null ? m1 : e, m1);
      return e > s ? (e - s) / M : 0;
    };
    const allowOf = (n, f) => n * full2 * (state.prorate ? f : f > 0 ? 1 : 0);
    const hasU = state.used != null, auto = state.forecast == null, has = hasU || !auto, plan = !hasU && !auto;
    const life = (s, e) => plan && e == null ? 1 : span(s, e);
    const bf = life(state.baseStart, null);
    const base = { allow: allowOf(1, bf), cost: (state.ipv4 ? b.p4 : b.p6) * bf };
    const basePlanned = !plan && state.baseStart != null && state.baseStart > now;
    let allow = base.allow, allowFuture = basePlanned ? base.allow : 0, cost2 = base.cost, live = 1;
    const nodes = nodesIn.map((n) => {
      const f = life(n.start, n.end), r = {
        allow: allowOf(n.count, f),
        cost: n.count * b.p6 * f,
        planned: !plan && n.start != null && n.start > nowReal,
        gone: n.end != null && n.end <= nowReal
      };
      allow += r.allow;
      cost2 += r.cost;
      if (!r.gone) live += n.count;
      if (!plan && n.start != null && n.start > now) allowFuture += r.allow;
      return r;
    });
    const allowPast = allow - allowFuture;
    const starts = [state.baseStart, ...nodesIn.map((n) => n.start)].map((v) => v == null ? m0 : v);
    const p0 = plan ? m0 : clamp2(Math.min(...starts), m0, m1 - HOUR_MS);
    const tU = clamp2(hasU ? state.usedAt || now : now, p0 + HOUR_MS, m1);
    const U = hasU ? +state.used : 0;
    const rate = U / (tU - p0);
    const P = auto ? U + rate * (m1 - tU) : Math.max(+state.forecast, U);
    const fr = plan ? 0 : m1 > tU ? (P - U) / (m1 - tU) : 0;
    const Unow = U + fr * Math.max(0, now - tU);
    const ratio = state.outRatio / 100;
    const lockedGB = plan ? 0 : Math.max(0, Unow - allowPast);
    const F = Math.max(0, P - Unow), Rem = Math.max(0, allowPast - Unow) + allowFuture;
    const overGB = (lockedGB + Math.max(0, F - Rem)) * ratio, overCost = overGB * R.price;
    let exhaust = !has || plan ? null : lockedGB > 0 ? rate > 0 ? p0 + allowPast / rate : null : allow <= U ? rate > 0 ? p0 + allow / rate : null : fr > 0 ? tU + (allow - U) / fr : null;
    if (exhaust != null && exhaust >= m1) exhaust = null;
    const t0 = Math.ceil(now / HOUR_MS) * HOUR_MS, rf = plan ? 1 : Math.max(0, (m1 - t0) / M);
    const ai = full2 * (state.prorate ? rf : 1), ci = b.p6 * rf;
    const optFor = (N) => {
      const o = (lockedGB + Math.max(0, F - Rem - N * ai)) * ratio * R.price;
      return { N, add: N * ci, over: o, total: N * ci + o };
    };
    const Nmin = ai > 0 && F > Rem ? Math.ceil((F - Rem) / ai) : 0;
    const ns = Nmin <= 3 ? [...Array(Nmin + 2).keys()] : [0, Nmin - 1, Nmin, Nmin + 1];
    const opts = has && rf > 0 && overGB > 0 ? ns.map(optFor) : [];
    const best = opts.reduce((a, o) => !a || o.total < a.total - 1e-9 ? o : a, null);
    const status = !has ? "idle" : lockedGB > 0 ? "bad" : overGB > 0 ? "warn" : "good";
    const nextNodes = has ? Math.max(0, Math.ceil(P / full2) - 1) : 0;
    const nextCost = (state.ipv4 ? b.p4 : b.p6) + nextNodes * b.p6;
    return {
      R,
      b,
      full: full2,
      m0,
      m1,
      now,
      p0,
      base,
      allow,
      cost: cost2,
      live,
      has,
      hasU,
      plan,
      U,
      tU,
      rate,
      P,
      auto,
      Unow,
      overGB,
      overCost,
      lockedGB,
      exhaust,
      t0,
      ai,
      ci,
      opts,
      best,
      status,
      nextNodes,
      nextCost,
      nodes
    };
  }
  function toState(input = {}, now = Date.now()) {
    var _a, _b, _c, _d, _e;
    const ms = (v) => v == null || v === "" ? null : typeof v === "number" ? v : new Date(v).getTime();
    const num = (v) => v == null || v === "" || !isFinite(+v) ? null : +v;
    const month = /^\d{4}-(0[1-9]|1[0-2])$/.test(input.month || "") ? input.month : monthKey(new Date(now));
    const [m0] = monthRange(month);
    const inGB = num(input.inGB), outGB = num(input.outGB);
    const used = (_a = num(input.usedGB)) != null ? _a : inGB != null || outGB != null ? (inGB || 0) + (outGB || 0) : null;
    return {
      v: 2,
      month,
      region: input.region || "us-east-1",
      size: (_b = num(input.sizeGB)) != null ? _b : 1,
      ipv4: input.ipv4 !== false,
      baseStart: (_c = ms(input.baseStart)) != null ? _c : m0,
      used,
      usedAt: used == null ? null : (_d = ms(input.usedAt)) != null ? _d : now,
      usedIn: inGB,
      usedOut: outGB,
      forecast: num(input.forecastGB),
      outRatio: (_e = num(input.outboundPercent)) != null ? _e : 100,
      prorate: input.prorate !== false,
      nodes: (input.trafficInstances || []).map((n) => ({ count: Math.max(1, Math.floor(num(n.count) || 1)), start: ms(n.start), end: ms(n.end) }))
    };
  }
  function fromState(s) {
    var _a, _b;
    const iso = (v) => v == null ? void 0 : new Date(v).toISOString();
    const out = { month: s.month, region: s.region, sizeGB: s.size, ipv4: s.ipv4, baseStart: iso(s.baseStart) };
    if (s.usedIn != null || s.usedOut != null) {
      out.inGB = (_a = s.usedIn) != null ? _a : 0;
      out.outGB = (_b = s.usedOut) != null ? _b : 0;
    } else if (s.used != null) out.usedGB = s.used;
    if (s.used != null) out.usedAt = iso(s.usedAt);
    if (s.forecast != null) out.forecastGB = s.forecast;
    if (s.outRatio !== 100) out.outboundPercent = s.outRatio;
    if (s.prorate === false) out.prorate = false;
    out.trafficInstances = (s.nodes || []).map((n) => ({ count: n.count, start: iso(n.start), end: iso(n.end) }));
    return out;
  }
  function calculate(input, prices, now = Date.now()) {
    const s = toState(input, now), c = computeCore(s, prices, now);
    const r2 = (v) => Math.round(v * 100) / 100, iso = (v) => v == null ? null : new Date(v).toISOString();
    const statusName = { idle: "needs-input", good: "safe", warn: "overage-expected", bad: "over-allowance" }[c.status];
    return {
      version: CALC_VERSION,
      pricesDate: normalizePrices(prices).date,
      month: s.month,
      mode: c.plan ? "full-month-plan" : c.hasU ? "actual-usage" : "needs-input",
      status: statusName,
      region: { id: c.R.id, overagePerGB: c.R.price, halfAllowance: c.R.half },
      base: { ramGB: c.b.ram, network: s.ipv4 ? "dual-stack" : "ipv6-only", monthlyPrice: s.ipv4 ? c.b.p4 : c.b.p6, transferTB: c.b.tb },
      allowanceGB: r2(c.allow),
      usedGB: c.hasU ? r2(c.Unow) : null,
      forecastGB: c.has ? r2(c.P) : null,
      overageGB: r2(c.overGB),
      overageCost: r2(c.overCost),
      instanceCost: r2(c.cost),
      totalCost: r2(c.cost + c.overCost),
      allowanceRunsOutAt: iso(c.exhaust),
      unavoidableOverageGB: r2(c.lockedGB),
      recommendation: c.best ? {
        addTrafficInstances: c.best.N,
        startingAt: c.plan ? null : iso(c.t0),
        eachAddsGB: r2(c.ai),
        eachCosts: r2(c.ci),
        resultingCost: r2(c.best.total),
        savesVsAddingNone: r2(c.opts[0].total - c.best.total)
      } : null,
      options: c.opts.map((o) => ({ addTrafficInstances: o.N, instanceCost: r2(o.add), overageCost: r2(o.over), total: r2(o.total) })),
      nextMonth: c.has ? { trafficInstances: c.nextNodes, monthlyCost: r2(c.nextCost) } : null
    };
  }
  const LINK_KEYS = ["region", "size", "ipv4", "base", "used", "in", "out", "at", "forecast", "outpct", "prorate", "nodes"];
  function buildLink(input, base = "https://ls.1ms.dog/") {
    const u = new URL(base), p = u.searchParams, set = (k, v) => {
      if (v != null && v !== "") p.set(k, String(v));
    };
    set("region", input.region);
    set("size", input.sizeGB);
    if (input.ipv4 === false) p.set("ipv4", "0");
    set("base", input.baseStart && new Date(input.baseStart).toISOString().slice(0, 16) + "Z");
    set("used", input.usedGB);
    set("in", input.inGB);
    set("out", input.outGB);
    set("at", input.usedAt && new Date(input.usedAt).toISOString().slice(0, 16) + "Z");
    set("forecast", input.forecastGB);
    set("outpct", input.outboundPercent);
    if (input.prorate === false) p.set("prorate", "0");
    const t2 = (v) => v ? new Date(v).toISOString().slice(0, 16) + "Z" : "";
    if ((input.trafficInstances || []).length) p.set("nodes", input.trafficInstances.map((n) => n.count + "@" + t2(n.start) + (n.end ? "~" + t2(n.end) : "")).join(","));
    const q = [...p].map(([k, v]) => k + "=" + encodeURIComponent(v).replace(/%3A/g, ":").replace(/%40/g, "@").replace(/%2C/g, ",")).join("&");
    return u.origin + u.pathname + (q ? "?" + q : "");
  }
  function parseLink(search) {
    const p = new URLSearchParams(search), g = (k) => p.get(k);
    if (!LINK_KEYS.some((k) => p.has(k))) return null;
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
    if (g("nodes")) out.trafficInstances = g("nodes").split(",").filter(Boolean).map((x) => {
      const [count, rest = ""] = x.split("@"), [start, end] = rest.split("~");
      return { count: +count || 1, start: start || null, end: end || null };
    });
    return out;
  }
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const uid = () => Math.random().toString(36).slice(2, 9);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad = (n) => String(n).padStart(2, "0");
  const REGION_IDS = REGION_ORDER.filter((id) => PRICES.regions[id]);
  const bundles = () => (PRICES.regions[S.region] || PRICES.regions[REGION_IDS[0]]).q.map(([ram, p4, p6, tb]) => ({ ram, p4, p6, tb }));
  const bundle = (ram) => {
    const all = bundles();
    return all.find((b) => b.ram === ram) || all.find((b) => b.ram === 1) || all[0];
  };
  const regionOf = (id) => {
    const r = PRICES.regions[id], one = r.q.find((x) => x[0] === 1);
    return { id, price: r.over, half: !!one && one[3] < 2 };
  };
  const region = () => regionOf(PRICES.regions[S.region] ? S.region : REGION_IDS[0]);
  const ramLabel = (r) => r < 1 ? "512M" : r + "G";
  const fullAllow = (b) => b.tb * GB_PER_TB;
  const fmtGB = (g) => {
    g = Math.max(0, g || 0);
    return g >= GB_PER_TB ? (g / GB_PER_TB).toFixed(g >= 10 * GB_PER_TB ? 1 : 2) + " TB" : Math.round(g) + " GB";
  };
  const fmtUSD = (x) => "$" + (x >= 1e3 ? Math.round(x).toLocaleString("en-US") : x.toFixed(2));
  const toInput = (ms) => {
    if (ms == null) return "";
    const d = new Date(ms);
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
  };
  const fromInput = (s) => {
    if (!s) return null;
    const t2 = new Date(s).getTime();
    return isNaN(t2) ? null : t2;
  };
  const nextHour = (t2) => Math.ceil(t2 / HOUR) * HOUR;
  const perTB = (b, v4) => (v4 ? b.p4 : b.p6) / b.tb;
  const LANG = I18N[document.documentElement.lang] ? document.documentElement.lang : "en";
  const SITE_ROOT = location.pathname.replace(/[^/]*$/, "").replace(LANG === "en" ? /$/ : /[^/]+\/$/, "");
  const langHref = (l) => {
    var _a;
    return SITE_ROOT + ((_a = LANG_PATHS[l]) != null ? _a : "");
  };
  const t = (k, v) => {
    let s = I18N[LANG][k];
    if (v) for (const p in v) s = s.split("{" + p + "}").join(v[p]);
    return s;
  };
  const fmtDate = (ms) => new Intl.DateTimeFormat(LANG, { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(ms);
  const regionName = (id) => REGION_NAMES[LANG][REGION_ORDER.indexOf(id)];
  function applyLang() {
    document.querySelectorAll("[data-i]").forEach((el) => {
      el.textContent = t(el.dataset.i);
    });
    $$("[data-ia]").forEach((el) => {
      el.setAttribute("aria-label", t(el.dataset.ia));
      if (el.hasAttribute("title")) el.title = t(el.dataset.ia);
    });
    $("#footTxt").textContent = t("foot", { d: PRICES.date });
    $("#agentBtn").title = t("agent");
    $("#agentBtn").setAttribute("aria-label", t("agent"));
    renderAgent();
    fitHeader();
    $("#regionWrap").title = t("region");
    $("#region").setAttribute("aria-label", t("region"));
    $("#langWrap").title = t("lang");
    $("#lang").setAttribute("aria-label", t("lang"));
    $("#settingsBtn").title = t("settings");
    $("#settingsBtn").setAttribute("aria-label", t("settings"));
    $("#used").setAttribute("aria-label", t("usedAria"));
    $("#forecast").title = t("forecastTip");
    $("#outRatio").setAttribute("aria-label", t("outRatio"));
    $("#ipv4").setAttribute("aria-label", t("v4"));
    $("#baseStart").setAttribute("aria-label", t("start"));
    $("#region").innerHTML = REGION_IDS.map((id) => {
      const r = regionOf(id);
      return `<option value="${id}">${regionName(id)} · ${t("over")} $${r.price}/GB${r.half ? " · " + t("half") : ""}</option>`;
    }).join("");
    $("#region").value = S.region;
    $("#helpBtn").title = t("rules");
  }
  $("#lang").innerHTML = LANGS.map(([c, n]) => `<option value="${c}">${n}</option>`).join("");
  function defaults() {
    const mk = monthKey(/* @__PURE__ */ new Date()), [m0] = monthRange(mk);
    return {
      v: 2,
      month: mk,
      region: "us-east-1",
      size: 1,
      ipv4: true,
      baseStart: m0,
      used: null,
      usedAt: null,
      usedIn: null,
      usedOut: null,
      forecast: null,
      outRatio: 100,
      prorate: true,
      nodes: []
    };
  }
  const valid = (s) => s && s.v === 2 && Array.isArray(s.nodes);
  function sanitize(s) {
    var _a, _b;
    const d = defaults();
    const num = (v, min = 0, max = Infinity) => typeof v === "number" && isFinite(v) && v >= min && v <= max ? v : null;
    const time = (v) => num(v, Date.UTC(2020, 0, 1), Date.UTC(2100, 0, 1));
    if (typeof s.month === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(s.month)) d.month = s.month;
    if (PRICES.regions[s.region]) d.region = s.region;
    if (PRICES.regions[d.region].q.some((r) => r[0] === s.size)) d.size = s.size;
    d.ipv4 = s.ipv4 !== false;
    d.prorate = s.prorate !== false;
    d.baseStart = (_a = time(s.baseStart)) != null ? _a : d.baseStart;
    for (const k of ["used", "usedIn", "usedOut", "forecast"]) d[k] = num(s[k], 0, 1e7);
    d.usedAt = time(s.usedAt);
    d.outRatio = (_b = num(s.outRatio, 0, 100)) != null ? _b : 100;
    d.nodes = s.nodes.slice(0, 200).map((n) => n && typeof n === "object" ? {
      id: uid(),
      count: Math.min(999, Math.max(1, Math.floor(num(n.count, 1) || 1))),
      start: time(n.start),
      end: time(n.end)
    } : null).filter(Boolean);
    return d;
  }
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (valid(s)) return sanitize(s);
    } catch (e) {
    }
    try {
      const o = JSON.parse(localStorage.getItem(OLD_KEY));
      if (o && Array.isArray(o.instances)) {
        const d = defaults(), base = o.instances.find((i) => i.base) || o.instances[0], u = base && o.usage && o.usage[String(base.ram)];
        if (o.region) d.region = o.region;
        if (base) {
          d.size = base.ram;
          d.ipv4 = base.net !== "v6";
        }
        if (u && u.used != null) {
          d.used = u.used;
          d.usedAt = u.at;
        }
        if (o.month === d.month) d.nodes = o.instances.filter((i) => i !== base && i.ram === d.size).map((i) => ({ id: uid(), count: i.count, start: i.start, end: i.end }));
        return d;
      }
    } catch (e) {
    }
    return defaults();
  }
  let S = load();
  let linkLoaded = false, linkBackup = null;
  try {
    const linked = parseLink(location.search);
    if (linked) {
      linkBackup = localStorage.getItem(KEY);
      S = sanitize(toState(linked, Date.now()));
      linkLoaded = true;
      save();
      const u = new URL(location.href);
      LINK_KEYS.forEach((k) => u.searchParams.delete(k));
      history.replaceState(null, "", u);
    }
  } catch (e) {
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch (e) {
    }
  }
  function compute() {
    const c = computeCore(S, PRICES, Date.now());
    S.nodes.forEach((n, i) => {
      const r = c.nodes[i];
      n._allow = r.allow;
      n._cost = r.cost;
      n._planned = r.planned;
      n._gone = r.gone;
    });
    return c;
  }
  if (typeof window.msOpenReport === "function") {
    $("#rpRow").hidden = false;
    $("#rpBtn").setAttribute("data-ms-report", t("rpPre"));
    window.msReport = () => {
      const c = compute(), sep = /^(zh|ja)/.test(LANG) ? "：" : ": ", now = Date.now();
      const price = S.ipv4 ? c.b.p4 : c.b.p6, bundle2 = `${fmtUSD(price)} / ${c.b.tb} TB · ${S.ipv4 ? t("dual") : "IPv6-only"}`;
      const verdict = c.status === "idle" ? t("bandIdle") : t(c.status === "good" ? "bandGood" : c.status === "warn" ? "bandWarn" : "bandBad", { v: fmtUSD(c.overCost) });
      const rec = !c.best ? "" : c.best.N > 0 ? t("suggest", { n: c.best.N }) + " · " + t("saveV", { v: fmtUSD(c.opts[0].total - c.best.total) }) : t("noAdd");
      const summary = [
        "Lightsail",
        regionName(c.R.id),
        bundle2,
        c.hasU ? t("lgUsed", { v: fmtGB(c.Unow) }) : t("planMode"),
        c.has ? t("lgEnd", { v: fmtGB(c.P) }) : "",
        verdict,
        rec
      ].filter(Boolean).join(" · ").slice(0, 300);
      const input = fromState(S);
      const data = { at: new Date(now).toISOString(), lang: LANG, prices: PRICES.date, calc: CALC_VERSION, state: input, result: calculate(input, PRICES, now) };
      const pick = (k, v) => v ? k + sep + v : null;
      const picks = [
        pick(t("base"), bundle2),
        pick(t("rpRegion"), regionName(c.R.id) + " · " + fmtUSD(c.R.price) + "/GB"),
        pick(t("cost"), fmtUSD(c.cost + c.overCost) + (c.overCost > 0 ? " · " + t("over") + " " + fmtUSD(c.overCost) : "")),
        pick(t("rpPrice"), PRICES.date),
        c.hasU ? t("lgUsed", { v: fmtGB(c.Unow) }) : t("planMode"),
        c.has ? t("lgEnd", { v: fmtGB(c.P) }) : null,
        rec || null,
        c.R.half ? t("half") : null
      ].filter(Boolean).slice(0, 8).map((s) => s.slice(0, 60));
      const all = input.trafficInstances || [];
      for (let keep = all.length; keep > 0 && new Blob([JSON.stringify(data, null, 1)]).size > 5900; ) {
        keep = Math.floor(keep / 2);
        input.trafficInstances = all.slice(0, keep);
        input.trafficInstancesOmitted = all.length - keep;
      }
      return { summary, data, picks };
    };
  }
  function renderSizes() {
    const v4 = S.ipv4, all = bundles(), costs = all.map((b) => perTB(b, v4)), min = Math.min(...costs);
    $("#sizes").innerHTML = all.map((b, i) => `<button type="button" class="size${b.ram === S.size ? " on" : ""}" data-size="${b.ram}" aria-pressed="${b.ram === S.size}" title="${ramLabel(b.ram)}B RAM">
      ${Math.abs(costs[i] - min) < 1e-9 ? `<span class="star">${t("best")}</span>` : ""}
      <span class="p"><b>$${v4 ? b.p4 : b.p6}</b><span>${b.tb}TB</span></span><span class="u">$${costs[i].toFixed(2)}/TB</span></button>`).join("");
  }
  function renderNodes() {
    const xs = '<svg viewBox="0 0 16 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>';
    $("#nodes").innerHTML = S.nodes.map((n) => `
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
    if (!c.has) return `<div class="act-h"><strong>${t("fill")}</strong></div><p class="note">${t("fillHint", codes)}</p>`;
    const cfg = c.nextNodes ? t("cfgPlus", { n: c.nextNodes }) : t("cfgBase");
    const next = `<div class="next"><span class="tag">${t("next")}</span><span>${t("nextLine", { v: fmtGB(c.P), cfg: `<b>${cfg}</b>`, c: `<b class="num">${fmtUSD(c.nextCost)}</b>` })}</span></div>`;
    if (!c.opts.length) return `<div class="act-h"><strong>${t("enough")}</strong><span class="save">${t("leftEnd", { v: fmtGB(c.allow - c.P) })}</span></div>` + next;
    const b = c.best, zero = c.opts[0];
    const ex = c.exhaust ? " · " + t(c.lockedGB > 0 ? "exPast" : "exPred", { t: `<b>${fmtDate(c.exhaust)}</b>` }) : "";
    const head = b.N > 0 ? `<div class="act-h"><strong>${t("suggest", { n: b.N })}</strong><button class="btn ink sm" type="button" id="applyBtn" data-n="${b.N}">${t("apply")}</button></div>
         <div class="note">${c.plan ? t("planNote", { a: `<b>${fmtGB(c.ai)}</b>`, c: `<b>${fmtUSD(c.ci)}</b>` }) : t("from", { spec: `${ramLabel(c.b.ram)} IPv6-only`, t: `<b>${fmtDate(c.t0)}</b>` })} · ${t("saveV", { v: `<b style="color:var(--pool)">${fmtUSD(zero.total - b.total)}</b>` })}${ex}</div>` : `<div class="act-h"><strong>${t(c.lockedGB > 0 ? "optimal" : "noAdd")}</strong></div>`;
    const max = Math.max(...c.opts.map((o) => o.total), 0.01);
    const rows = b.N === 0 ? "" : c.opts.map((o) => `<div class="opt${o === b ? " best" : ""}"><span>${o.N ? t("optN", { n: o.N }) : t("optNone")}</span>
      <span class="bar" title="${t("barTip", { a: fmtUSD(o.add), o: fmtUSD(o.over) })}"><i style="width:${o.add / max * 100}%;background:var(--pool)"></i><i style="width:${o.over / max * 100}%;background:var(--bad)"></i></span>
      <span class="tot">${fmtUSD(o.total)}</span></div>`).join("");
    const lock = c.lockedGB > 0 ? `<div class="note">${t("locked", { v: `<b>${fmtGB(c.lockedGB)}</b>` })}</div>` : "";
    return head + rows + lock + next;
  }
  const LS_SPEC = { 0.5: [2, 20], 1: [2, 40], 2: [2, 60], 4: [2, 80], 8: [2, 160], 16: [4, 320], 32: [8, 640], 64: [16, 1280] };
  function costCode(c) {
    const [vcpu, disk] = LS_SPEC[c.b.ram] || LS_SPEC[1], n = Math.max(1, c.live);
    const gb = Math.round(c.has ? c.P : fullAllow(c.b) * n);
    const aud = /^eu-/.test(c.R.id) ? "eu" : /^ap-/.test(c.R.id) ? "ap" : "na";
    return ["1", "-", vcpu, c.b.ram, disk, n, gb, 0, 0, aud, 1, 500].join("_");
  }
  function refresh() {
    var _a;
    const c = compute();
    const band = $("#band"), money = (v) => `<span class="num">${fmtUSD(v)}</span>`;
    band.className = "band " + c.status;
    $("#bandIc").textContent = { idle: "?", good: "✓", warn: "!", bad: "!" }[c.status];
    $("#bandT").innerHTML = c.status === "good" ? t("bandGood") : c.status === "warn" ? t("bandWarn", { v: money(c.overCost) }) : c.status === "bad" ? t("bandBad", { v: money(c.overCost) }) : t("bandIdle");
    $("#bandSub").innerHTML = (c.plan ? t("planMode") + " · " : "") + (!c.has ? "" : c.status === "good" ? t("leftEnd", { v: `<b class="num">${fmtGB(c.allow - c.P)}</b>` }) : (c.exhaust ? t(c.lockedGB > 0 ? "exPast" : "exPred", { t: `<b>${fmtDate(c.exhaust)}</b>` }) + " · " : "") + t("lgOver", { v: `<b class="num">${fmtGB(c.overGB)}</b>` }));
    $("#usedWrap").classList.toggle("need", !c.has);
    const rec = $("#usedRec");
    rec.hidden = !c.hasU;
    if (c.hasU) rec.innerHTML = t("recorded", { t: `<b>${fmtDate(c.tU)}</b>`, v: `<b>${fmtGB(c.rate * DAY)}</b>` });
    const bl = $("#billLink");
    bl.href = BILL;
    bl.textContent = t("toBill") + " ↗";
    const sc = Math.max(c.allow, c.P, c.Unow, 1) * 1.02, pc = (v) => clamp(v / sc * 100, 0, 100) + "%", g = $("#gauge").children;
    const seg = (el, from, to) => {
      el.style.left = pc(from);
      el.style.width = to > from ? pc(to - from) : "0";
    };
    const A = c.allow, Un = c.has ? c.Unow : 0, Pn = c.has ? c.P : 0;
    seg(g[0], 0, Math.min(Un, A));
    seg(g[1], A, Math.max(A, Un));
    seg(g[2], Math.min(Un, A), Math.min(Pn, A));
    seg(g[3], Math.max(Un, A), Math.max(Pn, A));
    g[4].style.left = `calc(${pc(A)} - 1px)`;
    const label = (k) => t(k, { v: "" }).replace(/[\s:：(（]+$/, "");
    $("#flegend").innerHTML = `<span><i style="background:var(--pool)"></i>${label("lgUsed")}</span>` + (c.has ? `<span><i style="background:repeating-linear-gradient(-45deg,var(--pool) 0 2px,transparent 2px 4px)"></i>${label("lgEnd")}</span>` : "") + `<span><i style="background:var(--fg);width:3px"></i>${label("allowLbl")}</span>` + (c.overGB > 0 ? `<span class="ov"><i style="background:var(--bad)"></i>${label("lgOver")}</span>` : "");
    const remain = c.allow - c.Unow;
    $("#sAllow").textContent = fmtGB(c.allow);
    $("#sRemainL").textContent = t(remain >= 0 ? "remain" : "exceeded");
    const r = $("#sRemain");
    r.textContent = fmtGB(Math.abs(remain));
    r.className = "v " + (remain >= 0 ? "good" : "bad");
    const fc = $("#forecast");
    fc.placeholder = c.has ? String(Math.round(c.P)) : "—";
    if (document.activeElement !== fc) fc.value = (_a = S.forecast) != null ? _a : "";
    $("#sCost").innerHTML = fmtUSD(c.cost + c.overCost) + (c.overCost > 0 ? `<span class="lbl" style="display:block;white-space:normal;color:var(--bad)">${t("inclOver", { v: fmtUSD(c.overCost) })}</span>` : "");
    $("#act").innerHTML = actHTML(c);
    $("#fleetSum").textContent = t("fleetSum", { n: c.live, c: fmtUSD(c.cost) });
    const cl = $("#costLink");
    if (cl.dataset.base) cl.href = cl.dataset.base + "r/" + costCode(c);
    $("#netLbl").textContent = S.ipv4 ? `${t("dual")} $${c.b.p4}` : `IPv6-only $${c.b.p6}`;
    const hc = $("#halfChip");
    hc.hidden = !c.R.half;
    hc.textContent = t("half");
    $("#nodeSpec").textContent = c.ai <= 0 ? "" : c.plan ? t("planNote", { a: fmtGB(c.ai), c: fmtUSD(c.ci) }) : t("nodeAdd", { a: fmtGB(c.ai), c: fmtUSD(c.ci) });
    for (const n of S.nodes) {
      const row = document.querySelector(`.node[data-id="${n.id}"]`);
      if (!row) continue;
      row.querySelector("[data-meta]").innerHTML = `<b>+${fmtGB(n._allow)}</b> · ${fmtUSD(n._cost)}`;
      const ch = row.querySelector("[data-chip]");
      ch.hidden = !(n._planned || n._gone);
      ch.textContent = t(n._planned ? "planned" : "gone");
      const bad = n.end != null && n.start != null && n.end <= n.start;
      row.classList.toggle("bad", bad);
      row.querySelector("[data-err]").hidden = !bad;
      row.querySelector('[data-f="end"]').setAttribute("aria-invalid", bad ? "true" : "false");
    }
    const fcEl = $("#forecast");
    if (document.activeElement !== fcEl) fcError(S.forecast != null && S.used != null && +S.forecast < +S.used ? t("fcErr", { v: Math.round(+S.used) + " GB" }) : "");
    const off = -(/* @__PURE__ */ new Date()).getTimezoneOffset(), oh = Math.floor(Math.abs(off) / 60), om = Math.abs(off) % 60;
    $("#tzLbl").textContent = `(${t("localTime")} UTC${off >= 0 ? "+" : "-"}${oh}${om ? ":" + pad(om) : ""})`;
    $("#utcNote").textContent = t("utcNote", { t: fmtDate(c.m0) });
    $("#linkBanner").hidden = !linkLoaded;
    const cur = monthKey(/* @__PURE__ */ new Date()), ro = $("#rollover");
    ro.hidden = cur === S.month;
    if (!ro.hidden) $("#rolloverText").textContent = t("roll", { m: cur });
  }
  function full() {
    var _a, _b, _c;
    applyLang();
    $("#lang").value = LANG;
    $("#outRatio").value = S.outRatio;
    $("#outRatioV").textContent = S.outRatio + "%";
    $("#prorate").checked = S.prorate;
    $("#ipv4").checked = S.ipv4;
    $("#used").value = (_a = S.used) != null ? _a : "";
    $("#usedIn").value = (_b = S.usedIn) != null ? _b : "";
    $("#usedOut").value = (_c = S.usedOut) != null ? _c : "";
    $("#baseStart").value = toInput(S.baseStart);
    renderSizes();
    renderNodes();
    refresh();
  }
  const change = () => {
    save();
    refresh();
  };
  $("#lang").addEventListener("change", (e) => {
    const l = e.target.value;
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch (x) {
    }
    location.href = langHref(l);
  });
  $("#region").addEventListener("change", (e) => {
    S.region = e.target.value;
    save();
    renderSizes();
    refresh();
  });
  $("#sizes").addEventListener("click", (e) => {
    const b = e.target.closest("[data-size]");
    if (!b) return;
    S.size = +b.dataset.size;
    save();
    renderSizes();
    refresh();
  });
  $("#ipv4").addEventListener("change", (e) => {
    S.ipv4 = e.target.checked;
    save();
    renderSizes();
    refresh();
  });
  $("#baseStart").addEventListener("input", (e) => {
    S.baseStart = fromInput(e.target.value);
    change();
  });
  $("#used").addEventListener("input", (e) => {
    S.used = e.target.value === "" ? null : Math.max(0, +e.target.value);
    S.usedAt = Date.now();
    S.usedIn = S.usedOut = null;
    $("#usedIn").value = $("#usedOut").value = "";
    change();
  });
  const onPart = () => {
    var _a;
    const num = (el) => el.value === "" ? null : Math.max(0, +el.value || 0);
    S.usedIn = num($("#usedIn"));
    S.usedOut = num($("#usedOut"));
    S.used = S.usedIn == null && S.usedOut == null ? null : Math.round(((S.usedIn || 0) + (S.usedOut || 0)) * 100) / 100;
    S.usedAt = Date.now();
    $("#used").value = (_a = S.used) != null ? _a : "";
    change();
  };
  $("#usedIn").addEventListener("input", onPart);
  $("#usedOut").addEventListener("input", onPart);
  const fcBox = () => $("#forecast").parentNode, fcErr = $("#fcErr");
  const fcError = (msg) => {
    fcErr.textContent = msg || "";
    fcErr.hidden = !msg;
    fcBox().classList.toggle("err", !!msg);
    $("#forecast").setAttribute("aria-invalid", msg ? "true" : "false");
  };
  $("#forecast").addEventListener("input", (e) => {
    if (e.target.value === "") {
      fcError("");
      S.forecast = null;
      return change();
    }
    const v = +e.target.value;
    if (!(v >= 0)) return fcError(t("fcErr", { v: "0 GB" }));
    if (S.used != null && v < +S.used) return fcError(t("fcErr", { v: Math.round(+S.used) + " GB" }));
    fcError("");
    S.forecast = v;
    change();
  });
  $("#forecast").addEventListener("blur", (e) => {
    var _a;
    if (!fcErr.hidden) {
      e.target.value = (_a = S.forecast) != null ? _a : "";
      fcError("");
    }
  });
  $("#outRatio").addEventListener("input", (e) => {
    S.outRatio = +e.target.value;
    $("#outRatioV").textContent = S.outRatio + "%";
    change();
  });
  $("#prorate").addEventListener("change", (e) => {
    S.prorate = e.target.checked;
    change();
  });
  function addNodes(count) {
    const [m0, m1] = monthRange(S.month);
    S.nodes.push({ id: uid(), count, start: clamp(nextHour(Date.now()), m0, m1), end: null });
    save();
    renderNodes();
    refresh();
  }
  $("#addNode").addEventListener("click", () => addNodes(1));
  $("#act").addEventListener("click", (e) => {
    const b = e.target.closest("#applyBtn");
    if (b) addNodes(+b.dataset.n);
  });
  const nodeOf = (el) => {
    const r = el.closest(".node");
    return r && S.nodes.find((n) => n.id === r.dataset.id);
  };
  $("#nodes").addEventListener("input", (e) => {
    const n = nodeOf(e.target), f = e.target.dataset.f;
    if (!n || !f) return;
    if (f === "count") n.count = Math.max(1, Math.floor(+e.target.value || 1));
    if (f === "start") n.start = fromInput(e.target.value);
    if (f === "end") n.end = fromInput(e.target.value);
    change();
  });
  $("#nodes").addEventListener("click", (e) => {
    const n = nodeOf(e.target);
    if (!n) return;
    const step = e.target.closest("[data-step]");
    if (step) {
      n.count = Math.max(1, n.count + +step.dataset.step);
      e.target.closest(".node").querySelector('[data-f="count"]').value = n.count;
      change();
    }
    if (e.target.closest("[data-del]")) {
      S.nodes = S.nodes.filter((x) => x !== n);
      save();
      renderNodes();
      refresh();
    }
  });
  $("#rolloverBtn").addEventListener("click", () => {
    var _a;
    const cur = monthKey(/* @__PURE__ */ new Date()), [m0] = monthRange(cur);
    S.nodes = S.nodes.filter((n) => n.end == null || n.end > m0).map((n) => {
      var _a2;
      return Object.assign(n, { start: Math.max((_a2 = n.start) != null ? _a2 : m0, m0) });
    });
    S.baseStart = Math.max((_a = S.baseStart) != null ? _a : m0, m0);
    Object.assign(S, { month: cur, used: null, usedAt: null, usedIn: null, usedOut: null, forecast: null });
    save();
    full();
  });
  const HOLD_MS = 1e3;
  let holdTimer = 0, tipTimer = 0;
  function resetLabel(tip) {
    const b = $("#resetBtn");
    b.classList.toggle("tip", tip);
    $("#resetHint").hidden = !tip && !b.classList.contains("hold");
    $("#resetBtn span").textContent = t(tip || b.classList.contains("hold") ? "resetHold" : "reset");
  }
  function startHold(e) {
    if (e.button > 0) return;
    const b = $("#resetBtn");
    clearTimeout(tipTimer);
    b.classList.remove("hold");
    void b.offsetWidth;
    b.classList.add("hold");
    resetLabel(false);
    if (e.pointerId != null) try {
      b.setPointerCapture(e.pointerId);
    } catch (x) {
    }
    holdTimer = setTimeout(() => {
      disarmReset();
      try {
        localStorage.removeItem(KEY);
        localStorage.removeItem(OLD_KEY);
      } catch (x) {
      }
      S = defaults();
      save();
      $("#settings").open = false;
      full();
    }, HOLD_MS);
  }
  function endHold() {
    const b = $("#resetBtn");
    if (!b.classList.contains("hold")) return;
    clearTimeout(holdTimer);
    b.classList.remove("hold");
    resetLabel(true);
    clearTimeout(tipTimer);
    tipTimer = setTimeout(() => resetLabel(false), 2200);
  }
  function disarmReset() {
    clearTimeout(holdTimer);
    clearTimeout(tipTimer);
    $("#resetBtn").classList.remove("hold");
    resetLabel(false);
  }
  const rb = $("#resetBtn");
  rb.addEventListener("pointerdown", startHold);
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => rb.addEventListener(ev, endHold));
  rb.addEventListener("contextmenu", (e) => e.preventDefault());
  rb.addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) {
      e.preventDefault();
      startHold(e);
    }
  });
  rb.addEventListener("keyup", (e) => {
    if (e.key === " " || e.key === "Enter") endHold();
  });
  rb.addEventListener("blur", endHold);
  $("#settings").addEventListener("toggle", () => {
    if (!$("#settings").open) disarmReset();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!$("#help").hidden) closeHelp();
    else if (!$("#agent").hidden) closeAgent();
    else $("#settings").open = false;
  });
  $("#linkUndo").addEventListener("click", () => {
    try {
      if (linkBackup == null) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, linkBackup);
    } catch (e) {
    }
    S = load();
    linkLoaded = false;
    full();
  });
  async function copyText(s) {
    try {
      await navigator.clipboard.writeText(s);
      return true;
    } catch (x) {
      try {
        const ta = document.createElement("textarea");
        ta.value = s;
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        ta.remove();
        return ok;
      } catch (y) {
        return false;
      }
    }
  }
  function siteBase() {
    const canon = document.querySelector('link[rel="canonical"]');
    return canon ? new URL(canon.href).origin + "/" : location.origin + location.pathname;
  }
  $("#copyLinkBtn").addEventListener("click", async (e) => {
    const btn = e.currentTarget, url = buildLink(fromState(S), siteBase() + LANG_PATHS[LANG]);
    const ok = await copyText(url);
    const label = btn.querySelector("span");
    label.textContent = ok ? t("copied") : url;
    setTimeout(() => {
      label.textContent = t("copyLink");
    }, 1800);
  });
  $("#exportBtn").addEventListener("click", () => {
    try {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: "application/json" }));
      a.download = `lightsail-pool-${S.month}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
    }
  });
  $("#importFile").addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (!f) return;
    f.text().then((txt) => {
      const s = JSON.parse(txt);
      if (valid(s)) {
        S = sanitize(s);
        save();
        full();
      }
    }).catch(() => {
    });
    e.target.value = "";
  });
  $("#sampleBtn").addEventListener("click", () => {
    const [m0, m1] = monthRange(S.month), now = clamp(Date.now(), m0 + DAY, m1), el = (now - m0) / DAY;
    Object.assign(S, {
      size: 1,
      ipv4: true,
      baseStart: m0,
      used: Math.round(el * 125),
      usedAt: now,
      usedIn: null,
      usedOut: null,
      forecast: null,
      nodes: [{ id: uid(), count: 1, start: m0 + 10 * DAY < now ? m0 + 10 * DAY : m0, end: null }]
    });
    save();
    full();
    $("#settings").open = false;
  });
  document.addEventListener("click", (e) => {
    const d = $("#settings");
    if (d.open && !d.contains(e.target)) d.open = false;
  });
  const THEMES = ["system", "light", "dark"];
  let theme = "system";
  try {
    theme = localStorage.getItem(THEME_KEY) || "system";
  } catch (e) {
  }
  if (!THEMES.includes(theme)) theme = "system";
  function applyTheme() {
    if (theme === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll("#themeSeg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.t === theme)));
  }
  $("#themeSeg").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    theme = b.dataset.t;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (x) {
    }
    applyTheme();
  });
  applyTheme();
  function fitHeader() {
    const top = $(".top"), tools = $(".tools"), brand = $(".brand-row");
    const gap = parseFloat(getComputedStyle(tools).columnGap);
    const rowWidth = () => {
      const items = [...tools.children].filter((el) => el.offsetWidth);
      return items.reduce((s, el) => s + el.offsetWidth, 0) + (items.length - 1) * gap;
    };
    const fits = () => {
      const cs = getComputedStyle(top), oneCol = cs.gridTemplateColumns.trim().split(/\s+/).length === 1;
      return rowWidth() + (oneCol ? 0 : brand.scrollWidth + parseFloat(cs.columnGap)) <= top.clientWidth + 1;
    };
    top.classList.remove("stack", "compact");
    if (fits()) return;
    top.classList.add("compact");
    if (fits()) return;
    top.classList.remove("compact");
    top.classList.add("stack");
  }
  addEventListener("resize", fitHeader);
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(fitHeader);
    [$(".brand-row h1"), ...$(".tools").children].forEach((el) => ro.observe(el));
  }
  const CASE_PERM = ["none", "none", "none", "none", "ro", "rw"];
  const AG_ICON_INFO = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="8" cy="8" r="6.2"/><path d="M8 7.2v3.6M8 5.2v.1"/></svg>';
  const AG_ICON_WARN = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.2l6.2 11H1.8z"/><path d="M8 6.6v3M8 11.4v.1"/></svg>';
  const AG_ICON_COPY = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5"/></svg>';
  const AG_ICON_OK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>';
  let agTab = "start", agCopies = [];
  const escH = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  function renderAgent() {
    const A = I18N[LANG].ag, base = siteBase(), llms = base + "llms.txt";
    const copyBtn = (text, label) => {
      agCopies.push(text);
      return `<button class="btn sm" type="button" data-copy="${agCopies.length - 1}" data-label="${escH(label)}">${escH(label)}</button>`;
    };
    const copyIc = (text, label) => {
      agCopies.push(text);
      return `<button class="copy-ic" type="button" data-copy="${agCopies.length - 1}" data-icon="1" title="${escH(label)}" aria-label="${escH(label)}">${AG_ICON_COPY}</button>`;
    };
    const sub = (s, v) => {
      for (const p in v) s = s.split("{" + p + "}").join(v[p]);
      return s;
    };
    agCopies = [];
    $("#agentT").textContent = A.title;
    $("#agentSub").textContent = A.sub;
    $("#agentX").title = A.close;
    $("#agentX").setAttribute("aria-label", A.close);
    $("#tab-start").textContent = A.tabs[0];
    $("#tab-cases").textContent = A.tabs[1];
    $("#tab-dev").textContent = A.tabs[2];
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
    document.querySelectorAll(".ag-body [role=tabpanel]").forEach((p) => {
      const was = p.hidden;
      p.hidden = false;
      max = Math.max(max, p.offsetHeight);
      p.hidden = was;
    });
    body.style.height = Math.ceil(max + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)) + "px";
    body.style.height = body.offsetHeight + "px";
    agMore();
  }
  function agMore() {
    const bd = $(".ag-body");
    $(".dialog.ag").classList.toggle("more", bd.scrollTop + bd.clientHeight < bd.scrollHeight - 2);
  }
  $(".ag-body").addEventListener("scroll", agMore, { passive: true });
  addEventListener("resize", sizeAgent);
  function showAgentTab(id, focus) {
    agTab = id;
    document.querySelectorAll("#agentTabs [role=tab]").forEach((b) => {
      const on = b.dataset.tab === id;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      $("#pane-" + b.dataset.tab).hidden = !on;
      if (on && focus) b.focus();
    });
    $(".ag-body").scrollTop = 0;
    agMore();
  }
  const tool = (id) => {
    var _a;
    const host = (_a = document.querySelector(`meta[name="${id}"]`)) == null ? void 0 : _a.content;
    return host && /^https:\/\/[^/]+\/?$/.test(host) ? host.replace(/\/$/, "") + "/" + LANG_PATHS[LANG] : "";
  };
  const m2c = tool("m2c"), cost = tool("cost");
  if (m2c) {
    $("#m2cLink").href = m2c + "aws/";
    $("#m2cRow").hidden = false;
  }
  if (cost) {
    $("#costLink").dataset.base = cost;
    $("#costRow").hidden = false;
    refresh();
  }
  let helpIdx = 0;
  const helpQs = $$("#helpNav [data-hq]"), helpN = helpQs.length;
  $("#helpSel").innerHTML = helpQs.map((b, i) => `<option value="${i}">${i + 1} / ${helpN} · ${escH(b.textContent)}</option>`).join("");
  function showHelp(i) {
    helpIdx = Math.max(0, Math.min(helpN - 1, i));
    helpQs.forEach((b) => b.setAttribute("aria-selected", +b.dataset.hq === helpIdx));
    $$("#helpC [data-hqb]").forEach((a) => {
      a.hidden = +a.dataset.hqb !== helpIdx;
    });
    $("#helpSel").value = helpIdx;
    $$("[data-hstep]").forEach((b) => {
      b.disabled = helpIdx + +b.dataset.hstep < 0 || helpIdx + +b.dataset.hstep >= helpN;
    });
    $("#helpC").scrollTop = 0;
  }
  function openHelp() {
    $("#settings").open = false;
    showHelp(helpIdx);
    $("#help").hidden = false;
    document.documentElement.style.overflow = "hidden";
    (helpQs[helpIdx].offsetParent ? helpQs[helpIdx] : $("#helpSel")).focus();
  }
  function closeHelp() {
    $("#help").hidden = true;
    document.documentElement.style.overflow = "";
    $("#helpBtn").focus();
  }
  $("#helpBtn").addEventListener("click", openHelp);
  $$("#help [data-hclose]").forEach((b) => b.addEventListener("click", closeHelp));
  $("#help").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeHelp();
  });
  helpQs.forEach((b) => b.addEventListener("click", () => showHelp(+b.dataset.hq)));
  $("#helpNav").addEventListener("keydown", (e) => {
    const d = { ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    showHelp(helpIdx + d);
    helpQs[helpIdx].focus();
  });
  $("#helpSel").addEventListener("change", (e) => showHelp(+e.target.value));
  $$("[data-hstep]").forEach((b) => b.addEventListener("click", () => showHelp(helpIdx + +b.dataset.hstep)));
  function openAgent() {
    $("#settings").open = false;
    $("#agent").hidden = false;
    sizeAgent();
    document.documentElement.style.overflow = "hidden";
    $("#tab-" + agTab).focus();
  }
  function closeAgent() {
    $("#agent").hidden = true;
    document.documentElement.style.overflow = "";
    $("#agentBtn").focus();
  }
  $("#agentBtn").addEventListener("click", openAgent);
  $("#agentX").addEventListener("click", closeAgent);
  $("#agent").addEventListener("click", async (e) => {
    if (e.target === e.currentTarget) return closeAgent();
    const tab = e.target.closest("[role=tab]");
    if (tab) return showAgentTab(tab.dataset.tab, false);
    const b = e.target.closest("[data-copy]");
    if (!b) return;
    const ok = await copyText(agCopies[+b.dataset.copy]);
    clearTimeout(b._t);
    if (b.dataset.icon) {
      b.innerHTML = ok ? AG_ICON_OK : "✕";
      b.classList.toggle("ok", ok);
      b._t = setTimeout(() => {
        b.innerHTML = AG_ICON_COPY;
        b.classList.remove("ok");
      }, 1600);
    } else {
      b.textContent = ok ? t("copied") : "✕";
      b._t = setTimeout(() => {
        b.textContent = b.dataset.label;
      }, 1600);
    }
  });
  $("#agentTabs").addEventListener("keydown", (e) => {
    const ids = ["start", "cases", "dev"], i = ids.indexOf(agTab);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      showAgentTab(ids[(i + (e.key === "ArrowRight" ? 1 : 2)) % 3], true);
    }
  });
  full();
  setInterval(refresh, 6e4);
})();
