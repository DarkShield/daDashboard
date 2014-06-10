/**
 * Created by mattjohansen on 6/9/14.
 */
describe('Attack Filter', function() {

  beforeEach(module('App.Filters'));

  it('should exist', inject(function(attackFilter) {
    expect(attackFilter).not.toBe(undefined);
  }));

});