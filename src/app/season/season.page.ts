import { Component, OnInit } from '@angular/core';
import { HttpService } from '../_services/http.service';
import { UtilService } from '../_services/util.service';
import { Router } from '@angular/router';
import { PopoverController, LoadingController, ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Season } from '../_shared/season';
import { Vehicle } from '../_shared/vehicle';
import * as moment from 'moment';
import { EnetsPage } from '../enets/enets.page';
import { CreditPage } from '../credit/credit.page';
import { QrcodePage } from '../qrcode/qrcode.page';

@Component({
  selector: 'app-season',
  templateUrl: './season.page.html',
  styleUrls: ['./season.page.scss'],
})

export class SeasonPage implements OnInit {

  title: string = 'My Season Parkings';
  seasons: Season[];
  seasonActive: Season[];
  seasonPending: Season[];
  seasonTerminated: Season[];
  vehicles: Vehicle[];
  tenants: any;
  parking_lots: any[];
  parking_lots_public: any[];
  parking_lots_tenant: any[];
  vehicles_updated: Vehicle[];
  parking_lots_updated: any[];
  
  purchaseForm: FormGroup;
  selectVehicle: Vehicle;
  selectParkingLot: any;
  today: string = moment().format("YYYY-MM-DD");
  periodFromPurchase: string = this.today;
  periodToPurchase: string = this.utilService.getMonthEnd(this.today);
  periodToMinPurchase: string = this.utilService.getMonthEnd(this.today);
  pricePurchase: number;
  pricingTypePurchase: string;
  qtyPurchase: number;
  amountPurchase: number;
  newSeason: Season;
  
  renewForm: FormGroup;
  selectSeason: Season;
  periodFromRenew: string;
  periodToRenew: string;
  periodToMinRenew: string;
  priceRenew: number;
  qtyRenew: number;
  amountRenew: number;
  renewedSeason: Season;

  terminateForm: FormGroup;
  selectSeasonTerminate: Season;
  terminatedSeason: Season;

  paymentIsSuccess: boolean;

  errorMessage: string;
  successMessage: string;
  constructor(
    private httpService: HttpService,
    private utilService: UtilService,
    private fb: FormBuilder,
    public popoverController: PopoverController,
    public loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public modalController: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.httpService.checkLogin().subscribe(
      success => {
        if (success) {
          this.getSeasonData();
          this.createPurchaseForm();
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
          this.getSeasonData();
          this.createPurchaseForm();
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

  //Fetch all of client's season, vehicle, tenant status, parking lots allowed, parking lot items accordingly.
  getSeasonData() {
    forkJoin(
      this.getSeasons(),
      this.getVehicles(),
      this.getPublicParkingLots(),
      this.getTenants()
    ).subscribe(([seasons, vehicles, parking_lots_public, tenants]) => {
      this.seasons = seasons.result;
      this.seasonActive = this.seasons.filter(e => e.Status === 'Active');
      this.seasonPending = this.seasons.filter(e => e.Status === 'Pending');
      this.seasonTerminated = this.seasons.filter(e => e.Status === 'Terminated');
      this.vehicles = vehicles.result;
      this.vehicles_updated = this.vehicles;
      this.parking_lots_public = parking_lots_public.result;
      console.log(this.parking_lots_public );
      this.tenants = tenants.result;
      this.getTenantParkingLots().subscribe(
        data => {
          this.parking_lots_tenant = data.result;
          if (this.parking_lots_tenant) {
            this.parking_lots = this.parking_lots_tenant
            .filter(e => this.parking_lots_public.map(p => p.ParkingLotID).indexOf(e.ParkingLotID) == -1)
            .concat(this.parking_lots_public);
          } else {
            this.parking_lots = this.parking_lots_public;
          }
          console.log(this.parking_lots);
          this.getParkingLotItems().subscribe(
            data => {
              this.parking_lots.forEach(e => {
                e.items = data.result.filter(i => i.ParkingLotID == e.ParkingLotID);
              });
              this.parking_lots_updated = this.parking_lots;
            });
        });
    }, error => {
      this.httpService.handleError(error);
    });
  }

  getSeasons() {
    return this.httpService.get('seasons/findPopulateVehicle').pipe(
      catchError(error => this.httpService.handleError(error))
    );
  }

  getVehicles() {
    return this.httpService.get('vehicles/find').pipe(
      catchError(error => this.httpService.handleError(error))
    );
  }

  getTenants() {
    return this.httpService.get('users/tenant').pipe(
      catchError(error => this.httpService.handleError(error))
    );
  }

  getPublicParkingLots () {
    return this.httpService.post('seasons/searchParkingLot', {ParkingLotID: 'All Public'}).pipe(
      catchError(error => this.httpService.handleError(error))
    );
  }

  getTenantParkingLots () {
    return this.httpService.post('seasons/searchParkingLot', {ParkingLotID: this.tenants.map(e => e.ParkingLotID)}).pipe(
      catchError(error => this.httpService.handleError(error))
    );
  }

  getParkingLotItems () {
    return this.httpService.post('seasons/searchParkingLotItem', {ParkingLotID: this.parking_lots.map(e => e.ParkingLotID)}).pipe(
      catchError(error => this.httpService.handleError(error))
    );
  }

  segmentChanged(ev: any) {
    this.title = ev.detail.value;
    if (ev.detail.value == "Renew Season") {
      this.renewSeason();
    } else if (ev.detail.value == "Terminate Season") {
      this.terminateSeason();
    }
  }

  createPurchaseForm() {
    this.purchaseForm = this.fb.group({
      VehicleID: '',
      ParkingLotID: '',
      SeasonType: '',
      PeriodFrom: '',
      PeriodTo: ''
    });
  }

  onSelectParkingLot() {
    if (this.purchaseForm.controls.ParkingLotID.value) {
      this.selectParkingLot = this.parking_lots.filter(e => e.ParkingLotID == this.purchaseForm.controls.ParkingLotID.value)[0];
      this.vehicles_updated = null;
      setTimeout(
        () => this.vehicles_updated = this.vehicles.filter(e => this.selectParkingLot.items.some(i => i.VehicleType == e.VehicleType))
      );
      this.showPricePurchase();
    }
  }

  onSelectVehicle() {
    if (this.purchaseForm.controls.VehicleID.value) {
      this.selectVehicle = this.vehicles.filter(e => e.VehicleID == this.purchaseForm.controls.VehicleID.value)[0];
      this.parking_lots_updated = null;
      setTimeout(
        () => this.parking_lots_updated = this.parking_lots.filter(e => e.items.some(i => i.VehicleType == this.selectVehicle.VehicleType))
      );
      this.showPricePurchase();
    }
  }

  onSelectPeriodFromPurchase() {
    this.periodToPurchase = this.utilService.getMonthEnd(this.periodFromPurchase);
    this.periodToMinPurchase = this.utilService.getMonthEnd(this.periodFromPurchase);
    this.showPricePurchase();
  }

  onSelectPeriodToPurchase() {
    if (this.periodToPurchase < this.periodToMinPurchase) {
      this.periodToPurchase = this.periodToMinPurchase;
      this.purchaseForm.get('PeriodTo').setValue(this.periodToMinPurchase);
    } else {
      this.periodToPurchase = this.utilService.getThisMonthEnd(this.periodToPurchase);
    }
    this.showPricePurchase();
  }

  onSelectPeriodToRenew() {
    if (this.periodToRenew < this.periodToMinRenew) {
      this.periodToRenew = this.periodToMinRenew;
      this.renewForm.get('PeriodTo').setValue(this.periodToMinRenew);
    } else {
      this.periodToRenew = this.utilService.getThisMonthEnd(this.periodToRenew);
      this.renewForm.get('PeriodTo').setValue(this.periodToRenew);
    }
    this.showPriceRenew();
  }

  showPricePurchase() {
    if (this.selectVehicle && this.selectParkingLot) {
      let selectTenant = this.tenants.filter(e => e.ParkingLotID == this.selectParkingLot.ParkingLotID).length == 0 ? 
        null : this.tenants.filter(e => e.ParkingLotID == this.selectParkingLot.ParkingLotID)[0];
      let selectItem = this.selectParkingLot.items.filter(i => i.VehicleType == this.selectVehicle.VehicleType)[0];
      if (selectTenant) {
        if (selectTenant.VehicleAmount == 0) {
          this.pricePurchase = selectItem.TenantFirstVehiclePrice;
          this.pricingTypePurchase = 'TenantFirstVehiclePrice';
        } else if (selectTenant.VehicleAmount == 1) {
          this.pricePurchase = selectItem.TenantSecondVehiclePrice;
          this.pricingTypePurchase = 'TenantSecondVehiclePrice';
        } else {
          this.pricePurchase = selectItem.TenantThirdVehiclePrice;
          this.pricingTypePurchase = 'TenantThirdVehiclePrice';
        }
      } else {
        this.pricePurchase = selectItem.NormalPrice;
        this.pricingTypePurchase = 'Public';
      }
      this.qtyPurchase = parseFloat(this.utilService.getPortion(this.periodFromPurchase, this.periodToPurchase).toFixed(2));
      this.amountPurchase = parseFloat((parseFloat(this.utilService.getPortion(this.periodFromPurchase, this.periodToPurchase).toFixed(2)) * this.pricePurchase).toFixed(2));
    }
  }

  showPriceRenew() {
    if (this.selectSeason) {
      this.qtyRenew = parseFloat(this.utilService.getPortion(this.periodFromRenew, this.periodToRenew).toFixed(2));
      this.amountRenew = parseFloat((this.qtyRenew * this.priceRenew).toFixed(2));
    }
  }

  addSeason () {
    this.title = "Purchase New Season";
  }

  purchaseSeason () {
    this.newSeason = this.purchaseForm.value;
    this.newSeason.PricingType = this.pricingTypePurchase;
    this.httpService.post('seasons/add', this.newSeason).subscribe(
      data => {
          this.newSeason = null;
          this.pricePurchase = null;
          this.pricingTypePurchase = null;
          this.amountPurchase = null;
          this.selectVehicle = null;
          this.selectParkingLot = null;
          this.getSeasonData();
      }, error => {
        this.errorMessage = error.message;
        setTimeout(() => this.errorMessage = null, 3000);
      }
    );
    this.purchaseForm.reset({
      VehicleID: '',
      ParkingLotID: '',
      SeasonType: '',
      PeriodFrom: this.today,
      PeriodTo: this.utilService.getMonthEnd(this.today)
    });
  }
  //Call this function when click renew button in segment or in each season card. Two ways of calling:
  //Click segment, call renewSeason() without parameter; 
  //Click each season card's renew button, call renewSeason(season) with season parameter, pass season to onSelectSeason function
  //Create renewForm, change title
  renewSeason (season=null) {
    if (season) {
      this.onSelectSeason(season);
    }
    this.createRenewForm();
    this.title = "Renew Season";
  }
  //Create renewForm
  //Two ways of creating renewForm: with selectSeason, create form with selectSeason's data; without selectSeason, create empty form
  createRenewForm() {
    if (this.selectSeason == null) {
      this.renewForm = this.fb.group({
        SeasonParkingID: '',
        PeriodTo: ''
      });
    } else {
      this.renewForm = this.fb.group({
        SeasonParkingID: this.selectSeason.SeasonParkingID,
        PeriodTo: this.periodToRenew
      });
    }
  }
  //Call this function when renewForm's select season field changes, two ways of calling:
  //Calling from renewSeason(season), season is passed to this.selectSeason
  //Calling from renewForm's change, this.selectSeason is selected. For empty form, nothing is selected, this.selectSeason = null
  //If this.selectSeason not null, creat periodFrom, periodTo, periodToMin, price, qty, amount then show them in the form
  onSelectSeason (season=null) {
    if (season) {
      this.selectSeason = season;
    } else {
      this.selectSeason = this.seasons.filter(e => e.SeasonParkingID == this.renewForm.controls.SeasonParkingID.value)[0];
    }
    if (this.selectSeason) {
      this.periodFromRenew = moment(this.selectSeason.PeriodTo).utcOffset(480).add(1, 'days').format("YYYY-MM-DD");
      this.periodToMinRenew = this.utilService.getMonthEnd(this.selectSeason.PeriodTo);
      this.periodToRenew = this.utilService.getMonthEnd(this.selectSeason.PeriodTo);
      this.priceRenew = this.selectSeason.Price;
      this.qtyRenew = parseFloat(this.utilService.getPortion(this.periodFromRenew, this.periodToRenew).toFixed(2));
      this.amountRenew = parseFloat((this.qtyRenew * this.priceRenew).toFixed(2));
    }
  }

  async submitRenewSeason () {
    this.renewedSeason = this.renewForm.value;
    this.httpService.post('seasons/renew', this.renewedSeason).subscribe(
      async data => {
        this.renewedSeason = null;
        this.priceRenew = null;
        this.amountRenew = null;
        this.selectSeason = null;
        this.getSeasonData();
      }, error => {
        this.httpService.handleError(error);
      }
    );
    this.renewForm.reset({
      SeasonParkingID: '',
      PeriodTo: ''
    });
    this.getSeasonData();
    this.title = 'My Season Parkings';
  }

  terminateSeason (season=null) {
    if (season) {
      this.onSelectSeasonTerminate(season);
    }
    this.createTerminateForm();
    this.title = "Terminate Season";
  }

  onSelectSeasonTerminate (season=null) {
    if (season) {
      this.selectSeasonTerminate = season;
    } else {
      this.selectSeasonTerminate = this.seasons.filter(e => e.SeasonParkingID == this.terminateForm.controls.SeasonParkingID.value)[0];
    }
  }

  createTerminateForm () {
    if (this.selectSeasonTerminate == null) {
      this.terminateForm = this.fb.group({
        SeasonParkingID: ''
      });
    } else {
      this.terminateForm = this.fb.group({
        SeasonParkingID: this.selectSeasonTerminate.SeasonParkingID
      });
    }
  }

  async submitTerminateSeason () {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 5000
    });
    await loading.present();
    this.terminatedSeason = this.terminateForm.value;
    this.httpService.post('seasons/terminate', this.terminatedSeason).subscribe(
      data => {
        if (data.success) {
          this.successMessage = "Season parking terminated";
          this.terminatedSeason = null;
          this.selectSeasonTerminate = null;
          this.getSeasonData();
          loading.dismiss();
          this.title = 'My Season Parkings';
          setTimeout(() => this.successMessage = null, 3000);
        } else {
          this.errorMessage = data.message;
          setTimeout(() => this.errorMessage = null, 3000);
        }
      }, error => {
        this.errorMessage = error.message;
        setTimeout(() => this.errorMessage = null, 3000);
      }
    );
    this.terminateForm.reset({
      SeasonParkingID: ''
    });
  }

  async confirmTerminate() {
    const alert = await this.alertController.create({
      header: 'Confirm Termination',
      message: 'Your season parking is still valid till end date. No refund for the rest days. ',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'OK',
          handler: async () => {
            await this.submitTerminateSeason();
          }
        }
      ]
    });
    await alert.present();
  }

  async selectPayment(option) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose Payment Method',
      buttons: [{
        text: 'eNETS',
        icon: 'logo-usd',
        handler: () => {
          this.presentModal('enets', option);
        }
      }, {
        text: 'Credit Card',
        icon: 'card',
        handler: () => {
          this.presentModal('credit', option);
        }
      }, {
        text: 'QR Code',
        icon: 'qr-scanner',
        handler: () => {
          this.presentModal('qr', option);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancelled');
        }
      }]
    });
    await actionSheet.present();
  }

  async presentModal (paymentWay, option) {
    let amount = option === 'purchase' ? this.amountPurchase : this.amountRenew;
    let page: any;
    if (paymentWay === 'enets') page = EnetsPage;
    if (paymentWay === 'credit') page = CreditPage;
    if (paymentWay === 'qr') page = QrcodePage;
    const modal = await this.modalController.create({
      component: page,
      componentProps: { amount: amount }
    });
    modal.onDidDismiss().then(
      async result => {
      console.log(result.data);
      if (result.data === "success") {
        this.title = "My Season Parkings";
        const loading = await this.loadingController.create({
          message: 'Please wait...',
          duration: 5000
        });
        await loading.present();
        if (option === 'purchase') {
          this.purchaseSeason();
          this.successMessage = "Purchase success";
          setTimeout(() => {
            loading.dismiss();
            this.successMessage = null;
          }, 3000)
        } else {
          this.submitRenewSeason();
          this.successMessage = "Renew success";
          setTimeout(() => {
            loading.dismiss();
            this.successMessage = null;
          }, 3000)
        }
        
      } else {
        this.errorMessage = "Payment fail";
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000)
      }
    });
    return await modal.present();
  }

}
