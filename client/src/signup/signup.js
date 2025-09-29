// 옵션 버튼 그룹을 선택하는 함수
function handleOptionSelection(optionsContainerId) {
    const optionsBox = document.getElementById(optionsContainerId);
    if (!optionsBox) return;

    // optionsBox 안의 모든 버튼에 이벤트 리스너를 추가
    optionsBox.addEventListener('click', function(event) {
        // 클릭된 요소가 'option-btn' 클래스를 가진 버튼인지 확인
        if (event.target.classList.contains('option-btn')) {
            const clickedButton = event.target;

            // 1. 해당 그룹의 모든 버튼에서 'selected' 클래스를 제거
            const allButtons = optionsBox.querySelectorAll('.option-btn');
            allButtons.forEach(button => {
                button.classList.remove('selected');
            });

            // 2. 방금 클릭한 버튼에만 'selected' 클래스를 추가
            clickedButton.classList.add('selected');
        }
    });
}

// '전공'과 '졸업트랙' 그룹에 각각 함수를 실행
handleOptionSelection('majorOptions');
handleOptionSelection('trackOptions');

// 회원가입 폼 제출 이벤트 (기능 확장용 예시)
const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 제출 동작 방지
    alert('회원가입 폼이 제출되었습니다 (기능 테스트).');
});