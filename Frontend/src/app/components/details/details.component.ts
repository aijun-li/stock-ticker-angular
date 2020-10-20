import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Info } from 'src/app/interfaces/info'
import { RequestService } from 'src/app/services/request.service'

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  info: Info = {}
  prices: [number, number][]
  time: Date
  dataTime: Date
  updateCounter: number
  isStored: boolean
  counter: number = 0
  toStore: number = 0

  constructor(private route: ActivatedRoute, private request: RequestService) {}

  ngOnInit(): void {
    this.info.ticker = this.route.snapshot.paramMap.get('ticker').toUpperCase()
    this.getMeta()
    this.getLatest()
    this.isStored = (JSON.parse(
      window.localStorage.getItem('collections')
    ) as string[]).includes(this.info.ticker)

    // Set auto updating
    this.updateCounter = window.setInterval(() => this.getLatest(), 15000)
  }

  toggleStore(): void {
    let collections: string[] = JSON.parse(
      window.localStorage.getItem('collections')
    )
    if (this.isStored) {
      let index = collections.indexOf(this.info.ticker)
      collections.splice(index, 1)
      this.toStore = -1
      window.clearTimeout(this.counter)
      this.counter = window.setTimeout(() => (this.toStore = 0), 5000)
    } else {
      collections.push(this.info.ticker)
      this.toStore = 1
      window.clearTimeout(this.counter)
      this.counter = window.setTimeout(() => (this.toStore = 0), 5000)
    }
    window.localStorage.setItem('collections', JSON.stringify(collections))
    this.isStored = !this.isStored
  }

  getMeta() {
    this.request
      .getMeta(this.info.ticker)
      .subscribe((meta) => (this.info.meta = meta))
  }

  getLatest() {
    // Fetch latest info
    this.request.getLatest(this.info.ticker).subscribe((latest) => {
      let change = latest[0].last - latest[0].prevClose
      let changeP = (change * 100) / latest[0].prevClose
      this.info.latest = latest[0]
      this.info.latest.change = change.toFixed(2)
      this.info.latest.changeP = changeP.toFixed(2)
      this.time = new Date()
      this.dataTime = new Date(latest[0].timestamp)

      if (
        Math.abs(this.time.getTime() - this.dataTime.getTime()) < 60000 ||
        (latest[0].askPrice != null &&
          latest[0].askSize != null &&
          latest[0].bidPrice != null &&
          latest[0].bidSize != null)
      ) {
        this.info.isOpen = true
      } else {
        this.info.isOpen = false
      }

      // Fetch the day prices
      this.request
        .getPrices(this.info.ticker, this.dataTime)
        .subscribe((prices) => {
          this.prices = prices.map((price) => [
            new Date(price.date).getTime(),
            price.close
          ])
        })
    })
  }
}
