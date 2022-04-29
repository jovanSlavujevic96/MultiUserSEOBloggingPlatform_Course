import Link from 'next/link';

import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import BlogUpdate from '../../../components/crud/BlogUpdate';
import Category from '../../../components/crud/Category';
import Tag from '../../../components/crud/Tag';


const Blog = () => {
    // <Link> is repalcement for <a> HTML tag
    // it avoids loading of other page
    // it just replaces components
    // but it keeps <a> within
    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="pt-5 pb-5">
                        <h2>Update blog</h2>
                    </div>
                    <BlogUpdate/>
                </div>
            </Admin>
        </Layout>
    );
};

export default Blog;
