const config = require('./config')
const http = require('http')

const iconv = require('iconv-lite')
const minify = require('html-minifier').minify
const BufferHelper = require('bufferhelper')

/*
 * 命名简写备注
 *
 * 省级（省份，Province）           p
 * 地级（城市，City）               c
 * 县级（区县，Area）               a
 * 乡级（乡镇街道，Street）         s
 * 村级（村委会居委会，Village）    v
 */

const pReg = /<td><a href='(.*?).html'>(.*?)<br><\/a><\/td>/g
const casReg = /<tr class='.*?'><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>/g
const vReg = /<tr class='.*?'><td>(.*?)<\/td><td>.*?<\/td><td>(.*?)<\/td><\/tr>/g
// 针对 a 标记内提取内容的特殊处理正则表达式
const hrefReg = /<a href=.*?>(.*?)<\/a>/g

const host = 'www.stats.gov.cn'
const path = `/tjsj/tjbz/tjyqhdmhcxhfdm/${config.crawlerYear}/#{route}.html`

/**
 * 抓取数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 19:23
 */
exports.fetch = (host, route, regexp, codeLen) =>
  new Promise((resolve, reject) => http.get({
    host,
    path: path.replace('#{route}', route),
    timeout: 3000
  }, res => {
    const bufferHelper = new BufferHelper()
    const statusCode = res.statusCode

    if (statusCode !== 200) {
      res.resume()
      return reject(new Error('Request Failed. Status Code: ' + statusCode))
    }

    res.on('data', chunk => bufferHelper.concat(chunk))

    res.on('end', () => {
      const rawData = minify(iconv.decode(bufferHelper.toBuffer(), 'GBK'), { collapseWhitespace: true, quoteCharacter: '\'' })

      const result = {}
      let current, current1, current2, temp
      while ((current = regexp.exec(rawData)) !== null) {
        // 针对 a 标记进行特殊处理
        if (current[1].indexOf('<a') !== -1) {
          while ((temp = hrefReg.exec(current[1])) !== null) current1 = temp[1]
        } else {
          current1 = current[1]
        }
        if (current[2].indexOf('<a') !== -1) {
          while ((temp = hrefReg.exec(current[2])) !== null) current2 = temp[1]
        } else {
          current2 = current[2]
        }
        result[current1.substr(0, codeLen)] = current2.trim()
      }

      return resolve(result)
    })
  }).on('error', reject).on('timeout', () => reject(new Error('timeout'))))

/**
 * 抓取省级数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 19:40
 */
exports.fetchProvinces = async () => {
  try {
    return await exports.fetch(host, 'index', pReg, 2)
  } catch (err) {
    if (err.message !== 'timeout') console.log(`抓取省级数据失败（${err}），正在重试...`)
    return exports.fetchProvinces()
  }
}

/**
 * 抓取地级数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 19:51
 */
exports.fetchCities = async (pCode) => {
  try {
    return await exports.fetch(host, pCode, casReg, 4)
  } catch (err) {
    if (err.message !== 'timeout') console.log(`抓取省级（${pCode}）的地级数据失败（${err}），正在重试...`)
    return exports.fetchCities(pCode)
  }
}

/**
 * 抓取县级数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 20:03
 */
exports.fetchAreas = async (cCode) => {
  cCode = cCode.toString()
  const pCode = cCode.substr(0, 2)

  try {
    return await exports.fetch(host, `${pCode}/${cCode}`, casReg, 6)
  } catch (err) {
    if (err.message !== 'timeout') console.log(`抓取地级（${cCode}）的县级数据失败（${err}），正在重试...`)
    return exports.fetchAreas(cCode)
  }
}

/**
 * 抓取乡级数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 20:08
 */
exports.fetchStreets = async (aCode, route) => {
  aCode = aCode.toString()
  const pCode = aCode.substr(0, 2)
  const cCodeSuffix = aCode.substr(2, 2)
  const _route = route || `${pCode}/${cCodeSuffix}/${aCode}`

  try {
    return await exports.fetch(host, _route, casReg, 9)
  } catch (err) {
    if (err.message === 'Request Failed. Status Code: 404') {
      console.log(`抓取县级（${aCode}）的乡级数据 404，路由（${_route}），错误：（${err}），可能是无村级数据，跳过。`)
      return {}
    }
    if (err.message !== 'timeout') console.log(`抓取县级（${aCode}）的乡级数据失败（${err}），正在重试...`)
    return exports.fetchStreets(aCode, route)
  }
}

/**
 * 抓取村级数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 20:19
 */
exports.fetchVillages = async (sCode, route) => {
  sCode = sCode.toString()
  const pCode = sCode.substr(0, 2)
  const cCodeSuffix = sCode.substr(2, 2)
  const aCodeSuffix = sCode.substr(4, 2)
  const _route = route || `${pCode}/${cCodeSuffix}/${aCodeSuffix}/${sCode}`

  try {
    return await exports.fetch(host, _route, vReg, 12)
  } catch (err) {
    if (err.message !== 'timeout') console.log(`抓取乡级（${sCode}）的村级数据失败（${err}），正在重试...`)
    return exports.fetchVillages(sCode, route)
  }
}
