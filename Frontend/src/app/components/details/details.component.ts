import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { LatestInfo } from 'src/app/interfaces/latest'
import { MetaInfo } from 'src/app/interfaces/meta'
import { RequestService } from 'src/app/services/request.service'

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  ticker: string
  meta: MetaInfo
  latest: LatestInfo
  time: Date
  dataTime: Date
  updateCounter: number
  isStored: boolean = true
  isOpen: boolean = false

  constructor(private route: ActivatedRoute, private request: RequestService) {}

  ngOnInit(): void {
    this.ticker = this.route.snapshot.paramMap.get('ticker')
    this.getMeta()
    this.getLatest()

    // Set auto updating
    this.updateCounter = window.setInterval(() => this.getLatest(), 15000)
  }

  getMeta() {
    this.request.getMeta(this.ticker).subscribe((meta) => (this.meta = meta))
  }

  getLatest() {
    this.request.getLatest(this.ticker).subscribe((latest) => {
      let change = latest[0].last - latest[0].prevClose
      let changeP = (change * 100) / latest[0].prevClose
      this.latest = latest[0]
      this.latest.change = change.toFixed(2)
      this.latest.changeP = changeP.toFixed(2)
      this.time = new Date()
      this.dataTime = new Date(latest[0].timestamp)

      if (Math.abs(this.time.getTime() - this.dataTime.getTime()) < 60000) {
        this.isOpen = true
      } else {
        this.isOpen = false
      }
    })
  }
}
