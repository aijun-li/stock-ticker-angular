import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMenuCollapsed = true
  items = [
    {
      link: '/',
      name: 'Search'
    },
    {
      link: '/watchlist',
      name: 'Watchlist'
    },
    {
      link: '/portfolio',
      name: 'Portfolio'
    }
  ]

  constructor(private location: Location) {}

  ngOnInit(): void {}
}
