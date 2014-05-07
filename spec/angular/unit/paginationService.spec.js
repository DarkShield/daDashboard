describe('Pagination Service:', function() {
  var pS = null;

  beforeEach(function(){
    angular.mock.module('App');
    angular.mock.module('App.Services');

    inject(function(paginationService) {
      pS = paginationService;
    });
  });

  it('should be registered', function() {
    expect(pS).not.toBe(undefined);
  });

  it('should have maxSize property', function(){
    expect(pS.maxSize).toEqual(10);
  });

  it('should have a itemsPerPage property', function(){
    expect(pS.itemsPerPage).toEqual(10);
  });

  it('should have an init method', function(){
    expect(typeof pS.init).toBe('function');
  });

  it('should have an paginate method', function(){
    expect(typeof pS.paginate).toBe('function');
  });

  describe('init method', function(){
    var controllerScope = null;
    beforeEach(function(){
      controllerScope = {};
    });

    it('should add an items array to the controllers scope', function(){
      expect(controllerScope.items).toBe(undefined);
      controllerScope = pS.init(controllerScope);
      expect(controllerScope.items).not.toBe(undefined);
    });

    it('should add a pagedItems array to the controllers scope', function(){
      expect(controllerScope.pagedItems).toBe(undefined);
      controllerScope = pS.init(controllerScope);
      expect(controllerScope.pagedItems).not.toBe(undefined);
    });

    it('should add a totalItems property to the controllers scope', function(){
      expect(controllerScope.totalItems).toBe(undefined);
      controllerScope = pS.init(controllerScope);
      expect(controllerScope.totalItems).toBe(0);
    });

    it('should add a currentPage property to the controllers scope', function(){
      expect(controllerScope.currentPage).toBe(undefined);
      controllerScope = pS.init(controllerScope);
      expect(controllerScope.currentPage).toBe(1);
    });

    it('should add a correct maxSize property to the controllers scope', function(){
      expect(controllerScope.maxSize).toBe(undefined);
      controllerScope = pS.init(controllerScope);
      expect(controllerScope.maxSize).toEqual(pS.maxSize);
    });

    it('should add a correct defaultItemsPerPage property to the controllers scope', function(){
      expect(controllerScope.defaultItemsPerPage).toBe(undefined);
      controllerScope = pS.init(controllerScope);
      expect(controllerScope.defaultItemsPerPage).toEqual(pS.itemsPerPage);
    });

  });

  describe('paginate method', function(){
      var page = null;

      beforeEach(function(){
        controllerScope = pS.init({});
        getdataSet = function(size){
          var d = [];
          for(var x=0;x<=size-1;x++){
            d.push(x);
          }
          return d
        };
        page = function(number){
          controllerScope.currentPage = number;
          page['size'] = function(size) {
            return pS.paginate(getdataSet(size), controllerScope);
          };
          return page.size
        };
      });

      describe('page1', function(){

        it('should contain the correct number of items', function(){
          expect(page(1)(25).length).toBe(pS.itemsPerPage);
          expect(page(1)(777).length).toBe(pS.itemsPerPage);
        });

        it('should contain the correct first item', function(){
          expect(page(1)(25)[0]).toBe(0);
          expect(page(1)(92)[0]).toBe(0);
        });

        it('should contain the correct last item', function(){
          expect(page(1)(25)[page(1)(25).length - 1]).toBe(pS.itemsPerPage -1);
          expect(page(1)(78)[page(1)(78).length - 1]).toBe(pS.itemsPerPage -1);
        })
      });

    describe('page2', function(){

      it('should contain the correct number of items', function(){
        expect(page(2)(25).length).toBe(pS.itemsPerPage);
        expect(page(2)(777).length).toBe(pS.itemsPerPage);
      });

      it('should contain the correct first item', function(){
        expect(page(2)(25)[0]).toBe(10);
        expect(page(2)(92)[0]).toBe(10);
      });

      it('should contain the correct last item', function(){
        expect(page(2)(25)[page(2)(25).length - 1]).toBe(pS.itemsPerPage *2  -1);
        expect(page(2)(78)[page(2)(78).length - 1]).toBe(pS.itemsPerPage *2  -1);
      })
    });

  });
});

