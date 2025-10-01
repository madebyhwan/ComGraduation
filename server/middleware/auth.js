const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'JWT_SECRET_KEY';

// 로그인 인증 미들웨어
const authenticateToken = (req, res, next) => {
    // 헤더에서 토큰 가져오기
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 토큰 없으면 에러
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });

    // 토큰 검증
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;