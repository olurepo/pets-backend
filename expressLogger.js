const Winston = require('winston');
const expressWinston = require('express-winston');

const { Express, Request, Response } = require('express');
const transports = [new Winston.transports.Console()];

const { combine, json, timestamp, label } = Winston.format;
const logger = Winston.createLogger({
  format: combine(label({ label: 'sbx-info' }), timestamp(), json()),
  transports,
});
const addExpressLogger = (app) => {
  app.use(
    expressWinston.logger({
      dynamicMeta: (
        req,
        res
      ) => {
        const httpRequest = {};
        const meta = {};
        if (req) {
          meta.httpRequest = httpRequest;
          // @ts-ignore
          meta.userId = req.user?._id;
          meta.graphql = {
            query: req.body.query,
            operationName: req.body.operationName,
          };
          httpRequest.requestMethod = req.method;
          httpRequest.requestUrl = `${req.protocol}://${req.get('host')}${
            req.originalUrl
          }`;
          httpRequest.protocol = `HTTP/${req.httpVersion}`;
          // httpRequest.remoteIp = req.ip // this includes both ipv6 and ipv4 addresses separated by ':'
          if (req.ip) {
            httpRequest.remoteIp = req.ip.includes(':')
              ? req.ip.slice(Math.max(0, req.ip.lastIndexOf(':') + 1))
              : req.ip;
          }
          httpRequest.requestSize = req.socket.bytesRead;
          httpRequest.userAgent = req.get('User-Agent');
          httpRequest.referrer = req.get('Referrer');
        }

        if (res) {
          meta.httpRequest = httpRequest;
          httpRequest.status = res.statusCode;
          if (res.responseTime) {
            httpRequest.latency = {
              seconds: Math.floor(res.responseTime / 1000),
              nanos: (res.responseTime % 1000) * 1000000,
            };
          }
          if (res.body) {
            if (typeof res.body === 'object') {
              httpRequest.responseSize = JSON.stringify(res.body).length;
            } else if (typeof res.body === 'string') {
              httpRequest.responseSize = res.body.length;
            }
          }
        }
        return meta;
      },
      transports: [new Winston.transports.Console()],
      headerBlacklist: ['authorization', 'cookie'],
      format: combine(label({ label: 'sbx-expr' }), timestamp(), json()),
      meta: true,
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      ignoreRoute: function () {
        return false;
      },
    })
  );
};

module.exports = {
    addExpressLogger,
    logger
}