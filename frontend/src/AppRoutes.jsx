import { Routes, Route } from 'react-router-dom';

import Home from "./pages/headerPages/home.jsx";
import Search from "./pages/headerPages/search.jsx";
import Idea from "./pages/headerPages/idea.jsx";
import Upload from "./pages/headerPages/upload.jsx";


import Contact from "./pages/footerPages/contact.jsx";
import FAQ from "./pages/footerPages/FAQ.jsx";

//Paginas relacionadas al login
import Login from "./pages/headerPages/loginPages/login.jsx";
import Register from "./pages/headerPages/loginPages/register.jsx";
import ForgotPassword from './pages/headerPages/loginPages/forgot-password.jsx';
import ResetPassword from './pages/headerPages/loginPages/reset-password.jsx';
///Paginas relacionadas al admin
import Options from './pages/headerPages/adminOptions/options.jsx';
import AdminUserList from './pages/headerPages/adminOptions/AdminUserList.jsx';
//Paginas relacionadas al perfil
import Profile from './pages/headerPages/profilePages/profile.jsx';
import ProfileInfo from './pages/headerPages/profilePages/profileInfo.jsx';
import ProfileEdit from './pages/headerPages/profilePages/profileEdit.jsx';
import ProfileDelete from './pages/headerPages/profilePages/ProfileDelete.jsx';

export function AppRoutes(){
    return(
        <Routes>
           <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/idea" element={<Idea />} />
          <Route path="/upload" element={<Upload />}/>
          {/*Rutas relacionadas al perfil*/}
          <Route path="profile" element={<Profile />}>
            <Route index element={<ProfileInfo />} />
            <Route path="info" element={<ProfileInfo />} />
            <Route path="edit" element={<ProfileEdit/>}/>
            <Route path="delete" element={<ProfileDelete/>}/>
          </Route>
          {/*Rutas relacionadas al admin*/}
          <Route path="options" element={<Options />}>
            <Route index element={<AdminUserList />} />
            <Route path="AdminUserList" element={<AdminUserList />} />
        
          </Route>
          {/*Rutas relacionadas a login*/}
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>
          <Route path="/reset-password/:token" element={<ResetPassword />}/>
          

          <Route path="/contact" element={<Contact />}/>
          <Route path="/FAQ" element={<FAQ />}/>
        </Routes>
    );
}

