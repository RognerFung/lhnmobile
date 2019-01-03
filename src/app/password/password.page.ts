import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '../_services/http.service';
import { PopoverController, LoadingController, ToastController  } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {

  passwordForm: FormGroup;
  password: any = {OldPassword: undefined, NewPassword: undefined};
  errorMessage: string;
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
    this.passwordForm = this.fb.group({
      OldPassword: '',
      NewPassword: '',
      NewPasswordConfirm: ''
    });
  }

  async presentPopover (ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  async changePassword() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 5000
    });
    await loading.present();
    this.password = this.passwordForm.value;
    this.httpService.post('users/changePassword', this.password).subscribe(
      async data => {
        if (data.success) {
          const toast = await this.toastController.create({
            message: 'Change password success',
            position: 'middle',
            color: 'tertiary',
            duration: 1000
          });
          loading.dismiss();
          toast.present();
          setTimeout(() => this.router.navigate(['/dashboard']), 1000);
        } else {
          loading.dismiss();
          this.errorMessage = data.message;
          setTimeout(() => this.errorMessage = null, 3000);
        }
      }, error => {
        loading.dismiss();
        this.errorMessage = error.message;
        setTimeout(() => this.errorMessage = null, 3000);
      }
    );
    this.passwordForm.reset({
      OldPassword: '',
      NewPassword: '',
      NewPasswordConfirm: ''
    });
  }

}
