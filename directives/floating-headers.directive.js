;
(function() {
  angular.module('floatingHeaders',[])
    .directive('floatingHeader', ['$window', floatingHeaders])

  function floatingHeaders($window) {
    return function(scope, element, attributes) {
      /* bootstrap ============================================================================== */
      var local = {};
      var opts = scope.$eval(attributes.floatingHeader) || {};
      var cloned = element.clone()

      cloned
        .addClass('floating-header')
        .css({
          position: 'fixed',
          top: 0,
          visibility: 'hidden',
          backgroundColor: opts.bgColor||'white'
        })

      element.after(cloned);

      /* re-initialize on the 'float-header' event ============================================== */
      scope.$on('float-header', init);

      init();

      function init() {
        $TABLE = local.$table = angular.element(element[0].offsetParent);
        local.$cells = element.find('th')
        local.$clonedCells = cloned.find('th');
        local.offsetTop = local.$table[0].offsetTop + (local.$table[0].offsetParent||{}).offsetTop || 0;
        local.isIE = !!element[0].runtimeStyle
        syncWidths();
      }


      /* scroll & resize handler ================================================================ */
      $window.onscroll = $window.onresize = handler

      function handler() {
        var tblHeight = local.$table[0].offsetHeight//+getComputedStyle(local.$table[0]).height.replace('px', '')
        var scrollTop = $window.pageYOffset;
        var inTableRegion = scrollTop > local.offsetTop && scrollTop < local.offsetTop + tblHeight;
        // console.log('local.offsetTop',local.offsetTop)
        syncWidths();
        if (inTableRegion) cloned.css('visibility', 'visible');
        else cloned.css('visibility', 'hidden');
      }

      /* private ================================================================================ */
      function syncWidths() { // The original and the clone have to have their widths in sync
        angular.forEach(local.$clonedCells, function(cell, ix) {
          var computed = COMPUTED = getComputedStyle(local.$cells[ix]);

          if(!local.isIE) {
            cell.style.width = computed.width
          }
          else {
            var width = +computed.width.replace('px', '');
            var paddingLeft = +(computed.paddingLeft.replace('px', '')||0);
            var paddingRight = +(computed.paddingRight.replace('px', '')||0);
            var borderLeftWidth = +(computed.borderLeftWidth.replace('px', '')||0);
            var borderRightWidth = +(computed.borderRightWidth.replace('px', '')||0);
            cell.style.width = width + paddingRight + paddingLeft + borderLeftWidth + borderRightWidth + 'px'
          }


        })
      }

      RESYNC = syncWidths;


    }
    /* ========================================================================================== */
  }
}());
