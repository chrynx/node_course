/*
    Create and export config variables
 */

// Container for all the environments
const environments = {};

// staging environment
environments.staging = {
    'envName': 'staging',
    'port': 3000
};

// production environment
environments.production = {
    'envName': 'production'    ,
    'port': 5000
};

// Determine which env to use
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check if currentEnvironment is available
const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments['staging'];

// export module
module.exports = environmentToExport;