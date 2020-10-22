import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { zip } from 'rxjs'
import { Info } from 'src/app/interfaces/info'
import { LatestInfo } from 'src/app/interfaces/latest'
import { RequestService } from 'src/app/services/request.service'

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {
  info: Info = {}
  time: Date
  dataTime: Date
  updateCounter: number
  isLoading: boolean = true
  isStored: boolean
  alertCounter: number = 0
  toStore: number = 0

  constructor(private route: ActivatedRoute, private request: RequestService) {}

  ngOnInit(): void {
    this.info.ticker = this.route.snapshot.paramMap.get('ticker').toUpperCase()
    zip(
      this.request.getMeta(this.info.ticker),
      this.request.getLatest(this.info.ticker)
    ).subscribe((data1) => {
      if (data1[0].detail) {
        this.isLoading = false
      } else {
        this.info.meta = data1[0]
        this.processLatest(data1[1][0])
        this.request
          .getPrices(this.info.ticker, this.dataTime, '4min')
          .subscribe((prices) => {
            this.info.latestPrices = prices
            this.isLoading = false

            // Set auto updating
            this.updateCounter = window.setInterval(
              () => this.getUpdate(),
              15000
            )
          })
        this.getNews()
        this.getTwoYearPrices()
      }
    })

    this.isStored = (JSON.parse(
      window.localStorage.getItem('watchlist')
    ) as string[]).includes(this.info.ticker)
  }

  ngOnDestroy(): void {
    window.clearInterval(this.updateCounter)
    window.clearTimeout(this.alertCounter)
  }

  toggleStore(): void {
    let watchlist: string[] = JSON.parse(
      window.localStorage.getItem('watchlist')
    )
    if (this.isStored) {
      let index = watchlist.indexOf(this.info.ticker)
      watchlist.splice(index, 1)
      this.toStore = -1
      window.clearTimeout(this.alertCounter)
      this.alertCounter = window.setTimeout(() => (this.toStore = 0), 5000)
    } else {
      watchlist.push(this.info.ticker)
      this.toStore = 1
      window.clearTimeout(this.alertCounter)
      this.alertCounter = window.setTimeout(() => (this.toStore = 0), 5000)
    }
    window.localStorage.setItem('watchlist', JSON.stringify(watchlist))
    this.isStored = !this.isStored
  }

  getNews() {
    this.request
      .getNews(this.info.ticker)
      .subscribe((news) => (this.info.news = news))
  }

  getTwoYearPrices() {
    let today = new Date()
    this.request
      .getPrices(
        this.info.ticker,
        new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
        '12hour'
      )
      .subscribe((prices) => {
        this.info.twoYearPrices = prices
      })
  }

  getUpdate() {
    // Fetch latest info
    this.request.getLatest(this.info.ticker).subscribe((latest) => {
      this.processLatest(latest[0])

      // Fetch the day prices
      this.request
        .getPrices(this.info.ticker, this.dataTime, '4min')
        .subscribe((prices) => {
          this.info.latestPrices = prices
        })
    })
  }

  processLatest(latest: LatestInfo) {
    let change = latest.last - latest.prevClose
    let changeP = (change * 100) / latest.prevClose
    this.info.latest = latest
    this.info.latest.change = change.toFixed(2)
    this.info.latest.changeP = changeP.toFixed(2)
    this.time = new Date()
    this.dataTime = new Date(latest.timestamp)

    if (
      Math.abs(this.time.getTime() - this.dataTime.getTime()) < 60000 ||
      (latest.askPrice != null &&
        latest.askSize != null &&
        latest.bidPrice != null &&
        latest.bidSize != null)
    ) {
      this.info.isOpen = true
    } else {
      this.info.isOpen = false
    }
  }
}
