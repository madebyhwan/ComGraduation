import axios from 'axios';

// 1. 서버의 전체 주소를 baseURL로 하는 axios 인스턴스를 생성합니다.
const apiClient = axios.create({
  baseURL: '', // 님의 package.json에 있던 9000번 포트
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청 인터셉터: 로컬 스토리지에서 토큰을 가져와 모든 요청 헤더에 추가합니다.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 'token' 이름이 맞는지 확인
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;