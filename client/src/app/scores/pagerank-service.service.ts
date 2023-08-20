import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagerankServiceService {
  passscore$: Observable<any>;
  private passingSubject = new Subject<any>();
  
  constructor() {
    this.passscore$ = this.passingSubject.asObservable();
  }

  passscore(score : number) {
    this.passingSubject.next(score);
  }
}
