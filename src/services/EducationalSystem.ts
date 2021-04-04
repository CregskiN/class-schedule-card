import puppeteer from 'puppeteer';
import config from '../../config';
import { Baidu } from './index';

type JSESSIONID = string;

const { SignInPageURL, account, password } = config.edu;

export class EducationalSystem {
  /**
   * 获得JSESSIONID（by 登陆教务系统）
   * @returns
   */
  static async getCookiesBySignIn(): Promise<JSESSIONID> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(SignInPageURL);
    await page.waitFor(200);
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
        await page.waitFor(100);
        // await page.screenshot({
        //   path: './full.png',
        // });

        // TODO: 检验验证码是否正确
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
          await browser.close();
          return JSESSIONID;
        }
      } catch (err) {
        console.error(err);
      }

      await browser.close();
    }
    // 逻辑上到不了这里
    return ' ';
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
    return pageURL == SignInPageURL ? false : true;
  }

  static queryCurriculum(){
    
  }
}

// EducationalSystem.getCookiesBySignIn();
