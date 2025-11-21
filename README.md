# 🎓 ComGraduation

> **경북대학교 컴퓨터학부 학생을 위한 졸업 요건 자동 진단 시스템**
> 
> 경북대학교 I&T 융합 프로젝트로 진행한 졸업 요건 확인 웹사이트입니다.
복잡한 트랙별 졸업 요건을 한눈에 확인하고, 부족한 학점을 쉽게 파악할 수 있는 웹 서비스

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)](https://github.com/madebyhwan/ComGraduation)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)

## 🎯 프로젝트 소개<img width="1408" height="768" alt="Gemini_Generated_Image_jcef2kjcef2kjcef" src="https://github.com/user-attachments/assets/c28aef3f-2471-4874-9d1d-f1b80f292637" />


### 배경 및 목적

경북대학교 컴퓨터학부는 각 학번/트랙마다 서로 다른 졸업 요건을 가지고 있습니다.

**문제점:**
- 📚 트랙별로 다른 졸업 요건 (총 학점, 전공 학점, 교양 학점, 창업 과목, 해외 학점 등)
- ⏱️ 수기로 학점을 계산하고 졸업 요건을 확인해야 하는 번거로움
- ❓ 부족한 학점이 무엇인지 파악하기 어려움

**해결 방안:**  
수강 과목을 입력하면 **자동으로 졸업 요건을 진단**하고, **부족한 항목을 명확히 안내**합니다

<br/>

## ✨ 주요 기능

### 1. 회원가입 및 로그인
- JWT 기반 인증 시스템
- 학번, 학과, 트랙 정보 등록

### 2. 수강 과목 관리
- 강의계획서 검색 (과목명, 과목코드, 교수명)
- 과목 추가/삭제
- 커스텀 과목 직접 입력
- 다중전공 과목 구분 관리

### 3. 졸업 요건 자동 진단

**공통 요건(21학번 기준):**
- 총 이수 학점 (130학점)
- 전공 학점 (51학점)
- 교양 학점 (24~42학점)
- 전공 필수 과목 이수
- 영어 성적 (TOEIC, TOEFL, TEPS, OPIC 등)
- 지도교수 상담 (8회 이상)
- TOPCIT 또는 졸업 인터뷰

**다중전공 트랙 추가 요건:**
- 다중전공 54학점 또는 부전공 21학점
- 창업 과목 9학점 (창업 미이수 시 15학점)
- 해외 학점 9학점
- 현장실습 3학점

### 4. 내 정보 관리
- 개인정보 조회 및 수정
- 영어 성적, 상담 횟수, 창업 여부 등 업데이트

### 5. 학점 통계
- 전공/교양/일반선택 학점 요약
- 학기별 수강 내역
- 졸업 요건별 충족 현황 (✅/❌)

<br/>

## 🛠️ 기술 스택

**Frontend:** React, React Router, Axios  
**Backend:** Node.js, Express, JWT  
**Database:** MongoDB, Mongoose  
**인증:** JWT 토큰, bcrypt 암호화

<br/>

## 📖 사용 방법

1. **회원가입**: 학번, 학과, 트랙 정보 입력
2. **로그인**: 아이디/비밀번호 입력
3. **수강 과목 추가**: 
   - "나의 수강 및 활동 내역" 탭 → 강의 검색 → 과목 추가
   - 커스텀 과목은 직접 입력 가능
4. **다중전공 설정** (다중전공 트랙): 
   - 다중전공 과목 선택 → "다중전공으로 이동" 클릭
5. **내 정보 업데이트**: 
   - "내 정보" 탭 → 영어 성적, 상담 횟수 등 입력
6. **졸업 요건 확인**: 
   - "졸업 자가 진단" 탭 → 자동 계산된 충족 현황 확인

<br/>

## 📂 프로젝트 구조

```
ComGraduation/
├── client/                # React 프론트엔드
│   ├── src/
│   │   ├── api/          # API 통신
│   │   ├── components/   # 재사용 컴포넌트
│   │   ├── pages/        # 페이지 (Login, Signup, Main)
│   │   └── img/          # 이미지
│   └── package.json
│
├── server/               # Express 백엔드
│   ├── config/          # 졸업 요건 규칙, DB 설정
│   ├── controllers/     # 비즈니스 로직
│   ├── middleware/      # JWT 인증
│   ├── models/          # MongoDB 스키마
│   ├── routes/          # API 라우트
│   ├── services/        # 졸업 요건 계산
│   └── server.js
│
└── README.md
```

<br/>

##  개발

**경북대학교 컴퓨터학부**  
I&T 융합 프로젝트
