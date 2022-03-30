import Layout from '../components/Layout';
import SigninComponent from '../components/auth/SigninComponent';
import { isAuth } from '../actions/auth';
import Router from 'next/router';

const Signin = () => {
    if (isAuth()) {
        Router.replace(`/`);
        return null;
    }
    return (
        <Layout>
            <h2 className="text-center pt-4 pb-4">Sign in</h2>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <SigninComponent />
                </div>
            </div>
        </Layout>
    )
}

export default Signin;
