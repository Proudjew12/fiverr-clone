import express from 'express'
import {
  getGigs,
  getGigById,
  addGig,
  updateGig,
  removeGig,
} from './gig.controller.js'

export const gigRoutes = express.Router()

gigRoutes.get('/', getGigs)
gigRoutes.get('/:id', getGigById)
gigRoutes.post('/', addGig)
gigRoutes.put('/:id', updateGig)
gigRoutes.delete('/:id', removeGig)
