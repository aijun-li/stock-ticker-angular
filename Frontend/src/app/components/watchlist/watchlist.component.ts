import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { LatestInfo } from 'src/app/interfaces/latest'
import { WatchlistItem } from 'src/app/interfaces/watchlist-item'
import { RequestService } from 'src/app/services/request.service'

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  watchlist: WatchlistItem[]
  latest: LatestInfo[]
  isLoading: boolean = true

  constructor(private request: RequestService, private router: Router) {}

  ngOnInit(): void {
    this.watchlist = JSON.parse(
      window.localStorage.getItem('watchlist')
    ).sort((a, b) => (a.ticker < b.ticker ? -1 : 1))

    if (this.watchlist.length) {
      this.getLatest()
    } else {
      this.isLoading = false
    }
  }

  // Fetch latest data
  getLatest(): void {
    this.latest = []
    let tickers = this.watchlist.map((item) => item.ticker).join(',')
    this.request.getLatest(tickers).subscribe((data) => {
      let tmpData = data.map((item) =>
        Object.assign(item, {
          change: (item.last - item.prevClose).toFixed(2),
          changeP: (
            ((item.last - item.prevClose) * 100) /
            item.prevClose
          ).toFixed(2)
        })
      )

      for (let i = 0; i < this.watchlist.length; i++) {
        let index = tmpData.findIndex(
          (item) =>
            item.ticker.toUpperCase() === this.watchlist[i].ticker.toUpperCase()
        )
        this.latest[i] = tmpData[index]
      }

      this.isLoading = false
    })
  }

  // Navigate to the corresponding details page
  toDetail(ticker: string): void {
    this.router.navigate(['details', ticker])
  }

  // Remove selected ticker from the watchlist
  remove(event: Event, index: number): void {
    event.stopPropagation()
    this.watchlist.splice(index, 1)
    window.localStorage.setItem('watchlist', JSON.stringify(this.watchlist))
    this.latest.splice(index, 1)
  }
}
