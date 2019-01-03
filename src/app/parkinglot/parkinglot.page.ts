import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../_services/http.service';

@Component({
  selector: 'app-parkinglot',
  templateUrl: './parkinglot.page.html',
  styleUrls: ['./parkinglot.page.scss'],
})
export class ParkinglotPage implements OnInit {

  client: any;


  constructor(
    private httpService: HttpService,
  ) { }

  ngOnInit() {
    this.client = this.getProfile().pipe(map(val => val.result));
  }

  getProfile(): Observable<any> {
    return this.httpService.get('users/profile');
  }

}
