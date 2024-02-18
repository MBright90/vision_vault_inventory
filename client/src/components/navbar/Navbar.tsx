import React from "react";

import style from "./Navbar.module.scss";

const Navbar: React.FC = () => {
    return (
        <nav className={style.navbar}>
            <h1 className={style.navbarTitle}>VisionVault</h1>
            <div>
                <input className={style.navbarSearch}/>
            </div>
            <ul className={style.navbarList}>
                <li className={style.navbarItem}><a href="/">Home</a></li>
                <li className={style.navbarItem}><a href="/products/add">Add Product</a></li>
                <li className={style.navbarItem}><a href="/products/categories">Categories</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;