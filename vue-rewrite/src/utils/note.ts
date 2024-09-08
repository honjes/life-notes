import { DataTypes, ILog } from "@/types/log"

/**
 * Creates a ILog object
 * @param {string} key - note key
 * @param {string} time - time of the note
 * @param {string} detail - details
 * @returns {ILog}
 */
export function buildNote(key: string, time: string, detail: string): ILog & { _id: string } {
  return {
    _id: `note-${key}`,
    type: DataTypes.note,
    key: key,
    time: time,
    detail: detail,
  }
}
