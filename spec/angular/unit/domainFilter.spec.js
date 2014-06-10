/**
 * Created by mattjohansen on 6/9/14.
 */
describe('Domain Filter', function() {

  beforeEach(module('App.Filters'));

  it('should exist', inject(function(domainFilter) {
    expect(domainFilter).not.toBe(undefined);
  }));

  it('should filter out object based on domain only in host header', inject(function(domainFilter) {
    var items = [
      {
        method: 'GET',
        headers: {host : 'test.com'},
        url: '/whatever.php?thing=otherthing',
        body: ''
      },
      {
        method: 'GET',
        headers: {host : 'nottest.com'},
        url: '/whatever.php?thing=otherthing',
        body: ''
      },
      //Make sure it is filtering on specific part of object
      {
        method: 'POST',
        headers: {host : 'nottest.com'},
        url: '/whatever.php?curveball=test.com',
        body: ''
      }
    ];
    var filtereditems = domainFilter(items, 'test.com');

    expect(filtereditems).not.toBe(undefined);
    expect(filtereditems.length).toBe(1);
    expect(filtereditems[0].headers.host).toBe('test.com');
  }));

});