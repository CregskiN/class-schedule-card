import axios, { AxiosResponse } from 'axios';
import { Formatter } from '../util';
const urlencode = require('urlencode');

import config from '../../config';

/**
 * 百度OCR 成功回执
 */
interface OCRRes_success {
  words_result: [{ words: string }];
  log_id: number;
  words_result_num: number;
}

/**
 * 百度OCR 错误回执
 * 文档：#https://cloud.baidu.com/doc/OCR/s/dk3h7y5vr
 */
interface OCRRes_fail {
  error_code: number;
}

interface AccessTokenRes {
  refresh_token: string;
  expires_in: number;
  scope: string;
  session_key: string;
  access_token: string;
  session_secret: string;
}

const {
  apiKey,
  secretKey,
  ocrAPI,
  MAX_NUMBER_OF_OCR_FAILURES,
} = config.baiduService;

/**
 * 功能：调用百度AI服务
 * 使用场景：
 *  1. 教务系统登录时，验证码的识别
 */
export class Baidu {
  /**
   * 调用百度ocr功能，并在ocr三次识别失败后，给出反馈
   * @param imageBase64
   * @returns {string}
   */
  static async ocr(imageBase64: string): Promise<string> {
    let count = 0;
    let res = '';
    const access_token = await this._getAccessToken(apiKey, secretKey);
    // TODO: 做个节流
    while (count < MAX_NUMBER_OF_OCR_FAILURES) {
      count++;
      res = await this._ocr(imageBase64, access_token);
      if (res !== 'error') {
        return res;
      }
    }
    return 'error';
  }

  /**
   * 调用百度OCR功能
   * 文档：#https://cloud.baidu.com/doc/OCR/s/1k3h7y3db
   * @param image
   */
  private static async _ocr(
    imageBase64: string,
    access_token: string
  ): Promise<string> {
    // console.log(imageBase64);
    return await axios({
      method: 'post',
      url: `${ocrAPI}?access_token=${access_token}`,
      data: `image=${urlencode(imageBase64)}`, // 一定注意这里
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
      .then(res => {
        // 并不是每次都能识别成功。三次识别不成功，刷新页面
        // console.log(res.data);
        if (res.data.words_result_num == 1) {
          const s = Formatter.removeBlanks(res.data.words_result[0].words);
          console.log(`百度OCR识别成功 ${s}`);
          return s;
        } else {
          console.error('百度OCR识别失败');
          return 'error';
        }
      })
      .catch(err => {
        console.error('百度OCR识别失败-网络故障', err);
        return 'error';
      });
  }

  /**
   * 使用 ApiKey & SecretKey 获取 AccessToken
   * @param APIKey
   * @param SecretKey
   * @returns {AccessTokenRes} AccessToken
   */
  static async _getAccessToken(
    APIKey: string,
    SecretKey: string
  ): Promise<string> {
    return await axios
      .post<any, AxiosResponse<AccessTokenRes>>(
        `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${APIKey}&client_secret=${SecretKey}&`
      )
      .then(res => {
        const { access_token } = res.data;
        console.log('百度OCR access_token获取成功', access_token);
        return access_token;
      })
      .catch(err => {
        console.error('百度OCR access_token获取失败', err);
        return 'error';
      });
  }
}
