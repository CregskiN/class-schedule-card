import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

import config from '../../config';

import { Baidu } from './index';
import { Formatter } from '../util';

type JSESSIONID = string;

interface ESRes {
  JSESSIONID: JSESSIONID;
  browser: puppeteer.Browser;
  page: puppeteer.Page;
}

const { encodeGBK, decodeGBK } = require('gbk-string');

const {
  signInPageURL,
  curriculumPageURL,
  account: _account,
  password: _password,
} = config.edu;

export class EducationalSystem {
  /**
   * 获得JSESSIONID（by 登陆教务系统）
   * @returns
   */
  static async getCookiesBySignIn(
    account: string = _account,
    password: string = _password
  ): Promise<ESRes> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(signInPageURL);
    await page.waitFor(500);
    // 1. 获取、处理验证码
    const imgBase64 = await page.screenshot({
      // path: './example.png',
      clip: {
        x: 290,
        y: 328,
        width: 80,
        height: 20,
      },
      encoding: 'base64',
    });
    const verifyCode = await Baidu.ocr(imgBase64);
    // 2. OCR是否识别成功？
    if (!this._isOCRComplete(verifyCode)) {
      // OCR 识别失败
      await browser.close();
      return await this.getCookiesBySignIn();
    } else {
      // OCR 识别成功
      try {
        await page.evaluate(() => {
          const inputs = document.querySelectorAll('input');
          inputs[7].setAttribute('id', '_accountBar');
          inputs[8].setAttribute('id', '_passwordBar');
          inputs[9].setAttribute('id', '_verifyBar');
        });
        await page.focus('#_accountBar');
        await page.keyboard.sendCharacter(account);
        await page.focus('#_passwordBar');
        await page.keyboard.sendCharacter(password);
        await page.focus('#_verifyBar');
        await page.keyboard.sendCharacter(verifyCode);
        await page.evaluate(() => {
          document.querySelectorAll('input')[10].click();
        });
        await page.waitFor(500);
        // await page.screenshot({
        //   path: './full.png',
        // });
        if (!this._isVerifyCodeCorrect(page.url())) {
          // 验证码不正确
          console.error('验证码错误, 重置逻辑');
          await browser.close();
          return await this.getCookiesBySignIn();
        } else {
          // 验证码正确
          const cookies = await page.cookies();
          const JSESSIONID = `${cookies[0].name}=${cookies[0].value}`;
          console.log(JSESSIONID);
          // await page.waitFor(100);
          // await page.screenshot({
          //   path: './full.png',
          // });
          // await browser.close();
          return { browser, JSESSIONID, page };
        }
      } catch (err) {
        await browser.close();
        console.error(err);
      }
    }
    // 逻辑上到不了这里
    return {} as any;
  }

  /**
   * 判断OCR是否正常识别
   * @param verifyCode
   * @returns
   */
  private static _isOCRComplete(verifyCode: string): boolean {
    if (verifyCode === 'error') {
      return false;
    }
    return true;
  }

  /**
   * 判断验证码是否正确（by 对比点击“确定”按钮前后的URL）
   * @param pageURL
   * @returns
   */
  private static _isVerifyCodeCorrect(pageURL: string): boolean {
    return pageURL == signInPageURL ? false : true;
  }

  /**
   * 获取指定课程表（内置GBK转码）
   * @param oper
   * @param xzxjxjhh
   * @param xbjh
   * @param xbm
   * @param xzxjxjhm
   * @param JSESSIONID
   */
  static async queryCurriculumOfStudent(
    browser: puppeteer.Browser,
    page: puppeteer.Page,
    oper: string = 'bjkb_xx',
    xzxjxjhh: string,
    xbjh: string,
    xbm: string,
    xzxjxjhm: string,
    JSESSIONID: JSESSIONID
  ) {
    try {
      const strs = xzxjxjhm.split('(');
      await page.goto(
        `${curriculumPageURL}?oper=${oper}&xzxjxjhh=${xzxjxjhh}&xbjh=${xbjh}&xbm=${encodeGBK(
          xbm
        )}&xzxjxjhm=${encodeGBK(strs[0])}(${encodeGBK(strs[1].split(')')[0])})`
      );
      await page.waitFor(500);
      // 对查询结果页截图
      // await page.screenshot({
      //   path: './curriculum.png',
      // });
      const html = await page.content();
      const $ = cheerio.load(html);
      const curriculum: any[][] = [];
      $('tr', 'thead').each((row, element) => {
        // 遍历 rows
        curriculum[row] = [];
        $(element)
          .children()
          .each((col, element) => {
            // 遍历 columns
            const content = Formatter.removeBlanks($(element).text());

            if (content.length !== 0) {
              // 对有课的情况
              curriculum[row][col] = content;
            } else {
              // 对没课的情况
              curriculum[row][col] = ' ';
            }
          });
        if (curriculum[row].length === 8) {
          // 上午、下午各自2 3 4节课第一行添为空
          curriculum[row].unshift(' ');
        }
      });
      console.log('解析完成', curriculum);

      await browser.close();
    } catch (err) {
      await browser.close();
      console.error(err);
    }
  }
}

async function main() {
  const {
    browser,
    page,
    JSESSIONID,
  } = await EducationalSystem.getCookiesBySignIn();
  await EducationalSystem.queryCurriculumOfStudent(
    browser,
    page,
    'bjkb_xx',
    '2020-2021-2-1',
    '189841302',
    '1802计算机',
    '2020-2021学年二(两学期)',
    JSESSIONID
  );
}
main();
