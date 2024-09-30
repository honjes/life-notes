export enum NotFoundErrors {
  MedNotFound = "Med Not Found",
  NoteNotFound = "Note Not Found",
}

export enum BackupErrors {
  UnknownVersion = "Unknown version",
  MissingDays = "Missing days",
}

export class NotFoundError extends Error {
  status: number

  constructor(type: NotFoundErrors) {
    super(type)
    this.status = 404
  }
}

export class BackupError extends Error {
  constructor(message: BackupErrors) {
    super(message)
  }
}
