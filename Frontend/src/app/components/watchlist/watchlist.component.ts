import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { zip } from 'rxjs'
import { Info } from 'src/app/interfaces/info'
import { RequestService } from 'src/app/services/request.service'

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  tickers: string[]
  infos: Info[]
  isLoading: boolean = true

  constructor(private request: RequestService, private router: Router) {}

  ngOnInit(): void {
    this.tickers = JSON.parse(window.localStorage.getItem('watchlist'))

    if (this.tickers.length) {
      this.infos = this.tickers.map((ticker) => ({ ticker }))

      // Fetch all necessary data
      let latestRequests$ = this.tickers.map((ticker) =>
        this.request.getLatest(ticker)
      )
      let metaRequests$ = this.tickers.map((ticker) =>
        this.request.getMeta(ticker)
      )
      // Combine all requests and process after all are done
      zip(...latestRequests$, ...metaRequests$).subscribe((data) => {
        let len = this.tickers.length
        for (let i = 0; i < len; i++) {
          let change = data[i][0].last - data[i][0].prevClose
          let changeP = (change * 100) / data[i][0].prevClose
          this.infos[i].latest = Object.assign(data[i][0], {
            change: change.toFixed(2),
            changeP: changeP.toFixed(2)
          })
          this.infos[i].meta = data[i + len]
        }
        this.isLoading = false
      })
    } else {
      this.isLoading = false
    }
  }

  // Navigate to the corresponding details page
  toDetail(ticker: string): void {
    this.router.navigate(['details', ticker])
  }

  // Remove selected ticker from the watchlist
  remove(event: Event, ticker: string): void {
    event.stopPropagation()
    let index = this.tickers.indexOf(ticker)
    this.tickers.splice(index, 1)
    window.localStorage.setItem('watchlist', JSON.stringify(this.tickers))
    this.infos.splice(index, 1)
  }
}
