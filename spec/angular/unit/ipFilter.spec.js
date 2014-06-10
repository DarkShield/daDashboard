/**
 * Created by mattjohansen on 6/9/14.
 */
describe('IP Filter', function() {

  beforeEach(module('App.Filters'));

  it('should exist', inject(function(ipFilter) {
    expect(ipFilter).not.toBe(undefined);
  }));

  it('should filter out objects based on IP only in remoteIP property', inject(function(ipFilter) {
    var items = [
      {
        method: 'GET',
        headers: {host : 'test.com'},
        url: '/whatever.php?thing=otherthing',
        body: '',
        remoteIP: '1.2.3.4'
      },
      {
        method: 'GET',
        headers: {host : 'nottest.com'},
        url: '/whatever.php?thing=otherthing',
        body: '',
        remoteIP: '4.3.2.1'
      },
      //Make sure it is filtering on specific part of object
      {
        method: 'POST',
        headers: {host : '1.2.3.4'},
        url: '/whatever.php?curveball=1.2.3.4',
        body: '',
        remoteIP: '9.8.7.6'
      }
    ];
    var filtereditems = ipFilter(items, '1.2.3.4');

    expect(filtereditems).not.toBe(undefined);
    expect(filtereditems.length).toBe(1);
    expect(filtereditems[0].headers.host).toBe('test.com');
  }));

});