# 자리 소품(지형지물) 출처 및 라이선스

이 폴더의 3D 모델은 **Kenney의 Nature Kit** 에서 가져왔다.

- 제작·배포: [Kenney](https://kenney.nl) — [Nature Kit](https://kenney.nl/assets/nature-kit)
- 라이선스: **CC0 1.0 (퍼블릭 도메인)** — 재배포·수정·상업적 이용 모두 자유, 크레딧 의무 없음
- 원본 킷에는 300여 개 모델이 있고, 이 저장소에는 게임에서 쓰는 39개만 담았다 (총 400KB)

## 자리별 매핑 — 24절기

24개 자리에는 각각 그 자리가 뜻하는 **절기**에 어울리는 모델을 세웠다
(왜 24개인지는 [../../yutpan.md](../../yutpan.md) §3).

| 밭 | 절기 → 모델 |
|---|---|
| 앞밭(봄) | 입춘 `crops_leafsStageA` · 우수 `lily_small` · 경칩 `mushroom_tanGroup` · 춘분 `flower_redA` · 청명 `tree_small` · 곡우 `crops_wheatStageA` |
| 뒷밭(여름) | 입하 `plant_bushLarge` · 소만 `crops_cornStageB` · 망종 `crops_wheatStageB` · 하지 `flower_yellowA` · 소서 `grass_leafsLarge` · 대서 `lily_large` |
| 쨀밭(가을) | 입추 `crops_cornStageD` · 처서 `plant_flatShort` · 백로 `grass_leafs` · 추분 `crop_pumpkin` · 한로 `tree_oak_fall` · 상강 `tree_blocks_fall` |
| 날밭(겨울) | 입동 `stump_old` · 소설 `tree_pineSmallB` · 대설 `tree_pineTallB` · 동지 `campfire_logs` · 소한 `stone_tallA` · 대한 `rock_largeC` |

| 특수 자리 | 모델 | 뜻 |
|---|---|---|
| 모 · 뒷모 · 찌모 (귀) | `statue_obelisk` `statue_column` `stone_tallC` | 계절이 바뀌는 분기점 |
| 참먹이 | `fence_gate` | 출발·도착 문 — 통과해서 나간다 |
| 방 | `statue_ring` + 발광 별 | 북극성 |

자리 이름의 짐승(도 1 · 개 2 · 걸 3 · 윷 4)은 발판 앞의 조약돌 개수로 표시한다.

## 계절 장식

각 밭 주변에 흩뿌리는 소품도 같은 킷에서 계절별로 나눴다.

- **봄(앞밭)**: `flower_redA` `flower_yellowB` `flower_purpleC`
- **여름(뒷밭)**: `grass` `plant_bushSmall` `plant_bushDetailed`
- **가을(쨀밭)**: `crops_wheatStageB` `crop_pumpkin` `stump_round`
- **겨울(날밭)**: `tree_pineSmallA` `tree_pineSmallC` `stone_smallC`

## 휴식처 (참가하지 않는 캐릭터)

게임에 참여하지 않는 캐릭터는 판 옆 휴식처에서 쉰다. Nature Kit에 의자는 없지만
밭으로 만든 판에는 가구보다 그루터기가 어울린다.

| 용도 | 모델 |
|---|---|
| 앉는 자리 | `stump_squareDetailedWide` |
| 천막 | `tent_smallOpen` |
| 모닥불 | `campfire_logs` |

## 폴백

모델을 불러올 수 없는 환경(Claude Artifact는 CSP상 모델 파일 요청이 막힌다)에서는
코드로 직접 그린 소품으로 자동 대체된다.
