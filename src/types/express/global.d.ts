import 'express'
import { AppUser } from '../../models/user'

declare global {
  namespace Express {
       interface User extends AppUser {}
       interface Request {
        flash(message: string): unknown;
        flash(event: string, message: string): unknown;
      }
    }
  }