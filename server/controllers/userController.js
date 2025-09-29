const User = require('../models/users'); // 위에서 만든 설계도를 가져옵니다.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
    // 클라이언트가 보낸 데이터 받기
    const username = req.body.username;
    const password = req.body.userPassword;
    try {
        // 데이터 베이스 유저 정보에 있는 아이디를 확인
        const user = await User.db.collection('users').findOne({ username: username });
        // 만약 아이디가 없으면 없는 아이디라고 response 하기
        if (!user) return res.status(400).json({ message: '해당하는 아이디를 찾을 수 없어요! 가입하신 거 맞아요?' });
        // 아이디가 있다면 데이터베이스에 있는 해쉬화 되어있는 비밀번호와 비교
        // 비밀번호가 다르다면 비밀번호가 틀렸다고 리턴
        const match = await bcrypt.compare(password, user.userPassword)
        if (!match) return res.status(400).json({ message: '비밀번호가 일치하지 않아요.' });
        // 비밀번호가 같으면 토큰 발행
        // .env 파일에 저장된 JWT 시크릿 키를 통해서 토큰 발행
        const token = jwt.sign(
            { id: user._id, username: user.username, userId: user.userId },
            process.env.JWT_SECRET || 'JWT_SECRET_KEY',
            { expiresIn: '1d' }
        );
        
        // 로그인 성공 시 메세지와 함께 토큰 전송
        res.json({
            message: `안녕하세요! ${user.username}님!`,
            token
        });
    } catch (err) {
        console.log(err);
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
    console.log(error);
    res.status(500).json({ error: '회원가입에 실패했습니다.' });
  }
};
