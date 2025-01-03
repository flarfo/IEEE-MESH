import { Route, Routes } from 'react-router-dom';
import Register from './features/auth/Register';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout';
import Welcome from './pages/Welcome';
import UsersList from './features/users/UsersList';
import MembersList from './features/members/MembersList';
import EditUser from './features/users/EditUser';
import NewUserForm from './features/users/NewUserForm';
import EditMember from './features/members/EditMember';
import NewMemberForm from './features/members/NewMemberForm';
import Prefetch from './features/auth/Prefetch';
import PersistLogin from './features/auth/PersistLogin';
import RequestsList from './features/users/RequestsList';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            {/* Protected routes */}
            <Route path='database'>
                <Route path='members'>
                <Route index element={<MembersList />} />
                <Route path=':id' element={<EditMember />} />
                <Route path='new' element={<NewMemberForm />} />
              </Route>
            </Route>
            <Route path='dash' element={<DashLayout />}>
              <Route index element={<Welcome />} />
              <Route path='users'>
                <Route index element={<UsersList />} />
                <Route path=':id' element={<EditUser />} />
                <Route path='new' element={<NewUserForm />} />
                <Route path='requests' element={<RequestsList />} />
              </Route>
            </Route>
            {/* End dash */}
          </Route>
        </Route>
      </Route>
    </Routes> 
  );
}

export default App;