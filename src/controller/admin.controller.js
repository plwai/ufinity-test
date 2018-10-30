const teacherModel = require('../model/teacher.model');
const studentModel = require('../model/student.model');
const teacherClassModel = require('../model/teacherClass.model');

const verifyJsonData = (...args) => {
  args.forEach(arg => {
    if (arg === undefined) {
      throw new Error('Request data unknown');
    }
  });
};

const createErrorJson = err => {
  const errorJson = { message: err.message };
  return errorJson;
};

const adminController = {
  registerStudent: async (req, res) => {
    const { teacher, students } = req.body;

    try {
      // Check fields
      verifyJsonData(teacher, students);

      // Get teacher
      let selectedTeacher = await teacherModel.getTeacher(teacher);
      let teacherId;

      if (selectedTeacher.length === 0) {
        selectedTeacher = await teacherModel.registerTeacher(teacher);

        teacherId = selectedTeacher.insertId;
      } else {
        const [first] = selectedTeacher;
        ({ teacherId } = first);
      }

      // Add student and link into class
      const registerPromises = students.map(
        student =>
          new Promise(async (resolve, _reject) => {
            let studentId;
            let selectedStudent = await studentModel.getStudent(student);

            if (selectedStudent.length === 0) {
              selectedStudent = await studentModel.registerStudent(student);

              studentId = selectedStudent.insertId;
            } else {
              const [first] = selectedStudent;
              ({ studentId } = first);
            }

            await teacherClassModel.addTeacherClassMember(teacherId, studentId);

            resolve();
          })
      );

      await Promise.all(registerPromises);

      res
        .header('Content-Type', 'application/json')
        .status(204)
        .send();
    } catch (err) {
      res.send(createErrorJson(err));
    }
  },
  getCommonStudent: async (req, res) => {
    let teacherArr = req.query.teacher;

    // Check if only single teacher query
    if (!(teacherArr instanceof Array)) {
      teacherArr = [teacherArr];
    }

    try {
      // Get common students id
      const commonTeacherMember = await teacherClassModel.getCommonTeacher(
        teacherArr
      );

      if (commonTeacherMember === undefined) {
        throw new Error('Teacher does not exist');
      }

      // Translate id into student model
      const studentNamePromises = commonTeacherMember.map(member =>
        studentModel.getStudentById(member.studentId)
      );

      const commonStudent = await Promise.all(studentNamePromises);

      // Construct respond JSON
      const resJSON = {};

      resJSON.students = commonStudent.map(student => student[0].email);

      res
        .header('Content-Type', 'application/json')
        .status(200)
        .send(resJSON);
    } catch (err) {
      res.send(createErrorJson(err));
    }
  },
  suspendsStudent: async (req, res) => {
    const { student } = req.body;

    try {
      // Check if data correct
      verifyJsonData(student);

      const { affectedRows } = await studentModel.changeSuspendStatus(
        student,
        true
      );

      if (affectedRows === 0) {
        throw new Error('Student does not exists');
      }

      res
        .header('Content-Type', 'application/json')
        .status(204)
        .send();
    } catch (err) {
      res.send(createErrorJson(err));
    }
  },
};

module.exports = adminController;
