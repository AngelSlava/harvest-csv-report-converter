const CSVtoJSON = require("csvtojson")
const FileSystem = require("fs")

getName().then(result => {
  let t = 0
  let s = ''
  result.map(f => {
    const stats = FileSystem.statSync(`./csv/${f}`)
    const mtime = stats.mtime
    if (+mtime > t) {
      s = f
      t = mtime
    }
  })


  const from = `${s[32]}${s[33]}.${s[29]}${s[30]}.${s[24]}${s[25]}${s[26]}${s[27]}`
  const to = `${s[44]}${s[45]}.${s[41]}${s[42]}.${s[36]}${s[37]}${s[38]}${s[39]}`
  const range = to === from ? to : `${from} - ${to}`
  printReport(s, range)
})

function getName() {
  return new Promise(resolve => {
    FileSystem.readdir('./csv', (err, files) => {
      resolve(files)
    })
  })
}

function printReport(fileName, range) {
  CSVtoJSON().fromFile(`./csv/${fileName}`).then(sourse => {
    const jsonMap = sourse.map(item => {
      return {
        task: item.Notes,
        hours: parseFloat(item.Hours.replace(",", "."))
      }
    })

    const jsonReduce = jsonMap.reduce((prev, current) => {
      let key = current.task
      !prev[key] ? prev[key] = current.hours : prev[key] = prev[key] + current.hours
      return prev
    }, [])
    console.log("")
    console.log(range)
    const json = Object.entries(jsonReduce).map(item => {
      console.log("+ " + item[0] + " - " + parseInt(item[1] * 100) / 100 + " h")
      return {
        task: item[0],
        hours: parseInt(item[1] * 100) / 100
      }
    })
    const total = json.reduce((prev, current) => {
      return { hours: prev.hours + current.hours }
    })
    const sum = parseInt(total.hours * 100) / 100
    console.log(`Total: ${sum} h`)

    // Edit your data
    console.log(`Total amount: ${sum} * 10 = ${(sum * 10).toFixed(2)}$`)
    console.log('U11090535')
  })
}

