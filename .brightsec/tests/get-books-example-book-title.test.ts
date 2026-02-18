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

test('GET /books/Example%20Book%20Title', { signal: AbortSignal.timeout(timeout) }, async () => {
  await runner
    .createScan({
      tests: ['broken_access_control', 'sqli', 'xss', 'secret_tokens'],
      attackParamLocations: [AttackParamLocation.PATH, AttackParamLocation.HEADER],
      starMetadata: {
        code_source: "abright25/star-VAmPI:original_main",
        databases: ["SQLAlchemy"],
        user_roles: ["admin"]
      },
      poolSize: +process.env.SECTESTER_SCAN_POOL_SIZE || undefined,
      testMetadata: {
        broken_access_control: {
          authObjectId: [null, "test-auth-object-123"]
        }
      }
    })
    .setFailFast(false)
    .timeout(timeout)
    .run({
      method: HttpMethod.GET,
      url: `${baseUrl}/books/Example%20Book%20Title`,
      headers: { Authorization: 'Bearer example_token' }
    });
});