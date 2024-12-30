const Course = require('../models/Course');
const Student = require('../models/Student');

const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate('enrolledStudents', 'name');
    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
};

const addCourse = async (req, res, next) => {
  try {
    const { courseId, name, instructor, credits, maxStudents } = req.body;
    const course = new Course({ courseId, name, instructor, credits, maxStudents });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id, 
      req.body,      
      { new: true, runValidators: true } 
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json(updatedCourse);
  } catch (err) {
    next(err);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const student = await Student.findById(req.user.id);

    if (course.enrolledStudents.length >= course.maxStudents) {
      return res.status(400).json({ error: 'Course is full' });
    }

    if (student.registeredCourses.includes(course._id)) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    course.enrolledStudents.push(student._id);
    student.registeredCourses.push(course._id);

    await course.save();
    await student.save();

    res.status(200).json({ message: 'Enrolled successfully', course });
  } catch (err) {
    next(err);
  }
};

const unenrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const student = await Student.findById(req.user.id);

    if (!student.registeredCourses.includes(course._id)) {
      return res.status(400).json({ error: 'Student is not enrolled in this course' });
    }

    course.enrolledStudents = course.enrolledStudents.filter(
      (studentId) => studentId.toString() !== req.user.id
    );

    student.registeredCourses = student.registeredCourses.filter(
      (courseId) => courseId.toString() !== req.params.id
    );

    await course.save();
    await student.save();

    res.status(200).json({ message: 'Unenrolled successfully' });
  } catch (err) {
    next(err);
  }
};

const getStudentCredits = async (req, res, next) => {
  try {
    const student = req.userData;
    const courses = await Course.find({ _id: { $in: student.registeredCourses } });
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

    res.status(200).json({ totalCredits });
  } catch (err) {
    next(err);
  }
};

const getStudentCourses = async (req, res, next) => {
  try {
    const student = req.userData;
    const courses = await Course.find({ _id: { $in: student.registeredCourses } });

    res.status(200).json({ courses });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCourses, addCourse, updateCourse, deleteCourse, enrollCourse, unenrollCourse, getStudentCredits, getStudentCourses };
