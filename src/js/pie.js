const myChart = document.getElementById('myChart').getContext('2d');

//console.trace(App.vc);
// Global Options
Chart.defaults.global.defaultFontFamily = 'Lato';
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = 'White';

const yolo = () => {
  setTimeout(() => new Chart(myChart, {
    type: 'doughnut', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
      labels: ['AAP', 'BJP', 'CONGRESS', 'NOTA'],
      datasets: [{
        label: 'Votes',
        data:
          App.vc
        ,
        //backgroundColor:'green',
        backgroundColor: [
          'rgba(255, 99, 132, 0.9)',
          'rgba(54, 162, 235, 0.9)',
          'rgba(255, 206, 86, 0.9)',
          'rgba(75, 92, 192, 0.9)',
        ],
        borderWidth: 2,
        borderColor: '#777',
        hoverBorderWidth: 3,
        hoverBorderColor: 'white'
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Current Votes Standings',
        fontSize: 25
      },
      legend: {
        display: true,
        fontSize: 1,
        align: 'center',
        position: 'left',
        labels: {
          fontColor: 'white'
        },

      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          bottom: 100,
          top: 0
        }
      },
      tooltips: {
        enabled: true
      }
    }
  }), 1000);


};

setTimeout(() => new Chart(myChart, {
  type: 'doughnut', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: ['AAP', 'BJP', 'CONGRESS', 'NOTA'],
    datasets: [{
      label: 'Votes',
      data:
        App.vc
      ,
      //backgroundColor:'green',
      backgroundColor: [
        'rgba(255, 99, 132, 0.9)',
        'rgba(54, 162, 235, 0.9)',
        'rgba(255, 206, 86, 0.9)',
        'rgba(75, 92, 192, 0.9)',
      ],
      borderWidth: 2,
      borderColor: '#777',
      hoverBorderWidth: 3,
      hoverBorderColor: 'white'
    }]
  },
  options: {
    title: {
      display: true,
      text: 'Current Votes Standings',
      fontSize: 25
    },
    legend: {
      display: true,
      fontSize: 1,
      align: 'center',
      position: 'left',
      labels: {
        fontColor: 'white'
      },

    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        bottom: 100,
        top: 0
      }
    },
    tooltips: {
      enabled: true
    }
  }
}), 1000

)
