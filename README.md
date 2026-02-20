# dooscoop-web

Next.js + TypeScript + pnpm 프로젝트

## 기술 스택

- **Next.js** 14.2.35
- **TypeScript** 5.9.3
- **React** 18.3.1
- **Tailwind CSS** 3.4.19
- **pnpm** (패키지 매니저)

## 시작하기

### 의존성 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

```bash
pnpm build
```

### 프로덕션 서버 실행

```bash
pnpm start
```

## 프로젝트 구조

```
dooscoop/
├── src/
│   └── app/
│       ├── layout.tsx      # 루트 레이아웃
│       ├── page.tsx         # 홈 페이지
│       └── globals.css      # 전역 스타일
├── public/                  # 정적 파일
├── package.json
├── tsconfig.json            # TypeScript 설정
├── next.config.js           # Next.js 설정
├── tailwind.config.ts       # Tailwind CSS 설정
└── postcss.config.js        # PostCSS 설정
```
