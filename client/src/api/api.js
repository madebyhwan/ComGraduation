// client/src/api/api.js (최종본)
import apiClient from './http.js'; // baseURL: 'http://localhost:9000'

// --- 1. User API ---

// POST /api/users/login
export const login = async (loginData) => {
  try {
    const payload = {
      userId: loginData.studentId,
      userPassword: loginData.password
    };
    const response = await apiClient.post('/api/users/login', payload);
    return response.data;
  } catch (error) {
    console.error('Login API error:', error.response || error);
    throw error;
  }
};

// 아이디 찾기 API (이름으로 요청)
export const findIdByName = (name) => apiClient.post('/api/users/find-id', { name });
// [추가] 비밀번호 변경 API
export const changePassword = (data) => apiClient.post('/api/users/change-password', data);

// POST /api/users/register
export const signup = async (signupData) => {
  try {
    // userController/registerUser가 기대하는 payload
    const payload = {
      userId: signupData.studentId,
      userPassword: signupData.password,
      username: signupData.username,
      userYear: signupData.userYear,
      userDepartment: signupData.userDepartment,
      userTrack: signupData.userTrack
    };
    const response = await apiClient.post('/api/users/register', payload);
    return response.data;
  } catch (error) {
    console.error('Signup API error:', error.response || error);
    throw error;
  }
};

// GET /api/users/checkId
export const checkIdDuplication = async (userId) => {
  try {
    const response = await apiClient.get('/api/users/checkId', {
      params: { userId } // 쿼리 파라미터로 전송
    });
    return response.data; // { isAvailable: true }
  } catch (error) {
    // 409 (Conflict)는 "중복됨"을 의미하므로 정상 응답으로 처리
    if (error.response && error.response.status === 409) {
      return error.response.data; // { isAvailable: false }
    }
    console.error('Check ID API error:', error.response || error);
    throw error;
  }
};

// GET /api/users/profile
export const getMyInfo = async () => {
  try {
    const response = await apiClient.get('/api/users/profile');
    return response.data; // { message: '...', user: {...} }
  } catch (error) {
    console.error('Get My Info API error:', error.response || error);
    throw error;
  }
};

// PATCH /api/users/profile
export const updateMyInfo = async (profileData) => {
  try {
    // userController/updateUserProfile이 받는 모든 필드
    const payload = {
      username: profileData.username,
      userYear: profileData.userYear,
      userDepartment: profileData.userDepartment,
      userTrack: profileData.userTrack,
      multiMajorType: profileData.multiMajorType,
      englishTest: profileData.englishTest, // { testType, score } 객체
      passedInterview: profileData.passedInterview,
      passedTopcit: profileData.passedTopcit,
      isStartup: profileData.isStartup,
      isExchangeStudent: profileData.isExchangeStudent,
      counselingCount: profileData.counselingCount
    };
    const response = await apiClient.patch('/api/users/profile', payload);
    return response.data;
  } catch (error) {
    console.error('Update My Info API error:', error.response || error);
    throw error;
  }
};

// GET /api/users/graduation
export const getGraduationStatus = async () => {
  try {
    const response = await apiClient.get('/api/users/graduation');
    return response.data; // 졸업 요건 결과 JSON
  } catch (error) {
    console.error('Get Graduation API error:', error.response || error);
    throw error;
  }
};

// --- 2. Lecture API ---

// GET /api/users/getLecture
export const getMyLectures = async () => {
  try {
    const response = await apiClient.get('/api/users/getLecture');
    return response.data; // { data: { custom: [], univ: [], multiMajor: [] } }
  } catch (error) {
    console.error('Get My Lectures API error:', error.response || error);
    throw error;
  }
};

// GET /api/lectures/search
export const searchLectures = async (searchParams) => {
  try {
    // lectureController/searchLecture가 기대하는 쿼리 파라미터
    const response = await apiClient.get('/api/lectures/search', {
      params: {
        keyword: searchParams.keyword,
        year: searchParams.year || null,
        semester: searchParams.semester || null
      }
    });
    return response.data;
  } catch (error) {
    console.error('Search Lectures API error:', error.response || error);
    throw error;
  }
};

// POST /api/users/addUnivLect
export const addUnivLecture = async (lectureId) => {
  try {
    const payload = { lectureId };
    const response = await apiClient.post('/api/users/addUnivLect', payload);
    return response.data;
  } catch (error) {
    console.error('Add Univ Lecture API error:', error.response || error);
    throw error;
  }
};

// POST /api/users/addCustomLect
export const addCustomLecture = async (lectureData) => {
  try {
    // customLectures.js 모델이 기대하는 payload
    const payload = {
      lectName: lectureData.lectName,
      lectType: lectureData.lectType,
      overseasCredit: Number(lectureData.overseasCredit) || 0,
      fieldPracticeCredit: Number(lectureData.fieldPracticeCredit) || 0,
      startupCourseCredit: Number(lectureData.startupCourseCredit) || 0,
      totalCredit: Number(lectureData.totalCredit) || 0,
      knuBasicReading: lectureData.knuBasicReading || false,
      knuBasicMath: lectureData.knuBasicMath || false,
      knuCoreHumanity: lectureData.knuCoreHumanity || false,
      knuCoreNatural: lectureData.knuCoreNatural || false,
      isSDGLecture: lectureData.isSDGLecture || false
    };
    const response = await apiClient.post('/api/users/addCustomLect', payload);
    return response.data;
  } catch (error) {
    console.error('Add Custom Lecture API error:', error.response || error);
    throw error;
  }
};
export const univToCustom = (lectureId) => apiClient.patch('/api/users/univToCustom', { lectureId });

export const updateCustomLecture = async (lectureId, lectureData) => {
  try {
    // userController/updateCustomLecture가 기대하는 payload
    const payload = {
      lectName: lectureData.lectName,
      lectType: lectureData.lectType,
      overseasCredit: Number(lectureData.overseasCredit) || 0,
      fieldPracticeCredit: Number(lectureData.fieldPracticeCredit) || 0,
      startupCourseCredit: Number(lectureData.startupCourseCredit) || 0,
      totalCredit: Number(lectureData.totalCredit) || 0,
      knuBasicReading: lectureData.knuBasicReading || false,
      knuBasicMath: lectureData.knuBasicMath || false,
      knuCoreHumanity: lectureData.knuCoreHumanity || false,
      knuCoreNatural: lectureData.knuCoreNatural || false,
      isSDGLecture: lectureData.isSDGLecture || false
    };
    // URL 파라미터로 lectureId를 전달하고, payload를 body로 전송
    const response = await apiClient.patch(`/api/users/customLecture/${lectureId}`, payload);
    return response.data;
  } catch (error) {
    console.error('Update Custom Lecture API error:', error.response || error);
    throw error;
  }
};

// DELETE /api/users/deleteLecture/:lectureId
export const deleteLecture = async (lectureId) => {
  try {
    const response = await apiClient.delete(`/api/users/deleteLecture/${lectureId}`);
    return response.data;
  } catch (error) {
    console.error('Delete Lecture API error:', error.response || error);
    throw error;
  }
};

// --- 3. Multi-Major API ---

// POST /api/users/tossMultiMajorLectures (일반 -> 다중)
export const tossMultiMajor = async (lectureId) => {
  try {
    const payload = { lectureId };
    const response = await apiClient.post('/api/users/tossMultiMajorLectures', payload);
    return response.data;
  } catch (error) {
    console.error('Toss Multi-Major API error:', error.response || error);
    throw error;
  }
};

// POST /api/users/removeMultiMajorLectures (다중 -> 일반)
export const removeMultiMajor = async (lectureId) => {
  try {
    const payload = { lectureId };
    const response = await apiClient.post('/api/users/removeMultiMajorLectures', payload);
    return response.data;
  } catch (error) {
    console.error('Remove Multi-Major API error:', error.response || error);
    throw error;
  }
};

// --- 4. 게시판(Community) API ---

// 게시글 목록 조회 (GET /api/posts)
export const getPosts = async (type) => {
  try {
    // type: 'notice' 또는 'qna'
    const response = await apiClient.get('/api/posts', { params: { type } });
    return response.data;
  } catch (error) {
    console.error('Get Posts API error:', error.response || error);
    throw error;
  }
};

// 게시글 작성 (POST /api/posts)
export const createPost = async (postData) => {
  try {
    // postData: { title, content, type }
    const response = await apiClient.post('/api/posts', postData);
    return response.data;
  } catch (error) {
    console.error('Create Post API error:', error.response || error);
    throw error;
  }
};

// 게시글 삭제 (DELETE /api/posts/:postId)
// 게시글 수정
export const updatePost = async (postId, postData) => {
  try {
    const response = await apiClient.put(`/api/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await apiClient.delete(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Delete Post API error:', error.response || error);
    throw error;
  }
};

// [추가] 댓글 작성 API
export const addComment = (postId, data) => apiClient.post(`/api/posts/${postId}/comments`, data).then(res => res.data);
export const deleteComment = (postId, commentId) =>
  apiClient.delete(`/api/posts/${postId}/comments/${commentId}`).then(res => res.data);

// [추가] 회원 탈퇴 API
export const withdrawUser = () => apiClient.delete('/api/users/withdraw').then(res => res.data);