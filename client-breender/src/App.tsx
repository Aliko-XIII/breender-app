import { Routes, Route, useParams } from "react-router-dom";
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';
import { WelcomePage } from './components/WelcomePage/WelcomePage';
import { UserProfile } from "./components/UserProfile/UserProfile";
import { AnimalProfile } from "./components/AnimalProfile/AnimalProfile";
import { AuthProvider } from './context/AuthContext';
import { ApiResponse } from "./types";
import { TopPanel } from "./components/TopPanel/TopPanel";
import { UserProvider } from "./context/UserContext";
import { UserSetup } from "./components/UserSetup/UserSetup";
import { AnimalList } from "./components/AnimalList/AnimalList";

interface Api {
  registerUser: (email: string, password: string) => Promise<ApiResponse>;
  loginUser: (email: string, password: string) => Promise<ApiResponse>;
  getUser: (userId: string, includeProfile: boolean) => Promise<ApiResponse>;
  updateUser: (
    userId: string,
    updateData: {
      email?: string,
      pass?: string,
      name?: string,
      bio?: string,
      pictureUrl?: string,
    }
  ) => Promise<ApiResponse>;
  getUserAnimals: (userId: string) => Promise<ApiResponse>;
}

function App({ api }: { api: Api }) {
  return (
    <AuthProvider api={api}>
      <UserProvider>
        <TopPanel />
        <Routes>
          <Route path='/' element={<WelcomePage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Register />} />
          <Route path='/user-profile' element={<UserProfile getUser={api.getUser} updateUser={api.updateUser} />} />
          <Route path='/animals' element={<AnimalList getUserAnimals={api.getUserAnimals} />} />
          <Route path='/animals/new' element={<RegisterAnimal />} />
          <Route path='/animals/:id' element={<AnimalProfile animalId={useParams().id as string} />} />
          <Route path='/setup-profile' element={<UserSetup updateUser={api.updateUser} />} />
        </Routes>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
