import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'teste3',
  webDir: 'build',
  server: {
    androidScheme: 'http'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  }
};

export default config;
