import createError from "http-errors";
import express, { json, urlencoded, static as staticVar } from "express";
import cors from 'cors'
import { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import groupRouter from "./routes/group.routes.js";
import entryRouter from "./routes/entry.routes.js";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

// view engine setup
app.set("views", join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cors())
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(staticVar(join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/group", groupRouter);
app.use("/entry", entryRouter);
app.get("/test", (req, res) => {
  console.log(req.body);
  res.json({ data: req.body });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
