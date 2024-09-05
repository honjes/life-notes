export interface ISymptomOverview {
  key: string
  pain: number
}

export interface ISymptomLog {
  time: string
  pain: number
  detail: string
}

export interface ISymptom {
  key: string
  pain?: string
  label?: string
  logs: ISymptomLog[]
}
