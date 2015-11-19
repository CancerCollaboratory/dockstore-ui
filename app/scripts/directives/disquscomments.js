'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:disqusComments
 * @description
 * # disqusComments
 */
angular.module('dockstore.ui')
  .directive('disqusComments', function () {
    return {
      template: '<div id="disqus_thread"></div>',
      restrict: 'AE',
      link: function postLink(scope, element, attrs) {console.log();
        /**
        * RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
        * LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
        */
        
        var disqus_config = function () {
          this.page.url = window.location.href; // Replace PAGE_URL with your page's canonical URL variable
          //this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };
        
        (function() { // DON'T EDIT BELOW THIS LINE
          var d = document, s = d.createElement('script');

          s.src = '//dockstoreorg.disqus.com/embed.js';

          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
        })();
      }
    };
  });