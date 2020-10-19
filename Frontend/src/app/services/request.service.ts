import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { LatestInfo } from '../interfaces/latest'
import { MetaInfo } from '../interfaces/meta'
import { Price } from '../interfaces/price'
import { Suggestion } from '../interfaces/suggestion'

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseURL = 'http://192.168.50.200:3000/api'
  constructor(private http: HttpClient) {}

  // Fetch suggestions for auto-completion
  getSuggestions(ticker: string): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(`${this.baseURL}/suggestions/${ticker}`)
  }

  // Fetch meta info for a ticker
  getMeta(ticker: string): Observable<MetaInfo> {
    return this.http.get<MetaInfo>(`${this.baseURL}/details/meta/${ticker}`)
  }

  // Fetch latest price for a ticker
  getLatest(ticker: string): Observable<LatestInfo[]> {
    return this.http.get<LatestInfo[]>(
      `${this.baseURL}/details/latest/${ticker}`
    )
  }

  // Fetch historical prices for a ticker
  getPrices(ticker: string, startDate: Date): Observable<Price[]> {
    let year = startDate.getUTCFullYear()
    let month = (startDate.getUTCMonth() + 1).toString().padStart(2, '0')
    let day = startDate.getUTCDate().toString().padStart(2, '0')
    return this.http.get<Price[]>(
      `${this.baseURL}/details/prices/${ticker}/${year}-${month}-${day}`
    )
  }
}
