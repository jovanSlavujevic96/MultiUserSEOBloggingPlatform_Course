import fetch from 'isomorphic-fetch';
import {API} from '../config'

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
}

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
}
