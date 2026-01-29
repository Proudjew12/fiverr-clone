import { gigService } from './gig.service.js'
import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export async function getGigs(req, res) {
  try {
    const filterBy = {
      txt: req.query.txt || '',
      tags: utilService.normalizeArrayQuery(req.query.tags),
      minPrice: utilService.toNumberOrNull(req.query.minPrice),
      maxPrice: utilService.toNumberOrNull(req.query.maxPrice),
    }

    const Gigs = await gigService.query(filterBy)
    res.json(Gigs)
  } catch (err) {
    loggerService.error('Failed to get Gigs', err)
    res.status(500).send({ error: 'Failed to get Gigs' })
  }
}

export async function getGigById(req, res) {
  try {
    const { id } = req.params
    const Gig = await gigService.getById(id)
    res.json(Gig)
  } catch (err) {
    loggerService.error('Failed to get Gig by id', err)
    res.status(err.status || 500).send({ error: err.message || 'Failed to get Gig' })
  }
}

export async function addGig(req, res) {
  try {
    const saved = await gigService.add(req.body)
    res.status(201).json(saved)
  } catch (err) {
    loggerService.error('Failed to add Gig', err)
    res.status(err.status || 500).send({ error: err.message || 'Failed to add Gig' })
  }
}

export async function updateGig(req, res) {
  try {
    const { id } = req.params
    const saved = await gigService.update({ ...req.body, _id: id })
    res.json(saved)
  } catch (err) {
    loggerService.error('Failed to update Gig', err)
    res.status(err.status || 500).send({ error: err.message || 'Failed to update Gig' })
  }
}

export async function removeGig(req, res) {
  try {
    const { id } = req.params
    await gigService.remove(id)
    res.send({ ok: true })
  } catch (err) {
    loggerService.error('Failed to remove Gig', err)
    res.status(err.status || 500).send({ error: err.message || 'Failed to remove Gig' })
  }
}
