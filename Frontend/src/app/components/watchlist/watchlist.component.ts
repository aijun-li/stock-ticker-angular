import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { zip } from 'rxjs'
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
      // Fetch all necessary data
      let requests$ = this.watchlist.map((item) =>
        this.request.getLatest(item.ticker)
      )
      // Combine all requests and process after all are done
      zip(...requests$).subscribe((data) => {
        this.latest = data.map((item) =>
          Object.assign(item[0], {
            change: (item[0].last - item[0].prevClose).toFixed(2),
            changeP: (
              ((item[0].last - item[0].prevClose) * 100) /
              item[0].prevClose
            ).toFixed(2)
          })
        )
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
  remove(event: Event, index: number): void {
    event.stopPropagation()
    this.watchlist.splice(index, 1)
    window.localStorage.setItem('watchlist', JSON.stringify(this.watchlist))
    this.latest.splice(index, 1)
  }
}
