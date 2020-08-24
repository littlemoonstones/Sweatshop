const fs = require('fs')
const path = require('path')

function readFileSync(file_path) {
    let content = fs.readFileSync(file_path).toString();

    let contents = content.split('\n');
    let start = contents.indexOf(">>>>>Begin Strip Chart Data<<<<<\r")

    // get needed content
    contents = contents.slice(start + 2, -1)

    console.log(contents[contents.length - 1])

    // for d3 using
    var temp_data = []

    // for index.js using
    var x_data = [], y_data = []

    contents.forEach(line => {
        line = line.replace('\r', '');
        let values = line.split('\t');

        let time = parseFloat(values[1])
        let transmittance = parseFloat(values[2])

        temp_data.push({
            Time: time,
            Transmittance: transmittance
        })

        x_data.push(time)
        y_data.push(transmittance)
    })
    return {
        d3js: temp_data,
        main: {
            time: x_data,
            transmittance: y_data
        }
    }
}

export default readFileSync;