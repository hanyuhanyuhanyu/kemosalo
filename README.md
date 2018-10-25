# 関西ケモノサロンクローク管理システム

### 主たる機能

- ICカードリーダの疎通監視
- 各ゲート通過履歴の記録/参照
- [portal]にインスパイアされた見た目

[portal]:http://www.thinkwithportals.com/

### サーバAPI仕様

##### ゲート管理

各ゲートの通過の記録および履歴参照を担う

| url | メソッド |ボディ部| 概要 |
|--:|:--:|:--:|:--:|
|/api/gate|GET|不要|それまでのゲート通過履歴のうち最新100件を返す|
|/api/gate/history/(カードのID)|GET|不要|指定されたカードの通過履歴の最新100件を返す|
|/api/gate/pass/master|POST|card=> カードのid、lane=>レーンのIP|総合ゲートを通過する際にリクエストを送る|
|/api/gate/pass/slave/(laneのIPアドレス)|POST|card=> カードのid|各レーンを通過する際にリクエストを送る|

