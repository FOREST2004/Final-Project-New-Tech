// Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
  try {
    // Check if user is authenticated (should be called after authenticateToken)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authorization failed',
      error: error.message
    });
  }
};

// Middleware to check if user is admin or accessing their own data
export const requireAdminOrOwner = (userIdParam = 'id') => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const requestedUserId = parseInt(req.params[userIdParam]);
      const currentUserId = req.user.id;

      // Allow if user is admin or accessing their own data
      if (req.user.role === 'admin' || currentUserId === requestedUserId) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization failed',
        error: error.message
      });
    }
  };
};