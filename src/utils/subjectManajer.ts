import { Subject } from "rxjs";

export class SubjectManager<T> {
  subject$ = new Subject<T>();

  get getSubject() {
    return this.subject$.asObservable();
  }

  set setSubject(value: any) {
    this.subject$.next(value);
  }
}
