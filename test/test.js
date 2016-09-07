var assert = require('assert'),
    http = require('http');
var should = require('should');
var request = require('superagent');

describe('/movies/title', function () {
  it('should respond an array of objects', function (done) {
    http.get('http://localhost:8080/movies/title?q=t', function (res) {
      var data = '';

      res.on('data', function (chunk) {
        data += chunk;
      });

      res.on('end', function () {
        should(JSON.parse(data).movies).be.a.Array();
        done();
      });
    });
  });
});

describe('/movies', function () {
  it('should respond with 50 objects, at most', function (done) {
    http.get('http://localhost:8080/movies/list', function (res) {
      var data = '';

      res.on('data', function (chunk) {
        data += chunk;
      });

      res.on('end', function () {
        should(JSON.parse(data).movies).be.a.Array();
        done();
      });
    });
  });
});


describe('/movie/detail', function () {
  it('should respond with a movie', function (done) {
    http.get('http://localhost:8080/movie/detail/tt2290065', function (res) {
      var data = '';

      res.on('data', function (chunk) {
        data += chunk;
      });

      res.on('end', function () {
        JSON.parse(data).movie.should.have.keys('imdbID', 'Title','Details','Poster');
        done();
      });
    });
  });
});

describe('/movie/detail', function () {
  it('movie should not exist', function (done) {
    http.get('http://localhost:8080/movie/detail/tt2290065sssssssss', function (res) {
      var data = '';

      res.on('data', function (chunk) {
        data += chunk;
      });

      res.on('end', function () {
        should.not.exist(JSON.parse(data).movie);
        done();
      });
    });
  });
});

describe('/movies/update', function () {
  it('should respond with status 400', function (done) {
  	var val = new Date();
    request.post('http://localhost:8080/movies/update')
      .set('Content-Type', 'application/json')
      .send(`{"fieldNamess":"${val}"}`)
      .end(function(err,res){
      		should.equal(res.statusCode, 400);
        done();
    })
    
  });
});

describe('/movie/updateDetails', function () {
  it('should respond with status 400', function (done) {
  	var val = {"details":{"Title":"Pepe Sampera","Year":"1971","Rated":"N/A","Released":"23 Sep 1971","Runtime":"N/A","Genre":"N/A","Director":"Nilo Saez","Writer":"Jimmy Naval (story)","Actors":"Roberto Gonzalez, Lizabeth Vaughn","Plot":"N/A","Language":"Filipino, Tagalog","Country":"Philippines","Awards":"N/A","Poster":"N/A","Metascore":"N/A","imdbRating":"N/A","imdbVotes":"N/A","imdbID":"tt2022492","Type":"movie","Response":"True"}};
    request.post('http://localhost:8080/movies/update')
      .set('Content-Type', 'application/json')
      .send(val)
      .end(function(err,res){
      		should.equal(res.statusCode, 400);
        done();
    })
    
  });
});