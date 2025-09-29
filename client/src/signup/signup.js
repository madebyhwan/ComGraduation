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

// '전공'은 단일 선택으로 설정
setupOptionSelection('majorOptions', false);
// [수정] '졸업트랙'도 단일 선택(false)으로 변경
setupOptionSelection('trackOptions', false);


// 회원가입 폼 제출 이벤트 처리
const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', function(event) {
    event.preventDefault(); // 폼의 기본 제출(새로고침) 동작 방지

    // 1. 입력 필드 값 가져오기
    const name = document.getElementById('name').value;
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const studentYear = document.getElementById('studentYear').value;

    // 2. 선택된 '전공' 가져오기
    const selectedMajorElement = document.querySelector('#majorOptions .option-btn.selected');
    const major = selectedMajorElement ? selectedMajorElement.textContent : '';

    // 3. [수정] 선택된 '졸업트랙' 가져오기 (단일 선택 방식)
    const selectedTrackElement = document.querySelector('#trackOptions .option-btn.selected');
    const track = selectedTrackElement ? selectedTrackElement.textContent : '';

    // 4. 유효성 검사
    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return; // 함수 종료
    }

    // [추가] 전공 선택 여부 확인
    if (!major) {
        alert('전공을 선택해주세요.');
        return; // 함수 종료
    }
    
    // [추가] 졸업트랙 선택 여부 확인
    if (!track) {
        alert('졸업트랙을 선택해주세요.');
        return; // 함수 종료
    }

    // 5. 모든 정보를 객체로 묶기
    const formData = {
        name,
        username,
        password,
        studentYear,
        major,
        track: track // [수정] tracks 배열 대신 track 단일 값으로 저장
    };

    // 6. 결과 확인
    console.log('회원가입 정보:', formData);
    alert(`${name}님, 회원가입이 완료되었습니다!`);
});