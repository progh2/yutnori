# ✨ 별밭 윷놀이 (Starfield Yutnori)

AI 에이전트(Claude)와 함께 페어 프로그래밍으로 개발한 전통 윷놀이 웹 게임입니다.
북극성과 28수가 들어앉은 **29밭 원형 윷판** 위에서 3D 캐릭터가 윷을 던지고 걸어갑니다.
2~4명의 참가자(사람 또는 봇)가 순서대로 턴을 주고받으며, 전통 윷놀이 규칙에 따라 말을 움직여
먼저 두 말을 모두 완주시키는 쪽이 승리합니다.

🎮 **[바로 플레이하기 (GitHub Pages)](https://progh2.github.io/yutnori/)**

## 학습 목표

- 사이버 윷놀이 게임을 AI 에이전트와 함께 개발하는 경험을 쌓는다
- 턴 방식 게임(2~4인)의 상태 관리와 흐름 제어를 구현한다
- 윷놀이 말판 위에서의 말 이동(지름길, 업기, 잡기 포함) 로직을 구현한다

## 규칙

- **2~4인 턴 방식** — 시작 화면에서 인원과 그중 사람 수를 고릅니다 (전원 봇이면 관전 모드)
- 플레이어마다 말 2개, 두 말이 모두 완주하면 승리
- 윷가락은 **평평한 배 + 둥근 등**의 반달 모양. **배가 위로 나온 개수**로 판정합니다 —
  0개 모, 1개 도, 2개 개, 3개 걸, 4개 윷 (전통 확률 1·3·6·4·1·1 / 16)
- **빽도**는 넷 중 하나에 붉은 띠를 두고, 배가 하나만 나왔을 때 그것이 표시된 윷일 때
- **업기**(같은 칸의 같은 편은 함께 이동), **잡기**(상대 말을 출발 전으로), 윷·모·잡기 시 **추가 턴**
- 사람 차례에는 **어느 말을 어느 길로** 움직일지 직접 고릅니다 (추천 수에는 ⭐, 숫자키로도 선택)
- 꼭짓점에서 **방(중앙)을 지나는 지름길** — 방을 지나면 전통 규칙대로 참먹이 방향으로 꺾어
  최단 완주가 11칸이 됩니다

## 판과 연출

- **29밭 원형 윷판** — 북극성(방) + 28수, 천원지방(바깥은 원, 안은 십자)
- **24절기 지형** — 방과 네 귀를 뺀 24자리가 24절기. 자리마다 그 절기에 맞는 소품을 세우고
  (입춘 새싹 · 춘분 꽃 · 하지 해바라기 · 추분 호박 · 한로 단풍 · 동지 모닥불 …)
  자리 이름 아래에 절기 이름을 띄웁니다
- **사계절 밭** — 앞밭 봄 · 뒷밭 여름 · 쨀밭 가을 · 날밭 겨울. 바닥색과 소품 색조가 계절을 따릅니다
- **캐릭터 8인** — 각자 외형·대기 자세·대사·목소리·웃음소리가 다릅니다. 참가하지 않는
  캐릭터는 판 옆 휴식처의 그루터기에 앉아 구경합니다
- **시네마틱 카메라** — 던질 캐릭터 → 윷 클로즈업 → 표정 클로즈업 → 걷기 추적 → 전체 보기
- 잡힌 말은 **만세를 하며 날아가** 벤치에 떨어집니다
- 격투게임식 결과 이펙트, 머리 위 이름표, 말풍선, 현재/다음 턴 패널
- 우클릭 드래그(터치는 한 손가락)로 시점 회전, 휠/핀치로 확대·축소
- 왼쪽 패널에 현재/다음 차례와 플레이어별 진행 상황(말마다 막대, 완주 n/2)
- 좁은 세로 화면에서도 판 전체가 들어오도록 HUD와 렌즈를 조정합니다
- 키보드만으로 플레이 가능(스페이스로 던지고 숫자키로 말·경로 선택)하고, 결과와 차례를 스크린 리더가 읽습니다

## 소리

- 배경음악·윷·발걸음·잡기·완주·팬파레는 **CC0 녹음**을 재생합니다
- 캐릭터 대사는 브라우저 음성합성으로 읽습니다 (턴 한마디, 결과 낭독, 잡힐 때 비명, 잡을 때 웃음)
- 대사는 한 번에 하나씩, **말이 끝나기를 기다린 뒤** 윷을 던지고 말을 옮깁니다
- 남자 캐릭터에게는 시스템에 남성 한국어 음성이 있으면 그 목소리를 배정합니다
  (없으면 피치를 크게 낮춥니다 — Windows에는 보통 여성 음성 하나만 설치돼 있습니다)
- 오디오 파일을 불러올 수 없는 환경에서는 Web Audio API 합성음으로 자동 폴백

## 자료 출처

가져다 쓴 모든 자료는 **재배포가 허용된 것만** 골랐습니다. 폴더별 상세 문서에 파일 단위
출처와 라이선스 원문이 있습니다.

### 캐릭터 (VRM) — [docs/models/README.md](./docs/models/README.md)

**VRoid 프로젝트(pixiv Inc.)** 공식 샘플 모델 5종. 파일에 내장된 VRM 메타데이터에
`redistribution=allow` · `modification=allow` · 상업이용 허용 · 크레딧 불필요가 명시되어
있어 공개 저장소에 담을 수 있습니다.

| 파일 | 캐릭터 | 게임 내 이름 |
|---|---|---|
| `shino.vrm` | 千駄ヶ谷篠 | 시노 (+ 색조 변경본 **새별**) |
| `vita.vrm` | ヴィータ | 비타 (+ 색조 변경본 **노을**) |
| `vivi.vrm` | ビビ | 비비 (+ 색조 변경본 **미르**) |
| `victoria.vrm` | ヴィクトリア・ルービン | 빅토리아 |
| `fumiriya.vrm` | 桜田史利矢 | 후미리야 |

- 배포처: [OpenGameArt — VRoid Studio CC0 models](https://opengameart.org/content/vroid-studio-cc0-models)
- 이용 조건 안내: [VRoid 공식 FAQ](https://vroid.pixiv.help/hc/en-us/articles/4402614652569)
- 텍스처만 1024로 재인코딩해 파일당 15~20MB → 6~8MB로 줄였습니다 (모델 형상은 그대로)

### 지형지물 · 소품 (GLB) — [docs/models/props/README.md](./docs/models/props/README.md)

[Kenney — Nature Kit](https://kenney.nl/assets/nature-kit) · **CC0 1.0**. 원본 300여 개
중 게임에서 쓰는 61개만 담았습니다(총 700KB). 24절기 소품, 귀의 석주, 참먹이 문,
휴식처의 그루터기·천막·모닥불이 모두 이 킷입니다.

### 음악 · 효과음 — [docs/audio/README.md](./docs/audio/README.md)

모두 **CC0**, [OpenGameArt](https://opengameart.org/) 출처입니다.

| 쓰임 | 원본 |
|---|---|
| 배경음악 | [Orient Peace Valley](https://opengameart.org/content/orient-peace-valley) |
| 윷 던지는 소리 | [Wooden dice on wooden table roll](https://opengameart.org/content/wooden-dice-on-wodden-table-roll) |
| 발걸음 · 클릭 · 잡기 · 완주 벨 | [100 CC0 SFX #2](https://opengameart.org/content/100-cc0-sfx-2) |
| 승리 팬파레 | [Classic fanfare lick](https://opengameart.org/content/classic-fanfare-lick) |

### 라이브러리 · 글꼴

- [three.js](https://threejs.org/) 0.180 (MIT) · [@pixiv/three-vrm](https://github.com/pixiv/three-vrm) 3 (MIT) — jsDelivr에서 고정 버전 로드
- [mermaid](https://mermaid.js.org/) (MIT) — PRD 페이지의 UML 렌더링
- Google Fonts: [Black Han Sans](https://fonts.google.com/specimen/Black+Han+Sans) · [Jua](https://fonts.google.com/specimen/Jua) · [Noto Sans KR](https://fonts.google.com/noto/specimen/Noto+Sans+KR) (SIL Open Font License)

### 고증 · 규칙 참고 — [docs/yutpan.md](./docs/yutpan.md)

- [한국민족문화대백과사전 — 윷놀이](https://encykorea.aks.ac.kr/Article/E0042794)
- [위키백과 — 윷놀이](https://ko.wikipedia.org/wiki/%EC%9C%B7%EB%86%80%EC%9D%B4) (도개걸윷모 판정과 확률)
- [K스피릿 — 북극성과 28수의 뭇별이 들어앉은 작은 우주 '윷판'](http://www.ikoreanspirit.com/news/articleView.html?idxno=681)
- [대순회보 — 윷판에 담긴 천문사상](https://webzine.daesoon.org/m/view.asp?webzine=32&menu_no=383&bno=438&page=1)
- [천지일보 — 윷놀이 말판에 하늘·땅·별자리 그리고 계절이 담겼네](https://www.newscj.com/news/articleView.html?idxno=113657)

### 검토했지만 쓰지 않은 것

- **VRoid 공식 .vrma 모션 7종** — 수정·상업이용은 허용되지만 "꺼낼 수 있는 상태로 2차
  배포" 금지라서 저장소에 담을 수 없습니다. Mixamo도 원본 에셋 재배포 금지로 제외.
  대안으로 CC0인 [Quaternius Universal Animation Library](https://quaternius.com/packs/universalanimationlibrary.html)
  리타게팅을 검토 중입니다 ([#25](https://github.com/progh2/yutnori/issues/25))

## 문서 & 링크

- [docs/yutpan.md](./docs/yutpan.md) — **윷판 29밭에 담긴 뜻** (북극성과 28수, 천원지방,
  24절기와 자리별 배치, 자리 이름, 최단 경로 · 출처 포함)
- [plan.md](./plan.md) — 상세 PRD (게임 규칙 명세, 시스템 아키텍처 UML, 단계별 개발 계획, 설계 결정 기록)
- [PRD 웹 페이지](https://progh2.github.io/yutnori/prd.html) — plan.md를 다이어그램과 함께 렌더링한 버전
- [docs/models/README.md](./docs/models/README.md) — 캐릭터 VRM 모델 출처·라이선스와 색조 변경 방식
- [docs/models/props/README.md](./docs/models/props/README.md) — 24절기 소품·휴식처 모델 출처
- [docs/audio/README.md](./docs/audio/README.md) — 음원 출처와 라이선스
- [Issues](https://github.com/progh2/yutnori/issues) / [Milestones](https://github.com/progh2/yutnori/milestones) — 요청·작업 추적

## 테스트

규칙 로직에는 자동 테스트가 있습니다 — 단일 HTML에서 스크립트 블록을 뽑아 `node:vm`에서
돌리므로 브라우저 없이 검증됩니다.

```
node tests/rules.test.mjs
```

윷 16조합 전수 검사, 29밭 그래프와 24절기 배치, 경로 계산(지름길·방 꺾기·최단 11칸·빽도),
업기·말 선택 점수·승리 판정, 캐릭터 8인의 대사 중복 여부를 확인합니다.

에셋 캐시(`sw.js`)에도 테스트가 있습니다 — 브라우저 대신 `node:vm`에 Cache/fetch 대역을
세워 두고 핸들러를 직접 불러, 캐시에 있는 모델은 네트워크를 타지 않는지, 받아오는 길에
베껴 담아 페이지를 붙잡지는 않는지, HTML은 네트워크를 먼저 묻는지, `warm`이 404 하나에
멈추지 않는지를 확인합니다.

```
node tests/sw.test.mjs
```

[GitHub Actions](https://github.com/progh2/yutnori/actions)에서 push마다 실행되고,
`docs/index.html`이 `game/index.html`과 어긋나면 실패합니다.

## 개발 방식

[plan.md](./plan.md)의 9단계 계획에 따라 단계적으로 개발하고, 이후의 개선 요청은
[Stage 10 마일스톤](https://github.com/progh2/yutnori/milestone/10)에서 요청 하나당 이슈
하나로 추적합니다. 각 이슈에는 무엇을 왜 그렇게 했는지 기록을 남깁니다.

- 개발: [game/index.html](./game/index.html) (단일 파일)
- 배포: 같은 파일을 GitHub Pages(`docs/index.html`)와 Claude Artifact에 동시 배포
- Artifact는 CSP상 스크립트 외 리소스를 불러올 수 없어, 모델·음원·소품은 자동으로
  코드 내장 대체물로 폴백합니다 (파일 하나가 두 곳에서 모두 동작)

## 기술 스택

- Vanilla JavaScript (프레임워크 없음), 단일 HTML 파일
- 3D: [three.js](https://threejs.org/) 0.180 + [@pixiv/three-vrm](https://github.com/pixiv/three-vrm) 3 (importmap · jsDelivr)
- 캐릭터: VRoid 공식 샘플 VRM 5종 (+ 색조 변경 3종)
- 지형지물: [Kenney Nature Kit](https://kenney.nl/assets/nature-kit) (CC0)
- 소리: CC0 음원 + Web Audio API 합성음 폴백, Web Speech API 음성합성
- 에셋 캐시: Service Worker([game/sw.js](./game/sw.js)) — 한 번 받은 모델·소품·음원을
  Cache Storage에 쥐고 있어 두 번째 방문부터는 네트워크를 타지 않습니다. 덕분에
  오프라인에서도 돌아갑니다

### 에셋을 두 번 받지 않기

VRM 5종은 gzip 기준 15MB입니다. GitHub Pages는 `cache-control: max-age=600`을 고정으로
내려주고 헤더를 바꿀 수 없어, 이 덩치는 브라우저 HTTP 캐시에서 밀려나기 쉽습니다
(특히 iOS Safari). 그래서 캐시 정책을 `sw.js`에서 직접 정합니다.

- 모델·소품·음원·글꼴·CDN 스크립트는 캐시 우선, HTML은 네트워크 우선 (배포가 바로 반영)
- 받아오는 길에 캐시에 담지는 않습니다 — `response.clone()`을 끼우면 페이지가 읽는
  속도가 디스크 쓰기에 발목을 잡힙니다. 헤드리스 Chrome에서 6MB 모델을 15번씩 받아
  재어 보니 파일당 중앙값 **38ms → 68ms**였고, 그냥 통과만 시킬 때는 35ms로 차이가
  없었습니다
- 담는 일은 타이틀 화면이 뜬 뒤, 페이지가 목록을 `postMessage`로 넘겨 맡깁니다.
  그때는 HTTP 캐시에서 바로 나오므로 아무도 기다리지 않습니다
- 그 틈에 아직 쓰지 않은 모델까지 받아둬서 3·4인을 골라도 기다리지 않습니다
  (데이터 절약 모드나 2G에서는 건너뜁니다)
- 같은 `.vrm`을 쓰는 슬롯이 둘이라도 원본은 한 번만 받습니다 (`THREE.Cache`),
  다 쓰면 원본 바이트는 놓아줍니다
