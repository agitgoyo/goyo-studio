export function isAdminRequest(request) {
  const password = request.headers.get("x-admin-password");
  return Boolean(password) && password === process.env.ADMIN_PASSWORD;
}
