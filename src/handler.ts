import awsLambdaFastify from '@fastify/aws-lambda';
import { Application } from '@/application';

type Handler = ReturnType<typeof awsLambdaFastify>;

const serverInit: Promise<Handler> = new Application().setupFastifyServerless();

export const handler = async (event, context, callback) => {
  return serverInit.then((server) => server(event, context, callback));
};

module.exports.handler = handler;
