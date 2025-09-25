const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb')

const app = express();
const PORT = 5001; // 포트를 5001로 변경
const MONGO_URI='mongodb+srv://admin:twenty-one@comgraduation.sjpeesm.mongodb.net/?retryWrites=true&w=majority&appName=ComGraduation';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

new MongoClient(MONGO_URI).connect(MONGO_URI).then((client)=>{
  console.log('DB연결성공')
  db = client.db('ComGraduation')
  app.listen(PORT, () => {
    console.log('http://localhost:5001 에서 서버 실행 중')
})
}).catch((err)=>{
  console.log(err)
})

app.post('/add', async (요청, 응답) => {
    console.log(요청.body)
    await db.collection('USER').insertOne(요청.body)
})

/* 준기 코드
app.get('/', (req, res) => {
    console.log('루트 경로에 GET 요청이 들어왔습니다.');
  res.json({ message: '서버가 정상적으로 작동 중입니다!' });
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 작동 중입니다.`);
});
*/
