import {
  DataTypes,
  IBackup,
  IDay,
  IMed,
  IMedBasic,
  IMedWithId,
  INote,
  INoteBasic,
  INoteWithId,
  ISettings,
  ISymptom,
} from "@/types"
import { isAfter } from "date-fns"
import { BackupError, BackupErrors } from "./error"

export interface GenerateInsertDataFromBackupReturn {
  days: IDay[]
  symptoms: ISymptom[]
  meds: IMedBasic[]
  notes: INoteBasic[]
  settings: ISettings
}

/**
 * Generates the data to insert into the database from a backup
 * @param {IBackup} backup - backup to generate data from
 * @returns {Promise<void>} void
 */
export function generateInsertDataFromBackup(backup: IBackup): GenerateInsertDataFromBackupReturn {
  let days: IDay[] = []
  let symptoms: ISymptom[] = []
  let meds: IMedBasic[] = []
  let notes: INoteBasic[] = []
  let settings: ISettings = {} as ISettings

  if (backup.version != undefined) {
    switch (backup.version) {
      case "0.0.1":
        days = backup.days
        symptoms = backup.symptoms
        meds = backup.meds
        notes = backup.notes
        settings = backup.settings
        break
      default:
        throw new BackupError(BackupErrors.UnknownVersion)
    }
  } else {
    if (backup.days == undefined) {
      throw new BackupError(BackupErrors.MissingDays)
    }
    // generate data from backup version 0.0.0
    days = backup.days
    settings = backup.settings

    // go over every day and convert meds, notes and symptoms
    days.forEach((day, index) => {
      // convert meds
      if (day.meds.length > 0) {
        const newDayMeds: IMed[] = []
        day.meds.forEach(med => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const currentMed = med as any

          // check if med already exists
          const medIndex = meds.findIndex(m => m.key === currentMed.key)
          if (medIndex != -1) {
            meds[medIndex].occurrences++
            if (isAfter(new Date(day.date), new Date(meds[medIndex].lastEntry))) {
              meds[medIndex].lastEntry = day.date
            }
          } else {
            meds.push({
              _id: `med-${currentMed.key}`,
              key: currentMed.key,
              quantity: currentMed.quantity,
              occurrences: 1,
              lastEntry: day.date,
              type: DataTypes.meds,
            } as IMedWithId)
          }

          // check if med exists in current day
          const medInDayIndex = newDayMeds.findIndex(m => m.key === currentMed.key)
          if (medInDayIndex != -1) {
            newDayMeds[medInDayIndex].log.push({
              key: (newDayMeds[medInDayIndex].log.length + 1).toString(),
              time: currentMed.time,
            })
          } else {
            const newMed = {
              ...currentMed,
              type: DataTypes.meds,
              _id: `med-${currentMed.key}`,
              log: [
                {
                  key: "1",
                  time: currentMed.time,
                },
              ],
            }
            delete newMed.time
            newDayMeds.push(newMed)
          }
        })
        days[index].meds = newDayMeds
      }

      // convert notes
      if (day.logs.length > 0) {
        const newDayLogs: INote[] = []
        day.logs.forEach(log => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const currentNote = log as any

          // check if note already exists
          const noteIndex = notes.findIndex(n => n.key === currentNote.key)
          if (noteIndex != -1) {
            notes[noteIndex].occurrences++
            if (isAfter(new Date(day.date), new Date(notes[noteIndex].lastEntry))) {
              notes[noteIndex].lastEntry = day.date
            }
          } else {
            notes.push({
              _id: `note-${currentNote.key}`,
              type: DataTypes.note,
              key: currentNote.key,
              occurrences: 1,
              lastEntry: day.date,
            } as INoteWithId)
          }

          // check if note exists in current day
          const noteInDayIndex = newDayLogs.findIndex(n => n.key === currentNote.key)
          if (noteInDayIndex != -1) {
            newDayLogs[noteInDayIndex].log.push({
              key: (newDayLogs[noteInDayIndex].log.length + 1).toString(),
              time: currentNote.time,
              detail: "",
            })
          } else {
            const newNote = {
              ...currentNote,
              _id: `note-${currentNote.key}`,
              log: [
                {
                  key: "1",
                  time: currentNote.time,
                  detail: "",
                },
              ],
              type: DataTypes.note,
            }
            delete newNote.time

            newDayLogs.push(newNote)
          }
        })
        days[index].logs = newDayLogs
      }

      // convert symptoms
      if (day.symptoms.length > 0) {
        const newDaySymptoms: ISymptom[] = []
        day.symptoms.forEach(symptom => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const currentSymptom = symptom as any
          const newSymptom = {
            ...currentSymptom,
            _id: `symptom-${currentSymptom.key}`,
            type: DataTypes.symptoms,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            logs: currentSymptom.logs.map((log: any, index: number) => {
              return {
                ...log,
                key: (index + 1).toString(),
              }
            }),
          }
          newDaySymptoms.push(newSymptom)
        })
        days[index].symptoms = newDaySymptoms
      }
    })

    // change symptoms
    symptoms = backup.symptoms.map(symptom => {
      const newSymptom = {
        ...symptom,
        _id: `symptom-${symptom.key}`,
        logs: [],
      }
      return newSymptom
    })
  }

  return {
    days,
    symptoms,
    meds,
    notes,
    settings,
  }
}
