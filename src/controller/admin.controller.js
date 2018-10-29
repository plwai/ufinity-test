const teacherModel = require('../model/teacher.model');
const studentModel = require('../model/student.model');
const teacherClassModel = require('../model/teacherClass.model');

const adminController = {
  registerStudent: async (req, res) => {
    const requestJson = req.body;

    // Check fields
    if (
      requestJson.teacher === undefined ||
      requestJson.students === undefined
    ) {
      res.send('Error');
      return;
    }

    try {
      // Get teacher
      let selectedTeacher = await teacherModel.getTeacher(requestJson.teacher);
      let teacherId;

      if (selectedTeacher.length === 0) {
        selectedTeacher = await teacherModel.registerTeacher(
          requestJson.teacher
        );

        teacherId = selectedTeacher.insertId;
      } else {
        const [first] = selectedTeacher;
        ({ teacherId } = first);
      }

      // Add student and link into class
      const promisesContainer = requestJson.students.map(
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

      await Promise.all(promisesContainer);
    } catch (err) {
      res.send('Error');
      return;
    }

    res
      .header('Content-Type', 'application/json')
      .status(204)
      .send();
  },
};

module.exports = adminController;
