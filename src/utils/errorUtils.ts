export class InternalError extends Error {
  errorCode: number = 500
}

export class BadRequestError extends Error {
  errorCode: number = 400
}
