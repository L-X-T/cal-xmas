import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'flight-workspace-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  delete(): void {
    console.log('delete ...');
  }
}
