import { httpService } from "./http.service"

const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'
const BASE_URL = '/api/auth/'

export const authService = {
    login,
    signup,
    logout,
    getLoggedinUser
}

function login({ username, password }) {
  try {
    const user = await httpService.post(BASE_URL + 'login', {
      username,
      password,
    })
    _setLoggedInUser(user)
    return user
  } catch (error) {
    console.log('Could not login')
  }   
}

function signup({ username, password, fullname }) {
     try {
    const user = await httpService.post(BASE_URL + 'signup', {username, password, fullname})
    _setLoggedInUser(user)
    return user
  } catch (err) {
    console.log('Could not signup')
  }
}

function logout() {
try {
    await httpService.post(BASE_URL + 'logout')
    sessionStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.log('Could not logout')
  }    
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}



function _setLoggedinUser(user) {
    const { _id, fullname, isAdmin } = user
    const userToSave = { _id, fullname, isAdmin }
    
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}

