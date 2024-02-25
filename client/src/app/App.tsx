import React from "react";
import '@style/style.scss';

import Footer from "@components/footer";
import Display from "@components/display";
import Navbar from "@components/navbar";

const App: React.FC = () => {
    return (
        <>
            <Navbar />
            <Display />
            <Footer />
        </>
    );
};

export default App;