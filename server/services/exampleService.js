// Example service for business logic

export class ExampleService {
  constructor() {
    // Initialize service
  }

  async processData(data) {
    try {
      // Example data processing logic
      const processedData = {
        ...data,
        processed: true,
        processedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: processedData
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async validateInput(input) {
    // Example validation logic
    const errors = [];

    if (!input.name || input.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!input.description || input.description.trim().length === 0) {
      errors.push('Description is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async formatResponse(data, message = 'Success') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }
}

export default new ExampleService();