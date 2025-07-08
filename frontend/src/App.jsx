import {BrowserRouter} from "react-router-dom";
import Header from "./components/header.jsx";
import Footer from "./components/footer.jsx";
import { AppRoutes } from './AppRoutes.jsx';
import { AuthProvider } from "./components/AuthContext.jsx";
import './App.css';


function App() {


  return (
    <BrowserRouter>
    <AuthProvider>
      <Header />
      <AppRoutes />
      {/** <Footer />*/}
      

    </AuthProvider>

    </BrowserRouter>
    
  );
}

export default App;
