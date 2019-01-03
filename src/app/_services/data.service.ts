import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private missionAnnouncedSource = new Subject<string>();
  private missionConfirmedSource = new Subject<string>();
  
  constructor() { }

  missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  missionConfirmed$ = this.missionConfirmedSource.asObservable();

  announceMission(mission: string) {
    this.missionAnnouncedSource.next(mission);
  }
 
  confirmMission(astronaut: string) {
    this.missionConfirmedSource.next(astronaut);
  }

}
