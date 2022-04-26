import React, {useState} from 'react';
import Link from 'next/link';
import Router from 'next/router'
import NProgress from 'nprogress';
import {APP_NAME} from '../config';
import {signout, isAuth} from '../actions/auth';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';

import '.././node_modules/nprogress/nprogress.css'; // import CSS file (supported on newer next.js by default)

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    }

    // found this example on: https://reactstrap.github.io/?path=/docs/components-navbar--navbar
    // <Navlink> is same as <a>
    return (
        <div>
            <Navbar color="light" light expand="md">
                <Link href="/">
                    <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
                </Link>
                <NavbarToggler onClick={toggle}/>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <React.Fragment>
                            <NavItem>
                                <Link href="/blogs">
                                    <NavLink>Blogs</NavLink>
                                </Link>
                            </NavItem>
                        </React.Fragment>

                        {!isAuth() && (
                            <React.Fragment>
                                <NavItem>
                                    <Link href="/signin">
                                        <NavLink>Sign in</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link href="/signup">
                                        <NavLink>Sign up</NavLink>
                                    </Link>
                                </NavItem>
                            </React.Fragment>
                        )}

                        {isAuth() && isAuth().role === 0 && (
                            <NavItem>
                                <Link href="/user">
                                    <NavLink>{`${isAuth().name}'s Dashboard`}</NavLink>
                                </Link>
                            </NavItem>
                        )}

                        {isAuth() && isAuth().role === 1 && (
                            <NavItem>
                                <Link href="/admin">
                                    <NavLink>{`${isAuth().name}'s Dashboard`}</NavLink>
                                </Link>
                            </NavItem>
                        )}

                        {isAuth() && (
                            <NavItem>
                                <NavLink
                                    style={{cursor: 'pointer'}}
                                    onClick={() => signout(
                                        () => Router.replace(`/signin`)
                                    )}>
                                    Sign out
                                </NavLink>
                            </NavItem>
                        )}
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default Header;
