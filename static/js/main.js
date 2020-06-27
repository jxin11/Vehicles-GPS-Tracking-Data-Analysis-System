
function openNav() {
  document.getElementById("mySidenav").style.width = "130px";
  document.getElementById("main").style.marginLeft = "130px";
}
  
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
}

async function getData(){
  const xlabels = [];
  const y_RON95 = [];
  const y_RON97 = [];
  const y_diesel = [];

  const response = await fetch('/static/data/petrol_price.csv');
  const data = await response.text();

  const table = data.split('\n').slice(1);
  table.reverse();
  table.forEach(row => {
    const columns = row.split(',');
    const period = columns[0].trim();
    // period = period.reverse();
    xlabels.push(period);
    const RON95 = columns[1];
    y_RON95.push(RON95);
    const RON97 = columns[2];
    y_RON97.push(RON97);
    const diesel = columns[3];
    y_diesel.push(diesel);
    console.log(period, RON95, RON97, diesel);
  });
  
  return{xlabels, y_RON95, y_RON97, y_diesel};
}

async function chartIt(){
  const data = await getData();
  const ctx = document.getElementById('chart').getContext('2d');
  
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: data.xlabels,
        datasets: [{
          label: 'Price of RON95/litre',
          data: data.y_RON95,
          fill: false,
          borderColor: ['rgb(255, 99, 132, 1)'],
          borderWidth: 3,
          pointBorderColor: "white",
          pointBackgroundColor: "white",
          pointBorderWidth: 1,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "white",
          pointHoverBorderColor: "white",
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 10,
        },{
          label: 'Price of RON97/litre',
          data: data.y_RON97,
          fill: false,
          borderColor: ['rgb(99, 115, 255)'],
          borderWidth: 3,
          pointBorderColor: "white",
          pointBackgroundColor: "white",
          pointBorderWidth: 1,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "white",
          pointHoverBorderColor: "white",
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 10,
        },{
          label: 'Price of Diesel/litre',
          data: data.y_diesel,
          fill: false,
          borderColor: ['rgb(62, 214, 100)'],
          borderWidth: 3,
          pointBorderColor: "white",
          pointBackgroundColor: "white",
          pointBorderWidth: 1,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "white",
          pointHoverBorderColor: "white",
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 10,
        }]
    },
    options: {
      title: {
        display: true,
        text: 'Fuel Prices in Malaysia',
        fontSize: 35,
        fontFamily: 'Arial',
        fontColor: '#666',
        padding: 20,
      },
      scales: {
        xAxes: [{ 
          gridLines: {
            color: '#666',
            lineWidth: 0.3
          }
        }],
        yAxes: [{
          gridLines: {
            color: '#666',
            lineWidth: 0.3
          }
        }]
      }
    }
  });
}

