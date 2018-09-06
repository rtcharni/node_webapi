const _defaultResponse = {
    error: null,
    data: {},
 };
 
 module.exports = ({ res, status, body, err, redirect }) => {
    if (redirect) {
        return res.redirect(redirect);
    }
    // Set status
    res.status(status || 500);
 
    // Make response
    const resp = {};
    if (body) resp.data = body;
    if (err) resp.error = err;
 
    // Assign to default response
    const respBody = Object.assign({}, _defaultResponse, resp);
 
    // Send response
    res.json(respBody);
 };