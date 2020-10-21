import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core'
import * as Highcharts from 'highcharts/highstock'
import { LatestInfo } from 'src/app/interfaces/latest'
import { MetaInfo } from 'src/app/interfaces/meta'
import { Price } from 'src/app/interfaces/price'

@Component({
  selector: 'app-summary-tab',
  templateUrl: './summary-tab.component.html',
  styleUrls: ['./summary-tab.component.css']
})
export class SummaryTabComponent implements OnInit, OnChanges {
  @Input() ticker: string
  @Input() isOpen: boolean
  @Input() meta: MetaInfo
  @Input() latest: LatestInfo
  @Input() prices: Price[]
  processedPrices: [number, number][]
  shouldUpdate: boolean = false

  Highcharts: typeof Highcharts = Highcharts
  chartOptions: Highcharts.Options

  constructor() {}

  ngOnInit(): void {
    this.processedPrices = this.prices.map((price) => [
      new Date(price.date).getTime(),
      price.close
    ])

    this.chartOptions = {
      title: {
        text: this.ticker.toUpperCase()
      },
      rangeSelector: {
        enabled: false
      },
      series: [
        {
          name: this.ticker.toUpperCase(),
          type: 'line',
          data: this.processedPrices,
          color: +this.latest.change > 0 ? 'green' : 'red'
        }
      ],
      tooltip: {
        valueDecimals: 2
      }
    }
  }

  // Monitor the change of the prices and then update chart
  ngOnChanges(changes: SimpleChanges) {
    if (this.chartOptions && changes['prices']) {
      this.processedPrices = changes['prices'].currentValue.map((price) => [
        new Date(price.date).getTime(),
        price.close
      ])
      this.chartOptions.series = [
        {
          name: this.ticker.toUpperCase(),
          type: 'line',
          data: this.processedPrices,
          color: +this.latest.change > 0 ? 'green' : 'red'
        }
      ]
      this.shouldUpdate = true
    }
  }
}
