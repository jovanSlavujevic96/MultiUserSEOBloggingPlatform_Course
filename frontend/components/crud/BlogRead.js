import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { listAllBlogs, removeBlog, updateBlog } from '../../actions/blog';
import React from 'react';
import moment from 'moment';

const BlogRead = ({username}) => {
    const [blogs, setBlogs] = useState([]);
    const [message, setMessage] = useState('');
    const token = getCookie('token');

    const loadAllBlogs = () => {
        listAllBlogs(username).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setBlogs(data);
            }
        });
    };

    const deleteBlog = (slug) => {
        removeBlog(slug, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setMessage(data.message);
                loadAllBlogs();
            }
        });
    };

    const deleteConfirm = (slug) => {
        let answer = window.confirm('Are you sure you want to delete your blog?');
        if (answer) {
            deleteBlog(slug);
        }
    };

    const showUpdateButton = (blog) => {
        if (isAuth() && isAuth().role === 0) {
            return (
                <Link href={`/user/crud/${blog.slug}`}>
                    <a className='ml-2 btn btn-sm btn-warning'>Update</a>
                </Link>
            );
        }
        else if (isAuth() && isAuth().role == 1) {
            return (
                <Link href={`/admin/crud/${blog.slug}`}>
                    <a className='ml-2 btn btn-sm btn-warning'>Update</a>
                </Link>
            );
        }
    };

    const showAllBlogs = () => {
        return blogs.map((blog, i) => {
            return (
                <div key={i} className='pb-5'>
                    <h3>{blog.title}</h3>
                    <p className='mark'>
                        Written by {' '}
                        <a href={`/profile/${blog.postedBy.username}`}>
                            {blog.postedBy.username}
                        </a> {' '}
                        | Published on {moment(blog.updatedAt).fromNow()}
                    </p>
                    <button className='btn btn-sm btn-danger' onClick={() => deleteConfirm(blog.slug)}>
                        Delete
                    </button>
                    {showUpdateButton(blog)}
                </div>
            );
        });
    };

    useEffect(() => {
        loadAllBlogs();
    }, []);

    return (
        <React.Fragment>
            <div className="row">
                <div className='col-md-12'>
                    {message &&
                    <div className='pb-5'>
                        <div className="aler alert-warning">{message}</div>
                    </div>}
                    {showAllBlogs()}
                </div>
            </div>
        </React.Fragment>
    );
};

export default BlogRead;
