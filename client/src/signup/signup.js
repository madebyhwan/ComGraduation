/**
 * 옵션 버튼 그룹의 선택 동작을 처리하는 함수
 * @param {string} containerId - 버튼 그룹을 감싸는 요소의 ID
 * @param {boolean} isMultiSelect - 다중 선택 허용 여부 (true/false)
 */
function setupOptionSelection(containerId, isMultiSelect = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.addEventListener('click', function(e) {
        // 클릭된 요소가 버튼일 경우에만 동작
        if (e.target.classList.contains('option-btn')) {
            if (isMultiSelect) {
                // 다중 선택: 클릭된 버튼의 'selected' 클래스를 껐다 켰다(토글) 함
                e.target.classList.toggle('selected');
            } else {
                // 단일 선택: 모든 버튼의 'selected'를 지우고, 클릭된 버튼에만 추가
                container.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
                e.target.classList.add('selected');
            }
        }
    });
}

// 전공과 졸업트랙은 단일 선택으로 설정
setupOptionSelection('userDepartment', false);
setupOptionSelection('userTrack', false);

// 회원가입 폼 제출 이벤트 처리
const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', function(event) {
    event.preventDefault(); // 폼의 기본 제출(새로고침) 동작 방지

    // 입력 필드 값 ID로 가져오기
    const username = document.getElementById('username').value;
    const userId = document.getElementById('userId').value;
    const userPassword = document.getElementById('userPassword').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const userYear = document.getElementById('userYear').value;

    // 선택된 전공, 졸업트랙 가져오기
    const selectedMajorElement = document.querySelector('#userDepartment .option-btn.selected'); // 선택된 버튼 값 가져오기
    const userDepartment = selectedMajorElement ? selectedMajorElement.textContent : ''; // 값이 있는 경우 문자열 저장, 없으면 빈 문자열
    const selectedTrackElement = document.querySelector('#userTrack .option-btn.selected');
    const userTrack = selectedTrackElement ? selectedTrackElement.textContent : '';

    // 전공, 졸업트랙 선택 여부 확인
    if (!userDepartment) {
        alert('전공을 선택해주세요.');
        return; // 함수 종료
    }
    if (!userTrack) {
        alert('졸업트랙을 선택해주세요.');
        return; // 함수 종료
    }

    // 비밀번호 일치 검사
    // !== 연산자는 데이터타입까지 엄격하게 비교(?)
    if (userPassword !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return; // 함수 종료
    }

    // 모든 정보를 객체로 묶기
    const formData = {
        username,
        userId,
        userPassword,
        userYear,
        userDepartment,
        userTrack
    };

    // 결과 확인
    console.log('회원가입 정보:', formData);
    alert(`${username}님, 회원가입이 완료되었습니다!`);
});