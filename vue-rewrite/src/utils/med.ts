import { DataTypes } from "@/types"
import { IMed, IMedBasic, IMedLog, IMedOverview } from "@/types/med"
import { randomNumber } from "."

export function buildMed(key: string, quantity: number, log: IMedLog): IMed & { _id: string } {
  return {
    _id: `med-${key}`,
    type: DataTypes.meds,
    key: key,
    quantity: quantity,
    log: [log],
  }
}

/**
 * Build a med for the db
 * @param {string} key - med key
 * @param {number} quantity - med quantity
 * @returns {IMedBasic} med
 */
export function buildMedForDb(key: string, quantity: number): IMedBasic & { _id: string } {
  return {
    _id: `med-${key}`,
    type: DataTypes.meds,
    key: key,
    quantity: quantity,
  }
}

/**
 * Builds a med intake time as IMedLog
 * @param {string} time - med intake time
 * @returns {IMedLog} log of the med
 */
export function buildMedLog(time: string): IMedLog {
  return {
    key: randomNumber(),
    time: time,
  }
}

/**
 * Builds an array of med intake times as IMedOverviews
 * @param {IMed} med - med to build overviews from
 * @returns {IMedOverview[]} overviews of the med
 */
export function buildMedOverview(med: IMed): IMedOverview[] {
  return med.log.map(log => ({
    type: DataTypes.meds,
    key: med.key,
    quantity: med.quantity,
    logKey: log.key,
    time: log.time,
  }))
}
