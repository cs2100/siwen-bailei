# 思文败类

基于 Hugo 的个人文学站，无外部主题依赖，部署到 GitHub Pages。需要 Hugo extended 0.158 或更高版本（本工程用 0.169.0 测试）。

## 栏目结构

| 显示名 | 目录 | 说明 |
|---|---|---|
| 茑萝漫笔 | `content/manbi/` | 随笔、散文、博文、时评。一篇一个文件夹，用 `tags` 区分类型 |
| 知也书话 | `content/shuhua/` | 文学批评 |
| 文库 | `content/wenku/` | 文集和小说放在一起。每部书（文集、长篇、中篇）一个文件夹，短篇直接放在这一层 |

顶部导航只放"精选 / 全部 / 此刻 / 关于 / 搜索"，三个栏目的入口在首页的"栏目"卡片里。

```
content/
├── manbi/文章名/index.md
├── shuhua/文章名/index.md
└── wenku/
    ├── _index.md                       书架（分组：文集 / 长篇 / 中篇 / 短篇）
    ├── qingchun-canxiang/              《青春残像》，_index.md 里写 form: "文集"
    │   ├── _index.md                   封面、简介、序言
    │   ├── cover.jpg                   书的封面
    │   └── 篇名/index.md + 图片        一篇文章 = 一个文件夹
    ├── 某长篇/                         _index.md 里写 form: "长篇"，下面是章节文件夹
    └── 某短篇/index.md                 短篇，不需要章节
```

栏目显示名在各自 `_index.md` 的 `title` 里改，随时可改。**目录名是网址的一部分**，定好后尽量别动。

## 本地预览

```bash
hugo server -D
```

预览地址看终端最后一行。因为 `hugo.toml` 里的 `baseURL` 带有 `/siwen-bailei/`，所以地址是 `http://localhost:1313/siwen-bailei/`。想用 `http://localhost:1313/`，运行：

```bash
hugo server -D --baseURL http://localhost:1313/
```

搜索页本地不可用（索引在部署时生成）。

## 整理上传一篇旧文（文集）

1. 在对应文集文件夹里新建文章文件夹，如 `content/wenku/qingchun-canxiang/ye-yu/`。
2. 在里面放 `index.md`，和这篇文章的封面图、插图。
3. `index.md` 顶部写：

```yaml
---
title: "夜雨"
date: 2006-05-20          # 原文写作日期（目录和归档按它排）
lastmod: 2026-11-02       # 上传日期（首页"最近"按它排）
weight: 12                # 在这本书里的顺序，数字小的在前
description: "一句话摘要"
cover: "cover.jpg"        # 本篇封面，可选
cover_alt: "封面图说明"
cover_caption: "图注，可选"
tags: ["怀旧"]
---
```

4. 正文里插图：

```markdown
![图片说明](fig1.jpg "显示在图下面的图注")
```

图片说明给读屏软件，引号里的图注可省略。图片放在文章同一个文件夹里，放原图就行，网站会自动缩放、懒加载。

文集的章节顺序靠 `weight`：建议隔十留空（10、20、30），以后插入文章不用全部重排。

## 写长篇、中篇

1. 在 `content/wenku/` 下新建作品文件夹，里面写 `_index.md`（参考 `sample-long`），`form` 填"长篇"或"中篇"，`layout: book` 不能漏。
2. 每章一个文件夹，`weight` 控制章序。
3. `status` 可写"连载中"、"已完结"等，显示在书架和书页。

短篇直接新建 `content/wenku/篇名/index.md`，不需要章节。

私小说或需要声明的作品，在文章 front matter 里加：

```yaml
disclaimer: "本篇为私小说：取材于个人经验，细节经过改写，请勿对号入座。"
```

## 首页和归档

- 首页"最近"按 `lastmod` 排，没写则按 `date`。
- `/archive/`（全部）按 `date` 分年份，旧文会出现在对应的年份下。
- 文章写 `favorite: true` 会出现在首页"精选"和 `/essentials/`。

## 首次上线

1. 在 GitHub 新建仓库，把本目录推上去（分支 `main`）。
2. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
3. 推送后在 **Actions** 页看部署进度，完成后访问 `https://<用户名>.github.io/<仓库名>/`。
4. 修改 `hugo.toml` 里的 `baseURL`（改成上面那个地址）和 `params.email`。
5. **发布前清理示例内容**：删除 `manbi/hello-world`、`shuhua/sample-review`、`wenku/sample-long`、`wenku/sample-short`，以及两本文集下名为 `ch*-sample` 的文章文件夹。两本文集本身（`qingchun-canxiang`、`qinggui-hechu`）保留，把里面的 `cover.jpg`、简介换成你自己的。

## 自定义域名

1. `static/CNAME` 文件里写一行域名，如 `siwen.example.com`。
2. 域名 DNS 添加 CNAME 记录，指向 `<用户名>.github.io`。
3. Settings → Pages 填入域名，勾选 Enforce HTTPS。
4. `hugo.toml` 的 `baseURL` 改成 `https://你的域名/`。

大陆访问 GitHub Pages 可能较慢。同一个仓库也可以接入 Cloudflare Pages：构建命令 `hugo --gc --minify && npx -y pagefind --site public`，输出目录 `public`，环境变量 `HUGO_VERSION=0.169.0`。

## 评论（可选）

默认关闭。到 https://giscus.app 按指引启用 GitHub Discussions，把生成的 `repo`、`repoId`、`category`、`categoryId` 填进 `hugo.toml` 的 `[params.giscus]` 并把 `enabled` 改为 `true`。

## 繁体（正體）切换

顶部导航有一个"繁"按钮，点一下整站实时转成正體字，再点"简"换回。文章只需写简体，转换在浏览器里完成（用 OpenCC，库文件在 `static/js/opencc-cn2t.js`，点"繁"才下载）。

- `hugo.toml` 的 `traditional = false` 可关掉按钮；`traditionalVariant` 可选 `tw`（台湾正體，只转字形）、`twp`（再转台湾用词，如"软件"→"軟體"）、`hk`（香港）。
- 某段文字不想被转换，用 `<span class="ignore-opencc">……</span>` 包起来。
- 搜索页用的是简体索引，输入繁体关键词搜不到，请用简体搜索。

## 其他

- 配色与字体：`assets/css/main.css` 顶部的变量。
- 增减栏目：在 `content/` 新建目录与 `_index.md`，把目录名加进 `hugo.toml` 的 `postSections`，首页卡片会自动出现；想放进顶部导航，再加一条 `[[menus.main]]`。
- 文库书架用 `layout: shelf`，单部书用 `layout: book`，普通栏目不写 layout。
- 图片版权：插图请使用自己拍摄、自己创作或有授权的图片。
