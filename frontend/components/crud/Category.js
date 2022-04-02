import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import Router from 'next/router';

import {isAuth, getCookie} from '../../actions/auth';
import {createCategory, getCategories, removeCategory} from '../../actions/category';
import { remove } from 'nprogress';

const Category = () => {
    const [values, setValues] = useState({
        name: '',

        error: false,
        success: false,
        categories: [],
        removed: false,
        reload: false
    });

    const {name, error, success, categories, removed, reload} = values;
    const token = getCookie('token');

    useEffect(() => {
        loadCategories();
    }, [reload]);

    const loadCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                console.log(data.error);
            }
            else {
                setValues({...values, categories: data});
            }
        });
    };

    const showCategories = () => {
        return categories.map((c, i) => {
            return (
                <button
                    title="Double click to delete"
                    onDoubleClick={() => deleteConfirm(c.slug)}
                    key={i}
                    className="btn btn-outline-primary mr-1 ml-1 mt-3"
                >
                    {c.name}
                </button>
            );
        });
    };

    const deleteConfirm = slug => {
        let answer = window.confirm('Are you sure you want to delete this category?');
        if (answer) {
            // test
            // console.log('delete', slug);

            removeCategory(slug, token).then(data => {
                if (data.error) {
                    console.log(data.error);
                }
                else {
                    setValues({...values, error: false, success: false, name: '', removed: !removed, reload: !reload});
                }
            });
        }
    };

    const clickSubmit = (e) => {
        e.preventDefault();

        // test
        // console.log('create category');

        createCategory({name}, token).then(data => {
            if (data.error) {
                setValues({...values, error: data.error, success: false});
            }
            else {
                setValues({...values, error: false, success: true, name: '', removed: !removed, reload: !reload});
            }
        });
    }

    const handleChange = e => {
        setValues({...values, name: e.target.value, error: false, success: false, removed: ''})
    }

    const showCreated = () => {
        if (success) {
            return <p className="text-success">Category is created</p>;
        }
    }

    const showAlreadyCreated = () => {
        if (error) {
            return <p className="text-danger">Category already exists</p>;
        }
    }

    const showRemoved = () => {
        if (removed) {
            return <p className="text-danger">Category is removed</p>;
        }
    }

    const mouseMoveHandler = e => {
        setValues({...values, error: false, success: false, removed: ''})
    }

    const newCategoryForm = () => (
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" className="form-control" onChange={handleChange} value={name} required/>
            </div>
            <div>
                <button type="submit" className="btn btn-primary">Create</button>
            </div>
        </form>
    );

    return (
        <React.Fragment>
            {showCreated()}
            {showAlreadyCreated()}
            {showRemoved()}
            <div onMouseMove={() => mouseMoveHandler()}>
                {newCategoryForm()}
                {showCategories()}
            </div>
        </React.Fragment>
    );
};

export default Category;
