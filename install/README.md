# 설치 스크립트

이 디렉토리는 macOS의 Codex와 Claude AI 에이전트를 지원하는 보조 설치 스크립트를 둡니다.

기본 설치 경로는 호스트 에이전트의 plugin install입니다.

- Claude Code: 채팅창에 `/plugin marketplace add kimchanhyung98/bunjang-assistant` → `/plugin install bunjang-assistant@bunjang-assistant`
- Codex: `codex plugin marketplace add --ref main https://github.com/kimchanhyung98/bunjang-assistant.git` 뒤 `codex plugin add bunjang-assistant@bunjang-assistant`

여기의 Node 설치기는 CLI 래퍼 준비나 dry-run 검증이 필요할 때만 보조로 사용합니다.

## 통합 설치기

```bash
node install/bunjang-assistant-install.mjs --tool cli
node install/bunjang-assistant-install.mjs --tool codex --dry-run
node install/bunjang-assistant-install.mjs --tool claude --dry-run
node install/bunjang-assistant-install.mjs --tool both --dry-run
```

`--tool cli` 또는 `--install-cli`는 `npm install` 뒤 `npm run bunjang -- auth.status`로 래퍼 준비 상태를 확인합니다. `codex`, `claude`, `both` 설치는 기본적으로 스킬/플러그인 연결만 처리하며, 래퍼까지 함께 준비하려면 `--install-cli`를 붙입니다.

## 스킬 설치 헬퍼

```bash
./install/install-skills.sh --tool codex --scope project
./install/install-skills.sh --tool claude --scope project
```

`install-skills.sh`는 `bunjang-assistant-install.mjs`가 내부에서 호출하는 스킬 복사/심볼릭 링크 전용 헬퍼입니다.
