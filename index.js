'use strict';

const fs = require('fs');
const path = require('path');

function Endpoint(name, group){
  this.name = name;
  this.group = group;
  this.get = '';
  this.post = '';
  this.patch = '';
  this.delete = '';
}

module.exports = function(options, callback){
  if(!options.src) throw new Error('options.src is required by apidoc-summary');
  if(!options.dest) throw new Error('options.dest is required by apidoc-summary');

  const endpointArray = require(options.src);

  let groups = {};
  let rows = '';

  endpointArray.forEach(e =>{
    if(e.type === 'info') return;
    if(!groups[e.group]) groups[e.group] = {};

    if(!groups[e.group][e.url]){
      groups[e.group][e.url] = new Endpoint(e.url, e.group);
    }
    groups[e.group][e.url][e.type] = e.description;
  });

  Object.keys(groups).sort().forEach(group =>{
    rows += `<tr class="separator"><td class="group-name">${group}</td><td></td><td></td><td></td><td></td></tr>`;

    Object.keys(groups[group]).sort().forEach(key => {
      let endpoint = groups[group][key];
      rows += `
    <tr>
      <td>${endpoint.name}</td>
      <td class="description">${endpoint.get}</td>
      <td class="description">${endpoint.post}</td>
      <td class="description">${endpoint.patch}</td>
      <td class="description">${endpoint.delete}</td>
    </tr>`;
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
  }
  table td.description{
    font-size: small;
  }
  table tr.separator{
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
        <tr>
          <td></td>
          <th>GET</th>
          <th>POST</th>
          <th>PATCH</th>
          <th>DELETE</th>
        </tr>
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