/**
 * 覆写脚本：注入 greatfire rule-provider，并在 rules 第一条插入引用规则
 *
 * 适用客户端：
 *   - Mihomo Party   （设置 → 覆写 → 脚本）
 *   - Clash Verge Rev（设置 → 全局扩展脚本 / 覆写脚本）
 *
 * 行为：
 *   1. 向 config['rule-providers'] 注入 greatfire（已存在则跳过）
 *   2. 在 config.rules 第一条插入 "RULE-SET,greatfire,SG-OpenAI"（已存在则跳过）
 *
 * 脚本是幂等的：客户端每次刷新配置都会执行，重复执行不会产生重复条目。
 *
 * 注意：
 *   - 规则插到第一条意味着优先匹配，请确认 SG-OpenAI 策略组在你的配置中已存在；
 *   - path 相对配置目录，首次运行会自动下载 provider 到 ./ruleset/greatfire-domains.yaml。
 */
function main(config) {
  'use strict';

  // ---------- 1. 注入 rule-provider ----------
  config['rule-providers'] = config['rule-providers'] || {};
  if (!config['rule-providers']['greatfire']) {
    config['rule-providers']['greatfire'] = {
      type: 'http',
      behavior: 'domain',
      url: 'https://raw.githubusercontent.com/luantu/corplink-proxy-list/main/greatfire-domains.yaml',
      path: './ruleset/greatfire-domains.yaml',
      interval: 86400
    };
  }

  // ---------- 2. 在 rules 第一条插入 ----------
  if (!Array.isArray(config.rules)) {
    config.rules = [];
  }

  var rule = 'RULE-SET,greatfire,SG-OpenAI';
  var exists = config.rules.some(function (r) {
    var s = Array.isArray(r) ? r.join(',') : String(r);
    return s.indexOf('RULE-SET,greatfire') === 0;
  });

  if (!exists) {
    config.rules.unshift(rule);
  }

  return config;
}
