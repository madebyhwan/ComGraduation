# ComGraduation

경북대학교 I&T 융합 프로젝트로 진행한 졸업 요건 확인 웹사이트입니다. 프론트엔드는 React, 백엔드는 Node.js/Express, 데이터베이스는 MongoDB를 사용하는 MERN 스택을 기반으로 진행하였습니다.

## 1. 프로젝트 개요
- 목적: 학생이 본인의 이수 내역으로 졸업 요건 충족 여부를 확인할 수 있는 서비스 제공
- 배경: 학과/연도별로 상이한 졸업 규정을 수기로 확인해야 하는 불편 해소
- 목표: 입력된 수강 이력에 대해 자동 판정 및 부족 항목 가이드 제공

## 2. 시스템 구성 및 기술 스택
- Frontend: React (Create React App) – `client/`
- Backend: Node.js + Express – `server/`
- Database: MongoDB (Mongoose)

## 3. 2025-10 SPA 전환 메모
초기 버전은 `client/src/login`, `main`, `signup` 폴더에 개별 HTML/JS 파일을 두는 MPA 형태였습니다. 이번 리팩토링에서 다음 내용을 적용했습니다.

### 변경 사항
- react-router-dom 도입하여 `/`(로그인), `/signup`(회원가입), `/app`(메인) 라우트 구성
- 기존 정적 HTML/JS 제거 후 React 컴포넌트 `pages/` 디렉터리로 이관
- JWT 기반 인증(백엔드 `/api/users/login` 연동): 로그인 성공 시 `authToken` + 디코드 payload `authUser` 저장, 만료 시 보호 라우트 자동 로그아웃
- 회원가입 폼을 `/api/users/register` 엔드포인트와 연동 (필드: userId, userPassword, userYear, username, userDepartment, userTrack)
- 메인 페이지 내 4개 섹션(Home/내 정보/나의 수강 내역/졸업 자가 진단) 탭 전환을 React state로 관리
- 사용자 기본 표시 정보는 JWT payload (userId, username) 사용

### 폴더 구조 (요약)
```
client/src/
	pages/
		Login.jsx / Login.css
		Signup.jsx / Signup.css
		Main.jsx / Main.css
	components/
		ProtectedRoute.jsx
```

### 실행 방법
1. 의존성 설치: `cd client && npm install`
2. 개발 서버 실행: `npm start`
3. 브라우저: http://localhost:3000

### API 요약
| 목적 | 메서드 | 경로 | 요청 바디 예시 | 성공 응답 예시 |
|------|--------|------|----------------|----------------|
| 회원가입 | POST | /api/users/register | `{ "userId":"test1","userPassword":"pw1234","userYear":"21학번","username":"홍길동","userDepartment":"글로벌SW융합전공","userTrack":"다중전공" }` | `{ message: "회원가입이 완료되었습니다.", user: { ... }}` |
| 로그인 | POST | /api/users/login | `{ "userId":"test1","userPassword":"pw1234" }` | `{ message: "안녕하세요! 홍길동님!", token: "<JWT>" }` |

JWT payload 예시: `{ "id":"<mongoId>", "username":"홍길동", "userId":"test1", "iat":..., "exp":... }`

### 필드 매핑 표
| 프론트 상태 | 백엔드 필드 | 설명 |
|-------------|-------------|------|
| userId | userId | 로그인용 ID (unique) |
| userPassword | userPassword | Bcrypt 해시 저장 |
| userYear | userYear | 현재 enum: 21학번 |
| username | username | 사용자 표시 이름 |
| userDepartment | userDepartment | enum: 글로벌SW융합전공, 심화컴퓨터공학전공 |
| userTrack | userTrack | enum: 심컴, 다중전공, 해외복수학위, 학석사연계 |

### 임시 더미 계정 제거
기존 더미 로그인 로직은 제거되었으며 반드시 백엔드 서버(포트 5000)가 실행 중이어야 합니다.

### 추후 권장 개선
- (진행 예정) 사용자 추가 정보 수정 API(PATCH /api/users/me) 구현 및 Main 페이지 저장 버튼 연동
- 전역 상태관리 도입 (React Query / Zustand / Redux 중 택1)으로 사용자/강의 데이터 캐싱
- Form 유효성 고도화 (react-hook-form + Zod)
- 졸업 진단 로직 모듈화 및 테스트 코드 추가
- 접근성(ARIA) 및 i18n 다국어 구조 반영
