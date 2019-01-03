import { Component } from '@angular/core';
import { ToastController, PopoverController, ModalController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-enets',
  templateUrl: './enets.page.html',
  styleUrls: ['./enets.page.scss'],
})
export class EnetsPage {

  constructor(
    public toastController: ToastController,
    public popoverController: PopoverController,
    private modalController: ModalController
  ) { }

  async presentToastWithOptions(status) {
    const toast = await this.toastController.create({
      message: 'Payment ' + status,
      duration: 3000,
      showCloseButton: true,
      position: 'top',
      color: 'tertiary',
      closeButtonText: 'OK'
    });
    toast.present();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  close(status) {
    this.presentToastWithOptions(status);
    this.modalController.dismiss(status);
  }

}
