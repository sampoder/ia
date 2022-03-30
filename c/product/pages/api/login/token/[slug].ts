import type { NextApiRequest, NextApiResponse } from "next";
import { Token } from '../../../../lib/classes'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let { slug } = req.query
    let token = new Token(slug.toString());
    await token.loadFromDB()
    if(token.checkValid()){
      res.setHeader('set-cookie', `auth=${token.id}; Max-Age=604800; Path=/`)
      res.status(200).json({authenticated: true});
    }
    else{
      res.status(401).json({authenticated: false});
    }
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
}