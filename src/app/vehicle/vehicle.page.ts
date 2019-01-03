import { Component, OnInit } from '@angular/core';
import { HttpService } from '../_services/http.service';
import { UtilService } from '../_services/util.service';
import { Router } from '@angular/router';
import { PopoverController, LoadingController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vehicle } from '../_shared/vehicle';
import * as moment from 'moment';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.page.html',
  styleUrls: ['./vehicle.page.scss'],
})

export class VehiclePage implements OnInit {

  vehicles: Vehicle[];
  title: string;
  change: string = "Change Vehicle";
  selectVehicle: Vehicle;
  selectIU: string = "Vehicle not selected";
  selectCashCard: string = "Vehicle not selected";
  newVehicle: any;
  addForm: FormGroup;
  changeVehicleForm: FormGroup;
  tomorrow: string = moment().add(1,'days').format("YYYY-MM-DD");
  monthEnd: string = this.utilService.getMonthEnd(this.tomorrow);
  periodFrom: string = this.tomorrow;
  periodTo: string = this.monthEnd;
  isLoggedIn: boolean = false;
  errorMessage: string;
  successMessage: string;

  constructor(
    private httpService: HttpService,
    private utilService: UtilService,
    public popoverController: PopoverController,
    public loadingController: LoadingController,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.httpService.checkLogin().subscribe(
      success => {
        if (success) {
          this.getVehicles();
          this.title = 'My Vehicles';
          this.createAddForm();
          this.createChangeVehicleForm();
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
          this.getVehicles();
          this.title = 'My Vehicles';
          this.createAddForm();
          this.createChangeVehicleForm();
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
      translucent: true,
      componentProps: {
        data: "menu"
      }
    });
    return await popover.present();
  }
 
  async dropdownPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {
        data: "dropdown"
      }
    });
    return await popover.present();
  }

  segmentChanged(ev: any) {
      this.title = ev.detail.value;
    if (this.title === "Add New Vehicle") {
      this.createAddForm();
    } else if (this.title === "Change Vehicle") {
      this.createChangeVehicleForm();
    }
  }

  getVehicles() {
    this.httpService.get('vehicles/find').subscribe(
      data => {
        this.vehicles = data.result;
      }, error => {
        this.httpService.handleError(error);
      }
    )
  }

  toAddVehicle () {
    this.title = 'Add New Vehicle';
  }

  createAddForm() {
    this.addForm = this.fb.group({
      VehicleNum: ['', [Validators.required]],
      VehicleType: ['', [Validators.required]],
      IUNum: '',
      CashCardNum: ''
    });
  }

  createChangeVehicleForm() {
    this.changeVehicleForm = this.fb.group({
      FromVehicleID: ['', [Validators.required]],
      RequestType: ['', [Validators.required]],
      ToVehicleNum: ['', [Validators.required]],
      RequestReason: '',
      FromIU: '',
      ToIU: '',
      FromCashCard: '',
      ToCashCard: '',
      PeriodFrom: this.tomorrow,
      PeriodTo: null
    });

    this.changeVehicleForm.valueChanges
    .subscribe(data => this.onSelectVehicle());
  }

  onSelectVehicle() {
    if (!this.changeVehicleForm) { return; }
    this.selectVehicle = this.vehicles.filter(e => e.VehicleID == this.changeVehicleForm.controls.FromVehicleID.value)[0]
    this.selectIU = this.selectVehicle ? (this.selectVehicle.IUNum ? this.selectVehicle.IUNum : "------------") : "Vehicle not selected";
    this.selectCashCard = this.selectVehicle ? (this.selectVehicle.CashCardNum ? this.selectVehicle.CashCardNum : "------------") : "Vehicle not selected";
    console.log(this.periodFrom);
    console.log(this.periodTo);
  }

  onRequestTypeChange() {
    if (!this.changeVehicleForm) { return; }
    this.changeVehicleForm.controls.RequestReason.setValue(null);
  }

  onDateChange() {
    this.periodTo = this.utilService.getMonthEnd(this.periodFrom);
  }


  async addNewVehicle() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 5000
    });
    await loading.present();
    this.newVehicle = this.addForm.value;
    this.httpService.post('vehicles/add', this.newVehicle).subscribe(
      data => {
        if (data.success) {
          this.successMessage = data.message;
          this.newVehicle = null;
          this.getVehicles();
          setTimeout(() => {
            loading.dismiss();
            this.successMessage = null;
            this.title = "My Vehicles";
          }, 3000);
        } else {
          this.errorMessage = data.message;
          loading.dismiss();
          setTimeout(() => this.errorMessage = null, 3000);
        }
      }, error => {
        this.errorMessage = error.message;
        loading.dismiss();
        setTimeout(() => this.errorMessage = null, 3000);
      }
    );

    this.addForm.reset({
      VehicleNum: '',
      VehicleType: '',
      IUNum: '',
      CashCardNum: ''
    });
  }

  async changeVehicle() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 5000
    });
    await loading.present();
    this.newVehicle = this.changeVehicleForm.value;
    if (this.newVehicle.RequestType == 'Change Vehicle') {
      if (this.newVehicle.ToIU.length == 0) {
        this.newVehicle.FromIU = null;
        this.newVehicle.ToIU = null;
      }
      if (this.newVehicle.ToCashCard.length == 0) {
        this.newVehicle.FromCashCard = null;
        this.newVehicle.ToCashCard = null;
      }
    }

    if (this.newVehicle.RequestType == 'Change IU' || this.newVehicle.RequestType == 'Change Cash Card') {
      this.newVehicle.PeriodFrom = null;
    }
    this.httpService.post('vehicles/change', this.newVehicle).subscribe(
      data => {
        if (data.success) {
          this.successMessage = "Request Submitted";
          this.newVehicle = null;
          this.getVehicles();
          setTimeout(() => {
            loading.dismiss();
            this.successMessage = null;
            this.title = "My Vehicles";
          }, 3000);
        } else {
          this.errorMessage = data.message;
          loading.dismiss();
          setTimeout(() => this.errorMessage = null, 3000);
        }
      }, error => {
        this.errorMessage = error.message;
        loading.dismiss();
        setTimeout(() => this.errorMessage = null, 3000);
      }
    );
    this.changeVehicleForm.reset({
      FromVehicleID: '',
      ToVehicleNum: '',
      RequestType: '',
      RequestReason: '',
      FromIU: 'Vehicle not selected',
      ToIU: '',
      FromCashCard: 'Vehicle not selected',
      ToCashCard: '',
      PeriodFrom: this.tomorrow,
      PeriodTo: null
    });
  }

}
