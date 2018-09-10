"use strict";

var _chai = _interopRequireWildcard(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

_chai.default.use(_chaiHttp.default);

describe('Http Server Routes', function () {
  let host;
  before(async function (done) {
    const url = `mongodb://${credentials.mongoUsername}:${credentials.mongoPassword}@ds239692.mlab.com:39692/slack_clone`;
    await mongoose.connect(url, {
      useNewUrlParser: true
    });
    app.set('PORT', process.env.port || 5000);
    let port = app.get('PORT');
    const server = await http.createServer(app);
    await server.listen(port);
    host = `http://localhost:${port}`;
    done();
  });
  describe('Test#1: Testing User Creation/Login', function () {
    it('');
    before(function (done) {
      _chai.default.request(host).post('/user/createUser').type('json').send({
        'username': 'Cinefiled',
        'password': '123password1',
        'email': 'email@gmail.com'
      }).end(function (err, res) {
        (0, _chai.expect)(err).to.be.null;
        (0, _chai.expect)(res).to.have.status(200);
      });

      done();
    });
  });
});