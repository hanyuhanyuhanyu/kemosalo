module.exports = class {
  constructor(message = 'default message', isErr = false, httpCode = 200){
    this.message = message;
    this.object = null;
    this.isErr = isErr;
    this.httpCode = httpCode;
  }
  error(message = undefined, http = undefined){
    this.isErr = true;
    if(message !== undefined){
      this.message = message
    }
    if(http !== undefined){
      this.httpCode = http
    }
  }
}
