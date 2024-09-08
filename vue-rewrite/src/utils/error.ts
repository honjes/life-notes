export enum NotFoundErrors {
  MedNotFound = "Med Not Found",
  NoteNotFound = "Note Not Found",
}

export class NotFoundError extends Error {
  status: number

  constructor(type: NotFoundErrors) {
    super(type)
    this.status = 404
  }
}
