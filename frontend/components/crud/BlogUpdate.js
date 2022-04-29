import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { singleBlog, updateBlog } from '../../actions/blog';
import { QuillModules, QuillFormats } from '../../helpers/quill';
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false})
import '../../node_modules/react-quill/dist/quill.snow.css';

const BlogUpdate = ({router}) => {
    const [body, setBody] = useState('');
    const [values, setValues] = useState({
        title: '',
        error: '',
        success: '',
        formData: '',
    });

    useEffect(() =>  {
        setValues({...values, formData: new FormData()});
        initBlog();
    }, [router]);

    const initBlog = () => {
        if (router.query.slug) {
            singleBlog(router.query.slug).then(data => {
                if (data.error) {
                    console.log(data.error); // on terminal / not user console
                } else {
                    setValues({...values, title: data.title});
                    setBody(data.body);
                }
            });
        }
    };

    const {title, error, success, formData} = values;

    const handleChange = name => e => {
        const value = (name === 'photo') ? e.target.files[0] : e.target.value
        formData.set(name, value);
        setValues({...values, [name]: value, formData: formData, error: ''})
    };

    const handleBody = e => {
        setBody(e);
        formData.set('body', e);
    };

    const editBlog = () => {
        console.log('update blog');
    };

    const updateBlogForm = () => {
        return (
            <form onSubmit={editBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={handleChange('title')}
                    />
                </div>

                <div className="form-group">
                    <ReactQuill
                        modules={QuillModules}
                        formats={QuillFormats}
                        value={body}
                        placeholder="Write something amazing"
                        onChange={handleBody}
                    />
                </div>

                <div>
                    <button className="btn btn-primary">Edit</button>
                </div>
            </form>
        );
    };

    return (<div className="container-fluid pb-5">
        <div className="row">
            <div className="col-md-8">
                {updateBlogForm()}
                <div className="pt-3">
                    <p>show success and error msg</p>
                </div>
            </div>

            <div className="col-md-4">
                <div>
                    <div className="form-group pb-2">
                        <h5>Featured image</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};

export default withRouter(BlogUpdate);
