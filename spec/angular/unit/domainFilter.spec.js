/**
 * Created by mattjohansen on 6/9/14.
 */
describe('Domain Filter', function() {
  var domFilter = null;

  beforeEach(module('App.Filters'));

  it('should filter based on domain', inject(function(domainFilter) {
    expect(domainFilter).not.toBe(undefined);
  }));

});