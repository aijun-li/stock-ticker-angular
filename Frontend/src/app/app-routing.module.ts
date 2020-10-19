import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DetailsComponent } from './components/details/details.component'
import { PortfolioComponent } from './components/portfolio/portfolio.component'
import { SearchComponent } from './components/search/search.component'
import { WatchlistComponent } from './components/watchlist/watchlist.component'

const routes: Routes = [
  { path: 'details/:ticker', component: DetailsComponent },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: '', component: SearchComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
