const User = require('../models/users');
const Lecture = require('../models/lectures');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
    const userId = req.body.userId;
    const password = req.body.userPassword;
    try {
        // 해당 아이디 유저 정보 찾기
        const user = await User.findOne({ userId: userId });

        // 아이디 확인
        if (!user) return res.status(400).json({ message: '해당하는 아이디를 찾을 수 없습니다' });

        // 비밀번호 확인
        const match = await bcrypt.compare(password, user.userPassword)
        if (!match) return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });

        // 토큰 발행
        const token = jwt.sign(
            { id: user._id, username: user.username, userId: user.userId },
            process.env.JWT_SECRET_KEY || 'JWT_SECRET_KEY',
            { expiresIn: '1d' }
        );
        
        // 토큰 전송
        res.json({
            message: `안녕하세요! ${user.username}님!`,
            token
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ message: '서버 에러 발생' });
    }
}; 

exports.registerUser = async (req, res) => {
  const { userId, userYear, userPassword, username, userDepartment, userTrack } = req.body;

  try {
    if (!userId || !userYear || !userPassword || !username || !userDepartment || !userTrack) {
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
      userYear,
      userPassword: hashedPassword,
      username,
      userDepartment,
      userTrack
    });

    // 상태메시지
    res.status(201).json({ message: '회원가입이 완료되었습니다.', user: newUser});
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: '회원가입에 실패했습니다.' });
  }
};

exports.addUnivLecture = async (req, res) => {
  const { lectureId } = req.body;
  const userId = req.user.id;

  if (!lectureId) {
    return res.status(400).json(error);
  }

  try { 
    const user = await User.findById(userId);
    const lecture = await Lecture.findById(lectureId);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    if (!lecture) {
      return res.status(404).json({ message: '존재하지 않는 강의입니다.' });
    }
    if (user.userLectures.includes(lectureId)) {
      return res.status(409).json({ message: '이미 추가된 강의입니다.' });
    }

    user.userLectures.push(lectureId);
    await user.save();
    res.status(200).json({ 
      message: '강의가 성공적으로 추가되었습니다.',
      data: user.userLectures 
    });

    } catch (error) {
      console.error('강의 추가 중 오류 발생:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}
