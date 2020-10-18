import { Component, OnInit } from '@angular/core'
import { Observable, of, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { Suggestion } from 'src/app/interfaces/suggestion'
import { RequestService } from 'src/app/services/request.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  sugs$: Observable<Suggestion[]>
  private searchText$ = new Subject<string>()

  constructor(private request: RequestService) {}

  ngOnInit(): void {
    this.sugs$ = this.searchText$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((keyword) =>
        keyword ? this.request.getSuggestions(keyword) : of([])
      )
    )
  }

  search(keyword: string) {
    this.searchText$.next(keyword)
  }
}
