const User = require('../models/users');
const Lecture = require('../models/lectures');
const CustomLecture = require('../models/customLectures');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const graduationService = require('../services/graduationService');
const { body, validationResult } = require('express-validator');

const courseConfig = require('../config/courseConfig.json');
const allRules = require('../config/graduationRules.js');


// 유저의 강의 목록을 통합된 형태로 반환하는 함수
// exports.getLecture의 사실상 본체
async function lectureList(userId) {
  try {
    const user = await User.findById(userId)
      .populate({
        path: 'userCustomLectures',
        select: 'lectName lectType overseasCredit fieldPracticeCredit startupCourseCredit totalCredit'
      })
      .populate({
        path: 'userLectures',
        select: 'lectName lectCode lectDiv lectCredit lectYear lectSemester lectProfessor lectTime lectGeneral lectDepartment'
      })
      .populate({
        path: 'multiMajorLectures',
        select: 'lectName lectCode lectDiv lectCredit lectYear lectSemester lectProfessor lectTime lectGeneral'
      });

    if (!user) return null;

    // 분류 기준 리스트 준비
    const userDepartment = user.userDepartment || '';

    // [핵심] 두 전공을 같은 '심화컴퓨터' 계열(ABEEK)로 취급하기 위한 플래그
    const isDeepComputer = userDepartment === '심화컴퓨터공학전공' || userDepartment === '플랫폼SW&데이터과학전공';

    // ---------------------------------------------------------
    // 졸업 요건 키 생성
    // ---------------------------------------------------------
    let deptKeyForRule = userDepartment;
    if (isDeepComputer) {
      deptKeyForRule = '심화컴퓨터공학전공'; // 룰북 키를 심컴으로 통일 (필요 시)
    }

    const userTrack = user.userTrack || '';
    const userYear = user.userYear || '';

    let ruleKey;
    if (userTrack === '') {
      ruleKey = `${userDepartment}_${userYear}`;
    } else {
      ruleKey = `${userDepartment}_${userTrack}_${userYear}`;
    }

    // 졸업 요건 룰에서 '전공 필수' 과목 리스트 가져오기
    const requirements = allRules[ruleKey] || {};
    const requiredCoursesList = requirements.requiredMajorCourses?.courses || [];

    // courseConfig에서 데이터 구조 분해 할당
    const { majorCourses, generalEducation } = courseConfig;


    // ABEEK 관련 리스트 (심화/플랫폼용)
    const abeekData = majorCourses["심컴"] || {};
    const engineeringMajorList = abeekData.engineeringMajor || [];
    const majorBasisList = abeekData.majorBasis || [];
    const basicGenEdList = abeekData.basicGeneralEducation || [];

    // [수정] 특정 전공 리스트 (글로벌SW융합전공, 인공지능컴퓨팅전공 등)
    // 기존에는 "글로벌SW융합전공"만 하드코딩했으나, 이제 userDepartment에 맞는 리스트를 동적으로 가져옵니다.
    const targetMajorList = majorCourses[userDepartment] || [];

    // 첨성인 기초/핵심 리스트
    const knuBasic = generalEducation.knuBasic || {};
    const knuCore = generalEducation.knuCore || {};

    // 리스트 포함 여부 확인용 헬퍼 함수
    const inList = (list, code) => Array.isArray(list) && list.includes(code);
    const inObj = (obj, code) => Object.values(obj).some(arr => inList(arr, code));


    // 2. 커스텀 강의 매핑
    const custom = (user.userCustomLectures || []).map(cl => ({
      _id: cl?._id ?? null,
      lectName: cl?.lectName ?? null,
      lectType: cl?.lectType ?? null,
      overseasCredit: cl?.overseasCredit ?? 0,
      fieldPracticeCredit: cl?.fieldPracticeCredit ?? 0,
      startupCourseCredit: cl?.startupCourseCredit ?? 0,
      totalCredit: cl?.totalCredit ?? 0,
    }));

    // 3. 대학 강의 매핑 (분류 로직 적용)
    const mapLecture = (l) => {
      const code = l?.lectCode;
      const dbGeneral = l?.lectGeneral; // DB에 저장된 기본 구분
      const lectDepartment = l?.lectDepartment || '';

      let calculatedType = '일반선택'; // 기본값

      const isRequired = requiredCoursesList.includes(code);

      // [핵심 수정] courseConfig 기반 분류 로직
      if (isDeepComputer) {
        // --- 심화컴퓨터 & 플랫폼SW (ABEEK 로직) ---
        if (isRequired) {
          calculatedType = '전공필수';
        } else if (inList(engineeringMajorList, code)) {
          calculatedType = '공학전공';
        } else if (inList(majorBasisList, code)) {
          calculatedType = '전공기반';
        } else if (inList(basicGenEdList, code)) {
          calculatedType = '기본소양';
        } else if (dbGeneral === '교양' || dbGeneral === '기본소양') {
          calculatedType = '교양';
        } else {
          calculatedType = '일반선택';
        }
      } else {
        // --- 글로벌SW융합전공 / 인공지능컴퓨팅전공 / 기타 ---

        // [수정] 위에서 가져온 targetMajorList를 사용하여 전공 여부 확인
        // (인공지능컴퓨팅전공일 경우 해당 전공 과목 리스트를 참조하게 됨)
        const isMajor = inList(targetMajorList, code) && lectDepartment.includes('컴퓨터학부');

        if (isRequired) {
          calculatedType = '전공필수';
        } else if (isMajor) {
          calculatedType = '전공';
        } else if (dbGeneral === '교양' || dbGeneral === '기본소양') {
          calculatedType = '교양';
        } else {
          calculatedType = '일반선택';
        }
      }

      return {
        _id: l?._id ?? null,
        lectName: l?.lectName ?? null,
        lectCode: l?.lectCode ?? null,
        lectDiv: l?.lectDiv ?? null,
        lectCredit: l?.lectCredit ?? null,
        lectYear: l?.lectYear ?? null,
        lectSemester: l?.lectSemester ?? null,
        lectGeneral: calculatedType, // 계산된 분류 값
        lectProfessor: l?.lectProfessor ?? null,
        lectTime: l?.lectTime ?? null
      };
    };

    // 4. 정렬 로직 함수 (공통 사용)
    const sortLectures = (a, b) => {
      // 1순위: 년도
      if (a.lectYear !== b.lectYear) return (a.lectYear || 0) - (b.lectYear || 0);
      // 2순위: 학기
      if (a.lectSemester !== b.lectSemester) {
        const semesterOrder = { '1학기': 1, '계절학기(하계)': 2, '2학기': 3, '계절학기(동계)': 4 };
        const aOrder = semesterOrder[a.lectSemester] || 999;
        const bOrder = semesterOrder[b.lectSemester] || 999;
        return aOrder - bOrder;
      }
      // 3순위: 이름
      return (a.lectName || '').localeCompare(b.lectName || '');
    };

    // 매핑 및 정렬 적용
    const univ = (user.userLectures || []).map(mapLecture).sort(sortLectures);
    const multiMajor = (user.multiMajorLectures || []).map(mapLecture).sort(sortLectures);

    return {
      'custom': custom,
      'univ': univ,
      'multiMajor': multiMajor
    };
  } catch (error) {
    console.error('lectureList error:', error);
    throw error;
  }
}

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
      {
        id: user._id,
        username: user.username,
        userId: user.userId,
        userDepartment: user.userDepartment, //방금 추가
        userTrack: user.userTrack    //방금 추가 
      },
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

exports.registerUser = [
  // 검사 규칙
  body('userId')
    .isLength({ min: 8 })
    .withMessage('아이디는 최소 8자리 이상이어야 합니다.'),

  body('userPassword')
    .isLength({ min: 8 })
    .withMessage('비밀번호는 최소 8자리 이상이어야 합니다.')
    .matches(/^(?=.*[a-zA-Z])/)
    .withMessage('비밀번호는 영문을 포함해야 합니다.')
    .matches(/^(?=.*\d)/)
    .withMessage('비밀번호는 숫자를 포함해야 합니다.'),

  // 에러 처리
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: '입력 값이 유효하지 않습니다.',
        errors: errors.array()
      });
    }
    next();
  },

  // 3. 실제 회원가입 로직 (Controller Logic)
  async (req, res) => {
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

      res.status(201).json({ message: '회원가입이 완료되었습니다.', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '회원가입에 실패했습니다.' });
    }
  }
];

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
// [추가] 이름으로 아이디 찾기
exports.findIdByName = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: '이름을 입력해주세요.' });
    }

    // DB에서 이름(username)으로 사용자 검색
    const user = await User.findOne({ username: name });

    if (!user) {
      return res.status(404).json({ message: '해당 이름의 사용자가 없습니다.' });
    }

    // 찾은 경우 아이디(userId) 반환
    // 프론트엔드에서 response.data.userId 로 받기로 했으므로 키 이름을 userId로 맞춤
    res.status(200).json({
      success: true,
      userId: user.userId,
      message: '아이디 찾기 성공'
    });

  } catch (error) {
    console.error('아이디 찾기 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// [수정] 비밀번호 변경 함수 (사용자 요청 검증 로직 적용)
exports.changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  // 1. 필수 입력값 확인
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.' });
  }

  // 2. 새 비밀번호 유효성 검사 (요청하신 로직 그대로 적용)
  if (newPassword.length < 8) {
    return res.status(400).json({ message: '비밀번호는 최소 8자리 이상이어야 합니다.' });
  }
  if (!/[a-zA-Z]/.test(newPassword)) {
    return res.status(400).json({ message: '비밀번호는 영문을 포함해야 합니다.' });
  }
  if (!/(?=.*\d)/.test(newPassword)) {
    return res.status(400).json({ message: '비밀번호는 숫자를 포함해야 합니다.' });
  }

  try {
    // 3. 사용자 확인
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 4. 현재 비밀번호 일치 여부 확인
    const isMatch = await bcrypt.compare(currentPassword, user.userPassword);
    if (!isMatch) {
      return res.status(400).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
    }

    // 5. 새 비밀번호 암호화 및 저장
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.userPassword = hashedPassword;
    await user.save();

    res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });

  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};


exports.addUnivLecture = async (req, res) => {
  const { lectureId } = req.body;
  const userId = req.user.id;

  if (!lectureId) {
    return res.status(400).json({ message: '필수 입력 항목을 입력해주세요.' });
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

    const existingLectureWithSameCode = await Lecture.findOne({
      lectCode: lecture.lectCode,
      _id: { $in: user.userLectures }
    });

    if (existingLectureWithSameCode) {
      return res.status(409).json({ message: '존재하는 교과목코드입니다.' });
    }

    user.userLectures.push(lectureId);
    await user.save();
    res.status(200).json({
      message: '강의가 성공적으로 추가되었습니다.',
      lectInfo: lecture.toJSON()
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
  if (!lectureId) return res.status(400).json({ message: 'lectureId가 필요합니다.' });
  if (!mongoose.Types.ObjectId.isValid(lectureId)) {
    return res.status(400).json({ message: '유효하지 않은 강의 ID 형식입니다.' });
  }

  try {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    const lectureObjectId = new mongoose.Types.ObjectId(lectureId);

    const pullResult = await User.updateOne(
      { _id: userId },
      {
        $pull: {
          userLectures: lectureObjectId,
          userCustomLectures: lectureObjectId,
          multiMajorLectures: lectureObjectId
        }
      }
    );

    if (!pullResult.modifiedCount) {
      return res.status(404).json({ message: '사용자 강의 목록(일반/커스텀)에 존재하지 않는 강의입니다.' });
    }

    // 커스텀 강의 문서도 함께 제거 (해당 사용자의 문서일 때만)
    await CustomLecture.deleteOne({ _id: lectureObjectId, userObjectId: userId });

    return res.status(200).json({
      message: '강의가 성공적으로 제거되었습니다.',
      deletedLectureId: lectureId
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

    // 2. DB에서 사용자 정보와 수강 과목 목록을 *모두 populate 합니다.*
    const user = await User.findById(userId)
      .populate('userLectures')
      .populate('userCustomLectures')
      .populate('multiMajorLectures');

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 3. 준비된 데이터를 graduationService에 전달하여 결과를 받습니다.
    const result = await graduationService.check(user, user.userLectures, user.userCustomLectures, user.multiMajorLectures); // 합쳐진 배열 전달

    // 4. 최종 결과를 클라이언트에게 성공적으로 응답합니다.
    res.status(200).json(result);

  } catch (error) {
    // 5. 오류 발생 시 에러 메시지를 응답합니다.
    console.error("졸업요건 확인 중 오류 발생:", error);
    res.status(500).json({ message: "서버 내부 오류가 발생했습니다.", error: error.message });
  }
};

exports.addCustomLecture = async (req, res) => {
  const { lectName, lectType, overseasCredit, fieldPracticeCredit, startupCourseCredit, totalCredit } = req.body;
  const userId = req.user.id;

  // 0을 허용하도록 유효성 검사 수정
  if (!lectName || !lectType) {
    return res.status(400).json({ message: '활동명과 교과 구분은 필수 입력 항목입니다.' });
  }
  if (overseasCredit === undefined || overseasCredit === null ||
    fieldPracticeCredit === undefined || fieldPracticeCredit === null ||
    startupCourseCredit === undefined || startupCourseCredit === null ||
    totalCredit === undefined || totalCredit === null) {
    return res.status(400).json({ message: '모든 학점 필드는 0 이상의 값으로 입력해야 합니다.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const newCustomLecture = await CustomLecture.create({
      userObjectId: user._id,
      lectName,
      lectType,
      overseasCredit,
      fieldPracticeCredit,
      startupCourseCredit,
      totalCredit,
    });
    user.userCustomLectures.push(newCustomLecture._id);
    await user.save();

    // status: 201 리소스 생성을 의미
    res.status(201).json({
      message: '강의가 성공적으로 추가되었습니다.',
      lectInfo: newCustomLecture.toJSON()
    });
  } catch (error) {
    console.error('강의 추가 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

exports.getLecture = async (req, res) => {
  const userId = req.user.id;
  try {
    const data = await lectureList(userId);
    if (!data)
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    else
      return res.status(200).json({ data });
  } catch (error) {
    console.error('강의 불러오는 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 사용자 정보 조회 (아이디, 이름 포함 전체 정보)
exports.getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('-userPassword');

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json({
      message: '사용자 정보 조회 성공',
      user: {
        userId: user.userId,
        username: user.username,
        userYear: user.userYear,
        userDepartment: user.userDepartment,
        userTrack: user.userTrack,
        englishTest: user.englishTest || { testType: null, score: null },
        passedInterview: user.passedInterview || false,
        passedTopcit: user.passedTopcit || false,
        isStartup: user.isStartup || false,
        isExchangeStudent: user.isExchangeStudent || false,
        counselingCount: user.counselingCount || 0,
        multiMajorType: user.multiMajorType || null
      }
    });
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 사용자 정보 수정 (아이디, 이름 제외한 나머지 수정 가능)
exports.updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    username,
    userYear,
    userDepartment,
    userTrack,
    multiMajorType,  // 유저 정보 업데이트 안됨: multiUserTrack
    englishTest,
    passedInterview,
    passedTopcit,
    isStartup,
    isExchangeStudent,
    counselingCount
  } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    // 수정 가능한 필드만 업데이트
    if (username !== undefined) {
      user.username = String(username);
    }

    // [추가] 입학년도 업데이트 로직
    if (userYear !== undefined) {
      user.userYear = userYear;
    }

    if (userDepartment !== undefined) {
      const validDepartments = ['글로벌SW융합전공', '심화컴퓨터공학전공', '플랫폼SW&데이터과학전공', '인공지능컴퓨팅전공'];
      if (!validDepartments.includes(userDepartment)) {
        return res.status(400).json({ message: '유효하지 않은 전공입니다.' });
      }
      user.userDepartment = userDepartment;
    }

    if (userTrack !== undefined) {
      const validTracks = ['심컴', '인컴', '다중전공', '해외복수학위', '학석사연계'];
      if (!validTracks.includes(userTrack)) {
        return res.status(400).json({ message: '유효하지 않은 졸업 트랙입니다.' });
      }
      user.userTrack = userTrack;
    }

    if (multiMajorType !== undefined) {
      const validMultiMajorTypes = ['복수전공', '연계전공', '융합전공', '부전공', null];
      if (!validMultiMajorTypes.includes(multiMajorType)) {
        return res.status(400).json({ message: '유효하지 않은 다중전공 트랙입니다.' });
      }
      user.multiMajorType = multiMajorType;
    }

    // 영어 성적 업데이트
    if (englishTest !== undefined) {
      const validTestTypes = ['TOEIC', 'TOEIC SPEAKING', 'PBT', 'IBT', 'CBT', 'TEPS', 'TEPS SPEAKING', 'OPIC', 'G-TELP', 'IELTS'];

      // englishTest가 null이거나 빈 객체인 경우 초기화
      if (!englishTest || englishTest.testType === null || englishTest.testType === '') {
        user.englishTest = { testType: null, score: null };
        user.markModified('englishTest'); // Mongoose에게 nested object 변경 알림
      } else {
        if (!validTestTypes.includes(englishTest.testType)) {
          return res.status(400).json({ message: '유효하지 않은 영어 시험 종류입니다.' });
        }
        user.englishTest = {
          testType: englishTest.testType,
          score: englishTest.score || null
        };
        user.markModified('englishTest'); // Mongoose에게 nested object 변경 알림
      }
    }

    // Boolean 필드 업데이트
    if (passedInterview !== undefined) {
      user.passedInterview = Boolean(passedInterview);
    }
    if (passedTopcit !== undefined) {
      user.passedTopcit = Boolean(passedTopcit);
    }
    if (isStartup !== undefined) {
      user.isStartup = Boolean(isStartup);
    }
    if (isExchangeStudent !== undefined) {
      user.isExchangeStudent = Boolean(isExchangeStudent);
    }

    // 상담 횟수 업데이트 (0 이상의 정수)
    if (counselingCount !== undefined) {
      const count = parseInt(counselingCount);
      if (isNaN(count) || count < 0) {
        return res.status(400).json({ message: '상담 횟수는 0 이상의 숫자여야 합니다.' });
      }
      user.counselingCount = count;
    }

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.userPassword;

    return res.status(200).json({
      message: '사용자 정보가 성공적으로 수정되었습니다.',
      user: safeUser
    });
  } catch (error) {
    console.error('사용자 정보 수정 오류:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: '입력 값이 유효하지 않습니다.',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 일반 -> 다중전공
exports.tossMultiMajorLectures = async (req, res) => {
  const userId = req.user.id;
  const { lectureId } = req.body;

  if (!lectureId) {
    return res.status(400).json({ message: '필수 입력 항목을 입력해주세요.' });
  }

  try {
    const user = await User.findById(userId);
    const lecture = await Lecture.findById(lectureId);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    if (!lecture) {
      // 이관할 강의가 Lecture DB에 존재하는지 확인
      const lecture = await Lecture.findById(lectureId);
      return res.status(404).json({ message: '존재하지 않는 강의입니다.' });
    }
    if (user.multiMajorLectures.includes(lectureId)) {
      return res.status(409).json({ message: '이미 다중전공으로 이관된 강의입니다.' });
    }
    if (user.userTrack !== '다중전공') {
      return res.status(400).json({ message: '다중전공 학생만 이용할 수 있는 기능입니다.' });
    }

    const updateResult = await User.updateOne(
      { _id: userId, userLectures: lectureId },
      {
        $pull: { userLectures: new mongoose.Types.ObjectId(lectureId) },
        $push: { multiMajorLectures: new mongoose.Types.ObjectId(lectureId) }
      }
    );

    if (updateResult.modifiedCount === 0) {
      // userLectures에 해당 강의가 없었거나, 이미 이관된 경우
      return res.status(404).json({ message: '해당 강의가 수강 내역에 존재하지 않거나 이관에 실패했습니다.' });
    }

    res.status(200).json({
      message: '강의가 성공적으로 변경되었습니다.',
      lectInfo: lecture.toJSON()
    });

  } catch (error) {
    console.error('강의 변경 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 다중전공 -> 일반
exports.removeMultiMajorLectures = async (req, res) => {
  const userId = req.user.id;
  const { lectureId } = req.body;

  if (!lectureId) {
    return res.status(400).json({ message: '필수 입력 항목을 입력해주세요.' });
  }

  if (!mongoose.Types.ObjectId.isValid(lectureId)) {
    return res.status(400).json({ message: '유효하지 않은 강의 ID 형식입니다.' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    if (user.userTrack !== '다중전공') {
      return res.status(400).json({ message: '다중전공 학생만 이용할 수 있는 기능입니다.' });
    }

    const lectureObjectId = new mongoose.Types.ObjectId(lectureId);

    // 강의가 존재하는지 확인
    const lecture = await Lecture.findById(lectureObjectId);
    if (!lecture) {
      return res.status(404).json({ message: '존재하지 않는 강의입니다.' });
    }

    // 이미 userLectures에 있는지 확인
    const isAlreadyInUserLectures = user.userLectures.some(id => id.equals(lectureObjectId));
    if (isAlreadyInUserLectures) {
      return res.status(409).json({ message: '이미 수강 내역에 있는 강의입니다.' });
    }

    // multiMajorLectures에 있는지 확인
    const isInMultiMajor = user.multiMajorLectures.some(id => id.equals(lectureObjectId));
    if (!isInMultiMajor) {
      return res.status(400).json({ message: '강의가 다중전공 목록에 존재하지 않습니다.' });
    }

    // 원자적 업데이트: multiMajorLectures에서 제거하고 userLectures에 추가
    const updateResult = await User.updateOne(
      {
        _id: userId,
        multiMajorLectures: lectureObjectId,  // multiMajorLectures에 존재하는 경우만
        userLectures: { $ne: lectureObjectId }  // userLectures에 없는 경우만
      },
      {
        $pull: { multiMajorLectures: lectureObjectId },
        $addToSet: { userLectures: lectureObjectId }
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(409).json({ message: '강의 이동에 실패했습니다. 조건을 만족하지 않습니다.' });
    }

    res.status(200).json({
      message: '강의가 수강 내역으로 성공적으로 이동되었습니다.',
      lectureId: lectureId
    });

  } catch (error) {
    console.error('강의 변경 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// [추가] 기타 활동 수정
exports.updateCustomLecture = async (req, res) => {
  const { lectureId } = req.params; // URL에서 수정할 항목의 ID를 가져옴
  const userId = req.user.id;
  const { lectName, lectType, overseasCredit, fieldPracticeCredit, startupCourseCredit, totalCredit } = req.body;

  // 0을 허용하도록 유효성 검사
  if (!lectName || !lectType) {
    return res.status(400).json({ message: '활동명과 교과 구분은 필수 입력 항목입니다.' });
  }
  if (overseasCredit === undefined || overseasCredit === null ||
    fieldPracticeCredit === undefined || fieldPracticeCredit === null ||
    startupCourseCredit === undefined || startupCourseCredit === null ||
    totalCredit === undefined || totalCredit === null) {
    return res.status(400).json({ message: '모든 학점 필드는 0 이상의 값으로 입력해야 합니다.' });
  }

  try {
    // 1. 수정할 활동을 찾습니다.
    const lecture = await CustomLecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: '해당 활동을 찾을 수 없습니다.' });
    }

    // 2. 본인의 활동이 맞는지 확인합니다 (중요)
    if (lecture.userObjectId.toString() !== userId) {
      return res.status(403).json({ message: '이 활동을 수정할 권한이 없습니다.' });
    }

    // 3. 찾은 문서의 내용을 업데이트합니다.
    lecture.lectName = lectName;
    lecture.lectType = lectType;
    lecture.overseasCredit = Number(overseasCredit);
    lecture.fieldPracticeCredit = Number(fieldPracticeCredit);
    lecture.startupCourseCredit = Number(startupCourseCredit);
    lecture.totalCredit = Number(totalCredit);

    // 4. 변경 사항을 저장합니다.
    await lecture.save();

    res.status(200).json({
      message: '활동이 성공적으로 수정되었습니다.',
      lectInfo: lecture.toJSON() // 수정된 내용을 다시 보냄
    });

  } catch (error) {
    console.error('활동 수정 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// [추가] univ lecture -> custom lecture
exports.univToCustomLecture = async (req, res) => {
  const { lectureId } = req.body;
  const userId = req.user.id;

  try {
    // 1. 넘길 강의를 찾습니다
    const user = await User.findById(userId);
    const lecture = await Lecture.findById(lectureId);

    if (!user) {
      return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
    }
    if (!lecture) {
      return res.status(404).json({ message: '해당 강의를 찾을 수 없습니다.' });
    }

    // 2. 본인이 추가한 강의가 맞는지 확인합니다 (중요)
    const lectureObjectId = new mongoose.Types.ObjectId(lectureId);
    const hasLecture = user.userLectures.some(id => id.equals(lectureObjectId));
    if (!hasLecture) {
      return res.status(403).json({ message: '이 강의를 수정할 권한이 없습니다.' });
    }

    const { ventureCourses } = courseConfig;
    const ventureCourseList = ventureCourses["ventures"];

    let calculatedOverseasCredit = 0;
    let calculatedStartupCredit = 0;

    // 1. 영어 강의 체크: isEnglishLecture이면 overseasCredit에 1을 추가
    if (lecture.isEnglishLecture) {
      calculatedOverseasCredit = 1;
    }

    // 2. 벤처 교과목 체크: lectCode가 목록에 포함되면 startupCourseCredit에 totalCredit을 더함
    if (ventureCourseList.includes(lecture.lectCode)) {
      // lecture.lectCredit는 해당 강의의 학점입니다.
      calculatedStartupCredit = lecture.lectCredit;
    }

    // 3. CustomLecture 인스턴스 생성
    const customLectureInstance = new CustomLecture({
      userObjectId: user._id,
      lectName: lecture.lectName,
      lectType: '일반선택', // 기본값
      lectCode: lecture.lectCode,
      overseasCredit: calculatedOverseasCredit,
      fieldPracticeCredit: 0,
      startupCourseCredit: calculatedStartupCredit,
      totalCredit: lecture.lectCredit,
      isEnglishLecture: lecture.isEnglishLecture,
      isSDGLecture: lecture.isSDGLecture
    });
    await customLectureInstance.save();

    // 4. 유저의 userLectures에서 제거하고 userCustomLectures에 추가
    user.userLectures = user.userLectures.filter(id => !id.equals(lectureObjectId));
    user.userCustomLectures.push(customLectureInstance._id);
    await user.save();

    res.status(200).json({
      message: '활동이 성공적으로 수정되었습니다.',
      lectInfo: customLectureInstance.toJSON() // 수정된 내용을 다시 보냄
    });

  } catch (error) {
    console.error('활동 수정 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// [추가] 회원 탈퇴
exports.deleteUser = async (req, res) => {
  const userId = req.user.id; // 미들웨어에서 추출한 _id

  try {
    // 1. 사용자 존재 확인
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 2. 연관된 커스텀 강의 데이터 삭제
    await CustomLecture.deleteMany({ userObjectId: userId });

    // 3. 사용자 삭제 (게시글/댓글은 남기거나, 필요 시 추가 삭제 로직 구현)
    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
  } catch (error) {
    console.error('회원 탈퇴 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};