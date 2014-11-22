/**
 * Created by mattjohansen on 6/9/14.
 */
describe('Attack Filter', function() {

  var items = [
    {
      method: 'GET',
      headers: {host : 'test.com'},
      url: '/whatever.php?thing=otherthing',
      body: '',
      attack: 'false',
      attacks: []
    },
    {
      method: 'GET',
      headers: {host : 'xsstest.com'},
      url: '/whatever.php?thing=otherthing',
      body: '',
      attack: 'true',
      attacks: [{type: 'XSS'}, {type: 'dirTrav'}]
    },
    //Make sure it is filtering on specific part of object
    {
      method: 'POST',
      headers: {host : 'nottest.com'},
      url: '/whatever.php?curveball=XSS',
      body: '',
      attack: 'true',
      attacks: [{type: 'SQLi'}, {type: 'RCE'}]
    }
  ];

  beforeEach(module('App.Filters'));

  it('should exist', inject(function(attackFilter) {
    expect(attackFilter).not.toBe(undefined);
  }));

  it('should filter out all attacks when type is Attacks', inject(function(attackFilter) {
    var filtereditems = attackFilter(items, 'Attacks');

    expect(filtereditems).not.toBe(undefined);
    expect(filtereditems.length).toBe(2);
  }));

  it('should filter out XSS attacks when type is XSS', inject(function(attackFilter) {
    var filtereditems = attackFilter(items, 'XSS');

    expect(filtereditems).not.toBe(undefined);
    expect(filtereditems.length).toBe(1);
    expect(filtereditems[0].headers.host).toBe('xsstest.com');
  }));

  it('should filter out RCE attacks when type is Remote Code Execution', inject(function(attackFilter) {
    var filtereditems = attackFilter(items, 'Remote Code Execution');

    expect(filtereditems).not.toBe(undefined);
    expect(filtereditems.length).toBe(1);
    expect(filtereditems[0].headers.host).toBe('nottest.com');
  }));

  it('should filter out SQLi attacks when type is SQLi', inject(function(attackFilter) {
    var filtereditems = attackFilter(items, 'SQLi');

    expect(filtereditems).not.toBe(undefined);
    expect(filtereditems.length).toBe(1);
    expect(filtereditems[0].headers.host).toBe('nottest.com');
  }));

  it('should filter out dirTrav attacks when type is Directory Traversal', inject(function(attackFilter) {
    var filtereditems = attackFilter(items, 'Directory Traversal');

    expect(filtereditems).not.toBe(undefined);
    expect(filtereditems.length).toBe(1);
    expect(filtereditems[0].headers.host).toBe('xsstest.com');
  }));

});