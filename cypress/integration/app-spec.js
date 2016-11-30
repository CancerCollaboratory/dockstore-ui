
'use strict'

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */
describe('dockstore homepage', function() {

	beforeEach(function () {
	  // Login by adding user obj and token to local storage
	  localStorage.setItem('dockstore.ui.userObj', '{\"id\": 1, \"username\": \"DockstoreTestUser2\", \"isAdmin\": \"false\", \"name\": \"DockstoreTestUser2\"}')
    localStorage.setItem('satellizer_token', 'fasfsefse')
		cy.visit("http://localhost:9000")
	})

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

//  describe('Search box', function() {
//
//  });

  describe('Navigation', function() {
    it ('My Tools visible', function() {
      cy
        .get('#myToolsNav')
          .should("visible")
    });
    it ('My Workflows visible', function() {
      cy
        .get('#myWorkflowsNav')
          .should("visible")
    });
  });

  describe('Login', function() {

  })
})
