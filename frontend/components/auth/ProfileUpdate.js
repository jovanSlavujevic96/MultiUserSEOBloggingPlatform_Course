import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { getProfile, updateProfile } from '../../actions/user';
import { initScriptLoader } from 'next/script';

const ProfileUpdate = () => {
    const [values, setValues] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        error: false,
        success: false,
        loading: false,
        photo: '',
        userData: typeof window !== 'undefined' && new FormData(),
    });

    const token = getCookie('token');
    const {username, name, email, password, error, success, loading, photo, userData} = values;

    const init = () => {
        getProfile(token).then(data => {
            if (data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({...values,
                    username: data.username,
                    name: data.name,
                    email: data.email,
                });
            }
        });
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <React.Fragment>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-4'>
                        image
                    </div>
                    <div className='col-md-8'>
                        update form
                        {JSON.stringify({username, email, name})}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ProfileUpdate;
