import { Component, OnInit } from '@angular/core';
import { HttpService } from '../_services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController, LoadingController, ToastController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Profile } from '../_shared/profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profileForm: FormGroup;
  profile: Profile;
  readOnly: boolean = true;

  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    public popoverController: PopoverController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.getClient().subscribe(data => {
      this.profile = data.result;
      this.createForm();
    })
  }

  getClient() {
    return this.httpService.get('users/profile').pipe(
      catchError(error => this.httpService.handleError(error))
    );
  }

  createForm() {
    this.profileForm = this.fb.group({
      ClientID: this.profile.ClientID,
      Email: this.profile.Email,
      Salutation: this.profile.Salutation,
      FirstName: this.profile.FirstName,
      LastName: this.profile.LastName,
      NRIC: this.profile.NRIC,
      CompanyName: this.profile.CompanyName,
      ContactNo: this.profile.ContactNo,
      Fax: this.profile.Fax,
      Country: this.profile.Country,
      StreetName: this.profile.StreetName,
      Block: this.profile.Block,
      UnitNo: this.profile.UnitNo,
      PostalCode: this.profile.PostalCode,
      Website: this.profile.Website
    });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
  
  async updateProfile() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 5000
    });
    await loading.present();
    this.profile = this.profileForm.value;
    this.httpService.post('users/profile', this.profile).subscribe(
      async data => {
        const toast = await this.toastController.create({
          message: 'Profile updated',
          position: 'middle',
          color: 'tertiary',
          duration: 2000
        });
        loading.dismiss();
        toast.present();
      }, error => {
        this.httpService.handleError(error);
      }
    );

    this.getClient().subscribe(data => {
      this.profile = data.result;
      console.log(this.profile);
      this.profileForm.reset({
        ClientID: this.profile.ClientID,
        Email: this.profile.Email,
        Salutation: this.profile.Salutation,
        FirstName: this.profile.FirstName,
        LastName: this.profile.LastName,
        NRIC: this.profile.NRIC,
        CompanyName: this.profile.CompanyName,
        ContactNo: this.profile.ContactNo,
        Fax: this.profile.Fax,
        Country: this.profile.Country,
        StreetName: this.profile.StreetName,
        Block: this.profile.Block,
        UnitNo: this.profile.UnitNo,
        PostalCode: this.profile.PostalCode,
        Website: this.profile.Website
      });
    });
  }

}
