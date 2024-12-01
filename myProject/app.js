// Reset dropdowns on page load
window.addEventListener('DOMContentLoaded', function () {
  document.getElementById('countrySelect1').selectedIndex = 0;
  document.getElementById('countrySelect2').selectedIndex = 0;
});

// Store the chart instance globally
let tradeChart = null;

document.getElementById('fetchDataBtn').addEventListener('click', function () {
  const country = document.getElementById('countrySelect1').value;
  const country2 = document.getElementById('countrySelect2').value;

  // Ensure both countries are selected
  if (!country || !country2) {
    alert("Please select two countries to compare.");
    return;
  }

  // Construct the API URL
  const url = `https://brains.tradingeconomics.com/v2/search/wb,fred,comtrade?q=${country.toLowerCase()},${country2.toLowerCase()}&pp=50&p=0&_=1557934352427&stance=2`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('Fetched Data:', data); // Debugging the response

      // Display data in a table
      const dashboardContainer = document.getElementById('dashboardContainer');
      let htmlContent =
        '<table class="table table-bordered"><thead><tr><th>Trade Type</th><th>Description</th><th>Importance</th><th>More Info</th></tr></thead><tbody>';

      let importsCountry1ToCountry2 = 0; // Country 1 imports from Country 2
      let exportsCountry1ToCountry2 = 0; // Country 1 exports to Country 2

      // Process data
      data.hits.forEach(item => {
        const tradeType = item.category === 'Imports' ? 'Import' : 'Export';
        const description = item.name.toLowerCase().trim();
        const importance = item.importance;
        const url = item.url ? 'https://www.tradingeconomics.com' + item.url : '#';

        // Match Country 1 → Country 2
        if (
          description.includes(country.toLowerCase()) &&
          description.includes(country2.toLowerCase())
        ) {
          if (tradeType === 'Import') {
            importsCountry1ToCountry2++;
          } else if (tradeType === 'Export') {
            exportsCountry1ToCountry2++;
          }
        }

        // Add row to table
        htmlContent += `<tr>
                          <td>${tradeType}</td>
                          <td>${item.name}</td>
                          <td>${importance}</td>
                          <td><a href="${url}" target="_blank">More Info</a></td>
                        </tr>`;
      });

      htmlContent += '</tbody></table>';
      dashboardContainer.innerHTML = htmlContent;

      // Update chart data
      const chartLabels = [
        `Imports`,
        `Exports`,
      ];
      const chartData = [importsCountry1ToCountry2, exportsCountry1ToCountry2];

      console.log('Chart Data:', chartData);

      // Reset the chart if it exists
      if (tradeChart) {
        tradeChart.destroy();
      }

      // Create a new chart
      const ctx = document.getElementById('gdpChart').getContext('2d');
      tradeChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [
            {
              label: 'Number of Imports/Exports',
              data: chartData,
              backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    })
    .catch(error => console.error('Error fetching data:', error));
});

// Reset dropdowns on page refresh
window.onload = function () {
  document.getElementById('countrySelect1').selectedIndex = 0;
  document.getElementById('countrySelect2').selectedIndex = 0;
};
