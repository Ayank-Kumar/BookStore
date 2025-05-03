
export default {
    oidc: {
        clientId: '0oamjrgp4v2lFf6vR5d7',
        issuer: 'https://dev-90538180.okta.com/oauth2/default',
        redirectUri: 'http://localhost:4200/login/callback',
        // redirectUri: 'https://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email'],
        prompt: 'login'
    }
}
