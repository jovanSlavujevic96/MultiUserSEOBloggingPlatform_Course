import fetch from 'isomorphic-fetch';
import {API} from '../config'
import queryString from 'query-string';

export const userPublicProfile = (username) => {
    return fetch(`${API}/user/username`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        }
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};
