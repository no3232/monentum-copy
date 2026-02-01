# Moment - Beautiful New Tab with Google Tasks

Unsplash 배경 이미지, 실시간 시계, Google Tasks 연동 기능을 갖춘 우아한 "New Tab" 대시보드입니다.

## 주요 기능

- 🖼️ **Unsplash 배경**: 고품질 자연 풍경 이미지를 매번 랜덤으로 표시
- ⏰ **실시간 시계**: 큰 폰트로 현재 시간과 날짜 표시
- ✅ **Google Tasks 연동**: 할 일 목록 관리 (추가, 완료, 삭제)
- 🎨 **Glassmorphism UI**: 반투명 블러 효과로 세련된 인터페이스

## 시작하기

### 1. 프로젝트 클론 및 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 API 키를 설정하세요:

```bash
cp .env.example .env
```

#### 필요한 API 키

1. **Google OAuth 2.0 Client ID & API Key**
   - [Google Cloud Console](https://console.cloud.google.com/apis/credentials)에서 생성
   - Tasks API 활성화 필요
   - 승인된 JavaScript 원본에 `http://localhost:5173` 추가

2. **Unsplash Access Key**
   - [Unsplash Developers](https://unsplash.com/developers)에서 생성

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## Chrome 확장프로그램으로 사용하기

### 1. 빌드

```bash
npm run build
```

### 2. Chrome 확장프로그램 로드

1. Chrome에서 `chrome://extensions` 열기
2. "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `dist` 폴더 선택

### 3. 확장프로그램용 OAuth 설정

Chrome 확장프로그램은 웹 앱과 다른 OAuth 클라이언트가 필요합니다:

1. Google Cloud Console에서 **Chrome 앱** 유형으로 새 OAuth 클라이언트 ID 생성
2. `manifest.json`의 `oauth2.client_id` 업데이트
3. 확장프로그램 ID를 OAuth 설정에 추가

## 프로젝트 구조

```
moment/
├── src/
│   ├── components/
│   │   ├── Background.tsx      # Unsplash 배경
│   │   ├── Clock.tsx           # 실시간 시계
│   │   ├── Tasks.tsx           # Google Tasks 목록
│   │   └── TaskItem.tsx        # 개별 태스크
│   ├── hooks/
│   │   ├── useGoogleAuth.ts    # Google OAuth 훅
│   │   ├── useGoogleTasks.ts   # Tasks CRUD 훅
│   │   └── useUnsplash.ts      # Unsplash API 훅
│   ├── lib/
│   │   └── googleApi.ts        # Google API 초기화
│   └── types/
│       └── index.ts            # TypeScript 타입 정의
├── manifest.json               # Chrome 확장프로그램 매니페스트
└── .env.example                # 환경 변수 예시
```

## 사용 기술

- **React 19** + **TypeScript**
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Google Tasks API** - 태스크 관리
- **Unsplash API** - 배경 이미지
- **Lucide React** - 아이콘

## 라이선스

MIT
