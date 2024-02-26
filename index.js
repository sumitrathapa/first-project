import express from "express";
import connectDB from "./connect.db.js";
import Course from "./course.model.js";
import mongoose from "mongoose";

const app = express();
// to make app understand json
app.use(express.json());

//*************************database connection*****************
connectDB();

//**************************routes*****************************
app.post("/course/add", async (req, res) => {
  const newCourse = req.body;

  await Course.create(newCourse);
  return res.status(201).send({ message: "Course is added succesfully" });
});

//? get course list
app.get("/course/list", async (req, res) => {
  const courseList = await Course.find();
  return res.status(200).send({ message: "success", course: courseList });
});

//get course details by _id
app.get("/course/details/:id", async (req, res) => {
  // extract course id from req.params
  const courseId = req.params.id;

  // validate for mongo id
  const isValidMongoId = mongoose.isValidObjectId(courseId);

  //if not valid mongo id
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // find course by id
  const requiredCourse = await Course.findOne({ _id: courseId });

  // if not course,throw error
  if (!requiredCourse) {
    return res.status(404).send({ message: "Course doesnot exit" });
  }

  // send res

  return res
    .status(200)
    .send({ message: "Sucess", courseDetails: requiredCourse });
});

//? delete a course by id

app.delete("/course/delete/:id", async (req, res) => {
  // extract course id from req.params
  const courseId = req.params.id;

  // check for mongo id validity
  const isValidMongoId = mongoose.isValidObjectId(courseId);

  // if not valid mongo id, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }
  // find course by id
  const requiredCourse = await Course.findOne({ _id: courseId });
  // if not course, throw error
  if (!requiredCourse) {
    return res.status(404).send({ message: "Course doesnot exist." });
  }
  // delete course
  await Course.deleteOne({ _id: courseId });
  // send response
  return res.status(200).send({ message: "Course is deleted successfully" });
});

//************************ port and sever**********************
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
