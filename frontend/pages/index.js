import Layout from '../components/Layout';
import Link from 'next/link';

const Index = () => {
    // <Link> is repalcement for <a> HTML tag
    // it avoids loading of other page
    // it just replaces components
    // but it keeps <a> within
    return (
        <Layout>
            <h2 className="text-center pt-4 pb-4">Index page</h2>
            <Link href="/signup">
                <a>Sign up</a>
            </Link>
        </Layout>
    );
}

export default Index;
