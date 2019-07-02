## 比较某两次提交 差异

```
git diff commitid1 commitid2
eg:
git diff ae931c35228dc8a80f33aad20e44980ceafc85f8 796a791241bfef7f5426bb631be9c430a25acc2a
```

## 比较当前版本(最近一次 commit 的 id 号) 和 某一次提交差异，使用 `head` 指针，`head~2`指针指向第二父提交

```
git diff head 796a791241bfef7f5426bb631be9c430a25acc2a
```

## 比较某两次提交某一文件的差异

```
git diff head 796a791241bfef7f5426bb631be9c430a25acc2a -- src/utils/index.js
```
