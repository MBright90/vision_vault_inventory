import React from "react";
import '@style/style.scss';

import Footer from "@components/footer";
import RouteSwitch from '../routes';

const App: React.FC = () => {
    return (
        <>
            <RouteSwitch />
            <Footer />
        </>
    );
};

export default App;