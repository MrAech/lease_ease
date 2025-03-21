
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import PropertyManagement from './components/PropertyManagement';
const App = () => {
 
  return (

     <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="property-management" element={<PropertyManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
     </>
  );
};
export default App;


