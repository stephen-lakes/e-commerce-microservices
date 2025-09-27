export namespace AuthSample {
  export const signup = {
    email: `janedoe@email.com`,
    username: `JaneDoe`,
    password: `passcode`,
    firstname: `Jane`,
    lastname: `Doe`,
    middlename: `Anna`,
    dateOfBirth: new Date(),
    signInType: `default`,
  };

  export const signin = {
    username: `JaneDoe`,
    password: `passcode`,
  };

  export const user = {
    id: `6839a504f1e165bbc9f75e51`,
    username: `JamesSmith`,
    firstname: `James`,
    lastname: `Smith`,
    middlename: null,
    profileUrl: null,
    isVerified: false,
    role: `user`,
  };

  export const signupSuccess = {
    user,
  };

  export const token = {
    refreshToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzlhNTA0ZjFlMTY1YmJjOWY3NWU1MSIsImlhdCI6MTc0ODYwODMyOSwiZXhwIjoxNzQ4NjExOTI5fQ.i_RtRPIoFSk7Ae-opQ9FmME2nb5nyOidX_CvywA1imU`,
  };

  export const signinSuccess = {
    user,
    accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzlhNTA0ZjFlMTY1YmJjOWY3NWU1MSIsImlhdCI6MTc0ODYwODMyOSwiZXhwIjoxNzQ4NjExOTI5fQ.i_RtRPIoFSk7Ae-opQ9FmME2nb5nyOidX_CvywA1imU`,
    refreshToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzlhNTA0ZjFlMTY1YmJjOWY3NWU1MSIsImlhdCI6MTc0ODYwODMyOSwiZXhwIjoxNzQ4NjExOTI5fQ.i_RtRPIoFSk7Ae-opQ9FmME2nb5nyOidX_CvywA1imU`,
  };

  export const refresh = {
    accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzlhNTA0ZjFlMTY1YmJjOWY3NWU1MSIsImlhdCI6MTc0ODYwODMyOSwiZXhwIjoxNzQ4NjExOTI5fQ.i_RtRPIoFSk7Ae-opQ9FmME2nb5nyOidX_CvywA1imU`,
    refreshToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzlhNTA0ZjFlMTY1YmJjOWY3NWU1MSIsImlhdCI6MTc0ODYwODMyOSwiZXhwIjoxNzQ4NjExOTI5fQ.i_RtRPIoFSk7Ae-opQ9FmME2nb5nyOidX_CvywA1imU`,
  };

  export const appleAuthRequest = {
    idToken: `eyJraWQiOiJ...apple.jwt.token...`,
    accessToken: `access-token-if-available`, // optional
    provider: `apple`,
  };

  export const googleAuthRequest = {
    idToken: `eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...google.jwt.token...`,
    accessToken: `ya29.a0AfH6SM...google.access.token...`, // optional
    provider: `google`,
  };
}
