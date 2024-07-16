import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPlus } from "@fortawesome/free-solid-svg-icons"; 

import style from "./Navbar.module.scss";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <nav className={style.navbar}>
            <h1 className={style.navbarTitle}>VisionVault</h1>
            <ul className={style.navbarList}>
                <li className={style.navbarItem}>
                    <Link to="/">
                        <FontAwesomeIcon className={style.icon} icon={faHome} />
                        <span className={style.text}>Home</span>
                    </Link>
                </li>
                <li className={style.navbarItem}>
                    <Link to="/new">
                        <FontAwesomeIcon className={style.icon} icon={faPlus} />
                        <span className={style.text}>Add Product</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;