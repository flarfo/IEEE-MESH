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
import RequireAuth from './features/auth/RequireAuth';
import VerifyEmail from './features/users/VerifyEmail';
import { ROLES } from './config/roles';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />

        {/* DEV - REMOVE*/}
        <Route path='memberform' element={<NewMemberForm />} />

        <Route path='users'>
            <Route path=':id'>
              <Route path='verify'>
                <Route path=':token' element={<VerifyEmail />} />
              </Route>
            </Route>
        </Route>

        <Route element={<PersistLogin />}>
        
          {/* Protected routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Member, ROLES.Manager, ROLES.Admin]}/>}>
            <Route element={<Prefetch />}>
              <Route path='database'>
                  <Route path='members'>
                  <Route index element={<MembersList />} />
                  <Route path=':id' element={<EditMember />} />
                  <Route path='new' element={<NewMemberForm />} />
                </Route>
              </Route>
              {/* Dash */}
              <Route path='dash' element={<DashLayout />}>
                <Route index element={<Welcome />} />
                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]}/>}>
                  <Route path='users'>
                    <Route index element={<UsersList />} />
                    <Route path=':id' element={<EditUser />} />
                    <Route path='new' element={<NewUserForm />} />
                  </Route>
                </Route>
              </Route>
              {/* End dash */}
            </Route>
          </Route>
        </Route>
        {/* End protected routes */}

      </Route>
    </Routes> 
  );
}

export default App;