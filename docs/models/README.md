# 캐릭터 모델 출처 및 라이선스

이 폴더의 VRM 모델은 **VRoid 프로젝트(pixiv Inc.)** 가 공개한 공식 샘플 모델입니다.

| 파일 | 캐릭터 | 게임 내 | 원본 |
|---|---|---|---|
| `shino.vrm` | 千駄ヶ谷篠 (Sendagaya Shino) | P1 첫째 말 | VRoid Studio 샘플 모델 |
| `vita.vrm` | ヴィータ (Vita / AvatarSample_F) | P1 둘째 말 | VRoid Studio 샘플 모델 |
| `vivi.vrm` | ビビ (Vivi / AvatarSample_E) | P2 첫째 말 | VRoid Studio 샘플 모델 |
| `victoria.vrm` | ヴィクトリア・ルービン (Victoria Rubin / AvatarSample_G) | P2 둘째 말 | VRoid Studio 샘플 모델 |
| `fumiriya.vrm` | 桜田史利矢 (Sakurada Fumiriya) | P3 첫째 말 | VRoid Studio 샘플 모델 |

- 제작: VRoid プロジェクト (pixiv Inc.)
- 배포처: [OpenGameArt — VRoid Studio CC0 models](https://opengameart.org/content/vroid-studio-cc0-models) (CC0로 정리된 팩)
- 원 출처 안내: [VRoid 공식 FAQ — 샘플 모델의 이용 조건](https://vroid.pixiv.help/hc/en-us/articles/4402614652569-Do-VRoid-Studio-s-sample-models-come-with-conditions-of-use)

## 8명의 배역, 5개의 모델

최대 4명이 각각 말 2개를 쓰므로 배역은 8자리다. 재배포가 허용된 모델은 5개를 확보했고,
남는 3자리는 **앞의 모델을 색만 갈아입혀** 쓴다.

| 자리 | 모델 | 처리 | 이름 |
|---|---|---|---|
| 1~5 | shino · vita · vivi · victoria · fumiriya | 원본 | 시노 · 비타 · 비비 · 빅토리아 · 후미리야 |
| 6 | shino | 색조 +155° | **새별** |
| 7 | vita | 색조 +300° | **노을** |
| 8 | vivi | 색조 +205° | **미르** |

### 어떻게 색을 바꾸는가

MToon 셰이더는 `텍스처 × 색상`이라서 재질 색만 바꾸면 원래 머리색이 짙을 때 어둡게만
변한다. 그래서 **머리·의상 텍스처를 캔버스에 다시 그리면서 `hue-rotate`** 를 걸어
새 텍스처로 교체한다(`recolourVrm`). 남색 머리가 청록으로, 흰 머리가 분홍으로 실제로
넘어간다.

- 재질 이름에 `HAIR` / `CLOTH` / `Tops` / `Bottoms` / `Shoes` … 가 들어간 것만 대상
- `SKIN` / `FACE` / `EYE` / `Body` 재질과 **그 재질이 쓰는 이미지를 공유하는 텍스처는 제외** —
  VRoid 모델이 여러 부위를 한 이미지에 담는 경우가 있어서 피부까지 물드는 걸 막는다
- 이름도 `II` 대신 각자의 이름을 주고, 발밑 팀 색상 링으로 소속을 표시한다

`IDOL_ROSTER`에 `.vrm`을 추가하면 다음 자리부터 원본 모델을 쓰고, 색을 바꿔 쓰는 자리는
그만큼 줄어든다.

## 파일에 내장된 이용 허가 (VRM meta)

두 파일 모두 VRM 메타데이터에 다음 조건이 명시되어 있습니다.

```
allowed_to_use_user      = everyone
corporate_commercial_use = allow
personal_commercial_use  = profit
modification             = allow
redistribution           = allow
credit                   = unnecessary
```

즉 재배포·수정·상업적 이용이 모두 허용되며 크레딧 표기는 의무가 아닙니다.
(의무는 아니지만 출처를 밝히기 위해 이 문서를 둡니다.)

## 이 저장소에서 가한 수정

웹에서 로딩 시간을 줄이기 위해 **텍스처만** 재인코딩했습니다 (최대 1024px로 축소,
알파가 없는 텍스처는 JPEG q88로 변환). 지오메트리·본·블렌드셰이프는 그대로입니다.

- `shino.vrm` 14.9MB → 6.2MB
- `vivi.vrm` 17.9MB → 6.2MB
- `vita.vrm` 14.2MB → 5.6MB
- `victoria.vrm` 15.3MB → 6.1MB

원본이 필요하면 위 OpenGameArt 링크에서 다시 받을 수 있습니다.
