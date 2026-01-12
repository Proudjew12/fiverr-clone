
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import gGigs from '../../data/gig.json'

const STORAGE_KEY = 'gig_db'

createGigs()
export const gigService = {
    query,
    getById,
    save,
    remove,
    addCarMsg,
    createGigs
}
window.cs = gigService


async function query(filterBy = {}) {
    var gigs = await storageService.query(STORAGE_KEY)
    const { topRated, basic, level1, level2 } = filterBy
    const txt = String(filterBy.txt || '').trim().toLowerCase()

    const levelsToFilter = []

    if (topRated) levelsToFilter.push("top rated")
    if (basic) levelsToFilter.push("basic")
    if (level1) levelsToFilter.push("1")
    if (level2) levelsToFilter.push("2")

    if (levelsToFilter.length > 0) {
        gigs = gigs.filter(gig => {
            return levelsToFilter.includes(gig.owner.level)
        })
    }
    if (txt) {
        gigs = gigs.filter(gig => {
            const haystack = [
                gig.title,
                gig.description,
                gig.owner?.fullname,
                ...(gig.tags || [])
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
            return haystack.includes(txt)
        })
    }


    // if(sortField === 'vendor'){
    //     gig.sort((gig1, gig2) => 
    //         gig1[sortField].localeCompare(gig2[sortField]) * +sortDir)
    // }
    // if(sortField === 'speed'){
    //     gig.sort((gig1, gig2) => 
    //         (gig1[sortField] - gig2[sortField]) * +sortDir)
    // }

    gigs = gigs.map(({ _id, title, owner, description, price, videoUrls }) => ({ _id, title, owner, description, price, videoUrls }))
    return gigs
}

function getById(carId) {
    return storageService.get(STORAGE_KEY, carId)
}

async function remove(carId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, carId)
}

async function save(car) {
    var savedCar
    if (car._id) {
        const carToSave = {
            _id: car._id,
            speed: car.speed
        }
        savedCar = await storageService.put(STORAGE_KEY, carToSave)
    } else {
        const carToSave = {
            vendor: car.vendor,
            speed: car.speed,
            // Later, owner is set by the backend
            owner: userService.getLoggedinUser(),
            msgs: []
        }
        savedCar = await storageService.post(STORAGE_KEY, carToSave)
    }
    return savedCar
}

async function addCarMsg(carId, txt) {
    // Later, this is all done by the backend
    const car = await getById(carId)

    const msg = {
        id: utilService.makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    car.msgs.push(msg)
    await storageService.put(STORAGE_KEY, car)

    return msg
}

function createGigs() {
    let gigs = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!gigs || !gigs.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gGigs))
    }
}
