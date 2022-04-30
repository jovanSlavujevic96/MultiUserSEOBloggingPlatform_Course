import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import React from 'react';
import { getSingleTag } from '../../actions/tag';
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';
import moment from 'moment';
import renderHTML from 'react-render-html';
import Card from '../../components/blog/Card';

// server side rendered page
const Tag = ({tag, blogs}) => {
    return (
        <React.Fragment>
            <Layout>
                <main>
                    <div className="container-fluid text-center">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className='display-4 font-weight-bold'>{tag.name}</h1>
                                {blogs.map((b, i) => (
                                    <div>
                                        <Card key={i} blog={b}/>
                                        <hr/>
                                    </div>
                                ))}
                            </div>
                        </header>
                    </div>
                </main>
            </Layout>
        </React.Fragment>
    )
};

Tag.getInitialProps = ({query}) => {
    return getSingleTag(query.slug).then(data => {
        if (data.error) {
            console.log(data.error);
        } else {
            return { tag: data.tag, blogs: data.blogs };
        }
    });
};

export default Tag;
