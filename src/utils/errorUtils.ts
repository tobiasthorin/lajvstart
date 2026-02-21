import { errorResponse } from "./responseUtils"

export class BadRequestError extends Error {
  errorCode: number = 400
}

export class InternalError extends Error {
  errorCode: number = 500
}

export function handleServiceError(error: unknown) {
  console.error(error)

  if (error instanceof Error) {
    return errorResponse(error.message, 500)
  }
  return errorResponse("Unknown error", 500)
}
