# 数据库集合与安全规则（日语学习站 · あお老师）

本站所有数据读写都通过云函数完成（云函数以管理员身份访问数据库，不受安全规则限制）。
所以最安全的做法是：**4 个集合全部禁止网页端直接读写**。

设置位置：云开发控制台 → 文档型数据库 → 集合管理 → 选中集合 → 「权限管理」→「切换到安全规则」→ 粘贴规则 → 保存。
（菜单名称可能随控制台改版变化，以控制台为准。）

## 需要新建的集合

| 集合名 | 用途 | 文档 ID | 谁来写 |
| --- | --- | --- | --- |
| `profiles` | 用户昵称 | 用户 uid | 云函数 `profile` |
| `progress` | 学习进度、本周经验（排行榜） | 用户 uid | 云函数 `progress` |
| `inquiries` | 课程 / 口译咨询表单 | 自动生成 | 云函数 `inquiry` |
| `ratelimits` | 咨询表单防刷记录（自动清理 1 天前的） | 自动生成 | 云函数 `inquiry` |

## 推荐安全规则（4 个集合都一样）

```json
{
  "read": false,
  "write": false
}
```

含义：网页端任何人（包括已登录用户）都不能直接读写，只能通过云函数：

- 用户只能读写**自己的**进度和昵称：云函数从登录上下文取 uid，不接受前端传来的 uid。
- 咨询表单（inquiries）只能经云函数写入；网页端无法读取任何人的咨询内容。站长在控制台查看。
- 排行榜只能经云函数读取，且只返回「昵称 + 本周经验」，不会泄露邮箱或 uid。

## 备选规则（仅当将来想让网页端直接读写自己的数据时）

`profiles`、`progress` 文档里都存有 `uid` 字段，可改为「仅本人可读写」：

```json
{
  "read": "doc.uid == auth.uid",
  "write": "doc.uid == auth.uid"
}
```

> 网页端用户在规则中使用 `auth.uid`（小程序用 `auth.openid`）。当前代码**不需要**这条规则，保持上面的 `false` 即可。
> `inquiries` 和 `ratelimits` 无论如何都应保持 `false`。

## 建议创建的索引（提升速度，数据量小时可不建）

控制台 → 文档型数据库 → 选中集合 → 「索引管理」→ 新建索引：

| 集合 | 索引字段 | 用途 |
| --- | --- | --- |
| `progress` | `weekKey` 升序 + `weekXp` 降序 | 周排行榜 |
| `ratelimits` | `key` 升序 + `ts` 降序 | 防刷计数 |
| `inquiries` | `createdAt` 降序 | 控制台按时间查看 |

## 字段说明

- `profiles`：`{ uid, nickname, createdAt, updatedAt }`
- `progress`：`{ uid, nickname?, xp, streak, lastCheckin, checkins[], best{ kanaQuiz }, weekKey, weekXp, updatedAt, createdAt }`
- `inquiries`：`{ type, name, contact, course? / field?, date, message, uid, isAnonymous, status: "new", createdAt }`
- `ratelimits`：`{ key, uid?, ts }`（IP 只存哈希值，不存明文）
