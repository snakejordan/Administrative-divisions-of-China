const config = require('./config')
const utils = require('./utils')
const sqlite = require('./sqlite')
const worker = require('./worker')

async function main () {
  // 检查数据路径是否存在，不存在则递归创建。
  utils.checkDirsSync(config.dataPath)
  await sqlite.init()
  await worker.fetchVillages()
  // await worker.patch()

  console.log('[100%] 数据抓取完成！')
}

main().then(() => process.exit(0)).catch(e => {
  console.log(e)
  process.exit(-1)
})
