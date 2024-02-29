import React from "react";

import style from './Display.module.scss';

const Display: React.FC = () => {
    const checkConnection = async (): Promise<void> => {
        const result = await fetch('http://localhost:3000/').catch((err) => { console.log(err); });
        if (result === null) return;
        
        console.log(result);
    };

    return (
        <main className={style.display}>
            <div className={style.displayControls}></div>
            <div className={style.displayScreen}>
                <button onClick={() => { void checkConnection(); }}>Call api</button>
            </div>
        </main>
    );
};

export default Display;
