<script>
import { Line, mixins } from 'vue-chartjs'
const {reactiveProp} = mixins

export default {
  extends: Line,
  mixins: [reactiveProp,],
  mounted() {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          type: 'time',
          distribution: 'linear',
          time: {
            unit: 'hour',
            displayFormats: {
              hour: 'MMM D hA'
            },
          },
        }],
        yAxes: [{
          ticks: {
            suggestedMin: 0,
            beginAtZero: true,
          }
        }],
      },
    })
  },
}
</script>
