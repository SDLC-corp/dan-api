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
const domainRoute = require('./domain.route');
const shippingLinesRoute = require('./shippingLines.route');
const docsRoute = require('./docs.route');
const jobRoute = require('./jobs.route');
const dashboardAnalysisRoute = require('./dashboardAnalysis.route');
const documentNotesRoute = require('./documentNotes.route');
const portMasterRoute = require('./portmaster.route');
const airPortMasterRoute = require('./airPortMaster.route');
const approvedDocument = require('./approvedDocument.route');
const containerIsoCodesRoute = require('./containerIsoCodes.route');
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
    path: '/shipping-lines',
    route: shippingLinesRoute,
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
    path: '/domain',
    route: domainRoute,
  },
  {
    path: '/job',
    route: jobRoute,
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
    path: '/portmaster',
    route: portMasterRoute
  },
  {
    path: '/air-portmaster',
    route: airPortMasterRoute
  },
  {
    path: '/isoCodes',
    route: containerIsoCodesRoute
  },
  {
    path: '/approved',
    route: approvedDocument
  },
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
