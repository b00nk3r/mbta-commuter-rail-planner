test('dotenv-flow loads .env.test into process.env', () => {
  expect(process.env.NODE_ENV).toBe('test');
  expect(process.env.DOTENV_FLOW_CHECK).toBe('from-env-test');
});