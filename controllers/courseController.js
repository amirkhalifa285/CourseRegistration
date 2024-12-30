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
    // Find course by _id (MongoDB default field)
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const student = await Student.findById(req.user.id);

    // Check if the course is full
    if (course.enrolledStudents.length >= course.maxStudents) {
      return res.status(400).json({ error: 'Course is full' });
    }

    // Check if the student is already enrolled
    if (student.registeredCourses.includes(course._id)) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Add student to the course
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
    // Find the course by ID
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const student = await Student.findById(req.user.id);

    // Check if the student is enrolled in the course
    if (!student.registeredCourses.includes(course._id)) {
      return res.status(400).json({ error: 'Student is not enrolled in this course' });
    }

    // Remove the student from the course's enrolled students
    course.enrolledStudents = course.enrolledStudents.filter(
      (studentId) => studentId.toString() !== req.user.id
    );

    // Remove the course from the student's registered courses
    student.registeredCourses = student.registeredCourses.filter(
      (courseId) => courseId.toString() !== req.params.id
    );

    // Save the updated documents
    await course.save();
    await student.save();

    res.status(200).json({ message: 'Unenrolled successfully' });
  } catch (err) {
    next(err);
  }
};

const getStudentCredits = async (req, res) => {
  try {
    const studentId = req.user.id; 

    // Find all courses where the student is enrolled
    const courses = await Course.find({ enrolledStudents: studentId }).populate('enrolledStudents', 'name');

    // Calculate total credits
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

    return res.status(200).json({ totalCredits });
  } catch (error) {
    console.error('Error fetching total credits:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getStudentCourses = async (req, res) => {
  try {
    const studentId = req.user.id; // Assuming `authMiddleware` sets the logged-in user's ID

    // Find all courses where the student is enrolled
    const courses = await Course.find({ students: studentId });

    return res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching student courses:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCourses, addCourse, updateCourse, deleteCourse, enrollCourse, unenrollCourse, getStudentCredits, getStudentCourses };
