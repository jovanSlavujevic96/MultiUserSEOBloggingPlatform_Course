import fetch from 'isomorphic-fetch';
import {API} from '../config'
import {handleResponse} from './auth';

export const createCategory = (category, token) => {
    return fetch(`${API}/category`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)
    })
    .then(response => {
        handleResponse(response);
        return response.json();
    })
    .catch(err => console.log(err));
};

// get all categories
export const getCategories = () => {
    return fetch(`${API}/categories`, {
        method: 'GET',
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

// get the single category
export const getSingleCategory = (slug) => {
    return fetch(`${API}/category/${slug}`, {
        method: 'GET',
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

// remove category
export const removeCategory = (slug, token) => {
    return fetch(`${API}/category/${slug}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    })
    .then(response => {
        handleResponse(response);
        return response.json();
    })
    .catch(err => console.log(err));
};
