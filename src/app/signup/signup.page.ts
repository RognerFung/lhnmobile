import { Component, OnInit } from '@angular/core';
import { HttpService } from '../_services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController, LoadingController, ToastController } from '@ionic/angular';
import { LogoutMenuComponent } from '../logout-menu/logout-menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {

  signupForm: FormGroup;
  user: any = {
    Email: undefined,
    Password: undefined,
    PasswordConfirm: undefined
  };
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
    this.signupForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required]],
      PasswordConfirm: ['', [Validators.required]]
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
  
  async signup() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 10000
    });
    await loading.present();
    this.user = this.signupForm.value;
    this.httpService.post('users/signup', this.user).subscribe(
      data => {
        if (data.success) {
          this.successMessage = "Sign up success";
          setTimeout(() => {
            this.successMessage = null;
            loading.dismiss();
            this.router.navigate(['/login']);
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
    this.formReset();
  }

  formReset () {
    this.signupForm.reset({
      Email: '',
      Password: '',
      PasswordConfirm: ''
    });
  }

  onFormChange (ev: any) {
    if (this.signupForm.controls.Email.dirty && !this.signupForm.controls.Email.valid) {
      this.errorMessage = "Email invalid";
      setTimeout(() => this.errorMessage = null, 3000);
    } else if (this.signupForm.controls.Password.dirty && this.signupForm.controls.Password.value.length < 8) {
      this.errorMessage = "Password less than 8 characters";
      setTimeout(() => this.errorMessage = null, 3000);
    } else if (this.signupForm.controls.PasswordConfirm.dirty && this.signupForm.controls.PasswordConfirm.value.length < 8) {
      this.errorMessage = "Password less than 8 characters";
      setTimeout(() => this.errorMessage = null, 3000);
    } else if (this.signupForm.controls.PasswordConfirm.dirty && this.signupForm.controls.Password.value != this.signupForm.controls.PasswordConfirm.value) {
      this.errorMessage = "Two passwords not the same";
      setTimeout(() => this.errorMessage = null, 3000);
    }
  }

}
