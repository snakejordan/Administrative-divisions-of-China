const path = require('path')
const fs = require('fs')

/**
 * 递归创建目录（同步方法）
 * @author Snake <snakejordan@gmail.com>
 * @param dirname {string} 目录名称，可以相对路径或绝对路径。
 * @returns {boolean}
 */
exports.checkDirsSync = (dirname) => {
  // 获取物理路径
  let realDirname = path.resolve(__dirname, dirname)
  // 如果目录存在则返回，否则递归创建。
  if (fs.existsSync(realDirname)) {
    return true
  } else {
    if (this.checkDirsSync(path.dirname(realDirname))) {
      fs.mkdirSync(realDirname)
      return true
    }
  }
}
