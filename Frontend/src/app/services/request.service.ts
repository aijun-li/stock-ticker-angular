import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Suggestion } from '../interfaces/suggestion'

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseURL = 'http://192.168.50.200:3000/api'
  constructor(private http: HttpClient) {}

  // Request suggestions for auto-completion
  getSuggestions(ticker: string): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(`${this.baseURL}/suggestions/${ticker}`)
  }
}
