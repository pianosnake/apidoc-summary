# apiDoc Summary

Generate an HTML summary page from the api_data.json file created by [apiDoc](http://apidocjs.com/). The summary
is a table with HTML methods as columns (GET, POST, PATCH, DELETE) and the grouped endpoints as the rows. The cells
are the descriptions of the endpoints.

![apiDocSummary Example image](example.png "Example table")


Call from gulp like so:

```

const apidocSummary = require('apidoc-summary')

...

gulp.task('apidoc-summary', function(cb){
  apidocSummary({
    src: __dirname + '/public/docs/api_data.json',
    dest: __dirname + '/public/docs/summary.html'
  }, cb);
})
```