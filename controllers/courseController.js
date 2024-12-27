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
      req.params.id, // Course ID from URL
      req.body,      // Fields to update
      { new: true, runValidators: true } // Options: return updated doc and validate
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
      const student = req.userData;
  
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
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
  
      res.status(200).json({ message: 'Enrolled successfully' });
    } catch (err) {
      next(err);
    }
  };

module.exports = { getCourses, addCourse, updateCourse, deleteCourse, enrollCourse };
