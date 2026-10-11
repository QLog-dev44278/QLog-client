const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string) {
  if (!email.trim()) return '이메일을 입력해 주세요'
  if (!EMAIL_PATTERN.test(email)) return '이메일 형식이 올바르지 않아요'
  return undefined
}

/** 8자 이상, 영문과 숫자 포함 */
export function validatePassword(password: string) {
  if (!password) return '비밀번호를 입력해 주세요'
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return '8자 이상, 영문과 숫자를 포함해 주세요'
  }
  return undefined
}
