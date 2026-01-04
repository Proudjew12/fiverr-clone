import express from 'express'
import {
  getFiverrs,
  getFiverrById,
  addFiverr,
  updateFiverr,
  removeFiverr,
} from './fiverr.controller.js'

export const fiverrRoutes = express.Router()

fiverrRoutes.get('/', getFiverrs)
fiverrRoutes.get('/:id', getFiverrById)
fiverrRoutes.post('/', addFiverr)
fiverrRoutes.put('/:id', updateFiverr)
fiverrRoutes.delete('/:id', removeFiverr)
