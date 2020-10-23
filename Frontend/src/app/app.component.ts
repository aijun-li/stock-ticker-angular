import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    if (!window.localStorage.getItem('watchlist')) {
      window.localStorage.setItem('watchlist', '[]')
    }
    if (!window.localStorage.getItem('portfolio')) {
      window.localStorage.setItem('portfolio', '[]')
    }
  }
}
