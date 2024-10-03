import { sequence } from "astro/middleware"
import { sessionValidation } from "./sessionValidation"
import { basicAuth } from "./basicAuth"

export const onRequest = sequence(basicAuth, sessionValidation)
