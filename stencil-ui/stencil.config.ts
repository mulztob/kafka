import { Config } from '@stencil/core';
import * as dotenv from 'dotenv';
// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: 'src/global/app.css',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      // comment the following line to disable service workers in production
      serviceWorker: null,
      baseUrl: 'https://myapp.local/',
    },
  ],
  env: readFromFile(),
  sourceMap: true,
};

function readFromFile() {
  const result = dotenv.config();
  if (result.error) console.error(result.error);
  return result.parsed;
}
