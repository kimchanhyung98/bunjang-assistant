# 번개장터 어시스턴트

번개장터 운영을 보조하는 AI 에이전트

- `bunjang-cli`: 검색, 조회, 채팅, 관심상품, 구매 가능 여부 확인 같은 작업을 수행
- `bunjang-sales`: 상품 폴더와 브라우저 자동화로 판매글 초안을 작성

## 프로젝트 구조

```text
.agents/skills/
  bunjang-cli/
  bunjang-sales/

.claude/skills/
  bunjang-cli/
  bunjang-sales/
  
products/
  ai-context.md          # 판매글 작성 AI 작업 지침
  template.md            # 판매글 기본값과 형식
  {product-name}/
    image.jpg            # 사용자가 추가한 상품 사진
    official-01.jpg      # 선택: 대표 이미지 후보
    note.md              # 선택: 상품명, 사이즈, 하자, 구성품, 희망 가격
  
src/
  config.js   # capability 목록, allow/deny 정책, 런타임 설정
  cli.js      # bunjang-cli argument builder, 실행 래퍼, 로그인 preflight
  index.js    # npm run bunjang 진입점

test/
  bunjang-cli.test.js
```

## bunjang-cli

CLI 래퍼는 임의의 `bunjang-cli` 명령을 직접 실행하지 않고, `src/config.js`에 등록된 capability만 실행합니다.

`paramsJson`은 생략할 수 있고, 전달하면 JSON 객체여야 합니다. 형식이 잘못되면 `Invalid paramsJson:` 오류로 중단합니다.

```bash
npm install
npm run bunjang -- <capabilityId> '<paramsJson>'
```

예시:

```bash
npm run bunjang -- auth.status
npm run bunjang -- search.listings '{"query":"아이폰","maxItems":5}'
npm run bunjang -- item.get '{"listingId":"123456"}'
npm run bunjang -- chat.send '{"threadId":"thread-1","message":"답변입니다."}'
```

### capability

다음 작업은 로그인 없이 실행합니다.

- `search.listings`
- `agent-search-rank`
- `item.get`
- `item.list`
- `auth.status`
- `auth.logout`

다음 작업은 실행 전 `auth.status`로 로그인 상태를 확인합니다.

- `chat.list`
- `chat.read`
- `chat.start`
- `chat.send`
- `favorite.list`
- `favorite.add`
- `favorite.remove`
- `purchase.prepare`

다음 작업은 수동 전용입니다.

- `auth.login`
- `purchase.start`
- `purchase.confirm`
- `account.settings.update`

## bunjang-sales

상품 사진과 템플릿을 읽고, 연결된 브라우저에서 번개장터 판매글 초안을 입력합니다.

기본 흐름:

1. `products/{product-name}/`에 상품 사진을 넣습니다.
2. 필요하면 `note.md`에 상품명, 사이즈, 하자, 구성품, 희망 가격을 적습니다.
3. 에이전트에서 `bunjang-sales` 또는 `bunjang-sales <product-dir>`를 실행합니다.
4. 브라우저 로그인은 사용자가 직접 완료합니다.
5. 스킬이 상품 분석, 시세 조사, 이미지 준비, 판매글 초안 입력을 진행합니다.
6. 사용자가 초안과 이미지를 확인한 뒤 직접 등록합니다.
