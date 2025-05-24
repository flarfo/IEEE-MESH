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
import Prefetch from './features/auth/Prefetch';
import PersistLogin from './features/auth/PersistLogin';
import RequireAuth from './features/auth/RequireAuth';
import VerifyEmail from './features/users/VerifyEmail';
import Profile from './features/members/Profile';
import { ROLES } from './config/roles';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<PersistLogin strict={false} />}>
          <Route index element={<LandingPage />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="users">
          <Route path=":id">
            <Route path="verify">
              <Route path=":token" element={<VerifyEmail />} />
            </Route>
          </Route>
        </Route>
        <Route element={<PersistLogin />}>
          {/* Protected routes */}
          <Route element={<RequireAuth allowedRoles={Object.values(ROLES)} />}>
            <Route element={<Prefetch />}>
              <Route path="profile">
                <Route path=":username" element={<Profile />}>
                </Route>
              </Route>
              <Route element={<RequireAuth allowedRoles={[ROLES.Member, ROLES.Manager, ROLES.Admin]} />}>
                <Route path="database">
                  <Route path="members">
                  <Route index element={<MembersList />} />
                  </Route>
                </Route>
              </Route>
              {/* Dash */}
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />
                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;