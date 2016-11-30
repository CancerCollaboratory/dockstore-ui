
describe('Dockstore my tools', function() {

	beforeEach(function () {
	  // Login by adding user obj and token to local storage
	  localStorage.setItem('dockstore.ui.userObj', '{\"id\": 1, \"username\": \"DockstoreTestUser2\", \"isAdmin\": \"false\", \"name\": \"DockstoreTestUser2\"}')
    localStorage.setItem('satellizer_token', 'fasfsefse')
     cy.visit("http://localhost:9000/my-containers")
  });

  describe('publish a tool', function() {
    it('Invalid tool should not be publishable', function() {
      cy
        .get('#publishButton')
        .should('be.disabled')
    });

    it("publish and unpublish", function() {
      cy
        .get('.panel-group')
          .children(':nth-child(2)')
          .click()
          .children(':nth-child(2)')
          .find('a')
          .first()
          .click()
          .get('#publishButton')
          .should('contain', 'Unpublish')
          .click()
          .should('contain', 'Publish')
          .click()
          .should('contain', 'Unpublish')

    });
  });
});
