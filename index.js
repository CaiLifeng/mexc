const Request = require('./request');
const logger = require('./logger');

const sleep = (seconds)=> new Promise((resolve)=> setTimeout(resolve,seconds * 1000));

const tradeRequest = new Request();
tradeRequest.setCookie('_ga=GA1.1.1868872572.1665474137; _rdt_uuid=1665474886365.377a2a66-d8f2-42b1-b62b-dbef279b3e13; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22df15beda565f4bf2a7b9476562aab43e%22%2C%22first_id%22%3A%22183c5fe8951c12-07ac901e573ac9-26021c51-2073600-183c5fe89528f7%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_utm_source%22%3A%22mexc%22%2C%22%24latest_utm_medium%22%3A%22futurepagepop%22%2C%22%24latest_utm_campaign%22%3A%22week1010%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTgzYzVmZTg5NTFjMTItMDdhYzkwMWU1NzNhYzktMjYwMjFjNTEtMjA3MzYwMC0xODNjNWZlODk1MjhmNyIsIiRpZGVudGl0eV9sb2dpbl9pZCI6ImRmMTViZWRhNTY1ZjRiZjJhN2I5NDc2NTYyYWFiNDNlIn0%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%22df15beda565f4bf2a7b9476562aab43e%22%7D%2C%22%24device_id%22%3A%22183c5fe8951c12-07ac901e573ac9-26021c51-2073600-183c5fe89528f7%22%7D; mxc_theme_main=light; NEXT_LOCALE=zh-CN; _ym_uid=1665588580272078133; _ym_d=1665588580; conditions=false; mxc_reset_tradingview_key=false; Hm_lvt_bfc2c0a173378480991465c3626cc9b9=1665474138,1665738116; x-mxc-fingerprint=eTpsEDs2tsRTqXnaecka; __zlcmid=1CVlJH1W7sM78sV; _vid_t=c0E+iVmIq+yfZ+pVMbv4eR1+2HTKKoF/Y9Prs4nlCIibXHL0Nmv/0/+B29poRDNppoY/I3z11KsIuleWU7ep47y5CA==; _ym_isad=2; uc_token=WEB187e47d6d4f004dc46684dbd23874161bb609fffa44f6796a8363aa46076d54c; u_id=WEB187e47d6d4f004dc46684dbd23874161bb609fffa44f6796a8363aa46076d54c; _ga_L6XJCQTK75=GS1.1.1666192146.18.1.1666192191.15.0.0; Hm_lpvt_bfc2c0a173378480991465c3626cc9b9=1666192194; RT="z=1&dm=futures.mexc.com&si=41b7f326-5e6b-4010-a3b3-e6b6205b9ca2&ss=l9fremln&sl=1&tt=8w&rl=1&ld=16a84"');
tradeRequest.setProxy('http://127.0.0.1:7890'); //配置代理

async function buyAndSell(){
    try {
        await tradeRequest.forward({
            url:'https://futures.mexc.com/api/v1/private/order/submit', 
            body:{"symbol":"SHIB_USDT","side":1,"openType":2,"type":"5","vol":1,"leverage":20,"priceProtect":"0"}, 
            method:'POST'
        })
        await tradeRequest.forward({
            url:'https://futures.mexc.com/api/v1/private/order/submit', 
            body:{"symbol":"SHIB_USDT","side":4,"openType":2,"leverage":20,"type":5,"vol":1,"priceProtect":"0"}, 
            method:'POST'
        })
        logger.info('完成一次买卖');
    } catch(error) {
        logger.error(error);
    }

    // 循环调用
    await sleep(0.5);
    buyAndSell();
}


async function ping(){
    try {
        await tradeRequest.forward({
            url:'https://futures.mexc.com/api/v1/contract/ping', 
            method:'GET'
        })
        logger.info('完成一次ping');
    } catch(error) {
        logger.error(error);
    }

    // 循环调用
    await sleep(10);
    ping();
}

buyAndSell();
ping();



