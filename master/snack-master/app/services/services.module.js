
import { UserService } from './user.service.js';

export const ServicesModule = angular
  .module('app.services', [])
  .service('UserService', UserService)
  .name;