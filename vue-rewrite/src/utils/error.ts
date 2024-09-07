export enum NotFoundErrors {
  MedNotFound = "Med Not Found",
}

export class NotFoundError extends Error {
  status: number

  constructor(type: NotFoundErrors) {
    super(type)
    this.status = 404
  }
}
