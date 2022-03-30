import Layout from '../components/Layout';
import SignupComponent from '../components/auth/SignupComponent';
import { isAuth } from '../actions/auth';
import Router from 'next/router';

const Signup = () => {
    if (isAuth()) {
        Router.replace(`/`);
        return null;
    }
    return (
        <Layout>
            <h2 className="text-center pt-4 pb-4">Sign up</h2>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <SignupComponent />
                </div>
            </div>
        </Layout>
    )
}

export default Signup;
