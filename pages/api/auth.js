import axios from "axios";
import { serialize } from "cookie";

export default async function handler(req, res) {
    const { body } = req
    try {
        const user = await axios.post(
            "https://testcrud.fikrisabriansyah.my.id/api/login",
            body
          );
          const serialised = serialize("token", user.data.data.token, {
            httpOnly: false,
            sameSite: "strict",
            maxAge: 60 * 60 * 1,
            path: "/"
          });

          // console.log(user)
        
          res.setHeader("Set-Cookie", serialised);
          res.status(200).json(user.data);
    } catch (error) {
        res.json(user.data)
    }
  
}
