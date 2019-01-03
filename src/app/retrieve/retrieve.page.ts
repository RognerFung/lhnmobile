import { Component, OnInit } from '@angular/core';
import { HttpService } from '../_services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController, LoadingController, ToastController } from '@ionic/angular';
import { LogoutMenuComponent } from '../logout-menu/logout-menu.component';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-retrieve',
  templateUrl: './retrieve.page.html',
  styleUrls: ['./retrieve.page.scss'],
})
export class RetrievePage implements OnInit {

  retrieveForm: FormGroup;
  email: any;
  errorMessage: string;
  successMessage: string;

  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    public popoverController: PopoverController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.retrieveForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]]
    });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LogoutMenuComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
 
  async retrieve() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 5000
    });
    await loading.present();
    this.email = this.retrieveForm.value;
    this.httpService.post('users/retrievePassword', this.email).subscribe(
      data => {
        if (data.success) {
          this.successMessage = "Check your email for password";
          setTimeout(() => {
            this.successMessage = null;
            loading.dismiss();
            this.router.navigate(['/login']);
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

    this.retrieveForm.reset({
      Email: ''
    });
  }

}
