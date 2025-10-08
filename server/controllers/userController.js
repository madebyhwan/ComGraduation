const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

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
            process.env.JWT_SECRET || 'JWT_SECRET_KEY',
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

exports.deleteLecture = async (req, res) => {
  const userId = req.user && req.user.id;
  // const lectureId = req.params.customLectureId || req.params.lectureId;
  const lectureId = req.params.lectureId;

  if (!userId) return res.status(401).json({ message: '인증 정보가 없습니다.' });
  if (!lectureId) return res.status(400).json({ message: 'lectureId(customLectureId)가 필요합니다.' });
  if (!mongoose.Types.ObjectId.isValid(lectureId)) {
    return res.status(400).json({ message: '유효하지 않은 강의 ID 형식입니다.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    let removedFrom = null;

    // 1) 커스텀 강의에서 먼저 제거 시도
    const beforeCustom = user.userCustomLectures.length;
    user.userCustomLectures = user.userCustomLectures.filter(id => id.toString() !== lectureId);
    if (beforeCustom !== user.userCustomLectures.length) {
      removedFrom = 'custom';
    } else {
      // 2) 일반 강의에서 제거 시도
      const beforeStd = user.userLectures.length;
      user.userLectures = user.userLectures.filter(id => id.toString() !== lectureId);
      if (beforeStd !== user.userLectures.length) {
        removedFrom = 'standard';
      }
    }

    if (!removedFrom) {
      return res.status(404).json({ message: '사용자 강의 목록(일반/커스텀)에 존재하지 않는 강의입니다.' });
    }

    await user.save();
    // const safeUser = user.toObject();
    // delete safeUser.userPassword;

    return res.status(200).json({
      message: '강의가 성공적으로 제거되었습니다.',
      deletedLectureId: lectureId,
      // removedFrom,
      // user: safeUser
    });
  } catch (error) {
    console.error('강의 제거 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};