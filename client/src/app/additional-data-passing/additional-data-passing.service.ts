import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdditionalDataPassingService {
  pass$: Observable<any>;
  private passingSubject = new Subject<any>();

  constructor() {
    this.pass$ = this.passingSubject.asObservable();
  }

  pass(additional_data : any) {
    this.passingSubject.next(additional_data);
  }

}
