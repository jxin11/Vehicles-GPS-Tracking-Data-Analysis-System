var myChart;
var accChart;

function selectFunction(arr) {
  var x = document.getElementById("selectSpeed").value;
  const datafilter = arr.filter(d => d['date'] === x);  
  // document.getElementById("speedGraph").innerHTML = speedGraph(datafilter);
  speedGraph(datafilter);
}

function selectFunctionAcc(arr) {
  var x = document.getElementById("selectAcceleration").value;
  const datafilter = arr.filter(d => d['date'] === x);
  // document.getElementById("accelerationGraph").innerHTML = accelerationGraph(datafilter);
  accelerationGraph(datafilter);
}

function distGraph(legend, labels, values) { 
  // define the chart data
  var chartData = {
    labels : labels,
    datasets : [{
      label: legend,
      fill: true,
      lineTension: 0.1,
      backgroundColor: "rgba(3, 150, 248, 0.904)",
      borderColor: "rgba(3, 150, 248, 0.904)",
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#ffe",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data : values,
      spanGaps: false
    }]
  };

  // get chart canvas
  var ctx = document.getElementById("dist_chart").getContext("2d");

  // create the chart using the chart canvas
  var chart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      legend: {
        labels: {
            fontColor: "rgb(221, 225, 235)"
        }
      },
      scales: {
        yAxes: [{
          ticks: {
              fontColor: "rgb(221, 225, 235)"
          }
        }],
        xAxes: [{
          ticks: {
              fontColor: "rgb(221, 225, 235)"
          }
        }]
      },
      plugins: {
        datalabels: {
          color: 'rgb(221, 225, 235)',
        }      
      }
    }
  });
}

function speedGraph(data) {
  
  if (myChart) {
    myChart.destroy();
  }

  var time = data.map(function(item) {
    return item['time'];
  });

  var speed = data.map(function(item) {
    return item['speed'];
  });

  legend = 'Driving Speed (km/h)'
  labels = time
  values = speed

  // get chart canvas
  var ctx = document.getElementById("speed_chart").getContext("2d");

  var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
  gradientStroke.addColorStop(0, "#80b6f4");
  gradientStroke.addColorStop(1, "#f49080");

  // define the chart data
  var chartData = {
    labels : labels,
    datasets : [{
      borderWidth: 1.5,
      label: legend,
      // fill: true,
      lineTension: 0.05,
      // backgroundColor: "rgba(7, 200, 248, 0.904)",
      borderColor:  gradientStroke, //"rgba(7, 200, 248, 0.904)",
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      // pointBorderColor: "rgba(75,192,192,1)",
      // pointBackgroundColor: "#ffe",
      // pointBorderWidth: 1,
      // pointHoverRadius: 5,
      // pointHoverBackgroundColor: "rgba(75,192,192,1)",
      // pointHoverBorderColor: "rgba(220,220,220,1)",
      // pointHoverBorderWidth: 2,
      // pointRadius: 1,
      // pointHitRadius: 10,
      data : values,
      spanGaps: false
    }]
  };

  // create the chart using the chart canvas
  myChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      annotation: {
        annotations: [{
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 90,
          borderColor: 'rgb(252, 3, 3)',
          borderWidth: 2,
          label: {
            enabled: false,
            content: 'Speed Limit'
          }
        }]
      },
      plugins: {
        datalabels: {
          display: false,
        }
      },
      elements: {
        point:{
            radius: 0
        }
      },
      legend: {
        labels: {
            fontColor: "rgb(221, 225, 235)"
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: "rgb(221, 225, 235)"
          }
        }],
        xAxes: [{
          ticks: {
            fontColor: "rgb(221, 225, 235)"
          }
        }]
      }
    }
  });

  myChart.update();
}

function accelerationGraph(data) {
  
  if (accChart) {
    accChart.destroy();
  }

  var time = data.map(function(item) {
    return item['time'];
  });

  var acceleration = data.map(function(item) {
    return item['acceleration'];
  });

  legend = 'Accelerarion (m/s²)'
  labels = time
  values = acceleration

  // define the chart data
  var chartData = {
    labels : labels,
    datasets : [{
      borderWidth: 0.5,
      label: legend,
      // fill: true,
      lineTension: 0.1,
      // backgroundColor: "rgba(7, 200, 248, 0.904)",
      borderColor: "rgb(221, 225, 235)",
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      // pointBorderColor: "rgba(75,192,192,1)",
      // pointBackgroundColor: "#ffe",
      // pointBorderWidth: 1,
      // pointHoverRadius: 5,
      // pointHoverBackgroundColor: "rgba(75,192,192,1)",
      // pointHoverBorderColor: "rgba(220,220,220,1)",
      // pointHoverBorderWidth: 2,
      // pointRadius: 1,
      // pointHitRadius: 10,
      data : values,
      spanGaps: false
    }]
  };

  var ctx = document.getElementById("acc_chart").getContext("2d");

  // create the chart using the chart canvas
  accChart = new Chart(ctx, {       // remove var
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      annotation: {
        annotations: [{
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 1.5,
          borderColor: 'rgb(252, 3, 3)',
          borderWidth: 1,
          label: {
            enabled: false,
            content: 'Acceleration Limit'
          }
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: -3,
          borderColor: 'rgb(252, 3, 3)',
          borderWidth: 1,
          label: {
            enabled: false,
            content: 'Deceleration Limit'
          }
        }]
      },
      plugins: {
        datalabels: {
          display: false,
        }
      },
      elements: {
        point:{
            radius: 0
        }
      },
      legend: {
        labels: {
            fontColor: "rgb(221, 225, 235)"
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: "rgb(221, 225, 235)"
          }
        }],
        xAxes: [{
          ticks: {
            fontColor: "rgb(221, 225, 235)"
          }
        }]
      }
    },
    plugins: [{
      beforeRender: function (x, options) {
        var c = x.chart
        var dataset = x.data.datasets[0];
        var yScale = x.scales['y-axis-0'];
        var yPos = yScale.getPixelForValue(0);

        var gradientFill = c.ctx.createLinearGradient(0, 0, 0, c.height);
        gradientFill.addColorStop(0, "#80b6f4");
        gradientFill.addColorStop(yPos / c.height - 0.00, "#80b6f4");
        gradientFill.addColorStop(yPos / c.height + 0.00, "#f49080");
        gradientFill.addColorStop(1, "#f49080");

        var model = x.data.datasets[0]._meta[Object.keys(dataset._meta)[0]].dataset._model;
        model.backgroundColor = gradientFill;
      }
    }]
  });

  accChart.update();
}

// async function getDistData(code){
//     const dist = [];
//     const x_time = [];
//     const speed = [];
//     const acc = [];
//     const engine = [];
  
//     const response = await fetch('/static/data/dataset_car.csv');
//     const data = await response.text();
  
//     const table = data.split('\n').slice(1);
//     table.forEach(row => {
//       const columns = row.split(',');
//       const time = columns[0];
//       x_time.push(time);
//       const miles = columns[4];
//       dist.push((parseFloat(miles)*1.609344).toFixed(2));
//       const speed_mph = columns[5];
//       speed.push((parseFloat(speed_mph)*1.609344).toFixed(2));
//       const acc_g = columns[10];
//       acc.push((parseFloat(acc_g)*9.80665).toFixed(2));
//       const eng = columns[8];
//       engine.push(eng);
//     });
    
//     if (code == "dist")
//         return{x_time, dist};
//     else if (code == "speed")
//         return{x_time, speed};
//     else if (code == "acc")
//         return{x_time, acc};
//     else if (code == "engine")
//         return{x_time, engine};
// }

// async function getTotalDistance(){
//     const data = await getDistData("dist");
//     const totalDist = data.dist[ data.dist.length - 1];
//     document.getElementById("demo").innerHTML = totalDist;
// }

// async function getDist(){
//     const data = await getDistData("dist");
//     const ctx = document.getElementById('dist_chart').getContext('2d');
    
//     // var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
//     // gradientStroke.addColorStop(0, "#80b6f4");
//     // gradientStroke.addColorStop(0.2, "#94d973");
//     // gradientStroke.addColorStop(0.5, "#fad874");
//     // gradientStroke.addColorStop(1, "#f49080");

//     var gradientFill = ctx.createLinearGradient(1200, 0, 100, 0);
//     gradientFill.addColorStop(0, "rgba(128, 182, 244, 0.6)");
//     gradientFill.addColorStop(1, "rgba(244, 144, 128, 0.6)");
  
//     const myChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//           labels: data.x_time,
//           datasets: [{
//           label: 'Distance (km)',
//           data: data.dist,
//           fill: true,
//           backgroundColor: gradientFill,
//           borderColor: gradientFill,
//           borderWidth: 2,
//           pointBorderColor: gradientFill,
//           pointBackgroundColor: gradientFill,
//           pointBorderWidth: 1,
//           pointHoverRadius: 2,
//           pointHoverBackgroundColor: gradientFill,
//           pointHoverBorderColor: gradientFill,
//           pointHoverBorderWidth: 2,
//           pointRadius: 1,
//           pointHitRadius: 5,
//         }]
//     },
//     options: {
//       title: {
//         display: true,
//         text: 'Distance (km) against Time',
//         fontSize: 25,
//         fontFamily: 'Arial',
//         fontColor: '#666',
//         padding: 20,
//       },
//       scales: {
//         xAxes: [{ 
//           gridLines: {
//             color: '#666',
//             lineWidth: 0.3
//           }
//         }],
//         yAxes: [{
//           gridLines: {
//             color: '#666',
//             lineWidth: 0.3
//           }
//         }]
//       }
//     }
//     });
// }

// async function getSpeed(){
//     const data = await getDistData("speed");
//     const ctx = document.getElementById('speed_chart').getContext('2d');
  
//     const myChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: data.x_time,
//         datasets: [{
//           label: 'Speed (km/h)',
//           data: data.speed,
//           fill: false,
//           borderColor: ['rgb(255, 99, 132, 1)'],
//           borderWidth: 1,
//         //   pointBorderColor: "white",
//           pointBackgroundColor: 'rgb(255, 99, 132, 1)',
//           pointBorderWidth: 0.1,
//           pointHoverRadius: 0.2,
//         //   pointHoverBackgroundColor: "white",
//         //   pointHoverBorderColor: "white",
//         //   pointHoverBorderWidth: 2,
//         //   pointRadius: 4,
//         //   pointHitRadius: 10,
//         }]
//     },
//     options: {
//       title: {
//         display: true,
//         text: 'Speed (km/h) against Time',
//         fontSize: 25,
//         fontFamily: 'Arial',
//         fontColor: '#666',
//         padding: 20,
//       },
//       scales: {
//         xAxes: [{ 
//           gridLines: {
//             color: '#666',
//             lineWidth: 0.3
//           }
//         }],
//         yAxes: [{
//           gridLines: {
//             color: '#666',
//             lineWidth: 0.3
//           }
//         }]
//       }
//     }
//     });
// }

// async function getAcc(){
//     const data = await getDistData("acc");
//     const ctx = document.getElementById('acc_chart').getContext('2d');
  
//     const myChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: data.x_time,
//         datasets: [{
//           label: 'Acceleration (m/s2)',
//           data: data.acc,
//           fill: false,
//           borderColor: ['rgb(99, 115, 255)'],
//           borderWidth: 1,
//         //   pointBorderColor: "white",
//           pointBackgroundColor: 'rgb(99, 115, 255)',
//           pointBorderWidth: 0.1,
//           pointHoverRadius: 0.2,
//         //   pointHoverBackgroundColor: "white",
//         //   pointHoverBorderColor: "white",
//         //   pointHoverBorderWidth: 2,
//         //   pointRadius: 4,
//         //   pointHitRadius: 10,
//         }]
//     },
//     options: {
//       title: {
//         display: true,
//         text: 'Acceleration (m/s2) against Time',
//         fontSize: 25,
//         fontFamily: 'Arial',
//         fontColor: '#666',
//         padding: 20,
//       },
//       scales: {
//         xAxes: [{ 
//           gridLines: {
//             color: '#666',
//             lineWidth: 0.3
//           }
//         }],
//         yAxes: [{
//           gridLines: {
//             color: '#666',
//             lineWidth: 0.3
//           }
//         }]
//       }
//     }
//   });
// }