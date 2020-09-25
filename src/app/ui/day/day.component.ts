import { Component, OnInit } from '@angular/core';
import { DaysService } from '../../infra';
import { IDay } from '../../models';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-day',
	templateUrl: './day.component.html',
	styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {

	public day$: Observable<IDay>;

	constructor(
		private daysService: DaysService,
		private route: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.day$ = this.daysService.getDay(this.route.snapshot.paramMap.get('date'));
	}
}
