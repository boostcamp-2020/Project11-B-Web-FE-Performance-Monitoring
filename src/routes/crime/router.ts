import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controller: any = await controllers();

  // get
  router.get('/crimes/:issueId', controller.getCrimes);
  router.get('/crime/:crimeId', controller.getCrime);
  router.get('/crime/:projectId/visits/month', controller.getMonthVisits);
  router.get('/crime/:projectId/visits/year', controller.getYearVisits);

  // post
  router.post('/crime/:projectId', controller.addCrime);
  router.post('/crime/:projectId/visits', controller.addVisits);

  /**
   * @WARNING
   * @개발용
   * 전체 데이터 삭제 API
   */
  router.post('/dev/issues', controller.devAddIssues);
  router.delete('/dev/issues', controller.devDeleteIssues);

  return router;
};
