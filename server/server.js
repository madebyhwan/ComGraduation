const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001; // 포트를 5001로 변경

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    console.log('루트 경로에 GET 요청이 들어왔습니다.');
  res.json({ message: '서버가 정상적으로 작동 중입니다!' });
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 작동 중입니다.`);
});
