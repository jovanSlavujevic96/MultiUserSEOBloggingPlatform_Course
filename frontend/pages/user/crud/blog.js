import Layout from '../../../components/Layout';
import Private from '../../../components/auth/Private';
import BlogCreate from '../../../components/crud/BlogCreate';
import Link from 'next/link';


const CreateBlog = () => {
    // <Link> is repalcement for <a> HTML tag
    // it avoids loading of other page
    // it just replaces components
    // but it keeps <a> within
    return (
        <Layout>
            <Private>
                <div className="container-fluid">
                    <div className="pt-5 pb-5">
                        <h2>Create a new blog</h2>
                    </div>
                    <BlogCreate/>
                </div>
            </Private>
        </Layout>
    );
};

export default CreateBlog;
