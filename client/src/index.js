import React from 'react';
// (중요!) 'react-dom'이 아니라 'react-dom/client'를 import 합니다.
import ReactDOM from 'react-dom/client';
import './index.css';

// 님의 App.js 파일 이름이 AppRouter.js이므로 AppRouter를 import 합니다.
import AppRouter from './App';
// import reportWebVitals from './reportWebVitals';

// --- React 18 방식 ---
// 1. 'root' DOM 노드를 선택합니다.
const rootElement = document.getElementById('root');

// 2. React 18의 createRoot API를 사용합니다.
const root = ReactDOM.createRoot(rootElement);

// 3. root.render()로 앱을 렌더링합니다.
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

// reportWebVitals();