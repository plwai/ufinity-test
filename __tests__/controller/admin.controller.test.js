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

test('Duplicate registration should do nothing and return 204 http', async () => {
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
  await adminController.registerStudent(req, res);

  // Check response
  expect(send.mock.calls).toHaveLength(2);

  expect(header.mock.calls).toHaveLength(2);
  expect(header.mock.calls[0][0]).toBe('Content-Type', 'application/json');
  expect(header.mock.calls[1][0]).toBe('Content-Type', 'application/json');

  expect(status.mock.calls).toHaveLength(2);
  expect(status.mock.calls[0][0]).toBe(204);
  expect(status.mock.calls[1][0]).toBe(204);
});

test('Undefine registration should send error ', async () => {
  const body = {};

  const send = jest.fn(chainFunction);
  const header = jest.fn(chainFunction);
  const status = jest.fn(chainFunction);

  const res = { header, status, send };
  const req = { body };

  await adminController.registerStudent(req, res);

  // Check response
  expect(send.mock.calls).toHaveLength(1);
  expect(send.mock.calls[0][0]).toStrictEqual({
    message: 'Request data unknown',
  });
});

test('Get common student with multiple query and data exists in db', async () => {
  // Construct init data
  let body = {
    teacher: 'teacherken@commontest.com',
    students: [
      'studentjon@commontest.com',
      'studenthon@commontest.com',
      'studentlaw@commontest.com',
    ],
  };

  const send = jest.fn(chainFunction);
  const header = jest.fn(chainFunction);
  const status = jest.fn(chainFunction);

  let res = { header, status, send };
  let req = { body };

  await adminController.registerStudent(req, res);

  body = {
    teacher: 'teacherhon@commontest.com',
    students: [
      'studentken@commontest.com',
      'studenthon@commontest.com',
      'studentlaw@commontest.com',
    ],
  };

  req = { body };

  await adminController.registerStudent(req, res);

  const query = {};

  query.teacher = ['teacherken@commontest.com', 'teacherhon@commontest.com'];

  res = { header, status, send };
  req = { query };

  await adminController.getCommonStudent(req, res);

  const expectedValue = {};
  expectedValue.students = [
    'studenthon@commontest.com',
    'studentlaw@commontest.com',
  ];

  // Check response
  expect(send.mock.calls).toHaveLength(3);
  expect(send.mock.calls[2][0]).toStrictEqual(expectedValue);

  expect(status.mock.calls).toHaveLength(3);
  expect(status.mock.calls[2][0]).toBe(200);
});

test('Get common student with single query and data exists in db', async () => {
  // Construct init data
  let body = {
    teacher: 'teacherken@commonsingletest.com',
    students: [
      'studentjon@commonsingletest.com',
      'studenthon@commonsingletest.com',
      'studentlaw@commonsingletest.com',
    ],
  };

  const send = jest.fn(chainFunction);
  const header = jest.fn(chainFunction);
  const status = jest.fn(chainFunction);

  let res = { header, status, send };
  let req = { body };

  await adminController.registerStudent(req, res);

  body = {
    teacher: 'teacherhon@commonsingletest.com',
    students: [
      'studentken@commonsingletest.com',
      'studenthon@commonsingletest.com',
      'studentlaw@commonsingletest.com',
    ],
  };

  req = { body };

  await adminController.registerStudent(req, res);

  const query = {};

  query.teacher = 'teacherken@commonsingletest.com';

  res = { header, status, send };
  req = { query };

  await adminController.getCommonStudent(req, res);

  const expectedValue = {};
  expectedValue.students = [
    'studentjon@commonsingletest.com',
    'studenthon@commonsingletest.com',
    'studentlaw@commonsingletest.com',
  ];

  // Check response
  expect(send.mock.calls).toHaveLength(3);
  expect(send.mock.calls[2][0]).toStrictEqual(expectedValue);

  expect(status.mock.calls).toHaveLength(3);
  expect(status.mock.calls[2][0]).toBe(200);
});

test('Get common student with data NOT exists in db', async () => {
  const send = jest.fn(chainFunction);
  const status = jest.fn(chainFunction);

  const query = {};

  query.teacher = 'teacherken@commonsinglenottest.com';

  const res = { status, send };
  const req = { query };

  await adminController.getCommonStudent(req, res);

  // Check response
  expect(send.mock.calls).toHaveLength(1);
  expect(send.mock.calls[0][0]).toStrictEqual({
    message: 'Teacher does not exist',
  });

  expect(status.mock.calls).toHaveLength(0);
});

test('Suspend student', async () => {
  // Construct init data
  let body = {
    teacher: 'teacherken@suspend.com',
    students: ['studenttest@suspend.com'],
  };

  const send = jest.fn(chainFunction);
  const header = jest.fn(chainFunction);
  const status = jest.fn(chainFunction);

  let res = { header, status, send };
  let req = { body };

  await adminController.registerStudent(req, res);

  body = {};
  body.student = 'studenttest@suspend.com';

  res = { header, status, send };
  req = { body };

  await adminController.suspendsStudent(req, res);

  // Check response
  expect(send.mock.calls).toHaveLength(2);

  expect(header.mock.calls).toHaveLength(2);
  expect(header.mock.calls[1][0]).toBe('Content-Type', 'application/json');

  expect(status.mock.calls).toHaveLength(2);
  expect(status.mock.calls[1][0]).toBe(204);
});

test('Suspend student no student', async () => {
  const body = {};
  body.student = 'studenttest@suspendNoStudent.com';

  const send = jest.fn(chainFunction);
  const header = jest.fn(chainFunction);
  const status = jest.fn(chainFunction);

  const res = { header, status, send };
  const req = { body };

  await adminController.suspendsStudent(req, res);

  // Check response
  expect(send.mock.calls).toHaveLength(1);
  expect(send.mock.calls[0][0]).toStrictEqual({
    message: 'Student does not exists',
  });
});

test('Suspend student request unknown', async () => {
  const body = {};

  const send = jest.fn(chainFunction);
  const header = jest.fn(chainFunction);
  const status = jest.fn(chainFunction);

  const res = { header, status, send };
  const req = { body };

  await adminController.suspendsStudent(req, res);

  // Check response
  expect(send.mock.calls).toHaveLength(1);
  expect(send.mock.calls[0][0]).toStrictEqual({
    message: 'Request data unknown',
  });
});

afterAll(async () => {
  await db.close();
});
