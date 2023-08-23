import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassProteinIDService {
  pass$: Observable<any>;
  private passingSubject = new Subject<any>();
  
  constructor() {
    this.pass$ = this.passingSubject.asObservable();
  }

  pass(ID : string, method: string) {
    this.passingSubject.next({ID, method});
  }

}
