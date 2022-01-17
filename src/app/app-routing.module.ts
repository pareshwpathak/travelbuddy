import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReceiptPageComponent } from './receipt-page/receipt-page.component';
const routes: Routes = [
  { path: 'login', component: LoginPageComponent},
  { path: 'receipt', component: ReceiptPageComponent },
  {path: '', pathMatch: 'full', redirectTo: 'login'} ,
    // otherwise redirect to home
    { path: '**', pathMatch: 'full', component: PageNotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingModuleFiles = [LoginPageComponent, ReceiptPageComponent,PageNotFoundComponent]
