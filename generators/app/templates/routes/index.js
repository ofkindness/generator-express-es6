const { Router } = require('express');

const router = Router();

/* GET index page. */
router.get('/', (req, res) => {
<% if(options.viewEngine !== 'none'){ %>  res.render('index', {<% } else { %>  res.json({<% } %>
    title: 'Express'
  });
});

module.exports = router;
