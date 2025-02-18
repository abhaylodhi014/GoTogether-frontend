import { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Alert from './components/Alert';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load components
const Auth = lazy(() => import('./components/Auth'));
const CreateRide = lazy(() => import('./components/CreateRide'));
const Home = lazy(() => import('./components/Home'));
const Chat = lazy(() => import('./components/Chat'));
const ChatSection = lazy(() => import('./components/Chatsection'));
const Profile = lazy(() => import('./components/Profile'));
const RidePage = lazy(() => import('./components/RidePage'));
const About = lazy(() => import('./components/About'));
const ContactUs = lazy(() => import('./components/ContactUs'));
const Rating = lazy(() => import('./components/Rating'));

function App() {
  const [alert, setAlert] = useState(null);

  //show alert for 2.5 sec
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      types: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Navbar showAlert={showAlert} />
        <div className="flex-grow">
          <Alert alert={alert} />

          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home showAlert={showAlert} />} />
              <Route path="/contact" element={<ContactUs showAlert={showAlert} />} />
              <Route path="/auth" element={<Auth showAlert={showAlert} />} />
              <Route path="/createRide" element={<CreateRide showAlert={showAlert} />} />
              <Route path="/profile" element={<Profile showAlert={showAlert} />} />
              <Route path="/ridePage/:id" element={<RidePage showAlert={showAlert} />} />
              <Route path="/chat/:name" element={<Chat showAlert={showAlert} />} />
              <Route path="/chatsection" element={<ChatSection showAlert={showAlert} />} />
              <Route path="/about" element={<About showAlert={showAlert} />} />
              <Route path="/rating/:username" element={<Rating showAlert={showAlert} />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
      <div className="z-340">
        <Footer />
      </div>
    </div>
  );
}

export default App;
