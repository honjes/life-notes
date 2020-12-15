import { Component, OnInit } from '@angular/core';
import { SettingsService, ImporterExporterService } from './infra';
import { Subject } from 'rxjs';
import { ISymptom } from './models/symptom.model';
import { GlobalService } from './infra/global.service';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { DialogNoSymptomWarningComponent } from './ui/dialog-no-symptom-warning';
import { DialogSelectSymptomComponent } from './ui/dialog-select-symptom';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	public title = 'Life Notes & Stats';
	public symptoms: ISymptom[];
	public symptoms$: Subject<ISymptom[]>;

	constructor(
		public globalService: GlobalService,
		private translocoService: TranslocoService,
		private settingsService: SettingsService,
		private importerExporterService: ImporterExporterService,
		private dialog: MatDialog
	) {
		this.symptoms = new Array<ISymptom>();
		this.symptoms$ = new Subject<ISymptom[]>();
	}

	public ngOnInit(): void {
		// this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE]);

		this.updateSymptoms();
		this.settingsService.initSettings().subscribe(res => { }, error => { });
		this.initSettings();
		// this.autoBackup();
	}

	/*public autoBackup(): void {
		this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE).then(
			result => this.importerExporterService.exportData(true),
			err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE)
		);
	}*/

	public updateSymptoms(): void {
		this.globalService.symptoms$.subscribe(symptoms => {
			this.symptoms = [...symptoms];
			this.symptoms$.next(this.symptoms);
		});
	}

	public initSettings(): void {
		this.initLanguage();
		this.initTargetSymptom();
	}

	public initLanguage(): void {
		this.settingsService.getSettings().subscribe(
			settings => {
				if (!this.settingsService.AVAILABLE_LANGS.includes(settings.language)) {
					return;
				}
				this.translocoService.setActiveLang(settings.language);
				this.globalService.language = settings.language;
			}
		);
	}

	public initTargetSymptom(): void {
		this.settingsService.getSettings().subscribe(
			settings => {
				this.globalService.targetSymptomKey = settings.targetSymptomKey;
			}
		);
	}

	public selectSymptom(): void {
		this.globalService.loadSymptoms().subscribe(symptoms => {
			this.symptoms = [...symptoms];
			this.symptoms$.next(this.symptoms);

			if (this.symptoms.length === 0) {
				this.noSymptomWarning();
			} else {
				this.openSelectSymptom(this.symptoms);
			}
		});
	}

	public openSelectSymptom(symptoms: ISymptom[]): void {
		this.dialog.open(DialogSelectSymptomComponent, {
			autoFocus: false,
			width: '20rem',
			panelClass: 'custom-modalbox',
			data: { symptoms }
		}).afterClosed().subscribe(response => {
			if (response == null) {
				return;
			}
			this.globalService.targetSymptomKey = response.answer;
		});
	}

	public noSymptomWarning(): void {
		this.dialog.open(DialogNoSymptomWarningComponent, {
			autoFocus: false,
			width: '20rem',
			panelClass: 'custom-modalbox'
		}).afterClosed().subscribe(response => {
			if (response == null || response.answer !== 'yes') {
				return;
			}
		});
	}
}
