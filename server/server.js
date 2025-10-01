const express = require('express');
const cors = require('cors');

// DB
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnect');

// Routes
const userRoutes = require('./routes/userRoutes');
const lectureRoutes = require('./routes/lectureRoutes');

const app = express();
// DB 연결
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes 설정: 해당 URL로 요청이 오면 각 route로 전달
// 프론트 쪽에서 오는 /api/xxx -> 형태는 여기서 정의하면 될 듯
app.use('/api/users', userRoutes);
app.use('/api/lectures', lectureRoutes);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}에서 실행 중입니다.`);
});