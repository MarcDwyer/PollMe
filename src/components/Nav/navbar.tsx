import React from 'react'
import { Link } from 'react-router-dom'

import './navbar.scss'


const Navbar = () => {

    return (
        <nav>
            <Link to="/" className="brand-logo">
                <h4>Go Poll</h4>
            </Link>
        </nav>
    )
}

export default Navbar