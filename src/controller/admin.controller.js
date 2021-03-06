const emailValidator = require('email-validator');

const logger = require('../logger/logger');

const teacherModel = require('../model/teacher.model');
const studentModel = require('../model/student.model');
const teacherClassModel = require('../model/teacherClass.model');

const { createErrorJson } = require('../utility/json-builder');
const WarnError = require('../utility/error-utility');

const verifyJsonData = (...args) => {
  args.forEach(arg => {
    if (arg === undefined) {
      throw new WarnError('Request data unknown');
    }
  });
};

const adminController = {
  registerStudent: async (req, res) => {
    const { teacher, students } = req.body;

    try {
      // Check undefined fields
      verifyJsonData(teacher, students);

      // Check teacher data format
      if (!emailValidator.validate(teacher)) {
        throw new WarnError(`${teacher} is invalid`);
      }

      // Check student data format
      students.forEach(student => {
        if (!emailValidator.validate(student)) {
          throw new WarnError(`${student} is invalid`);
        }
      });

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

      logger.info(`Successfully added ${students} for ${teacher}`);
    } catch (err) {
      if (err instanceof WarnError) {
        logger.warn(err.message);
      } else {
        logger.error(err.message);
      }

      res.send(createErrorJson(err));
    }
  },
  getCommonStudent: async (req, res) => {
    let teacherArr = req.query.teacher;

    try {
      // Check undefined field
      if (teacherArr === undefined) {
        throw new WarnError('data is undefined');
      }

      // Check if only single teacher query
      if (!(teacherArr instanceof Array)) {
        teacherArr = [teacherArr];
      }

      teacherArr.forEach(teacher => {
        if (!emailValidator.validate(teacher)) {
          throw new WarnError(`${teacher} is invalid`);
        }
      });

      // Get common students id
      const commonTeacherMember = await teacherClassModel.getCommonTeacher(
        teacherArr
      );

      if (commonTeacherMember === undefined) {
        throw new WarnError('Teacher does not exist');
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
      if (err instanceof WarnError) {
        logger.warn(err.message);
      } else {
        logger.error(err.message);
      }

      res.send(createErrorJson(err));
    }
  },
  suspendsStudent: async (req, res) => {
    const { student } = req.body;

    try {
      // Check if data exists
      verifyJsonData(student);

      // Check email format
      if (!emailValidator.validate(student)) {
        throw new WarnError(`${student} is invalid`);
      }

      const { affectedRows } = await studentModel.changeSuspendStatus(
        student,
        true
      );

      if (affectedRows === 0) {
        throw new WarnError('Student does not exists');
      }

      res
        .header('Content-Type', 'application/json')
        .status(204)
        .send();

      logger.info(`Successfully suspend ${student}`);
    } catch (err) {
      if (err instanceof WarnError) {
        logger.warn(err.message);
      } else {
        logger.error(err.message);
      }

      res.send(createErrorJson(err));
    }
  },
  receiveNotification: async (req, res) => {
    const { teacher, notification } = req.body;

    try {
      // Check request data exists
      verifyJsonData(teacher, notification);

      // Check teacher email
      if (!emailValidator.validate(teacher)) {
        throw new WarnError(`${teacher} is invalid`);
      }

      // Check notification
      if (
        typeof notification !== 'string' &&
        !(notification instanceof String)
      ) {
        throw new WarnError(`${notification} is invalid`);
      }

      // Parse notification
      const tagRegex = /(@[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+\b)/;
      let tags = tagRegex.exec(notification);

      const tagEmails = [];

      while (tags !== null) {
        tagEmails.push(tags[0].substring(1));
        tags = tagRegex.exec(tags.input.substring(tags.index + 1));
      }

      // Get student status for tags
      const tagPromises = tagEmails.map(
        email =>
          new Promise(async (resolve, _reject) => {
            const [student] = await studentModel.getStudent(email);

            resolve(student);
          })
      );

      const teacherMembers = await teacherClassModel.getTeacherClassMember(
        teacher
      );

      // Get student status for students under the teacher
      const teacherMemberPromises = teacherMembers.map(
        teacherMember =>
          new Promise(async (resolve, _reject) => {
            const { studentId } = teacherMember;
            const [student] = await studentModel.getStudentById(studentId);

            resolve(student);
          })
      );

      const combinedPromises = [...tagPromises, ...teacherMemberPromises];

      let studentsData = await Promise.all(combinedPromises);

      studentsData = [...studentsData.filter(student => !student.isSuspended)];

      let studentEmails = studentsData.map(student => student.email);

      // Remove duplicated email
      studentEmails = [
        ...studentEmails.filter(
          (email, index, arr) => arr.indexOf(email) === index
        ),
      ];

      const responseJson = {};
      responseJson.recipients = studentEmails;

      res
        .header('Content-Type', 'application/json')
        .status(200)
        .send(responseJson);
    } catch (err) {
      if (err instanceof WarnError) {
        logger.warn(err.message);
      } else {
        logger.error(err.message);
      }

      res.send(createErrorJson(err));
    }
  },
};

module.exports = adminController;
