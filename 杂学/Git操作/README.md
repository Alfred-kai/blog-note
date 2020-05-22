# Git 日常操作总结

[git 总结](https://zhuanlan.zhihu.com/p/137194960?utm_source=wechat_timeline&utm_medium=social&utm_oi=684333080936845312&from=timeline)

<span id="top">目录</span>

- [比较某两次提交差异](#1)
- [比较当前版本和某一次提交差异](#2)
- [比较某两次提交某一文件差异](#3)
- [还原已经删除的本地分支](#4)
- [合并两个本地分支](#5)
- [创建本地分支](#6)
- [查看本地代码 连接几个源](#7)
- [删除本地连接的源](#8)
- [本地分支和远程源连接](#9)
- [配置多个 ssh-key](https://www.jianshu.com/p/4e4ec9cc4753)

### <span id="1">:palm_tree: 比较某两次提交 差异</span>

```
git diff commitid1 commitid2
eg:
git diff ae931c35228dc8a80f33aad20e44980ceafc85f8 796a791241bfef7f5426bb631be9c430a25acc2a
```

[:arrow_heading_up: 回顶部](#top)

### <span id="2">:palm_tree: 比较当前版本(最近一次 commit 的 id 号) 和 某一次提交差异，使用 `head` 指针，`head~2`指针指向第二父提交<span>

```
git diff head 796a791241bfef7f5426bb631be9c430a25acc2a
```

[:arrow_heading_up: 回顶部](#top)

### <span id="3">:palm_tree: 比较某两次提交某一文件的差异</span>

```
git diff head 796a791241bfef7f5426bb631be9c430a25acc2a -- src/utils/index.js
```

[:arrow_heading_up: 回顶部](#top)

### <span id="4">:palm_tree: 还原已经删除的本地分支</span>

- **已经退出 terminal**

  查看你上一次 commit SHA1 值

  ```
  git reflog
  ```

  红色文字一般代表删除的分支，查看想要还原的分支及其前面的 SHA1 值

  ```
  git branch branchName <sha1>
  ```

- **没有退出 terminal**

  ```
  git branch 你的分支名  SHA1值
  ```

  **demo:**

  ```
  user@MY-PC /C/MyRepo (master)
  $ git branch -d req-remove-wk
  Deleted branch req-remove-wk (was 130d7ba).    <-- This is the SHA1 we need to restore it!

  user@MY-PC /C/MyRepo (master)
  $ git branch req-remove-wk 130d7ba

  ```

### <span id="5">:palm_tree: 合并两个本地分支</span>

加入要将 A 本地分支合并到 B 本地分支，首先切换到 B 分支

```
git merge A
```

### <span id="6">:palm_tree: 创建本地分支</span>

```
git branch test

```

### <span id="7">:palm_tree: 查看本地代码 连接几个源</span>

```javascript
git remote
```

### <span id="8">:palm_tree: 删除本地连接的源 </span>

```javascript
git remote remove [name]
```

### <span id="9">:palm_tree: 本地连接源 相关命令 </span>

![img](https://alfred-github.oss-cn-shanghai.aliyuncs.com/document/git/git-remote.png "git remote")

### <span id="10">:palm_tree: 本地分支和远程源连接 </span>

```javascript
git push --set-upstream origin dev


git remote add origin https://github.com/Alfred-kai/sword.git
git push -u origin master

```

### <span id="11">:palm_tree: 基于远程分支 新建分支 相关命令 </span>

```
git checkout -b dev_wk origin/dev_wk

```
