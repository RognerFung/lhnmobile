import { Component, OnInit } from '@angular/core';
import { HttpService } from '../_services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController, LoadingController, ToastController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { catchError } from 'rxjs/operators';
import { Invoice, InvoiceItem } from '../_shared/invoice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {

  invoiceForm: FormGroup;
  invoices: Invoice;
  selectInvoice: Invoice;
  invoiceItems: InvoiceItem[];

  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    public popoverController: PopoverController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.httpService.checkLogin().subscribe(
      success => {
        if (success) {
          this.getInvoice().subscribe(data => this.invoices = data.result);
        } else {
          this.router.navigate(['/login']);
        }
      }, error => {
        this.router.navigate(['/login']);
      }
    );
  }

  ionViewWillEnter() {
    this.httpService.checkLogin().subscribe(
      success => {
        if (success) {
          this.getInvoice().subscribe(data => this.invoices = data.result);
        } else {
          this.router.navigate(['/login']);
        }
      }, error => {
        this.router.navigate(['/login']);
      }
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

  getInvoice() {
    return this.httpService.get('invoices/find').pipe(
      catchError(error => this.httpService.handleError(error))
    );
  }

  getInvoiceItem(id) {
    return this.httpService.get('invoices/find/' + id).pipe(
      catchError(error => this.httpService.handleError(error))
    );
  }

  viewDetail(id) {
    this.getInvoiceItem(id).subscribe(data => {
      this.selectInvoice = data.result;
      this.invoiceItems = this.selectInvoice.InvoiceItems;
    }, error => this.httpService.handleError(error))
  }

  viewList() {
    this.selectInvoice = null;
    this.invoiceItems = null;
  }
}
