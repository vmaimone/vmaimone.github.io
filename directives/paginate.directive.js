/**
 * slightlty altered version of dirPaginate by Michael Bromley <michael@michaelbromley.co.uk>
 */
;(function() {

    /**
     * Config
     */
    var moduleName = 'paginate';

    /**
     * Module
     */
    var module;
    try {
        module = angular.module(moduleName);
    } catch (err) {
        // named module does not exist, so create one
        module = angular.module(moduleName, []);
    }

    /**
     * This is the public API for the pagination service.
     */
    module.service('$pager', ['paginationService','$filter', function(paginationService,$filter) {
        var i = "__default";
        return Object.create({
            get currentPage() {
                return paginationService.getCurrentPage(i)
            },
            get itemsPerPage() {
                return paginationService.getItemsPerPage(i)
            },
            get pageCount() {
                var pages = Math.ceil(paginationService.getCollectionLength(i) / paginationService.getItemsPerPage(i)) || 1;
                if (this.currentPage > pages) paginationService.setCurrentPage(i, 1);
                return pages
            },
            get size() {
                return paginationService.getCollectionLength(i)
            },
            setCurrentPage: function(val) {
                if (val < 1) val = 1;
                var max = this.pageCount;
                return paginationService.setCurrentPage(i, Math.min(val, max))
            },
            setItemsPerPage: function(val) {
                return paginationService.setItemsPerPage(i, val)
            },
            nextPage: function() {
                return this.setCurrentPage(this.currentPage + 1)
            },
            prevPage: function() {
                return this.setCurrentPage(this.currentPage - 1)
            },
            lastPage: function() {
                return this.setCurrentPage(this.pageCount)
            },
            firstPage: function() {
                return this.setCurrentPage(1)
            },
            get info() {
                var int = $filter('number')
                return 'Page '+int(this.currentPage)+' of '+int(this.pageCount)
            },
            get filtered() {
                return window._FILTERED_||[];
            }


        })

    }]);

    module.filter('itemsPerPage', ['paginationService', function(paginationService) {

        return function(collection, itemsPerPage, paginationId) {
            if (typeof(paginationId) === 'undefined') {
                paginationId = '__default';
            }
            if (!paginationService.isRegistered(paginationId)) {
                throw 'pagination directive: the itemsPerPage id argument (id: ' + paginationId + ') does not match a registered pagination-id.';
            }
            var end;
            var start;
            if (collection instanceof Array) {
                window._FILTERED_ = collection;
                itemsPerPage = parseInt(itemsPerPage) || 9999999999;
                start = (paginationService.getCurrentPage(paginationId) - 1) * itemsPerPage;
                end = start + itemsPerPage;
                paginationService.setItemsPerPage(paginationId, itemsPerPage);
                return collection.slice(start, end);
            } else {
                return collection;
            }
        };
    }]);

    module.directive('paginate', ['$compile', '$parse', '$timeout', 'paginationService', function($compile, $parse, $timeout, paginationService) {

        return {
            terminal: true,
            multiElement: true,
            priority: 5000, // This setting is used in conjunction with the later call to $compile() to prevent infinite recursion of compilation
            compile: function dirPaginationCompileFn(tElement, tAttrs) {

                // Add ng-repeat to the dom element
                if (tElement[0].hasAttribute('dir-paginate-start') || tElement[0].hasAttribute('data-dir-paginate-start')) {
                    // using multiElement mode (dir-paginate-start, dir-paginate-end)
                    tAttrs.$set('ngRepeatStart', tAttrs.paginate);
                    tElement.eq(tElement.length - 1).attr('ng-repeat-end', true);
                } else {
                    tAttrs.$set('ngRepeat', tAttrs.paginate);
                }

                var expression = tAttrs.paginate;
                // regex taken directly from https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js#L211
                var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

                var filterPattern = /\|\s*itemsPerPage\s*:[^|]*/;
                if (match[2].match(filterPattern) === null) {
                    throw 'pagination directive: the \'itemsPerPage\' filter must be set.';
                }
                var itemsPerPageFilterRemoved = match[2].replace(filterPattern, '');
                var collectionGetter = $parse(itemsPerPageFilterRemoved);

                var paginationId = tAttrs.paginationId || '__default';
                paginationService.registerInstance(paginationId);

                return function dirPaginationLinkFn(scope, element, attrs) {
                    var compiled = $compile(element, false, 5000); // we manually compile the element again, as we have now added ng-repeat. Priority less than 5000 prevents infinite recursion of compiling paginate

                    var currentPageGetter;
                    if (attrs.currentPage) {
                        currentPageGetter = $parse(attrs.currentPage);
                    } else {
                        // if the current-page attribute was not set, we'll make our own
                        var defaultCurrentPage = paginationId + '__currentPage';
                        scope[defaultCurrentPage] = 1;
                        currentPageGetter = $parse(defaultCurrentPage);
                    }
                    paginationService.setCurrentPageParser(paginationId, currentPageGetter, scope);

                    scope.$watchCollection(function() {
                        return collectionGetter(scope);
                    }, function(collection) {
                        if (collection) {
                            paginationService.setCollectionLength(paginationId, collection.length);
                        }
                    });

                    // Delegate to the link function returned by the new compilation of the ng-repeat
                    compiled(scope);
                };
            }
        };
    }]);


    module.service('paginationService', function() {

        var instances = {};
        var lastRegisteredInstance;

        this.registerInstance = function(instanceId) {
            if (typeof instances[instanceId] === 'undefined') {
                instances[instanceId] = {
                    asyncMode: false
                };
                lastRegisteredInstance = instanceId;
            }
        };

        this.isRegistered = function(instanceId) {
            return (typeof instances[instanceId] !== 'undefined');
        };

        this.getLastInstanceId = function() {
            return lastRegisteredInstance;
        };

        this.setCurrentPageParser = function(instanceId, val, scope) {
            instances[instanceId].currentPageParser = val;
            instances[instanceId].context = scope;
        };
        this.setCurrentPage = function(instanceId, val) {
            instances[instanceId].currentPageParser.assign(instances[instanceId].context, val);
        };
        this.getCurrentPage = function(instanceId) {
            var parser = instances[instanceId].currentPageParser;
            return parser ? parser(instances[instanceId].context) : 1;
        };

        this.setItemsPerPage = function(instanceId, val) {
            instances[instanceId].itemsPerPage = val;
        };
        this.getItemsPerPage = function(instanceId) {
            return instances[instanceId].itemsPerPage;
        };

        this.setCollectionLength = function(instanceId, val) {
            instances[instanceId].collectionLength = val;
        };
        this.getCollectionLength = function(instanceId) {
            return instances[instanceId].collectionLength;
        };

    });




})();
