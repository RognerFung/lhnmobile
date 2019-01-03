import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'credit', loadChildren: './credit/credit.module#CreditPageModule' },
  { path: 'qrcode', loadChildren: './qrcode/qrcode.module#QrcodePageModule' },
  { path: 'enets', loadChildren: './enets/enets.module#EnetsPageModule' },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'season', loadChildren: './season/season.module#SeasonPageModule' },
  { path: 'request', loadChildren: './request/request.module#RequestPageModule' },
  { path: 'invoice', loadChildren: './invoice/invoice.module#InvoicePageModule' },
  { path: 'vehicle', loadChildren: './vehicle/vehicle.module#VehiclePageModule' },
  { path: 'password', loadChildren: './password/password.module#PasswordPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'retrieve', loadChildren: './retrieve/retrieve.module#RetrievePageModule' },
  { path: 'tenant', loadChildren: './tenant/tenant.module#TenantPageModule' },
  { path: 'parkinglot', loadChildren: './parkinglot/parkinglot.module#ParkinglotPageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
