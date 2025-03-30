import * as fs from 'node:fs';
import {logger} from '../logger/logger';

export class FileReader {
  static readJSON<T>(filePath: string): Promise<T> {
    return new Promise((resolve, reject) => {
      logger.info({
        message: 'Reading file',
        step: 'readJSON',
        metadata: {
          filePath,
        },
      });

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          logger.error({
            message: 'Error reading file',
            step: 'readJSON',
            metadata: {
              filePath,
              err,
            },
          });

          reject(err);
          return;
        }

        const content = data.trim().replace(/[\r\n\s\t]/g, '');

        logger.info({
          message: 'File read successfully',
          step: 'readJSON',
          metadata: {
            filePath,
            content,
          },
        });

        resolve(JSON.parse(content) as T);
      });
    });
  }
}
