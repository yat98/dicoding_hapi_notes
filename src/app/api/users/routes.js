export const routes = (handler, validator) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
    options: {
      validate: validator.addUserValidation,
    },
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
  },
];
