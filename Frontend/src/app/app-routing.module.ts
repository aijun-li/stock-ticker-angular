import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PortfolioComponent } from './components/portfolio/portfolio.component'
import { SearchComponent } from './components/search/search.component'
import { WatchlistComponent } from './components/watchlist/watchlist.component'

const routes: Routes = [
  { path: '', component: SearchComponent, pathMatch: 'full' },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'portfolio', component: PortfolioComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
