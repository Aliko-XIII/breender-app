import { Routes, Route } from "react-router-dom";
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';
import { WelcomePage } from './components/WelcomePage/WelcomePage';
import { UserProfile } from "./components/UserProfile/UserProfile";
import { AnimalProfile } from "./components/AnimalProfile/AnimalProfile";
import { AuthProvider } from './context/AuthContext';
import { TopPanel } from "./components/TopPanel/TopPanel";
import { UserProvider } from "./context/UserContext";
import { UserSetup } from "./components/UserSetup/UserSetup";
import { AnimalList } from "./components/AnimalList/AnimalList";
import { RegisterAnimal } from "./components/RegisterAnimal/RegisterAnimal";
import { HomePage } from "./components/HomePage/HomePage";
import { CreateRecordForm } from "./components/CreateRecordForm/CreateRecordForm";
import { ScrollToTopButton } from "./components/ScrollToTopButton/ScrollToTopButton";
import { CreateReminderForm } from "./components/CreateReminderForm/CreateReminderForm";
import PhotoUploadForm from "./components/PhotoUploadForm/PhotoUploadForm";
import DocumentUploadForm from "./components/DocumentUploadForm/DocumentUploadForm";
import { RecordList } from "./components/RecordList/RecordList";
import { AnimalMap } from "./components/AnimalMap/AnimalMap";
import { RecordView } from "./components/RecordView/RecordView";
import * as api from "./api";
import { ReminderList } from "./components/ReminderList/ReminderList";
import { ReminderView } from "./components/ReminderView/ReminderView";

type Api = typeof api;

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
          <Route path='/user-profile/:id' element={<UserProfile getUser={api.getUser} updateUser={api.updateUser} />} />
          <Route path='/user-profile' element={<UserProfile getUser={api.getUser} updateUser={api.updateUser} />} />
          <Route path='/animals' element={<AnimalList getUserAnimals={api.getUserAnimals} />} />
          <Route path='/animals/new' element={
            <RegisterAnimal createAnimal={animalData => api.createAnimal({ ...animalData, bio: animalData.bio ?? "" })} />
          } />
          <Route path='/animals/:id' element={<AnimalProfile getAnimal={api.getAnimal} updateAnimal={api.updateAnimal} />} />
          <Route path='/animals/:id/create-record' element={
            <CreateRecordForm createRecord={api.createRecord} />} />
          <Route path='/animals/:id/create-reminder' element={<CreateReminderForm onSave={(data) => console.log("Reminder:", data)} />} />
          <Route path='/animals/:id/upload-photo' element={<PhotoUploadForm />} />
          <Route path='/animals/:id/upload-document' element={<DocumentUploadForm />} />
          <Route path='/animals/:id/records' element={<RecordList />} />
          <Route path='/animals/:id/reminders' element={<ReminderList />} />
          <Route path='/reminders/user/:userId' element={<ReminderList />} />
          <Route path='/records/:userId' element={<RecordList />} />
          <Route path='/records/:userId/create' element={<CreateRecordForm createRecord={api.createRecord} />} />
          <Route path='/records/view/:recordId' element={<RecordView />} />
          <Route path='/reminders/:reminderId' element={<ReminderView />} />
          <Route path='/setup-profile' element={<UserSetup updateUser={api.updateUser} />} />
          <Route path='/map' element={<AnimalMap />} />
        </Routes>
        <ScrollToTopButton />
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
