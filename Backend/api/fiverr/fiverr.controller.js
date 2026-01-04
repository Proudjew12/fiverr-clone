import { fiverrService } from './fiverr.service.js'
import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export async function getFiverrs(req, res) {
  try {
    const filterBy = {
      txt: req.query.txt || '',
      tags: utilService.normalizeArrayQuery(req.query.tags),
      minPrice: utilService.toNumberOrNull(req.query.minPrice),
      maxPrice: utilService.toNumberOrNull(req.query.maxPrice),
    }

    const fiverrs = await fiverrService.query(filterBy)
    res.json(fiverrs)
  } catch (err) {
    loggerService.error('Failed to get fiverrs', err)
    res.status(500).send({ error: 'Failed to get fiverrs' })
  }
}

export async function getFiverrById(req, res) {
  try {
    const { id } = req.params
    const fiverr = await fiverrService.getById(id)
    res.json(fiverr)
  } catch (err) {
    loggerService.error('Failed to get fiverr by id', err)
    res.status(err.status || 500).send({ error: err.message || 'Failed to get fiverr' })
  }
}

export async function addFiverr(req, res) {
  try {
    const saved = await fiverrService.add(req.body)
    res.status(201).json(saved)
  } catch (err) {
    loggerService.error('Failed to add fiverr', err)
    res.status(err.status || 500).send({ error: err.message || 'Failed to add fiverr' })
  }
}

export async function updateFiverr(req, res) {
  try {
    const { id } = req.params
    const saved = await fiverrService.update({ ...req.body, _id: id })
    res.json(saved)
  } catch (err) {
    loggerService.error('Failed to update fiverr', err)
    res.status(err.status || 500).send({ error: err.message || 'Failed to update fiverr' })
  }
}

export async function removeFiverr(req, res) {
  try {
    const { id } = req.params
    await fiverrService.remove(id)
    res.send({ ok: true })
  } catch (err) {
    loggerService.error('Failed to remove fiverr', err)
    res.status(err.status || 500).send({ error: err.message || 'Failed to remove fiverr' })
  }
}
