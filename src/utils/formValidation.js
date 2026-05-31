import validator from "validator";

const allowedGender = ["male", "female"];

export const signupValidation = (req) => {
  const { email, firstName, lastName, password, gender,username } = req.body;
  const errors = {};

  if (!username?.trim()) {
    errors.username = "Username is required";
  }
  if (!firstName?.trim()) {
    errors.firstName = "First name is required";
  }
  if (!lastName?.trim()) {
    errors.lastName = "Last name is required";
  }
  if (!validator.isEmail(email || "")) {
    errors.email = "Invalid email";
  }
  if (!validator.isStrongPassword(password || "")) {
    errors.password = "Password is not strong enough";
  }
  if (!allowedGender.includes(gender)) {
    errors.gender = "Invalid gender";
  }

  if (Object.keys(errors).length > 0) {
    throw { errors };
  }
};
