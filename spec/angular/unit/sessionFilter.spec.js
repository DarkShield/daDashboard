/**
 * Created by mattjohansen on 6/9/14.
 */
describe('Session Filter', function() {

  beforeEach(module('App.Filters'));

  it('should exist', inject(function(sessionFilter) {
    expect(sessionFilter).not.toBe(undefined);
  }));

  it('should filter out objects based on session only in dstc property', inject(function(sessionFilter) {
    var items = [
      {
        method: 'GET',
        headers: {host : 'test.com'},
        url: '/whatever.php?thing=otherthing',
        body: '',
        remoteIP: '1.2.3.4',
        dstc: '12345'
      },
      {
        method: 'GET',
        headers: {host : 'nottest.com'},
        url: '/whatever.php?thing=otherthing',
        body: '',
        remoteIP: '4.3.2.1',
        dstc: '54321'
      },
      //Make sure it is filtering on specific part of object
      {
        method: 'POST',
        headers: {host : '1.2.3.4'},
        url: '/whatever.php?curveball=12345',
        body: '',
        remoteIP: '9.8.7.6',
        dstc: 'abcdefg'
      }
    ];
    var filtereditems = sessionFilter(items, '12345');

    expect(filtereditems).not.toBe(undefined);
    expect(filtereditems.length).toBe(1);
    expect(filtereditems[0].headers.host).toBe('test.com');
  }));

});