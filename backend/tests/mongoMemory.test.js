const mongoose = require('mongoose');

describe('mongodb-memory-server is used', () => {
  test('connected to in-memory host/port and can perform CRUD', async () => {
    expect(mongoose.connection.readyState).toBe(1);

    const url = new URL(global.__MONGO_URI__);
    expect(mongoose.connection.host).toBe(url.hostname);
    expect(String(mongoose.connection.port)).toBe(url.port);

    const Test =
      mongoose.models.TestPing ||
      mongoose.model('TestPing', new mongoose.Schema({ name: String }));

    const created = await Test.create({ name: 'ok' });
    const found = await Test.findById(created._id);
    expect(found).toBeTruthy();
    expect(found.name).toBe('ok');
  });
});