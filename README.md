# 🎲 사이버 윷놀이 (Cyber Yutnori)

AI 에이전트(Claude)와 함께 페어 프로그래밍으로 개발하는 전통 윷놀이 웹 게임입니다.
2명의 참가자(사람 또는 봇)가 1:1로 턴을 주고받으며, 전통 윷놀이 규칙에 따라 말을 움직여
먼저 두 말을 모두 완주시키는 쪽이 승리합니다.

## 학습 목표

- 사이버 윷놀이 게임을 AI 에이전트와 함께 개발하는 경험을 쌓는다
- 턴 방식 1:1 게임의 상태 관리와 흐름 제어를 구현한다
- 윷놀이 말판 위에서의 말 이동(지름길, 업기, 잡기 포함) 로직을 구현한다

## 주요 기능

- 1:1 턴 방식 진행 (사람 2명 / 사람+봇 / 봇 2명 조합 선택 가능)
- 전통 윷판(지름길 포함) 위에서 각 플레이어 말 2개 운용
- 도/개/걸/윷/모/빽도 결과와 전통 확률 분포 반영
- 업기(자동 병합), 잡기, 윷·모·잡기 시 추가 턴 등 전통 규칙 구현
- three.js 기반 3D 윷 던지기 애니메이션, 코믹한 UI 톤앤매너
- 전원 봇 모드에서는 봇의 의사결정 과정을 시각적으로 관전 가능

## 문서 & 링크

- [plan.md](./plan.md) — 상세 PRD (게임 규칙 명세, 시스템 아키텍처 UML, 단계별 개발 계획)
- [PRD 웹 페이지 (GitHub Pages)](https://progh2.github.io/yutnori/) — plan.md를 다이어그램과 함께 보기 좋게 렌더링한 버전
- [Issues](https://github.com/progh2/yutnori/issues) / [Milestones](https://github.com/progh2/yutnori/milestones) — 단계별 작업 추적

## 개발 방식

이 프로젝트는 [plan.md](./plan.md)의 9단계 계획에 따라 단계적으로 개발됩니다.
각 단계는 GitHub Issue로 추적되며, 전체 진행 상황은 Milestone에서 확인할 수 있습니다.
각 단계의 결과물은 Claude Artifact(단일 HTML 파일)로 게시되어 브라우저에서 바로 실행할 수 있습니다.

## 기술 스택

- Vanilla JavaScript (프레임워크 없음)
- 2D 렌더링: SVG/Canvas (말판, 말, UI)
- 3D 렌더링: [three.js](https://threejs.org/) (윷 던지기 애니메이션)
- 배포: Claude Artifact (단일 HTML 파일)
