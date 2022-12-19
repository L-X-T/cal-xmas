import { Component, OnInit } from '@angular/core';
import { Flight } from '@flight-workspace/flight-lib';

@Component({
  selector: 'flight-workspace-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {
  flights: Flight[] = [
    { id: 1, from: 'Hamburg', to: 'Berlin', date: '2025-02-01T17:00+01:00', delayed: false },
    { id: 2, from: 'Hamburg', to: 'Frankfurt', date: '2025-02-01T17:30+01:00', delayed: false },
    { id: 3, from: 'Hamburg', to: 'Mallorca', date: '2025-02-01T17:45+01:00', delayed: false }
  ];

  constructor() {}

  ngOnInit(): void {}

  delete(): void {
    console.log('delete ...');
  }
}
