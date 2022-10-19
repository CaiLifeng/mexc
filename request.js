const fetch = require('node-fetch');
const getNonceAndSign  = require('./decryption.js');
const cookieParser = require('cookie');
const HttpsProxyAgent = require('https-proxy-agent');
const logger = require('./logger');

const DEATULT_HEADER = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7,zh-CN;q=0.6,de;q=0.5",
    // "authorization": "WEBec81611a247a265d628801bb61c8761a127ce178f8bc2082817ccbc9265bb856",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "language": "Chinese",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    // "x-mxc-nonce": "1665908743547",
    // "x-mxc-sign": "6b1c91894510e82f547904753ea3d69b",
    // "cookie": "_ga=GA1.1.1868872572.1665474137; _rdt_uuid=1665474886365.377a2a66-d8f2-42b1-b62b-dbef279b3e13; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22df15beda565f4bf2a7b9476562aab43e%22%2C%22first_id%22%3A%22183c5fe8951c12-07ac901e573ac9-26021c51-2073600-183c5fe89528f7%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_utm_source%22%3A%22mexc%22%2C%22%24latest_utm_medium%22%3A%22futurepagepop%22%2C%22%24latest_utm_campaign%22%3A%22week1010%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTgzYzVmZTg5NTFjMTItMDdhYzkwMWU1NzNhYzktMjYwMjFjNTEtMjA3MzYwMC0xODNjNWZlODk1MjhmNyIsIiRpZGVudGl0eV9sb2dpbl9pZCI6ImRmMTViZWRhNTY1ZjRiZjJhN2I5NDc2NTYyYWFiNDNlIn0%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%22df15beda565f4bf2a7b9476562aab43e%22%7D%2C%22%24device_id%22%3A%22183c5fe8951c12-07ac901e573ac9-26021c51-2073600-183c5fe89528f7%22%7D; mxc_theme_main=light; NEXT_LOCALE=zh-CN; _ym_uid=1665588580272078133; _ym_d=1665588580; conditions=false; mxc_reset_tradingview_key=false; Hm_lvt_bfc2c0a173378480991465c3626cc9b9=1665474138,1665738116; _ym_isad=1; _vid_t=8nx8+bxx594Ka5DU1c1pqnDxfASGMVSKh2pGF2XQjA4u08J5XYiXgZseDgQrewedk+Yxi7Pe98rYWa8vWPlfJnjVcg==; uc_token=WEBec81611a247a265d628801bb61c8761a127ce178f8bc2082817ccbc9265bb856; x-mxc-fingerprint=eTpsEDs2tsRTqXnaecka; u_id=WEBec81611a247a265d628801bb61c8761a127ce178f8bc2082817ccbc9265bb856; __zlcmid=1COlIAC3MMZUNWC; AKA_A2=A; Hm_lpvt_bfc2c0a173378480991465c3626cc9b9=1665908621; RT=\"z=1&dm=futures.mexc.com&si=41b7f326-5e6b-4010-a3b3-e6b6205b9ca2&ss=l9b2zaac&sl=1&tt=142&rl=1&ld=1ndb\"; _ga_L6XJCQTK75=GS1.1.1665908611.13.1.1665908724.31.0.0",
    // "Referer": "https://futures.mexc.com/exchange/HOT_USDT?type=linear_swap",
    "Referrer-Policy": "strict-origin-when-cross-origin"
};

class Request {
    constructor(){
        this.header = {
            ...DEATULT_HEADER,
        };
        this.proxyAgent = null;
        this.cookie = null;
        this.webSig = null;
    }

    setHeader(headerObj = {}){
        this.header = {
            ...this.header,
            ...headerObj
        };
    }

    // http://127.0.0.1:7890
    setProxy(target){
        this.proxyAgent = new HttpsProxyAgent(target);
    }

    setCookie(val){
        try {
            let cookieObj = cookieParser.parse(val);
            this.cookie = val;
            this.webSig = cookieObj.u_id;
            this.header = {
                ...this.header,
                cookie:this.cookie,
                authorization:cookieObj.u_id
            };
        } catch(error) {
            logger.error(error);
        }
    }

    async forward({ url, body, method } = {}){
        if (!this.cookie || !this.webSig){
            return logger.error('请先调用setCookie设置cookie');
        }

        const nonceAndSign = getNonceAndSign({webSig:this.webSig,body});

        const headers = {
            ...this.header,
            ...nonceAndSign,
        };

        try {
            const response = await fetch(url, {
                agent:this.proxyAgent,
                headers,
                body:JSON.stringify(body),
                method,
            });
            const data = await response.json();

            logger.info(data);

            if (data.code === 0) {
                return Promise.resolve();
            } else {
                return Promise.reject(data);
            }
        } catch(error) {
            logger.error(error);
            return Promise.reject(error)
        }
         
    }
}

module.exports = Request;