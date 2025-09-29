const User = require('../models/User'); // User의 model 정보 불러오기
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
  const { userId, userPassword, username, userDepartment, userTrack } = req.body;

  try {
    if (!userId || !userPassword || !username || !userDepartment || !userTrack) {
    return res.status(400).json({ message: '필수 입력 항목을 입력해주세요.' });
    }
    
    // ID 중복검사
    const userExist = await User.findOne({userId});
      if (userExist) {
        return res.status(400).json({message: "이미 존재하는 ID입니다."});
    }

    // USER_PASSWORD 암호화
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // 새로운 USER 객체 만들고 DB에 저장
    const newUser = await User.create({
      userId,
      userPassword: hashedPassword,
      username,
      userDepartment,
      userTrack
    });

    // 상태메시지
    res.status(201).json({ message: '회원가입이 완료되었습니다.', user: newUser});
  } catch (error) {
    res.status(500).json({ error: '회원가입에 실패했습니다.' });
  }
};