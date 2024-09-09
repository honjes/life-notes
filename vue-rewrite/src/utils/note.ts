import { DataTypes, INote, INoteBasic, INoteOverview } from "@/types"

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
    logKey: log.key,
    time: log.time,
    detail: log.detail,
  }))
}
