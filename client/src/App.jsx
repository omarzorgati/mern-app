import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import FooterComponent from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import CreatePost from "./pages/CreatePost";
import PrivateRouteAdmin from "./components/PrivateRouteAdmin";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";


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
  <Route element={<PrivateRoute/>}>
      <Route path="/dashboard" element={<Dashboard/>} />
  </Route>
  <Route element={<PrivateRouteAdmin/>}>
      <Route path="/create-post" element={<CreatePost/>} />
      <Route path="/update-post/:postId" element={<UpdatePost/>} /> 
  </Route>
  <Route path="/post/:postSlug" element={<PostPage/>} />

  </Routes>
 <FooterComponent/>
 </BrowserRouter>
  )
}
