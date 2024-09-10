import { DataTypes, INote, INoteBasic, INoteOverview } from "@/types"
import { dateFormat } from "./date"
import { format } from "date-fns"

/**
 * Creates a ILog object
 * @param {string} key - note key
 * @param {string} time - time of the note
 * @param {string} detail - details
 * @returns {ILog}
 */
export function buildNote(key: string): INoteBasic & { _id: string } {
  return {
    _id: `note-${key}`,
    type: DataTypes.note,
    key: key,
    occurrences: 0,
    lastEntry: format(new Date("01-01-2000"), dateFormat),
  }
}

/**
 * Builds a note overview
 * @param {INote} note - note to build overview from
 * @returns {INoteOverview}
 */
export function buildNoteOverview(note: INote): INoteOverview[] {
  return note.log.map(log => ({
    type: DataTypes.note,
    key: note.key,
    occurrences: note.occurrences,
    lastEntry: note.lastEntry,
    logKey: log.key,
    time: log.time,
    detail: log.detail,
  }))
}
