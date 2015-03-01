describe("simple-console", function () {
  describe("no logger", function () {
    // Track if bind is not available for certain platforms.
    var noBind = !Function.prototype.bind,
      conStub,
      con;

    beforeEach(function () {
      // By default, returns `undefined`.
      conStub = sinon.stub(SimpleConsole.prototype, "_getConsole");
      con = new SimpleConsole();
    });

    afterEach(function () {
      conStub.restore();
    });

    it("should invoke lots of functions and not die", function () {
      con.log("log");
      con.log.apply(con, ["log apply"]);
      con.log.call(con, "log call");
      con.warn("warn");
      con.warn.apply(con, ["warn apply"]);
      con.warn.call(con, "warn call");
      con.error("error");
      con.error.apply(con, ["error apply"]);
      con.error.call(con, "error call");
    });

    it("should handle swap between warn or log", function () {
      // Short-circuit: need bind.
      if (noBind) { return; }

      // This is a very common use case for logging.
      // See, e.g.: https://github.com/FormidableLabs/biff/issues/3
      var warn = (con.warn || con.log).bind(console);

      warn("warn");
      warn.apply(con, ["warn apply"]);
      warn.call(con, "warn call");
    });
  });

  describe("sinkhole logger", function () {
    it("should sinkhole with null", function () {
      var con = new SimpleConsole(null);

      con.log("log");
      con.log.apply(con, ["log apply"]);
      con.log.call(con, "log call");
      con.warn("warn");
      con.warn.apply(con, ["warn apply"]);
      con.warn.call(con, "warn call");
      con.error("error");
      con.error.apply(con, ["error apply"]);
      con.error.call(con, "error call");
    });

    it("should sinkhole with empty object", function () {
      var con = new SimpleConsole({});

      con.log("log");
      con.log.apply(con, ["log apply"]);
      con.log.call(con, "log call");
      con.warn("warn");
      con.warn.apply(con, ["warn apply"]);
      con.warn.call(con, "warn call");
      con.error("error");
      con.error.apply(con, ["error apply"]);
      con.error.call(con, "error call");
    });
  });

  // These specs will log out to console.
  // This is generally disfavored in tests, but we're _testing_ a logger
  // and want to have things blow up if anything is wrong.
  describe("actually log out", function () {
    describe("no function bind", function () {
      var bindStub,
        con;

      beforeEach(function () {
        // By default, returns `undefined`.
        bindStub = sinon.stub(SimpleConsole.prototype, "_getBind");
        con = new SimpleConsole();
      });

      afterEach(function () {
        bindStub.restore();
      });

      it("should invoke lots of functions and not die", function () {
        con.log("log");
        con.log.apply(con, ["log apply"]);
        con.log.call(con, "log call");
        con.warn("warn");
        con.warn.apply(con, ["warn apply"]);
        con.warn.call(con, "warn call");
        con.error("error");
        con.error.apply(con, ["error apply"]);
        con.error.call(con, "error call");
      });
    });

    describe("native functionality", function () {
      var con;

      beforeEach(function () {
        con = new SimpleConsole();
      });

      it("should invoke lots of functions and maybe log", function () {
        con.log("log");
        con.log.apply(con, ["log apply"]);
        con.log.call(con, "log call");
        con.warn("warn");
        con.warn.apply(con, ["warn apply"]);
        con.warn.call(con, "warn call");
        con.error("error");
        con.error.apply(con, ["error apply"]);
        con.error.call(con, "error call");
      });
    });

    // **NOTE**: This test should come last because we can't really _undo_
    // all the stuff we're doing...
    describe("monkey patch real console", function () {

      beforeEach(function () {
        // Implicit: `window.console`
        window.console = SimpleConsole.patch();
      });

      it("should invoke lots of functions and maybe log", function () {
        window.console.log("log");
        window.console.log.apply(window.console, ["log apply"]);
        window.console.log.call(window.console, "log call");
        window.console.warn("warn");
        window.console.warn.apply(window.console, ["warn apply"]);
        window.console.warn.call(window.console, "warn call");
        window.console.error("error");
        window.console.error.apply(window.console, ["error apply"]);
        window.console.error.call(window.console, "error call");
      });
    });

    // **NOTE**: `console` is pretty much unusable past this point because
    // we've now overwritten it with something that noop's all operations.
    describe("monkey patch with empty object", function () {

      beforeEach(function () {
        // Explicit: Empty object.
        window.console = SimpleConsole.patch({});
      });

      it("should invoke lots of functions and maybe log", function () {
        window.console.log("log");
        window.console.log.apply(window.console, ["log apply"]);
        window.console.log.call(window.console, "log call");
        window.console.warn("warn");
        window.console.warn.apply(window.console, ["warn apply"]);
        window.console.warn.call(window.console, "warn call");
        window.console.error("error");
        window.console.error.apply(window.console, ["error apply"]);
        window.console.error.call(window.console, "error call");
      });
    });
  });
});
