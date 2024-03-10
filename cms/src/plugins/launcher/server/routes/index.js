module.exports = [
  {
    method: 'GET',
    path: '/versionTable',
    handler: 'launcher.versionTable',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/latest',
    handler: 'launcher.latest',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/packages',
    handler: 'launcher.packages',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/packages/:name/:version',
    handler: 'launcher.packageManifest',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/domain/:name',
    handler: 'launcher.domain',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/news',
    handler: 'launcher.news',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/news/:id',
    handler: 'launcher.packageNews',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'POST',
    path: '/create',
    handler: 'launcher.create',
    config: {
      policies: []
    },
  },
  {
    method: 'DELETE',
    path: '/delete/:id',
    handler: 'launcher.delete',
    config: {
      policies: []
    },
  }
];
