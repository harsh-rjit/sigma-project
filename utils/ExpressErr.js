class ExpressErr extends Error{
    constructor(StatusCode,Message){
        super();
        this.statusCode = StatusCode;
        this.message = Message;
    }
}

module.exports = ExpressErr;