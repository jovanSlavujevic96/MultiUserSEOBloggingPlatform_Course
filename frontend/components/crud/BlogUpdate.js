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
        formData: typeof window !== 'undefined' && new FormData(),
    });

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [checkedCategory, setCheckedCategory] = useState([]); // categories
    const [checkedTag, setCheckedTag] = useState([]); // tags

    useEffect(() =>  {
        initBlog();
        initCategories();
        initTags();
    }, [router]);

    const {title, error, success, formData} = values;

    const initBlog = () => {
        if (router.query.slug) {
            singleBlog(router.query.slug).then(data => {
                if (data.error) {
                    console.log(data.error); // on terminal / not user console
                } else {
                    setValues({...values, title: data.title});
                    setBody(data.body);
                    setCategoriesArray(data.categories);
                    setTagsArray(data.tags);
                }
            });
        }
    };

    const setCategoriesArray = blogCategories => {
        let ca = []; // tmp categories array
        blogCategories.map((c, i) => {
            ca.push(c._id);
        });
        setCheckedCategory(ca);
    };

    const setTagsArray = blogTags => {
        let ta = []; // tmp tags array
        blogTags.map((t, i) => {
            ta.push(t._id);
        });
        setCheckedTag(ta);
    };

    const findOutCategory = c => {
        const result = checkedCategory.indexOf(c);
        // if category exists within checkedTag -> 1
        // if not -> -1
        return (result !== -1);
    };

    const findOutTag = t => {
        const result = checkedTag.indexOf(t);
        // if tag exists within checkedTag -> 1
        // if not -> -1
        return (result !== -1);
    };

    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({...values, error: data.error});
            }
            else {
                setCategories(data);
            }
        });
    };

    const initTags = () => {
        getTags().then(data => {
            if (data.error) {
                setValues({...values, error: data.error});
            }
            else {
                setTags(data);
            }
        });
    };

    const handleChange = name => e => {
        const value = (name === 'photo') ? e.target.files[0] : e.target.value
        formData.set(name, value);
        setValues({...values, [name]: value, formData: formData, error: ''})
    };

    const handleBody = e => {
        setBody(e);
        formData.set('body', e);
    };

    const handleToggleCategory = (cat_id) => () => {
        setValues({...values, error: ''});

        // return the first element or -1
        const clickedCategory = checkedCategory.indexOf(cat_id)
        const all = [...checkedCategory];

        if (clickedCategory === -1) {
            // if doesn't exist -> it means that is checked and needs to be pushed to array
            all.push(cat_id); // push it within
        }
        else {
            // if exists -> it means that is un-checked and needs to be erased from array
            all.splice(clickedCategory, 1); // pull it out
        }

        // console.log(all); // debug information
        setCheckedCategory(all);
        formData.set('categories', all);
    }

    const handleToggleTag = (tag_id) => () => {
        setValues({...values, error: ''});

        // return the first element or -1
        const clickedTag = checkedTag.indexOf(tag_id)
        const all = [...checkedTag];

        if (clickedTag === -1) {
            // if doesn't exist -> it means that is checked and needs to be pushed to array
            all.push(tag_id); // push it within
        }
        else {
            // if exists -> it means that is un-checked and needs to be erased from array
            all.splice(clickedTag, 1); // pull it out
        }

        // console.log(all); // debug information
        setCheckedTag(all);
        formData.set('tags', all);
    }

    const editBlog = () => {
        console.log('update blog');
    };

    const showCategories = () => {
        /* c - category ; i - index */
        return (
            categories && categories.map((c, i) => {
                return (
                    <li key={i} className="list-unstyled">
                        <input
                            onChange={handleToggleCategory(c._id)}
                            checked={findOutCategory(c._id)}
                            type="checkbox"
                            className="mr-2"
                        />
                        <label className="form-check-label">{c.name}</label>
                    </li>
                );
            })
        );
    };

    const showTags = () => {
        /* t - tag ; i - index */
        return (
            tags && tags.map((t, i) => {
                return (
                    <li key={i} className="list-unstyled">
                        <input
                            onChange={handleToggleTag(t._id)}
                            checked={findOutTag(t._id)}
                            type="checkbox"
                            className="mr-2"
                        />
                        <label className="form-check-label">{t.name}</label>
                    </li>
                );
            })
        );
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
                        <hr/>

                        <small className="text-muted">Max size: 1 MB</small>
                        <p>
                            <label className="btn btn-outline-info">
                                Upload featured image
                                <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                            </label>
                        </p>
                    </div>
                </div>
                <div>
                    <h5>Categories</h5>
                    <hr/>
                    <ul style={{maxHeight: '200px', overflowY: 'scroll'}}>
                        {showCategories()}
                    </ul>
                </div>
                <div>
                    <h5>Tags</h5>
                    <hr/>
                    <ul style={{maxHeight: '200px', overflowY: 'scroll'}}>
                        {showTags()}
                    </ul>
                </div>
            </div>
        </div>
    </div>);
};

export default withRouter(BlogUpdate);
