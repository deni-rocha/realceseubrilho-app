// src/sw.ts
/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: any[];
};

// Prefetch de todos os arquivos estáticos definidos pelo Workbox
precacheAndRoute(self.__WB_MANIFEST);
