import { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import './App.css'
import Alert from './components/Alert';
import Navbar from './components/Navbar';
import Auth from './components/auth';
import CreateRide from './components/CreateRide';
import Home from './components/Home';
import Chat from './components/Chat';
import ChatSection from './components/Chatsection';
import Profile from './components/Profile';
import RidePage from './components/RidePage';
import About from './components/About';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import Rating from './components/Rating';
function App() {
  const [alert , setAlert] = useState(null);

  const showAlert = (message , type) => {
     setAlert( {
       msg : message,
       types : type
     })
   //mai chata hu ki 2 sec baad ye alert null ho jaye
   setTimeout(()=> {setAlert(null) } , 2000);
  }
  return (
    <div className='flex flex-col  min-h-screen'>
      
    <Router>
      <Navbar showAlert={showAlert}/>
      <div className="flex-grow">
      
      
     <Alert  alert={alert}  />     
     
  
      <Routes>
          {/* <Route   path="/about" element={<About/>}></Route> */}
          <Route  path="/"   element={<Home showAlert={showAlert}/>}></Route>
          <Route  path="/contact"   element={<ContactUs showAlert={showAlert}/>}></Route>
          <Route  path="/auth"   element={<Auth showAlert={showAlert}/>}></Route>

          <Route  path="/createRide"   element={<CreateRide showAlert={showAlert}/> }></Route>
          <Route  path="/profile"   element={<Profile showAlert={showAlert}/> }></Route>
          <Route  path="/ridePage/:id"   element={<RidePage showAlert={showAlert}/> }></Route>
          <Route  path="/chat/:name"   element={<Chat showAlert={showAlert}/> }></Route>
          <Route  path="/chatsection"   element={<ChatSection showAlert={showAlert}/> }></Route>
          <Route  path="/about"   element={<About showAlert={showAlert}/> }></Route>
          <Route  path="/rating/:username"   element={<Rating showAlert={showAlert}/> }></Route>
     </Routes>

     
     </div>
  
      
      
    </Router>
    <div className=' z-340 '>
    <Footer/>
  </div>
    
    </div>
  )
}

export default App
