import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { zip } from 'rxjs'
import { Info } from 'src/app/interfaces/info'
import { LatestInfo } from 'src/app/interfaces/latest'
import { PortfolioItem } from 'src/app/interfaces/portfolio-item'
import { WatchlistItem } from 'src/app/interfaces/watchlist-item'
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
  buyAlertCounter: number = 0
  toStore: number = 0
  showBuyAlert: boolean = false
  buyQty: number = 0

  constructor(
    private route: ActivatedRoute,
    private request: RequestService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.info.ticker = this.route.snapshot.paramMap.get('ticker').toUpperCase()

    // Fetch all necessary data
    zip(
      this.request.getMeta(this.info.ticker),
      this.request.getLatest(this.info.ticker)
    ).subscribe((data1) => {
      if (data1[0].detail) {
        this.isLoading = false
      } else {
        this.info.meta = data1[0]
        this.processLatest(data1[1][0])

        let today = new Date()
        zip(
          this.request.getPrices(this.info.ticker, this.dataTime, '4min'),
          this.request.getNews(this.info.ticker),
          this.request.getPrices(
            this.info.ticker,
            new Date(
              today.getFullYear() - 2,
              today.getMonth(),
              today.getDate()
            ),
            '12hour'
          )
        ).subscribe((data2) => {
          this.info.latestPrices = data2[0]
          this.info.news = data2[1]
          this.info.twoYearPrices = data2[2]

          this.isLoading = false

          // Set auto updating
          if (this.info.isOpen) {
            this.updateCounter = window.setInterval(
              () => this.getUpdate(),
              15000
            )
          }
        })
      }
    })

    this.isStored = JSON.parse(window.localStorage.getItem('watchlist')).some(
      (item) => item.ticker === this.info.ticker
    )
  }

  ngOnDestroy(): void {
    window.clearInterval(this.updateCounter)
    window.clearTimeout(this.alertCounter)
    window.clearTimeout(this.buyAlertCounter)
  }

  toggleStore(): void {
    let watchlist: WatchlistItem[] = JSON.parse(
      window.localStorage.getItem('watchlist')
    )
    if (this.isStored) {
      let index = watchlist.findIndex(
        (item) => item.ticker === this.info.ticker
      )
      watchlist.splice(index, 1)
      this.toStore = -1
      window.clearTimeout(this.alertCounter)
      this.alertCounter = window.setTimeout(() => (this.toStore = 0), 5000)
    } else {
      watchlist.push({ ticker: this.info.ticker, name: this.info.meta.name })
      this.toStore = 1
      window.clearTimeout(this.alertCounter)
      this.alertCounter = window.setTimeout(() => (this.toStore = 0), 5000)
    }
    window.localStorage.setItem('watchlist', JSON.stringify(watchlist))
    this.isStored = !this.isStored
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

    if (Math.abs(this.time.getTime() - this.dataTime.getTime()) < 60000) {
      this.info.isOpen = true
    } else {
      this.info.isOpen = false
    }
  }

  // Open modal
  open(content): void {
    this.modalService.open(content)
  }

  // Close modal
  buy(modal: NgbActiveModal): void {
    let portfolio: PortfolioItem[] = JSON.parse(
      window.localStorage.getItem('portfolio')
    )
    let index = portfolio.findIndex((item) => item.ticker === this.info.ticker)
    if (index === -1) {
      portfolio.push({
        ticker: this.info.ticker,
        name: this.info.meta.name,
        quantity: this.buyQty,
        cost: this.buyQty * this.info.latest.last
      })
    } else {
      portfolio[index].quantity += this.buyQty
      portfolio[index].cost += this.buyQty * this.info.latest.last
    }
    window.localStorage.setItem('portfolio', JSON.stringify(portfolio))
    modal.close()
    this.buyQty = 0
    window.clearTimeout(this.buyAlertCounter)
    this.showBuyAlert = true
    this.buyAlertCounter = window.setTimeout(
      () => (this.showBuyAlert = false),
      5000
    )
  }
}
