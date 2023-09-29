export const routes = (handler, validator) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuthenticationHandler,
    options: {
      validate: validator.addAuthenticationValidation,
    },
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAuthenticationHandler,
    options: {
      validate: validator.updateAuthenticationValidation,
    },
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuthenticationHandler,
    options: {
      validate: validator.deleteAuthenticationValidation,
    },
  },
];
