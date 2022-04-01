import Layout from '../../components/Layout';
import Admin from '../../components/auth/Admin';

const AdminIndex = () => {
    // <Link> is repalcement for <a> HTML tag
    // it avoids loading of other page
    // it just replaces components
    // but it keeps <a> within
    return (
        <Layout>
            <Admin>
                <h2 className="text-center pt-4 pb-4">Admin Dashboard</h2>
            </Admin>
        </Layout>
    );
};

export default AdminIndex;