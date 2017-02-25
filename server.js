var express = require( "express" );
var app = express();
app.use( express.static( "./" ) );
app.listen( 3000, () =>
{
  console.log( "Test web server listening on port 3000!" );
} );