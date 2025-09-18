// 예시 코드
// const User = require('../models/User'); // 위에서 만든 설계도를 가져옵니다.
// const bcrypt = require('bcryptjs');

// exports.registerUser = async (req, res) => {
//   // 1. 클라이언트가 보낸 데이터를 받습니다 (예: 학번, 비밀번호, 이름).
//   const { studentId, password, name, email } = req.body;

//   try {
//     // 2. 비밀번호를 암호화합니다.
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 3. 설계도에 따라 새로운 사용자 객체를 만듭니다.
//     const newUser = new User({
//       studentId,
//       password: hashedPassword,
//       name,
//       email
//     });

//     // 4. 데이터베이스에 저장합니다.
//     await newUser.save();
//     res.status(201).json({ message: '회원가입이 완료되었습니다.' });
//   } catch (error) {
//     res.status(500).json({ error: '회원가입에 실패했습니다.' });
//   }
// };