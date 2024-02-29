import 'express'
import { AppUser } from '../../models/user'

declare global {
  namespace Express {
       interface User extends AppUser {}
    }
  }