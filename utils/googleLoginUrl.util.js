const queryString = require('querystring');
const dotenv = require('dotenv')
dotenv.config({ path: '.env' });

const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    redirect_uri: 'https://readaway.app/api/auth/google',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '), // space seperated string
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
});
  
const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

module.exports = googleLoginUrl;