import express from 'express';

const router = express.Router();

/* GET index page. */
router.get('/', (req, res) => {
<% if(options.viewEngine !== 'none'){ %>  res.render('index',<% } else { %>  res.json({<% } %>
    title: 'Express'
  });
});

export default router;
