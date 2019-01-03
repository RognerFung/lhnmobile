import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { HttpService } from '../_services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-menu',
  templateUrl: './logout-menu.component.html',
  styleUrls: ['./logout-menu.component.scss']
})
export class LogoutMenuComponent implements OnInit {

  data: string;

  constructor(
    private httpService: HttpService,
    public popoverController: PopoverController,
    private navParams: NavParams,
    private router: Router
  ) { }

  ngOnInit() {
    this.data = this.navParams.get('data') ? this.navParams.get('data') : "menu";
  }

  close() {
    this.popoverController.dismiss()
  }
  
}
