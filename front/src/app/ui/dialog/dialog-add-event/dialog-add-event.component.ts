import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICustomEvent } from 'src/app/models/customEvent.model';
import { ISymptom } from 'src/app/models/symptom.model';
import { IDetailedDate } from 'src/app/models/detailed.date';
import { getDetailedDate } from 'src/app/util/date.utils';

export interface IDialogData {
	date: string;
	detailedDate: IDetailedDate;
	monthShort: string;
	type: string;
	time: string;
	key: string;
	detail: string;
	pain: number;
	quantity: number;
	wakeUp: string;
	goToBed: string;
	customEvent: ICustomEvent;
	symptoms: ISymptom[];
	edit: boolean;
}

@Component({
	selector: 'app-dialog-add-event',
	templateUrl: 'dialog-add-event.component.html'
})
export class DialogAddEventComponent {
	constructor(
		public dialogRef: MatDialogRef<DialogAddEventComponent>,
		@Inject(MAT_DIALOG_DATA) public data: IDialogData
	) {
		data.detailedDate = getDetailedDate(new Date(data.date));
		if (data.customEvent != null) {
			data.edit = true;
			data.type = data.customEvent.type;
			data.time = data.customEvent.time;
			data.key = data.customEvent.key;
			data.detail = data.customEvent.detail;
			data.pain = data.customEvent.pain;
			data.quantity = data.customEvent.quantity;
		} else {
			data.edit = false;
		}
	}

	public onNoClick(): void {
		this.dialogRef.close({ 'answer': 'no' });
	}

	public onYesClick(): void {
		this.dialogRef.close({
			'answer': 'yes',
			'edit': this.data.edit,
			'time': this.data.time,
			'type': this.data.type,
			'key': this.data.key,
			'pain': this.data.pain,
			'detail': this.data.detail,
			'quantity': this.data.quantity
		});
	}

	public onSymptomsClick(): void {
		this.dialogRef.close({ 'answer': 'symptoms' });
	}
}