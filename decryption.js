const md5 = require('js-md5');

const getNonceAndSign = ({ webSig, body = {} }) =>{
    const time = (new Date()).getTime();
    const bodyStr = JSON.stringify(body);
    const middleSign = md5(webSig+time).substr(7);
    const finalSign = md5(time+bodyStr+middleSign);
    

    return {
        'x-mxc-nonce':time.toString(),
        'x-mxc-sign':finalSign
    };
}

module.exports = getNonceAndSign;