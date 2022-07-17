import { Component, OnInit } from '@angular/core';
import { AirportService } from '@flight-workspace/flight-lib';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'airport',
  templateUrl: './airport.component.html'
})
export class AirportComponent implements OnInit {
  airports: string[] = [];
  airports$: Observable<string[]>;
  airportsObserver: Observer<string[]>;

  constructor(private airportService: AirportService) {}

  ngOnInit(): void {
    this.airports$ = this.airportService.findAll();

    this.airportsObserver = {
      next: (airports) => (this.airports = airports),
      error: (err) => console.error(err),
      complete: () => console.log('Observable completed!')
    };

    this.airports$.subscribe(this.airportsObserver);
  }
}
