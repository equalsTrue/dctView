import XLSX from 'xlsx'
import Vue from 'vue'


export function importExcel(file) {
  // let file = file.files[0] // 使用传统的input方法需要加上这一步
  const types = file.name.split('.')[1]
  const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(item => item === types)
  if (!fileType) {
    Vue.prototype.$message.error('格式错误！请重新选择')
    throw new Error('格式错误！请重新选择')
  }
  return file2Xce(file)
}
function file2Xce(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader()
    reader.onload = function(e) {
      const data = e.target.result
      this.wb = XLSX.read(data, {
        type: 'binary'
      })
      const result = []
      this.wb.SheetNames.forEach((sheetName) => {
        result.push({
          sheetName: sheetName,
          sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
        })
      })
      resolve(result)
    }
    reader.readAsBinaryString(file.raw)
    // reader.readAsBinaryString(file) // 传统input方法
  })
}
