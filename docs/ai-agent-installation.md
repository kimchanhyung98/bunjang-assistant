# AI 에이전트 설치

기본 경로는 호스트 에이전트의 plugin install입니다. Node 설치기는 CLI 래퍼 준비나 dry-run 검증에만 보조로 사용합니다.

## Claude Code

채팅창에 아래 두 줄을 입력합니다.

```text
/plugin marketplace add kimchanhyung98/bunjang-assistant
/plugin install bunjang-assistant@bunjang-assistant
```

## Codex

```bash
codex plugin marketplace add kimchanhyung98/bunjang-assistant --ref main
```

이후 Codex의 Plugins UI에서 `bunjang-assistant`를 추가합니다.

## 로컬 클론 검증

```bash
npm install
npm test
```

## 보조 설치 진입점

```bash
node install/bunjang-assistant-install.mjs --tool cli
node install/bunjang-assistant-install.mjs --tool codex --dry-run
node install/bunjang-assistant-install.mjs --tool claude --dry-run
node install/bunjang-assistant-install.mjs --tool both --dry-run
```

`--tool cli` 또는 `--install-cli`가 CLI 래퍼 의존성을 설치합니다. plugin install 흐름을 모사 검증할 때는 `--dry-run`을 함께 사용합니다.

## 설치 범위

- `--scope user`: 사용자 도구 설정에 스킬과 플러그인을 설치합니다.
- `--scope project`: 현재 프로젝트 탐색 경로에 스킬을 설치합니다.
- `--scope local`: 프로젝트 스킬 설치와 같은 의미입니다.

## 지원하지 않는 범위

Cursor, Claude Desktop MCP, Windows, Linux 설치기는 제공하지 않습니다.
