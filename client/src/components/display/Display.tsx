import React from "react";

import style from './Display.module.scss';

const Display: React.FC = () => {
    return (
        <main className={style.display}>
            <div className={style.displayControls}></div>
            <div className={style.displayScreen}></div>
        </main>
    );
};

export default Display;
