import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { zip } from 'rxjs'
import { LatestInfo } from 'src/app/interfaces/latest'
import { PortfolioItem } from 'src/app/interfaces/portfolio-item'
import { RequestService } from 'src/app/services/request.service'

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  portfolio: PortfolioItem[]
  latest: LatestInfo[]
  isLoading: boolean = true
  selectedIndex: number = 0
  buyState: boolean = true
  qty: number = 0

  constructor(
    private request: RequestService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.portfolio = JSON.parse(
      window.localStorage.getItem('portfolio')
    ).sort((a, b) => (a.ticker < b.ticker ? -1 : 1))

    if (this.portfolio.length) {
      this.getLatest()
    } else {
      this.isLoading = false
    }
  }

  getLatest(): void {
    let requests$ = this.portfolio.map((item) =>
      this.request.getLatest(item.ticker)
    )
    zip(...requests$).subscribe((data) => {
      this.latest = data.map((item) => item[0])
      this.isLoading = false
    })
  }

  routeToDetails(ticker: string): void {
    this.router.navigate(['details', ticker])
  }

  // Open modal
  open(buyState: boolean, index: number, content): void {
    this.buyState = buyState
    this.selectedIndex = index
    this.modalService.open(content)
  }

  // Make a deal
  deal(modal: NgbActiveModal): void {
    modal.close()

    let selectedItem = this.portfolio[this.selectedIndex]
    let tmpQty = selectedItem.quantity
    let tmpCost = selectedItem.cost
    tmpQty += this.buyState ? this.qty : -this.qty
    if (tmpQty === 0) {
      this.portfolio.splice(this.selectedIndex, 1)
      this.latest.splice(this.selectedIndex, 1)
    } else {
      let appendCost = this.qty * this.latest[this.selectedIndex].last
      let subtractCost = this.qty * (selectedItem.cost / selectedItem.quantity)
      tmpCost += this.buyState ? appendCost : -subtractCost

      selectedItem.quantity = tmpQty
      selectedItem.cost = tmpCost
    }

    window.localStorage.setItem('portfolio', JSON.stringify(this.portfolio))

    // Only fetch latest info when any stock remain in the portfolio
    if (this.portfolio.length) {
      this.getLatest()
    }
  }
}
