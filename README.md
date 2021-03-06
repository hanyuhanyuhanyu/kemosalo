# 関西ケモノサロンクローク管理システム

## 主たる機能

- ICカードリーダの疎通監視
- 各ゲート通過履歴の記録/参照
- [portal]にインスパイアされた見た目

[portal]:http://www.thinkwithportals.com/

## URL一覧

- / => メインゲートデジタルサイネージ用
- /watchdog => 管理者画面
- /cardreader => カードを読み込んだ際にそのカードの情報を表示する画面
- /user => ユーザ一覧画面
- /user/(カードID) => そのカードに対応するユーザの履歴一覧
- /register/(画面ID) => ユーザ登録画面(画面IDは各カード読み取り機と接続するのに使用)

## サーバ仕様

- 3000番ポートのみ開放する

## API仕様

### ゲート管理

各ゲートの通過の記録および履歴参照を担う

#### GET => /api/gate

それまでのゲート通過履歴のうち最新100件を返す

##### レスポンス

|コード|概要|
|:--:|:--:|
|200|成功|
|500|サーバエラー|

---

#### GET => /api/gate/all

すべてのゲートのIPアドレスを返す

##### レスポンス

|コード|概要|
|:--:|:--:|
|200|成功|
|500|サーバエラー|

---

#### GET => /api/gate/history/(カードのID)

指定されたカードの通過履歴の最新5件を返す

##### レスポンス

|コード|概要|
|:--:|:--:|
|200|成功|
|500|サーバエラー|

---

#### POST => /api/gate/pass/master

総合ゲートを通過する際にリクエストを送る

##### ボディ部

|カラム|概要|
|:--:|:--:|
|card|カードのid|
|lane|レーンのIP|

##### レスポンス

|コード|概要|
|:--:|:--:|
|200|成功|
|400|サーバに登録済みの総合ゲートのIPと送られたIPが異なる|
|500|サーバエラー/サーバに総合ゲートが登録されていない|

---

#### POST => /api/gate/pass/slave/(laneのIPアドレス)

各レーンを通過する際にリクエストを送る

##### ボディ部

|カラム|概要|
|:--:|:--:|
|card|カードのid|

##### レスポンス

|コード|概要|
|:--:|:--:|
|200|成功|
|400|送られたIPが総合ゲートのものと一致する|
|404|存在しないレーンのIPを指定された|
|500|サーバエラー|

### カード情報

#### GET => /api/card/read/(読んだカードのid)

カードリーダで読み取ったカードの履歴を返す。
/api/user/(カードID) と酷似しているが、こちらは裏で画面にpush通知を行う点が異なる。

##### ボディ部

（なし）

##### レスポンス

|コード|概要|
|:--:|:--:|
|200|成功|
|404|指定されたカードは登録されていない|
|500|サーバエラー|

### ユーザ登録

#### GET => /api/user/

ユーザの一覧を返す

##### ボディ部

(なし)

##### レスポンス

|コード|概要|
|:--:|:--:|
|200|成功|
|500|サーバエラー|

#### GET => /api/user/(カードID)

指定されたカードIDの履歴を返す

##### ボディ部

(なし)

##### レスポンス

|コード|概要|
|:--:|:--:|
|200|成功|
|404|指定されたカードは登録されていない|
|500|サーバエラー|

#### GET => /api/user/read/(画面のid)/(読んだカードのID)

ブランクカードを読み取った際にその情報を画面に投影するために使う

##### ボディ部

(なし)

##### レスポンス

|コード|概要|
|:--:|:--:|
|200|成功|
|400|読んだカードがblankでない|
|500|サーバエラー|

