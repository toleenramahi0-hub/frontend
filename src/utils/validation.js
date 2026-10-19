// Client-side checks for UC-U01 / UC-U02. The backend must repeat them;
// these only give the user fast feedback.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// 3–30 chars, starts with a letter, then letters, digits, "_" or ".".
export const USERNAME_RE = /^[A-Za-z][A-Za-z0-9_.]{2,29}$/

export const messages = {
  required: 'هذا الحقل مطلوب',
  nameLength: 'يجب أن يتكون الاسم من حرفين على الأقل',
  email: 'أدخل بريداً إلكترونياً صالحاً',
  username: 'من 3 إلى 30 حرفاً إنجليزياً، يبدأ بحرف، ويسمح بالأرقام و _ و .',
  passwordLength: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل',
  passwordStrength: 'يجب أن تحتوي كلمة المرور على حرف ورقم على الأقل',
  passwordMatch: 'كلمتا المرور غير متطابقتين',
  usernameTaken: 'اسم المستخدم مستخدم بالفعل، اختر اسماً آخر',
  emailTaken: 'هذا البريد الإلكتروني مرتبط بحساب موجود بالفعل',
}

export function validateRegister({ name, username, email, password, passwordConfirmation }) {
  const errors = {}
  const trimmedName = name.trim()

  if (!trimmedName) errors.name = messages.required
  else if (trimmedName.length < 2) errors.name = messages.nameLength

  if (!username) errors.username = messages.required
  else if (!USERNAME_RE.test(username)) errors.username = messages.username

  if (!email.trim()) errors.email = messages.required
  else if (!EMAIL_RE.test(email.trim())) errors.email = messages.email

  if (!password) errors.password = messages.required
  else if (password.length < 8) errors.password = messages.passwordLength
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) errors.password = messages.passwordStrength

  if (!passwordConfirmation) errors.passwordConfirmation = messages.required
  else if (password !== passwordConfirmation) errors.passwordConfirmation = messages.passwordMatch

  return errors
}

export function validateLogin({ login, password }) {
  const errors = {}
  if (!login.trim()) errors.login = messages.required
  if (!password) errors.password = messages.required
  return errors
}
