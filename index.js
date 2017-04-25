'use strict';

const fs = require('fs');
const defaultMethods = ['get', 'post', 'patch', 'delete'];
let shownMethods;

function Endpoint(endpointData){
  this.name = endpointData.url;
  this.group = endpointData.group;
  this[endpointData.type] = endpointData.description; //ie, this.post = 'post to this endpoint for ...'
}

function parseEndpoints(endpointArray){
  let groups = {};

  endpointArray.forEach(e =>{
    if(!groups[e.group]) groups[e.group] = {}; //make a group if it doesn't exist

    if(!groups[e.group][e.url]){ //make an endpoint if it doesn't exist
      groups[e.group][e.url] = new Endpoint(e);
    }else{ //if it already exists, then attach a different method to it
      groups[e.group][e.url][e.type] = e.description;  //ie, this.delete = 'delete this model ...'
    }
  });

  return groups;
}

function addGroupRows(groupTitle, columnCount){
  let row = `<tr class="group"><td class="group-name">${groupTitle}</td>`;
  for(let i = 0; i < columnCount; i++){
    row += '<td></td>';
  }
  return row + '</tr>';
}

function addMethodRows(endpoint, methods){
  let row = `<tr><td>${endpoint.name}</td>`;
  methods.forEach(method =>{
    row += `<td class="description">${endpoint[method] || ''}</td>`;
  });
  return row + '</tr>';
}

function addHeaders(methods){
  let row = '<tr><td></td>';
  methods.forEach(method =>{
    row += `<th>${method}</td>`;
  });
  return row + '</tr>';
}

module.exports = function(options, callback){
  if(!options.src) throw new Error('options.src is required by apidoc-summary');
  if(!options.dest) throw new Error('options.dest is required by apidoc-summary');

  if(options.columns && options.columns.length > 0){
    shownMethods = options.columns;
  }else{
    shownMethods = defaultMethods;
  }

  const headers = addHeaders(shownMethods);

  const groups = parseEndpoints(require(options.src));
  let rows = '';

  Object.keys(groups).sort().forEach(groupKey =>{
    rows += addGroupRows(groupKey, shownMethods.length);

    Object.keys(groups[groupKey]).sort().forEach(endpointKey => {
      let endpoint = groups[groupKey][endpointKey];

      rows += addMethodRows(endpoint, shownMethods);
    });
  });

  let content = `
  <html>
  <head>
  <title>apiDoc Summary</title>
  <style>
  table {
    font-family: sans-serif;
    border-collapse: collapse;
  }
  table, td, th {
    border: 1px solid #ccc;
    padding: 4px;
    vertical-align: top;
  }
  table th{
    width: 20%;
    background-color: black;
    color: white;
    font-size: 20px;
    font-family: sans-serif;
    font-weight: lighter;
    text-transform: uppercase;
  }
  table td.description{
    font-size: small;
  }
  table tr.group{
    background-color: aliceblue;
  }
  table td.group-name{
    font-weight: bold;
    text-align: center;
  }
  </style>
  </head>
  <body>
    <table>
      <thead>
        ${headers}
      </thead>
      <tbody>
      ${rows}
      </tbody>
    </table>
  </body>
  </html>
  `;

  fs.writeFile(options.dest, content, function(err) {
    if(err) {
      throw err;
    }
    callback();
  });
};