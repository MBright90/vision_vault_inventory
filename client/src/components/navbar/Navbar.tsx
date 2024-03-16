import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPlus } from "@fortawesome/free-solid-svg-icons"; 

import style from "./Navbar.module.scss";

const Navbar: React.FC = () => {
    return (
        <nav className={style.navbar}>
            <h1 className={style.navbarTitle}>VisionVault</h1>
            <div className={style.search}>
                <input className={style.searchInput}/>
                <button className={style.searchConfirm}>GO!</button>
            </div>
            <ul className={style.navbarList}>
                <li className={style.navbarItem}>
                    <a href="/">
                        <FontAwesomeIcon className={style.icon} icon={faHome} />
                        <span className={style.text}>Home</span>
                    </a>
                </li>
                <li className={style.navbarItem}>
                    <a href="/products/add">
                        <FontAwesomeIcon className={style.icon} icon={faPlus} />
                        <span className={style.text}>Add Product</span>
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;