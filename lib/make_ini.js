const config = require('./config')
const utils = require('./utils')
const path = require('path')
const fs = require('fs')

// 检查数据路径是否存在，不存在则递归创建。
utils.checkDirsSync(config.dataPath)

// 为 sh 文件准备 .ini 格式的配置文件，由于 package.json 执行的原因，相对路径有变化，所以把 ../ 替换为 ./
fs.writeFileSync(
  path.resolve(__dirname, 'config.ini'),
  `dataPath='${config.dataPath.replace('../', './')}'`
)
