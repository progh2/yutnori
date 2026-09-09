# 캐릭터 모델 출처 및 라이선스

이 폴더의 VRM 모델은 **VRoid 프로젝트(pixiv Inc.)** 가 공개한 공식 샘플 모델입니다.

| 파일 | 캐릭터 | 게임 내 | 원본 |
|---|---|---|---|
| `shino.vrm` | 千駄ヶ谷篠 (Sendagaya Shino) | P1 첫째 말 | VRoid Studio 샘플 모델 |
| `vita.vrm` | ヴィータ (Vita / AvatarSample_F) | P1 둘째 말 | VRoid Studio 샘플 모델 |
| `vivi.vrm` | ビビ (Vivi / AvatarSample_E) | P2 첫째 말 | VRoid Studio 샘플 모델 |
| `victoria.vrm` | ヴィクトリア・ルービン (Victoria Rubin / AvatarSample_G) | P2 둘째 말 | VRoid Studio 샘플 모델 |

- 제작: VRoid プロジェクト (pixiv Inc.)
- 배포처: [OpenGameArt — VRoid Studio CC0 models](https://opengameart.org/content/vroid-studio-cc0-models) (CC0로 정리된 팩)
- 원 출처 안내: [VRoid 공식 FAQ — 샘플 모델의 이용 조건](https://vroid.pixiv.help/hc/en-us/articles/4402614652569-Do-VRoid-Studio-s-sample-models-come-with-conditions-of-use)

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
