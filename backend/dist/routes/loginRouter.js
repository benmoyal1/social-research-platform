import { Router } from 'express';
import { generateToken } from '../middleware/auth.js';
// Create the router
const router = Router();
// API endpoint to compare username and password with env variables
router.post('/ilan', (req, res) => {
    const { username, password } = req.body;
    // Retrieve credentials from environment variables
    const envUsername = process.env.ILAN_USER;
    const envPassword = process.env.ILAN_PASS;
    // Check if the received username and password match the environment variables
    if (username === envUsername && password === envPassword) {
        // Generate JWT token
        const token = generateToken(username);
        res.status(200).json({
            message: 'Login successful',
            token: token,
            expiresIn: '3h',
            username: username
        });
    }
    else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});
export default router;
//# sourceMappingURL=loginRouter.js.map