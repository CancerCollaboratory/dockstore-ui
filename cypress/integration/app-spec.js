
'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('dockstore homepage', function() {

	beforeEach(function () {
		cy.visit("http://localhost:9000");
	});

	it('cy.should - assert that <title> is correct', function() {
		cy.title().should('include', 'Dockstore');
	  // ignoring for now, not working in combination with API display
		//expect(browser.getLocationAbsUrl()).toMatch("/");
	});

  describe('Browse tabs', function() {
	  it('should have tool tab selected', function() {
      cy
        .get(".tool-tab-selected")
          .should("exist")
    });
	  it('should not have workflow tab selected', function() {
      cy
        .get(".workflow-tab-not-selected")
          .should("exist")
    });
  });

  describe('Search box', function() {

  });
});
