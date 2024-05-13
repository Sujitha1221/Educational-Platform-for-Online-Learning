import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    info: {
      title: 'University Timetable Management System',
      version: '1.0.0',
      description: 'University Timetable Management System',
    },
  },
  apis: ['../routes/*.mjs'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
