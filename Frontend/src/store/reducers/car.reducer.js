export const SET_CARS = 'SET_CARS'
export const SET_CAR = 'SET_CAR'
export const REMOVE_CAR = 'REMOVE_CAR'
export const ADD_CAR = 'ADD_CAR'
export const UPDATE_CAR = 'UPDATE_CAR'
export const ADD_CAR_MSG = 'ADD_CAR_MSG'

const initialState = {
    cars: [],
    car: null
}

export function carReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CARS:
            return { ...state, cars: action.cars }
        case SET_CAR:
            return { ...state, car: action.car }
        case REMOVE_CAR: {
            const lastRemovedCar = state.cars.find(car => car._id === action.carId)
            const cars = state.cars.filter(car => car._id !== action.carId)
            return { ...state, cars, lastRemovedCar }
        }
        case ADD_CAR:
            return { ...state, cars: [...state.cars, action.car] }
        case UPDATE_CAR: {
            const cars = state.cars.map(car => (car._id === action.car._id ? action.car : car))
            return { ...state, cars }
        }
        case ADD_CAR_MSG:
            if (!action.msg || !state.car) return state
            return {
                ...state,
                car: { ...state.car, msgs: [...(state.car.msgs || []), action.msg] }
            }
        default:
            return state
    }
}

