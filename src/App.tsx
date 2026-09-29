import "./App.css";
import { Route, Routes } from "react-router-dom";
import Calendar from "./Components/Calendar";
import Product from "./Components/product";


function App() {

  return (
    <Routes>
      <Route element={<Calendar/>} path="/calendar"/>
      <Route element={<Product/>} path="/product"/>
    </Routes>
  );
}

export default App;