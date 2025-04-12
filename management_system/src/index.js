import React from 'react';
import ReactDOM from 'react-dom/client';
import './Student/css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login/Login'
import StudentLayout from './Student/components/MyLayout';
import AdminLayout from './Admin/components/MyLayout';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        
        {/* 管理端路由 */}
        <Route path='/admin/*' element={<AdminLayout />}>
          <Route path='announcement' element={<App role="Admin" component="Announcement" />} />
          <Route path='develop/process' element={<App role="Admin" component="Process" />} />
          <Route path='develop/change' element={<App role="Admin" component="Change" />} />
          <Route path='personAll' element={<App role="Admin" component="PersonAll" />} />
          <Route path='file' element={<App role="Admin" component="File" />} />
          <Route path='person' element={<App role="Admin" component="Person" />} />
        </Route>

        {/* 学生端路由 */}
        <Route path='/student/*' element={<StudentLayout />}>
          <Route path='announcement' element={<App role="Student" component="Announcement" />} />
          <Route path='develop/process' element={<App role="Student" component="Process" />} />
          <Route path='develop/change' element={<App role="Student" component="Change" />} />
          <Route path='file' element={<App role="Student" component="File" />} />
          <Route path='person' element={<App role="Student" component="Person" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);