import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../_services/http.service';
import { PopoverController, LoadingController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { Router } from '@angular/router';
import { Observable, of, fromEvent } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';
import { Tenant } from '../_shared/classes';


@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.page.html',
  styleUrls: ['./tenant.page.scss'],
})
export class TenantPage implements OnInit {

  @ViewChild('seg') segment: any;
  title: Observable<string> = of("My Tenant Status");;
  tenants: Observable<Tenant[]>;
  parking_lots: Observable<Tenant[]>;
  selectParkingLotID: number;
  filelist: FileList;
  file: FormData;
  tenantExist: boolean;
  errorMessage: string;
  successMessage: string;

  constructor(
    private httpService: HttpService,
    public popoverController: PopoverController,
    public loadingController: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.httpService.checkLogin().subscribe(
      success => {
        if (success) {
          this.getTenants();
          this.getParkingLots();
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
          this.getTenants();
          this.getParkingLots();
        } else {
          this.router.navigate(['/login']);
        }
      }, error => {
        this.router.navigate(['/login']);
      }
    );
  }

  segmentChanged(ev: any) {
    this.title = of(ev.detail.value);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  presentLoading(message: string = "Please wait ...", duration: number = 5000) {
    return this.loadingController.create({
      message: message,
      duration: duration
    });
  }

  getTenants() {
    this.tenants = this.httpService.get('users/tenant').pipe(
      filter(data => data.success),
      map(data => data.result),
      catchError(error => error)
    );
  }

  getParkingLots () {
    this.parking_lots = this.httpService.post('seasons/searchParkingLot', {ParkingLotID: 'All'}).pipe(
      filter(data => data.success),
      map(data => data.result),
      catchError(error => error)
    )
  }

  addTenant () {
    this.title = of("Submit Tenant Proof");
    this.segment.value = "Submit Tenant Proof";
  }

  fileChange(event) {
    if (event.target.files.length > 0) {
      if (event.target.files[0].size > 2097152) {
        this.filelist = null;
        this.file = null;
        this.errorMessage = "Tenant file bigger than 2M";
        setTimeout(() => this.errorMessage = null, 3000);
      } else {
        this.filelist = event.target.files;
        this.file = new FormData();
      }
    } else {
      this.filelist = null;
      this.file = null;
    }
  }

  checkTenantExist(parkingLotID) {
    if (!this.tenants) {
      this.tenantExist = false;
    } else {
      this.tenants.subscribe(
        tenants => {
          this.tenantExist = tenants.some(e => e.ParkingLotID == parkingLotID);
          if (this.tenantExist) {
            this.errorMessage = "Tenant file already existed";
            setTimeout(() => this.errorMessage = null, 3000);
          }
      });
    }
  }

  async submitTenant() {
    if (this.selectParkingLotID && this.file && this.filelist) {
      let loading = await this.presentLoading();
      loading.present();

      let updatedFileName = await this.httpService.post('users/tenant', {ParkingLotID: this.selectParkingLotID, TenantFileName: this.filelist[0].name})
        .pipe(map(data => data.result.TenantFileName), catchError(error => this.httpService.handleError(error))).toPromise();
      this.file.append('imageFile', this.filelist[0], updatedFileName);
      this.httpService.uploadFile('imageUpload', this.file).subscribe(
        data => {
          this.successMessage = data.message;
          setTimeout(() => {
            this.successMessage = null;
            loading.dismiss();
            this.selectParkingLotID = null;
            this.file = null;
            this.filelist = null;
            this.getTenants();
            this.title = of("My Tenant Status");
          }, 3000);
        }, error => {
          this.errorMessage = error.message;
          setTimeout(() => this.errorMessage = null, 3000);
        }
      );
    }
  }

}
