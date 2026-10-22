/*
 * 日语学习站 · あお老师 —— 站点配置
 *
 * envId 留空 = 离线 / 演示模式：
 *   - 不加载云开发 SDK，所有数据只保存在本机浏览器（localStorage）
 *   - 登录、排行榜、咨询表单等联网功能不可用
 *
 * 上线时：把 envId 改成你在腾讯云「云开发」控制台看到的环境 ID（形如 "breeze-1a2b3c"）。
 * 这里的值都可以公开，不是密码；SMTP 授权码等机密绝对不要写在这里！
 */
window.BREEZE_CONFIG = {
  // 云开发环境 ID，留空即离线模式
  envId: "",

  // 环境所在地域，创建环境时选的是哪个就填哪个（默认上海）
  region: "ap-shanghai",

  // 官方 CDN 上的 CloudBase JS SDK v2 完整版。
  // 注意：官方文档要求固定 2.x 版本号，"latest" 已指向 v3（API 不同）。
  sdkUrl: "https://static.cloudbase.net/cloudbase-js-sdk/2.28.6/cloudbase.full.js"
};
