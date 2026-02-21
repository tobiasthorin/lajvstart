import { sequence } from "astro/middleware"

import { basicAuth } from "./basicAuth"
import { sessionValidation } from "./sessionValidation"

export const onRequest = sequence(basicAuth, sessionValidation)
