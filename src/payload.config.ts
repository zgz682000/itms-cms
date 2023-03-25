import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import Dists from './collections/Dists';
import App from './collections/App';
import IPALib from './collections/IPALib';
import APKLib from './collections/APKLib';
// import Examples from './collections/Examples';
const uploadHookPath = path.resolve(__dirname, "upload-hook.ts");
const uploadHookMockModulePath = path.resolve(__dirname, 'mocks/upload-hook.ts');
export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: process.env.PAYLOAD_PUBLIC_TITLE_SUFFIX,
    },
    webpack: (config)=>({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          [uploadHookPath]: uploadHookMockModulePath
        }
      }
    })
  },
  globals: [
  ],
  collections: [
    Dists,
    App,
    IPALib,
    APKLib,
    Users,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  cors: "*",
  upload: {
    limits: {
      fileSize: 800000000
    }
  }
});
