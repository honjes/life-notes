import { IBackup, IDay, IMedBasic, INoteBasic, ISymptom, Languages, TimeFormats } from "@/types"
import { generateInsertDataFromBackup } from "@/utils"
import { expect } from "vitest"
import {
  v000backup,
  v000Differentbackup,
  v000DifferentDaysbackup,
  v000DifferentDaysExpectedData,
  v000DifferentExpectedData,
  v000ExpectedData,
  v000Multiplebackup,
  v000MultipleExpectedData,
  v001backup,
  v001ExpectedData,
} from "./testData"

describe("generateInsertDataFromBackup", () => {
  test("generates data from empty backup", () => {
    const backup_days: IDay[] = []
    const backup_symptoms: ISymptom[] = []
    const backup_meds: IMedBasic[] = []
    const backup_notes: INoteBasic[] = []

    const backup: IBackup = {
      days: backup_days,
      symptoms: backup_symptoms,
      meds: backup_meds,
      notes: backup_notes,
      settings: {
        defaultSymptom: "none",
        language: Languages.EN,
        timeFormat: TimeFormats.h24,
      },
      version: "0.0.1",
    }
    const { days, symptoms, meds, notes, settings } = generateInsertDataFromBackup(backup)
    expect(days).toEqual([])
    expect(symptoms).toEqual([])
    expect(meds).toEqual([])
    expect(notes).toEqual([])
    expect(settings).toEqual(backup.settings)
  })
  test("generates data from backup version 0.0.1", () => {
    const { days, symptoms, meds, notes, settings } = generateInsertDataFromBackup(v001backup)

    expect(days).toEqual(v001ExpectedData.days)
    expect(symptoms).toEqual(v001ExpectedData.symptoms)
    expect(meds).toEqual(v001ExpectedData.meds)
    expect(notes).toEqual(v001ExpectedData.notes)
    expect(settings).toEqual(v001ExpectedData.settings)
  })
  test("generates data from backup version 0.0.0", () => {
    const { days, symptoms, meds, notes } = generateInsertDataFromBackup(v000backup as unknown as IBackup)

    expect(days).toEqual(v000ExpectedData.days)
    expect(symptoms).toEqual(v000ExpectedData.symptoms)
    expect(meds).toEqual(v000ExpectedData.meds)
    expect(notes).toEqual(v000ExpectedData.notes)
  })
  test("throw when backup is from unkown format", () => {
    expect(() => generateInsertDataFromBackup({} as unknown as IBackup)).toThrowError("Unknown backup version")
  })
  test("throw when backup has unknown version", () => {
    expect(() => generateInsertDataFromBackup({ version: "keineVersionsnummer" } as unknown as IBackup)).toThrowError(
      "Unknown backup version"
    )
  })
  test("generate data from backup version 0.0.0 when multiple meds and notes are in the same day", () => {
    const { days, meds, symptoms, notes } = generateInsertDataFromBackup(v000Multiplebackup as unknown as IBackup)

    expect(days).toEqual(v000MultipleExpectedData.days)
    expect(symptoms).toEqual(v000MultipleExpectedData.symptoms)
    expect(meds).toEqual(v000MultipleExpectedData.meds)
    expect(notes).toEqual(v000MultipleExpectedData.notes)
  })
  test("generate data from backup version 0.0.0 when different meds and notes are in the same day", () => {
    const { days, meds, symptoms, notes } = generateInsertDataFromBackup(v000Differentbackup as unknown as IBackup)

    expect(days).toEqual(v000DifferentExpectedData.days)
    expect(symptoms).toEqual(v000DifferentExpectedData.symptoms)
    expect(meds).toEqual(v000DifferentExpectedData.meds)
    expect(notes).toEqual(v000DifferentExpectedData.notes)
  })
  test("generate data from backup version 0.0.0 when different meds and notes are in multiple days", () => {
    const { days, meds, symptoms, notes } = generateInsertDataFromBackup(v000DifferentDaysbackup as unknown as IBackup)

    expect(days).toEqual(v000DifferentDaysExpectedData.days)
    expect(symptoms).toEqual(v000DifferentDaysExpectedData.symptoms)
    expect(meds).toEqual(v000DifferentDaysExpectedData.meds)
    expect(notes).toEqual(v000DifferentDaysExpectedData.notes)
  })
})
