import { Component, OnInit } from '@angular/core';
import { HttpService } from '../_services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController, LoadingController, ToastController } from '@ionic/angular';
import { LogoutMenuComponent } from '../logout-menu/logout-menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  user: any = {Email: undefined, Password: undefined};
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
    this.checkLogin();
  }

  ionViewWillEnter() {
    this.createForm();
    this.checkLogin();
  }

  createForm() {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required]]
    });
  }

  async checkLogin () {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 10000
    });
    await loading.present();
    this.httpService.get('users/checkJWT').subscribe(
      data => {
        if (data.token) {
          this.httpService.storeCredentials(data);
          this.successMessage = data.message;
          setTimeout(() => {
            this.successMessage = null;
            loading.dismiss();
            this.router.navigate(['/dashboard']);
          }, 1000);
        } else {
          loading.dismiss();
          this.httpService.destroyCredentials();
        }
      }, error => {
        this.errorMessage = error.message;
        loading.dismiss();
        setTimeout(() => this.errorMessage = null, 3000);
      }
    )
  }

  async presentPopover (ev: any) {
    const popover = await this.popoverController.create({
      component: LogoutMenuComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 10000
    });
    await loading.present();
    this.user = this.loginForm.value;
    this.httpService.post('users/login', this.user).subscribe(
      async data => {
        if (data.token) {
          this.httpService.storeCredentials(data);
          this.successMessage = data.message;
          setTimeout(() => {
            this.successMessage = null;
            loading.dismiss();
            this.router.navigate(['/dashboard']);
          }, 1000);
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

    this.loginForm.reset({
      Email: '',
      Password: ''
    });

  }

}
