// 페이지가 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    // [수정] localStorage에서 'displayName'을 가져옴
    const displayName = localStorage.getItem('displayName');
    if (displayName) {
        document.getElementById('username-display').textContent = displayName;
    }

    // 2. 로그아웃 버튼 기능
    const logoutButton = document.querySelector('.logout-btn');
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('username');
        window.location.href = '../login/login.html'; 
    });

    // 3. 네비게이션 메뉴 전환 기능 (기존과 동일)
    setupNavigation();
    
    // 4. [추가] '내 정보' 페이지 상호작용 기능 설정
    setupInfoPageInteractions();
});

// 네비게이션 메뉴 전환 기능을 함수로 분리
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentBoxes = document.querySelectorAll('.content-box');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target;
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            contentBoxes.forEach(box => box.classList.add('hidden'));
            document.getElementById(targetId).classList.remove('hidden');
        });
    });
}

// [추가] '내 정보' 페이지의 모든 상호작용을 처리하는 함수
function setupInfoPageInteractions() {
    // '전공' 태그 그룹 (하나만 선택 가능)
    const majorTags = document.getElementById('major-tags');
    if (majorTags) {
        majorTags.addEventListener('click', function(e) {
            if (e.target.classList.contains('tag-btn')) {
                // 모든 버튼의 selected 클래스 제거
                majorTags.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('selected'));
                // 클릭된 버튼에만 selected 클래스 추가
                e.target.classList.add('selected');
            }
        });
    }

    // '졸업 트랙' 태그 그룹 (여러 개 선택 가능)
    const trackTags = document.getElementById('track-tags');
    if (trackTags) {
        trackTags.addEventListener('click', function(e) {
            if (e.target.classList.contains('tag-btn')) {
                // 클릭된 버튼의 selected 클래스를 토글(on/off)
                e.target.classList.toggle('selected');
            }
        });
    }

  // '내 정보 저장' 버튼 기능
    const saveButton = document.getElementById('save-info-btn');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            // 1. input 필드에서 값 가져오기
            const name = document.getElementById('info-name').value;
            // [수정] studentId -> userId
            const username = document.getElementById('info-userId').value;
            const password = document.getElementById('info-password').value;
            const counsel = document.getElementById('info-counsel').value;

            // ... (선택된 '전공', '졸업 트랙' 가져오는 코드는 동일) ...
            
            // 4. 취합된 정보 객체로 만들기
            const userInfo = {
                name,
                // [수정] studentId -> userId
                username: username,
                password,
                major: selectedMajor,
                tracks: selectedTracks,
                counsel,
            };

            // 5. 결과 확인 (콘솔 출력 및 알림)
            console.log('저장된 정보:', userInfo);
            alert('정보가 성공적으로 저장되었습니다!');
        });
    }
}