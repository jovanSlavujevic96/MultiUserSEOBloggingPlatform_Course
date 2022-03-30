import React from "react";
import {useState} from "react";
import {signup, singup} from "../../actions/auth";

const SignupComponent = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',

        error: false,
        loading: false,
        message: '',
        showForm: true
    });

    const {name, email, password, error, loading, message, showForm} = values;

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
        const user = {name, email, password};

        // pass user object to signup
        signup(user)
        .then(data => {
            // error: 'string of error'
            // recommendation to always send error in this format
            if (data.error) {
                setValues({...values, error: data.error, loading:false });
            }
            else {
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    error: '',
                    loading:false,
                    message: data.message,
                    showForm: false
                });
                // once the user create account we want to disable the form -> the subbmit button
            }
        });
    };

    /** dynamic handleChange method */
    const handleChange = name => e => {
        // leave rest of values as it is
        setValues({...values, error: false, [name]: e.target.value});
    };

    const signupForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        value={name}
                        onChange={handleChange('name')}
                        type="text"
                        className="form-control"
                        placeholder="Type your name"
                    />
                </div>

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
                    <button className="btn btn-primary">Signup</button>
                </div>
            </form>
        );
    };

    return (
        <React.Fragment>
            {error && showError()}
            {loading && showLoading()}
            {message && showMessage()}
            {showForm && signupForm()}
        </React.Fragment>
    );
};

export default SignupComponent;
