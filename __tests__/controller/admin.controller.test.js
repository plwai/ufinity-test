const db = require('../../src/model/dbconnection');
const adminController = require('../../src/controller/admin.controller');

const chainFunction = function chainFn() {
  return this;
};

test('Should register teacher and student with respond send 204 HTTP to user', async () => {
  const body = {
    teacher: 'teacherken@gmail.com',
    students: ['studentjon@example.com', 'studenthon@example.com'],
  };

  const send = jest.fn(chainFunction);
  const header = jest.fn(chainFunction);
  const status = jest.fn(chainFunction);

  const res = { header, status, send };
  const req = { body };

  await adminController.registerStudent(req, res);

  // Check response
  expect(send.mock.calls).toHaveLength(1);

  expect(header.mock.calls).toHaveLength(1);
  expect(header.mock.calls[0][0]).toBe('Content-Type', 'application/json');

  expect(status.mock.calls).toHaveLength(1);
  expect(status.mock.calls[0][0]).toBe(204);
});

afterAll(async () => {
  await db.close();
});
