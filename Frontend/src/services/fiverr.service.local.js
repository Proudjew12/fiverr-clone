
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import gGigs from '../../data/gig.json'

const STORAGE_KEY = 'gig_db'

_createGigs()

export const gigService = {
    query,
    getById,
    save,
    remove,
    addCarMsg
}
window.cs = gigService


async function query() {
    var gig = await storageService.query(STORAGE_KEY)
    // const { txt, minSpeed, sortField, sortDir } = filterBy

    // if (txt) {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     gig = gig.filter(gig => regex.test(gig.vendor) || regex.test(gig.description))
    // }
    // if (minSpeed) {
    //     gig = gig.filter(gig => gig.speed >= minSpeed)
    // }
    // if(sortField === 'vendor'){
    //     gig.sort((gig1, gig2) => 
    //         gig1[sortField].localeCompare(gig2[sortField]) * +sortDir)
    // }
    // if(sortField === 'speed'){
    //     gig.sort((gig1, gig2) => 
    //         (gig1[sortField] - gig2[sortField]) * +sortDir)
    // }
    
    gig = gig.map(({ _id, title, owner, description,price,videoUrls}) => ({ _id, title, owner, description,price,videoUrls}))
    return gig
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

function _createGigs() {
    let gigs = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!gigs || !gigs.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gGigs))
    }
}