import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import style from './Footer.module.scss';

const Footer: React.FC = () => {
    return (
        <footer className={style.footer}>
            <a href="https://github.com/MBright90/vision_vault_inventory">MBright90 <FontAwesomeIcon icon={faGithub}/></a>
        </footer>
    );
};

export default Footer;