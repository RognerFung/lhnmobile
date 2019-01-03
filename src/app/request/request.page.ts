import { Component, OnInit } from '@angular/core';
import { HttpService } from '../_services/http.service';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { Request } from '../_shared/request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {

  requests: Request[];

  constructor(
    private httpService: HttpService,
    public popoverController: PopoverController,
    private router: Router
  ) { }

  ngOnInit() {
    this.httpService.checkLogin().subscribe(
      success => {
        if (success) {
          this.getRequests();
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
          this.getRequests();
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

  getRequests() {
    this.httpService.get('vehicles/request').subscribe(
      data => {
        console.log(data);
        this.requests = data.result;
      }, error => {
        this.httpService.handleError(error);
      }
    )
  }


}
