const config = require('./config')
const path = require('path')

module.exports = {
  // 省级（省份、直辖市、自治区）
  provinces: require(path.resolve(__dirname, `${config.dataPath}provinces.json`)),
  // 地级（城市）
  cities: require(path.resolve(__dirname, `${config.dataPath}cities.json`)),
  // 县级（区县）
  areas: require(path.resolve(__dirname, `${config.dataPath}areas.json`)),
  // 乡级（乡镇、街道）
  streets: require(path.resolve(__dirname, `${config.dataPath}streets.json`)),
  // 乡级（乡镇、街道）
  villages: require(path.resolve(__dirname, `${config.dataPath}villages.json`)),
  // “省份、城市” 二级联动数据
  pc: require(path.resolve(__dirname, `${config.dataPath}pc.json`)),
  // “省份、城市” 二级联动数据（带编码）
  pcC: require(path.resolve(__dirname, `${config.dataPath}pc-code.json`)),
  // “省份、城市、区县” 三级联动数据
  pca: require(path.resolve(__dirname, `${config.dataPath}pca.json`)),
  // “省份、城市、区县” 三级联动数据（带编码）
  pcaC: require(path.resolve(__dirname, `${config.dataPath}pca-code.json`)),
  // “省份、城市、区县、乡镇” 四级联动数据
  pcas: require(path.resolve(__dirname, `${config.dataPath}pcas.json`)),
  // “省份、城市、区县、乡镇” 四级联动数据（带编码）
  pcasC: require(path.resolve(__dirname, `${config.dataPath}pcas-code.json`))
}
