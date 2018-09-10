import {expect} from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

describe('Http Server Routes', function() {
    let host;
    before( async function(done) {
        const url = `mongodb://${credentials.mongoUsername}:${credentials.mongoPassword}@ds239692.mlab.com:39692/slack_clone`;
        await mongoose.connect(url, {useNewUrlParser: true});
        app.set('PORT', process.env.port || 5000);
        let port = app.get('PORT');
        const server = await http.createServer(app);
        await server.listen(port);
        host = `http://localhost:${port}`;
        done();
    });
    describe('Test#1: Testing User Creation/Login', function() {
        it('')
        before(function(done) {
            chai
                .request(host)
                .post('/user/createUser')
                .type('json')
                .send({
                    'username': 'Cinefiled',
                    'password': '123password1',
                    'email': 'email@gmail.com',
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                });
            done();
        });
    })
});