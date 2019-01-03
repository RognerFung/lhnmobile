import { Component, OnInit } from '@angular/core';
import { HttpService } from '../_services/http.service';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';
import { Invoice, Request, Season, Tenant, Vehicle } from '../_shared/classes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {

  vehicles: Observable<Vehicle[]>;
  invoicesPaid: Observable<Invoice[]>;
  invoicesOutstanding: Observable<Invoice[]>;
  seasonsActive: Observable<Season[]>;
  seasonsPending: Observable<Season[]>;
  seasonsTerminated: Observable<Season[]>;
  requestsApproved: Observable<Request[]>;
  requestsRejected: Observable<Request[]>;
  requestsPending: Observable<Request[]>;
  tenants: Observable<Tenant[]>;

  constructor(
    private httpService: HttpService,
    public popoverController: PopoverController,
    private router: Router
  ) { }

  ngOnInit() {
    this.httpService.checkLogin().subscribe(
      success => {
        if (success) {
          this.getVehicles();
          this.getInvoices();
          this.getSeasons();
          this.getRequests();
          this.getTenants();
        } else {
          this.router.navigate(['/login']);
        }
      }, error => this.router.navigate(['/login'])
    );
  }

  ionViewWillEnter() {
    this.httpService.checkLogin().subscribe(
      success => {
        if (success) {
          this.getVehicles();
          this.getInvoices();
          this.getSeasons();
          this.getRequests();
          this.getTenants();
        } else {
          this.router.navigate(['/login']);
        }
      }, error => this.router.navigate(['/login'])
    );
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  getVehicles() {
    this.vehicles = this.httpService.get('vehicles/find').pipe(
      filter(data => data.success),
      map(data => data.result),
      catchError(error => error)
    );
  }

  getInvoices() {
    this.invoicesPaid = this.httpService.get('invoices/find').pipe(
      filter(data => data.success),
      map(data => data.result.filter(e => e.Status === "Paid")),
      catchError(error => error)
    );
    this.invoicesOutstanding = this.httpService.get('invoices/find').pipe(
      filter(data => data.success),
      map(data => data.result.filter(e => e.Status === "Outstanding")),
      catchError(error => error)
    );
  }

  getSeasons() {
    this.seasonsActive = this.httpService.get('seasons/find').pipe(
      filter(data => data.success),
      map(data => data.result.filter(e => e.Status === "Active")),
      catchError(error => error)
    );
    this.seasonsPending = this.httpService.get('seasons/find').pipe(
      filter(data => data.success),
      map(data => data.result.filter(e => e.Status === "Pending")),
      catchError(error => error)
    );
    this.seasonsTerminated = this.httpService.get('seasons/find').pipe(
      filter(data => data.success),
      map(data => data.result.filter(e => e.Status === "Terminated")),
      catchError(error => error)
    );
  }

  getRequests() {
    this.requestsApproved = this.httpService.get('vehicles/request').pipe(
      filter(data => data.success),
      map(data => data.result.filter(e => e.Status === "Approved")),
      catchError(error => error)
    );
    this.requestsPending = this.httpService.get('vehicles/request').pipe(
      filter(data => data.success),
      map(data => data.result.filter(e => e.Status === "Pending")),
      catchError(error => error)
    );
    this.requestsRejected = this.httpService.get('vehicles/request').pipe(
      filter(data => data.success),
      map(data => data.result.filter(e => e.Status === "Rejected")),
      catchError(error => error)
    );
  }

  getTenants() {
    this.tenants = this.httpService.get('users/tenant').pipe(
      filter(data => data.success),
      map(data => data.result),
      catchError(error => error)
    );
  }
}
