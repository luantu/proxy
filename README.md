# corplink-proxy-list

基于 GreatFire 探测结果整理的**被墙域名清单**，提供标准 Mihomo / Clash `rule-provider` 格式（YAML）与纯文本（TXT）两种形式，可直接被在线引用。

## 文件说明

| 文件 | 格式 | 用途 |
| --- | --- | --- |
| `greatfire-domains.yaml` | YAML（`behavior: domain`，`+.domain` 前缀） | Mihomo / Clash rule-provider，子域名通配 |
| `greatfire-domains.txt` | 纯文本（每行一个域名） | 简单列表 / 脚本批量处理 |

- 域名总数：**17,651**
- 数据来源：`greatfire-feilian-fz-int-results.csv`（GreatFire 对指定站点集合的连通性探测，含 FZ-INT 翻墙白名单站点）
- 已做清洗：转小写、去重、格式校验（无 IP、无非法字符）

## 在线引用

### Mihomo / Clash（YAML rule-provider）

在 `rule-providers` 段声明：

```yaml
rule-providers:
  greatfire:
    type: http
    behavior: domain
    url: "https://raw.githubusercontent.com/luantu/corplink-proxy-list/main/greatfire-domains.yaml"
    path: ./ruleset/greatfire-domains.yaml
    interval: 86400
```

在 `rules` 段引用：

```yaml
rules:
  - RULE-SET,greatfire,SG-PROXY
  - MATCH,DIRECT
```

> `+.domain` 前缀表示精确域名及其所有子域名都命中规则。

### 纯文本（TXT）

```
https://raw.githubusercontent.com/luantu/corplink-proxy-list/main/greatfire-domains.txt
```

## 数据格式说明

原始 CSV 中的每条记录包含 `domain / test_url / http_code / curl_exit / time_s / bytes / classification` 字段。当前清单仅取 `domain` 字段（去重后共 17,651 个），未按可访问性分类过滤——所有被探测站点一律收录。

如果你希望只保留「确实可达」（如 `http_2xx` / `http_4xx_reachable`）或排除某些分类的域名，可以在本仓库提 Issue 或自行用 `classification` 字段过滤。

## 许可证

[MIT](LICENSE)
