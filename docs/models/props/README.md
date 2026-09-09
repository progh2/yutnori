# 자리 소품(지형지물) 출처 및 라이선스

이 폴더의 3D 모델은 **Kenney의 Nature Kit** 에서 가져왔다.

- 제작·배포: [Kenney](https://kenney.nl) — [Nature Kit](https://kenney.nl/assets/nature-kit)
- 라이선스: **CC0 1.0 (퍼블릭 도메인)** — 재배포·수정·상업적 이용 모두 자유, 크레딧 의무 없음
- 원본 킷에는 300여 개 모델이 있고, 이 저장소에는 게임에서 쓰는 39개만 담았다 (총 400KB)

## 자리별 매핑

같은 짐승이라도 밭(계절)마다 다른 모델을 쓰도록 인덱싱해서 **29개 자리가 모두 다르게** 보인다.

| 자리 | 뜻 | 앞밭(봄) | 뒷밭(여름) | 쨀밭(가을) | 날밭(겨울) |
|---|---|---|---|---|---|
| 도 | 돼지 | `mushroom_red` | `mushroom_tan` | `mushroom_redTall` | `rock_smallA` |
| 개 | 개(둘) | `mushroom_redGroup` | `mushroom_tanGroup` | `rock_smallFlatA` | `stone_smallTopA` |
| 걸 | 양 | `grass_large` | `plant_bushDetailed` | `crops_wheatStageB` | `plant_bushSmall` |
| 윷 | 소 | `log` | `stone_smallFlatA` | `log_stack` | `rock_smallFlatB` |
| 모 계열 | 말 (꼭짓점) | `statue_obelisk` | `statue_column` | `stone_tallC` | `statue_block` |

| 특수 자리 | 모델 |
|---|---|
| 방 (북극성) | `statue_ring` + 발광하는 별 |
| 참먹이 (출발·도착 문) | `fence_gate` — 캐릭터가 통과해서 나감 |
| 십자 8자리 (모도·모개·뒷모도·뒷모개·속모·속윷·안찌·사려) | `stone_smallA` ~ `stone_smallH` (자리마다 다른 돌) |

## 계절 장식

각 밭 주변에 흩뿌리는 소품도 같은 킷에서 계절별로 나눴다.

- **봄(앞밭)**: `flower_redA` `flower_yellowB` `flower_purpleC`
- **여름(뒷밭)**: `grass` `plant_bushSmall` `plant_bushDetailed`
- **가을(쨀밭)**: `crops_wheatStageB` `crop_pumpkin` `stump_round`
- **겨울(날밭)**: `tree_pineSmallA` `tree_pineSmallC` `stone_smallC`

## 폴백

모델을 불러올 수 없는 환경(Claude Artifact는 CSP상 모델 파일 요청이 막힌다)에서는
코드로 직접 그린 소품으로 자동 대체된다.
