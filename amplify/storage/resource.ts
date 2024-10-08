import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'app-upload-konecta',
  access: (allow) => ({
    'uploads/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read','write']),
    ]
  })
});