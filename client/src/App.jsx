import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";


export default function App() {

  return (
 <BrowserRouter>
 <Header/>
 <Routes>
  <Route path="/" element={<Home/>} />
  <Route path="/projects" element={<Projects/>} />
  <Route path="/about" element={<About/>} />
  <Route path="/sign-in" element={<SignIn/>} />
  <Route path="/sign-up" element={<SignUp/>} />
  <Route path="/dashboard" element={<Dashboard/>} />



 </Routes>
 </BrowserRouter>
  )
}
