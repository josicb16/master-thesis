import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataPassingService {
  pass$: Observable<any>;
  private passingSubject = new Subject<any>();

  constructor() {
    this.pass$ = this.passingSubject.asObservable();
  }

  pass(data : any) {
    this.passingSubject.next(data);
  }

}
