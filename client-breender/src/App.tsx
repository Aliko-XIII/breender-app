import { Routes, Route, useParams, useSearchParams } from "react-router-dom";
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
import { AnimalPreview } from "./components/AnimalMap/AnimalPreview";
import { PartnershipsPage } from "./components/PartnershipsPage";
import { ChatWindow } from "./components/ChatWindow/ChatWindow";
import PhotoList from "./components/PhotoList";

type Api = typeof api;

const AnimalPreviewWrapper = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const myAnimalId = searchParams.get("myAnimalId") || "";
  return id ? <AnimalPreview animalId={id} myAnimalId={myAnimalId} /> : null;
};

const ChatWindowRoute = () => {
  const { otherUserId } = useParams();
  if (!otherUserId) return null;
  return <ChatWindow otherUserId={otherUserId} />;
};

// Wrapper for animal photo list route
const AnimalPhotoListRoute = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <div>Animal ID is missing.</div>;
  return <PhotoList animalId={id} />;
};

// Wrapper for user photo list route
const UserPhotoListRoute = () => {
  const { userId } = useParams<{ userId: string }>();
  if (!userId) return <div>User ID is missing.</div>;
  return <PhotoList userId={userId} />;
};

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
          <Route path='/animals/:id/upload-photo' element={<PhotoUploadForm />} />
          <Route path='/animals/:id/upload-document' element={<DocumentUploadForm />} />
          <Route path='/users/:userId/records' element={<RecordList />} />
          <Route path='/users/:userId/records/create' element={<CreateRecordForm createRecord={api.createRecord} />} />
          <Route path='/users/:userId/reminders' element={<ReminderList />} />
          <Route path='/users/:userId/reminders/create' element={<CreateReminderForm onSave={(data) => console.log("Reminder:", data)} />} />
          <Route path='/animals/:id/records' element={<RecordList />} />
          <Route path='/animals/:id/reminders' element={<ReminderList />} />
          <Route path='/animals/:id/records/create' element={<CreateRecordForm createRecord={api.createRecord} />} />
          <Route path='/animals/:id/reminders/create' element={<CreateReminderForm onSave={(data) => console.log("Reminder:", data)} />} />
          <Route path='/records/:recordId' element={<RecordView />} />
          <Route path='/reminders/:reminderId' element={<ReminderView />} />
          <Route path='/setup-profile' element={<UserSetup updateUser={api.updateUser} />} />
          <Route path='/map' element={<AnimalMap />} />
          <Route path='/animals/:id/preview' element={<AnimalPreviewWrapper />} />
          <Route path='/animals/:id/photos' element={<AnimalPhotoListRoute />} />
          <Route path='/users/:userId/photos' element={<UserPhotoListRoute />} />
          <Route path='/partnerships' element={<PartnershipsPage />} />
          <Route path='/chat/:otherUserId' element={<ChatWindowRoute />} />
        </Routes>
        <ScrollToTopButton />
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
