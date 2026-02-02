# Moment - Beautiful New Tab with Google Tasks

Unsplash 배경 이미지, 실시간 시계, Google Tasks 연동 기능을 갖춘 우아한 "New Tab" 대시보드입니다.

## 주요 기능

- 🖼️ **Unsplash 배경**: 고품질 자연 풍경 이미지를 매번 랜덤으로 표시
- ⏰ **실시간 시계**: 큰 폰트로 현재 시간과 날짜 표시
- ✅ **Google Tasks 연동**: 할 일 목록 관리 (추가, 완료, 삭제)

## 🚀 로컬 개발 환경 설정

### 🌟 빠른 시작 (추천)

**인터랙티브 설정 마법사**를 사용하면 모든 설정 과정을 단계별로 안내받을 수 있습니다:

```bash
git clone <repo-url>
cd moment
npm install
npm run setup
```

설정 마법사가 다음을 도와줍니다:

- ✅ Google Cloud Console 프로젝트 및 API 설정
- ✅ Unsplash API 키 발급
- ✅ 환경변수 파일 자동 생성
- ✅ 프로젝트 빌드
- ✅ Chrome 확장프로그램 등록
- ✅ OAuth 클라이언트 최종 설정

---

### 📖 수동 설정 가이드

인터랙티브 설정 대신 직접 설정하고 싶다면 아래 가이드를 따르세요.

#### 사전 준비

- Node.js 18+
- Chrome 브라우저
- Google 계정
- Unsplash 계정

---

#### Step 1: 저장소 클론 및 의존성 설치

```bash
git clone <repo-url>
cd moment
npm install
```

---

#### Step 2: Google Cloud Console 설정

##### 2.1 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 상단 프로젝트 선택 → "새 프로젝트" 클릭
3. 프로젝트 이름 입력 (예: "Moment Extension") → "만들기"

##### 2.2 Google Tasks API 활성화

1. 좌측 메뉴 "API 및 서비스" → "라이브러리"
2. 검색창에 "Google Tasks API" 입력
3. "Google Tasks API" 선택 → "사용" 클릭

##### 2.3 OAuth 동의 화면 설정

1. "API 및 서비스" → "OAuth 동의 화면"
2. User Type: **외부** 선택 → "만들기"
3. 앱 정보 입력:
   - 앱 이름: Moment
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처 이메일: 본인 이메일
4. "저장 후 계속"
5. 범위 추가 → "범위 추가 또는 삭제"
   - `https://www.googleapis.com/auth/tasks` 선택
6. "저장 후 계속"
7. 테스트 사용자 → "ADD USERS" → 본인 Gmail 추가
8. "저장 후 계속" → "대시보드로 돌아가기"

##### 2.4 OAuth 클라이언트 ID 생성

1. "API 및 서비스" → "사용자 인증 정보"
2. "사용자 인증 정보 만들기" → "OAuth 클라이언트 ID"
3. 애플리케이션 유형: **Chrome 앱** 선택
4. 이름: "Moment Extension"
5. 애플리케이션 ID: **Step 5에서 확인 후 입력** (아래 참조)
6. 우선 "만들기" 클릭 → 클라이언트 ID 복사해두기

⚠️ **중요**: 반드시 "Chrome 앱" 타입을 선택해야 합니다. "웹 애플리케이션"으로 만들면 토큰 자동 갱신이 작동하지 않습니다.

---

#### Step 3: Unsplash API 설정

1. [Unsplash Developers](https://unsplash.com/developers) 접속 및 로그인
2. "Your apps" → "New Application" 클릭
3. 약관 동의 후 앱 정보 입력
   - Application name: Moment
   - Description: New tab extension with Unsplash backgrounds
4. "Create application"
5. **Access Key** 복사

---

#### Step 4: 설정 파일 편집

##### 4.1 manifest.json에 Client ID 추가

`manifest.json` 파일을 열고 `oauth2.client_id` 값을 수정합니다:

```json
"oauth2": {
  "client_id": "복사한_구글_클라이언트_ID.apps.googleusercontent.com",
  "scopes": [...]
}
```

##### 4.2 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일 편집:

```bash
VITE_UNSPLASH_ACCESS_KEY=복사한_Unsplash_Access_Key
```

---

#### Step 5: 확장프로그램 빌드 및 ID 확인

```bash
npm run build
```

1. Chrome 브라우저에서 `chrome://extensions` 접속
2. 우측 상단 **개발자 모드** 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `extension` 폴더 선택
5. 로드된 확장프로그램의 **ID** 확인 (예: `abcdefghijklmnop...`)

⚠️ **중요**: 이 ID를 Google Cloud Console OAuth 클라이언트 설정에 등록해야 함!

---

#### Step 6: OAuth 클라이언트에 애플리케이션 ID 등록

1. Google Cloud Console → "사용자 인증 정보"
2. Step 2.4에서 생성한 OAuth 클라이언트 ID 클릭
3. **"애플리케이션 ID"** 필드에 Step 5에서 확인한 확장프로그램 ID 입력
4. "저장"

💡 **참고**: Chrome Identity API(`getAuthToken`)를 사용하므로 리디렉션 URI 설정은 필요 없습니다. Chrome이 토큰 갱신을 자동으로 처리합니다.

---

#### Step 7: 테스트

1. Chrome에서 새 탭 열기
2. Google 로그인 버튼 클릭
3. Tasks 연동 확인
4. Unsplash 배경 이미지 로드 확인

#### 개발 모드 실행

```bash
npm run dev
```

(빌드 후 chrome://extensions에서 새로고침하여 변경사항 적용)

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
