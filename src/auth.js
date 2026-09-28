export function login(abha) {
  localStorage.setItem('currentAbha', abha)
}
export function logout() {
  localStorage.removeItem('currentAbha')
}
export function currentAbha() {
  return localStorage.getItem('currentAbha')
}