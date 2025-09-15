import { Application } from './application';

(async () => {
  const app = new Application();
  await app.bootstrapNest();
  app.nestApp.listen(process.env.PORT || 3000);
})();
