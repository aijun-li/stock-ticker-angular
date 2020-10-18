import { Component, OnInit } from '@angular/core'
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

  constructor(private request: RequestService) {}

  ngOnInit(): void {
    this.sugs$ = this.searchText$.pipe(
      debounceTime(300),
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
}
