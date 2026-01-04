// middlewares/logger.middleware.js
import { loggerService } from '../services/logger.service.js'

export function loggerMiddleware(req, res, next) {
  const { method, originalUrl, params, query } = req
  loggerService.info(method, originalUrl, { params, query })
  next()
}

