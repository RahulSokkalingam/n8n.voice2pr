import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

k constructor(authService: AuthService) {
    this.authService = authService;
  }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const { email, password } = req.body;
      const result = await this.authService.login(email, password);

      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async obtainProfile(req: Response, res: Response): Promise<Response> {
    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return res.status(401).json({ message: 'Unauthorized: User context missing' });
      }

      const profile = await this.authService.getUserById(user.id);
      if (!profile) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(profile);
    } catch (error) {
      console.error('Get profile error:, error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
