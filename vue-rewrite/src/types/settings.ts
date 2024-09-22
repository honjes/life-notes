import { IDay } from "./day"
import { IMedBasic } from "./med"
import { INoteBasic } from "./note"
import { ISymptom } from "./symptom"

export enum Languages {
  FR = "fr",
  EN = "en",
}

export enum TimeFormats {
  h24 = "24h",
  h12 = "12h (AM/PM)",
}

export interface ISettings {
  defaultSymptom: string
  language: Languages
  timeFormat: TimeFormats
}

export interface IBackup {
  days: IDay[]
  symptoms: ISymptom[]
  meds: IMedBasic[]
  notes: INoteBasic[]
  settings: ISettings
  version: string
}
