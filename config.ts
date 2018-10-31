export const SERVER_CONFIG = {
    development: {
        db: {
            database: 'integration',
            host: 'localhost',
            password: 'root',
            port: '5433',
            user: 'armine_ha',
        },
        server: {
            baseURL: '/api/v2',
            logDir: 'server-log-dev',
            logLevel: 'debug',
            port: '4500',
        },
    },
    production: {
        db: {
            database: 'integration',
            host: 'localhost',
            password: 'root',
            port: '5432',
            user: 'armine_ha',
        },
        server: {
            baseURL: '/api/v2',
            httpsCaFiles: [
                './sslCertificates/COMODORSAAddTrustCA.crt',
                './sslCertificates/COMODORSAExtendedValidationSecureServerCA.crt',
            ],
            httpsCertFile: './sslCertificates/85809002repl_1.crt',
            httpsKeyFile: './sslCertificates/private-key.pem',
            logDir: 'server-log-prod',
            logLevel: 'warning',
            port: '4500',
        },
    },
    test: {
        db: {
            database: 'testdb',
            host: 'localhost',
            password: 'root',
            port: '5433',
            user: 'armine_ha',
        },
        server: {
            baseURL: '/api/v2',
            logDir: 'server-log-dev',
            logLevel: 'debug',
            port: '4500',
        },
    },
};
