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
import { RegisterAnimal } from "./components/RegisterAnimal/RegisterAnimal";
import { HomePage } from "./components/HomePage/HomePage";

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
  createAnimal: (
    animalData: {
      name: string,
      sex: "MALE" | "FEMALE",
      breed: string,
      species: string,
      bio?: string,
      birthDate: string,
    }
  ) => Promise<ApiResponse>;
  getAnimal: (animalId: string) => Promise<ApiResponse>;
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
          <Route path='/home' element={<HomePage getUser={api.getUser} />} />
          <Route path='/user-profile' element={<UserProfile getUser={api.getUser} updateUser={api.updateUser} />} />
          <Route path='/animals' element={<AnimalList getUserAnimals={api.getUserAnimals} />} />
          <Route path='/animals/new' element={<RegisterAnimal createAnimal={api.createAnimal} />} />
          <Route path='/animals/:id' element={<AnimalProfile getAnimal={api.getAnimal} />} />
          <Route path='/setup-profile' element={<UserSetup updateUser={api.updateUser} />} />
        </Routes>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
