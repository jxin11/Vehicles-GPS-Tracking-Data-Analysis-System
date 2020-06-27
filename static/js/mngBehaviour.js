function tbChart(legend, labels, values) { 
  // define the chart data
  var chartData = {
    labels : labels,
    datasets : [{
      label: legend,
      fill: true,
      lineTension: 0.1,
      backgroundColor: ['green', 'gold', 'red'],
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
  var ctx = document.getElementById("tb_chart").getContext("2d");

  // create the chart using the chart canvas
  var chart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      title: {
        display: true,
        fontColor: "rgb(221, 225, 235)",
        fontSize: 22,
        text: 'Travelling Behaviour Frequency'
      },
      legend: {
        display: false
        // labels: {
        //   fontColor: "rgb(221, 225, 235)"
        // }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: "rgb(221, 225, 235)",
            fontSize: 10,
            beginAtZero: true,
            stepSize: 1
          }
        }],
        xAxes: [{
          barPercentage: 0.4,
          ticks: {
            fontColor: "rgb(221, 225, 235)"
          }
        }]
      },
      plugins: {
        datalabels: {
          display: false
        }      
      }
    }
  });
}

function dbChart(legend, labels, values) { 
  // define the chart data
  var chartData = {
    labels : labels,
    datasets : [{
      label: legend,
      fill: true,
      lineTension: 0.1,
      backgroundColor: ['green', 'gold', 'red'],
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
  var ctx = document.getElementById("db_chart").getContext("2d");

  // create the chart using the chart canvas
  var chart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      title: {
        display: true,
        fontColor: "rgb(221, 225, 235)",
        fontSize: 22,
        text: 'Driving Behaviour Frequency'
      },
      legend: {
        display: false
        // labels: {
        //   fontColor: "rgb(221, 225, 235)"
        // }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: "rgb(221, 225, 235)",
            fontSize: 10,
            beginAtZero: true,
            stepSize: 1
          }
        }],
        xAxes: [{
          barPercentage: 0.4,
          ticks: {
            fontColor: "rgb(221, 225, 235)"
          }
        }]
      },
      plugins: {
        datalabels: {
          display: false
        }      
      }
    }
  });
}