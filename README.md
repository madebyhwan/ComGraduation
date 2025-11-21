# 🎓 ComGraduation

<div align="center">
<img width="329" src="https://github.com/user-attachments/assets/c28aef3f-2471-4874-9d1d-f1b80f292637">

</div>

# 컴퓨터학부 졸업 요건 관리 웹사이트
> **경북대학교 컴퓨터학부 I&T 프로젝트** <br/> **개발기간: 2025.09 ~ 2025.11**

## 배포 주소

> **개발 버전** : [https://comgraduation.dev/](https://comgraduation.dev/) <br>
> **프론트 서버** : [~](~)<br>
> **백엔드 서버** : [~](~)<br>

## 웹개발팀 소개

|     김환     |     박찬진     |     송재표     |     장현호     |     홍준기     |
| :-----------: | :-----------: | :-----------: | :-----------: | :-----------: |
| BE | FE | BE | FE | BE |
| [@madebyhwan](https://github.com/madebyhwan) | [@jin2214](https://github.com/jin2214) | [@WOVY](https://github.com/WOVY) | [@chozenka](https://github.com/chozenka) | [@jungi0531](https://github.com/jungi0531) |
| 경북대학교 컴퓨터학부 3학년 | 경북대학교 컴퓨터학부 3학년 | 경북대학교 컴퓨터학부 3학년 | 경북대학교 컴퓨터학부 3학년 | 경북대학교 컴퓨터학부 3학년 |


## 프로젝트 소개

경북대학교 컴퓨터학부는 각 학번/트랙마다 서로 다른 졸업 요건을 가지고 있습니다.

**문제점:**
- 📚 트랙별로 다른 졸업 요건 (총 학점, 전공 학점, 교양 학점, 창업 과목, 해외 학점 등)
- ⏱️ 수기로 학점을 계산하고 졸업 요건을 확인해야 하는 번거로움
- ❓ 부족한 학점이 무엇인지 파악하기 어려움

**해결 방안:**  
수강 과목을 입력하면 **자동으로 졸업 요건을 진단**하고, **부족한 항목을 명확히 안내**합니다

## Stacks

### Environment
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)             

### Config
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)        

### Frontend
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

### Communication
![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white)

---
## 화면 구성
| 로그인 페이지  |  회원가입 페이지   |
| :-------------------------------------------: | :------------: |
|  <img width="329" src=""/> |  <img width="329" src=""/>|  
| 내 정보 페이지   |   수강 과목 페이지   |  
| <img width="329" src=""/>   |  <img width="329" src=""/>     |
| 자가진단 페이지   |   커뮤니티 페이지   |  
| <img width="329" src=""/>   |  <img width="329" src=""/>     |

---
## 주요 기능

### ⭐️ 수강 과목 관리
- 강의계획서 검색 및 과목 추가/삭제
- 커스텀 과목 직접 입력 (학점, 이수구분 설정)
- 다중전공 과목 구분 관리

### ⭐️ 졸업 요건 자동 진단
- 트랙별 학점 요건 체크 (총 학점, 전공, 교양)
- 전공 필수 과목 이수 여부 확인
- 영어 성적, 상담 횟수, TOPCIT 등 기타 요건 진단

### ⭐️ 커뮤니티
- 공지사항 & Q&A 게시판
- 댓글 작성 및 비공개 게시글 기능

---
## 디렉토리 구조
```bash
├── README.md
├── client/                     # 프론트엔드 (React)
│   ├── src/
│   │   ├── api/                # API 통신
│   │   ├── components/         # 재사용 컴포넌트
│   │   └── pages/              # 페이지
│   │       ├── Main.jsx        # 졸업 요건 진단
│   │       ├── Courses.jsx     # 수강 관리
│   │       ├── Community.jsx   # 커뮤니티
│   │       └── Profile.jsx     # 내 정보
│   └── package.json
│
└── server/                     # 백엔드 (Express + MongoDB)
    ├── config/                 # 설정 파일
    │   ├── graduationRules.js  # 졸업 요건 규칙
    │   └── dbConnect.js        # MongoDB 연결
    ├── controllers/            # 컨트롤러
    ├── models/                 # Mongoose 모델
    ├── routes/                 # API 라우트
    ├── services/
    │   └── graduationService.js # 졸업 요건 판정
    └── server.js
```
