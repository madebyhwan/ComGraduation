import { jwtDecode } from 'jwt-decode'; // (npm install jwt-decode 필요)

// 토큰 만료 여부 확인
export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        console.error("Invalid token:", error);
        return true;
    }
};

// 토큰 디코딩
export const decodeJWT = (token) => {
    if (!token) return null;
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};