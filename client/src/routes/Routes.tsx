import Display from "@components/display";
import EditProductForm from "@components/editProductForm/EditProductForm";
import NavBar from "@components/navbar";
import NewProductForm from "@components/newProductForm";
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";



const RouteSwitch: React.FC = () => {
    return (
        <HashRouter basename="/">
            <NavBar />
            <Routes>
                <Route path="/" element={<Display />} />
                <Route path="/new" element={<NewProductForm />} />
                <Route path="/edit/:id" element={<EditProductForm />}/>
            </Routes>
        </HashRouter>
    );
};

export default RouteSwitch;
