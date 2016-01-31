describe('Summary', () => {
	beforeEach(() => {
		MK.Router.hash.url = MK.Router.history.url = '';
	});

	it('has correct instances', () => {
		expect(MK.Router.hash instanceof MK.Router).toBeTruthy();
		expect(MK.Router.history instanceof MK.Router).toBeTruthy();

		expect(MK.Router.hash.type).toEqual('hash');
		expect(MK.Router.history.type).toBeTruthy('history');
	});

	it('allows to subscribe via static method', done => {
		var obj = {
			a: 'foo',
			b: 'bar',
			c: 'baz'
		};

		MK.initRouter(obj, '/a/b/c/');

		expect(MK.Router.hash.url).toEqual('/foo/bar/baz/');

		setTimeout(() => {
			expect(document.location.hash).toEqual('#!/foo/bar/baz/');
			done();
		}, 50);

	});

	it('allows to subscribe via instance method', done => {
		var mk = new MK();

		mk.set({
			a: 'mfoo',
			b: 'mbar',
			c: 'mbaz'
		});

		mk.initRouter('/a/b/c/');

		expect(MK.Router.hash.url).toEqual('/mfoo/mbar/mbaz/');

		setTimeout(() => {
			expect(document.location.hash).toEqual('#!/mfoo/mbar/mbaz/');
			done();
		}, 50);
	});

	it(`doesn't make collisions when an object subscribes to both hash and history router`, done => {
		var mk = new MK();
		mk.set({
			a: 'cfoo',
			b: 'cbar',
			c: 'cbaz',
			d: 'cqux',
			e: 'cpoo',
			f: 'czum'
		});

		mk.initRouter('/a/b/c/');
		mk.initRouter('/d/e/f/', 'history');

		expect(MK.Router.hash.url).toEqual('/cfoo/cbar/cbaz/');
		expect(MK.Router.history.url).toEqual('/cqux/cpoo/czum/');

		setTimeout(() => {
			expect(document.location.hash).toEqual('#!/cfoo/cbar/cbaz/');
			expect(document.location.pathname).toEqual('/cqux/cpoo/czum/');
			done();
		}, 50);
	});

	it('allows to walk thru the history via hash router', () => {
		var mk = new MK();

		mk.set({
			a: 'wfoo',
			b: 'wbar',
			c: 'wbaz'
		});

		mk.initRouter('/a/b/c/');

		setTimeout(() => {
			expect(document.location.hash).toEqual('#!/wfoo/wbar/wbaz/');
			mk.a = 'wzoo';

			setTimeout(() => {
				expect(document.location.hash).toEqual('#!/wzoo/wbar/wbaz/');
				expect(mk.a).toEqual('wzoo');
				history.back();

				expect(document.location.hash).toEqual('#!/wfoo/wbar/wbaz/');

				expect(mk.a).toEqual('wfoo');
				done();
			}, 50);
		}, 50);
	});

	it('allows to walk thru the history via history router', () => {
		var mk = new MK();

		mk.set({
			a: 'wqux',
			b: 'wpoo',
			c: 'wzum'
		});

		mk.initRouter('/a/b/c/', 'history');

		setTimeout(() => {
			expect(document.location.pathname).toEqual('/wfoo/wbar/wbaz/');
			mk.a = 'wzoo';

			setTimeout(() => {
				expect(document.location.pathname).toEqual('/wzoo/wbar/wbaz/');
				expect(mk.a).toEqual('wzoo');
				history.back();

				expect(document.location.pathname).toEqual('/wfoo/wbar/wbaz/');

				expect(mk.a).toEqual('wfoo');
				done();
			}, 50);
		}, 50);
	});
});