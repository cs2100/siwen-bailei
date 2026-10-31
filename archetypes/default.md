---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}      # 文章日期。整理旧文时请改成原文写作日期
lastmod: {{ .Date }}   # 上传/更新日期，决定首页"最近"的排序；旧文保留上传当天
description: ""        # 一句话摘要，用于目录和分享卡片
tags: []
favorite: false        # true 则出现在首页"精选"
draft: true            # 写完改成 false 再发布
# cover: "cover.jpg"   # 封面图（放在本文件夹里），需要时取消注释
# weight: 1            # 在书里的顺序（文集、长篇的章节需要）
---

