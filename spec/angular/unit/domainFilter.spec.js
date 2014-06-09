/**
 * Created by mattjohansen on 6/9/14.
 */
describe('Domain Filter', function() {
  var domFilter = null;

  beforeEach(function() {
    angular.mock.module('App');
    angular.mock.module('App.Filters');

    inject(function(domainFilter) {
      domFilter = domainFilter;
    });
  });

  it('should filter based on domain', function() {
    expect(domFilter).not.toBe(undefined);
  });

});