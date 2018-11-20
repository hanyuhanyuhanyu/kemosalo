<template>
  <div style='height: 100%; position: relative;'>
    <transition name='confirmed'>
      <div v-if='confirmation !== null' class='confirmation log-box'>
        <p>
        【登録成功】
        </p>
        <p>
        {{confirmation}}さん
        </p>
        <div class="button-wrapper">
          <button @click='()=>{init() ; warning = ["登録を受け付ました", "いってらっしゃい!"]}' class='standard-button' style='font-size: 2rem'>
            この名前でOK！
          </button>
          <button @click='initReenter' class='standard-button' style='font-size: 2rem'>
            間違えた？
          </button>
        </div>
      </div>
    </transition>
    <div style='height: 30%; width: 100%; display: flex; align-items: flex-end; justify-content: center; font-size: 3rem; flex-direction: column;'>
      <div style='width:100%; display: flex; justify-content: center; bottom: 0;'>
        {{prompt}}
        <span :style='{opacity: cursorOn ? 1 : 0}'>_</span>
      </div>
      <div class="card" style='width: 100%; display: flex; justify-content: center; flex-direction: column; align-items: center; margin-top: 1rem; padding: 0;font-size: 1.5rem' v-if='card'>
        <p style='font-size:2rem;'>{{additionalPrompt}}</p>
        (card id:{{card}})
      </div>
    </div>
    <div v-if="card" class='log-box' style='display: flex; justify-content: start; align-items: center; flex-direction: column'>
      <input v-model='name' placeholder='名前を入力してください' type="text" class='name-input' style='' >
      <transition name='error'>
        <div v-if='error' class='log-box error'>
          {{error}}
        </div>
        <div v-else class='log-box error' style='opacity: 0; z-index: -10; '>
          これはダミー要素です
        </div>
      </transition>
      <div class="button-wrapper" style='margin-bottom: 1rem;' :style='{"justify-content": retyping ? "space-between" : "center"}'>
        <button v-if='retyping' @click="reset" class='standard-button' style='font-size: 2rem'>
          やっぱりこれでいい
        </button>
        <button @click="register" class='standard-button' style='font-size: 2rem'>
          {{registerButton}}
        </button>
      </div>
    </div>
    <transition name='warn'>
      <div v-if='warning' class='warning log-box'>
        <!-- インデックスをkeyにbindすべきでないが、
          アニメーションしない/要素の変更がないので、ここではよしとする -->
        <span v-for='(warn, index) in warning' :key='index'>
          {{warn}}<br>
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
import Winker from './assets/winker.js';
const selfip = process.env.KEMOSALO_SERVER_IP
const axiosBase = require('axios');
const axios = axiosBase.create({
  baseURL: `http://${selfip}:3000/api`
});
const newRegister = "ケモサロ参加書として登録する"
const retypeName = "名前を変更する"
const readACard = 'カードを読み取ってください' 
export default {
  data: () => {
    return {
      name: '',
      card: null,
      prompt: readACard,
      cursorOn: true,
      warning: null,
      confirmation: null,
      registerButton: newRegister,
      nameBuffer: "",
      additionalPrompt: null,
    }
  },
  methods: {
    register: function(){
      if(!!this.error){
        this.warning = [this.error]
        return
      }
      console.log(this.$route.params.id)
      let params = new URLSearchParams();
      params.append('card', this.card)
      params.append('name', this.name)
      axios.post('/user/register', params).then(res => {
          this.confirmation = res.data
        }
      ).catch(error => {
          this.warning = [
            "【登録失敗】",
            error.response.data
          ]
        }
      )
    },
    reset: function(){
      this.warning = [
        "名前の変更を取り消しました",
        `（このカードの持ち主は${this.name}さんのまま変更されていません）`,
        "別のカードの登録をするならばカードを読み込んでください"
      ]
      this.init()
    },
    init: function(){
      this.name = ""
      this.nameBuffer = ""
      this.registerButton = newRegister
      this.confirmation = null
      this.prompt = readACard
      this.card = null
      this.additionalPrompt = null
    },
    initReenter: function(){
      this.readNotBlankCard({data: {card_id: this.card, name: this.name}})
    },
    readNotBlankCard: function(obj){
      this.init()
      this.card = obj.data.card_id
      this.prompt = 'カードを読み取りました'
      this.additionalPrompt = `このカードは${obj.data.name}さんで登録されています`
      this.registerButton = retypeName
      this.name = obj.data.name
      this.nameBuffer = obj.data.name
    }
  },
  mounted: function () {
    console.log(Winker(() => this.cursorOn = !this.cursorOn))
    try{
      this.socket = io(`ws://${selfip}:3000`);
      this.socket.emit('registerInitialize', this.$route.params.id);
      this.socket.on('blankCardRead', obj => {
        this.init()
        this.card = obj.card
        this.prompt = 'カードを読み取りました'
      })
      this.socket.on('notBlankCardRead', this.readNotBlankCard)
    } catch(e) {
      console.log('booting failed')
      console.log(e)
    }
  },
  computed: {
    cursor: function(){
      return this.cursorOn ? "_" : " "
    },
    error: function(){
      if(this.name.match(/^\s*$/)){
        return '名前は必ず入力してください'
      }
      if(this.name === this.nameBuffer){
        return '変更前と名前が変わっていません'
      }
    },
    retyping: function(){
      return this.registerButton === retypeName
    }
  },
  watch: {
    warning: function(val){
      if(this.warning){
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.warning = null
      }, 5000)
    }
  }
}
</script>

<style scoped>
.register-button{
  transition: .2s;
}
.error{
  margin-bottom: 1rem;
  margin-top: 0;
  font-size: 2rem;
  color: #e11;
  animation: alerting ease-in-out 1s infinite alternate;
  background: #6a3200;
  transition: transform 0.1s;
}
@keyframes alerting{
  100%{
    color: #cb964d;
  }
}
.name-input{
  font-size: 3rem;
  margin: 1rem 0;
}
.warning{
  position: absolute;
  display: flex;
  flex-direction: column;
  color: #6a3200;
  height: 30%;
  font-size: 2rem;
  background-color: #cb964d;
  justify-content:center;
  align-items: center;
  margin: 0 auto;
  left: 0;
  right: 0;
  bottom: 0;
  transition: bottom 0.3s;
}
.confirmation{
  position: absolute;
  width: 70%;
  height: 80%;
  background-color: #6a3200;
  display: flex;
  flex-direction: column;
  font-size: 3rem;
  align-items: center;
  justify-content: center;
  z-index: 5;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  transition: top 0.3s;
}
.button-wrapper{
  display: flex;
  justify-content: space-between;
  width: 70%;
}
.confirmed-enter-active, .confirmed-leave-active{
  top: 0;
}
.confirmed-enter, .confirmed-leave-to{
  top: -320px;
}
.warn-enter-active, .warn-leave-active{
  bottom: 0;
}
.warn-enter, .warn-leave-to{
  bottom: -320px;
}
.error-enter-active, .error-leave-active{
  transform: scaleY(1);
}
.error-enter, .error-leave-to{
  transform: scaleY(0);
}
</style>
