import { Component, Input, OnInit } from '@angular/core'
import { faFacebookSquare, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { News } from 'src/app/interfaces/news'
import { RequestService } from 'src/app/services/request.service'

@Component({
  selector: 'app-news-tab',
  templateUrl: './news-tab.component.html',
  styleUrls: ['./news-tab.component.css']
})
export class NewsTabComponent implements OnInit {
  @Input() ticker: string
  news: News[][]
  selectedNews: News
  twIcon = faTwitter
  fbIcon = faFacebookSquare

  constructor(
    private request: RequestService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.request.getNews(this.ticker).subscribe((news) => {
      this.news = new Array(Math.ceil(news.length / 2)).fill(1).map(() => [])
      for (let i = 0; i < news.length; i++) {
        this.news[Math.trunc(i / 2)].push(news[i])
      }
    })
  }

  open(item: News, content) {
    this.selectedNews = item
    this.modalService.open(content)
  }
}
