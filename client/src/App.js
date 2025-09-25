import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('서버로부터 메시지를 기다리는 중...');
  
  useEffect(() => {
    fetch('http://localhost:5001')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => setMessage('서버와의 연결에 실패했습니다.'));
  }
  , []); 
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello ComGraduation!</h1>
      </header>
      {/* 서버 상태 메시지를 화면 고정 위치에 표시 */}
      <div className="server-status" role="status" aria-live="polite">
        {message}
      </div>
    </div>
  );
}

export default App;