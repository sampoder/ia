/* This is an API route used for previewing emails
sent by the program. */

function replaceAll(str, find, replace) {
  return str.split(find).join(replace)
}

export default async function handler(req, res) {
  let site = await fetch(`https://ethereal.email/message/${req.query.id}`).then(
    (r) => r.text()
  );
  site = replaceAll(site, 'src="/', 'src="https://ethereal.email/');
  site = replaceAll(site, 'href="/', 'href="https://ethereal.email/');
  site = replaceAll(
    site,
    `<head>`,
    `<head>
      <style>
      .navbar {
        display: none!important;
      }
      #doorbell-button  {
        display: none!important;
      }
      .footer {
        display: none!important;
      }
      </style>  
      <title>Email Preview (debate.sh)</title>
    `
  );

  res.send(site);
}
