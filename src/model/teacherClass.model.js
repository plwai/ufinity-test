const db = require('./dbconnection');

const TeacherClass = {
  getTeacherClassMember: async teacherId => {
    const params = [];
    params.push(teacherId);

    return db.query('SELECT * FROM teacherclass WHERE teacherId=?', params);
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
