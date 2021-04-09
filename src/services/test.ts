import cheerio from 'cheerio';
import fs from 'fs';
import { Formatter } from '../util/index';

function main() {
  fs.readFile('./curriculum.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    const $ = cheerio.load(data);
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
            curriculum[row][col] = content;
          } else {
            // 没课，则填充为空
            curriculum[row][col] = ' ';
          }
        });
      if (curriculum[row].length === 8) {
        curriculum[row].unshift(' ');
      }
    });
    console.log(curriculum);
  });
}

try {
  main();
} catch (err) {
  console.error(err);
}
