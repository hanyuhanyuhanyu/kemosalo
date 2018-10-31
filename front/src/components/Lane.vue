<template>
  <div id="lane" class='lane' :class="{isError: !lane.alive}">
    <div class="row">
      <div class="column">
        IPアドレス
      </div>
      <div class="elem">
        {{lane.ip}}
      </div>
    </div>
    <div class="row">
      <div class="column">
        ゲートタイプ
      </div>
      <div class="elem">
        {{lane.kind}}
      </div>
    </div>
    <div class="row">
      <div class="column">
        通信状況
      </div>
      <div class="elem">
        {{lane.alive ? "正常" : "異常"}}
      </div>
    </div>
    <div class="row">
      <div class="column">
        レスポンス
      </div>
      <div class="elem">
        {{lane.alive ? lane.time + " ms" : "----"}}
      </div>
    </div>
  </div>
</template>

<script>
import LaneStatus from '../assets/laneStatus.js';

export default {
  props: {
    lane: {
      default: new LaneStatus(),
    }
  }
}
</script>

<style>
  .lane{
    width: 240px;
  }
  .isError{
    background-color: #ffaaaa;
  }
  .row{
    display:flex;
    width: 100%;
  }
  .column{
    width: 50%;
  }
  .elem{
    width: 50%;
  }
</style>

