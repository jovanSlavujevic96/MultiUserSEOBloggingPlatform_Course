import Layout from '../../components/Layout';

const UserIndex = () => {
    // <Link> is repalcement for <a> HTML tag
    // it avoids loading of other page
    // it just replaces components
    // but it keeps <a> within
    return (
        <Layout>
            <h2 className="text-center pt-4 pb-4">User Dashboard</h2>
        </Layout>
    );
};

export default UserIndex;