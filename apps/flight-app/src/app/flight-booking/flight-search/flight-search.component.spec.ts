import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSearchComponent } from './flight-search.component';

import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { Observable, of } from 'rxjs';
import { Component, Directive, EventEmitter, Input, Output, Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';

describe('Unit test: flight-search.component', () => {
  let component: FlightSearchComponent;
  let fixture: ComponentFixture<FlightSearchComponent>;

  const resultMock = [
    { id: 17, from: 'Graz', to: 'Hamburg', date: 'now', delayed: true },
    { id: 18, from: 'Vienna', to: 'Barcelona', date: 'now', delayed: true },
    { id: 19, from: 'Frankfurt', to: 'Salzburg', date: 'now', delayed: true }
  ];

  const flightServiceMock = {
    find(from: string, to: string): Observable<Flight[]> {
      return of(resultMock);
    },
    // Implement the following members only if this code is used in your Component
    flights: [] as Flight[],
    load(from: string, to: string): void {
      this.find(from, to).subscribe((f) => {
        this.flights = f;
      });
    }
  };

  @Component({ selector: 'flight-card', template: '' })
  class FlightCardComponent {
    @Input() item: Flight;
    @Input() selected: boolean;
    @Output() selectedChange = new EventEmitter<boolean>();
  }

  // tslint:disable-next-line: directive-selector
  @Directive({ selector: 'input[city]' })
  class CityValidatorDirective {
    @Input() city: string[];
    validate = (_) => null;
  }

  // tslint:disable-next-line: use-pipe-transform-interface
  @Pipe({ name: 'city' })
  class CityPipe implements PipeTransform {
    transform = (v) => v;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FlightSearchComponent, FlightCardComponent, CityPipe, CityValidatorDirective]
    }).overrideComponent(FlightSearchComponent, {
      set: {
        providers: [
          {
            provide: FlightService,
            useValue: flightServiceMock
          }
        ]
      }
    });

    fixture = TestBed.createComponent(FlightSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not have any flights loaded initially', () => {
    expect(component.flights.length).toBe(0);
  });

  /*it('should load flights when user entered from and to', () => {
    component.from = 'Graz';
    component.to = 'Hamburg';
    component.search();

    const httpTestingController: HttpTestingController = TestBed.inject(HttpTestingController);
    const req = httpTestingController.expectOne('http://www.angular.at/api/flight?from=Graz&to=Hamburg');
    // req.request.method === 'GET'

    req.flush([
      {
        id: 22,
        from: 'Graz',
        to: 'Hamburg',
        date: ''
      }
    ]);

    expect(component.flights.length).toBe(1);
  });*/

  it('should not load flights w/o from and to', () => {
    component.from = '';
    component.to = '';
    component.search();

    expect(component.flights.length).toBe(0);
  });

  it('should load flights w/ from and to', () => {
    component.from = 'Hamburg';
    component.to = 'Graz';
    component.search();

    expect(component.flights.length).toBeGreaterThan(0);
  });
});
