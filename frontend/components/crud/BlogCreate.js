import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { createBlog } from '../../actions/blog';

/* import react-quill dynamically but with SSR on false */
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false})

// import CSS
import '../../node_modules/react-quill/dist/quill.snow.css';

const CreateBlog = ({router}) => {
    const [body, setBody] = useState({}); // empty for now

    const [values, setValues] = useState({
        error: '',
        sizeError: '',
        success: '',
        formData: '',
        title: '',
        hidePublishButton: false
    });

    const { error, sizeError, success, formData, title, hidePublishButton } = values;

    const handleChange = name => e => {
        console.log(e.taget.value);
    };

    // this is for rich text editor
    const handleBody = e => {
        console.log(e.taget.value);
    };

    const publishBlog = (e) => {
        e.preventDefault();
        console.log('ready to publishBlog');
    };

    const createBlogForm = () => {
        return (
            <form onSubmit={publishBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input type="text" className="form-control" value={title} onChange={handleChange('title')} />
                </div>

                <div className="form-group">
                    <ReactQuill value={body} placeholder="Write something amazing" onChange={handleBody} />
                </div>

                <div>
                    <button className="btn btn-primary">Publish</button>
                </div>
            </form>
        );
    };

    return <div>{createBlogForm()}</div>;
};

export default withRouter(CreateBlog);
