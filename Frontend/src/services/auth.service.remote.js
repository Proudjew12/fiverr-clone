import { httpService } from './http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'
const BASE_URL = 'auth/'

export const authService = {
  login,
  signup,
  logout,
  getLoggedinUser,
}

async function login({ username, password }) {
  try {
    const user = await httpService.post(`${BASE_URL}login`, { username, password })
    return _setLoggedinUser(user)
  } catch (err) {
    console.error('Could not login', err)
    throw err
  }
}

async function signup({ username, password, fullname }) {
  try {
    const user = await httpService.post(`${BASE_URL}signup`, {
      username,
      password,
      fullname,
    })
    return _setLoggedinUser(user)
  } catch (err) {
    console.error('Could not signup', err)
    throw err
  }
}

async function logout() {
  try {
    await httpService.post(`${BASE_URL}logout`)
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  } catch (err) {
    console.error('Could not logout', err)
    throw err
  }
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function _setLoggedinUser(user) {
  if (!user) return null
  const { _id, fullname, isAdmin } = user
  const userToSave = { _id, fullname, isAdmin: !!isAdmin }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
  return userToSave
}
