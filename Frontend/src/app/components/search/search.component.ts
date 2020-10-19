import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, of, Subject } from 'rxjs'
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap
} from 'rxjs/operators'
import { Suggestion } from 'src/app/interfaces/suggestion'
import { RequestService } from 'src/app/services/request.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private sugs$: Observable<Suggestion[]>
  private searchText$ = new Subject<string>()
  isLoading = false
  sugs: Suggestion[]
  ticker: string

  constructor(private request: RequestService, private router: Router) {}

  ngOnInit(): void {
    this.sugs$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true // Load indicator before sending request
      }),
      switchMap((keyword) =>
        keyword ? this.request.getSuggestions(keyword) : of([])
      )
    )
    this.sugs$.subscribe((data) => {
      this.isLoading = false // Hide indicator after receiving response
      this.sugs = data
    })
  }

  search(keyword: string) {
    this.searchText$.next(keyword)
  }

  showDetails(event: Event): void {
    event.preventDefault()
    if (this.ticker) {
      this.router.navigate(['details', this.ticker])
    }
  }
}
