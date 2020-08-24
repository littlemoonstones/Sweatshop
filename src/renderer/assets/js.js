// Lower Bound
function LowerBound(array, target) {
    // 大於目標值的最小值
    let sort_data = [...array]
    sort_data.sort((a, b) => a - b);
    let left = 0
    let right = sort_data.length
    while (left < right) {
        let middle = left + ~~((right - left) / 2)
        if (sort_data[middle] < target) {
            left = middle + 1;
        }
        else {
            right = middle;
        }
    }
    // return the index of the target in the original array
    return array.indexOf(sort_data[left])
}

// Upper Bound
function UpperBound(array, target) {
    // 小於目標值的最大值
    let sort_data = [...array]
    sort_data.sort((a, b) => a - b);
    let left = 0
    let right = sort_data.length - 1
    while (left < right) {
        let middle = left + ~~((right - left) / 2)
        if (sort_data[middle] < target) {
            left = middle + 1;
        }
        else {
            right = middle - 1;
        }
    }
    // return the index of the target in the original array
    return array.indexOf(sort_data[right])
}

// Percentile
function Percentile(array, percent) {
    // copy by value
    array = [...array];

    // ascending sort(1, 2, 3, ...)
    array.sort((a, b) => a - b);

    let n = array.length;
    let index = Math.round((percent / 100 * (n)) - 1)

    return index < 0 ? array[0] : array[index];
}

// Average
function AverageData(array){
    let sum = 0
    array.forEach(item=>{
        sum += item;
    })
    return sum/array.length;
}

function Results(datas, x1, x2) {
    // console.log("data: ", datas)
    var x_data = datas.time, y_data = datas.transmittance;
    // console.log('@js-Result_x_data: ', y_data)
    // datas.forEach(data => {
    //     x_data.push(parseFloat(data.Time))
    //     y_data.push(parseFloat(data.Transmittance))
    // })
    // console.log(x_data)

    // rangeX(x1, x2) and find closet values & index
    // let x1, x2;
    // x1 = 2.31973
    // x2 = 500
    let index_lower = LowerBound(x_data, x1)
    let index_upper = LowerBound(x_data, x2)

    // console.log(x_data[index_lower], x_data[index_upper])

    // Split data between x1 and x2
    let x_range_data = x_data.slice(index_lower, index_upper + 1)
    let y_range_data = y_data.slice(index_lower, index_upper + 1)

    // Calculate QD
    let low_quartile = Percentile(y_range_data, 0)
    let high_quartile = Percentile(y_range_data, 99)
    let QD = (high_quartile - low_quartile) / 2
    let range_data_avg = AverageData(y_range_data)

    // Determine bleaching or coloring process
    let init_time = x_range_data[0]
    let init_transmittance = y_range_data[0]
    let ideal_transmittance, real_transmittance, real_time, response_time
    let real_transmittance_index

    let process = ""

    //  Bleaching -> Coloring
    if (init_transmittance > range_data_avg) {
        process = "Bleaching -> Coloring"
        ideal_transmittance = (Math.min(...y_range_data) - init_transmittance) * 0.95 + init_transmittance;
        real_transmittance_index = UpperBound(y_range_data, ideal_transmittance)
        real_transmittance = y_range_data[real_transmittance_index]

        // More Coloring
        real_time = x_range_data[real_transmittance_index]
        response_time = real_time - init_time
    }
    else if (init_transmittance < range_data_avg) {
        process = "Coloring -> Bleaching"
        ideal_transmittance = (Math.max(...y_range_data) - init_transmittance) * 0.95 + init_transmittance;
        real_transmittance_index = UpperBound(y_range_data, ideal_transmittance)
        real_transmittance = y_range_data[real_transmittance_index]

        // More Bleaching
        real_time = x_range_data[real_transmittance_index]
        response_time = real_time - init_time
    }
    else {
        console.log("Error: Cannot determine Coloring or Bleaching")
    }
    // console.log(`Process: ${process}, Avg: ${range_data_avg}`)
    // console.log({
    //     real_transmittance_index,
    //     process,
    //     avg: range_data_avg,
    //     lower: {
    //         time: x1,
    //         index_lower,
    //         transmittance: y_range_data[0]
    //     },
    //     higher: {
    //         time: x2,
    //         index_upper,
    //         transmittance: y_range_data[y_range_data.length-1]
    //     }
    // })
    // return response_time;
    return {
        process,
        initial_time: init_time,
        final_time: x_range_data[x_range_data.length-1],
        real_time,
        initial_transmittance: y_range_data[0],
        fianl_transmittance: y_range_data[y_range_data.length-1],
        response_time,
        ideal_transmittance,
        real_transmittance,
        transmittance: Math.abs(real_transmittance-y_range_data[0])
      }
    // console.log(ideal_transmittance)
    
}
export default Results;