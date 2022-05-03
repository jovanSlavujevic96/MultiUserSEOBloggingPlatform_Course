import fetch from 'isomorphic-fetch';
import cookie from 'js-cookie';
import {API} from '../config'
import Router from 'next/router';

/**
 * @brief checks is user got 401 Unaothirzed error response
 * @if user is unathorized - it signouts user and forwards him to sign in page
 */
export const handleResponse = (response) => {
    if (response.status === 401) {
        signout(() => {
            Router.push({
                pathname: '/signin',
                query: {
                    message: 'Your session is expired. Please sign in.'
                }
            });
        });
    } else {
        return;
    }
};

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
        return cookie.get(key);
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

// get local storagr
export const getLocalStorage = (key) => {
    // if (process.browser) @deprecated
    if (typeof window) {
        return localStorage.getItem(key);
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
            const localStorageChecked = getLocalStorage('user');
            if (localStorageChecked) {
                return JSON.parse(localStorageChecked);
            }
            else {
                return false;
            }
        }
    }
};

// signout
export const signout = (next) => {
    removeCookie('token');
    removeLocalStorage('user');

    next();

    return fetch(`${API}/signout`, {
        method: 'GET'
    })
    .then(response => {
        console.log('signout success'); // debug
    })
    .catch(err => console.log(err));
};

export const updateUser = (user, next) => {
    // if (process.browser) @deprecated
    if (typeof window) {
        if (localStorage.getItem('user')) {
            // let auth = JSON.parse(localStorage.getItem('user'));
            // auth = user;
            // localStorage.setItem('user', JSON.stringify(auth)); //nonsense
            localStorage.setItem('user', JSON.stringify(user));
            next();
        }
    }
};
