import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CountryComponent } from './country/country.component';
import { HomeComponent } from './home/home.component';
import { SecurePagesGuard } from './secure-pages.guard';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  { path: "signin", component: SigninComponent,
    canActivate: [SecurePagesGuard]},
  { path: "home", component: HomeComponent,
    canActivate: [AuthGuard]},
  { path: "country", component: CountryComponent},
  { path: "", pathMatch: "full", redirectTo: "signin"},
  { path: "**", redirectTo: "signin"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
