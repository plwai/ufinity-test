const db = require('./dbconnection');
const teacherModel = require('./teacher.model');

const TeacherClass = {
  getTeacherClassMember: async teacherId => {
    const params = [];
    params.push(teacherId);

    return db.query('SELECT * FROM teacherclass WHERE teacherId=?', params);
  },
  getCommonTeacher: async teacherEmails => {
    const params = [];

    const getTeacherPromises = teacherEmails.map(email =>
      teacherModel.getTeacher(email)
    );

    let teachers = await Promise.all(getTeacherPromises);

    teachers = teachers.filter(teacher => teacher.length);

    const teacherIds = teachers.map(teacher => teacher[0].teacherId);

    params.push(teacherIds);
    params.push(teacherIds.length);

    if (teacherIds.length === 0) {
      return Promise.resolve();
    }

    return db.query(
      'SELECT * FROM teacherclass WHERE teacherId in (?) GROUP BY studentId HAVING COUNT(DISTINCT teacherId) = ?',
      params
    );
  },
  addTeacherClassMember: async (teacherId, studentId) => {
    const params = [];
    params.push(teacherId);
    params.push(studentId);

    // Check if duplicate teacher and student
    const classMember = await TeacherClass.getTeacherClassMember(teacherId);

    const isExisted = classMember.find(
      member => member.studentId === studentId
    );

    if (isExisted) {
      // Duplicated return void
      return Promise.resolve();
    }

    return db.query(
      'INSERT INTO teacherclass (teacherId, studentId) VALUES(?, ?)',
      params
    );
  },
};

module.exports = TeacherClass;
