import React from "react";

import style from './Footer.module.scss';

const Footer: React.FC = () => {
    return (
        <footer className={style.footer}>
            <a href="https://github.com/MBright90/vision_vault_inventory">MBright90</a>
        </footer>
    );
};

export default Footer;