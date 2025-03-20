import { Routes, Route } from "react-router-dom";
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';
import { WelcomePage } from './components/WelcomePage/WelcomePage';
import { UserProfile } from "./components/UserProfile/UserProfile";
import { AnimalProfile } from "./components/AnimalProfile/AnimalProfile";
import { AuthProvider } from './context/AuthContext';
import { ApiResponse } from "./types";

interface Api {
  registerUser: (email: string, password: string) => Promise<ApiResponse>;
  loginUser: (email: string, password: string) => Promise<ApiResponse>;
  getUser: (userId: string, accessToken: string) => Promise<ApiResponse>;
}

function App({ api }: { api: Api }) {
  return (
    <AuthProvider api={api}>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/user-profile' element={<UserProfile />} />
        <Route path='/animal-profile' element={<AnimalProfile animalId="test_id" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
