import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Extrae el token del header Authorization
    const token = req.headers.authorization?.split(' ')[1]; 
    //Si no hay token, devuelve error 403
    if (!token) return res.status(403).json({ msg: 'Token no proporcionado' });

    try {
        // Verifica el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Añade la información decodificada del usuario al objeto request
        req.user = decoded; 
         // Pasa al siguiente middleware
        next();
    } catch (error) {
        return res.status(401).json({ msg: 'Token invalido' });
    }
};

export const requireAdmin = (req, res, next) => {
    // Verifica si el usuario tiene rol 'admin'
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
    }
    next();
};