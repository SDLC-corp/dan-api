const express = require('express');
const config = require('../../config/config');
const authRoute = require('./auth.route');
const usersRoute = require('./users.route');
const labelsRoute = require('./labels.route');
const logicRoute = require('./logic.route');
const roleRoute = require('./role.route');
const applicationModulesRoute = require('./applicationModules.route');
const fieldsRoute = require('./fields.route');
const fieldGroupRoute = require('./fieldGroup.route');
const documentsRoute = require('./document.route');
const documentTypesRoute = require('./documentType.route');
const docsRoute = require('./docs.route');
const dashboardAnalysisRoute = require('./dashboardAnalysis.route');
const documentNotesRoute = require('./documentNotes.route');
const organizationsRoute = require('./organizations.route')
const { uploadFile } = require('../../utils/fileUpload');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: usersRoute,
  },
  {
    path: '/document-type',
    route: documentTypesRoute,
  },
  {
    path: '/fields',
    route: fieldsRoute,
  },
  {
    path: '/field-group',
    route: fieldGroupRoute,
  },
  {
    path: '/labels',
    route: labelsRoute,
  },
  {
    path: '/logic',
    route: logicRoute,
  },
  {
    path: '/role',
    route: roleRoute,
  },
  {
    path: '/application-modules',
    route: applicationModulesRoute,
  },
  {
    path: '/documents',
    route: documentsRoute,
  },
  {
    path: '/dashboardAnalysis',
    route: dashboardAnalysisRoute,
  },
  {
    path: '/documentnotes',
    route: documentNotesRoute,
  },
  {
    path: '/organizations',
    route: organizationsRoute
  }
];

// routes available only in development mode
const devRoutes = [
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.route('/upload-file').post(uploadFile);


if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
