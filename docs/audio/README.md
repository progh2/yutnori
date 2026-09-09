# 음원 출처 및 라이선스

이 폴더의 음악·효과음은 **모두 CC0 (퍼블릭 도메인)** 이다. 저작권이 포기된 자료라
재배포·수정·상업적 이용에 제약이 없고 크레딧 표기 의무도 없지만, 출처를 밝히기 위해
이 문서를 둔다.

| 파일 | 쓰이는 곳 | 원본 | 라이선스 |
|---|---|---|---|
| `bgm.ogg` | 배경음악 (루프) | [Orient Peace Valley](https://opengameart.org/content/orient-peace-valley) — OpenGameArt | CC0 |
| `throw1.flac` `throw2.flac` | 윷 던지는 소리 | [Wooden dice on wooden table roll](https://opengameart.org/content/wooden-dice-on-wodden-table-roll) — OpenGameArt | CC0 |
| `step.ogg` | 캐릭터 발걸음 | [100 CC0 SFX #2](https://opengameart.org/content/100-cc0-sfx-2) — `footstep_wood_01` | CC0 |
| `click.ogg` | 버튼 클릭 | [100 CC0 SFX #2](https://opengameart.org/content/100-cc0-sfx-2) — `switch_01` | CC0 |
| `capture.ogg` | 잡기 · 빽도 | [100 CC0 SFX #2](https://opengameart.org/content/100-cc0-sfx-2) — `wood_hit_01` | CC0 |
| `chime.ogg` | 윷·모 추가 턴, 완주 | [100 CC0 SFX #2](https://opengameart.org/content/100-cc0-sfx-2) — `items_01` | CC0 |
| `fanfare.ogg` | 승리 | [Classic fanfare lick](https://opengameart.org/content/classic-fanfare-lick) — OpenGameArt | CC0 |

## 참고

- 실제 나무 주사위가 나무 판에 구르는 녹음을 윷가락 소리로 쓴다. 윷 소리에 가장 가깝다.
- 빽도는 `capture.ogg`를 `playbackRate 0.6`으로 낮게 재생해 침울한 톤을 만든다.
- 파일을 불러올 수 없는 환경(Claude Artifact는 CSP상 오디오 파일 요청이 막힌다)에서는
  Web Audio API로 합성한 대체 사운드로 자동 폴백한다.
