/**
 * @license Plannectme v0.0.1
 * (c) 2016-2017 Plannectme, Inc.
 * License: Plannectme
 * Description: Not using at the moment
 */
angular.module("app").constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});
