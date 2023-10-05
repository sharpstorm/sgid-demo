import { Express } from 'express';
import { ServerConfig } from './types';
import SgidClient, { generatePkcePair } from '@opengovsg/sgid-client';
import { nanoid } from 'nanoid';
import path from 'path';

type LoginSession = {
  codeChallenge: string;
  codeVerifier: string;
  nonce: string | undefined;
};

const activeLogins = new Map<string, LoginSession>();

export function setupRoutes(server: Express, serverConfig: ServerConfig) {
  const sgidClient = new SgidClient({
    clientId: serverConfig.sgidClientId,
    clientSecret: serverConfig.sgidClientSecret,
    privateKey: serverConfig.sgidPrivateKey,
    redirectUri: `http://${serverConfig.host}/callback`,
  });

  server.get('/', (req, resp) => {
    resp.sendFile(path.join(__dirname, 'frontend/index.html'));
  });

  server.get('/login', async (req, resp) => {
    const { codeChallenge, codeVerifier } = generatePkcePair();
    const { url, nonce } = sgidClient.authorizationUrl({
      codeChallenge,
    });

    const sid = nanoid();
    activeLogins.set(sid, {
      codeChallenge,
      codeVerifier,
      nonce,
    });

    resp.cookie('sid', sid, {
      httpOnly: true,
      signed: true,
      secure: false,
      maxAge: 180000, // 3 mins
      path: '/',
    });
    resp.redirect(307, url);
  });

  server.get('/callback', async (req, resp) => {
    if (!('sid' in req.signedCookies)) {
      resp.status(403).send();
      return;
    }

    if (!('code' in req.query)) {
      resp.status(400).send();
      return;
    }

    const data = activeLogins.get(req.signedCookies.sid);
    if (!data) {
      resp.status(403).send();
      return;
    }

    const { codeVerifier, nonce } = data;

    const code = req.query.code as string;
    const { accessToken, sub } = await sgidClient.callback({
      code,
      codeVerifier,
      nonce,
    });

    const userinfo = await sgidClient.userinfo({
      accessToken,
      sub,
    });

    console.log(userinfo);
    resp.send({
      name: userinfo.data['myinfo.name'],
    });
  });
}
