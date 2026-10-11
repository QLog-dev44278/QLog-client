<div align="center">

# ✦ QLog

**AI에게 답을 받는 대신, 내가 직접 답을 만들어가는 학습 서비스**

질문을 저장하고 → 직접 공부하고 → 내 말로 답하고 → AI에게 검증받고 → 지식으로 연결합니다.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)

</div>

---

## 소개

궁금한 게 생기면 GPT에 물어보고, 답을 읽고, 금방 잊어버립니다.
QLog는 AI가 정답을 대신 알려주지 않습니다. **AI는 정답 제공자가 아니라 학습 코치**입니다.

```
질문 → 탐구 → 답변 → 검증 → 보완 → 정리 → 연결 → 새로운 질문
```

이 저장소는 QLog의 **프론트엔드(웹 클라이언트)** 입니다.

## 주요 화면

| 화면 | 경로 | 설명 |
|---|---|---|
| 로그인 · 회원가입 · 비밀번호 찾기 | `/login` `/signup` `/forgot-password` | 이메일 / Google 계정으로 시작 |
| 홈 | `/` | 질문 등록, 다시 꺼내볼 질문 |
| 질문함 | `/questions` | 상태·분야별 필터, 검색, 정렬 |
| 질문 상세 | `/questions/:id` | 내 답변 작성, AI 평가, 꼬리질문, 학습 히스토리 |
| 답변 버전 비교 | `/questions/:id/compare` | 1차·2차 답변과 피드백 비교 |
| 지식 그래프 | `/graph` | 질문을 별자리처럼 연결해 이해 상태를 한눈에 |
| 정리 노트 | `/notes` | 내가 쓴 답을 기반으로 만든 최종 노트 |
| 내 정보 · 설정 | `/settings` | 프로필, 학습 설정 |

## 시작하기

**요구 사항**: Node.js 20 이상

```bash
npm install
npm run dev
```

브라우저에서 <http://localhost:5173> 을 엽니다.

### 스크립트

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 실행 (HMR) |
| `npm run build` | 타입 체크 후 프로덕션 빌드 (`dist/`) |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | Oxlint 실행 |

## 기술 스택

- **React 19 + TypeScript**: UI
- **Vite**: 개발 서버와 빌드
- **React Router 7**: 라우팅
- **CSS Modules + CSS 변수**: 스타일링. Figma 변수를 그대로 토큰으로 옮겨 사용합니다.

## 프로젝트 구조

```
src/
├── assets/figma/     # Figma에서 내려받은 SVG (배경, 아이콘)
├── components/       # 공통 컴포넌트 (Header, Button, Chip, StatusBadge …)
├── pages/            # 화면 단위 컴포넌트
├── styles/
│   ├── tokens.css      # 색상 · 간격 · 반경 · 그림자 토큰
│   └── typography.css  # 텍스트 스타일 (heading-24, body-14 …)
├── App.tsx           # 라우트 정의
└── main.tsx          # 진입점
```

## 디자인 시스템

디자인은 Figma `Design` 페이지를 기준으로 합니다. 밤하늘과 별을 모티브로, 이해한 질문이 별처럼 빛나는 다크 테마입니다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--bg-base` | `#0c1124` | 기본 배경 |
| `--bg-elevated` | `#1d2543` | 카드, 패널 |
| `--text-primary` | `#eaecf6` | 본문 |
| `--accent-star` | `#f6c85f` | 주요 버튼, 이해 완료 |
| `--accent-violet` | `#a3abf5` | 링크, 추천 개념 |
| `--accent-coral` | `#e58a6f` | 보완 필요, 경고 |

색을 직접 쓰지 말고 `src/styles/tokens.css`의 변수를 사용해 주세요.

## 브랜치 · 커밋 규칙

- 브랜치: `feat/<내용>`, `fix/<내용>` (예: `feat/notes`, `fix/header-overlap`)
- 커밋 메시지: `feat: …`, `fix: …`, `docs: …`, `refactor: …`, `chore: …`
