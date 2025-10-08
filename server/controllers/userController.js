const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const graduationService = require('../services/graduationService');

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
    const userExist = await User.findOne({ userId });
    if (userExist) {
      return res.status(400).json({ message: "이미 존재하는 ID입니다." });
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
    res.status(201).json({ message: '회원가입이 완료되었습니다.', user: newUser });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: '회원가입에 실패했습니다.' });
  }
};

exports.checkIdDuplication = async (req, res) => {
  const { userId } = req.query;

  try {
    const existingUser = await User.findOne({ userId: userId });

    if (existingUser) {
      // 1. 중복된 경우: 409 상태 코드와 함께 { isAvailable: false } 전송
      return res.status(409).json({ isAvailable: false });
    }

    // 2. 사용 가능한 경우: 200 상태 코드와 함께 { isAvailable: true } 전송
    res.status(200).json({ isAvailable: true });
  } catch (error) {
    console.error('아이디 중복 확인 중 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

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
exports.checkGraduation = async (req, res) => {
  try {
    // 1. 로그인된 사용자의 ID를 가져옵니다. (auth 미들웨어 사용 가정)
    const userId = req.user.id;

    // 2. DB에서 사용자 정보와 수강 과목 목록을 가져옵니다.
    const user = await User.findById(userId);
    // 'takenLectures'는 User 모델에 populate하거나 직접 조회해야 합니다.
    // 이 부분은 현재 DB 구조에 맞게 수정이 필요할 수 있습니다.
    const takenLectures = await Lecture.find({ _id: { $in: user.userLectures } });

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 3. 준비된 데이터를 graduationService에 전달하여 결과를 받습니다.
    const result = graduationService.check(user, takenLectures);

    // 4. 최종 결과를 클라이언트에게 성공적으로 응답합니다.
    res.status(200).json(result);

  } catch (error) {
    // 5. 오류 발생 시 에러 메시지를 응답합니다.
    console.error("졸업요건 확인 중 오류 발생:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다.", error: error.message });
  }
}