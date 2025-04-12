import MyLayout from './Student/components/MyLayout';
import { Routes, Route, useLocation } from 'react-router-dom';
import './Student/css/App.css'; 
import React from 'react';

// 动态加载组件函数
const dynamicImport = (role, componentPath) => {
  return React.lazy(() => import(`./${role}/pages/${componentPath}`));
};

function App({ role, component }) {
  const Component = dynamicImport(role, component);
  const location = useLocation();

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Component /> {/* 直接渲染动态加载的组件 */}
    </React.Suspense>
  );
}

export default App;