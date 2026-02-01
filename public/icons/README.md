# 아이콘 파일 안내

Chrome 확장프로그램을 위해 다음 크기의 PNG 아이콘이 필요합니다:

- `icon16.png` - 16x16px
- `icon48.png` - 48x48px
- `icon128.png` - 128x128px

## 아이콘 생성 방법

### 옵션 1: 온라인 도구 사용
1. [Favicon.io](https://favicon.io/) 또는 [RealFaviconGenerator](https://realfavicongenerator.net/) 방문
2. 텍스트나 이미지로 아이콘 생성
3. 생성된 PNG 파일을 이 폴더에 저장

### 옵션 2: 디자인 도구 사용
- Figma, Canva, Photoshop 등에서 직접 디자인
- 각 크기별로 내보내기

### 옵션 3: 임시 아이콘 생성 (개발용)
아래 스크립트를 사용하여 간단한 색상 아이콘 생성:

```bash
# ImageMagick 설치 필요 (brew install imagemagick)
convert -size 16x16 xc:#4F46E5 icon16.png
convert -size 48x48 xc:#4F46E5 icon48.png
convert -size 128x128 xc:#4F46E5 icon128.png
```

## 권장 디자인
- 시계나 체크리스트를 상징하는 아이콘
- 브랜드 컬러: #4F46E5 (보라색)
- 심플하고 명확한 디자인
