import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'onekana-digital-attendance',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      'android-minSdkVersion': '22',
      'android-targetSdkVersion': '31',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '500',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '4000',
      ShowSplashScreenSpinner: 'false',
      AutoHideSplashScreen: 'true',
      ShowSplashScreen: 'true',
      FadeSplashScreen: 'true'
    }
  }
};

export default config;
