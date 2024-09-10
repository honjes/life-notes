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
