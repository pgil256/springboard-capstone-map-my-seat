"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

//CRUD operations for students
class Student {
  //Create new student, add
  static async createStudent(data) {
    const result = await db.query(
      `INSERT INTO students (period_id,
                                 name,
                                 grade,
                                 gender,
                                 is_ESE AS "isESE",
                                 has_504 AS "has504",
                                 is_ELL AS "isELL",
                                 is_EBD AS "isEBD",
                                 )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING student_id AS "studentId", period_id AS "periodId", name, grade, gender, is_ESE AS "isESE", has_504 AS "has504", is_ELL AS "isELL", is_EBD AS "isEBD"`,
      [
        data.periodId,
        data.name,
        data.grade,
        data.gender,
        data.isESE,
        data.has504,
        data.isELL,
        data.isEBD,
      ]
    );

    if (data.grade !== number) {
      let grade_query = data.class_grade;
      let gradetoNum = grade_query.replace(/[^0-9]/g, "");
      console.log(gradetoNum);
      return (data.class_grade = gradetoNum);
    }
    let student = result.rows[0];

    return student;
  }

  //Update a particular student's particular fields
  static async updateStudents(studentId, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      studentId: "student_id",
      name: "name",
      grade: "grade",
      gender: "gender",
      isESE: "is_ESE",
      has504: "has_504",
      isELL: "isELL",
      isEBD: "isEBD",
    });
    const studentIdVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE students 
                      SET ${setCols} 
                      WHERE id = ${studentIdVarIdx} 
                      RETURNING name, 
                                grade,
                                gender,
                                is_ESE AS "isESE",
                                has_504 AS "has504",
                                is_ELL AS "isELL",
                                is_EBD AS "isEBD`;
    const result = await db.query(querySql, [...values, studentId]);
    const student = result.rows[0];

    if (!student)
      throw new NotFoundError(`No student with id of  ${studentId}`);

    return student;
  }

  //Given a particular student, remove them based on their studentId,
  static async deleteStudent(studentId) {
    const result = await db.query(
      `DELETE
           FROM students
           WHERE id = $1
           RETURNING name`,
      [studentId]
    );
    const student = result.rows[0];

    if (!student)
      throw new NotFoundError(`No student with id of  ${studentId}`);
  }
}

module.exports = Student;
