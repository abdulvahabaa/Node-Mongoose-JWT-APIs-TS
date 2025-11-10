declare global {
  namespace Express {
    /**
     * Extended Request interface with user property
     */
    interface Request {
      /**
       * User object attached after authentication
       */
      user?: {
        _id: string;
        email: string;
        username: string;
        role: string;
        [key: string]: any; // Allow additional properties if needed
      };

      /**
       * Custom properties for validation results (optional)
       */
      validatedData?: {
        body?: any;
        query?: any;
        params?: any;
      };
    }
  }
}

// This export is required to make this a module
export {};
