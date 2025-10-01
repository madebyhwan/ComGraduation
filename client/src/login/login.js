// DOM 요소들을 가져옵니다.
const loginForm = document.getElementById('loginForm');
// [수정] studentIdInput -> userIdInput
const userIdInput = document.getElementById('userId');
const userPasswordInput = document.getElementById('userPassword');

// '로그인' 버튼 클릭 시 실행될 함수를 연결합니다.
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // [수정] studentId -> userId
    const userId = userIdInput.value;
    const userPassword = userPasswordInput.value;

    if (!userId) {
        // [수정] 메시지 변경
        alert('아이디를 입력해주세요.');
        return;
    }
    if (!password) {
        alert('비밀번호를 입력해주세요.');
        return;
    }
    
    console.log('로그인 시도 정보');
    // [수정] '학번' -> '아이디'
    console.log('아이디:', userId);
    console.log('비밀번호:', userPassword);
    
    // 로그인 성공/실패 로직 (id: user, pw: 1234)
    if (userId === 'user' && userPassword === '1234') {
        localStorage.setItem('userId', '홍길동');
        window.location.href = '../main/main.html';
    } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
});

// '회원가입' 버튼 클릭 이벤트 처리
const signupButton = document.querySelector('.btn-signup');
signupButton.addEventListener('click', function() {
    window.location.href = '../signup/signup.html';
});