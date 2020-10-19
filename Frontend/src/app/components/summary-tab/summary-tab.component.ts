import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core'
import * as Highcharts from 'highcharts/highstock'
import { Info } from 'src/app/interfaces/info'

@Component({
  selector: 'app-summary-tab',
  templateUrl: './summary-tab.component.html',
  styleUrls: ['./summary-tab.component.css']
})
export class SummaryTabComponent implements OnInit, OnChanges {
  @Input() info: Info
  @Input() prices: [number, number][]
  shouldUpdate: boolean = false

  Highcharts: typeof Highcharts = Highcharts
  chartOptions: Highcharts.Options

  constructor() {}

  ngOnInit(): void {
    this.chartOptions = {
      title: {
        text: this.info.ticker.toUpperCase()
      },
      rangeSelector: {
        enabled: false
      },
      series: [
        {
          name: this.info.ticker.toUpperCase(),
          type: 'line',
          data: this.prices,
          color: +this.info.latest.change > 0 ? 'green' : 'red'
        }
      ],
      tooltip: {
        valueDecimals: 2
      }
    }
  }

  // Monitor the change of the prices and then update chart
  ngOnChanges(changes: SimpleChanges) {
    if (this.chartOptions) {
      this.chartOptions.series = [
        {
          name: this.info.ticker.toUpperCase(),
          type: 'line',
          data: this.prices,
          color: +this.info.latest.change > 0 ? 'green' : 'red'
        }
      ]
      this.shouldUpdate = true
      console.log(this.shouldUpdate)
    }
  }
}
