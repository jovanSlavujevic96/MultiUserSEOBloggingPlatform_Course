import fetch from 'isomorphic-fetch';
import cookie from 'js-cookie';
import {API} from '../config'

// signup
export const signup = (user) => {
    return fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user) // converts js objects into JSON objects
    })
    // once we send our message we're going to get/handle the response
    .then(response => {
        return response.json();
    })
    // catch error -> log it on console
    .catch(err => console.log(err));
};

// signin
export const signin = (user) => {
    return fetch(`${API}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user) // converts js objects into JSON objects
    })
    // once we send our message we're going to get/handle the response
    .then(response => {
        return response.json();
    })
    // catch error -> log it on console
    .catch(err => console.log(err));
};

// set cookie
export const setCookie = (key, value) => {

    // we need to make sure that we are running on the client side
    // if (process.browser) @deprecated
    if (typeof window) {
        // CLIENT STUFF
        cookie.set(key, value, {
            expires: 1 /* in days */
        });
    }
};

export const removeCookie = (key) => {
    // if (process.browser) @deprecated
    if (typeof window) {
        cookie.remove(key, {
            expires: 1 /* in days */
        });
    }
};

// get cookie
export const getCookie = (key) => {
    // if (process.browser) @deprecated
    if (typeof window) {
        cookie.get(key);
    }
};

// local storage
export const setLocalStorage = (key, value) => {
    // if (process.browser) @deprecated
    if (typeof window) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

export const removeLocalStorage = (key) => {
    // if (process.browser) @deprecated
    if (typeof window) {
        localStorage.removeItem(key);
    }
};

// authenticate user by pass data to cookie and local storage
export const authenticate = (data, next) => {
    // save user token to cookie
    setCookie('token', data.token);

    // save user info to local storage
    setLocalStorage('user', data.user);

    // executes the callback function -> basically middleware
    next();
};

export const isAuth = () => {
    // if (process.browser) @deprecated
    if (typeof window) {
        if (getCookie('token')) {
            const localStorageChecked = localStorage.getItem('user');
            if (localStorageChecked) {
                return JSON.parse(localStorageChecked);
            }
            else {
                return false;
            }
        }
    }
};
