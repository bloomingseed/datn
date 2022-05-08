var fs = require("fs")
var csvWriter = require('csv-write-stream')

function openCsvWriter(outputPath, isForceWrite = false){
  var options = {}
  var fsOptions = {}
  if(!isForceWrite && fs.existsSync(outputPath)){
    options.sendHeaders = false
    fsOptions.flags = 'a'
  }
  var writeStream = fs.createWriteStream(outputPath, fsOptions)
  var writer = csvWriter(options)
  writer.pipe(writeStream)
  return writer;
}

/*
var outputPath = "./output/test.csv";
var writer = openCsvWriter(outputPath)
data = {
  category: "politics",
  source: "vnexpress.net",
  text: "once upon a time in VNExpress"
}
writer.write(data)
writer.end()
*/

exports.openCsvWriter = openCsvWriter
