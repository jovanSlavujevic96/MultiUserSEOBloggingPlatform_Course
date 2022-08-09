import React, { useState, useEffect } from 'react';
import Router from 'next/router';

import { loginWithGoogle, authenticate, isAuth } from '../../actions/auth';
import { GOOGLE_CLIENT_ID } from '../../config';

// https://www.npmjs.com/package/@react-oauth/google
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const LoginGoogle = () => {
    const responseGoogle = credentialResponse => {
        // console.log(credentialResponse);
        const tokenId = credentialResponse.credential;
        const user = { tokenId };

        loginWithGoogle(user).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                authenticate(data, () => {
                    if (isAuth() && isAuth().role === 1) {
                        Router.push(`/admin`);
                    } else {
                        Router.push(`/user`);
                    }
                });
            }
        });
    }

    return (
        <div className='pb-3'>
            <GoogleOAuthProvider clientId={`${GOOGLE_CLIENT_ID}`}>
                <GoogleLogin
                    onSuccess={responseGoogle}
                    onError={() => console.log('Login Failed')}
                    useOneTap
                />
            </GoogleOAuthProvider>
        </div>
    );
}

export default LoginGoogle;
