import axios from 'axios';

// 1. Axios 인스턴스 생성
// 앞으로 모든 API 요청은 이 'api' 인스턴스를 통해 이루어집니다.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // API 서버의 기본 주소를 설정할 수 있습니다.
});


// 2. 요청 인터셉터(Request Interceptor) 설정
//    - 모든 요청이 서버로 보내지기 전에 이 코드를 거칩니다.
api.interceptors.request.use(
  
  // 요청을 보내기 전 수행할 작업
  (config) => {
    // 로컬 스토리지에서 'authToken'이라는 이름으로 저장된 토큰을 가져옵니다.
    const token = localStorage.getItem('authToken');

    // 만약 토큰이 존재한다면,
    if (token) {
      // 요청 헤더(headers)의 Authorization 필드에 'Bearer 토큰' 형식으로 값을 설정합니다.
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // 수정된 설정(config)을 반환해야 요청이 정상적으로 진행됩니다.
    return config;
  },

  // 요청 에러가 발생했을 때 수행할 작업
  (error) => {
    // 에러를 그대로 다음으로 넘깁니다.
    return Promise.reject(error);
  }
);

// 3. 다른 파일에서 이 인스턴스를 사용할 수 있도록 export 합니다.
export default api;