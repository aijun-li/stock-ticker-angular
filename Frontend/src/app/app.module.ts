import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTabsModule } from '@angular/material/tabs'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { HighchartsChartModule } from 'highcharts-angular'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { DetailsComponent } from './components/details/details.component'
import { NavbarComponent } from './components/navbar/navbar.component'
import { PortfolioComponent } from './components/portfolio/portfolio.component'
import { SearchComponent } from './components/search/search.component'
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { SummaryTabComponent } from './components/summary-tab/summary-tab.component';
import { NewsTabComponent } from './components/news-tab/news-tab.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartsTabComponent } from './components/charts-tab/charts-tab.component'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchComponent,
    WatchlistComponent,
    PortfolioComponent,
    DetailsComponent,
    SummaryTabComponent,
    NewsTabComponent,
    ChartsTabComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    HighchartsChartModule,
    MatAutocompleteModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatTabsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
