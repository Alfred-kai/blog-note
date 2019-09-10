fs.readFile

```
const readFile = function(fileName) {
  return new Promise(function(resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

const asyncReadFile = async function() {
  const f1 = await readFile("./build/a.txt");
  const f2 = await readFile("./build/b.txt");

  console.log(f1.toString());
  console.log(f2.toString());
};
```

删除指定文件夹下的所有文件和文件夹及其子文件

```
rmDirAndFile = (dir, EmptyDir) => {
  const result = fs.readdirSync(dir);
  console.log(result);
  // 删除文件
  result.map((path, index, arr) => {
    const filePath = `${dir}/${path}`;
    if (fs.lstatSync(filePath).isDirectory()) {
      rmDirAndFile(filePath, EmptyDir);
      EmptyDir.push(filePath);
      return;
    }
    fs.unlinkSync(filePath);
  });
  // 删除空文件夹
  EmptyDir &&
    EmptyDir.map(() => {
      fs.rmdirSync(EmptyDir.pop());
    });
};

finalRm = (() => {
  var EmptyDir = [];
  return function(dir) {
    rmDirAndFile(dir, EmptyDir);
  };
})();

finalRm("./build");
```
