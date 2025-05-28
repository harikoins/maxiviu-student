// src/utils/validators.ts

// Email validation using regex
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateEmail = (_: any, value: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!value) {
    return Promise.reject(new Error('Please input your email!'));
  }

  if (!emailRegex.test(value)) {
    return Promise.reject(new Error('Please enter a valid email address!'));
  }

  return Promise.resolve();
};

// Password validation with multiple requirements
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validatePassword = (_: any, value: string) => {
  if (!value) {
    return Promise.reject(new Error('Please input your password!'));
  }

  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  const errors = [];
  
  if (value.length < minLength) {
    errors.push(`at least ${minLength} characters`);
  }
  if (!hasUpperCase) {
    errors.push('one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('one lowercase letter');
  }
  if (!hasNumber) {
    errors.push('one number');
  }
  if (!hasSpecialChar) {
    errors.push('one special character');
  }

  if (errors.length > 0) {
    return Promise.reject(
      new Error(`Password must contain ${errors.join(', ')}`)
    );
  }

  return Promise.resolve();
};

// Optional: Export a validation schema that can be used with Formik or other form libraries
export const validationSchema = {
  email: [
    { required: true, message: 'Email is required' },
    { validator: validateEmail },
  ],
  password: [
    { required: true, message: 'Password is required' },
    { validator: validatePassword },
  ],
};