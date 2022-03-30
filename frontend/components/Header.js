import React, {useState} from 'react';
import Link from 'next/link';
import Router from 'next/router'
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
