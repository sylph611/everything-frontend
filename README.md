# Everything Frontend

백엔드 Spring Boot 애플리케이션과 연동되는 React TypeScript 프론트엔드입니다.

## 기능

- JWT 기반 인증 시스템
- 로그인/회원가입
- 보호된 라우트
- 사용자 대시보드
- OAuth2 지원 (향후 구현 예정)

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 빌드
npm run build

# 테스트 실행
npm test
```

## API 연동

백엔드 서버가 `http://localhost:8080`에서 실행되어야 합니다.

### 주요 API 엔드포인트

- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `GET /api/user/me` - 현재 사용자 정보
- `GET /api/user/profile` - 사용자 프로필

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── ProtectedRoute.tsx
├── context/            # React Context
│   └── AuthContext.tsx
├── services/           # API 서비스
│   ├── api.ts
│   └── authService.ts
├── types/              # TypeScript 타입 정의
│   └── auth.ts
└── App.tsx
```

## 환경 설정

백엔드 API URL을 변경하려면 `src/services/api.ts`에서 `API_BASE_URL`을 수정하세요.

## 사용법

1. 백엔드 서버 실행 (`http://localhost:8080`)
2. 프론트엔드 서버 실행 (`npm start`)
3. 브라우저에서 `http://localhost:3000` 접속
4. 회원가입 또는 로그인 후 대시보드 이용

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).# everything-frontend
