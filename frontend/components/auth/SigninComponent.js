import Router from "next/router";
import React from "react";
import {useState} from "react";
import {signin} from "../../actions/auth";

const SigninComponent = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',

        error: false,
        loading: false,
        message: '',
        showForm: true
    });

    const {email, password, error, loading, message, showForm} = values;

    const showLoading = () => <div className="alert alert-info">Loading...</div>;

    const showError = () => <div className="alert alert-danger">{error}</div>;

    const showMessage = () => <div className="alert alert-info">{message}</div>;

    const handleSubmit = (e) => {
        e.preventDefault();

        // test user object
        // console.table({name, email, password, error, loading, message, showForm});

        // sets loading to true untill we get response
        setValues({...values, loading: true, error: false});

        // create user object from this data
        const user = {email, password};

        // pass user object to signup
        signin(user).then(data => {
            // error: 'string of error'
            // recommendation to always send error in this format
            if (data.error) {
                setValues({...values, error: data.error, loading:false });
            }
            else {
                /* SUCCESFULL sign in! */

                // save user token to cookie

                // save user info to local storage

                // authenticate user

                // redirect to home page, for now.
                Router.push(`/`);
            }
        });
    };

    /** dynamic handleChange method */
    const handleChange = name => e => {
        // leave rest of values as it is
        setValues({...values, error: false, [name]: e.target.value});
    };

    const signinForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        value={email}
                        onChange={handleChange('email')}
                        type="email"
                        className="form-control"
                        placeholder="Type your email"
                    />
                </div>

                <div className="form-group">
                    <input
                        value={password}
                        onChange={handleChange('password')}
                        type="password"
                        className="form-control"
                        placeholder="Type your password"
                    />
                </div>

                <div>
                    <button className="btn btn-primary">Signin</button>
                </div>
            </form>
        );
    };

    return (
        <React.Fragment>
            {error && showError()}
            {loading && showLoading()}
            {message && showMessage()}
            {showForm && signinForm()}
        </React.Fragment>
    );
};

export default SigninComponent;
