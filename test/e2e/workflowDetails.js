
'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

var page = function(){
  this.button = element(by.id("editButton"));
};


describe('Dockstore Workflow Details', function() {
  var Page = new page();

	beforeEach(function () {
    browser.ignoreSynchronization = true;
		browser.get('workflows/DockstoreTestUser/hello-dockstore-workflow');
	});

	it('should not have Edit button', function() {
    expect(Page.button.isPresent()).toBe(false);
	});
});
