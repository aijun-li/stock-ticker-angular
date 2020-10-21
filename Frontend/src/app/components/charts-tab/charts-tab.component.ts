import { Component, Input, OnInit } from '@angular/core'
import * as Highcharts from 'highcharts/highstock'
import IndicatorsCore from 'highcharts/indicators/indicators'
import Vbp from 'highcharts/indicators/volume-by-price'
import IndicatorZigzag from 'highcharts/indicators/zigzag'
import { Price } from 'src/app/interfaces/price'
IndicatorsCore(Highcharts)
IndicatorZigzag(Highcharts)
Vbp(Highcharts)

@Component({
  selector: 'app-charts-tab',
  templateUrl: './charts-tab.component.html',
  styleUrls: ['./charts-tab.component.css']
})
export class ChartsTabComponent implements OnInit {
  @Input() ticker: string
  @Input() prices: Price[]
  Highcharts: typeof Highcharts = Highcharts
  chartOptions: Highcharts.Options

  constructor() {}

  ngOnInit(): void {
    let ohlc: [number, number, number, number, number][] = []
    let volume: [number, number][] = []

    for (let price of this.prices) {
      let date = new Date(price.date).getTime()
      ohlc.push([date, price.open, price.high, price.low, price.close])
      volume.push([date, price.volume])
    }

    this.chartOptions = {
      title: {
        text: `${this.ticker} Historical`
      },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },
      rangeSelector: {
        buttons: [
          { type: 'month', count: 1, text: '1m' },
          { type: 'month', count: 3, text: '3m' },
          { type: 'month', count: 6, text: '6m' },
          { type: 'ytd', text: 'YTD' },
          { type: 'year', count: 1, text: '1y' },
          { type: 'all', text: 'All' }
        ],
        selected: 2
      },
      yAxis: [
        {
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'OHLC'
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true
          }
        },
        {
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'Volume'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
        }
      ],
      tooltip: {
        split: true
      },
      series: [
        {
          type: 'candlestick',
          name: this.ticker,
          id: this.ticker,
          zIndex: 2,
          data: ohlc
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume,
          yAxis: 1
        },
        {
          type: 'vbp',
          linkedTo: this.ticker,
          params: {
            volumeSeriesID: 'volume'
          },
          dataLabels: {
            enabled: false
          },
          zoneLines: {
            enabled: false
          }
        },
        {
          type: 'sma',
          linkedTo: this.ticker,
          zIndex: 1,
          marker: {
            enabled: false
          }
        }
      ]
    }
  }
}
