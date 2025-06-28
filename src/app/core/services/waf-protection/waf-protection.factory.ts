// src/app/app-initializer.ts

import { WafProtectionService } from './waf-protection.service';

export const initializeWaf = (wafProtectionService: WafProtectionService): () => Promise<void> => {
  return (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        wafProtectionService.loadScript();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };
}
