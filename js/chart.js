// Function to create a dynamic stock line chart
function createStockChart() {
    var ctx = document.getElementById('stock-chart').getContext('2d');
    var stockData = generateRandomStockData();
  
    var isDarkMode = document.body.classList.contains('dark-mode');
  
    var backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0)';
    var borderColor = isDarkMode ? 'rgba(75, 192, 192, 1)' : 'rgba(75, 192, 192, 1)';
    var gridLineColor = isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.2)';
  
    var stockChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: stockData.labels,
        datasets: [{
          label: 'Stock Price',
          borderColor: borderColor,
          borderWidth: 2,
          backgroundColor: backgroundColor,
          data: stockData.values,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 10000, // Set duration to 10000 milliseconds (10 seconds)
          easing: 'linear',
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: 0,    // Set the minimum x-axis value
            max: 100,  // Set the maximum x-axis value
            grid: {
              color: gridLineColor,
            },
          },
          y: {
            min: 0,    // Set the minimum y-axis value
            max: 100,  // Set the maximum y-axis value
            grid: {
              color: gridLineColor,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  
    // Update chart data in a loop
    setInterval(function () {
      stockData = generateRandomStockData();
      stockChart.data.labels = stockData.labels;
      stockChart.data.datasets[0].data = stockData.values;
      stockChart.update();
    }, 10000); // Update every 10000 milliseconds (10 seconds)
  }
  
  // Function to generate random stock data
  function generateRandomStockData() {
    var labels = [];
    var values = [];
    var currentValue = 50 + Math.random(); // Starting value
  
    for (var i = 0; i < 100; i++) {
      labels.push(i);
  
      // Generate normally distributed random value change
      var normalRandom = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
      
      // Adjust the multiplier for more drastic changes
      currentValue += 2.5 * normalRandom; // Increase the multiplier for more drastic changes
      
      values.push(Math.min(Math.max(currentValue, 0), 100).toFixed(2));
    }
  
    // Ensure that the array length is limited to 100
    if (values.length > 100) {
      values.shift(); // Remove the oldest value
      labels.shift(); // Remove the corresponding label
    }
  
    return { labels, values };
  }
  
  // Call the function to toggle dark mode when the page loads
  document.addEventListener('DOMContentLoaded', function () {
    // Load dark mode state from localStorage
    var isDarkMode = localStorage.getItem('darkMode') === 'true';
  
    // Apply dark mode if it was enabled
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  
    // Create the stock chart or perform other actions
    createStockChart();
  });