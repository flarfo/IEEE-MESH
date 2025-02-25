import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import 'antd/dist/reset.css';
import { store } from './app/store.js';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<App />}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
