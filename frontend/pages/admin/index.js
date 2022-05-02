import Layout from '../../components/Layout';
import Admin from '../../components/auth/Admin';
import Link from 'next/link';

const AdminIndex = () => {
    // <Link> is repalcement for <a> HTML tag
    // it avoids loading of other page
    // it just replaces components
    // but it keeps <a> within
    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Admin Dashboard</h2>
                        </div>
                        <div className="col-md-4">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <a href="/admin/crud/category-tag">
                                        Create Category
                                    </a>
                                </li>
                                <li className="list-group-item">
                                    <a href="/admin/crud/category-tag">
                                        Create Tag
                                    </a>
                                </li>
                                <li className="list-group-item">
                                    <a href="/admin/crud/blog">
                                        Create Blog
                                    </a>
                                </li>
                                <li className="list-group-item">
                                    <a href="/admin/crud/blogs">
                                        Update/Delete Blogs
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            right
                        </div>
                    </div>
                </div>
            </Admin>
        </Layout>
    );
};

export default AdminIndex;
