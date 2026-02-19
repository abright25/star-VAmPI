import { test, before, after } from 'node:test';
import { SecRunner } from '@sectester/runner';
import { AttackParamLocation, HttpMethod } from '@sectester/scan';

const timeout = 40 * 60 * 1000;
const baseUrl = process.env.BRIGHT_TARGET_URL!;

let runner!: SecRunner;

before(async () => {
  runner = new SecRunner({
    hostname: process.env.BRIGHT_HOSTNAME!,
    projectId: process.env.BRIGHT_PROJECT_ID!
  });

  await runner.init();
});

after(() => runner.clear());

test('POST /books/v1', { signal: AbortSignal.timeout(timeout) }, async () => {
  await runner
    .createScan({
      tests: [
        {
          name: 'broken_access_control',
          options: {
            auth: 'azpLwB6e5XU2tcsh5Rwnyh'
          }
        },
        'sqli',
        'xss',
        'jwt',
        'secret_tokens'
      ],
      attackParamLocations: [AttackParamLocation.BODY, AttackParamLocation.HEADER],
      starMetadata: {
        code_source: 'abright25/star-VAmPI:master',
        databases: ['SQLAlchemy'],
        user_roles: ['admin']
      },
      poolSize: +process.env.SECTESTER_SCAN_POOL_SIZE || undefined
    })
    .setFailFast(false)
    .timeout(timeout)
    .run({
      method: HttpMethod.POST,
      url: `${baseUrl}/books/v1`,
      body: {
        book_title: 'book99',
        secret: 'pass1secret'
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer <JWT_TOKEN>'
      }
    });
});